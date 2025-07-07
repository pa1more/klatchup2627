import React from 'react'
import {StyleSheet, Text, View, Image, ImageSourcePropType} from 'react-native'
import Fonts from '../theme/Fonts'
import Colors from '../theme/Colors'

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    padding: 20,
    marginBottom: 30,
  },
  textTitle: {
    fontSize: 18,
    fontFamily: Fonts.PromptMedium,
    color: Colors.white,
    textAlign: 'center',
  },
  textMessage: {
    fontSize: 16,
    fontFamily: Fonts.PromptRegular,
    color: Colors.white,
    textAlign: 'center',
    marginTop: 10,
  },
  icon: {
    height: 120,
    marginBottom: 30,
  },
})

interface Props {
  title: string
  message?: string
  icon: ImageSourcePropType
}

const defaultProps: Props = {
  title: '',
  message: '',
  icon: require('../assets/icons/ic_no_search_results.png'),
}

const ListEmptyComponent = ({title, message, icon}: Props) => {
  return (
    <View style={styles.container}>
      <Image style={styles.icon} source={icon} resizeMode="contain" />
      <Text style={styles.textTitle}>{title}</Text>
      <Text style={styles.textMessage}>{message}</Text>
    </View>
  )
}

ListEmptyComponent.defaultProps = defaultProps

export default ListEmptyComponent
