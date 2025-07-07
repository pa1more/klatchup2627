import { Image, StyleSheet, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import GradientBorderView from './GradientBorderView'

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    borderRadius: 20,
    marginVertical: 7,
  },
  image: {
    height: 150,
    width: 150,
    borderRadius: 20,
  },
})

interface Props {
  imageUrl: string
  onPress: () => void
}

const defaultProps: Props = {
  imageUrl: '',
  onPress: () => { },
}

const ProfileIcon = ({ imageUrl, onPress }: Props) => {

  const hasValidUrl = imageUrl && imageUrl.trim() !== '';

  return (
    <TouchableOpacity
      activeOpacity={0.6}
      style={styles.container}
      onPress={onPress}>
      <GradientBorderView borderWidth={2} styles={styles.container}>
        <Image style={styles.image} source={
          hasValidUrl
            ? { uri: imageUrl }
            : require('../assets/images/intro.png') // path to your local asset
        } />
      </GradientBorderView>
    </TouchableOpacity>
  )
}

ProfileIcon.defaultProps = defaultProps

export default ProfileIcon;
