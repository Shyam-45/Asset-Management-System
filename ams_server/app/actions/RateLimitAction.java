package actions;

import com.fasterxml.jackson.databind.node.ObjectNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import play.libs.Json;
import play.mvc.Action;
import play.mvc.Http;
import play.mvc.Result;
import play.mvc.Results;
import services.RateLimitService;

import javax.inject.Inject;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CompletionStage;

public class RateLimitAction extends Action.Simple {

    private final RateLimitService rateLimitService;

    private static final Logger logger = LoggerFactory.getLogger(RateLimitAction.class);

    @Inject
    public RateLimitAction(RateLimitService rateLimitService) {
        this.rateLimitService = rateLimitService;
    }

    @Override
    public CompletionStage<Result> call(Http.Request request) {

        String clientIp = request.remoteAddress();
        boolean allowed = rateLimitService.isAllowed(clientIp);

        if (!allowed) {
            logger.warn("Rate limit exceeded. ip={}, path={}", clientIp, request.path());
            ObjectNode json = Json.newObject();
            json.put("message", "Too many login attempts. Please try again later.");
            return CompletableFuture.completedFuture(Results.tooManyRequests(json));
        }

        return delegate.call(request);
    }
}
