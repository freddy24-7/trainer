import { fetchSubstitutionInTactical } from '@/lib/services/getSubstitutionInTacticalService';
import { SubstitutionOutStatData } from '@/types/match-types';

export async function getSubstitutionInTactical(): Promise<
  SubstitutionOutStatData[]
> {
  try {
    return await fetchSubstitutionInTactical();
  } catch (error) {
    console.error('Error fetching substitution in tactical data:', error);
    throw error;
  }
}
