package controllers;

import actions.AuthAction;
import actions.RoleProtected;
import com.fasterxml.jackson.databind.JsonNode;
import dtos.user.CreateUserRequest;
import dtos.user.UpdateUserRequest;
import enums.RoleType;
import exceptions.BadRequestException;
import play.libs.Json;
import play.mvc.*;
import services.UserService;
import security.SecurityAttrs;

import javax.inject.Inject;

//@Authenticated
@With(AuthAction.class)
public class UserController extends Controller {

    private final UserService service;

    @Inject
    public UserController(UserService service) {
        this.service = service;
    }

    @RoleProtected(RoleType.ADMIN)
    public Result create(Http.Request request) {

        JsonNode body = request.body().asJson();
        if (body == null) {
            throw new BadRequestException("Request body must be JSON");
        }
        CreateUserRequest dto = Json.fromJson(body, CreateUserRequest.class);

        return created(Json.toJson(service.create(dto)));
    }

    @RoleProtected({RoleType.ADMIN, RoleType.MANAGER, RoleType.EMPLOYEE})
    public Result findById(Long id, Http.Request request) {

        Long currentUserId = request.attrs().get(SecurityAttrs.USER_ID);
        return ok(Json.toJson(service.findById(id, currentUserId)));
    }

    @RoleProtected(RoleType.ADMIN)
    public Result update(Long id, Http.Request request) {

        JsonNode body = request.body().asJson();
        if (body == null) {
            throw new BadRequestException("Request body must be JSON");
        }
        UpdateUserRequest dto = Json.fromJson(body, UpdateUserRequest.class);

        return ok(Json.toJson(service.update(id, dto)));
    }

    @RoleProtected(RoleType.ADMIN)
    public Result delete(Long id) {

        service.delete(id);
        return ok(Json.newObject().put("message", "User deleted successfully"));
    }

    @RoleProtected({RoleType.ADMIN, RoleType.MANAGER})
    public Result findAll(Http.Request request) {

        Long departmentId = request.queryString("departmentId").map(Long::parseLong).orElse(null);
        Long currentUserId = request.attrs().get(SecurityAttrs.USER_ID);

        return ok(Json.toJson(service.findAll(currentUserId, departmentId)));
    }
}