function PostCardSkeleton() {
  return (
    <div className="relative bg-white rounded-2xl shadow-sm overflow-hidden animate-pulse">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="relative h-64 md:h-full bg-gray-200" />
        <div className="p-6 md:p-8 flex flex-col justify-center space-y-4">
          <div className="flex items-center space-x-4">
            <div className="h-6 w-20 bg-gray-200 rounded" />
            <div className="h-4 w-16 bg-gray-200 rounded" />
          </div>
          <div className="h-4 w-24 bg-gray-200 rounded" />
          <div className="h-8 w-3/4 bg-gray-200 rounded" />
          <div className="h-4 w-full bg-gray-200 rounded" />
          <div className="h-4 w-2/3 bg-gray-200 rounded" />
          <div className="h-4 w-32 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}

export function BlogResultsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-10">
      <PostCardSkeleton />
      <PostCardSkeleton />
      <PostCardSkeleton />
    </div>
  );
}
