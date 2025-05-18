import Masonry from 'react-masonry-css';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useInfiniteQuery, useQueryClient, useQuery } from '@tanstack/react-query';
import { IconButton, Loader, VStack } from 'rsuite';
import type { IPicturesPaged, PictureSort } from '@/types';
import PictureCard from '@/components/PictureCard.tsx';
import { getPinboardsByUser } from '@/api/pinboard.tsx';
import { useAuthStore } from '@/stores/useAuthStore.ts';
import { useEffect, useMemo, useRef, useState } from 'react';
import { IoMdRefresh } from 'react-icons/io';
import { FaUpLong } from 'react-icons/fa6';

const breakpointCols = {
  default: 5,
  1400: 4,
  1200: 3,
  1000: 2,
  700: 1,
};

interface PictureGalleryProps {
  search?: string;
  sort?: PictureSort;
  pageSize: number;
  fetchFn: (params: {
    page: number;
    size: number;
    search?: string;
    sort?: PictureSort;
  }) => Promise<IPicturesPaged>;
}

export default function PictureGallery({ search, sort, pageSize, fetchFn }: PictureGalleryProps) {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const containerRef = useRef<HTMLDivElement>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onScroll = () => setShowBackToTop(el.scrollTop > 300);
    el.addEventListener('scroll', onScroll);
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  const { data: pinboards } = useQuery({
    queryKey: ['pinboards', { userId: user?.userId }],
    queryFn: () => getPinboardsByUser(user?.userId),
    select: (data) => data.map((b) => ({ id: b.id, name: b.title })),
  });

  const {
    data: infinitePictureData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
  } = useInfiniteQuery<IPicturesPaged>({
    queryKey: ['pictures', { search, sort }],
    queryFn: ({ pageParam }) =>
      fetchFn({ page: pageParam as number, size: pageSize, sort, search }),
    initialPageParam: 1,
    getNextPageParam: (lastPageData, allPageData) => {
      const next = allPageData.length + 1;
      return next <= lastPageData.totalPages ? next : undefined;
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  // Pull-to-refresh: re-fetch page 1
  const handleRefresh = async () => {
    queryClient.removeQueries({
      queryKey: ['pictures', { search, sort }],
      exact: true,
    });
    await refetch();
  };

  const pictures = useMemo(
    () => infinitePictureData?.pages.flatMap((page) => page.data) ?? [],
    [infinitePictureData?.pages],
  );

  if (isLoading) return <Loader center />;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <div
      id="pictureGalleryContainer"
      ref={containerRef}
      className="h-screen overflow-y-auto mr-7 px-3"
    >
      <InfiniteScroll
        dataLength={pictures.length}
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
      >
        <Masonry breakpointCols={breakpointCols} className="flex -mx-2" columnClassName="px-2">
          {pictures.map((pic) => (
            <div key={`pic-${pic.pinboardId}-${pic.id}`}>
              <PictureCard pinboards={pinboards} type="picture" className="mb-4" {...pic} />
            </div>
          ))}
        </Masonry>

        {isFetchingNextPage && <Loader center style={{ margin: '1rem' }} />}
        {!hasNextPage && <div className="text-center p-4">— end of list —</div>}
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
