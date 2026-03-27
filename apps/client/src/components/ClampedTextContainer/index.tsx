import { memo, useCallback, useEffect, useState } from 'react';
import Tooltip, { type TooltipProps } from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { ClampedText, type ClampedTextProps } from '../styledComps';

type ClampedTextContainerProps = { tooltipProps?: TooltipProps } & ClampedTextProps;

const ClampedTextContainer = ({ tooltipProps, ...rest }: ClampedTextContainerProps) => {
  const [show, setShow] = useState(false);
  const [itemEl, setItemEl] = useState<HTMLSpanElement | null>(null);

  const updateShow = useCallback((target: Element) => {
    const nextValue = (target?.scrollHeight + 2) / target?.clientHeight;
    setShow(nextValue >= 2);
  }, []);

  const renderTitle = useCallback((show: boolean, children: React.ReactNode) => {
    if (!show) return '';
    return (
      <Typography m={0.4} variant="body2">
        {children}
      </Typography>
    );
  }, []);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      if (itemEl) updateShow(itemEl);
    });

    const observeEl = itemEl?.firstChild;

    if (observeEl) {
      observer.observe(observeEl, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true,
      });
    }
    return () => {
      observer.disconnect();
    };
  }, [itemEl, updateShow]);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      const labelEl = entries?.[0]?.target;
      if (labelEl) updateShow(labelEl);
    });

    if (itemEl) resizeObserver.observe(itemEl);
    return () => {
      resizeObserver.disconnect();
    };
  }, [itemEl, updateShow]);

  return (
    <Tooltip arrow disableInteractive {...(tooltipProps || {})} title={renderTitle(show, rest?.children)}>
      <ClampedText {...rest} ref={setItemEl} />
    </Tooltip>
  );
};

export default memo(ClampedTextContainer);
