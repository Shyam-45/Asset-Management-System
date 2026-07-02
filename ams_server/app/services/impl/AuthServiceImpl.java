package services.impl;

import dtos.auth.AuthResponse;
import dtos.auth.LoginRequest;
import exceptions.BadRequestException;
import exceptions.UnauthorizedException;
import models.User;
import org.mindrot.jbcrypt.BCrypt;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import repositories.UserRepository;
import security.JwtService;
import services.AuthService;

import javax.inject.Inject;
import javax.inject.Singleton;

@Singleton
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final JwtService jwtService;

    private static final Logger logger = LoggerFactory.getLogger(AuthServiceImpl.class);

    @Inject
    public AuthServiceImpl(UserRepository userRepository, JwtService jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    @Override
    public AuthResponse login(LoginRequest dto) {

        if (dto.getUsername() == null || dto.getUsername().trim().isEmpty()) {
            throw new BadRequestException("Username is required");
        }

        if (dto.getPassword() == null || dto.getPassword().trim().isEmpty()) {
            throw new BadRequestException("Password is required");
        }

        String username = dto.getUsername().trim();
        String password = dto.getPassword().trim();

        User user = userRepository.findByUsername(username);

        if (user == null || !user.getIsActive()) {
            throw new UnauthorizedException("Invalid username or password");
        }

        boolean passwordMatches = BCrypt.checkpw(password, user.getPassword());

        if (!passwordMatches) {
            throw new UnauthorizedException("Invalid username or password");
        }

        String token = jwtService.generateToken(user.getId(), user.getRole());

        logger.info("User logged in successfully. id={}, username={}, role={}", user.getId(), user.getUsername(), user.getRole());

        return new AuthResponse(token);
    }
}