package services.impl;

import dtos.asset.AssetResponse;
import dtos.asset.CreateAssetRequest;
import dtos.asset.UpdateAssetRequest;
import enums.AssetCategory;
import enums.AssetStatus;
import enums.RoleType;
import exceptions.BadRequestException;
import exceptions.ForbiddenException;
import exceptions.NotFoundException;
import mappers.AssetMapper;
import models.Asset;
import models.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import repositories.AssetRepository;
import repositories.UserRepository;
import services.AssetService;
import utils.AssetCodeGenerator;

import javax.inject.Inject;
import javax.inject.Singleton;
import java.util.List;
import java.util.stream.Collectors;

@Singleton
public class AssetServiceImpl implements AssetService {

    private final AssetRepository repository;
    private final AssetCodeGenerator assetCodeGenerator;
    private final UserRepository userRepository;

    private static final Logger logger = LoggerFactory.getLogger(AssetServiceImpl.class);

    @Inject
    public AssetServiceImpl(AssetRepository repository, AssetCodeGenerator assetCodeGenerator, UserRepository userRepository) {
        this.repository = repository;
        this.assetCodeGenerator = assetCodeGenerator;
        this.userRepository = userRepository;
    }

    @Override
    public AssetResponse create(CreateAssetRequest dto) {

        if (dto.getName() == null || dto.getName().trim().isEmpty()) {
            throw new BadRequestException("Name is required");
        }

        if (dto.getSerialNumber() == null || dto.getSerialNumber().trim().isEmpty()) {
            throw new BadRequestException("Serial number is required");
        }

        if (dto.getCategory() == null || dto.getCategory().trim().isEmpty()) {
            throw new BadRequestException("Category is required");
        }

        String normalizedSerialNumber = dto.getSerialNumber().trim().toUpperCase();

        if (repository.findBySerialNumber(normalizedSerialNumber) != null) {
            throw new BadRequestException("Serial number already exists");
        }

        AssetCategory category;
        try {
            category = AssetCategory.valueOf(dto.getCategory().trim().toUpperCase());
        } catch (Exception ex) {
            throw new BadRequestException("Invalid category");
        }

        Asset latest = repository.findLatestAsset();
        long nextNumber = latest == null ? 1 : latest.getId() + 1;
        String assetCode = assetCodeGenerator.generate(category, nextNumber);

        Asset asset = AssetMapper.toEntity(dto);
        asset.setAssetCode(assetCode);
        asset.setStatus(AssetStatus.AVAILABLE);

        repository.save(asset);

        logger.info("Asset created successfully. id={}, assetCode={}, serialNumber={}, category={}", asset.getId(), asset.getAssetCode(), asset.getSerialNumber(), asset.getCategory());

        return AssetMapper.toResponse(asset);
    }

    @Override
    public List<AssetResponse> findAll(Long currentUserId) {

        User currentUser = userRepository.findById(currentUserId);
        List<Asset> assets;

        if (currentUser.getRole() == RoleType.ADMIN) {
            assets = repository.findAllActive();
        } else {
            assets = repository.findAssignedAssets(currentUserId);
        }

        return assets.stream().map(AssetMapper::toResponse).collect(Collectors.toList());
    }

    @Override
    public AssetResponse findById(Long id, Long currentUserId) {

        Asset asset = repository.findById(id);
        if (asset == null || !asset.getIsActive()) {
            throw new NotFoundException("Asset not found");
        }

        User currentUser = userRepository.findById(currentUserId);
        if (currentUser.getRole() != RoleType.ADMIN && !repository.isAssignedToUser(id, currentUserId)) {
            throw new ForbiddenException("Access denied");
        }

        return AssetMapper.toResponse(asset);
    }

    @Override
    public void delete(Long id) {

        Asset asset = repository.findById(id);
        if (asset == null || !asset.getIsActive()) {
            throw new NotFoundException("Asset not found");
        }

        asset.setIsActive(false);

        repository.update(asset);

        logger.info("Asset deleted successfully. id={}, assetCode={}", asset.getId(), asset.getAssetCode());
    }

    @Override
    public AssetResponse update(Long id, UpdateAssetRequest dto) {

        boolean hasChanges = (dto.getName() != null && !dto.getName().trim().isEmpty()) || dto.getPurchaseDate() != null || (dto.getDescription() != null && !dto.getDescription().trim().isEmpty());

        if (!hasChanges) {
            throw new BadRequestException("At least one field must be provided for update");
        }

        Asset asset = repository.findById(id);
        if (asset == null || !asset.getIsActive()) {
            throw new NotFoundException("Asset not found");
        }

        if (dto.getName() != null && !dto.getName().trim().isEmpty()) {
            asset.setName(dto.getName().trim());
        }

        if (dto.getPurchaseDate() != null) {
            asset.setPurchaseDate(dto.getPurchaseDate());
        }

        if (dto.getDescription() != null) {
            asset.setDescription(dto.getDescription().trim());
        }

        repository.update(asset);

        logger.info("Asset updated successfully. id={}, assetCode={}", asset.getId(), asset.getAssetCode());

        return AssetMapper.toResponse(asset);
    }

}
