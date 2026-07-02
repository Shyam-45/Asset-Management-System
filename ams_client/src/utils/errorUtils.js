export const getErrorMessage = (error) => {
  const status = error?.response?.status;

  if (
    status === 400 ||
    status === 401 ||
    status === 403 ||
    status === 404 ||
    status === 409 ||
    status === 429
  ) {
    return (
      error?.response?.data?.message ||
      "Request failed"
    );
  }

  return "Something went wrong. Please try again later.";
};