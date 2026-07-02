package mappers;

import dtos.user.CreateUserRequest;
import dtos.user.UserResponse;

import enums.RoleType;

import models.Department;
import models.User;

public class UserMapper {

    private UserMapper() {
    }

    public static UserResponse toResponse(User user) {

        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole().name());

        Department department = user.getDepartment();
        response.setDepartmentId(department != null ? department.getId() : null);
        response.setDepartmentName(department != null ? department.getName() : null);

        return response;
    }

    public static User toEntity(CreateUserRequest dto) {

        User user = new User();
        user.setUsername(dto.getUsername().trim().toLowerCase());
        user.setEmail(dto.getEmail().trim().toLowerCase());
//        user.setPassword(dto.getPassword().trim());
        user.setRole(RoleType.valueOf(dto.getRole().trim().toUpperCase()));

        return user;
    }
}