package controllers;

import actions.AuthAction;
import actions.RoleProtected;
import com.fasterxml.jackson.databind.JsonNode;
import dtos.department.CreateDepartmentRequest;
import dtos.department.UpdateDepartmentRequest;
import enums.RoleType;
import exceptions.BadRequestException;
import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Http;
import play.mvc.Result;
import play.mvc.With;
import services.DepartmentService;

import javax.inject.Inject;

//@Authenticated
@With(AuthAction.class)
@RoleProtected(RoleType.ADMIN)
public class DepartmentController extends Controller {

    private final DepartmentService service;

    @Inject
    public DepartmentController(DepartmentService service) {
        this.service = service;
    }

    public Result create(Http.Request request) {

        JsonNode body = request.body().asJson();
        if (body == null) {
            throw new BadRequestException("Request body must be JSON");
        }
        CreateDepartmentRequest dto = Json.fromJson(body, CreateDepartmentRequest.class);

        return created(Json.toJson(service.create(dto)));
    }

    public Result findAll() {

        return ok(Json.toJson(service.findAll()));
    }

    public Result findById(Long id) {

        return ok(Json.toJson(service.findById(id)));
    }

    public Result update(Long id, Http.Request request) {

        JsonNode body = request.body().asJson();
        if (body == null) {
            throw new BadRequestException("Request body must be JSON");
        }
        UpdateDepartmentRequest dto = Json.fromJson(body, UpdateDepartmentRequest.class);

        return ok(Json.toJson(service.update(id, dto)));
    }

    public Result delete(Long id) {

        service.delete(id);

        return ok(Json.newObject().put("message", "Department deleted successfully"));
    }
}