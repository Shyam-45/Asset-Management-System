package dtos.asset;

import java.time.LocalDate;

public class UpdateAssetRequest {

    private String name;
    private String status;
    private LocalDate purchaseDate;
    private String description;

    public UpdateAssetRequest() {
    }

    public String getName() {
        return name;
    }

    public void setName(
            String name
    ) {
        this.name = name;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(
            String status
    ) {
        this.status = status;
    }

    public LocalDate getPurchaseDate() {
        return purchaseDate;
    }

    public void setPurchaseDate(
            LocalDate purchaseDate
    ) {
        this.purchaseDate = purchaseDate;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(
            String description
    ) {
        this.description = description;
    }
}