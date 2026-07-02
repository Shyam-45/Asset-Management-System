package exceptions;

import dtos.ErrorResponse;
import play.http.HttpErrorHandler;
import play.libs.Json;
import play.mvc.Http.RequestHeader;
import play.mvc.Result;
import play.mvc.Results;

import javax.inject.Singleton;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CompletionStage;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Singleton
public class CustomErrorHandler implements HttpErrorHandler {

    // Creates a logger instance and tell logback to associate logs with this class
    private static final Logger logger = LoggerFactory.getLogger(CustomErrorHandler.class);

    private Result error(int status, String message) {
        return Results.status(status, Json.toJson(new ErrorResponse(message)));
    }

    private void logWarn(RequestHeader request, Throwable exception) {
        logger.warn("{} {} - {}", request.method(), request.path(), exception.getMessage());
    }

    private void logError(RequestHeader request, Throwable exception) {
        logger.error("{} {} - Unexpected exception", request.method(), request.path(), exception);
    }

    @Override
    public CompletionStage<Result> onClientError(RequestHeader request, int statusCode, String message) {

        logger.warn("{} {} - {} ({})", request.method(), request.path(), statusCode, message);

        String clientMessage;

        switch (statusCode) {
            case 400:
                clientMessage = "Invalid request.";
                break;
            case 404:
                clientMessage = "Resource not found.";
                break;
            case 405:
                clientMessage = "HTTP method not allowed.";
                break;
            default:
                clientMessage = "Request could not be processed.";
        }

        return CompletableFuture.completedFuture(error(statusCode, clientMessage));
    }

    @Override
    public CompletionStage<Result> onServerError(RequestHeader request, Throwable exception) {

        if (exception instanceof BadRequestException) {
            logWarn(request, exception);
            return CompletableFuture.completedFuture(error(400, exception.getMessage()));
        }

        if (exception instanceof NotFoundException) {
            logWarn(request, exception);
            return CompletableFuture.completedFuture(error(404, exception.getMessage()));
        }

        if (exception instanceof UnauthorizedException) {
            logWarn(request, exception);
            return CompletableFuture.completedFuture(error(401, exception.getMessage()));
        }

        if (exception instanceof ForbiddenException) {
            logWarn(request, exception);
            return CompletableFuture.completedFuture(error(403, exception.getMessage()));
        }

//        exception.printStackTrace();

        logError(request, exception);

        return CompletableFuture.completedFuture(error(500, "Internal Server Error"));
    }
}