
import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { colors } from '@/styles/commonStyles';

const { width } = Dimensions.get('window');

export const WaveHeader: React.FC = () => {
  return (
    <View style={styles.container}>
      <Svg width={width} height={120} viewBox={`0 0 ${width} 120`} style={styles.svg}>
        <Defs>
          <LinearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#4682B4" stopOpacity="1" />
            <Stop offset="100%" stopColor="#5B9BD5" stopOpacity="1" />
          </LinearGradient>
        </Defs>
        <Path
          d={`M0,40 Q${width * 0.25},20 ${width * 0.5},40 T${width},40 L${width},0 L0,0 Z`}
          fill="url(#gradient)"
        />
        <Path
          d={`M0,60 Q${width * 0.25},40 ${width * 0.5},60 T${width},60 L${width},0 L0,0 Z`}
          fill="url(#gradient)"
          opacity="0.5"
        />
        <Path
          d={`M0,80 Q${width * 0.25},60 ${width * 0.5},80 T${width},80 L${width},0 L0,0 Z`}
          fill="url(#gradient)"
          opacity="0.3"
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 120,
    zIndex: -1,
  },
  svg: {
    position: 'absolute',
    top: 0,
  },
});
