package services;

import dtos.asset.AssetResponse;
import dtos.asset.CreateAssetRequest;
import dtos.asset.UpdateAssetRequest;

import java.util.List;

public interface AssetService {

    AssetResponse create(CreateAssetRequest dto);

    List<AssetResponse> findAll(Long currentUserId);

    AssetResponse findById(Long id, Long currentUserId);

    AssetResponse update(Long id, UpdateAssetRequest dto);

    void delete(Long id);
}