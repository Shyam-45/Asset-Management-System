package mappers;

import dtos.assignment.AssignmentResponse;
import models.AssetAssignment;

public class AssignmentMapper {

    private AssignmentMapper() {
    }

    public static AssignmentResponse toResponse(AssetAssignment assignment) {

        AssignmentResponse response = new AssignmentResponse();
        response.setId(assignment.getId());
        response.setAssetId(assignment.getAsset().getId());
        response.setAssetCode(assignment.getAsset().getAssetCode());
        response.setUserId(assignment.getUser().getId());
        response.setUsername(assignment.getUser().getUsername());
        response.setAssignedById(assignment.getAssignedBy().getId());
        response.setAssignedByUsername(assignment.getAssignedBy().getUsername());
        response.setStatus(assignment.getStatus().name());
        response.setAssignedDate(assignment.getAssignedDate());
        response.setReturnedDate(assignment.getReturnedDate());

        return response;
    }
}