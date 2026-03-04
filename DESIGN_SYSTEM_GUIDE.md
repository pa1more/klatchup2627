/**
 * IMPLEMENTATION GUIDE: Using Design System with Figma Components
 * Reference: klatchup-figma-components/Klatch Up Application/
 * 
 * This guide shows how to apply the design system to match your Figma designs
 */

// ============ EXAMPLE 1: Request List Item (From: Klatch-up_list.png) ============

import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import { DesignSystem } from '../../theme/DesignSystem';

const styles = StyleSheet.create({
  // From: RequestsListItem component
  container: {
    ...DesignSystem.components.requestListItem.container,
  },
  containerBtns: {
    ...DesignSystem.components.requestListItem.containerBtns,
  },
  ignoreButton: {
    ...DesignSystem.components.requestListItem.ignoreButton,
  },
  acceptButton: {
    ...DesignSystem.components.requestListItem.acceptButton,
  },
  buttonText: {
    ...DesignSystem.typography.styles.button,
    color: DesignSystem.colors.white,
  },
});

// ============ EXAMPLE 2: User List Item (From: profile_list_View_empty_screen.jpg) ============

const userListStyles = StyleSheet.create({
  container: {
    ...DesignSystem.components.userListItem.container,
  },
  profileImage: {
    ...DesignSystem.components.userListItem.imgDp,
  },
  klatchupButton: {
    ...DesignSystem.components.userListItem.button,
  },
  buttonText: {
    ...DesignSystem.typography.styles.button,
    color: DesignSystem.colors.white,
    fontWeight: '600',
  },
});

// ============ EXAMPLE 3: Chat Message (From: Chat.png) ============

const chatStyles = StyleSheet.create({
  ownMessage: {
    ...DesignSystem.components.chatMessage.own,
  },
  otherMessage: {
    ...DesignSystem.components.chatMessage.other,
  },
  messageText: {
    ...DesignSystem.typography.styles.bodySmall,
    color: DesignSystem.colors.white,
  },
});

// ============ EXAMPLE 4: Interest Chips (From: Interest_screen.jpg) ============

const interestStyles = StyleSheet.create({
  chip: {
    ...DesignSystem.components.interestChip.container,
  },
  chipSelected: {
    ...DesignSystem.components.interestChip.selected,
  },
  chipUnselected: {
    ...DesignSystem.components.interestChip.unselected,
  },
  chipText: {
    ...DesignSystem.typography.styles.bodySmall,
    color: DesignSystem.colors.white,
  },
});

// ============ EXAMPLE 5: Input Fields (From: Profile_3_1.jpg) ============

const inputStyles = StyleSheet.create({
  inputContainer: {
    ...DesignSystem.inputs.container,
  },
  inputText: {
    ...DesignSystem.inputs.text,
  },
  inputPlaceholder: {
    ...DesignSystem.inputs.placeholder,
  },
});

// ============ COMMON PATTERNS ============

/**
 * PATTERN 1: Button States
 * Reference: All button states shown in Figma
 */
export const buttonStates = {
  primary: {
    backgroundColor: DesignSystem.colors.success,
    paddingVertical: DesignSystem.spacing.md,
    paddingHorizontal: DesignSystem.spacing.lg,
    borderRadius: DesignSystem.borderRadius.xl,
  },
  secondary: {
    backgroundColor: DesignSystem.colors.gray[600],
    paddingVertical: DesignSystem.spacing.md,
    paddingHorizontal: DesignSystem.spacing.lg,
    borderRadius: DesignSystem.borderRadius.xl,
  },
  danger: {
    backgroundColor: DesignSystem.colors.danger,
    paddingVertical: DesignSystem.spacing.md,
    paddingHorizontal: DesignSystem.spacing.lg,
    borderRadius: DesignSystem.borderRadius.xl,
  },
  disabled: {
    ...DesignSystem.buttons.disabled,
  },
};

/**
 * PATTERN 2: Card Layouts
 * Reference: All card styles from Figma
 */
export const cardVariants = {
  default: DesignSystem.components.requestListItem.container,
  user: DesignSystem.components.userListItem.container,
  flatList: {
    marginVertical: DesignSystem.spacing.xs,
    marginHorizontal: DesignSystem.spacing.lg,
  },
};

/**
 * PATTERN 3: Spacing Hierarchy
 * Reference: Consistent spacing from Figma
 */
export const spacingPatterns = {
  screenPadding: DesignSystem.spacing.lg,              // 16px
  itemGap: DesignSystem.spacing.xs,                    // 4px
  listItemGap: DesignSystem.spacing.md,                // 12px
  sectionGap: DesignSystem.spacing.lg,                 // 16px
  largeGap: DesignSystem.spacing.xl,                   // 20px
};

/**
 * PATTERN 4: Color Palette Quick Reference
 * Reference: Figma color system
 */
export const colorPatterns = {
  backgrounds: {
    screen: DesignSystem.colors.primary,              // #300943
    card: DesignSystem.colors.gray[900],              // #1a0a2e
    section: DesignSystem.colors.primary,
  },
  text: {
    primary: DesignSystem.colors.white,
    secondary: DesignSystem.colors.gray[600],
    disabled: DesignSystem.colors.gray[500],
  },
  actions: {
    success: DesignSystem.colors.success,             // #00D084 - Klatchup/Accept
    danger: DesignSystem.colors.danger,               // #FF6B6B - Ignore
    neutral: DesignSystem.colors.gray[600],
  },
};

/**
 * PATTERN 5: Typography Usage
 * Reference: Font styles from Figma Klatchup project
 */
export const typographyPatterns = {
  screenTitle: {
    ...DesignSystem.typography.styles.heading2,
    color: DesignSystem.colors.white,
  },
  cardTitle: {
    ...DesignSystem.typography.styles.heading4,
    color: DesignSystem.colors.white,
  },
  cardBody: {
    ...DesignSystem.typography.styles.body,
    color: DesignSystem.colors.white,
  },
  buttonLabel: {
    ...DesignSystem.typography.styles.button,
    color: DesignSystem.colors.white,
  },
  caption: {
    ...DesignSystem.typography.styles.caption,
    color: DesignSystem.colors.gray[600],
  },
};

// ============ HOW TO USE IN COMPONENTS ============

/**
 * MINIMAL EXAMPLE: Refactored RequestsListItem
 * 
 * Before: Manual color values scattered in code
 * After: Centralized design system
 */

/*
import { DesignSystem } from '../../theme/DesignSystem';

const RequestsListItem = () => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.ignoreButton,
          { backgroundColor: DesignSystem.colors.danger }
        ]}
      >
        <Text style={[
          styles.buttonText,
          DesignSystem.typography.styles.button
        ]}>
          👋 Ignore
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[
          styles.acceptButton,
          { backgroundColor: DesignSystem.colors.success }
        ]}
      >
        <Text style={[
          styles.buttonText,
          DesignSystem.typography.styles.button
        ]}>
          ✓ Klatchup
        </Text>
      </TouchableOpacity>
    </View>
  );
};
*/

/**
 * SCREEN-LEVEL EXAMPLE: Using Design System Consistently
 */

/*
const MyScreen = () => {
  return (
    <View style={{ backgroundColor: DesignSystem.colors.primary }}>
      <Text style={typographyPatterns.screenTitle}>My Screen</Text>
      
      <TouchableOpacity style={buttonStates.primary}>
        <Text style={typographyPatterns.buttonLabel}>Action</Text>
      </TouchableOpacity>
    </View>
  );
};
*/

// ============ MIGRATION CHECKLIST ============

/**
 * To align your existing code with Figma + Design System:
 * 
 * ✓ Check all color values → Replace with DesignSystem.colors.{colorName}
 * ✓ Check all border radius → Use DesignSystem.borderRadius values
 * ✓ Check all padding/margin → Use DesignSystem.spacing values
 * ✓ Check all fonts → Use DesignSystem.typography.styles
 * ✓ Check button styles → Use DesignSystem.buttons.{type}
 * ✓ Check card layouts → Use DesignSystem.cards.{type}
 * 
 * Files to update:
 * - src/views/klatchupRequests/RequestsListItem.tsx
 * - src/views/societyUsers/UsersListItem.tsx
 * - src/views/chat/ChatMessages.tsx
 * - src/views/profile/* (all profile related)
 * - src/components/* (reusable components)
 * - src/views/* (all screens)
 */

// ============ DESIGN SYSTEM ADVANTAGES ============

/**
 * Benefits of using centralized Design System:
 * 
 * 1. ✅ Single Source of Truth
 *    - All colors, spacing, typography in one place
 *    - Easy to update globally
 *    - Matches Figma design 100%
 * 
 * 2. ✅ Consistency
 *    - All screens use same colors/spacing
 *    - No "magic numbers" hardcoded
 *    - Easy to maintain visual consistency
 * 
 * 3. ✅ Figma Alignment
 *    - Extract tokens directly from Figma
 *    - Update design system when Figma changes
 *    - Designer and developer stay in sync
 * 
 * 4. ✅ Scalability
 *    - Easy to add new variants
 *    - Easy to create themes (dark/light)
 *    - Reduce code duplication
 * 
 * 5. ✅ Debugging
 *    - Easier to find where colors are used
 *    - Trace design issues quickly
 *    - Consistent spacing helps with layouts
 */

export default {
  buttonStates,
  cardVariants,
  spacingPatterns,
  colorPatterns,
  typographyPatterns,
};
