package services;

import dtos.assignment.AssignAssetRequest;
import dtos.assignment.AssignmentResponse;

import java.util.List;

public interface AssetAssignmentService {

    AssignmentResponse assign(AssignAssetRequest dto, Long assignedById);

    AssignmentResponse returnAsset(Long assignmentId, Long userId);

    List<AssignmentResponse> findAll();

    AssignmentResponse findById(Long id, Long currentUserId);

    List<AssignmentResponse> findCurrentlyAssigned();

    List<AssignmentResponse> findMyAssignments(Long userId);
}