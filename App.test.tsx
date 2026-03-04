import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2d1b47',
  },
  text: {
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold',
  },
})

const MinimalApp = () => {
  console.log('✅ MinimalApp rendering!');
  
  return (
    <View style={styles.container}>
      <Text style={styles.text}>🎉 Klatchup</Text>
      <Text style={{color: '#fff',  marginTop: 10}}>App is working!</Text>
    </View>
  )
}

export default MinimalApp
