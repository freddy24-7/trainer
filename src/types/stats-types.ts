import {
  BaseMatch,
  MatchData,
  BaseMatchEvent,
  BaseMatchPlayer,
  OpponentStrength,
  PlayerMatchData,
} from '@/types/match-types';
import { PlayerAttendance, TrainingData } from '@/types/training-types';
import { MatchDataEntry, SignedInUser } from '@/types/user-types';

export interface PlayerMatchStat {
  id: number;
  username: string | null;
  matchData: {
    id: number;
    date: Date | undefined;
    minutes: number;
    available: boolean;
    goals: number;
    assists: number;
  }[];
}

export interface PlayerStat {
  id: number;
  username: string | null;
  matchesPlayed: number;
  averagePlayingTime: number;
  absences: number;
  goals: number;
  assists: number;
  matchData?: MatchDataEntry[];
}

export interface PlayerStatsTableProps {
  playerStats: PlayerStat[];
}

export type GetPlayerMatchStatsResponse =
  | { success: true; playerStats: PlayerMatchOwnStat[] }
  | { success: false; error: string };

interface PlayerMatchOwnStat {
  id: number;
  username: string;
  matchesPlayed: number;
  averagePlayingTime: number;
  absences: number;
  matchData?: {
    id: number;
    matchId: number;
    userId: number;
    minutes: number;
    available: boolean;
  }[];
}

export interface ProcessedPlayerStat {
  id: number;
  username: string | null;
  matchesPlayed: number;
  averagePlayingTime: number;
  absences: number;
  goals: number;
  assists: number;
}

export interface ProcessedSubstitutionStat {
  id: number;
  username: string | null;
  substitutionsAgainstStronger: number;
  substitutionsAgainstSimilar: number;
  substitutionsAgainstWeaker: number;
  totalSubstitutions: number;
}

export interface ProcessedGoalStat {
  id: number;
  username: string | null;
  goalsAgainstStronger: number;
  goalsAgainstSimilar: number;
  goalsAgainstWeaker: number;
  totalGoals: number;
}

export interface ProcessedAssistStat {
  id: number;
  username: string | null;
  assistsAgainstStronger: number;
  assistsAgainstSimilar: number;
  assistsAgainstWeaker: number;
  totalAssists: number;
}

export interface TableDisplayProps {
  opponentStatsWithAverages: PlayerOpponentStat[];
  processedGoalStatsData: ProcessedGoalStat[];
  processedAssistStatsData: ProcessedAssistStat[];
  processedSubstitutionStatsData: ProcessedSubstitutionStat[];
  processedSubstitutionInjuryStatsData: ProcessedSubstitutionStat[];
  processedSubstitutionTacticalStatsData: ProcessedSubstitutionStat[];
  processedSubstitutionInTacticalStatsData: ProcessedSubstitutionStat[];
}

export interface MatchStatsTableProps {
  totalMatches: number;
  matchesPlayed: number;
  avgMinutesPlayed: number;
}

export interface MyStatsWrapperProps {
  user: SignedInUser;
  initialTrainingData: TrainingData[];
  initialAttendanceList: PlayerAttendance[];
  initialPlayerStats: PlayerStat[];
  initialMatchData: MatchData[];
}

export interface MatchDataHelper extends BaseMatch {
  pouleOpponent: {
    team: {
      name: string | null;
    } | null;
  };
  matchPlayers: {
    user: {
      username: string | null;
    };
  }[];
}

export interface PlayerOpponentStat {
  id: number;
  username: string | null;
  avgMinutes?: number;
  avgMinutesStronger: number;
  avgMinutesSimilar: number;
  avgMinutesWeaker: number;
}

export interface PlayerOpponentStatData {
  id: number;
  username: string | null;
  matchData: BaseMatchStat[];
}

export interface GoalsByPlayerStatData {
  id: number;
  username: string | null;
  matchData: (BaseMatchStat & { goals: number })[];
}

export interface AssistsByPlayerStatData {
  id: number;
  username: string | null;
  matchData: (BaseMatchStat & { assists: number })[];
}

export interface SubstitutionOutStatData {
  id: number;
  username: string | null;
  matchData: BaseMatch[];
}

export interface MatchStatsWrapperProps {
  initialPlayerStats: PlayerMatchStat[];
  initialMatchData: MatchData[];
  initialOpponentStats: PlayerOpponentStatData[];
  initialGoalStats: GoalsByPlayerStatData[];
  initialAssistStats: AssistsByPlayerStatData[];
  initialSubstitutionStats: SubstitutionOutStatData[];
  initialSubstitutionInjuryStats: SubstitutionOutStatData[];
  initialSubstitutionOutTacticalStats: SubstitutionOutStatData[];
  initialSubstitutionInTacticalStats: SubstitutionOutStatData[];
}

export interface SubstitutionMatchStats {
  id: number;
  username: string | null;
  whatsappNumber: string | null;
  matchPlayers?: (BaseMatchPlayer & {
    match?: {
      date: Date;
      opponentStrength: OpponentStrength | null;
    } | null;
  })[];
  substitutedOut?: BaseMatchEvent[];
}

export interface SubstitutionInMatchStats {
  id: number;
  username: string | null;
  whatsappNumber: string | null;
  matchPlayers?: (BaseMatchPlayer & {
    match?: {
      date: Date;
      opponentStrength: OpponentStrength | null;
    } | null;
  })[];
  substitutedIn?: BaseMatchEvent[];
}

export interface BaseMatchStat extends BaseMatch {
  opponentStrength: OpponentStrength | null;
  minutes: number;
  available: boolean;
}

export interface UserWithOptionalMatchStats {
  id: number;
  username: string | null;
  whatsappNumber: string | null;
  matchPlayers?: (BaseMatchPlayer & {
    match?: {
      date: Date;
      opponentStrength: OpponentStrength | null;
    } | null;
  })[];
  MatchEvent?: BaseMatchEvent[];
}

export interface MatchClientProps {
  playerStats: PlayerStat[];
}

export interface PlayerSubstitutionInTacticalStat {
  id: number;
  username: string | null;
  substitutionsAgainstStronger: number;
  substitutionsAgainstSimilar: number;
  substitutionsAgainstWeaker: number;
  totalSubstitutions: number;
}

export interface PlayerSubstitutionInTacticalStatsTableProps {
  substitutionStats: PlayerSubstitutionInTacticalStat[];
}

interface PlayerOpponentStatTable {
  id: number;
  username: string | null;
  avgMinutesStronger: number;
  avgMinutesSimilar: number;
  avgMinutesWeaker: number;
}

export interface PlayerOpponentStatsTableProps {
  playerStats: PlayerOpponentStatTable[];
}

interface PlayerSubstitutionStatTable {
  id: number;
  username: string | null;
  substitutionsAgainstStronger: number;
  substitutionsAgainstSimilar: number;
  substitutionsAgainstWeaker: number;
  totalSubstitutions: number;
}

export interface PlayerSubstitutionStatsTableProps {
  substitutionStats: PlayerSubstitutionStatTable[];
}

interface PlayerOutInjuryStatTable {
  id: number;
  username: string | null;
  substitutionsAgainstStronger: number;
  substitutionsAgainstSimilar: number;
  substitutionsAgainstWeaker: number;
  totalSubstitutions: number;
}

export interface PlayerSubstitutionInjuryStatsTableProps {
  substitutionStats: PlayerOutInjuryStatTable[];
}

interface PlayerSubstitutionTacticalStatTable {
  id: number;
  username: string | null;
  substitutionsAgainstStronger: number;
  substitutionsAgainstSimilar: number;
  substitutionsAgainstWeaker: number;
  totalSubstitutions: number;
}

export interface PlayerSubstitutionTacticalStatsTableProps {
  substitutionStats: PlayerSubstitutionTacticalStatTable[];
}

export interface PlayerDataAdd {
  id: number;
  username: string | null;
  matchData: PlayerMatchData[];
}

export type GetPlayerStatsReturn =
  | PlayerDataAdd[]
  | { success: false; error: string };

export interface PlayerAssistStat {
  id: number;
  username: string | null;
  assistsAgainstStronger: number;
  assistsAgainstSimilar: number;
  assistsAgainstWeaker: number;
  totalAssists: number;
}

export interface PlayerAssistStatsTableProps {
  assistStats: PlayerAssistStat[];
}

export interface PlayerGoalStatsTableProps {
  goalStats: PlayerGoalStat[];
}

export interface PlayerGoalStat {
  id: number;
  username: string | null;
  goalsAgainstStronger: number;
  goalsAgainstSimilar: number;
  goalsAgainstWeaker: number;
  totalGoals: number;
}
