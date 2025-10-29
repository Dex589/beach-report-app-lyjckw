
import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';

const { width } = Dimensions.get('window');

export const WaveHeader: React.FC = () => {
  return (
    <View style={styles.container}>
      <Svg width={width} height={180} viewBox={`0 0 ${width} 180`} style={styles.svg}>
        <Defs>
          <LinearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#00CED1" stopOpacity="1" />
            <Stop offset="100%" stopColor="#4169E1" stopOpacity="1" />
          </LinearGradient>
        </Defs>
        <Path
          d={`M0,100 Q${width * 0.25},80 ${width * 0.5},100 T${width},100 L${width},0 L0,0 Z`}
          fill="url(#gradient)"
        />
        <Path
          d={`M0,120 Q${width * 0.25},100 ${width * 0.5},120 T${width},120 L${width},0 L0,0 Z`}
          fill="url(#gradient)"
          opacity="0.5"
        />
        <Path
          d={`M0,140 Q${width * 0.25},120 ${width * 0.5},140 T${width},140 L${width},0 L0,0 Z`}
          fill="url(#gradient)"
          opacity="0.3"
        />
      </Svg>
      
      {/* Beach Report Logo */}
      <View style={styles.logoContainer}>
        <View style={styles.titleRow}>
          <View style={styles.wavesContainer}>
            <IconSymbol name="water.waves" size={22} color="#FFFFFF" />
          </View>
          <View style={styles.logoTextContainer}>
            <Text style={styles.logoText}>
              <Text style={styles.logoBeach}>Beach </Text>
              <Text style={styles.logoReport}>Report</Text>
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 180,
    zIndex: 1,
  },
  svg: {
    position: 'absolute',
    top: 0,
  },
  logoContainer: {
    position: 'absolute',
    top: 60,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  wavesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 2,
  },
  logoTextContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  logoText: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  logoBeach: {
    color: '#FFFFFF',
  },
  logoReport: {
    color: '#FFB800',
  },
});
