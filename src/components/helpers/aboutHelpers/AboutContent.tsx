'use client';

import { Accordion, AccordionItem } from '@heroui/react';
import React from 'react';

import {
  aboutAppOverview,
  aboutCoreFeatures,
  aboutDataPrivacy,
  aboutAccessibility,
  aboutUserExperience,
} from '@/strings/aboutStrings';

const AboutContent: React.FC = (): React.ReactElement => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-center text-brandcolor mb-4">
        Over deze Applicatie
      </h1>
      <Accordion>
        <AccordionItem
          key="overview"
          aria-label="Applicatie Overzicht"
          title="Applicatie Overzicht"
        >
          {aboutAppOverview}
        </AccordionItem>
        <AccordionItem
          key="features"
          aria-label="Belangrijkste Functionaliteiten"
          title="Belangrijkste Functionaliteiten"
        >
          {aboutCoreFeatures}
        </AccordionItem>
        <AccordionItem
          key="privacy"
          aria-label="Privacy en Gegevensbescherming"
          title="Privacy en Gegevensbescherming"
        >
          {aboutDataPrivacy}
        </AccordionItem>
        <AccordionItem
          key="accessibility"
          aria-label="Toegankelijkheid"
          title="Toegankelijkheid"
        >
          {aboutAccessibility}
        </AccordionItem>
        <AccordionItem
          key="user-experience"
          aria-label="Gebruikerservaring"
          title="Gebruikerservaring"
        >
          {aboutUserExperience}
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default AboutContent;
