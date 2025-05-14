import { memo } from 'react';
import PinboardCard, { type PinboardCardProps } from '@/components/PinboardCard.tsx';

interface CardWallProps {
  cards: PinboardCardProps[];
}

function CardWall({ cards }: CardWallProps) {
  return (
    <div>
      {cards.map((card) => (
        <PinboardCard {...card} key={card.id} />
      ))}
    </div>
  );
}

export default memo(CardWall);
