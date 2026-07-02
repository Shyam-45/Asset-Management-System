package controllers;

import actions.AuthAction;
import actions.RoleProtected;
import com.fasterxml.jackson.databind.JsonNode;
import dtos.asset.CreateAssetRequest;
import dtos.asset.UpdateAssetRequest;
import enums.RoleType;
import exceptions.BadRequestException;
import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Http;
import play.mvc.Result;
import play.mvc.With;
import security.SecurityAttrs;
import services.AssetService;

import javax.inject.Inject;

//@Authenticated
@With(AuthAction.class)
public class AssetController extends Controller {

    private final AssetService assetService;

    @Inject
    public AssetController(AssetService assetService) {
        this.assetService = assetService;
    }

    @RoleProtected(RoleType.ADMIN)
    public Result create(Http.Request request) {

        JsonNode json = request.body().asJson();
        if (json == null) {
            throw new BadRequestException("Request body must be JSON");
        }
        CreateAssetRequest dto = Json.fromJson(json, CreateAssetRequest.class);

        return created(Json.toJson(assetService.create(dto)));
    }


    @RoleProtected({RoleType.ADMIN, RoleType.MANAGER, RoleType.EMPLOYEE})
    public Result findAll(Http.Request request) {

        Long currentUserId = request.attrs().get(SecurityAttrs.USER_ID);

        return ok(Json.toJson(assetService.findAll(currentUserId)));
    }

    @RoleProtected({RoleType.ADMIN, RoleType.MANAGER, RoleType.EMPLOYEE})
    public Result findById(Long id, Http.Request request) {

        Long currentUserId = request.attrs().get(SecurityAttrs.USER_ID);

        return ok(Json.toJson(assetService.findById(id, currentUserId)));
    }
    @RoleProtected(RoleType.ADMIN)
    public Result update(Long id, Http.Request request) {

        JsonNode json = request.body().asJson();
        if (json == null) {
            throw new BadRequestException("Request body must be JSON");
        }
        UpdateAssetRequest dto = Json.fromJson(json, UpdateAssetRequest.class);

        return ok(Json.toJson(assetService.update(id, dto)));
    }

    @RoleProtected(RoleType.ADMIN)
    public Result delete(Long id) {

        assetService.delete(id);

        return ok(Json.newObject().put("message", "Asset deleted successfully"));
    }
}