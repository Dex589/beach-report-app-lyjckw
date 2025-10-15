
import { useState, useEffect, useCallback } from 'react';
import { BeachConditions, TideInfo } from '@/types/beach';
import { fetchBeachConditions, fetchTideSchedule } from '@/services/noaaService';
import { generateBeachConditions, getTideSchedule } from '@/data/beachData';

interface UseBeachConditionsResult {
  conditions: BeachConditions | null;
  tideSchedule: TideInfo[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  lastRefreshed: Date | null;
}

// Cache for beach conditions (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;
const conditionsCache = new Map<string, { data: BeachConditions; timestamp: number }>();
const tideCache = new Map<string, { data: TideInfo[]; timestamp: number }>();

export const useBeachConditions = (beachId: string): UseBeachConditionsResult => {
  const [conditions, setConditions] = useState<BeachConditions | null>(null);
  const [tideSchedule, setTideSchedule] = useState<TideInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);

  const fetchData = useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const now = Date.now();
      
      // Check cache for conditions
      const cachedConditions = conditionsCache.get(beachId);
      const cachedTides = tideCache.get(beachId);
      
      let fetchedConditions: BeachConditions | null = null;
      let fetchedTides: TideInfo[] = [];
      
      // Use cache if available and not expired
      if (!forceRefresh && cachedConditions && (now - cachedConditions.timestamp) < CACHE_DURATION) {
        console.log('Using cached conditions for beach:', beachId);
        fetchedConditions = cachedConditions.data;
      } else {
        console.log('Fetching fresh conditions from NOAA for beach:', beachId);
        fetchedConditions = await fetchBeachConditions(beachId);
        
        if (fetchedConditions) {
          // Cache the result
          conditionsCache.set(beachId, { data: fetchedConditions, timestamp: now });
        } else {
          // Fallback to mock data if NOAA API fails
          console.log('NOAA API failed, using mock data for beach:', beachId);
          fetchedConditions = generateBeachConditions(beachId);
        }
      }
      
      // Use cache if available and not expired
      if (!forceRefresh && cachedTides && (now - cachedTides.timestamp) < CACHE_DURATION) {
        console.log('Using cached tide schedule for beach:', beachId);
        fetchedTides = cachedTides.data;
      } else {
        console.log('Fetching fresh tide schedule from NOAA for beach:', beachId);
        fetchedTides = await fetchTideSchedule(beachId);
        
        if (fetchedTides.length > 0) {
          // Cache the result
          tideCache.set(beachId, { data: fetchedTides, timestamp: now });
        } else {
          // Fallback to mock data if NOAA API fails
          console.log('NOAA tide API failed, using mock data for beach:', beachId);
          fetchedTides = getTideSchedule();
        }
      }
      
      setConditions(fetchedConditions);
      setTideSchedule(fetchedTides);
      setLastRefreshed(new Date());
      
    } catch (err) {
      console.error('Error in useBeachConditions:', err);
      setError('Failed to fetch beach conditions');
      
      // Fallback to mock data
      setConditions(generateBeachConditions(beachId));
      setTideSchedule(getTideSchedule());
    } finally {
      setLoading(false);
    }
  }, [beachId]);

  const refresh = useCallback(async () => {
    await fetchData(true);
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    conditions,
    tideSchedule,
    loading,
    error,
    refresh,
    lastRefreshed,
  };
};
