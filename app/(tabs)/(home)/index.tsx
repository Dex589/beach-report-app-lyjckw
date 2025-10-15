
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { BEACHES, generateBeachConditions, getTideSchedule } from '@/data/beachData';
import { useBeachStorage } from '@/hooks/useBeachStorage';

export default function HomeScreen() {
  const { favorites, toggleFavorite } = useBeachStorage();
  const [currentBeachId] = useState('1'); // Miami Beach as default
  
  const beach = BEACHES.find(b => b.id === currentBeachId) || BEACHES[0];
  const conditions = generateBeachConditions(currentBeachId);
  const tideSchedule = getTideSchedule();
  const isFavorite = favorites.includes(beach.id);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            headerShown: false,
          }}
        />
      )}
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.titleRow}>
              <IconSymbol name="water.waves" size={24} color="#FFFFFF" />
              <Text style={styles.appTitle}>Beach Report</Text>
            </View>
            <View style={styles.headerIcons}>
              <Pressable 
                onPress={() => toggleFavorite(beach.id)}
                hitSlop={8}
              >
                <IconSymbol 
                  name={isFavorite ? "heart.fill" : "heart"} 
                  size={24} 
                  color="#FFFFFF" 
                />
              </Pressable>
              <IconSymbol name="cloud" size={24} color="#FFFFFF" />
            </View>
          </View>
          
          <Text style={styles.recentlyViewed}>Recently Viewed • {beach.name}</Text>
          
          <View style={styles.locationRow}>
            <IconSymbol name="location.fill" size={16} color="#FFFFFF" />
            <Text style={styles.locationText}>{beach.location}, {beach.state}</Text>
            <IconSymbol name="location" size={16} color="#FFFFFF" />
          </View>
        </View>

        {/* Beach Image */}
        <Image 
          source={{ uri: beach.imageUrl }} 
          style={styles.beachImage}
          resizeMode="cover"
        />

        {/* Safe Conditions Banner */}
        <Pressable style={styles.safeConditionsBanner}>
          <View style={styles.safeConditionsContent}>
            <IconSymbol name="exclamationmark.triangle.fill" size={20} color="#FFFFFF" />
            <Text style={styles.safeConditionsText}>Safe conditions</Text>
          </View>
          <IconSymbol name="chevron.right" size={20} color="#FFFFFF" />
        </Pressable>

        {/* Current Conditions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Conditions</Text>
          <View style={styles.conditionsGrid}>
            <View style={styles.conditionCard}>
              <IconSymbol name="thermometer" size={32} color="#4A90E2" />
              <Text style={styles.conditionValue}>{conditions.airTemp}°F</Text>
              <Text style={styles.conditionLabel}>Air Temperature</Text>
            </View>
            <View style={styles.conditionCard}>
              <IconSymbol name="wind" size={32} color="#4A90E2" />
              <Text style={styles.conditionValue}>{conditions.windSpeed} mph</Text>
              <Text style={styles.conditionLabel}>Wind {conditions.windDirection}</Text>
            </View>
            <View style={styles.conditionCard}>
              <IconSymbol name="drop.fill" size={32} color="#4A90E2" />
              <Text style={styles.conditionValue}>{conditions.humidity}%</Text>
              <Text style={styles.conditionLabel}>Humidity</Text>
            </View>
            <View style={styles.conditionCard}>
              <IconSymbol name="water.waves" size={32} color="#4A90E2" />
              <Text style={styles.conditionValue}>{conditions.surfHeight.toFixed(1)} ft</Text>
              <Text style={styles.conditionLabel}>Surf Height</Text>
            </View>
          </View>
        </View>

        {/* Water Temperature */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Water Temperature</Text>
          <View style={styles.waterTempCard}>
            <IconSymbol name="drop.fill" size={24} color="#4A90E2" />
            <Text style={styles.waterTempValue}>{conditions.waterTemp}°F</Text>
          </View>
        </View>

        {/* UV Protection Guide */}
        <View style={styles.section}>
          <View style={styles.uvHeader}>
            <IconSymbol name="sun.max.fill" size={20} color="#FF9500" />
            <Text style={styles.uvTitle}>UV Protection Guide</Text>
          </View>
          <View style={styles.uvCard}>
            <View style={styles.uvIndexRow}>
              <View style={styles.uvIndexBadge}>
                <Text style={styles.uvIndexText}>UV {conditions.uvIndex}</Text>
              </View>
              <Text style={styles.uvIndexLabel}>{conditions.uvGuide}</Text>
            </View>
            
            <View style={styles.uvGuideItem}>
              <IconSymbol name="sun.max" size={18} color="#FF9500" />
              <View style={styles.uvGuideContent}>
                <Text style={styles.uvGuideTitle}>Sunscreen</Text>
                <Text style={styles.uvGuideText}>SPF 30+</Text>
              </View>
            </View>

            <View style={styles.uvGuideItem}>
              <IconSymbol name="tshirt" size={18} color="#FF9500" />
              <View style={styles.uvGuideContent}>
                <Text style={styles.uvGuideTitle}>Clothing</Text>
                <Text style={styles.uvGuideText}>Shirt, hat recommended</Text>
              </View>
            </View>

            <View style={styles.uvGuideItem}>
              <IconSymbol name="clock" size={18} color="#FF9500" />
              <View style={styles.uvGuideContent}>
                <Text style={styles.uvGuideTitle}>Timing</Text>
                <Text style={styles.uvGuideText}>Seek shade during midday hours</Text>
              </View>
            </View>

            <View style={styles.uvGuideItem}>
              <IconSymbol name="umbrella.fill" size={18} color="#FF9500" />
              <View style={styles.uvGuideContent}>
                <Text style={styles.uvGuideTitle}>Shade</Text>
                <Text style={styles.uvGuideText}>Shade recommended 10am-4pm</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Sun Times */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sun Times</Text>
          <View style={styles.sunTimesRow}>
            <View style={styles.sunTimeCard}>
              <IconSymbol name="sunrise.fill" size={32} color="#FF9500" />
              <Text style={styles.sunTimeLabel}>Sunrise</Text>
              <Text style={styles.sunTimeValue}>{conditions.sunrise}</Text>
            </View>
            <View style={styles.sunTimeCard}>
              <IconSymbol name="sunset.fill" size={32} color="#FF6B35" />
              <Text style={styles.sunTimeLabel}>Sunset</Text>
              <Text style={styles.sunTimeValue}>{conditions.sunset}</Text>
            </View>
          </View>
        </View>

        {/* Tide Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tide Information</Text>
          
          <View style={styles.currentTideCard}>
            <View style={styles.currentTideHeader}>
              <IconSymbol name="water.waves" size={20} color="#4A90E2" />
              <Text style={styles.currentTideTitle}>Current Tide</Text>
            </View>
            <View style={styles.currentTideContent}>
              <Text style={styles.currentTideValue}>{conditions.currentTide.toFixed(1)} ft</Text>
              <View style={styles.tideStatusBadge}>
                <IconSymbol name="arrow.up" size={14} color="#4A90E2" />
                <Text style={styles.tideStatusText}>{conditions.tideStatus}</Text>
              </View>
            </View>
          </View>

          {tideSchedule.map((tide, index) => (
            <View key={index} style={styles.tideRow}>
              <Text style={styles.tideTime}>{tide.time}</Text>
              <View style={styles.tideInfo}>
                <Text style={[
                  styles.tideType,
                  tide.type === 'High Tide' ? styles.highTide : styles.lowTide
                ]}>
                  {tide.type}
                </Text>
                <Text style={styles.tideHeight}>{tide.height.toFixed(1)} ft</Text>
              </View>
            </View>
          ))}
        </View>

        {/* View Live Camera Button */}
        <Pressable style={styles.cameraButton}>
          <IconSymbol name="video.fill" size={20} color="#FFFFFF" />
          <Text style={styles.cameraButtonText}>View Live Camera</Text>
        </Pressable>

        {/* Last Updated */}
        <Text style={styles.lastUpdated}>Last updated: {conditions.lastUpdated}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Platform.OS === 'ios' ? 100 : 120,
  },
  header: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  appTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  recentlyViewed: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  beachImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#E0E0E0',
  },
  safeConditionsBanner: {
    backgroundColor: '#34C759',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  safeConditionsContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  safeConditionsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#202020',
    marginBottom: 12,
  },
  conditionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  conditionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: '47%',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  conditionValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#202020',
    marginTop: 8,
  },
  conditionLabel: {
    fontSize: 12,
    color: '#585858',
    marginTop: 4,
    textAlign: 'center',
  },
  waterTempCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  waterTempValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#202020',
  },
  uvHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  uvTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FF9500',
  },
  uvCard: {
    backgroundColor: '#FFF9F0',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FFE5CC',
  },
  uvIndexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#FFE5CC',
  },
  uvIndexBadge: {
    backgroundColor: '#FF9500',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  uvIndexText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  uvIndexLabel: {
    fontSize: 14,
    color: '#202020',
    flex: 1,
  },
  uvGuideItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  uvGuideContent: {
    flex: 1,
  },
  uvGuideTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#202020',
    marginBottom: 2,
  },
  uvGuideText: {
    fontSize: 13,
    color: '#585858',
  },
  sunTimesRow: {
    flexDirection: 'row',
    gap: 12,
  },
  sunTimeCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  sunTimeLabel: {
    fontSize: 12,
    color: '#585858',
    marginTop: 8,
  },
  sunTimeValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#202020',
    marginTop: 4,
  },
  currentTideCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  currentTideHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  currentTideTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#585858',
  },
  currentTideContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  currentTideValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#4A90E2',
  },
  tideStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tideStatusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A90E2',
  },
  tideRow: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  tideTime: {
    fontSize: 14,
    fontWeight: '600',
    color: '#202020',
  },
  tideInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  tideType: {
    fontSize: 14,
    fontWeight: '600',
  },
  highTide: {
    color: '#4A90E2',
  },
  lowTide: {
    color: '#FF9500',
  },
  tideHeight: {
    fontSize: 14,
    color: '#585858',
  },
  cameraButton: {
    backgroundColor: '#00A8E8',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 16,
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 12,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  cameraButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  lastUpdated: {
    fontSize: 12,
    color: '#585858',
    textAlign: 'center',
    marginTop: 12,
    marginHorizontal: 16,
  },
});
