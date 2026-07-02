package actions;

import enums.RoleType;
import play.mvc.Action;
import play.mvc.Http;
import play.mvc.Result;
import security.JwtService;
import security.SecurityAttrs;
import org.slf4j.MDC;

import javax.inject.Inject;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CompletionStage;

public class AuthAction extends Action.Simple {

    private final JwtService jwtService;

    @Inject
    public AuthAction(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    public CompletionStage<Result> call(Http.Request request) {

        String authHeader = request.header("Authorization").orElse(null);

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return CompletableFuture.completedFuture(unauthorized("Missing token"));
        }

        String token = authHeader.substring(7);

        if (!jwtService.validateToken(token)) {
            return CompletableFuture.completedFuture(unauthorized("Invalid token"));
        }

        Long userId = jwtService.extractUserId(token);
        String role = jwtService.extractRole(token);
        RoleType roleType = RoleType.valueOf(role);

        Http.Request updatedRequest = request.addAttr(SecurityAttrs.USER_ID, userId).addAttr(SecurityAttrs.ROLE, roleType);

        MDC.put("userId", String.valueOf(userId));
        MDC.put("role", role);

        return delegate.call(updatedRequest).whenComplete((result, throwable) -> MDC.clear());
    }
}