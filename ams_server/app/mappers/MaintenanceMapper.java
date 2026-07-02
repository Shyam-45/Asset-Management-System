package mappers;

import dtos.maintenance.MaintenanceResponse;
import models.MaintenanceRequest;

public class MaintenanceMapper {

    private MaintenanceMapper() {
    }

    public static MaintenanceResponse toResponse(MaintenanceRequest request) {

        MaintenanceResponse response = new MaintenanceResponse();
        response.setId(request.getId());
        response.setAssetId(request.getAsset().getId());
        response.setAssetCode(request.getAsset().getAssetCode());
        response.setUserId(request.getUser().getId());
        response.setUsername(request.getUser().getUsername());
        response.setDescription(request.getDescription());
        response.setStatus(request.getStatus().name());

        if (request.getApprovedBy() != null) {
            response.setApprovedById(request.getApprovedBy().getId());
            response.setApprovedByUsername(request.getApprovedBy().getUsername());
        }

        response.setApprovedAt(request.getApprovedAt());
        response.setResolvedAt(request.getResolvedAt());

        return response;
    }
}