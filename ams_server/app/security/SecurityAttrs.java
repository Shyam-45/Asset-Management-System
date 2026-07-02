package security;

import enums.RoleType;
import play.libs.typedmap.TypedKey;

public final class SecurityAttrs {

    private SecurityAttrs() {
    }

    public static final TypedKey<Long> USER_ID = TypedKey.create("userId");

    public static final TypedKey<RoleType> ROLE = TypedKey.create("role");
}