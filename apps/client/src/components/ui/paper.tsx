import React from 'react';

import { cn } from '@/lib/utils';

const Paper = ({ className, children }: { className?: string; children: React.ReactNode }) => {
  return <div className={cn('bg-sidebar p-6 rounded-md shadow-md', className)}>{children}</div>;
};

export default Paper;
