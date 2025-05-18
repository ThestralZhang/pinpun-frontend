import { useState } from 'react';
import { TagPicker } from 'rsuite';
import { useQuery } from '@tanstack/react-query';
import { searchTag } from '@/api/picture.ts';
import { Spinner } from '@rsuite/icons';
import type { UseFormTrigger } from 'react-hook-form';
import type { IPictureFormInputs } from '@/types/picture.ts';

interface PictureTagPickerProps {
  value: string[];
  onChange: (value: string[]) => void;
  trigger: UseFormTrigger<IPictureFormInputs>;
  isEdit: boolean;
}

export default function PictureTagPicker({ value, onChange, trigger }: PictureTagPickerProps) {
  const [word, setWord] = useState('');
  const [cacheData, setCacheData] = useState<{ label: string; value: string }[]>([]);
  const { data: tags = [], isFetching } = useQuery({
    queryKey: ['tags', { word }],
    queryFn: () => searchTag(word),
    select: (data) => {
      return Array.from(new Set([...data, ...value])).map((t) => ({ label: t, value: t }));
    },
    enabled: !!word && word.length > 0,
    initialData: [],
  });

  return (
    <TagPicker
      creatable
      className="w-full"
      data={tags}
      cacheData={cacheData}
      value={value}
      onChange={onChange}
      onSearch={(w) => setWord(w)}
      onSelect={(_v, item) => {
        trigger('tags');
        setCacheData([...cacheData, { label: item.label as string, value: item.value }]);
      }}
      onClean={() => {
        trigger('tags');
      }}
      renderMenu={(menu) => {
        if (isFetching) {
          return (
            <p style={{ padding: 4, color: '#999', textAlign: 'center' }}>
              <Spinner spin /> Loading...
            </p>
          );
        }
        return menu;
      }}
    />
  );
}
