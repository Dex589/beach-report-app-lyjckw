
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Pressable,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { colors, commonStyles } from '@/styles/commonStyles';
import { BeachCard } from '@/components/BeachCard';
import { WaveHeader } from '@/components/WaveHeader';
import { IconSymbol } from '@/components/IconSymbol';
import { BEACHES } from '@/data/beachData';
import { useBeachStorage } from '@/hooks/useBeachStorage';
import { useLocation } from '@/hooks/useLocation';
import { Beach } from '@/types/beach';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { homeBeaches, favorites, toggleFavorite, loading: storageLoading } = useBeachStorage();
  const { location, loading: locationLoading, calculateDistance } = useLocation();

  // Get beaches to display on home screen
  const getHomeBeaches = (): Beach[] => {
    if (storageLoading) return [];

    // If we have saved home beaches, use those
    if (homeBeaches.length > 0) {
      return homeBeaches
        .map(id => BEACHES.find(b => b.id === id))
        .filter(Boolean) as Beach[];
    }

    // Otherwise, show nearest beaches or favorites
    let beachesToShow = [...BEACHES];

    // Add distance if location is available
    if (location) {
      beachesToShow = beachesToShow.map(beach => ({
        ...beach,
        distance: calculateDistance(
          location.latitude,
          location.longitude,
          beach.latitude,
          beach.longitude
        ),
      }));
      beachesToShow.sort((a, b) => (a.distance || 0) - (b.distance || 0));
    }

    // Prioritize favorites
    const favoriteBeaches = beachesToShow.filter(b => favorites.includes(b.id));
    const otherBeaches = beachesToShow.filter(b => !favorites.includes(b.id));

    return [...favoriteBeaches, ...otherBeaches].slice(0, 5);
  };

  const displayBeaches = getHomeBeaches();

  const handleScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / width);
    setCurrentIndex(index);
  };

  const scrollToIndex = (index: number) => {
    scrollViewRef.current?.scrollTo({
      x: index * width,
      animated: true,
    });
    setCurrentIndex(index);
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      scrollToIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < displayBeaches.length - 1) {
      scrollToIndex(currentIndex + 1);
    }
  };

  const handleBeachPress = (beachId: string) => {
    router.push(`/beach-detail?id=${beachId}`);
  };

  if (storageLoading || locationLoading) {
    return (
      <SafeAreaView style={commonStyles.container} edges={['top']}>
        <WaveHeader />
        <View style={[commonStyles.container, styles.centerContent]}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[commonStyles.text, styles.loadingText]}>Loading beaches...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={commonStyles.container} edges={['top']}>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: 'Beach Report',
            headerTransparent: true,
            headerBlurEffect: 'light',
          }}
        />
      )}
      
      <WaveHeader />

      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <IconSymbol name="water.waves" size={32} color={colors.card} />
          <Text style={styles.logoText}>
            Beach <Text style={styles.logoAccent}>Report</Text>
          </Text>
        </View>
      </View>

      <View style={styles.container}>
        {displayBeaches.length === 0 ? (
          <View style={styles.emptyState}>
            <IconSymbol name="magnifyingglass" size={64} color={colors.textSecondary} />
            <Text style={styles.emptyTitle}>No Beaches Yet</Text>
            <Text style={styles.emptyText}>
              Search for beaches to add them to your home screen
            </Text>
            <Pressable
              style={styles.searchButton}
              onPress={() => router.push('/(tabs)/search')}
            >
              <Text style={styles.searchButtonText}>Search Beaches</Text>
            </Pressable>
          </View>
        ) : (
          <>
            <View style={styles.carouselContainer}>
              <ScrollView
                ref={scrollViewRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                decelerationRate="fast"
                snapToInterval={width}
                snapToAlignment="center"
              >
                {displayBeaches.map((beach) => (
                  <View key={beach.id} style={styles.cardWrapper}>
                    <BeachCard
                      beach={beach}
                      onPress={() => handleBeachPress(beach.id)}
                      onFavoritePress={() => toggleFavorite(beach.id)}
                      isFavorite={favorites.includes(beach.id)}
                      showDistance={!!location}
                    />
                  </View>
                ))}
              </ScrollView>

              {displayBeaches.length > 1 && (
                <>
                  {currentIndex > 0 && (
                    <Pressable style={styles.arrowLeft} onPress={handlePrevious}>
                      <IconSymbol name="chevron.left" size={24} color={colors.card} />
                    </Pressable>
                  )}
                  {currentIndex < displayBeaches.length - 1 && (
                    <Pressable style={styles.arrowRight} onPress={handleNext}>
                      <IconSymbol name="chevron.right" size={24} color={colors.card} />
                    </Pressable>
                  )}
                </>
              )}
            </View>

            {displayBeaches.length > 1 && (
              <View style={styles.pagination}>
                {displayBeaches.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.paginationDot,
                      index === currentIndex && styles.paginationDotActive,
                    ]}
                  />
                ))}
              </View>
            )}

            <View style={styles.infoSection}>
              <Text style={styles.infoTitle}>Recently Viewed</Text>
              <Text style={styles.infoSubtitle}>
                {displayBeaches[currentIndex]?.name}
              </Text>
              <Pressable
                style={styles.viewDetailsButton}
                onPress={() => handleBeachPress(displayBeaches[currentIndex]?.id)}
              >
                <Text style={styles.viewDetailsText}>View Details</Text>
                <IconSymbol name="arrow.right" size={16} color={colors.primary} />
              </Pressable>
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoText: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.card,
  },
  logoAccent: {
    color: colors.accent,
  },
  carouselContainer: {
    height: 320,
    marginBottom: 20,
  },
  cardWrapper: {
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowLeft: {
    position: 'absolute',
    left: 8,
    top: '50%',
    transform: [{ translateY: -20 }],
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(70, 130, 180, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.2)',
    elevation: 4,
  },
  arrowRight: {
    position: 'absolute',
    right: 8,
    top: '50%',
    transform: [{ translateY: -20 }],
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(70, 130, 180, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.2)',
    elevation: 4,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.secondary,
  },
  paginationDotActive: {
    width: 24,
    backgroundColor: colors.primary,
  },
  infoSection: {
    paddingHorizontal: 20,
    paddingBottom: Platform.OS !== 'ios' ? 100 : 20,
  },
  infoTitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  infoSubtitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: colors.card,
    borderRadius: 8,
    alignSelf: 'flex-start',
    boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  viewDetailsText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingBottom: Platform.OS !== 'ios' ? 100 : 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginTop: 20,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  searchButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  searchButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.card,
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: colors.textSecondary,
  },
});
