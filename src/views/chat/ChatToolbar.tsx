import { useNavigation } from '@react-navigation/native'
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Colors from '../../theme/Colors'
import ToolbarIcon from '../../components/ToolbarIcon'
import Fonts from '../../theme/Fonts'

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
    color: Colors.white,
    textAlign: 'center',
    fontSize: 17,
    fontFamily: Fonts.UnboundedRegular,
    marginLeft: 20,
  },
  image: {
    height: 30,
    width: 30,
    borderRadius: 7,
  },
  containerMiddle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
})

const Toolbar = ({
  name = '',
  image = '',
  onPressReport,
}: {
  name: string
  image: string
  onPressReport: any
}) => {

  const navigation = useNavigation();
  const goBack = () => navigation.goBack();
  const hasValidUrl = image && image.trim() !== '';

  return (
    <View style={styles.container}>
      <ToolbarIcon onPress={goBack} />
      <View style={styles.containerMiddle}>
        <Image style={styles.image} source={
          hasValidUrl
            ? { uri: image }
            : require('../../assets/images/intro.png') // path to your local asset
        } />
        <Text style={styles.textTitle}>{name}</Text>
      </View>
      <ToolbarIcon
        icon={require('../../assets/icons/ic_report.png')}
        onPress={onPressReport}
      />
    </View>
  );
};

export default Toolbar;
