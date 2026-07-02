package services;

import dtos.auth.AuthResponse;
import dtos.auth.LoginRequest;

public interface AuthService {

    AuthResponse login(LoginRequest dto);
}