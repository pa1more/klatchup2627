import {
  StyleSheet,
  Animated,
  Easing,
  View,
  Text,
  Dimensions,
} from 'react-native';
import React, {useRef, useEffect} from 'react';
import KRight from '../assets/svg/KRight';
import KLeft from '../assets/svg/KLeft';

const {width} = Dimensions.get('window');

const AnimatedKRight = Animated.createAnimatedComponent(KRight);
const AnimatedKLeft = Animated.createAnimatedComponent(KLeft);

const styles = StyleSheet.create({});

const SplashAnimation = () => {
  
  const rightKPos = useRef(new Animated.Value(1)).current
  const leftKPos = useRef(new Animated.Value(1)).current

  useEffect(() => {
    Animated.timing(rightKPos, {
      useNativeDriver: true,
      duration: 1500,
      toValue: 6,
    }).start()
  }, [])

  return (
    <View style={{flexDirection: 'row'}}>
      <AnimatedKLeft
        translateX={rightKPos.interpolate({
          inputRange: [1, 2, 3, 4, 5, 6],
          outputRange: [
            -100,
            width / 2.3 + 40,
            width / 2.3 - 40,
            width / 2.3,
            width / 2.3,
            width / 2.3,
          ],
        })}
      />
      <AnimatedKRight
        translateX={rightKPos.interpolate({
          inputRange: [1, 2, 3, 4, 5, 6],
          outputRange: [
            width + 100,
            width / 2.3 - 40,
            width / 2.3 + 40,
            width / 2.3,
            width / 2.3,
            width / 2.3,
          ],
        })}
      />
    </View>
  );
};

export default SplashAnimation;
