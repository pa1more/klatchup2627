import {useNavigation} from '@react-navigation/native';
import React from 'react'
import {StyleSheet, Text, View} from 'react-native'
import ToolbarIcon from './ToolbarIcon';
import { DesignSystem } from '../theme/DesignSystem'

const styles = StyleSheet.create({
  container: {
    height: 56,
    flexDirection: 'row',
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  btnBack: {
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imgBack: {
    height: 25,
    width: 25,
  },
  textTitle: {
    color: DesignSystem.colors.white,
    textAlign: 'center',
    flex: 1,
    fontSize: 18,
    fontWeight: '400',
  },
});

const Toolbar = ({
  title = '',
  rightComponent = <View />,
}: {
  title: string
  rightComponent?: React.ReactNode
}) => {

  const navigation = useNavigation()
  const goBack = () => navigation.goBack()

  return (
    <View style={styles.container}>
      <ToolbarIcon onPress={goBack} />
      <Text style={styles.textTitle}>{title}</Text>
      {rightComponent}
    </View>
  )
}

export default Toolbar
