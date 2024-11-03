import { Button, Card, CardHeader, CardBody, Divider } from '@nextui-org/react';
import React from 'react';

import { Player } from '@/types/user-types';

interface ExtendedPlayersListProps {
  players: Player[];
  showGroupChatOption?: boolean;
  onSelect?: (id: number | null) => void;
  onEdit?: (player: Player) => void;
  onDelete?: (playerId: number) => void;
}

export default function PlayersList({
  players,
  showGroupChatOption = false,
  onSelect,
  onEdit,
  onDelete,
}: ExtendedPlayersListProps): React.ReactElement {
  return (
    <ul className="space-y-2">
      {showGroupChatOption && (
        <li>
          <Card
            className="max-w-md mx-auto mb-4 cursor-pointer"
            onClick={() => onSelect?.(null)}
          >
            <CardHeader>
              <span className="text-md font-bold">Group Chat</span>
            </CardHeader>
          </Card>
        </li>
      )}

      {players.map((player: Player) => (
        <Card
          key={player.id}
          className="max-w-md mx-auto mb-4 cursor-pointer"
          onClick={() => onSelect?.(player.id)}
        >
          <CardHeader className="flex justify-between items-center">
            <span className="text-md">{player.username}</span>
          </CardHeader>
          <Divider />
          <CardBody>
            {(onEdit || onDelete) && (
              <div className="flex justify-end space-x-2">
                {onEdit && (
                  <Button
                    color="primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(player);
                    }}
                    className="text-sm px-2 py-1"
                  >
                    Edit
                  </Button>
                )}
                {onDelete && (
                  <Button
                    color="danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(player.id);
                    }}
                    className="text-sm px-2 py-1"
                  >
                    Delete
                  </Button>
                )}
              </div>
            )}
          </CardBody>
        </Card>
      ))}
    </ul>
  );
}
