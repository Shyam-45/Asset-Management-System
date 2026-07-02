function Loader() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="flex items-center gap-3">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
        <span className="text-gray-600">Loading...</span>
      </div>
    </div>
  );
}

export default Loader;
