package services.impl;

import dtos.assignment.AssignAssetRequest;
import dtos.assignment.AssignmentResponse;
import enums.AssignmentStatus;
import enums.AssetStatus;
import enums.RoleType;
import exceptions.BadRequestException;
import exceptions.ForbiddenException;
import exceptions.NotFoundException;
import io.ebean.annotation.Transactional;
import mappers.AssignmentMapper;
import models.Asset;
import models.AssetAssignment;
import models.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import repositories.AssetAssignmentRepository;
import repositories.AssetRepository;
import repositories.UserRepository;
import services.AssetAssignmentService;

import javax.inject.Inject;
import javax.inject.Singleton;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Singleton
public class AssetAssignmentServiceImpl implements AssetAssignmentService {

    private final AssetAssignmentRepository assignmentRepository;
    private final AssetRepository assetRepository;
    private final UserRepository userRepository;

    private static final Logger logger = LoggerFactory.getLogger(AssetAssignmentServiceImpl.class);

    @Inject
    public AssetAssignmentServiceImpl(AssetAssignmentRepository assignmentRepository, AssetRepository assetRepository, UserRepository userRepository) {
        this.assignmentRepository = assignmentRepository;
        this.assetRepository = assetRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public AssignmentResponse assign(AssignAssetRequest dto, Long assignedById) {

        if (dto.getAssetId() == null) {
            throw new BadRequestException("Asset id is required");
        }

        if (dto.getUserId() == null) {
            throw new BadRequestException("User id is required");
        }

        Asset asset = assetRepository.findById(dto.getAssetId());

        if (asset == null || !asset.getIsActive()) {
            throw new NotFoundException("Asset not found");
        }

        AssetAssignment existing = assignmentRepository.findActiveByAssetId(asset.getId());

        if (existing != null) {
            throw new BadRequestException("Asset already assigned");
        }

        if (asset.getStatus() != AssetStatus.AVAILABLE) {
            throw new BadRequestException("Asset is not available");
        }

        User user = userRepository.findById(dto.getUserId());

        if (user == null || !user.getIsActive()) {
            throw new NotFoundException("User not found");
        }

        if (user.getRole() == RoleType.ADMIN) {
            throw new BadRequestException("Asset cannot be assigned to ADMIN");
        }

//        if (user.getRole() != RoleType.EMPLOYEE) {
//            throw new BadRequestException("Asset can only be assigned to EMPLOYEE");
//        }

        User assignedBy = userRepository.findById(assignedById);
        if (assignedBy == null || !assignedBy.getIsActive()) {
            throw new NotFoundException("AssignedBy user not found");
        }
        if (assignedBy.getRole() != RoleType.ADMIN) {
            throw new ForbiddenException("Only admins can assign assets");
        }

        AssetAssignment assignment = new AssetAssignment();
        assignment.setAsset(asset);
        assignment.setUser(user);
        assignment.setAssignedBy(assignedBy);
        assignment.setAssignedDate(LocalDateTime.now());
        assignment.setStatus(AssignmentStatus.ACTIVE);

        assignmentRepository.save(assignment);

        asset.setStatus(AssetStatus.ASSIGNED);
        assetRepository.update(asset);

        logger.info("Asset assigned successfully. assignmentId={}, assetId={}, assetCode={}, assignedToUserId={}, assignedByUserId={}", assignment.getId(), asset.getId(), asset.getAssetCode(), user.getId(), assignedBy.getId());

        return AssignmentMapper.toResponse(assignment);
    }

    @Override
    @Transactional
    public AssignmentResponse returnAsset(Long assignmentId, Long userId) {

        AssetAssignment assignment = assignmentRepository.findActiveById(assignmentId);

        if (assignment == null) {
            throw new NotFoundException("Active assignment not found");
        }

        if (!assignment.getUser().getId().equals(userId)) {
            throw new ForbiddenException("Access denied");
        }

        assignment.setStatus(AssignmentStatus.RETURNED);
        assignment.setReturnedDate(LocalDateTime.now());

        assignmentRepository.update(assignment);

        Asset asset = assignment.getAsset();
        asset.setStatus(AssetStatus.AVAILABLE);

        assetRepository.update(asset);

        logger.info("Asset returned successfully. assignmentId={}, assetId={}, assetCode={}, returnedByUserId={}", assignment.getId(), asset.getId(), asset.getAssetCode(), userId);

        return AssignmentMapper.toResponse(assignment);
    }

    @Override
    public List<AssignmentResponse> findAll() {

        return assignmentRepository.findAllActive().stream().map(AssignmentMapper::toResponse).collect(Collectors.toList());
    }

    @Override
    public AssignmentResponse findById(Long id, Long currentUserId) {

        AssetAssignment assignment = assignmentRepository.findById(id);
        if (assignment == null || !assignment.getIsActive()) {
            throw new NotFoundException("Assignment not found");
        }

        User currentUser = userRepository.findById(currentUserId);
        if (currentUser.getRole() != RoleType.ADMIN && !assignment.getUser().getId().equals(currentUserId)) {
            throw new ForbiddenException("Access denied");
        }

        return AssignmentMapper.toResponse(assignment);
    }

    @Override
    public List<AssignmentResponse> findCurrentlyAssigned() {

        return assignmentRepository.findCurrentlyAssigned().stream().map(AssignmentMapper::toResponse).collect(Collectors.toList());
    }

    @Override
    public List<AssignmentResponse> findMyAssignments(Long userId) {

        return assignmentRepository.findActiveByUserId(userId).stream().map(AssignmentMapper::toResponse).collect(Collectors.toList());
    }
}