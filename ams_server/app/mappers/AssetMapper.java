package mappers;

import dtos.asset.AssetResponse;
import dtos.asset.CreateAssetRequest;

import enums.AssetCategory;

import models.Asset;

public class AssetMapper {

    public static AssetResponse toResponse(Asset asset) {

        AssetResponse response = new AssetResponse();
        response.setId(asset.getId());
        response.setAssetCode(asset.getAssetCode());
        response.setSerialNumber(asset.getSerialNumber());
        response.setName(asset.getName());
        response.setCategory(asset.getCategory().name());
        response.setStatus(asset.getStatus().name());
        response.setPurchaseDate(asset.getPurchaseDate() != null ? asset.getPurchaseDate().toString() : null);
        response.setDescription(asset.getDescription());

        return response;
    }

    public static Asset toEntity(CreateAssetRequest dto) {

        Asset asset = new Asset();
        asset.setName(dto.getName().trim());
        asset.setSerialNumber(dto.getSerialNumber().trim().toUpperCase());
        asset.setCategory(AssetCategory.valueOf(dto.getCategory().trim().toUpperCase()));
        asset.setPurchaseDate(dto.getPurchaseDate());
        asset.setDescription(dto.getDescription() == null ? null : dto.getDescription().trim());

        return asset;
    }
}