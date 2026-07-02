package services.impl;

import dtos.user.CreateUserRequest;
import dtos.user.UpdateUserRequest;
import dtos.user.UserResponse;
import enums.RoleType;
import exceptions.BadRequestException;
import exceptions.NotFoundException;
import exceptions.UnauthorizedException;
import mappers.UserMapper;
import models.Department;
import models.User;
import org.mindrot.jbcrypt.BCrypt;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import repositories.DepartmentRepository;
import repositories.UserRepository;
import services.UserService;

import javax.inject.Inject;
import javax.inject.Singleton;
import java.util.List;
import java.util.stream.Collectors;

@Singleton
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;

    private static final Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);

    @Inject
    public UserServiceImpl(UserRepository userRepository, DepartmentRepository departmentRepository) {
        this.userRepository = userRepository;
        this.departmentRepository = departmentRepository;
    }

    @Override
    public UserResponse create(CreateUserRequest dto) {

        if (dto.getUsername() == null || dto.getUsername().trim().isEmpty()) {
            throw new BadRequestException("Username is required");
        }

        if (dto.getEmail() == null || dto.getEmail().trim().isEmpty()) {
            throw new BadRequestException("Email is required");
        }

        if (dto.getPassword() == null || dto.getPassword().trim().isEmpty()) {
            throw new BadRequestException("Password is required");
        }

        if (dto.getRole() == null || dto.getRole().trim().isEmpty()) {
            throw new BadRequestException("Role is required");
        }

        String username = dto.getUsername().trim().toLowerCase();
        String email = dto.getEmail().trim().toLowerCase();

        if (userRepository.findByUsername(username) != null) {
            throw new BadRequestException("Username already exists");
        }

        if (userRepository.findByEmail(email) != null) {
            throw new BadRequestException("Email already exists");
        }

        RoleType role;

        try {
            role = RoleType.valueOf(dto.getRole().trim().toUpperCase());
        } catch (Exception ex) {
            throw new BadRequestException("Invalid role");
        }

        Department department = validateDepartment(role, dto.getDepartmentId());

        User user = UserMapper.toEntity(dto);
        user.setPassword(BCrypt.hashpw(dto.getPassword().trim(), BCrypt.gensalt()));
        user.setDepartment(department);

        userRepository.save(user);

        logger.info("User created successfully. id={}, username={}, role={}", user.getId(), user.getUsername(), user.getRole());

        return UserMapper.toResponse(user);
    }

    @Override
    public UserResponse findById(Long id, Long currentUserId) {

        User user = userRepository.findById(id);
        if (user == null || !user.getIsActive()) {
            throw new NotFoundException("User not found");
        }

        User currentUser = userRepository.findById(currentUserId);
//        if (currentUser == null || !currentUser.getIsActive()) {
//            throw new NotFoundException("Current user not found");
//        }

        if (currentUser.getRole() == RoleType.ADMIN) {
            return UserMapper.toResponse(user);
        }

        if (currentUser.getRole() == RoleType.MANAGER) {

            boolean sameDepartment = user.getDepartment() != null && currentUser.getDepartment() != null && user.getDepartment().getId().equals(currentUser.getDepartment().getId());
            if (!user.getId().equals(currentUserId) && !sameDepartment) {
                throw new UnauthorizedException("Not authorized");
            }
            return UserMapper.toResponse(user);
        }

        if (!user.getId().equals(currentUserId)) {
            throw new UnauthorizedException("Not authorized");
        }

        return UserMapper.toResponse(user);
    }

    @Override
    public UserResponse update(Long id, UpdateUserRequest dto) {

        if (dto.getRole() == null && dto.getDepartmentId() == null) {
            throw new BadRequestException("No fields provided for update");
        }

        User user = userRepository.findById(id);
        if (user == null || !user.getIsActive()) {
            throw new NotFoundException("User not found");
        }

        RoleType role = user.getRole();

        if (dto.getRole() != null && !dto.getRole().trim().isEmpty()) {
            try {
                role = RoleType.valueOf(dto.getRole().trim().toUpperCase());

            } catch (Exception ex) {
                throw new BadRequestException("Invalid role");
            }
            user.setRole(role);
        }

        Long departmentId;
        if (role == RoleType.ADMIN) {
            departmentId = null;
        } else if (dto.getDepartmentId() != null) {
            departmentId = dto.getDepartmentId();
        } else {
            departmentId = user.getDepartment() != null ? user.getDepartment().getId() : null;
        }

        if (dto.getRole() != null || dto.getDepartmentId() != null) {
            Department department = validateDepartment(role, departmentId);
            user.setDepartment(department);
        }

        userRepository.update(user);

        logger.info("User updated successfully. id={}, role={}", user.getId(), user.getRole());

        return UserMapper.toResponse(user);
    }

    @Override
    public void delete(Long id) {

        User user = userRepository.findById(id);
        if (user == null || !user.getIsActive()) {
            throw new NotFoundException("User not found");
        }

        user.setIsActive(false);

        userRepository.update(user);

        logger.info("User deleted successfully. id={}, username={}", user.getId(), user.getUsername());
    }

    private Department validateDepartment(RoleType role, Long departmentId) {

        if (role == RoleType.ADMIN) {
            if (departmentId != null) {
                throw new BadRequestException("ADMIN cannot belong to a department");
            }
            return null;
        }

        if (departmentId == null) {
            throw new BadRequestException("Department is required for " + role.name());
        }

        Department department = departmentRepository.findById(departmentId);

        if (department == null || !department.getIsActive()) {
            throw new NotFoundException("Department not found");
        }

        return department;
    }

    @Override
    public List<UserResponse> findAll(Long currentUserId, Long departmentId) {

        User currentUser = userRepository.findById(currentUserId);

//        if (currentUser == null || !currentUser.getIsActive()) {
//            throw new NotFoundException("Current user not found");
//        }

        if (currentUser.getRole() == RoleType.MANAGER) {

            Long managerDepartmentId = currentUser.getDepartment().getId();
            if (departmentId != null && !departmentId.equals(managerDepartmentId)) {
                throw new UnauthorizedException("Not authorized to access other department users");
            }
            departmentId = managerDepartmentId;
        }

        List<User> users;

        if (departmentId == null) {
            users = userRepository.findAllActive();
        } else {
            users = userRepository.findByDepartmentId(departmentId);
        }

        return users.stream().map(UserMapper::toResponse).collect(Collectors.toList());
    }
}