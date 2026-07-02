package services;

import dtos.user.CreateUserRequest;
import dtos.user.UpdateUserRequest;
import dtos.user.UserResponse;

import java.util.List;

public interface UserService {

    UserResponse create(CreateUserRequest dto);

    List<UserResponse> findAll(Long currentUserId, Long departmentId);

    UserResponse findById(Long id, Long currentUserId);

    UserResponse update(Long id, UpdateUserRequest dto);

    void delete(Long id);
}
