import React from 'react';
import Loading from '@/components/global/Loading';

const AgencyLoading: React.FC = () => {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Loading />
    </div>
  );
};

export default AgencyLoading;
