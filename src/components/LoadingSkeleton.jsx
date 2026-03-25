import React from 'react';

const LoadingSkeleton = ({ className = '', height = 'h-4', width = 'w-full' }) => {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className={`${height} ${width} bg-gray-200 rounded`}></div>
    </div>
  );
};

export const CardSkeleton = ({ lines = 3 }) => (
  <div className="bg-white shadow rounded-lg p-6">
    <LoadingSkeleton height="h-6" width="w-3/4" className="mb-4" />
    <div className="space-y-2">
      {Array.from({ length: lines }, (_, index) => (
        <LoadingSkeleton key={index} height="h-4" width={index === lines - 1 ? 'w-2/3' : 'w-full'} />
      ))}
    </div>
  </div>
);

export const ProfileSkeleton = () => (
  <div className="bg-white shadow rounded-lg">
    <div className="px-6 py-4 border-b border-gray-200">
      <LoadingSkeleton height="h-8" width="w-1/3" />
    </div>
    <div className="px-6 py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <LoadingSkeleton height="h-4" width="w-1/4" />
          <LoadingSkeleton height="h-10" width="w-full" />
          <LoadingSkeleton height="h-10" width="w-full" />
          <LoadingSkeleton height="h-10" width="w-full" />
        </div>
        <div className="space-y-4">
          <LoadingSkeleton height="h-4" width="w-1/4" />
          <LoadingSkeleton height="h-20" width="w-full" />
          <LoadingSkeleton height="h-10" width="w-full" />
        </div>
      </div>
    </div>
  </div>
);

export const DashboardSkeleton = () => (
  <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <CardSkeleton lines={4} />
        <CardSkeleton lines={3} />
        <CardSkeleton lines={5} />
        <div className="bg-white overflow-hidden shadow rounded-lg md:col-span-2 lg:col-span-3">
          <div className="p-6">
            <LoadingSkeleton height="h-6" width="w-1/4" className="mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Array.from({ length: 6 }, (_, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <LoadingSkeleton height="h-4" width="w-3/4" />
                  <LoadingSkeleton height="h-3" width="w-full" className="mt-2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const FormSkeleton = ({ fields = 4 }) => (
  <div className="space-y-6">
    {Array.from({ length: fields }, (_, index) => (
      <div key={index}>
        <LoadingSkeleton height="h-4" width="w-1/4" className="mb-2" />
        <LoadingSkeleton height="h-10" width="w-full" />
      </div>
    ))}
    <LoadingSkeleton height="h-12" width="w-1/3" />
  </div>
);

export const TableSkeleton = ({ rows = 5, columns = 4 }) => (
  <div className="bg-white shadow rounded-lg overflow-hidden">
    <div className="px-6 py-4 border-b border-gray-200">
      <LoadingSkeleton height="h-6" width="w-1/4" />
    </div>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {Array.from({ length: columns }, (_, index) => (
              <th key={index} className="px-6 py-3 text-left">
                <LoadingSkeleton height="h-4" width="w-20" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {Array.from({ length: rows }, (_, rowIndex) => (
            <tr key={rowIndex}>
              {Array.from({ length: columns }, (_, colIndex) => (
                <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                  <LoadingSkeleton height="h-4" width="w-24" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default LoadingSkeleton;
