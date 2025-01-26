'use client';

import { Accordion, AccordionItem } from '@heroui/react';
import React from 'react';

import {
  playerWelcomeMessage,
  playerCommunicationInstructions,
  playerVideoFeedbackInstructions,
  playerParticipationReportsInstructions,
} from '@/strings/playerinfoStrings';

const PlayerInstructions: React.FC = (): React.ReactElement => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-black-500">
      <div className="max-w-3xl w-full">
        <h1 className="text-2xl font-bold text-center text-brandcolor mb-4">
          Instructies voor Spelers
        </h1>
        <Accordion>
          <AccordionItem
            key="welcome"
            aria-label="Welkom Bericht"
            title="Welkom Bericht"
          >
            {playerWelcomeMessage}
          </AccordionItem>
          <AccordionItem
            key="communication"
            aria-label="Communicatie Instructies"
            title="Communicatie"
          >
            {playerCommunicationInstructions}
          </AccordionItem>
          <AccordionItem
            key="video-feedback"
            aria-label="Videofeedback Instructies"
            title="Videofeedback"
          >
            {playerVideoFeedbackInstructions}
          </AccordionItem>
          <AccordionItem
            key="participation-reports"
            aria-label="Deelname Rapporten Instructies"
            title="Deelname Rapporten"
          >
            {playerParticipationReportsInstructions}
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default PlayerInstructions;
