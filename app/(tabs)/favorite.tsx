
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { BEACHES } from '@/data/beachData';
import { Beach } from '@/types/beach';
import { useBeachStorage } from '@/hooks/useBeachStorage';
import { useRouter } from 'expo-router';

export default function FavoriteScreen() {
  const { favorites, toggleFavorite } = useBeachStorage();
  const router = useRouter();
  
  const favoriteBeaches = BEACHES.filter(beach => favorites.includes(beach.id));

  const renderBeachItem = ({ item }: { item: Beach }) => {
    return (
      <Pressable 
        style={styles.beachItem}
        onPress={() => console.log('Navigate to beach:', item.id)}
      >
        <Image source={{ uri: item.imageUrl }} style={styles.beachImage} />
        <View style={styles.beachInfo}>
          <Text style={styles.beachName}>{item.name}</Text>
          <View style={styles.locationRow}>
            <IconSymbol name="location.fill" size={14} color={colors.textSecondary} />
            <Text style={styles.beachLocation}>{item.location}, {item.state}</Text>
          </View>
        </View>
        <Pressable
          onPress={() => toggleFavorite(item.id)}
          hitSlop={8}
          style={styles.favoriteButton}
        >
          <IconSymbol
            name="heart.fill"
            size={24}
            color={colors.danger}
          />
        </Pressable>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Favorite Beaches</Text>
        <Text style={styles.subtitle}>
          {favoriteBeaches.length} {favoriteBeaches.length === 1 ? 'beach' : 'beaches'}
        </Text>
      </View>

      <FlatList
        data={favoriteBeaches}
        renderItem={renderBeachItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <IconSymbol name="heart" size={64} color={colors.textSecondary} />
            <Text style={styles.emptyTitle}>No favorites yet</Text>
            <Text style={styles.emptyText}>
              Tap the heart icon on any beach to add it to your favorites
            </Text>
            <Pressable
              style={styles.searchButton}
              onPress={() => router.push('/(tabs)/search')}
            >
              <Text style={styles.searchButtonText}>Search Beaches</Text>
            </Pressable>
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
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.secondary,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
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
  },
  beachLocation: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  favoriteButton: {
    padding: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
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
    marginBottom: 24,
    lineHeight: 20,
  },
  searchButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  searchButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.card,
  },
});
