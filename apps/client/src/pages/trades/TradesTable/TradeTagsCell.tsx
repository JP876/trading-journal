import { useEffect, useRef, useState } from 'react';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import { useQuery } from '@tanstack/react-query';

import checkBrightness from '../../../lib/checkBrighness';
import { QueryKey } from '../../../enums';
import { getTags } from '../../../api/tags';
import type { Tag } from '../../../types/tag';

const TradeTagsCell = ({ tags }: { tags: number[] }) => {
  const [visibleTagsCount, setVisibleTagsCount] = useState(tags.length);
  const [tagsWidth, setTagsWidth] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);

  const tagsQuery = useQuery({ queryKey: [QueryKey.TAGS], queryFn: () => getTags(), staleTime: Infinity });

  const tagsData: Tag[] = (() => {
    if (!tagsQuery.data?.results || tags.length === 0) return [];
    return tags.reduce((acc: Tag[], tagId) => {
      const tag = tagsQuery.data.results.find((el) => el.id === tagId);
      return tag?.id ? [...acc, { ...tag }] : acc;
    }, []);
  })();

  const chipPositionInfo = (() => {
    if (!tagsWidth) return { left: 0 };
    const left = tagsWidth
      .split(',')
      .splice(0, visibleTagsCount)
      .reduce((acc, el) => +acc + +el, 0);
    return { left: left + visibleTagsCount * 8 };
  })();

  const renderHiddenTags = () => {
    if (!Array.isArray(tags) || visibleTagsCount === tags.length) return '';
    return (
      <Stack gap={1} my={0.4}>
        {tagsData.slice(visibleTagsCount, tagsData.length).map((tag) => (
          <Chip
            key={tag.id}
            label={tag.title}
            sx={(theme) => ({
              backgroundColor: tag.color,
              height: '1.5rem',
              color: checkBrightness(tag.color) ? theme.palette.common.white : theme.palette.common.black,
            })}
          />
        ))}
      </Stack>
    );
  };

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      if (!containerRef.current) return;

      const { scrollHeight, clientHeight, clientWidth, children } = containerRef.current;

      if (scrollHeight <= clientHeight) {
        setVisibleTagsCount(tags.length);
        return;
      }

      const childrenArr = [...children];
      const obj = { width: 8, count: 0 };

      setTagsWidth(childrenArr.map((child) => child.clientWidth).join(','));

      for (let i = 0; i < childrenArr.length; i++) {
        const child = childrenArr[i];
        const nextWidth = obj.width + child.clientWidth;

        if (nextWidth > clientWidth) break;

        obj.width = nextWidth + obj.count * 8;
        obj.count = obj.count + 1;
      }

      setVisibleTagsCount(obj.count);
    });

    if (containerRef.current) resizeObserver.observe(containerRef.current);
    return () => {
      resizeObserver.disconnect();
    };
  }, [tags]);

  return (
    <Box sx={{ width: '100%', position: 'relative' }}>
      <Stack
        ref={containerRef}
        direction="row"
        alignItems="center"
        gap={1}
        sx={(theme) => ({
          flexWrap: 'wrap',
          height: '1.5rem',
          overflow: 'hidden',
          width: '90%',
          opacity: +!!visibleTagsCount,
          transition: theme.transitions.create(['opacity']),
        })}
      >
        {tagsData.map((tag) => (
          <Chip
            key={tag.id}
            label={tag.title}
            sx={(theme) => ({
              backgroundColor: tag.color,
              height: '1.5rem',
              color: checkBrightness(tag.color) ? theme.palette.common.white : theme.palette.common.black,
            })}
          />
        ))}
      </Stack>
      <Tooltip arrow disableInteractive title={renderHiddenTags()}>
        <Chip
          label="..."
          sx={(theme) => ({
            opacity: +(tags.length !== visibleTagsCount),
            height: '1.5rem',
            position: 'absolute',
            top: 0,
            left: chipPositionInfo.left,
            transition: theme.transitions.create(['left', 'opacity'], {
              duration: theme.transitions.duration.shortest,
            }),
          })}
        />
      </Tooltip>
    </Box>
  );
};

export default TradeTagsCell;
