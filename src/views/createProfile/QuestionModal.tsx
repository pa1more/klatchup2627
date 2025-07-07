import { StyleSheet, View } from 'react-native';
import React, { useState } from 'react';
import Modal from 'react-native-modal';
import Chip from '../../components/Chip'
import Input from '../../components/TextInput';
import Button from '../../components/Button';

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'center',
    marginLeft: 0,
    marginRight: 0,
    backgroundColor: 'rgba(23, 2, 36, 0.85)',
  },
  container: {
    padding: 15,
  },
  input: {
    marginVertical: 5,
  },
  btn: {
    alignSelf: 'flex-end',
    marginTop: 20,
  },
})

interface Props {
  isVisible: boolean
  hideModal: () => void
}

const defaultProps: Props = {
  isVisible: false,
  hideModal: () => { },
}

const QuestionModal = ({ isVisible, hideModal }: Props) => {

  const [question1, setQuestion1] = useState('');
  const [question2, setQuestion2] = useState('');

  return (
    <Modal
      style={styles.modal}
      isVisible={isVisible}
      onBackdropPress={hideModal}
      onBackButtonPress={hideModal}>
      <View style={styles.container}>
        <View style={{ flexWrap: 'wrap' }}>
          <Chip title="Music" isSelected disabled />
        </View>
        <Input
          value={question1}
          onChangeText={(text) => setQuestion1(text)}
          placeholder="Type here..."
          style={styles.input}
        />
        <Input
          value={question2}
          onChangeText={(text) => setQuestion2(text)}
          placeholder="Type here..."
          style={styles.input}
        />
        <Button style={styles.btn} title="Done" onPress={hideModal} />
      </View>
    </Modal>
    
  )
}

QuestionModal.defaultProps = defaultProps

export default QuestionModal
