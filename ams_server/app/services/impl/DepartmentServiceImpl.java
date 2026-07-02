package services.impl;

import dtos.department.CreateDepartmentRequest;
import dtos.department.DepartmentResponse;
import dtos.department.UpdateDepartmentRequest;
import exceptions.BadRequestException;
import exceptions.NotFoundException;
import mappers.DepartmentMapper;
import models.Department;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import repositories.DepartmentRepository;
import services.DepartmentService;

import javax.inject.Inject;
import javax.inject.Singleton;
import java.util.List;
import java.util.stream.Collectors;

@Singleton
public class DepartmentServiceImpl implements DepartmentService {

    private final DepartmentRepository repository;

    private static final Logger logger = LoggerFactory.getLogger(DepartmentServiceImpl.class);

    @Inject
    public DepartmentServiceImpl(DepartmentRepository repository) {
        this.repository = repository;
    }


    @Override
    public DepartmentResponse create(CreateDepartmentRequest dto) {

        if (dto.getCode() == null || dto.getCode().trim().isEmpty()) {
            throw new BadRequestException("Department code is required");
        }

        if (dto.getName() == null || dto.getName().trim().isEmpty()) {
            throw new BadRequestException("Department name is required");
        }

        if (repository.findByCode(dto.getCode().trim().toUpperCase()) != null) {
            throw new BadRequestException("Department code already exists");
        }

        if (repository.findByName(dto.getName().trim()) != null) {
            throw new BadRequestException("Department name already exists");
        }

        Department department = DepartmentMapper.toEntity(dto);
        repository.save(department);

        logger.info("Department created successfully. id={}, code={}, name={}", department.getId(), department.getCode(), department.getName());

        return DepartmentMapper.toResponse(department);
    }

    @Override
    public List<DepartmentResponse> findAll() {

        return repository.findAllActive().stream().map(DepartmentMapper::toResponse).collect(Collectors.toList());
    }

    @Override
    public DepartmentResponse findById(Long id) {

        Department department = repository.findById(id);

        if (department == null || !department.getIsActive()) {
            throw new NotFoundException("Department not found");
        }

        return DepartmentMapper.toResponse(department);
    }

    @Override
    public DepartmentResponse update(Long id, UpdateDepartmentRequest dto) {

        if ((dto.getName() == null || dto.getName().trim().isEmpty()) && dto.getDescription() == null) {
            throw new BadRequestException("No fields provided for update");
        }

        Department department = repository.findById(id);

        if (department == null || !department.getIsActive()) {
            throw new NotFoundException("Department not found");
        }

        if (dto.getName() != null && !dto.getName().trim().isEmpty()) {
            Department existing = repository.findByName(dto.getName().trim());
            if (existing != null && !existing.getId().equals(id)) {
                throw new BadRequestException("Department name already exists");
            }
            department.setName(dto.getName().trim());
        }

        if (dto.getDescription() != null) {
            department.setDescription(dto.getDescription());
        }

        repository.update(department);

        logger.info("Department updated successfully. id={}, name={}", department.getId(), department.getName());

        return DepartmentMapper.toResponse(department);
    }

    @Override
    public void delete(Long id) {

        Department department = repository.findById(id);

        if (department == null || !department.getIsActive()) {
            throw new NotFoundException("Department not found");
        }

        department.setIsActive(false);
        repository.update(department);

        logger.info("Department deleted successfully. id={}, name={}", department.getId(), department.getName());
    }
}