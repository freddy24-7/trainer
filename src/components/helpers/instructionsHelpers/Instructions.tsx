'use client';

import { Accordion, AccordionItem } from '@heroui/react';
import React from 'react';

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

const Instructions: React.FC = (): React.ReactElement => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-black-500">
      <div className="max-w-3xl w-full">
        <h1 className="text-2xl font-bold text-center text-brandcolor mb-4">
          Instructions for Trainers
        </h1>
        <Accordion>
          <AccordionItem
            key="welcome"
            aria-label="Welcome Instructions"
            title="Welcome Message"
          >
            {instructionsWelcomeMessage}
          </AccordionItem>
          <AccordionItem
            key="signup"
            aria-label="Signup Instructions"
            title="Sign-Up Instructions"
          >
            {instructionsSignUpMessage}
          </AccordionItem>
          <AccordionItem
            key="account"
            aria-label="Account Management Instructions"
            title="Account Management"
          >
            {instructionsAccountManagementMessage}
          </AccordionItem>
          <AccordionItem
            key="player-management"
            aria-label="Player Management Instructions"
            title="Player Management"
          >
            {playerManagementInstructions}
          </AccordionItem>
          <AccordionItem
            key="poule-management"
            aria-label="Poule Management Instructions"
            title="Poule Management"
          >
            {pouleManagementInstructions}
          </AccordionItem>
          <AccordionItem
            key="match-management"
            aria-label="Match Management Instructions"
            title="Match Management"
          >
            {matchManagementInstructions}
          </AccordionItem>
          <AccordionItem
            key="training-management"
            aria-label="Training Management Instructions"
            title="Training Management"
          >
            {trainingManagementInstructions}
          </AccordionItem>
          <AccordionItem
            key="chat-function"
            aria-label="Chat Function Instructions"
            title="Chat Function"
          >
            {chatFunctionInstructions}
          </AccordionItem>
          <AccordionItem
            key="player-access"
            aria-label="Player Access Instructions"
            title="Player Access"
          >
            {playerAccessInstructions}
          </AccordionItem>
          <AccordionItem
            key="app-design"
            aria-label="App Design Instructions"
            title="App Design"
          >
            {appDesignInstructions}
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default Instructions;
