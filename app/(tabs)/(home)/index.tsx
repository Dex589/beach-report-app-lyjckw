
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  Platform,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { BEACHES } from '@/data/beachData';
import { useBeachStorage } from '@/hooks/useBeachStorage';
import { useBeachConditions } from '@/hooks/useBeachConditions';
import { LinearGradient } from 'expo-linear-gradient';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';

export default function HomeScreen() {
  const router = useRouter();
  const { favorites, toggleFavorite, homeBeaches } = useBeachStorage();
  const [currentBeachIndex, setCurrentBeachIndex] = useState(0);
  
  // Get beaches to display (favorites first, then home beaches)
  const displayBeaches = homeBeaches.length > 0 
    ? homeBeaches.map(id => BEACHES.find(b => b.id === id)).filter(Boolean)
    : [BEACHES[0]]; // Default to first beach if no home beaches
  
  const beach = displayBeaches[currentBeachIndex] || BEACHES[0];
  const { 
    conditions, 
    tideSchedule, 
    loading, 
    error, 
    refresh,
    lastRefreshed 
  } = useBeachConditions(beach.id);
  
  const isFavorite = favorites.includes(beach.id);
  const [refreshing, setRefreshing] = useState(false);

  const handlePreviousBeach = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCurrentBeachIndex((prev) => 
      prev === 0 ? displayBeaches.length - 1 : prev - 1
    );
  };

  const handleNextBeach = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCurrentBeachIndex((prev) => 
      prev === displayBeaches.length - 1 ? 0 : prev + 1
    );
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  const handleAlertsPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push({
      pathname: '/(tabs)/(home)/alerts',
      params: { beachId: beach.id }
    });
  };

  // Swipe gesture for beach navigation
  const swipeGesture = Gesture.Pan()
    .onEnd((event) => {
      const SWIPE_THRESHOLD = 50;
      
      if (event.translationX > SWIPE_THRESHOLD) {
        // Swipe right - go to previous beach
        handlePreviousBeach();
      } else if (event.translationX < -SWIPE_THRESHOLD) {
        // Swipe left - go to next beach
        handleNextBeach();
      }
    });

  // Show loading state
  if (loading && !conditions) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading beach conditions from NOAA...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Show error state
  if (error && !conditions) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.errorContainer}>
          <IconSymbol name="exclamationmark.triangle" size={48} color="#FF3B30" />
          <Text style={styles.errorText}>{error}</Text>
          <Pressable style={styles.retryButton} onPress={refresh}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  if (!conditions) return null;

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
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {/* Header with Gradient */}
        <LinearGradient
          colors={['#00CED1', '#4169E1']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.header}
        >
          <View style={styles.headerTop}>
            <View style={styles.titleRow}>
              <Image 
                source={require('@/assets/images/423df9ee-bcfa-46da-9cad-cf4f84271d40.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
            <Pressable 
              onPress={() => toggleFavorite(beach.id)}
              hitSlop={8}
              style={styles.heartButton}
            >
              <IconSymbol 
                name={isFavorite ? "heart.fill" : "heart"} 
                size={24} 
                color={isFavorite ? "#FF0000" : "#FFFFFF"} 
              />
            </Pressable>
          </View>
          
          <Text style={styles.recentlyViewed}>
            {isFavorite ? '⭐ Favorite' : 'Recently Viewed'} • {beach.name}
          </Text>
          
          <View style={styles.locationRow}>
            <IconSymbol name="location.fill" size={16} color="#FFFFFF" />
            <Text style={styles.locationText}>{beach.location}, {beach.state}</Text>
            <View style={styles.greenDot} />
          </View>

          {/* Navigation Arrows */}
          {displayBeaches.length > 1 && (
            <View style={styles.navigationRow}>
              <Pressable 
                onPress={handlePreviousBeach}
                style={styles.navButton}
                hitSlop={8}
              >
                <IconSymbol name="chevron.left" size={24} color="#FFFFFF" />
              </Pressable>
              
              <View style={styles.beachIndicator}>
                <Text style={styles.beachIndicatorText}>
                  {currentBeachIndex + 1} / {displayBeaches.length}
                </Text>
              </View>

              <Pressable 
                onPress={handleNextBeach}
                style={styles.navButton}
                hitSlop={8}
              >
                <IconSymbol name="chevron.right" size={24} color="#FFFFFF" />
              </Pressable>
            </View>
          )}
        </LinearGradient>

        {/* Wave decoration */}
        <View style={styles.waveContainer}>
          <View style={styles.wave} />
        </View>

        {/* Beach Image with Swipe Gesture and Overlay Buttons */}
        <View style={styles.beachImageContainer}>
          <GestureDetector gesture={swipeGesture}>
            <View>
              <Image 
                source={beach.image} 
                style={styles.beachImage}
                resizeMode="cover"
              />
              
              {/* Overlay Navigation Buttons */}
              {displayBeaches.length > 1 && (
                <>
                  {/* Left Button */}
                  <Pressable 
                    onPress={handlePreviousBeach}
                    style={styles.overlayButtonLeft}
                    hitSlop={8}
                  >
                    <View style={styles.overlayButtonInner}>
                      <IconSymbol name="chevron.left" size={28} color="#FFFFFF" />
                    </View>
                  </Pressable>

                  {/* Right Button */}
                  <Pressable 
                    onPress={handleNextBeach}
                    style={styles.overlayButtonRight}
                    hitSlop={8}
                  >
                    <View style={styles.overlayButtonInner}>
                      <IconSymbol name="chevron.right" size={28} color="#FFFFFF" />
                    </View>
                  </Pressable>

                  {/* Swipe Indicator */}
                  <View style={styles.swipeIndicator}>
                    <IconSymbol name="hand.draw" size={16} color="#FFFFFF" />
                    <Text style={styles.swipeIndicatorText}>Swipe to navigate</Text>
                  </View>
                </>
              )}
            </View>
          </GestureDetector>
        </View>

        {/* Safe Conditions Banner - Now Clickable */}
        <Pressable 
          style={[
            styles.safeConditionsBanner,
            conditions.flagWarning === 'green' && styles.greenBanner,
            conditions.flagWarning === 'yellow' && styles.yellowBanner,
            conditions.flagWarning === 'red' && styles.redBanner,
            conditions.flagWarning === 'purple' && styles.purpleBanner,
          ]}
          onPress={handleAlertsPress}
        >
          <View style={styles.safeConditionsContent}>
            <IconSymbol name="exclamationmark.triangle.fill" size={20} color="#FFFFFF" />
            <Text style={styles.safeConditionsText}>{conditions.flagWarningText}</Text>
          </View>
          <IconSymbol name="chevron.right" size={20} color="#FFFFFF" />
        </Pressable>

        {/* Data Source Badge */}
        <View style={styles.dataSourceBadge}>
          <IconSymbol name="checkmark.circle.fill" size={16} color="#34C759" />
          <Text style={styles.dataSourceText}>
            Live data from NOAA • Updated {conditions.lastUpdated}
          </Text>
        </View>

        {/* Current Conditions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Conditions</Text>
          <View style={styles.conditionsGrid}>
            <View style={styles.conditionCard}>
              <IconSymbol name="thermometer" size={32} color="#4A90E2" />
              <Text style={styles.conditionValue}>{conditions.airTemp.toFixed(1)}°F</Text>
              <Text style={styles.conditionLabel}>Air Temperature</Text>
            </View>
            <View style={styles.conditionCard}>
              <IconSymbol name="wind" size={32} color="#4A90E2" />
              <Text style={styles.conditionValue}>{conditions.windSpeed.toFixed(1)} mph</Text>
              <Text style={styles.conditionLabel}>Wind {conditions.windDirection}</Text>
            </View>
            <View style={styles.conditionCard}>
              <IconSymbol name="drop.fill" size={32} color="#4A90E2" />
              <Text style={styles.conditionValue}>{conditions.humidity.toFixed(0)}%</Text>
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
            <Text style={styles.waterTempValue}>{conditions.waterTemp.toFixed(1)}°F</Text>
            <Text style={styles.waterTempSource}>From NOAA Station</Text>
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
                <IconSymbol 
                  name={conditions.tideStatus === 'Rising' || conditions.tideStatus === 'High' ? "arrow.up" : "arrow.down"} 
                  size={14} 
                  color="#4A90E2" 
                />
                <Text style={styles.tideStatusText}>{conditions.tideStatus}</Text>
              </View>
            </View>
          </View>

          {tideSchedule.length > 0 ? (
            tideSchedule.map((tide, index) => (
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
            ))
          ) : (
            <Text style={styles.noDataText}>Tide schedule unavailable</Text>
          )}
        </View>

        {/* View Live Camera Button */}
        {conditions.liveCameraUrl && (
          <Pressable style={styles.cameraButton}>
            <IconSymbol name="video.fill" size={20} color="#FFFFFF" />
            <Text style={styles.cameraButtonText}>View Live Camera</Text>
          </Pressable>
        )}

        {/* Last Updated */}
        <Text style={styles.lastUpdated}>
          Last updated: {conditions.lastUpdated}
          {lastRefreshed && ` • Refreshed ${lastRefreshed.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`}
        </Text>
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
    paddingBottom: 120,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#585858',
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: '#585858',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 20,
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
  },
  logoImage: {
    width: 140,
    height: 32,
  },
  heartButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  recentlyViewed: {
    fontSize: 13,
    color: '#FFFFFF',
    opacity: 0.95,
    marginBottom: 6,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  locationText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  greenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00FF00',
    marginLeft: 2,
  },
  navigationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  beachIndicator: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  beachIndicatorText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  waveContainer: {
    height: 20,
    overflow: 'hidden',
    backgroundColor: '#F5F5F5',
  },
  wave: {
    position: 'absolute',
    top: -10,
    left: 0,
    right: 0,
    height: 30,
    backgroundColor: '#4169E1',
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 100,
  },
  beachImageContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
  },
  beachImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#E0E0E0',
  },
  overlayButtonLeft: {
    position: 'absolute',
    left: 16,
    top: '50%',
    marginTop: -28,
    zIndex: 10,
  },
  overlayButtonRight: {
    position: 'absolute',
    right: 16,
    top: '50%',
    marginTop: -28,
    zIndex: 10,
  },
  overlayButtonInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.3)',
    elevation: 5,
  },
  swipeIndicator: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    alignSelf: 'center',
  },
  swipeIndicatorText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  safeConditionsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  greenBanner: {
    backgroundColor: '#34C759',
  },
  yellowBanner: {
    backgroundColor: '#FFCC00',
  },
  redBanner: {
    backgroundColor: '#FF3B30',
  },
  purpleBanner: {
    backgroundColor: '#AF52DE',
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
  dataSourceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F0F9FF',
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 8,
  },
  dataSourceText: {
    fontSize: 12,
    color: '#34C759',
    fontWeight: '600',
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
  waterTempSource: {
    fontSize: 12,
    color: '#585858',
    marginLeft: 'auto',
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
  noDataText: {
    fontSize: 14,
    color: '#585858',
    textAlign: 'center',
    padding: 16,
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
    marginBottom: 20,
  },
});
