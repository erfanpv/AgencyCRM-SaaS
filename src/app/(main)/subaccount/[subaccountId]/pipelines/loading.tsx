import React from 'react';
import Loading from '@/components/global/Loading';

const PipelinesLoading: React.FC = () => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <Loading />
    </div>
  );
};

export default PipelinesLoading;
