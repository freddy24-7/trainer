import { Card, CardHeader, CardBody, Button } from '@heroui/react';
import React from 'react';

import { OpponentsListProps } from '@/types/shared-types';

export const OpponentsList: React.FC<OpponentsListProps> = ({
  opponents,
  onRemove,
}) => (
  <Card className="mt-4">
    <CardHeader>
      <h4 className="text-md font-semibold">Opponents</h4>
    </CardHeader>
    <CardBody>
      <ul>
        {opponents.map((opponent, index) => (
          <li key={index} className="flex justify-between items-center py-2">
            <span>{opponent}</span>
            <Button
              type="button"
              onPress={() => onRemove(index)}
              className="text-red-500 ml-2"
              variant="ghost"
              size="sm"
            >
              Remove
            </Button>
          </li>
        ))}
      </ul>
    </CardBody>
  </Card>
);
