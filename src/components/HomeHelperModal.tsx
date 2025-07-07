import React, {useState, useMemo} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Image,
  StyleProp,
  ViewStyle,
  Dimensions,
} from 'react-native';
import Modal from 'react-native-modal';
import Fonts from '../theme/Fonts';
import Dialog from '../assets/svg/Dialog';

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  modal: {},
  container: {
    flex: 1,
  },
  containerDialog: {
    backgroundColor: '#D9D9D9',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 50,
    alignItems: 'center',
  },
  dialogKlatchup: {
    width: '70%',
    alignSelf: 'center',
    top: height / 5,
  },
  dialogRequests: {
    alignSelf: 'flex-start',
    width: '45%',
    bottom: -height / 1.45,
    left: 0,
  },
  dialogChat: {
    alignSelf: 'flex-end',
    width: '45%',
    bottom: -height / 1.45,
    right: 0,
  },
  textDialog: {
    fontSize: 13,
    fontFamily: Fonts.PromptRegular,
    textAlign: 'center',
    color: '#4D1469',
  },
  icDialog: {
    width: 20,
    height: 20,
    bottom: -16,
    position: 'absolute',
  },
  icDialog1: {
    width: 20,
    height: 20,
    bottom: -15,
    position: 'absolute',
    transform: [{rotate: '120deg'}],
  },
  leftArrow: {
    position: 'absolute',
    backgroundColor: '#dedede',
    //backgroundColor:"red",
    width: 20,
    height: 25,
    bottom: 0,
    borderBottomRightRadius: 25,
    left: -10,
  },
});

const enum DialogType {
  klatchup = 1,
  requests = 2,
  chat = 3,
}

type DialogTail = 'left' | 'right'

const DialogView = ({
  text,
  style,
  dialogTail = 'left',
}: {
  text: string
  style: StyleProp<ViewStyle>
  dialogTail: DialogTail
}) => (
  <View style={[styles.containerDialog, style]}>
    <Text style={styles.textDialog}>{text}</Text>
    <Dialog
      style={dialogTail === 'left' ? styles.icDialog1 : styles.icDialog}
    />
  </View>
)

interface Props {
  isVisible: boolean
  hide: () => void
}

const defaultProps: Props = {
  isVisible: false,
  hide: () => {},
}

const HomeHelperModal = ({isVisible, hide}: Props) => {
  const [currentDialog, setCurrentDialog] = useState<DialogType>(
    DialogType.klatchup
  )

  const dialogText = useMemo(() => {
    switch (currentDialog) {
      case DialogType.klatchup:
        return 'Tap this Button to search for the place or area you’re at';
      case DialogType.chat:
        return 'The people you’ve Klatched with will appear here';
      case DialogType.requests:
        return 'Your KlatchUp requests will appear here';
      default:
        return '';
    }
  }, [currentDialog]);

  const dialogStyle = useMemo(() => {
    switch (currentDialog) {
      case DialogType.klatchup:
        return styles.dialogKlatchup;
      case DialogType.chat:
        return styles.dialogChat;
      case DialogType.requests:
        return styles.dialogRequests;
      default:
        return '';
    }
  }, [currentDialog]);

  const onPress = () => {
    if (currentDialog === DialogType.klatchup) {
      setCurrentDialog(DialogType.requests);
    } else if (currentDialog === DialogType.requests) {
      setCurrentDialog(DialogType.chat);
    } else {
      hide();
    }
  }

  return (
    <Modal
      style={styles.modal}
      isVisible={isVisible}
      animationIn="fadeIn"
      animationOut="fadeOut"
      animationInTiming={100}
      onBackdropPress={() => {}}
      onBackButtonPress={() => {}}>
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.container}
        onPress={onPress}>
        <SafeAreaView>
          <DialogView
            text={dialogText}
            dialogTail={
              currentDialog === DialogType.requests ? 'right' : 'left'
            }
            style={dialogStyle}
          />
        </SafeAreaView>
      </TouchableOpacity>
    </Modal>
  );
};

HomeHelperModal.defaultProps = defaultProps

export default HomeHelperModal;
