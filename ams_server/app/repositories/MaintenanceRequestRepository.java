package repositories;

import enums.MaintenanceStatus;
import io.ebean.DB;
import models.MaintenanceRequest;

import javax.inject.Singleton;
import java.util.List;

@Singleton
public class MaintenanceRequestRepository {

    public void save(MaintenanceRequest request) {
        DB.save(request);
    }

    public void update(MaintenanceRequest request) {
        DB.update(request);
    }

    public MaintenanceRequest findById(Long id) {
        return DB.find(MaintenanceRequest.class, id);
    }

    public List<MaintenanceRequest> findAll() {

        return DB.find(MaintenanceRequest.class).fetch("asset").fetch("user").fetch("approvedBy").findList();
    }

    public List<MaintenanceRequest> findOpenRequests() {

        return DB.find(MaintenanceRequest.class).fetch("asset").fetch("user").fetch("approvedBy").where().in("status", MaintenanceStatus.PENDING, MaintenanceStatus.IN_PROGRESS).findList();
    }

    public List<MaintenanceRequest> findByStatuses(List<MaintenanceStatus> statuses) {

        return DB.find(MaintenanceRequest.class).fetch("asset").fetch("user").fetch("approvedBy").where().in("status", statuses).findList();
    }

    public List<MaintenanceRequest> findByUserIdAndStatuses(Long userId, List<MaintenanceStatus> statuses) {

        return DB.find(MaintenanceRequest.class).fetch("asset").fetch("user").fetch("approvedBy").where().eq("user.id", userId).in("status", statuses).findList();
    }

    public List<MaintenanceRequest> findByDepartmentIdAndStatuses(Long departmentId, List<MaintenanceStatus> statuses) {

        return DB.find(MaintenanceRequest.class).fetch("asset").fetch("user").fetch("approvedBy").where().eq("user.department.id", departmentId).in("status", statuses).findList();
    }

    public MaintenanceRequest findOpenByAssetId(Long assetId) {
        return DB.find(MaintenanceRequest.class).fetch("asset").fetch("user").where().eq("asset.id", assetId).eq("isActive", true).in("status", MaintenanceStatus.PENDING, MaintenanceStatus.IN_PROGRESS).findOne();
    }

    public MaintenanceRequest findActiveById(Long id) {
        return DB.find(MaintenanceRequest.class).fetch("asset").fetch("user").fetch("approvedBy").where().eq("id", id).eq("isActive", true).findOne();
    }

    public List<MaintenanceRequest> findByDepartmentId(Long departmentId) {
        return DB.find(MaintenanceRequest.class).fetch("asset").fetch("user").fetch("approvedBy").where().eq("isActive", true).eq("user.department.id", departmentId).findList();
    }

    public List<MaintenanceRequest> findByUserId(Long userId) {
        return DB.find(MaintenanceRequest.class).fetch("asset").fetch("user").fetch("approvedBy").where().eq("isActive", true).eq("user.id", userId).findList();
    }
}