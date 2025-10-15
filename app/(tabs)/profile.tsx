
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@react-navigation/native';
import { IconSymbol } from '@/components/IconSymbol';
import { GlassView } from 'expo-glass-effect';

export default function ProfileScreen() {
  const theme = useTheme();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>Settings</Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Preferences
          </Text>
          <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
            <View style={styles.settingItem}>
              <IconSymbol name="bell.fill" size={24} color={theme.colors.primary} />
              <Text style={[styles.settingText, { color: theme.colors.text }]}>
                Notifications
              </Text>
            </View>
            <View style={styles.settingItem}>
              <IconSymbol name="location.fill" size={24} color={theme.colors.primary} />
              <Text style={[styles.settingText, { color: theme.colors.text }]}>
                Location Services
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            About
          </Text>
          <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
            <View style={styles.settingItem}>
              <IconSymbol name="info.circle.fill" size={24} color={theme.colors.primary} />
              <Text style={[styles.settingText, { color: theme.colors.text }]}>
                App Version 1.0.0
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  settingText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
