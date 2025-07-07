import {StyleSheet, View, Animated, Easing} from 'react-native'
import React, {useRef, useEffect} from 'react'
import Circle from '../assets/svg/CirclesWithLogo'

const AnimatedLoading = Animated.createAnimatedComponent(Circle)

const styles = StyleSheet.create({
  containerMain: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageLogo: {
    height: 70,
    width: 70,
    position: 'absolute',
  },
  circle: {
    flex: 1,
  },
})

const FindingAnimation = () => {
  
  const circles = useRef(new Animated.Value(1)).current

  useEffect(() => {
    Animated.loop(
      Animated.timing(circles, {
        useNativeDriver: false,
        duration: 2400,
        easing: Easing.ease,
        toValue: 6,
      })
    ).start();
  }, []);

  return (
    <View style={styles.containerMain}>
      <AnimatedLoading
        style={styles.circle}
        circules={circles.interpolate({
          inputRange: [1, 2, 3, 4, 5, 6],
          outputRange: [1, 2, 3, 4, 5, 6],
        })}
      />
    </View>
  )
}

export default FindingAnimation
