package repositories;

import enums.AssignmentStatus;
import io.ebean.DB;
import io.ebean.Finder;
import models.AssetAssignment;

import javax.inject.Singleton;
import java.util.List;

@Singleton
public class AssetAssignmentRepository {

    public void save(AssetAssignment assignment) {
        DB.save(assignment);
    }

    public void update(AssetAssignment assignment) {
        DB.update(assignment);
    }

    public AssetAssignment findById(Long id) {
        return DB.find(AssetAssignment.class, id);
    }

    public List<AssetAssignment> findAllActive() {
        return DB.find(AssetAssignment.class).where().eq("isActive", true).findList();
    }

    public AssetAssignment findActiveByAssetId(Long assetId) {
        return DB.find(AssetAssignment.class).fetch("asset").fetch("user").where().eq("asset.id", assetId).eq("status", AssignmentStatus.ACTIVE).eq("isActive", true).findOne();
    }

    public AssetAssignment findActiveById(Long id) {
        return DB.find(AssetAssignment.class).fetch("asset").fetch("user").fetch("assignedBy").where().eq("id", id).eq("status", AssignmentStatus.ACTIVE).eq("isActive", true).findOne();
    }

    public List<AssetAssignment> findCurrentlyAssigned() {
        return DB.find(AssetAssignment.class).where().eq("status", AssignmentStatus.ACTIVE).eq("isActive", true).findList();
    }

    public List<AssetAssignment> findActiveByUserId(Long userId) {
        return DB.find(AssetAssignment.class).fetch("asset").fetch("user").fetch("assignedBy").where().eq("user.id", userId).eq("isActive", true).findList();
    }
}