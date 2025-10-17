
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
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

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const { favorites, addToHome, isOnHome } = useBeachStorage();
  const router = useRouter();
  
  const filteredBeaches = BEACHES.filter(beach =>
    beach.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    beach.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    beach.state.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <Image source={item.image} style={styles.beachImage} />
        <View style={styles.beachInfo}>
          <Text style={styles.beachName}>{item.name}</Text>
          <View style={styles.locationRow}>
            <IconSymbol name="location.fill" size={14} color={colors.textSecondary} />
            <Text style={styles.beachLocation}>{item.location}, {item.state}</Text>
          </View>
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

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Search Beaches</Text>
        <View style={styles.searchContainer}>
          <IconSymbol name="magnifyingglass" size={20} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name or location..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')} hitSlop={8}>
              <IconSymbol name="xmark" size={20} color={colors.textSecondary} />
            </Pressable>
          )}
        </View>
      </View>

      <FlatList
        data={filteredBeaches}
        renderItem={renderBeachItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
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
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.secondary,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  listContent: {
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
  },
  beachLocation: {
    fontSize: 14,
    color: colors.textSecondary,
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
