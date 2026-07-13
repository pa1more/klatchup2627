import React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import { DesignSystem } from '../theme/DesignSystem';

const REPORT_OPTIONS = [
  'Abusive/explicit language',
  'Nudity',
  'Racial slur',
  'Hate speech or symbols',
  'Something else',
];

interface Props {
  visible: boolean;
  onClose: () => void;
  userName?: string;
}

const ReportModal = ({ visible, onClose, userName }: Props) => {
  const handleReport = (reason: string) => {
    onClose();
    Alert.alert(
      'Report Submitted',
      `Thank you for reporting. We will review this profile for "${reason}".`,
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.container}>
          <Text style={styles.title}>Report</Text>
          <View style={styles.divider} />
          {REPORT_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option}
              style={styles.option}
              onPress={() => handleReport(option)}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    backgroundColor: '#300943',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
  },
  title: {
    color: DesignSystem.colors.white,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    paddingVertical: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#4D1469',
    marginBottom: 8,
  },
  option: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  optionText: {
    color: DesignSystem.colors.white,
    fontSize: 16,
    fontWeight: '400',
  },
});

export default ReportModal;
