import React, { useRef, useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { DesignSystem } from '../theme/DesignSystem';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

const imageWidth = width - 30;

const styles = StyleSheet.create({
  list: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: imageWidth,
    width: imageWidth,
    borderRadius: 20,
  },
  containerItem: {
    alignItems: 'center',
    width,
  },
  containerIndicator: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    bottom: 30,
    borderRadius: 20,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  textAge: {
    marginBottom: 10,
    fontSize: 20,
    color: DesignSystem.colors.white,
    fontWeight: '500',
    position: 'absolute',
    bottom: 20,
  },
  dot: {
    height: 8,
    width: 8,
    backgroundColor: 'white',
    borderRadius: 10,
    zIndex: 10,
    margin: 2,
  },
  dotCurrent: {
    height: 12,
    width: 12,
    borderRadius: 10,
    zIndex: 10,
    margin: 2,
  },
});

interface Props {
  images: string[]
}

const defaultProps: Props = {
  images: [],
}

const ImagesCarousel = ({ images }: Props) => {

  const [currentIndex, setCurrentIndex] = useState(0)

  const handleViewableItemsChanged = useRef(({ viewableItems, changed }) => {
    if (viewableItems) {
      if (viewableItems[0]?.index) {
        setCurrentIndex(viewableItems[0]?.index);
      }
    }
  })

  return (
    <View>
      <FlatList
        data={images}
        horizontal
        overScrollMode="never"
        bounces={false}
        pagingEnabled
        snapToAlignment="center"
        keyExtractor={(_, index) => index.toString()}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
        onViewableItemsChanged={handleViewableItemsChanged.current}
        renderItem={({ item }) => (
          <TouchableOpacity activeOpacity={0.6} style={styles.containerItem}>
            <Image style={styles.image} source={{ uri: item }} />
            <Text style={styles.textAge}>{images.length}</Text>
          </TouchableOpacity>
        )}
      />
      <View style={styles.containerIndicator}>
        {images.map((image, index) =>
          index === currentIndex ? (
            <LinearGradient
              colors={['#F58C00', '#704002']}
              style={styles.dotCurrent}
            />
          ) : (
            <View style={styles.dot} />
          )
        )}
      </View>
    </View>
  );
};

ImagesCarousel.defaultProps = defaultProps;

export default ImagesCarousel;
