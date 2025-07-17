import React, { useEffect, useState } from 'react';
import { Box, type BoxProps, Tooltip, type TooltipProps, Typography } from '@mui/material';

export const getLineClamp = (num: number) => ({
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: `${num}`,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

type CommonProps = {
  label: string | React.ReactNode | (() => string) | (() => React.ReactNode);
  tooltipProps?: Omit<TooltipProps, 'children'>;
};

type ItemTooltipProps = {
  itemEl: HTMLElement | null;
  children: React.ReactElement<unknown, any>;
} & CommonProps;

type LineClampProps = {
  boxProps?: BoxProps;
  maxNumOfRows?: number;
  children: React.ReactNode;
} & CommonProps;

export const ItemTooltip = ({ itemEl, label, tooltipProps, children }: ItemTooltipProps) => {
  const [show, setShow] = useState(false);

  const newLabel = (() => {
    if (typeof label === 'function') return label();
    return (
      <Typography p={0.5} variant="body2">
        {label}
      </Typography>
    );
  })();

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      const labelEl = entries?.[0]?.target;
      if (labelEl) {
        setShow(labelEl?.clientHeight !== labelEl?.scrollHeight);
      }
    });

    if (itemEl) resizeObserver.observe(itemEl);
    return () => {
      if (itemEl) resizeObserver.disconnect();
    };
  }, [itemEl]);

  return (
    <Tooltip arrow disableInteractive {...(tooltipProps || {})} title={show ? newLabel : ''}>
      {children}
    </Tooltip>
  );
};

const LineClamp = ({ label, tooltipProps, boxProps, maxNumOfRows, children }: LineClampProps) => {
  const [itemEl, setItemEl] = useState<HTMLElement | null>(null);

  return (
    <ItemTooltip {...(tooltipProps || {})} itemEl={itemEl} label={label}>
      <Box {...boxProps} ref={setItemEl} sx={[{ wordBreak: 'break-all', ...getLineClamp(maxNumOfRows || 1) }]}>
        {children}
      </Box>
    </ItemTooltip>
  );
};

export default LineClamp;
