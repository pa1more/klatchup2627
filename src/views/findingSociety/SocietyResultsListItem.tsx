import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Fonts from '../../theme/Fonts';
import Colors from '../../theme/Colors';
import GradientText from '../../components/GradientText';
import GradientBorderView from '../../components/GradientBorderView'

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    marginVertical: 5,
  },
  btn: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 20,
    backgroundColor: '#300943',
    borderRadius: 20,
  },
  textName: {
    fontSize: 18,
    fontFamily: Fonts.PromptMedium,
    color: Colors.white,
  },
  textAddress: {
    fontSize: 16,
    fontFamily: Fonts.PromptRegular,
    color: Colors.white,
  },
  containerText: {
    flex: 3,
  },
  textGetIn: {
    fontSize: 18,
    fontFamily: Fonts.PromptMedium,
  },
  containerGetIn: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  activeLabel: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#28a745', // Bootstrap green
    color: '#ffffff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12, // slightly larger font
    fontWeight: '600',
    overflow: 'hidden',
    zIndex: 1,
  },
});

interface Props {
  name: string
  address: string
  onPress: () => void
  active: boolean
}

const defaultProps: Props = {
  name: '',
  address: '',
  onPress: () => { },
  active: false
};

const SocietyResultsListItem = ({ name, address, active, onPress }: Props) => {

  return (
    <GradientBorderView borderWidth={1} styles={styles.container}>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.6}
        style={styles.btn}>
        {/* Active label in top-right */}
        {active && <Text style={styles.activeLabel}>Active</Text>}
        {/* <Text style={styles.activeLabel}>Active</Text> */}
        <View style={styles.containerText}>
          <Text style={styles.textName}>{name}</Text>
          <Text style={styles.textAddress}>{address}</Text>
        </View>

        <View style={styles.containerGetIn}>
          {!active &&
            <GradientText
              style={styles.textGetIn}
              colors={['#F58C00', '#704002']}
              underline>
              Get In
            </GradientText>
          }
        </View>
      </TouchableOpacity>
    </GradientBorderView>
  );
};

SocietyResultsListItem.defaultProps = defaultProps

export default SocietyResultsListItem;
