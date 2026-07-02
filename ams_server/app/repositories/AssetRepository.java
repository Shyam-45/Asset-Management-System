package repositories;

import io.ebean.DB;
import models.Asset;
import models.AssetAssignment;

import javax.inject.Singleton;
import java.util.List;
import java.util.stream.Collectors;

@Singleton
public class AssetRepository {

    public void save(Asset asset) {
        DB.save(asset);
    }

    public void update(Asset asset) {
        DB.update(asset);
    }

    public Asset findById(Long id) {
        return DB.find(Asset.class, id);
    }

    public List<Asset> findAllActive() {
        return DB.find(Asset.class).where().eq("isActive", true).findList();
    }

    public Asset findBySerialNumber(String serialNumber) {
        return DB.find(Asset.class).where().eq("serialNumber", serialNumber).findOne();
    }

    public long countAssets() {
        return DB.find(Asset.class).findCount();
    }

    public Asset findLatestAsset() {
        return DB.find(Asset.class).orderBy("id desc").setMaxRows(1).findOne();
    }

    public boolean isAssignedToUser(Long assetId, Long userId) {
        return DB.find(AssetAssignment.class).where().eq("asset.id", assetId).eq("user.id", userId).isNull("returnedAt").findCount() > 0;
    }

    public List<Asset> findAssignedAssets(Long userId) {

        return DB.find(AssetAssignment.class).where().eq("user.id", userId).isNull("returnedAt").findList().stream().map(AssetAssignment::getAsset).filter(Asset::getIsActive).collect(Collectors.toList());
    }
}