import React, {Component} from 'react';
import {
  StyleSheet,
  Dimensions,
  FlatList,
  ScrollView,
  View,
  TouchableHighlight,
  Platform,
  Text,
  TextInput,
} from 'react-native';
import Modal from 'react-native-modal';
import Colors from '../theme/Colors';
import CountryCodes from '../utils/CountryCodes';

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  modal: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textTitle: {
    textAlign: 'center',
    fontSize: 18,
  },
  line: {
    width: '100%',
    height: 1,
    backgroundColor: 'lightgray',
  },
  container: {
    width: width - 50,
    height: height / 1.5,
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 5,
    borderRadius: 15,
    justifyContent: 'center',
  },
  textFlag: {
    fontSize: 24,
    marginRight: 10,
    color: 'black',
  },
  textName: {
    fontSize: 16,
    flex: 1,
    color: 'black',
  },
  textCode: {
    fontSize: 16,
    flex: 0.3,
    color: 'black',
  },
  input: {
    padding: 0,
    fontSize: 13,
    margin: 0,
    elevation: 0,
  },
  searchbar: {
    borderRadius: 12,
    backgroundColor: '#E5E5E5',
    height: 40,
    elevation: 2,
    marginBottom: 5,
    marginTop: 10,
    paddingHorizontal: 15,
    marginHorizontal: 10,
  },
  list: {
    paddingBottom: 40,
    marginTop: 10,
  },
  textEmpty: {
    marginTop: 20,
  },
  containerItem: {
    flexDirection: 'row',
    //justifyContent: 'center',
    alignItems: 'center',
    // paddingVertical: 5,
    marginHorizontal: 10,
  },
});

class CountrySelectModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      query: '',
      listData: CountryCodes,
    };
    this.listData = CountryCodes;
  }

  onPress = item => {
    this.props.onSelected(item);
    this.props.hideModal();
  };

  onChangeText = text => {
    this.setState({query: text});
    if (text.length > 0) {
      const filteredList = this.listData.filter(
        i =>
          i.name.toLowerCase().includes(text.toLowerCase()) ||
          i.dialingCode.includes(text.toLowerCase())
      );
      // console.log(filteredList);
      this.setState({listData: filteredList});
    } else {
      this.setState({listData: this.listData});
    }
  };

  render() {
    return (
      <Modal
        style={styles.modal}
        isVisible={this.props.isVisible}
        onBackdropPress={this.props.hideModal}
        avoidKeyboard={Platform.OS === 'ios'}
        animationIn="fadeIn"
        animationOut="fadeOut"
        onBackButtonPress={this.props.hideModal}>
        <View style={styles.container}>
          <Text style={styles.textTitle}>{this.props.title}</Text>
          <TextInput
            placeholder="Search"
            style={styles.searchbar}
            onChangeText={query => this.onChangeText(query)}
            value={this.state.query}
          />
          <ScrollView
            overScrollMode="never"
            bounces={false}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            <FlatList
              data={this.state.listData}
              contentContainerStyle={styles.list}
              extraData={this.state}
              overScrollMode="never"
              bounces={false}
              ListEmptyComponent={() => (
                <Text style={styles.textEmpty}>No results found.</Text>
              )}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={() => <View style={styles.line} />}
              renderItem={({item}) => (
                <TouchableHighlight
                  key={item.dialingCode}
                  underlayColor={Colors.gradientBg1}
                  onPress={() => this.onPress(item)}>
                  <View style={styles.containerItem}>
                    <Text style={styles.textFlag}>{item.emoji}</Text>
                    <Text numberOfLines={1} style={styles.textName}>
                      {item.name}
                    </Text>
                    <Text
                      style={styles.textCode}>{`+ ${item.dialingCode}`}</Text>
                  </View>
                </TouchableHighlight>
              )}
              keyExtractor={item => item.categoryId}
            />
          </ScrollView>
        </View>
      </Modal>
    );
  }
}

export default CountrySelectModal;
