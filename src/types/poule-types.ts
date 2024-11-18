import { Control, FieldErrors, UseFormHandleSubmit } from 'react-hook-form';
import { ZodIssue } from 'zod';

import { Team } from './team-types';

export interface ActionResponse {
  errors?: ZodIssue[];
}

export interface PouleProps {
  action: (
    _prevState: unknown,
    params: FormData
  ) => Promise<ActionResponse | void>;
}

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

export interface OpponentSelectorProps {
  opponents: PouleOpponent[];
  selectedOpponent: PouleOpponent | null;
  onOpponentChange: (opponentId: number) => void;
}

export interface PouleFormData {
  pouleName: string;
  mainTeamName: string;
  opponents: string[];
}

export interface FieldError {
  message?: string;
}

export interface PouleFieldProps {
  poules: Poule[];
  selectedPoule: Poule | null;
  errors: { poule?: FieldError };
  onChange: (pouleId: number) => void;
}

export interface PouleFormContentProps {
  handleSubmit: UseFormHandleSubmit<PouleFormValues>;
  onSubmit: (data: PouleFormValues) => Promise<void>;
  control: Control<PouleFormValues>;
  errors: FieldErrors<PouleFormValues>;
  handleAddOpponent: () => void;
  opponents: string[];
  handleRemoveOpponent: (index: number) => void;
}

export interface PouleFormFieldsProps {
  control: Control<PouleFormValues>;
  errors: FieldErrors<PouleFormValues>;
  handleAddOpponent: () => void;
}

export interface PouleItemProps {
  poule: Poule;
}

export interface PouleFormControls {
  reset: () => void;
  setOpponents: (opponents: string[]) => void;
  setShowForm: (show: boolean) => void;
}
