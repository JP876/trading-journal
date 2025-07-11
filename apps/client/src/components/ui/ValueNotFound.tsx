import { X } from 'lucide-react';

import { cn } from '@/lib/utils';

const ValueNotFound = ({ className }: { className?: string }) => {
  return (
    <div className={cn('flex items-center', className)}>
      <X className=" w-5 h-5" />
    </div>
  );
};

export default ValueNotFound;
