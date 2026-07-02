package services;

public interface RateLimitService {

    boolean isAllowed(String clientIp);
}
