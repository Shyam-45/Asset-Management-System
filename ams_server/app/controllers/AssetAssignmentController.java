package controllers;

import actions.AuthAction;
import actions.RoleProtected;
import com.fasterxml.jackson.databind.JsonNode;
import dtos.assignment.AssignAssetRequest;
import enums.RoleType;
import exceptions.BadRequestException;
import play.mvc.With;
import services.AssetAssignmentService;
import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Http;
import play.mvc.Result;

import javax.inject.Inject;

import security.SecurityAttrs;

//@Authenticated
@With(AuthAction.class)
public class AssetAssignmentController extends Controller {

    private final AssetAssignmentService service;

    @Inject
    public AssetAssignmentController(AssetAssignmentService service) {
        this.service = service;
    }

    @RoleProtected(RoleType.ADMIN)
    public Result assign(Http.Request request) {

        JsonNode json = request.body().asJson();
        if (json == null) {
            throw new BadRequestException("Request body must be JSON");
        }

        AssignAssetRequest dto = Json.fromJson(json, AssignAssetRequest.class);
        Long adminId = request.attrs().get(SecurityAttrs.USER_ID);
        return created(Json.toJson(service.assign(dto, adminId)));
    }

    @RoleProtected({RoleType.MANAGER, RoleType.EMPLOYEE})
    public Result returnAsset(Long id, Http.Request request) {
        Long userId = request.attrs().get(SecurityAttrs.USER_ID);
        return ok(Json.toJson(service.returnAsset(id, userId)));
    }

    @RoleProtected(RoleType.ADMIN)
    public Result findAll() {

        return ok(Json.toJson(service.findAll()));
    }

    @RoleProtected({RoleType.ADMIN, RoleType.MANAGER, RoleType.EMPLOYEE})
    public Result findById(Long id, Http.Request request) {

        Long userId = request.attrs().get(SecurityAttrs.USER_ID);
        return ok(Json.toJson(service.findById(id, userId)));
    }

    @RoleProtected(RoleType.ADMIN)
    public Result findCurrentlyAssigned() {

        return ok(Json.toJson(service.findCurrentlyAssigned()));
    }

    @RoleProtected({RoleType.MANAGER, RoleType.EMPLOYEE})
    public Result findMyAssignments(Http.Request request) {

        Long userId = request.attrs().get(SecurityAttrs.USER_ID);
        return ok(Json.toJson(service.findMyAssignments(userId)));
    }
}