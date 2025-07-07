import React from 'react';
import {
  Image,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const styles = StyleSheet.create({
  container: {
    height: 120,
    width: 120,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  containerWhite: {
    height: 115,
    width: 115,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2EAFF',
    borderRadius: 20,
  },
  textPlus: {
    fontSize: 80,
    color: '#4D1469',
    textAlign: 'center',
  },
});

interface Props {
  style?: StyleProp<ViewStyle>
  onPress: () => void
  imageUri: string
}

const defaultProps: Props = {
  style: {},
  onPress: () => {},
  imageUri: '',
};

const SelectPicture = ({style, onPress, imageUri}: Props) => {
  return (
    <TouchableOpacity onPress={onPress} style={style} activeOpacity={0.6}>
      <LinearGradient
        style={styles.container}
        colors={['#F58C00', '#704002']}
        start={{x: 0, y: 0}}
        end={{x: 0, y: 1}}>
        {imageUri !== '' ? (
          <Image style={styles.containerWhite} source={{uri: imageUri}} />
        ) : (
          <View style={styles.containerWhite}>
            <Text style={styles.textPlus}>+</Text>
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

SelectPicture.defaultProps = defaultProps

export default SelectPicture;
