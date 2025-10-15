
import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Beach } from '@/types/beach';

const FAVORITES_KEY = '@beach_report_favorites';
const HOME_BEACHES_KEY = '@beach_report_home_beaches';

export const useBeachStorage = () => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [homeBeaches, setHomeBeaches] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Load data from storage
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [favoritesData, homeBeachesData] = await Promise.all([
        AsyncStorage.getItem(FAVORITES_KEY),
        AsyncStorage.getItem(HOME_BEACHES_KEY),
      ]);

      if (favoritesData) {
        setFavorites(JSON.parse(favoritesData));
      }
      if (homeBeachesData) {
        setHomeBeaches(JSON.parse(homeBeachesData));
      }
    } catch (error) {
      console.error('Error loading beach data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Toggle favorite
  const toggleFavorite = useCallback(async (beachId: string) => {
    try {
      const newFavorites = favorites.includes(beachId)
        ? favorites.filter(id => id !== beachId)
        : [...favorites, beachId];
      
      setFavorites(newFavorites);
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  }, [favorites]);

  // Add beach to home
  const addToHome = useCallback(async (beachId: string) => {
    try {
      let newHomeBeaches = [...homeBeaches];
      
      // Remove if already exists
      newHomeBeaches = newHomeBeaches.filter(id => id !== beachId);
      
      // Add to beginning
      newHomeBeaches.unshift(beachId);
      
      // Keep only 5 beaches
      if (newHomeBeaches.length > 5) {
        newHomeBeaches = newHomeBeaches.slice(0, 5);
      }
      
      setHomeBeaches(newHomeBeaches);
      await AsyncStorage.setItem(HOME_BEACHES_KEY, JSON.stringify(newHomeBeaches));
    } catch (error) {
      console.error('Error adding to home:', error);
    }
  }, [homeBeaches]);

  // Remove beach from home
  const removeFromHome = useCallback(async (beachId: string) => {
    try {
      const newHomeBeaches = homeBeaches.filter(id => id !== beachId);
      setHomeBeaches(newHomeBeaches);
      await AsyncStorage.setItem(HOME_BEACHES_KEY, JSON.stringify(newHomeBeaches));
    } catch (error) {
      console.error('Error removing from home:', error);
    }
  }, [homeBeaches]);

  // Check if beach is favorite
  const isFavorite = useCallback((beachId: string) => {
    return favorites.includes(beachId);
  }, [favorites]);

  // Check if beach is on home
  const isOnHome = useCallback((beachId: string) => {
    return homeBeaches.includes(beachId);
  }, [homeBeaches]);

  return {
    favorites,
    homeBeaches,
    loading,
    toggleFavorite,
    addToHome,
    removeFromHome,
    isFavorite,
    isOnHome,
  };
};
