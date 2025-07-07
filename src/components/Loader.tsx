// components/Loader.tsx
import React from 'react';
import {
    View,
    ActivityIndicator,
    StyleSheet,
    Modal,
    Text,
} from 'react-native';

type LoaderProps = {
    visible: boolean;
    message?: string;
    spinnerColor?: string;
};

const Loader: React.FC<LoaderProps> = ({
    visible,
    message = 'Loading...',
    spinnerColor = '#ffffff',
}) => {
    return (
        <Modal transparent animationType="fade" visible={visible}>
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <ActivityIndicator size="large" color={spinnerColor} />
                    <Text style={styles.message}>{message}</Text>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        backgroundColor: '#000',
        padding: 20,
        borderRadius: 12,
        alignItems: 'center',
    },
    message: {
        marginTop: 10,
        color: '#fff',
        fontSize: 16,
    },
});

export default Loader;
