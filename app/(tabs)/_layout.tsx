
import React from 'react';
import { Platform } from 'react-native';
import { Stack } from 'expo-router';
import { colors } from '@/styles/commonStyles';
import FloatingTabBar, { TabBarItem } from '@/components/FloatingTabBar';

const tabs: TabBarItem[] = [
  {
    name: 'home',
    route: '/(tabs)/(home)',
    label: 'Home',
    icon: 'house.fill',
  },
  {
    name: 'search',
    route: '/(tabs)/search',
    label: 'Search',
    icon: 'magnifyingglass',
  },
  {
    name: 'favorite',
    route: '/(tabs)/favorite',
    label: 'Favorites',
    icon: 'heart.fill',
  },
  {
    name: 'profile',
    route: '/(tabs)/profile',
    label: 'Settings',
    icon: 'gearshape.fill',
  },
];

export default function TabLayout() {
  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      />
      <FloatingTabBar tabs={tabs} />
    </>
  );
}
