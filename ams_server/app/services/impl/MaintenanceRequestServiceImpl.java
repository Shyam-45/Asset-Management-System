package services.impl;

import dtos.maintenance.CreateMaintenanceRequest;
import dtos.maintenance.MaintenanceResponse;
import enums.AssetStatus;
import enums.MaintenanceStatus;
import enums.RoleType;
import exceptions.BadRequestException;
import exceptions.ForbiddenException;
import exceptions.NotFoundException;
import io.ebean.annotation.Transactional;
import mappers.MaintenanceMapper;
import models.Asset;
import models.AssetAssignment;
import models.MaintenanceRequest;
import models.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import repositories.AssetAssignmentRepository;
import repositories.AssetRepository;
import repositories.MaintenanceRequestRepository;
import repositories.UserRepository;
import scala.reflect.internal.Trees;
import services.MaintenanceRequestService;
import utils.MaintenanceStatusUtil;

import javax.inject.Inject;
import javax.inject.Singleton;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Singleton
public class MaintenanceRequestServiceImpl implements MaintenanceRequestService {

    private final MaintenanceRequestRepository repository;
    private final AssetRepository assetRepository;
    private final UserRepository userRepository;
    private final AssetAssignmentRepository assignmentRepository;

    private static final Logger logger = LoggerFactory.getLogger(MaintenanceRequestServiceImpl.class);

    @Inject
    public MaintenanceRequestServiceImpl(MaintenanceRequestRepository repository, AssetRepository assetRepository, UserRepository userRepository, AssetAssignmentRepository assignmentRepository) {
        this.repository = repository;
        this.assetRepository = assetRepository;
        this.userRepository = userRepository;
        this.assignmentRepository = assignmentRepository;
    }

    @Override
    @Transactional
    public MaintenanceResponse create(CreateMaintenanceRequest dto, Long userId) {

        if (dto.getAssetId() == null) {
            throw new BadRequestException("Asset id is required");
        }

        if (dto.getDescription() == null || dto.getDescription().trim().isEmpty()) {
            throw new BadRequestException("Description is required");
        }

        Asset asset = assetRepository.findById(dto.getAssetId());

        if (asset == null || !asset.getIsActive()) {
            throw new NotFoundException("Asset not found");
        }

        User user = userRepository.findById(userId);

        if (user == null || !user.getIsActive()) {
            throw new NotFoundException("User not found");
        }

        AssetAssignment assignment = assignmentRepository.findActiveByAssetId(asset.getId());

        if (assignment == null) {
            throw new BadRequestException("Asset is not assigned");
        }

        if (!assignment.getUser().getId().equals(user.getId())) {
            throw new ForbiddenException("Access denied");
        }

        MaintenanceRequest existing = repository.findOpenByAssetId(asset.getId());

        if (existing != null) {
            throw new BadRequestException("Open maintenance request already exists");
        }

        MaintenanceRequest request = new MaintenanceRequest();
        request.setAsset(asset);
        request.setUser(user);
        request.setDescription(dto.getDescription().trim());
        request.setStatus(MaintenanceStatus.PENDING);

        repository.save(request);

        logger.info("Maintenance request created successfully. requestId={}, assetId={}, assetCode={}, requestedByUserId={}", request.getId(), asset.getId(), asset.getAssetCode(), user.getId());

        if (user.getRole() == RoleType.MANAGER) {
            return approve(request.getId(), user.getId());
        }

        return MaintenanceMapper.toResponse(request);
    }

    @Override
    @Transactional
    public MaintenanceResponse approve(Long requestId, Long managerId) {

        MaintenanceRequest request = repository.findActiveById(requestId);

        if (request == null) {
            throw new NotFoundException("Maintenance request not found");
        }

        if (request.getStatus() != MaintenanceStatus.PENDING) {
            throw new BadRequestException("Only pending requests can be approved");
        }

        User manager = userRepository.findById(managerId);
        if (manager == null || !manager.getIsActive()) {
            throw new NotFoundException("Manager not found");
        }
        if (manager.getRole() != RoleType.MANAGER) {
            throw new ForbiddenException("Access denied");
        }

        if (!manager.getDepartment().getId().equals(request.getUser().getDepartment().getId())) {
            throw new ForbiddenException("Access denied");
        }

        request.setStatus(MaintenanceStatus.IN_PROGRESS);
        request.setApprovedBy(manager);
        request.setApprovedAt(LocalDateTime.now());
        repository.update(request);

        Asset asset = request.getAsset();
        asset.setStatus(AssetStatus.MAINTENANCE);
        assetRepository.update(asset);

        logger.info("Maintenance request approved successfully. requestId={}, assetId={}, assetCode={}, approvedByManagerId={}", request.getId(), asset.getId(), asset.getAssetCode(), manager.getId());

        return MaintenanceMapper.toResponse(request);
    }

    @Override
    @Transactional
    public MaintenanceResponse reject(Long requestId, Long managerId) {

        MaintenanceRequest request = repository.findActiveById(requestId);

        if (request == null) {
            throw new NotFoundException("Maintenance request not found");
        }

        if (request.getStatus() != MaintenanceStatus.PENDING) {

            throw new BadRequestException("Only pending requests can be rejected");
        }

        User manager = userRepository.findById(managerId);

        if (manager == null || !manager.getIsActive()) {

            throw new NotFoundException("Manager not found");
        }

        if (manager.getRole() != RoleType.MANAGER) {
            throw new ForbiddenException("Access denied");
        }

        if (!manager.getDepartment().getId().equals(request.getUser().getDepartment().getId())) {
            throw new ForbiddenException("Access denied");
        }

        request.setStatus(MaintenanceStatus.REJECTED);
        request.setApprovedBy(manager);
        request.setApprovedAt(LocalDateTime.now());

        repository.update(request);

        logger.info("Maintenance request rejected successfully. requestId={}, assetId={}, assetCode={}, rejectedByManagerId={}", request.getId(), request.getAsset().getId(), request.getAsset().getAssetCode(), manager.getId());

        return MaintenanceMapper.toResponse(request);
    }

    @Override
    @Transactional
    public MaintenanceResponse resolve(Long requestId, Long adminId) {

        MaintenanceRequest request = repository.findActiveById(requestId);

        if (request == null) {
            throw new NotFoundException("Maintenance request not found");
        }

        if (request.getStatus() != MaintenanceStatus.IN_PROGRESS) {
            throw new BadRequestException("Only in-progress requests can be resolved");
        }

        User admin = userRepository.findById(adminId);

        if (admin == null || !admin.getIsActive()) {

            throw new NotFoundException("Admin not found");
        }

        if (admin.getRole() != RoleType.ADMIN) {
            throw new ForbiddenException("Access denied");
        }

        request.setStatus(MaintenanceStatus.RESOLVED);
        request.setResolvedAt(LocalDateTime.now());

        repository.update(request);

        Asset asset = request.getAsset();
        asset.setStatus(AssetStatus.ASSIGNED);

        assetRepository.update(asset);

        logger.info("Maintenance request resolved successfully. requestId={}, assetId={}, assetCode={}, resolvedByAdminId={}", request.getId(), asset.getId(), asset.getAssetCode(), admin.getId());

        return MaintenanceMapper.toResponse(request);
    }

    @Override
    public MaintenanceResponse findById(Long id, Long currentUserId) {

        MaintenanceRequest request = repository.findById(id);
        if (request == null || !request.getIsActive()) {
            throw new NotFoundException("Maintenance request not found");
        }

        User currentUser = userRepository.findById(currentUserId);
        if (currentUser == null || !currentUser.getIsActive()) {
            throw new NotFoundException("User not found");
        }

        if (currentUser.getRole() == RoleType.ADMIN) {
            return MaintenanceMapper.toResponse(request);
        }
        if (currentUser.getRole() == RoleType.EMPLOYEE) {
            if (!request.getUser().getId().equals(currentUserId)) {
                throw new ForbiddenException("Access denied");
            }
            return MaintenanceMapper.toResponse(request);
        }

        if (currentUser.getRole() == RoleType.MANAGER) {
            Long managerDeptId = currentUser.getDepartment().getId();
            Long requestDeptId = request.getUser().getDepartment().getId();
            if (!managerDeptId.equals(requestDeptId)) {
                throw new ForbiddenException("Access denied");
            }
            return MaintenanceMapper.toResponse(request);
        }

        throw new ForbiddenException("Access denied");
    }

    @Override
    public List<MaintenanceResponse> findByUserId(Long userId, RoleType roleType, String status) {


        if (roleType == RoleType.ADMIN) {
            throw new NotFoundException("Maintenance request does not exist.");
        }

        List<MaintenanceStatus> statuses = MaintenanceStatusUtil.parseStatuses(status);

        User user = userRepository.findById(userId);
        if (user == null || !user.getIsActive()) {
            throw new NotFoundException("User not found");
        }

        List<MaintenanceRequest> userRequests = statuses == null ? repository.findByUserId(userId) : repository.findByUserIdAndStatuses(userId, statuses);
        return userRequests.stream().map(MaintenanceMapper::toResponse).collect(Collectors.toList());
    }

    @Override
    public List<MaintenanceResponse> findAll(Long userId, RoleType roleType, String status) {

        List<MaintenanceStatus> statuses = MaintenanceStatusUtil.parseStatuses(status);

        if (roleType == RoleType.ADMIN) {
            List<MaintenanceRequest> requests = statuses == null ? repository.findAll() : repository.findByStatuses(statuses);
            return requests.stream().map(MaintenanceMapper::toResponse).collect(Collectors.toList());
        }

        User user = userRepository.findById(userId);
        if (user == null || !user.getIsActive()) {
            throw new NotFoundException("User not found");
        }

        switch (roleType) {
            case EMPLOYEE:
                List<MaintenanceRequest> employeeRequests = statuses == null ? repository.findByUserId(userId) : repository.findByUserIdAndStatuses(userId, statuses);
                return employeeRequests.stream().map(MaintenanceMapper::toResponse).collect(Collectors.toList());

            case MANAGER:
                List<MaintenanceRequest> managerRequests = statuses == null ? repository.findByDepartmentId(user.getDepartment().getId()) : repository.findByDepartmentIdAndStatuses(user.getDepartment().getId(), statuses);
                return managerRequests.stream().map(MaintenanceMapper::toResponse).collect(Collectors.toList());

            default:
                throw new BadRequestException("Invalid role");
        }
    }
}