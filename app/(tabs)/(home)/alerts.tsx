
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { colors, spacing, borderRadius } from '@/styles/commonStyles';
import { useBeachConditions } from '@/hooks/useBeachConditions';
import { BEACHES } from '@/data/beachData';

interface Alert {
  id: string;
  title: string;
  severity: 'low' | 'moderate' | 'high' | 'extreme';
  description: string;
  currentValue?: string;
  safeThreshold?: string;
}

export default function BeachAlertsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const beachId = params.beachId as string;
  
  const beach = BEACHES.find(b => b.id === beachId);
  const { conditions } = useBeachConditions(beachId);

  if (!beach || !conditions) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <IconSymbol name="chevron.left" size={24} color={colors.text} />
          </Pressable>
          <Text style={styles.headerTitle}>Beach Alerts</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading alerts...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Generate alerts based on conditions
  const alerts: Alert[] = [];

  // Check wind conditions
  if (conditions.windSpeed > 15) {
    alerts.push({
      id: 'wind',
      title: conditions.windSpeed > 25 ? 'Strong Wind' : 'Moderate Wind',
      severity: conditions.windSpeed > 25 ? 'high' : 'moderate',
      description: 'Breezy conditions. May affect beach umbrellas and small watercraft.',
      currentValue: `${conditions.windSpeed.toFixed(1)} mph ${conditions.windDirection}`,
      safeThreshold: '< 15 mph',
    });
  }

  // Check surf height
  if (conditions.surfHeight > 2.5) {
    alerts.push({
      id: 'surf',
      title: conditions.surfHeight > 4 ? 'High Surf' : 'Elevated Surf',
      severity: conditions.surfHeight > 4 ? 'extreme' : 'moderate',
      description: 'Larger than normal waves. Use caution when entering the water.',
      currentValue: `${conditions.surfHeight.toFixed(1)} ft`,
      safeThreshold: '< 2.5 ft',
    });
  }

  // Check UV index
  if (conditions.uvIndex > 8) {
    alerts.push({
      id: 'uv',
      title: conditions.uvIndex > 10 ? 'Extreme UV' : 'Very High UV',
      severity: conditions.uvIndex > 10 ? 'extreme' : 'high',
      description: 'High UV radiation levels. Sunscreen and protective clothing strongly recommended.',
      currentValue: `UV ${conditions.uvIndex}`,
      safeThreshold: '< 8',
    });
  }

  // Check water temperature
  if (conditions.waterTemp < 65) {
    alerts.push({
      id: 'coldwater',
      title: 'Cold Water',
      severity: 'moderate',
      description: 'Water temperature is below comfortable swimming levels. Wetsuit recommended.',
      currentValue: `${conditions.waterTemp.toFixed(1)}°F`,
      safeThreshold: '> 65°F',
    });
  }

  // Determine flag color and status
  const getFlagColor = () => {
    switch (conditions.flagWarning) {
      case 'green':
        return '#34C759';
      case 'yellow':
        return '#FFCC00';
      case 'red':
        return '#FF3B30';
      case 'purple':
        return '#AF52DE';
      default:
        return '#34C759';
    }
  };

  const getFlagText = () => {
    switch (conditions.flagWarning) {
      case 'green':
        return 'Green Flag - Safe Conditions';
      case 'yellow':
        return 'Yellow Flag - Moderate Hazards';
      case 'red':
        return 'Red Flag - Dangerous Conditions';
      case 'purple':
        return 'Purple Flag - Marine Life Warning';
      default:
        return 'Green Flag - Safe Conditions';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low':
        return '#34C759';
      case 'moderate':
        return '#FFCC00';
      case 'high':
        return '#FF9500';
      case 'extreme':
        return '#FF3B30';
      default:
        return '#34C759';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'info.circle.fill';
      case 'moderate':
        return 'exclamationmark.triangle.fill';
      case 'high':
        return 'exclamationmark.triangle.fill';
      case 'extreme':
        return 'exclamationmark.octagon.fill';
      default:
        return 'info.circle.fill';
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol name="chevron.left" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Beach Alerts</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Flag Status Banner */}
        <View style={[styles.flagBanner, { backgroundColor: getFlagColor() }]}>
          <View style={styles.flagContent}>
            <IconSymbol 
              name="flag.fill" 
              size={28} 
              color="#FFFFFF" 
            />
            <View style={styles.flagTextContainer}>
              <Text style={styles.flagTitle}>{getFlagText()}</Text>
              <Text style={styles.flagSubtitle}>{beach.name}</Text>
            </View>
          </View>
        </View>

        {/* Active Alerts Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Active Alerts ({alerts.length})</Text>
          {alerts.length > 0 ? (
            <Text style={styles.sectionSubtitle}>
              These conditions were evaluated to determine the current flag status
            </Text>
          ) : (
            <Text style={styles.sectionSubtitle}>
              No active alerts. Conditions are favorable for beach activities.
            </Text>
          )}

          {alerts.length > 0 ? (
            alerts.map((alert) => (
              <View 
                key={alert.id} 
                style={[
                  styles.alertCard,
                  { borderLeftColor: getSeverityColor(alert.severity) }
                ]}
              >
                <View style={styles.alertHeader}>
                  <View style={[
                    styles.alertIconContainer,
                    { backgroundColor: getSeverityColor(alert.severity) }
                  ]}>
                    <IconSymbol 
                      name={getSeverityIcon(alert.severity)} 
                      size={24} 
                      color="#FFFFFF" 
                    />
                  </View>
                  <View style={styles.alertHeaderText}>
                    <Text style={styles.alertTitle}>{alert.title}</Text>
                    <Text style={[
                      styles.alertSeverity,
                      { color: getSeverityColor(alert.severity) }
                    ]}>
                      {alert.severity.toUpperCase()}
                    </Text>
                  </View>
                </View>

                <Text style={styles.alertDescription}>{alert.description}</Text>

                {alert.currentValue && alert.safeThreshold && (
                  <View style={styles.alertValues}>
                    <View style={styles.valueItem}>
                      <Text style={styles.valueLabel}>Current Value:</Text>
                      <Text style={styles.valueText}>{alert.currentValue}</Text>
                    </View>
                    <View style={styles.valueItem}>
                      <Text style={styles.valueLabel}>Safe Threshold:</Text>
                      <Text style={styles.valueTextSafe}>{alert.safeThreshold}</Text>
                    </View>
                  </View>
                )}
              </View>
            ))
          ) : (
            <View style={styles.noAlertsCard}>
              <IconSymbol 
                name="checkmark.circle.fill" 
                size={48} 
                color="#34C759" 
              />
              <Text style={styles.noAlertsTitle}>All Clear!</Text>
              <Text style={styles.noAlertsText}>
                Current conditions are safe for swimming and beach activities.
              </Text>
            </View>
          )}
        </View>

        {/* About Beach Flags Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About Beach Flags</Text>
          <View style={styles.infoCard}>
            <Text style={styles.infoText}>
              Beach flag colors indicate water safety conditions. Green means safe, 
              yellow indicates moderate hazards, red means dangerous conditions, and 
              purple warns of marine life hazards. Always follow lifeguard instructions 
              and posted warnings.
            </Text>

            <View style={styles.flagLegend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#34C759' }]} />
                <Text style={styles.legendText}>Green - Safe conditions</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#FFCC00' }]} />
                <Text style={styles.legendText}>Yellow - Moderate hazards</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#FF3B30' }]} />
                <Text style={styles.legendText}>Red - Dangerous conditions</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#AF52DE' }]} />
                <Text style={styles.legendText}>Purple - Marine life warning</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Last Updated */}
        <Text style={styles.lastUpdated}>
          Last updated: {conditions.lastUpdated}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
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
    padding: spacing.xl,
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  flagBanner: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    marginBottom: spacing.lg,
  },
  flagContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  flagTextContainer: {
    flex: 1,
  },
  flagTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  flagSubtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
    lineHeight: 20,
  },
  alertCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderLeftWidth: 4,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  alertIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertHeaderText: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  alertSeverity: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  alertDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  alertValues: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    gap: spacing.sm,
  },
  valueItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  valueLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  valueText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '700',
  },
  valueTextSafe: {
    fontSize: 14,
    color: colors.success,
    fontWeight: '700',
  },
  noAlertsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.md,
    padding: spacing.xxl,
    alignItems: 'center',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  noAlertsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  noAlertsText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  infoCard: {
    backgroundColor: '#E3F2FD',
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: '#90CAF9',
  },
  infoText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  flagLegend: {
    gap: spacing.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  legendDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  legendText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  lastUpdated: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },
});
