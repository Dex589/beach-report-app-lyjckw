
import React from 'react';
import { View, Text, StyleSheet, Image, Pressable, Dimensions } from 'react-native';
import { Beach } from '@/types/beach';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from './IconSymbol';

interface BeachCardProps {
  beach: Beach;
  onPress: () => void;
  onFavoritePress: () => void;
  isFavorite: boolean;
  showDistance?: boolean;
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 32;

export const BeachCard: React.FC<BeachCardProps> = ({
  beach,
  onPress,
  onFavoritePress,
  isFavorite,
  showDistance = false,
}) => {
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <Image source={{ uri: beach.imageUrl }} style={styles.image} />
      
      <Pressable 
        onPress={onFavoritePress} 
        style={styles.favoriteButton}
        hitSlop={8}
      >
        <IconSymbol
          name={isFavorite ? 'heart.fill' : 'heart'}
          size={24}
          color={isFavorite ? colors.danger : colors.card}
        />
      </Pressable>

      <View style={styles.content}>
        <Text style={styles.name}>{beach.name}</Text>
        <View style={styles.locationRow}>
          <IconSymbol name="location.fill" size={14} color={colors.textSecondary} />
          <Text style={styles.location}>{beach.location}, {beach.state}</Text>
        </View>
        {showDistance && beach.distance !== undefined && (
          <Text style={styles.distance}>{beach.distance.toFixed(1)} miles away</Text>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    backgroundColor: colors.card,
    borderRadius: 16,
    overflow: 'hidden',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    elevation: 4,
    marginHorizontal: 16,
  },
  image: {
    width: '100%',
    height: 200,
    backgroundColor: colors.secondary,
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  distance: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
  },
});
