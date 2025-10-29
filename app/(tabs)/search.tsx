
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Pressable,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { WaveHeader } from '@/components/WaveHeader';
import { BEACHES } from '@/data/beachData';
import { Beach } from '@/types/beach';
import { useBeachStorage } from '@/hooks/useBeachStorage';
import { useRouter } from 'expo-router';
import { useLocation } from '@/hooks/useLocation';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const { favorites, addToHome, isOnHome } = useBeachStorage();
  const router = useRouter();
  const { location, loading: locationLoading, error: locationError, calculateDistance } = useLocation();

  // Calculate beaches to display
  const displayedBeaches = useMemo(() => {
    // If user is searching, filter by search query
    if (searchQuery.trim().length > 0) {
      return BEACHES.filter(beach =>
        beach.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        beach.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        beach.state.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // If no search query, show closest 6 beaches based on GPS
    if (location) {
      // Calculate distance for each beach
      const beachesWithDistance = BEACHES.map(beach => ({
        ...beach,
        distance: calculateDistance(
          location.latitude,
          location.longitude,
          beach.latitude,
          beach.longitude
        ),
      }));

      // Sort by distance and take the closest 6
      return beachesWithDistance
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 6);
    }

    // If no location available, show first 6 beaches as fallback
    return BEACHES.slice(0, 6);
  }, [searchQuery, location, calculateDistance]);

  const handleAddToHome = async (beachId: string) => {
    console.log('Adding beach to home:', beachId);
    await addToHome(beachId);
    // Redirect to home page after adding
    router.push('/(tabs)/(home)');
  };

  const renderBeachItem = ({ item }: { item: Beach }) => {
    const isFavorite = favorites.includes(item.id);
    const onHome = isOnHome(item.id);
    
    // Determine which icon to show
    let iconName: 'plus' | 'checkmark' | 'heart.fill' = 'plus';
    let iconColor = colors.primary;
    
    if (isFavorite) {
      // If it's a favorite, show filled heart
      iconName = 'heart.fill';
      iconColor = colors.danger;
    } else if (onHome) {
      // If it's on home page but not favorite, show checkmark
      iconName = 'checkmark';
      iconColor = colors.success;
    }
    
    return (
      <View style={styles.beachItem}>
        <Image source={{ uri: item.image }} style={styles.beachImage} />
        <View style={styles.beachInfo}>
          <Text style={styles.beachName}>{item.name}</Text>
          <View style={styles.locationRow}>
            <IconSymbol name="location.fill" size={14} color={colors.textSecondary} />
            <Text style={styles.beachLocation}>{item.location}, {item.state}</Text>
          </View>
          {item.distance !== undefined && (
            <Text style={styles.distanceText}>
              {item.distance.toFixed(1)} miles away
            </Text>
          )}
        </View>
        <Pressable
          onPress={() => handleAddToHome(item.id)}
          hitSlop={8}
          style={styles.actionButton}
        >
          <IconSymbol
            name={iconName}
            size={24}
            color={iconColor}
          />
        </Pressable>
      </View>
    );
  };

  const renderHeader = () => {
    if (searchQuery.trim().length > 0) {
      return null; // No header when searching
    }

    if (locationLoading) {
      return (
        <View style={styles.headerMessage}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={styles.headerMessageText}>Getting your location...</Text>
        </View>
      );
    }

    if (locationError || !location) {
      return (
        <View style={styles.headerMessage}>
          <IconSymbol name="location.slash.fill" size={20} color={colors.textSecondary} />
          <Text style={styles.headerMessageText}>
            Location unavailable - Showing popular beaches
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.headerMessage}>
        <IconSymbol name="location.fill" size={20} color={colors.primary} />
        <Text style={styles.headerMessageText}>
          Showing 6 closest beaches to you
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <WaveHeader />
      
      {/* Search bar positioned below the wave */}
      <View style={styles.searchBarContainer}>
        <View style={styles.searchContainer}>
          <IconSymbol name="magnifyingglass" size={18} color="#999999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search beaches..."
            placeholderTextColor="#999999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')} hitSlop={8}>
              <IconSymbol name="xmark.circle.fill" size={18} color="#999999" />
            </Pressable>
          )}
        </View>
      </View>

      <FlatList
        data={displayedBeaches}
        renderItem={renderBeachItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <IconSymbol name="magnifyingglass" size={64} color={colors.textSecondary} />
            <Text style={styles.emptyTitle}>No beaches found</Text>
            <Text style={styles.emptyText}>
              Try searching with a different term
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchBarContainer: {
    position: 'absolute',
    top: 170,
    left: 16,
    right: 16,
    zIndex: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 10,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
  },
  headerMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.card,
    borderRadius: 8,
    marginBottom: 16,
    gap: 8,
  },
  headerMessageText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  listContent: {
    paddingTop: 230,
    padding: 16,
    paddingBottom: 120,
  },
  beachItem: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  beachImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: colors.secondary,
  },
  beachInfo: {
    flex: 1,
    marginLeft: 12,
  },
  beachName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  beachLocation: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  distanceText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
    marginTop: 2,
  },
  actionButton: {
    padding: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
