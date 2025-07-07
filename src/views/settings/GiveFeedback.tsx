import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import ScreenWrapper from '../../components/ScreenWrapper';
import Toolbar from '../../components/Toolbar';
import Fonts from '../../theme/Fonts';
import TextInput from '../../components/TextInput';
import Button from '../../components/Button';
import Colors from '../../theme/Colors';

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  textTitle: {
    color: Colors.white,
    fontSize: 24,
    fontFamily: Fonts.UnboundedMedium,
  },
  textsub: {
    color: Colors.white,
    fontSize: 14,
    fontFamily: Fonts.PromptRegular,
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
  const [feedback, setFeedback] = useState('')
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
        <Button style={styles.btn} title="Send Feedback" />
      </View>
    </ScreenWrapper>
  );
};

export default GiveFeedback
