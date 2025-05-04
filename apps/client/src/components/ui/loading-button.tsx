import React from 'react';
import { Loader2 } from 'lucide-react';

import { Button } from './button';

type LoadingButtonProps = {
  loading?: boolean;
  children: React.ReactNode;
};

const LoadingButton = ({ loading, children, ...props }: React.ComponentProps<'button'> & LoadingButtonProps) => {
  return (
    <Button {...props} disabled={loading || props?.disabled}>
      {loading ? (
        <>
          <Loader2 className="size-4 animate-spin" /> Loading...
        </>
      ) : (
        children
      )}
    </Button>
  );
};

export default LoadingButton;
