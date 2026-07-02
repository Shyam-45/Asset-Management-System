package repositories;

import io.ebean.DB;
import models.Department;

import javax.inject.Singleton;
import java.util.List;

@Singleton
public class DepartmentRepository {

    public Department save(Department department) {
        DB.save(department);
        return department;
    }

    public Department update(Department department) {
        DB.update(department);
        return department;
    }

    public Department findById(Long id) {
        return DB.find(Department.class, id);
    }

    public List<Department> findAllActive() {
        return DB.find(Department.class).where().eq("isActive", true).findList();
    }

    public Department findByCode(String code) {
        return DB.find(Department.class).where().eq("code", code).eq("isActive", true).findOne();
    }

    public Department findByName(String name) {
        return DB.find(Department.class).where().ieq("name", name).eq("isActive", true).findOne();
    }
}