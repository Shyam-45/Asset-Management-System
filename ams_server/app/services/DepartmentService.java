package services;

import dtos.department.CreateDepartmentRequest;
import dtos.department.DepartmentResponse;
import dtos.department.UpdateDepartmentRequest;

import java.util.List;

public interface DepartmentService {

    DepartmentResponse create(CreateDepartmentRequest dto);
    List<DepartmentResponse> findAll();
    DepartmentResponse findById(Long id);
    DepartmentResponse update(Long id, UpdateDepartmentRequest dto);
    void delete(Long id);
}
