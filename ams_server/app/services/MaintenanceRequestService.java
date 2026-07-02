package services;

import dtos.maintenance.CreateMaintenanceRequest;
import dtos.maintenance.MaintenanceResponse;
import enums.RoleType;

import java.util.List;

public interface MaintenanceRequestService {

    MaintenanceResponse create(CreateMaintenanceRequest dto, Long userId);

    MaintenanceResponse approve(Long requestId, Long managerId);

    MaintenanceResponse reject(Long requestId, Long managerId);

    MaintenanceResponse resolve(Long requestId, Long adminId);

    MaintenanceResponse findById(Long id, Long currentUserId);

    List<MaintenanceResponse> findByUserId(Long userId, RoleType roleType, String status);

    List<MaintenanceResponse> findAll(Long userId, RoleType roleType, String status);
}