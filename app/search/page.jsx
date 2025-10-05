'use client';

import { Suspense } from 'react';
import SearchPage from './SearchPage';

export default function SearchPageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchPage />
    </Suspense>
  );
}