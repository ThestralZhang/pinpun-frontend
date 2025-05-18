import { getPictures } from '@/api/picture.ts';
import PictureGallery from '@/components/PictureGallery.tsx';
import { HStack, IconButton, Input, Nav, SelectPicker } from 'rsuite';
import { useEffect, useState } from 'react';
import { RiSortAsc, RiSortDesc } from 'react-icons/ri';
import PinboardGallery from '@/components/PinboardGallery.tsx';
import { getPinboards } from '@/api/pinboard.tsx';

const sortOptions = [
  { label: 'Created Time', value: 'time' as const },
  { label: 'Likes', value: 'likes' as const },
  { label: 'Relevance', value: 'relevance' as const },
];

export default function Explore() {
  const [viewBy, setViewBy] = useState<'pin' | 'board'>('pin');
  const [sort, setSort] = useState<'time' | 'likes' | 'relevance'>('time');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(handler);
  }, [search]);

  const onChangeViewBy = (value: 'pin' | 'board') => {
    setViewBy(value);
    setSort('time');
    setOrder('desc');
    setSearch('');
  };

  const onChangeSort = (value: 'time' | 'likes' | 'relevance' | null) => {
    if (value === null) {
      return;
    }
    setSort(value);
    setOrder('desc');
  };

  const onToggleOrder = () => {
    setOrder((prev) => {
      if (prev === 'asc') {
        return 'desc';
      } else {
        return 'asc';
      }
    });
  };

  const onChangeSearch = (value: string) => {
    setSearch(value);
    setOrder('desc');
    setSort('relevance');
  };

  return (
    <div>
      <HStack className="w-full h-[60px] pr-[40px]">
        <Nav activeKey={viewBy} onSelect={onChangeViewBy} appearance="pills" className="ml-2">
          <Nav.Item eventKey="pin">Pins</Nav.Item>
          <Nav.Item eventKey="board">Pinboards</Nav.Item>
        </Nav>
        {viewBy === 'pin' && (
          <SelectPicker
            data={sortOptions}
            label="Sort by"
            searchable={false}
            cleanable={false}
            value={sort}
            onChange={onChangeSort}
          />
        )}
        {viewBy === 'pin' && (
          <IconButton
            onClick={onToggleOrder}
            icon={
              order === 'asc' ? (
                <RiSortAsc className="scale-180 text-blue-400" />
              ) : (
                <RiSortDesc className="scale-180 text-blue-400" />
              )
            }
          />
        )}
        <Input
          value={search}
          onChange={onChangeSearch}
          placeholder={viewBy === 'pin' ? 'Search pins by tags' : 'Search pinboards by titles'}
        />
      </HStack>
      {viewBy === 'pin' ? (
        <PictureGallery
          pageSize={30}
          fetchFn={getPictures}
          search={debouncedSearch}
          sort={`${sort},${order}`}
        />
      ) : (
        <PinboardGallery pageSize={30} fetchFn={getPinboards} search={debouncedSearch} />
      )}
    </div>
  );
}
