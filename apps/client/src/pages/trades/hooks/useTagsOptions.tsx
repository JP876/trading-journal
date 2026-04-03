import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import type { Tag } from '../../../types/tag';
import { QueryKey } from '../../../enums';
import { getTags } from '../../../api/tags';
import type { SelectOption } from '../../../types';

const useTagsOptions = () => {
  const tagsQuery = useQuery<Tag[]>({
    queryKey: [QueryKey.TAGS],
    queryFn: () => getTags(),
    staleTime: Infinity,
  });

  return useMemo<SelectOption[]>(() => {
    if (!Array.isArray(tagsQuery.data)) return [];
    return tagsQuery.data.map((tag) => ({ value: tag.id, label: tag.title, chipBackground: tag.color }));
  }, [tagsQuery.data]);
};

export default useTagsOptions;
