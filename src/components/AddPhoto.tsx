import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import LinearGradient from 'react-native-linear-gradient'

const styles = StyleSheet.create({
  container: {
    height: 100,
    width: 100,
    backgroundColor: '#F2EAFF',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textPlus: {
    fontSize: 60,
    textAlign: 'center',
    color: '#4D1469',
  },
})

interface Props {
  onPress: () => void
  imageUri: string
}

const defaultProps: Props = {
  onPress: () => { },
  imageUri: '',
}

const AddPhoto = ({ onPress, imageUri }: Props) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <LinearGradient
        style={styles.container}
        colors={['#F58C00', '#704002']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}>
        {imageUri !== '' ? (
          <Image style={styles.container} source={{ uri: imageUri }} />
        ) : (
          <View style={styles.container}>
            <Text style={styles.textPlus}>+</Text>
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity >
  )
}

AddPhoto.defaultProps = defaultProps

export default AddPhoto
