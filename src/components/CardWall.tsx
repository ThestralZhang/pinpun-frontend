import { memo } from 'react';
import PinboardCard, { type PinboardCardProps } from '@/components/PinboardCard.tsx';
import PictureCard, { type PictureCardProps } from '@/components/PictureCard.tsx';

interface CardWallProps {
  cards: (PinboardCardProps | PictureCardProps)[];
  streams?: string[];
  pinboards?: { id: number; name: string }[];
}

function CardWall({ cards, streams, pinboards }: CardWallProps) {
  return (
    <div>
      {cards.map((card) =>
        card.type === 'picture' ? (
          <PictureCard key={`pic-${card.pinboardId}-${card.id}`} pinboards={pinboards} {...card} />
        ) : (
          <PinboardCard key={`board-${card.id}`} streams={streams} {...card} />
        ),
      )}
    </div>
  );
}

export default memo(CardWall);
