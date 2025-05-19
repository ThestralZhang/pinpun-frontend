import Masonry from 'react-masonry-css';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useInfiniteQuery, useQueryClient, useQuery } from '@tanstack/react-query';
import { IconButton, Loader, VStack } from 'rsuite';
import type { IPinboardsPaged } from '@/types';
import { useEffect, useMemo, useRef, useState } from 'react';
import { getStreams } from '@/api/stream.ts';
import PinboardCard from '@/components/PinboardCard.tsx';
import { FaUpLong } from 'react-icons/fa6';
import { IoMdRefresh } from 'react-icons/io';

const breakpointCols = {
  default: 5,
  1400: 4,
  1200: 3,
  1000: 2,
  700: 1,
};

interface PinboardListParams {
  page: number;
  size: number;
  search?: string;
  stream?: string;
  userId?: number;
}

interface PinboardGalleryProps {
  params: Omit<PinboardListParams, 'page'>;
  fetchFn: (params: PinboardListParams) => Promise<IPinboardsPaged>;
}

export default function PinboardGallery({ params, fetchFn }: PinboardGalleryProps) {
  const queryClient = useQueryClient();
  const containerRef = useRef<HTMLDivElement>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onScroll = () => setShowBackToTop(el.scrollTop > 300);
    el.addEventListener('scroll', onScroll);
    return () => {
      el.removeEventListener('scroll', onScroll);
      queryClient.invalidateQueries({ queryKey: ['paged-pinboards'] });
    };
  }, []);

  const { data: streams } = useQuery({
    queryKey: ['streams'],
    queryFn: () => getStreams(),
  });

  const memoStreams = useMemo(() => (streams ? streams.map((s) => s.name) : []), []);

  const {
    data: infinitePinboardData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
  } = useInfiniteQuery<IPinboardsPaged>({
    queryKey: ['paged-pinboards', params],
    queryFn: ({ pageParam }) => fetchFn({ ...params, page: pageParam as number }),
    initialPageParam: 1,
    getNextPageParam: (lastPageData, allPageData) => {
      const next = allPageData.length + 1;
      return next <= lastPageData.totalPages ? next : undefined;
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  // Pull-to-refresh: re-fetch page 1
  const handleRefresh = async () => {
    queryClient.removeQueries({
      queryKey: ['paged-pinboards', params],
      exact: true,
    });
    await refetch();
  };

  const pinboards = useMemo(
    () => infinitePinboardData?.pages.flatMap((page) => page.data) ?? [],
    [infinitePinboardData?.pages],
  );

  if (isLoading) return <Loader center />;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <div
      id="pinboardGalleryContainer"
      ref={containerRef}
      className="h-screen overflow-y-auto overflow-x-hidden mr-7 px-3"
    >
      <InfiniteScroll
        dataLength={pinboards.length}
        next={() => fetchNextPage()}
        hasMore={hasNextPage}
        loader={<Loader />}
        scrollThreshold="200px"
        pullDownToRefresh
        pullDownToRefreshThreshold={50}
        refreshFunction={handleRefresh}
        pullDownToRefreshContent={
          <h4 style={{ textAlign: 'center' }}>&#8595; Pull down to refresh</h4>
        }
        releaseToRefreshContent={
          <h4 style={{ textAlign: 'center' }}>&#8593; Release to refresh</h4>
        }
        scrollableTarget="pictureGalleryContainer"
        className="overflow-x-hidden!"
      >
        <Masonry breakpointCols={breakpointCols} className="flex -mx-2" columnClassName="px-2">
          {pinboards.map((board) => (
            <div key={`board-${board.id}`}>
              <PinboardCard streams={memoStreams} className="mb-4" {...board} />
            </div>
          ))}
        </Masonry>

        {isFetchingNextPage && <Loader center style={{ margin: '1rem' }} />}
        {!hasNextPage && <div className="text-center p-4 mb-50">— end of list —</div>}
      </InfiniteScroll>
      <VStack className="fixed bottom-4 right-4">
        {showBackToTop && (
          <IconButton
            icon={<FaUpLong className="scale-125 text-blue-400" />}
            title="Back to Top"
            onClick={() => containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
          />
        )}
        <IconButton
          icon={<IoMdRefresh className="scale-150 text-blue-400" />}
          title="Refresh"
          onClick={handleRefresh}
        />
      </VStack>
    </div>
  );
}
