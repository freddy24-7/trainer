import { fetchSubstitutionOutTactical } from '@/lib/services/getSubstitutionOutTacticalService';
import { SubstitutionOutStatData } from '@/types/match-types';

export async function getSubstitutionOutTactical(): Promise<
  SubstitutionOutStatData[]
> {
  try {
    return await fetchSubstitutionOutTactical();
  } catch (error) {
    console.error('Error fetching substitution out tactical data:', error);
    throw error;
  }
}
