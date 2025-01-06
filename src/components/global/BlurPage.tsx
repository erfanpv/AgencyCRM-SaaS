import React from 'react';

const BlurPage: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <div
      className="scrollbar scrollbar-thumb-muted-foreground/20 scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-medium absolute bottom-0 left-0 right-0 top-0 z-[11] mx-auto h-screen overflow-auto bg-muted/60 p-4 pt-24 backdrop-blur-[35px] dark:bg-muted/40 dark:shadow-2xl dark:shadow-black"
      id="blur-page" // for portals
    >
      {children}
    </div>
  );
};

export default BlurPage;
