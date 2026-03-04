import React from 'react'
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import LinearGradient from 'react-native-linear-gradient';

const styles = StyleSheet.create({
  containerOption: {},
  btnOption: {
    backgroundColor: '#F2EAFF',
    marginVertical: 5,
    padding: 15,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textOptionName: {
    color: '#4D1469',
    fontWeight: '500',
    fontSize: 14,
  },
  dot: {
    height: 24,
    width: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotWhite: {
    height: 18,
    width: 18,
    borderRadius: 12,
    backgroundColor: '#F2EAFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotSelected: {
    height: 10,
    width: 10,
    borderRadius: 12,
  },
})

interface Props {
  options: string[]
  selectedOption: string
  onChanged: (option: string) => void
}

const defaultProps: Props = {
  options: [],
  selectedOption: '',
  onChanged: () => {},
};

const RadioButtonGroup = ({options, selectedOption, onChanged}: Props) => {
  return (
    <View>
      {options.map(option => (
        <TouchableOpacity
          onPress={() => onChanged(option)}
          activeOpacity={0.6}
          style={styles.containerOption}>
          <View style={styles.btnOption}>
            <Text style={styles.textOptionName}>{option}</Text>

            <LinearGradient
              style={styles.dot}
              colors={['#F58C00', '#704002']}
              start={{x: 0, y: 0}}
              end={{x: 0, y: 1}}>
              <View style={styles.dotWhite}>
                {option === selectedOption && (
                  <LinearGradient
                    style={styles.dotSelected}
                    colors={['#F58C00', '#704002']}
                    start={{x: 0, y: 0}}
                    end={{x: 0, y: 1}}
                  />
                )}
              </View>
            </LinearGradient>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  )
}

RadioButtonGroup.defaultProps = defaultProps

export default RadioButtonGroup
