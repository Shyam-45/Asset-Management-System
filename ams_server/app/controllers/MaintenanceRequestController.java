package controllers;

import actions.AuthAction;
import actions.RoleProtected;
import com.fasterxml.jackson.databind.JsonNode;
import dtos.maintenance.CreateMaintenanceRequest;
import enums.RoleType;
import exceptions.BadRequestException;
import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Http;
import play.mvc.Result;
import play.mvc.With;
import services.MaintenanceRequestService;
import security.SecurityAttrs;

import javax.inject.Inject;

//@Authenticated
@With(AuthAction.class)
public class MaintenanceRequestController extends Controller {

    private final MaintenanceRequestService service;

    @Inject
    public MaintenanceRequestController(MaintenanceRequestService service) {
        this.service = service;
    }

    @RoleProtected({RoleType.MANAGER, RoleType.EMPLOYEE})
    public Result create(Http.Request request) {

        JsonNode json = request.body().asJson();
        if (json == null) {
            throw new BadRequestException("Request body must be JSON");
        }

        CreateMaintenanceRequest dto = Json.fromJson(json, CreateMaintenanceRequest.class);
        Long userId = request.attrs().get(SecurityAttrs.USER_ID);

        return created(Json.toJson(service.create(dto, userId)));
    }

    @RoleProtected(RoleType.MANAGER)
    public Result approve(Http.Request request, Long requestId) {

        Long managerId = request.attrs().get(SecurityAttrs.USER_ID);
        return ok(Json.toJson(service.approve(requestId, managerId)));
    }

    @RoleProtected(RoleType.MANAGER)
    public Result reject(Http.Request request, Long requestId) {

        Long managerId = request.attrs().get(SecurityAttrs.USER_ID);
        return ok(Json.toJson(service.reject(requestId, managerId)));
    }

    @RoleProtected(RoleType.ADMIN)
    public Result resolve(Http.Request request, Long requestId) {

        Long adminId = request.attrs().get(SecurityAttrs.USER_ID);
        return ok(Json.toJson(service.resolve(requestId, adminId)));
    }

    @RoleProtected({RoleType.ADMIN, RoleType.MANAGER})
    public Result findAll(Http.Request request) {
        Long userId = request.attrs().get(SecurityAttrs.USER_ID);
        RoleType role = request.attrs().get(SecurityAttrs.ROLE);
        String status = request.queryString("status").orElse("ACTIVE");
        return ok(Json.toJson(service.findAll(userId, role, status)));
    }

    @RoleProtected({RoleType.MANAGER, RoleType.EMPLOYEE})
    public Result findByUserId(Http.Request request) {

        Long userId = request.attrs().get(SecurityAttrs.USER_ID);
        RoleType role = request.attrs().get(SecurityAttrs.ROLE);
        String status = request.queryString("status").orElse("ACTIVE");

        return ok(Json.toJson(service.findByUserId(userId, role, status)));
    }

    @RoleProtected({RoleType.ADMIN, RoleType.MANAGER, RoleType.EMPLOYEE})
    public Result findById(Long id, Http.Request request) {

        Long userId = request.attrs().get(SecurityAttrs.USER_ID);
        return ok(Json.toJson(service.findById(id, userId)));
    }
}