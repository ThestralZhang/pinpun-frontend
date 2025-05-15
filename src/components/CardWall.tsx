import { memo } from 'react';
import PinboardCard, { type PinboardCardProps } from '@/components/PinboardCard.tsx';

interface CardWallProps {
  cards: PinboardCardProps[];
  streams?: string[];
  onEditPinboard?: (pinboardId: number) => void;
  onFollow?: (pinboardId: number, streamName: string) => void;
}

function CardWall({ cards, streams, onFollow, onEditPinboard }: CardWallProps) {
  return (
    <div>
      {cards.map((card) => (
        <PinboardCard
          key={card.id}
          streams={streams}
          onFollow={onFollow}
          onEdit={onEditPinboard}
          {...card}
        />
      ))}
    </div>
  );
}

export default memo(CardWall);
