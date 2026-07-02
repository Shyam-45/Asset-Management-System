package mappers;

import dtos.department.CreateDepartmentRequest;
import dtos.department.DepartmentResponse;

import models.Department;

public class DepartmentMapper {

    private DepartmentMapper() {
    }

    public static DepartmentResponse toResponse(Department department) {

        DepartmentResponse response = new DepartmentResponse();
        response.setId(department.getId());
        response.setCode(department.getCode());
        response.setName(department.getName());
        response.setDescription(department.getDescription());

        return response;
    }

    public static Department toEntity(CreateDepartmentRequest dto) {

        Department department = new Department();
        department.setCode(dto.getCode().trim().toUpperCase());
        department.setName(dto.getName().trim());

        String description = dto.getDescription();
        department.setDescription(description == null || description.trim().isEmpty() ? null : description.trim());

        return department;
    }
}
