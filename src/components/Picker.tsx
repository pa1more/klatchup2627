import React, {useState} from 'react'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Image,
} from 'react-native'
import { DesignSystem } from '../theme/DesignSystem'

const styles = StyleSheet.create({
  containerHeader: {
    backgroundColor: '#F2EAFF',
    marginTop: 5,
    padding: 15,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  containerHeaderExpanded: {
    backgroundColor: '#4D1469',
    marginTop: 5,
    padding: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textHeader: {
    color: '#4D1469',
    fontWeight: '400',
    fontSize: 14,
  },
  textHeaderExpanded: {
    color: DesignSystem.colors.white,
    fontWeight: '400',
    fontSize: 14,
  },
  containerOption: {
    backgroundColor: '#F2EAFF',
    padding: 10,
  },
  textOption: {
    color: '#4D1469',
    fontWeight: '400',
    fontSize: 14,
  },
  listOptions: {
    backgroundColor: '#F2EAFF',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    maxHeight: 250,
  },
  iconDown: {
    tintColor: '#F2EAFF',
    transform: [{rotate: '180deg'}],
  },
  iconUp: {},
  containerScrollIndicator: {
    height: 200,
    backgroundColor: 'lightgray',
    position: 'absolute',
    right: 10,
    top: 30,
    width: 5,
    zIndex: 100,
    borderRadius: 20,
  },
})

interface Props {
  placeholder: string
  options: string[]
  selectedOption: string
  onSelected: (option: string) => void
  showScrollIndicator: boolean
}

const defaultProps: Props = {
  placeholder: '',
  options: [],
  selectedOption: '',
  onSelected: () => {},
  showScrollIndicator: true,
};

const scrollElementHeightPercent = 25;

const Picker = ({
  placeholder,
  options,
  selectedOption,
  onSelected,
  showScrollIndicator,
}: Props) => {

  const [showOptions, setShowOptions] = useState(false)
  const [contentOffset, setContentOffset] = useState({x: 0, y: 0});
  const [contentSize, setContentSize] = useState(0);
  const [scrollViewHeight, setScrollViewHeight] = React.useState(0);

  const scrollPercente =
    (contentOffset.y / (contentSize - scrollViewHeight)) *
    (100 - scrollElementHeightPercent);

  const onPicked = (option: string) => {
    onSelected(option)
    setShowOptions(false)
  }

  return (

    <View>
      
      <TouchableOpacity
        onPress={() => setShowOptions(!showOptions)}
        style={
          showOptions ? styles.containerHeaderExpanded : styles.containerHeader
        }>
        <Text
          style={showOptions ? styles.textHeaderExpanded : styles.textHeader}>
          {showOptions
            ? placeholder
            : selectedOption
            ? selectedOption
            : placeholder}
        </Text>
        <Image
          style={showOptions ? styles.iconDown : styles.iconUp}
          source={require('../assets/icons/ic_down.png')}
        />
      </TouchableOpacity>
      
      {showOptions && (
        <View>
          <FlatList
            style={styles.listOptions}
            data={options}
            nestedScrollEnabled
            showsVerticalScrollIndicator={false}
            onScroll={e => {
              setContentOffset(e.nativeEvent.contentOffset)
            }}
            onContentSizeChange={(_, height) => {
              setContentSize(height)
            }}
            onLayout={e => {
              setScrollViewHeight(e.nativeEvent.layout.height);
            }}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.containerOption}
                onPress={() => onPicked(item)}>
                <Text style={styles.textOption}>{item}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={item => item}
          />
          {showScrollIndicator && (
            <View style={styles.containerScrollIndicator}>
              <View
                style={{
                  position: 'absolute' as any,
                  right: -2,
                  zIndex: 100,
                  top: `${Number(scrollPercente || 0).toFixed(0)}%` as any,
                  height: `${scrollElementHeightPercent}%` as any,
                  backgroundColor: '#4D1469',
                  width: 8,
                  borderRadius: 20,
                } as any}
              />
            </View>
          )}
        </View>
      )}
    </View>
  )
}

Picker.defaultProps = defaultProps;

export default Picker
