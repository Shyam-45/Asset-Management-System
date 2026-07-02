package repositories;

import io.ebean.DB;
import models.User;

import javax.inject.Singleton;
import java.util.List;

@Singleton
public class UserRepository {

    public User save(User user) {
        DB.save(user);
        return user;
    }

    public User update(User user) {
        DB.update(user);
        return user;
    }

    public User findById(Long id) {
        return DB.find(User.class, id);
    }

    public List<User> findAllActive() {
        return DB.find(User.class).where().eq("isActive", true).findList();
    }

    public User findByUsername(String username) {
        return DB.find(User.class).where().ieq("username", username).findOne();
    }

    public User findByEmail(String email) {
        return DB.find(User.class).where().ieq("email", email).findOne();
    }

    public List<User> findByDepartmentId(Long departmentId) {

        return DB.find(User.class).where().eq("isActive", true).eq("department.id", departmentId).findList();
    }
}