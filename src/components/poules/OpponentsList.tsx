import { Card, CardHeader, CardBody } from '@nextui-org/react';
import React from 'react';

import { Button } from '@/components/ui/button';
import type { OpponentsListProps } from '@/types/types';

function OpponentsList({
  opponents,
  removeOpponent,
}: OpponentsListProps): React.ReactElement | null {
  if (opponents.length === 0) return null;

  return (
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
                onClick={() => removeOpponent(index)}
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
}

export default OpponentsList;
