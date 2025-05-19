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

interface PictureListParams {
  page: number;
  size: number;
  sort?: PictureSort;
  search?: string;
  stream?: string;
  userId?: number;
  pinboardId?: number;
}

interface PictureGalleryProps {
  params: Omit<PictureListParams, 'page'>;
  fetchFn: (params: PictureListParams) => Promise<IPicturesPaged>;
}

export default function PictureGallery({ params, fetchFn }: PictureGalleryProps) {
  const loginUser = useAuthStore((s) => s.user);
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
    queryKey: ['pinboards', { userId: loginUser?.userId }],
    queryFn: () => getPinboardsByUser(loginUser?.userId),
  });

  const pinboardList = useMemo<{ id: number; name: string }[]>(
    () => (pinboards ? pinboards.map((b) => ({ id: b.id, name: b.title })) : []),
    [pinboards],
  );

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
    queryKey: ['paged-pictures', params],
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
      queryKey: ['paged-pictures', params],
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
      className="h-screen overflow-y-auto overflow-x-hidden mr-7 px-3"
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
        className="overflow-x-hidden!"
      >
        <Masonry breakpointCols={breakpointCols} className="flex -mx-2" columnClassName="px-2">
          {pictures.map((pic) => (
            <div key={`pic-${pic.pinboardId}-${pic.id}`}>
              <PictureCard pinboards={pinboardList} className="mb-4" {...pic} />
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
