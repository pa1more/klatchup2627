import React from 'react'
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import Modal from 'react-native-modal'
import Colors from '../theme/Colors';
import Fonts from '../theme/Fonts';
import LinearGradient from 'react-native-linear-gradient'

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    marginLeft: 0,
    marginRight: 0,
  },
  container: {
    backgroundColor: '#300943',
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
    paddingBottom: 30,
  },
  textTitle: {
    color: Colors.white,
    fontFamily: Fonts.PromptRegular,
    fontSize: 16,
    textAlign: 'center',
    padding: 10,
  },
  line: {
    height: 1,
    width: '100%',
    backgroundColor: 'white',
    marginBottom: 10,
  },
  containerOption: {
    borderRadius: 20,
    marginHorizontal: 20,
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
  },
  containerOptionInner: {
    height: 45,
    borderRadius: 20,
    backgroundColor: '#300943',
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    width: '100%',
  },
  textOption: {
    color: Colors.white,
    fontFamily: Fonts.PromptRegular,
    fontSize: 14,
    textAlign: 'center',
    marginLeft: 20,
  },
  icon: {
    height: 20,
  },
});

interface Props {
  isVisible: boolean
  hideModal: () => void
  selectImage: () => void
  captureImage: () => void
}

const defaultProps: Props = {
  isVisible: false,
  hideModal: () => {},
  selectImage: () => {},
  captureImage: () => {},
}

const Option = ({
  icon,
  title,
  onPress,
}: {
  icon: ImageSourcePropType
  title: string
  onPress: () => void
}) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.6}>
      <LinearGradient
        style={styles.containerOption}
        colors={['#F58C00', '#704002']}
        start={{x: 0, y: 0}}
        end={{x: 0, y: 1}}>
        <View style={styles.containerOptionInner}>
          <Image source={icon} />
          <Text style={styles.textOption}>{title}</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  )
}

const ImagePickerModal = ({
  isVisible,
  hideModal,
  captureImage,
  selectImage,
}: Props) => {
  return (
    <Modal
      style={styles.modal}
      isVisible={isVisible}
      onBackdropPress={hideModal}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      animationInTiming={600}
      animationOutTiming={600}
      onBackButtonPress={hideModal}>
      <View style={styles.container}>
        <Text style={styles.textTitle}>Add Images</Text>

        <View style={styles.line} />

        <Option
          icon={require('../assets/icons/ic_camera.png')}
          title={'Take a photo'}
          onPress={() => {
            hideModal()
            captureImage();
          }}
        />

        <Option
          icon={require('../assets/icons/ic_gallery.png')}
          title={'Choose from your photos'}
          onPress={() => {
            hideModal()
            selectImage();
          }}
        />
      </View>
    </Modal>
  )
}

export default ImagePickerModal

ImagePickerModal.defaultProps = defaultProps
