package actions;

import enums.RoleType;
import play.mvc.With;

import java.lang.annotation.*;

@With(RoleAction.class)
// tells to run this whenever annotation(RoleProtected) is used
@Target({ElementType.TYPE, ElementType.METHOD})
// on which types this authentication can be used [TYPE -> classes, interface, enum, METHOD -> individual methods]
@Retention(RetentionPolicy.RUNTIME)
// keep this authentication at run-time also
public @interface RoleProtected {
    RoleType[] value();
    //    It defines a custom annotation named @RoleProtected.
    //    By itself it does nothing.
    //    Its behavior comes from the annotations placed on it, @With(RoleAction.class)
}