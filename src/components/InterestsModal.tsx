import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
} from 'react-native';
import Modal from 'react-native-modal';

interface InterestsModalProps {
    selectedInterests: string[];
    onClose: () => void;
    onSave: (updated: string[]) => void;
    visible: boolean;
}

const interestsArray = [
    'Music',
    'Food',
    'Science & Technology',
    'Pets',
    'Entrepreneurship',
    'Business',
    'Partying',
    'Alcoholic Beverages',
];

const InterestsModal: React.FC<InterestsModalProps> = ({
    selectedInterests,
    onClose,
    onSave,
    visible,
}) => {
    const [localSelected, setLocalSelected] = useState<string[]>([]);

    useEffect(() => {
        console.log(selectedInterests)
        if (visible) {
            let parsed: any[] = [];
            if (typeof selectedInterests === 'string') {
                try {
                    parsed = JSON.parse(selectedInterests);
                } catch (error) {
                    console.warn('Invalid JSON in selectedInterests:', error);
                    parsed = [];
                }
            } else if (Array.isArray(selectedInterests)) {
                parsed = selectedInterests;
            }
            const namesOnly = parsed.map(item => item?.name).filter(Boolean);
            setLocalSelected(namesOnly);
        }
    }, [visible, selectedInterests]);

    const onInterestPicked = (interest: string) => {
        setLocalSelected(prev =>
            prev.includes(interest)
                ? prev.filter(i => i !== interest)
                : [...prev, interest]
        );
    };

    return (
        <Modal isVisible={visible} onBackdropPress={onClose}>
            <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Select Interests</Text>
                <ScrollView style={{ maxHeight: 300 }}>
                    <View style={styles.chipsContainer}>
                        {interestsArray.map(interest => (
                            <TouchableOpacity
                                key={interest}
                                onPress={() => onInterestPicked(interest)}
                                style={[
                                    styles.chip,
                                    localSelected.includes(interest)
                                        ? styles.chipSelected
                                        : styles.chipUnselected,
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.chipText,
                                        localSelected.includes(interest)
                                            ? styles.chipTextSelected
                                            : styles.chipTextUnselected,
                                    ]}
                                >
                                    {interest}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>
                <View style={styles.buttonRow}>
                    <TouchableOpacity onPress={onClose}>
                        <Text style={styles.cancel}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onSave(localSelected)}>
                        <Text style={styles.save}>Save</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default InterestsModal;

const styles = StyleSheet.create({
    modalContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    chipsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        justifyContent: 'flex-start',
    },
    chip: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        margin: 5,
    },
    chipSelected: {
        backgroundColor: 'orange',
    },
    chipUnselected: {
        backgroundColor: '#e0e0e0',
    },
    chipText: {
        fontSize: 14,
    },
    chipTextSelected: {
        color: 'white',
    },
    chipTextUnselected: {
        color: '#333',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    cancel: {
        color: 'red',
        fontSize: 16,
    },
    save: {
        color: 'green',
        fontSize: 16,
    },
});
