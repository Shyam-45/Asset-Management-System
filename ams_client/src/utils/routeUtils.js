export const getDefaultRoute = (role) => {
  switch (role) {
    case "EMPLOYEE":
      return "/my-assets";

    case "ADMIN":
    case "MANAGER":
      return "/users";

    default:
      return "/";
  }
};