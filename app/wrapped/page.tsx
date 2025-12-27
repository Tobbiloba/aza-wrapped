'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWrappedStore } from '@/store/wrapped-store';
import { WrappedContainer } from '@/components/wrapped/WrappedContainer';

export default function WrappedPage() {
  const router = useRouter();
  const { analysis } = useWrappedStore();

  // Redirect to home if no analysis data
  useEffect(() => {
    if (!analysis) {
      router.replace('/');
    }
  }, [analysis, router]);

  if (!analysis) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-center">
          <div className="animate-spin text-4xl mb-4">🔄</div>
          <p>Loading your wrapped...</p>
        </div>
      </div>
    );
  }

  return <WrappedContainer />;
}
