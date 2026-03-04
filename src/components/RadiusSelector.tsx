import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { DesignSystem } from '../theme/DesignSystem';

interface RadiusSelectorProps {
  selectedRadius: number;
  onSelectRadius: (radius: number) => void;
}

const RADIUS_OPTIONS = [
  { label: '500m', value: 500 },
  { label: '1 km', value: 1000 },
  { label: '2 km', value: 2000 },
  { label: '3 km', value: 3000 },
  { label: '4 km', value: 4000 },
  { label: '5 km', value: 5000 },
  { label: '10 km', value: 10000 },
  { label: '15 km', value: 15000 },
  { label: '20 km', value: 20000 },
];

const RadiusSelector: React.FC<RadiusSelectorProps> = ({ selectedRadius, onSelectRadius }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search Radius</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {RADIUS_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.radiusButton,
              selectedRadius === option.value && styles.radiusButtonSelected,
            ]}
            onPress={() => onSelectRadius(option.value)}
          >
            <Text
              style={[
                styles.radiusText,
                selectedRadius === option.value && styles.radiusTextSelected,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: DesignSystem.colors.white,
    marginBottom: 10,
  },
  scrollContent: {
    paddingRight: 10,
  },
  radiusButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  radiusButtonSelected: {
    backgroundColor: DesignSystem.colors.primary,
    borderColor: DesignSystem.colors.primary,
  },
  radiusText: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  radiusTextSelected: {
    color: DesignSystem.colors.white,
    fontWeight: '500',
  },
});

export default RadiusSelector;
