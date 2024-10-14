import React from 'react';
import { Button, Card, CardHeader, CardBody, Divider } from '@nextui-org/react';
import { PlayersListProps, Player } from '@/types/type-list';

export default function PlayersList({
  players,
  onEdit,
  onDelete,
}: PlayersListProps) {
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
