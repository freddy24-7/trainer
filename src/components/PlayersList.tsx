import { Button, Card, CardHeader, CardBody, Divider } from '@nextui-org/react';
import React from 'react';

import { Player, PlayersListProps } from '@/types/user-types';

export default function PlayersList({
  players,
  onEdit,
  onDelete,
}: PlayersListProps): React.ReactElement {
  return (
    <ul className="space-y-2">
      {players.map((player: Player) => (
        <Card key={player.id} className="max-w-md mx-auto mb-4">
          <CardHeader className="flex justify-between items-center">
            <span className="text-md">{player.username}</span>
          </CardHeader>
          <Divider />
          <CardBody>
            <div className="flex justify-end space-x-2">
              <Button
                color="primary"
                onClick={() => onEdit(player)}
                className="text-sm px-2 py-1"
              >
                Edit
              </Button>
              <Button
                color="danger"
                onClick={() => onDelete(player.id)}
                className="text-sm px-2 py-1"
              >
                Delete
              </Button>
            </div>
          </CardBody>
        </Card>
      ))}
    </ul>
  );
}
