package services.impl;

import services.RateLimitService;

import javax.inject.Inject;
import javax.inject.Singleton;
import java.time.Duration;
import java.time.Instant;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.concurrent.ConcurrentHashMap;

@Singleton
public class RateLimitServiceImpl implements RateLimitService {

    private static final int MAX_ATTEMPTS = 10;
    private static final Duration WINDOW = Duration.ofMinutes(5);
    private final ConcurrentHashMap<String, Deque<Instant>> requestTimestamps;

    @Inject
    public RateLimitServiceImpl() {
        this.requestTimestamps = new ConcurrentHashMap<>();
    }

    // Sliding Window Rate-Limiter
    @Override
    public boolean isAllowed(String clientIp) {
        Instant now = Instant.now();
        Deque<Instant> timestamps = requestTimestamps.computeIfAbsent(clientIp, ip -> new ArrayDeque<>());

//        Only one request for this specific IP may modify this specific queue at a time.
        synchronized (timestamps) {
            Instant cutoff = now.minus(WINDOW);
            // Remove expired timestamps
            while (!timestamps.isEmpty() && timestamps.peekFirst().isBefore(cutoff)) {
                timestamps.removeFirst();
            }

            // Check limit
            if (timestamps.size() >= MAX_ATTEMPTS) {
                return false;
            }

            // Add current timestamp
            timestamps.addLast(now);

            // Allow request
            return true;
        }
    }
}
