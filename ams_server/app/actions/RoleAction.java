package actions;

import enums.RoleType;
import exceptions.ForbiddenException;
import exceptions.UnauthorizedException;
import play.mvc.Action;
import play.mvc.Http;
import play.mvc.Result;
import security.JwtService;
import security.SecurityAttrs;

import javax.inject.Inject;
import java.util.Arrays;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CompletionStage;

public class RoleAction extends Action<RoleProtected> {

    @Override
    public CompletionStage<Result> call(Http.Request request) {

        Long userId = request.attrs().get(SecurityAttrs.USER_ID);
        RoleType role = request.attrs().get(SecurityAttrs.ROLE);

        // If AuthAction didn't run
        if (userId == null || role == null) {
            return CompletableFuture.completedFuture(unauthorized("User not authenticated"));
        }

//        boolean allowed = Arrays.stream(configuration.value()).map(RoleType::name).anyMatch(role::equals);

        boolean allowed = Arrays.asList(configuration.value()).contains(role);

        if (!allowed) {
            throw new ForbiddenException("Access denied");
        }

        return delegate.call(request);
    }
}