import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2d1b47',
  },
})

const App = () => {
  console.log('✅✅✅ App.tsx is rendering!');
  
  return (
    <View style={styles.container}>
      <Text style={{fontSize: 32, color: '#fff', fontWeight: 'bold'}}>🎉 Klatchup</Text>
      <Text style={{color: '#fff', marginTop: 20}}>App Working!</Text>
    </View>
  )
}

export default App
