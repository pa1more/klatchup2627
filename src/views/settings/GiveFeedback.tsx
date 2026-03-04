import {Alert, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import ScreenWrapper from '../../components/ScreenWrapper';
import Toolbar from '../../components/Toolbar';
import TextInput from '../../components/TextInput';
import Button from '../../components/Button';
import { DesignSystem } from '../../theme/DesignSystem';

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  textTitle: {
    color: DesignSystem.colors.white,
    fontSize: 24,
    fontWeight: '600',
  },
  textsub: {
    color: DesignSystem.colors.white,
    fontSize: 14,
    fontWeight: '400',
    marginBottom: 20,
  },
  input: {
    height: 140,
    fontSize: 14,
    textAlignVertical: 'top',
    textAlign: 'left',
    paddingVertical: 10,
  },
  btn: {
    alignSelf: 'center',
    marginVertical: 50,
  },
});

const GiveFeedback = () => {
  const [feedback, setFeedback] = useState('');

  const onPressSendFeedback = () => {
    if (feedback.trim().length < 10) {
      Alert.alert('Feedback Too Short', 'Please write at least 10 characters to help us understand your feedback.');
      return;
    }
    // TODO: Add API call to send feedback
    Alert.alert('Thank You!', 'Your feedback has been submitted successfully.');
    setFeedback('');
  };

  return (
    <ScreenWrapper>
      <Toolbar title="" />
      <View style={styles.container}>
        <Text style={styles.textTitle}>Send Feedback</Text>
        <Text style={styles.textsub}>
          Tell us what you love about the app, or what we could be doing better.
        </Text>

        <TextInput
          placeholder="Type feedback here..."
          value={feedback}
          placeholderTextColor={'gray'}
          onChangeText={text => setFeedback(text)}
          style={styles.input}
          multiline
        />
        <Button style={styles.btn} title="Send Feedback" onPress={onPressSendFeedback} />
      </View>
    </ScreenWrapper>
  );
};

export default GiveFeedback
