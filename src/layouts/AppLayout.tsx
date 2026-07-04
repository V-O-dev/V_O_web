import React from "react";

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="app-frame">
      <main className="flex-1 overflow-y-auto w-full h-full">
        {children}
      </main>
    </div>
  );
};