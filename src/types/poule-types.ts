import { Team } from './team-types';
import { MatchData } from '@/types/match-types';

export interface Poule {
  id: number;
  pouleName: string;
  teams: Team[];
  opponents: PouleOpponent[];
}

export interface PouleFormValues {
  pouleName: string;
  mainTeamName: string;
  opponents: string[];
  opponentName: string;
}

export interface PouleManagementClientProps {
  poules: Poule[];
  onToggleForm?: () => void;
  showAddPouleForm?: boolean;
}

export interface PouleOpponent {
  id: number;
  team: Team;
}

export interface PouleSelectorProps {
  poules: Poule[];
  selectedPoule: Poule | null;
  onPouleChange: (pouleId: number) => void;
}

export interface OpponentClientProps {
  matchData: MatchData[];
}

export interface OpponentSelectorProps {
  opponents: PouleOpponent[];
  selectedOpponent: PouleOpponent | null;
  onOpponentChange: (opponentId: number) => void;
}
