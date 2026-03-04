import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { DesignSystem } from '../theme/DesignSystem';

interface EmptyStateProps {
  icon?: string;           // emoji or image path
  title: string;
  subtitle?: string;
  buttonText?: string;
  onButtonPress?: () => void;
  customContent?: React.ReactNode;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: DesignSystem.colors.primary,
    paddingHorizontal: DesignSystem.spacing.lg,
    paddingVertical: DesignSystem.spacing.xxl,
  },
  iconContainer: {
    fontSize: 60,
    marginBottom: DesignSystem.spacing.xl,
    textAlign: 'center',
  },
  title: {
    ...DesignSystem.typography.styles.heading3,
    color: DesignSystem.colors.white,
    textAlign: 'center',
    marginBottom: DesignSystem.spacing.md,
  },
  subtitle: {
    ...DesignSystem.typography.styles.body,
    color: DesignSystem.colors.gray[600],
    textAlign: 'center',
    marginBottom: DesignSystem.spacing.lg,
  },
  button: {
    ...DesignSystem.buttons.primary,
    marginTop: DesignSystem.spacing.xl,
  },
  buttonText: {
    ...(DesignSystem.typography.styles.button as any),
    color: DesignSystem.colors.white,
  },
});

const EmptyState: React.FC<EmptyStateProps> = ({
  icon = '🔍',
  title,
  subtitle,
  buttonText,
  onButtonPress,
  customContent,
}) => {
  return (
    <View style={styles.container}>
      {customContent ? (
        customContent
      ) : (
        <>
          <Text style={styles.iconContainer}>{icon}</Text>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          {buttonText && onButtonPress && (
            <TouchableOpacity style={styles.button} onPress={onButtonPress}>
              <Text style={styles.buttonText}>{buttonText}</Text>
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );
};

export default EmptyState;
