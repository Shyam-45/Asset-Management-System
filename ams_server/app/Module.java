import com.google.inject.AbstractModule;

import services.*;
import services.impl.*;

public class Module extends AbstractModule {

    @Override
    protected void configure() {

        bind(DepartmentService.class).to(DepartmentServiceImpl.class);
        bind(UserService.class).to(UserServiceImpl.class);
        bind(AssetService.class).to(AssetServiceImpl.class);
        bind(AssetAssignmentService.class).to(AssetAssignmentServiceImpl.class);
        bind(MaintenanceRequestService.class).to(MaintenanceRequestServiceImpl.class);
        bind(AuthService.class).to(AuthServiceImpl.class);
        bind(RateLimitService.class).to(RateLimitServiceImpl.class);
    }
}