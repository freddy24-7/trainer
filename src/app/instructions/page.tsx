import { Card, CardHeader, CardBody } from '@nextui-org/react';
import React from 'react';

export const dynamic = 'force-dynamic';

import ProtectedLayout from '@/app/ProtectedLayout';
import {
  instructionsWelcomeMessage,
  instructionsSignUpMessage,
  instructionsAccountManagementMessage,
  playerManagementInstructions,
  pouleManagementInstructions,
  matchManagementInstructions,
  trainingManagementInstructions,
  chatFunctionInstructions,
  playerAccessInstructions,
  appDesignInstructions,
} from '@/strings/instructionsStrings';

const Page: React.FC = (): React.ReactElement => {
  return (
    <ProtectedLayout requiredRole="TRAINER">
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <Card className="max-w-3xl">
          <CardHeader className="flex justify-center items-center">
            <h1 className="text-2xl font-bold text-brandcolor">
              Instructions for Trainers
            </h1>
          </CardHeader>
          <CardBody className="text-gray-500 space-y-4">
            <p>{instructionsWelcomeMessage}</p>
            <p>{instructionsSignUpMessage}</p>
            <p>{instructionsAccountManagementMessage}</p>
            <p>
              <strong>Player-Management:</strong> {playerManagementInstructions}
            </p>
            <p>
              <strong>Poule-Management:</strong> {pouleManagementInstructions}
            </p>
            <p>
              <strong>Match-Management:</strong> {matchManagementInstructions}
            </p>
            <p>
              <strong>Training-Management:</strong>{' '}
              {trainingManagementInstructions}
            </p>
            <p>
              <strong>Chat Function:</strong> {chatFunctionInstructions}
            </p>
            <p>{playerAccessInstructions}</p>
            <p>{appDesignInstructions}</p>
          </CardBody>
        </Card>
      </div>
    </ProtectedLayout>
  );
};

export default Page;
