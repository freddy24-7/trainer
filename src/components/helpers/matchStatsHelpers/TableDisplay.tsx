import React from 'react';

import PlayerAssistStatsTable from '@/components/helpers/matchStatsHelpers/PlayerAssistStatsTable';
import PlayerGoalStatsTable from '@/components/helpers/matchStatsHelpers/PlayerGoalStatsTable';
import PlayerInTacticalStatsTable from '@/components/helpers/matchStatsHelpers/PlayerInTacticalStatsTable';
import PlayerOpponentStatsTable from '@/components/helpers/matchStatsHelpers/PlayerOpponentStatsTable';
import PlayerOutFitnessStatsTable from '@/components/helpers/matchStatsHelpers/PlayerOutFitnessStatsTable';
import PlayerSubstitutionInjuryStatsTable from '@/components/helpers/matchStatsHelpers/PlayerOutInjuryStat';
import PlayerOutTacticalStatsTable from '@/components/helpers/matchStatsHelpers/PlayerOutTacticalStatsTable';
import { TableDisplayProps } from '@/types/stats-types';

const TableDisplay: React.FC<TableDisplayProps> = ({
  opponentStatsWithAverages,
  processedGoalStatsData,
  processedAssistStatsData,
  processedSubstitutionStatsData,
  processedSubstitutionInjuryStatsData,
  processedSubstitutionTacticalStatsData,
  processedSubstitutionInTacticalStatsData,
}) => {
  return (
    <>
      <div className="mt-8 w-full max-w-4xl">
        <PlayerOpponentStatsTable playerStats={opponentStatsWithAverages} />
      </div>
      <div className="mt-8 w-full max-w-4xl">
        <PlayerGoalStatsTable goalStats={processedGoalStatsData} />
      </div>
      <div className="mt-8 w-full max-w-4xl">
        <PlayerAssistStatsTable assistStats={processedAssistStatsData} />
      </div>
      <div className="mt-8 w-full max-w-4xl">
        <PlayerOutFitnessStatsTable
          substitutionStats={processedSubstitutionStatsData}
        />
      </div>
      <div className="mt-8 w-full max-w-4xl">
        <PlayerSubstitutionInjuryStatsTable
          substitutionStats={processedSubstitutionInjuryStatsData}
        />
      </div>
      <div className="mt-8 w-full max-w-4xl">
        <PlayerOutTacticalStatsTable
          substitutionStats={processedSubstitutionTacticalStatsData}
        />
      </div>
      <div className="mt-8 w-full max-w-4xl">
        <PlayerInTacticalStatsTable
          substitutionStats={processedSubstitutionInTacticalStatsData}
        />
      </div>
    </>
  );
};

export default TableDisplay;
