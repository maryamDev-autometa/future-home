'use client';

import dynamic from 'next/dynamic';

const CoohomStyleDesigner = dynamic(() => import('../components/CoohomStyleDesigner'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading Coohom-Style Home Designer...</p>
      </div>
    </div>
  )
});

export default function Home() {
  return <CoohomStyleDesigner />;
}
