import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Colors from '../theme/Colors'
import Fonts from '../theme/Fonts'
import Modal from 'react-native-modal';
import GradientText from './GradientText'
import LinearGradient from 'react-native-linear-gradient'

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'center',
    marginLeft: 0,
    marginRight: 0,
  },
  container: {
    backgroundColor: '#300943',
    borderRadius: 20,
  },
  textTitle: {
    color: Colors.white,
    fontFamily: Fonts.PromptMedium,
    fontSize: 16,
    textAlign: 'center',
    padding: 10,
  },
  textSubTitle: {
    color: Colors.white,
    fontFamily: Fonts.PromptRegular,
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 20,
  },
  line: {
    height: 1,
    width: '100%',
    backgroundColor: 'white',
    marginBottom: 10,
  },
  containerBtns: {
    flexDirection: 'row',
    borderBottomEndRadius: 20,
    borderBottomStartRadius: 20,
    height: 50,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    margin: 1,
  },
  textBtnLeft: {
    fontSize: 15,
    fontFamily: Fonts.PromptRegular,
  },
  textAccept: {
    fontSize: 15,
    color: Colors.white,
    fontFamily: Fonts.PromptRegular,
  },
})

interface Props {
  isVisible: boolean
  title: string
  message: string
  hideModal: () => void
  onPressYes?: () => void
  onPressNo?: () => void
}

const defaultProps: Props = {
  isVisible: false,
  title: '',
  message: '',
  hideModal: () => { },
  onPressYes: () => { },
  onPressNo: () => { },
}

const AlertModal = ({ isVisible, hideModal, title, message, onPressYes,
  onPressNo, }: Props) => {

  return (

    <Modal
      style={styles.modal}
      isVisible={isVisible}
      onBackdropPress={hideModal}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      animationInTiming={400}
      animationOutTiming={400}
      onBackButtonPress={hideModal}>
      <View style={styles.container}>
        <Text style={styles.textTitle}>{title}</Text>
        <View style={styles.line} />
        <Text style={styles.textSubTitle}>{message}</Text>

        <LinearGradient
          style={{ height: 1, marginTop: 20 }}
          colors={['#F58C00', '#704002']}
        />
        <View style={styles.containerBtns}>

          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor: '#300943', borderBottomLeftRadius: 20,
                flex: 1, // Important: make this outer view flexible too
              },
            ]} onPress={onPressNo}>
            <GradientText
              style={styles.textBtnLeft}
              colors={['#F58C00', '#704002']}
              underline>
              No
            </GradientText>
          </TouchableOpacity>

          <LinearGradient
            style={{ flex: 1, borderBottomEndRadius: 20 }}
            colors={['#F58C00', '#704002']}>
            <TouchableOpacity style={styles.button} onPress={onPressYes}>
              <Text style={styles.textAccept}>Yes</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </View>
    </Modal>
  )
}

AlertModal.defaultProps = defaultProps;

export default AlertModal
