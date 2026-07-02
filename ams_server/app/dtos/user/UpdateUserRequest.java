package dtos.user;

public class UpdateUserRequest {

//    private String email;
    private String role;
    private Long departmentId;

    public UpdateUserRequest() {
    }

//    public String getEmail() {
//        return email;
//    }

//    public void setEmail(
//            String email
//    ) {
//        this.email = email;
//
//    }

    public String getRole() {
        return role;
    }

    public void setRole(
            String role
    ) {
        this.role = role;
    }

    public Long getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(
            Long departmentId
    ) {
        this.departmentId = departmentId;
    }
}