import { Button, Card, CardHeader, CardBody, Divider } from '@heroui/react';
import React from 'react';

import {
  groupChatLabel,
  editButtonLabel,
  deleteButtonLabel,
} from '@/strings/clientStrings';
import { Player, ExtendedPlayersListProps } from '@/types/user-types';

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
            onPress={() => onSelect?.(null)}
          >
            <CardHeader>
              <span className="text-md font-bold">{groupChatLabel}</span>
            </CardHeader>
          </Card>
        </li>
      )}

      {players.map((player: Player) => (
        <Card
          key={player.id}
          className="max-w-md mx-auto mb-4 cursor-pointer"
          onPress={() => onSelect?.(player.id)}
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
                    onPress={() => onEdit?.(player)}
                    className="text-sm px-2 py-1"
                  >
                    {editButtonLabel}
                  </Button>
                )}
                {onDelete && (
                  <Button
                    color="danger"
                    onPress={() => onDelete?.(player.id)}
                    className="text-sm px-2 py-1"
                  >
                    {deleteButtonLabel}
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
