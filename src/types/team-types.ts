export interface Team {
  id: number;
  name: string;
}

export interface TeamsListProps {
  teams: Team[];
  pouleName: string;
}
