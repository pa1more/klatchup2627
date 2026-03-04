import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { DesignSystem } from '../theme/DesignSystem';

interface PlaceTypeSelectorProps {
  selectedTypes: string[];
  onSelectTypes: (types: string[]) => void;
}

const PLACE_TYPE_OPTIONS = [
  // Dining & Food
  { label: '🍽️ Restaurant', value: 'restaurant' },
  { label: '☕ Cafe', value: 'cafe' },
  { label: '🍕 Fast Food', value: 'fast_food_restaurant' },
  { label: '🍣 Sushi', value: 'sushi_restaurant' },
  { label: '🍝 Italian', value: 'italian_restaurant' },
  { label: '🌮 Mexican', value: 'mexican_restaurant' },
  { label: '🥘 Spanish', value: 'spanish_restaurant' },
  { label: '🥡 Chinese', value: 'chinese_restaurant' },
  { label: '🍜 Ramen', value: 'ramen_restaurant' },
  { label: '🧆 Mediterranean', value: 'mediterranean_restaurant' },
  { label: '🥙 Middle Eastern', value: 'middle_eastern_restaurant' },
  { label: '🍪 Bakery', value: 'bakery' },
  { label: '🍦 Ice Cream', value: 'ice_cream_shop' },
  { label: '☕ Coffee Shop', value: 'coffee_shop' },
  { label: '🥤 Juice Bar', value: 'juice_bar' },

  // Bars & Nightlife
  { label: '🍺 Bar', value: 'bar' },
  { label: '🍹 Cocktail Bar', value: 'cocktail_bar' },
  { label: '🍻 Pub', value: 'pub' },
  { label: '⚽ Sports Bar', value: 'sports_bar' },
  { label: '🎵 Night Club', value: 'night_club' },
  { label: '🎤 Karaoke Club', value: 'karaoke' },

  // Entertainment & Recreation
  { label: '🎬 Movie Theater', value: 'movie_theater' },
  { label: '🎪 Amusement Park', value: 'amusement_park' },
  { label: '🎮 Bowling Alley', value: 'bowling_alley' },
  { label: '🎯 Billiard Hall', value: 'billiard_hall' },
  { label: '🎵 Live Music', value: 'live_music_venue' },
  { label: '💃 Dance Hall', value: 'dance_hall' },
  { label: '🎪 Casino', value: 'casino' },
  { label: '🎭 Theater', value: 'theater' },

  // Culture & Art
  { label: '🎨 Art Gallery', value: 'art_gallery' },
  { label: '🏛️ Museum', value: 'museum' },
  { label: '📚 Library', value: 'library' },

  // Outdoor & Sports
  { label: '🏞️ Park', value: 'park' },
  { label: '🥾 Hiking', value: 'hiking_area' },
  { label: '🐕 Dog Park', value: 'dog_park' },
  { label: '⛹️ Basketball Court', value: 'basketball_court' },
  { label: '🎾 Tennis Court', value: 'tennis_court' },
  { label: '🏋️ Gym', value: 'gym' },
  { label: '🏊 Swimming Pool', value: 'swimming_pool' },
  { label: '🏄 Surfing Beach', value: 'surfing_beach' },
  { label: '🏖️ Beach', value: 'beach' },

  // Shopping & Social
  { label: '🛍️ Shopping Mall', value: 'shopping_mall' },
  { label: '🏪 Store', value: 'store' },

  // Attractions & Unique
  { label: '🦁 Zoo', value: 'zoo' },
  { label: '🐠 Aquarium', value: 'aquarium' },
  { label: '🎡 Tourist Attraction', value: 'tourist_attraction' },
  { label: '♨️ Hot Spring/Spa', value: 'spa' },
  { label: '🎪 Playground', value: 'playground' },
];

const PlaceTypeSelector: React.FC<PlaceTypeSelectorProps> = ({ selectedTypes, onSelectTypes }) => {
  const toggleType = (type: string) => {
    if (selectedTypes.includes(type)) {
      onSelectTypes(selectedTypes.filter((t) => t !== type));
    } else {
      onSelectTypes([...selectedTypes, type]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Place Types</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {PLACE_TYPE_OPTIONS.map((option) => {
          const isSelected = selectedTypes.includes(option.value);
          return (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.typeButton,
                isSelected && styles.typeButtonSelected,
              ]}
              onPress={() => toggleType(option.value)}
            >
              <Text
                style={[
                  styles.typeText,
                  isSelected && styles.typeTextSelected,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
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
  typeButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  typeButtonSelected: {
    backgroundColor: DesignSystem.colors.primary,
    borderColor: DesignSystem.colors.primary,
  },
  typeText: {
    fontSize: 13,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  typeTextSelected: {
    color: DesignSystem.colors.white,
    fontWeight: '500',
  },
});

export default PlaceTypeSelector;
