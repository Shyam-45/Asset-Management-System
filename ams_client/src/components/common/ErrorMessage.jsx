function ErrorMessage({ message }) {
  return (
    <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
      {message}
    </div>
  );
}

export default ErrorMessage;