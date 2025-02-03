import { fetchSubstitutionOutInjury } from '@/lib/services/getSubstitutionOutInjuryService';
import { SubstitutionOutStatData } from '@/types/stats-types';

export async function getSubstitutionOutInjury(): Promise<
  SubstitutionOutStatData[]
> {
  try {
    return await fetchSubstitutionOutInjury();
  } catch (error) {
    console.error('Error fetching substitution out injury data:', error);
    throw error;
  }
}
