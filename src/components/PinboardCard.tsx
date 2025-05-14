import { memo } from 'react';
import { Card, Text } from 'rsuite';
import type { IPinboardExtended } from '@/types';

export interface PinboardCardProps extends IPinboardExtended {
  streams?: string[];
  onEdit?: (pinboardId: number) => void;
}

function PinboardCard(props: PinboardCardProps) {
  return (
    <Card width={320} className="pinboard-card rounded-2xl!" shaded="hover">
      <Card.Header as="h5">{props.title}</Card.Header>
      <Card.Body>{props.description}</Card.Body>
      <Card.Footer>
        <Text muted>{props.createdAt?.toLocaleTimeString()}</Text>
      </Card.Footer>
    </Card>
  );
}

export default memo(PinboardCard);
