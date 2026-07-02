package controllers;

import actions.RateLimitAction;
import com.fasterxml.jackson.databind.JsonNode;
import dtos.auth.LoginRequest;
import exceptions.BadRequestException;
import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Http;
import play.mvc.Result;
import play.mvc.With;
import services.AuthService;

import javax.inject.Inject;

public class AuthController extends Controller {

    private final AuthService authService;

    @Inject
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    //    @RateLimited
    @With(RateLimitAction.class)
    public Result login(Http.Request request) {

        JsonNode json = request.body().asJson();
        if (json == null) {
            throw new BadRequestException("Request body must be JSON");
        }
        LoginRequest dto = Json.fromJson(json, LoginRequest.class);

        return ok(Json.toJson(authService.login(dto)));
    }

}