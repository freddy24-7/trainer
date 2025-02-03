import { fetchSubstitutionOutFitness } from '@/lib/services/getSubstitutionOutFitnessService';
import { SubstitutionOutStatData } from '@/types/stats-types';

export async function getSubstitutionOutFitness(): Promise<
  SubstitutionOutStatData[]
> {
  try {
    return await fetchSubstitutionOutFitness();
  } catch (error) {
    console.error('Error fetching substitution out fitness data:', error);
    throw error;
  }
}
