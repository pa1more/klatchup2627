/**
 * Design System - Extracted from Figma "Klatch Up Application" Project
 * Reference: klatchup-figma-components/Klatch Up Application/
 * 
 * This file serves as the single source of truth for all UI components
 * matching your Figma design system
 */

export const DesignSystem = {
  // ============= COLORS =============
  colors: {
    // Primary colors
    primary: '#300943',        // Dark purple - main background
    primaryLight: '#6B4C8A',   // Lighter purple for secondary elements
    
    // Status colors
    success: '#00D084',        // Green - Klatchup action, accept buttons
    danger: '#FF6B6B',         // Red - Ignore action, warnings
    warning: '#FFB84D',        // Orange - Warnings (if needed)
    info: '#4A90E2',           // Blue - Information (if needed)
    
    // Neutral colors
    white: '#FFFFFF',
    black: '#000000',
    gray: {
      900: '#1a0a2e',          // Very dark - backgrounds
      800: '#2D1B4E',
      700: '#3D2566',
      600: '#555555',          // Medium gray - secondary text
      500: '#999999',
      400: '#CCCCCC',
      300: '#E0E0E0',
      200: '#F0F0F0',
      100: '#F5F5F5',          // Very light - card backgrounds
    },
    
    // semantic colors
    background: '#1a0a2e',
    surface: '#300943',
    surfaceVariant: '#6B4C8A',
    text: '#FFFFFF',
    textSecondary: '#CCCCCC',
    border: '#555555',
    error: '#FF6B6B',
    errorLight: '#FFE5E5',
  },

  // ============= TYPOGRAPHY =============
  typography: {
    fontFamily: {
      primary: 'PromptRegular',
      bold: 'PromptBold',
      semibold: 'PromptSemiBold',
    },
    sizes: {
      xs: 10,
      sm: 12,
      base: 14,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
      xxxl: 32,
    },
    weights: {
      regular: '400' as any,
      medium: '500' as any,
      semibold: '600' as any,
      bold: '700' as any,
    },
    // Predefined text styles
    styles: {
      heading1: {
        fontSize: 32,
        fontWeight: '700' as any,
        fontFamily: 'PromptBold',
        lineHeight: 40,
      },
      heading2: {
        fontSize: 24,
        fontWeight: '700' as any,
        fontFamily: 'PromptBold',
        lineHeight: 32,
      },
      heading3: {
        fontSize: 20,
        fontWeight: '700' as any,
        fontFamily: 'PromptBold',
        lineHeight: 28,
      },
      heading4: {
        fontSize: 18,
        fontWeight: '600' as any,
        fontFamily: 'PromptSemiBold',
        lineHeight: 24,
      },
      body: {
        fontSize: 14,
        fontWeight: '400' as any,
        fontFamily: 'PromptRegular',
        lineHeight: 20,
      },
      bodySmall: {
        fontSize: 12,
        fontWeight: '400' as any,
        fontFamily: 'PromptRegular',
        lineHeight: 16,
      },
      bodyBold: {
        fontSize: 14,
        fontWeight: '600' as any,
        fontFamily: 'PromptSemiBold',
        lineHeight: 20,
      },
      caption: {
        fontSize: 10,
        fontWeight: '400' as any,
        fontFamily: 'PromptRegular',
        lineHeight: 14,
      },
      button: {
        fontSize: 13,
        fontWeight: '600' as any,
        fontFamily: 'PromptSemiBold',
        lineHeight: 18,
      },
    },
  },

  // ============= SPACING =============
  spacing: {
    // Padding and margins
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    
    // Platform specific
    horizontalPadding: 16,
    verticalPadding: 12,
  },

  // ============= BORDER RADIUS =============
  borderRadius: {
    none: 0,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,      // Most common in your design
    xxl: 24,
    full: 999,   // For circular components
  },

  // ============= BUTTONS =============
  buttons: {
    primary: {
      backgroundColor: '#00D084',    // Green - Klatchup button
      color: '#FFFFFF',
      borderRadius: 20,
      paddingVertical: 12,
      paddingHorizontal: 16,
      fontWeight: 600,
      fontSize: 13,
    },
    secondary: {
      backgroundColor: '#555555',    // Gray
      color: '#FFFFFF',
      borderRadius: 20,
      paddingVertical: 12,
      paddingHorizontal: 16,
      fontWeight: 600,
      fontSize: 13,
    },
    danger: {
      backgroundColor: '#FF6B6B',    // Red - Ignore button
      color: '#FFFFFF',
      borderRadius: 20,
      paddingVertical: 12,
      paddingHorizontal: 16,
      fontWeight: 600,
      fontSize: 13,
    },
    ghost: {
      backgroundColor: 'transparent',
      color: '#00D084',
      borderRadius: 20,
      borderWidth: 1,
      borderColor: '#00D084',
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
    disabled: {
      backgroundColor: '#999999',
      color: '#CCCCCC',
      borderRadius: 20,
      paddingVertical: 12,
      paddingHorizontal: 16,
      opacity: 0.5,
    },
  },

  // ============= CARDS =============
  cards: {
    container: {
      borderRadius: 20,
      padding: 16,
      backgroundColor: '#300943',
      marginVertical: 8,
      borderWidth: 1,
      borderColor: '#6B4C8A',
    },
    userCard: {
      borderRadius: 20,
      backgroundColor: '#300943',
      borderWidth: 1,
      borderColor: '#6B4C8A',
      marginVertical: 5,
      padding: 10,
    },
    requestCard: {
      borderRadius: 20,
      backgroundColor: '#300943',
      borderWidth: 1,
      borderColor: '#6B4C8A',
      marginVertical: 8,
      padding: 12,
    },
    chatBubble: {
      borderRadius: 16,
      paddingVertical: 8,
      paddingHorizontal: 12,
      maxWidth: '80%',
    },
  },

  // ============= SHADOWS =============
  shadows: {
    none: {
      shadowColor: 'transparent',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    },
    sm: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 8,
    },
  },

  // ============= COMPONENTS - SPECIFIC STYLES =============
  components: {
    // From: Klatch-up_list.png - Request cards
    requestListItem: {
      container: {
        backgroundColor: '#1a0a2e',
        borderRadius: 20,
        padding: 16,
        marginVertical: 8,
      },
      ignoreButton: {
        backgroundColor: '#FF6B6B',
        borderBottomLeftRadius: 20,
        paddingVertical: 12,
        flex: 1,
      },
      acceptButton: {
        backgroundColor: '#00D084',
        borderBottomRightRadius: 20,
        paddingVertical: 12,
        flex: 1,
      },
      containerBtns: {
        backgroundColor: '#1a0a2e',
        flexDirection: 'row',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        overflow: 'hidden',
      },
    },

    // From: profile_list_View_empty_screen.jpg - User cards
    userListItem: {
      container: {
        borderRadius: 20,
        marginVertical: 5,
        backgroundColor: '#300943',
      },
      imgDp: {
        height: 80,
        width: 80,
        borderRadius: 20,
      },
      button: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 10,
        backgroundColor: '#00D084',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
      },
    },

    // From: Chat.png - Chat messages
    chatMessage: {
      own: {
        backgroundColor: '#00D084',
        borderRadius: 16,
        paddingVertical: 8,
        paddingHorizontal: 12,
        marginVertical: 4,
        maxWidth: '80%',
        alignSelf: 'flex-end',
      },
      other: {
        backgroundColor: '#555555',
        borderRadius: 16,
        paddingVertical: 8,
        paddingHorizontal: 12,
        marginVertical: 4,
        maxWidth: '80%',
        alignSelf: 'flex-start',
      },
    },

    // From: Interest_screen.jpg - Interest chips
    interestChip: {
      container: {
        borderWidth: 1,
        borderColor: '#FFFFFF',
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginHorizontal: 4,
        marginVertical: 4,
      },
      selected: {
        backgroundColor: '#00D084',
        borderColor: '#00D084',
      },
      unselected: {
        backgroundColor: 'transparent',
        borderColor: '#FFFFFF',
      },
    },
  },

  // ============= INPUT FIELDS =============
  inputs: {
    container: {
      backgroundColor: '#1a0a2e',
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      marginVertical: 8,
      borderWidth: 1,
      borderColor: '#555555',
    },
    text: {
      color: '#FFFFFF',
      fontSize: 14,
      fontFamily: 'PromptRegular',
    },
    placeholder: {
      color: '#999999',
      fontSize: 14,
    },
  },

  // ============= SCROLLVIEW / LISTS =============
  lists: {
    spacing: {
      itemMargin: 8,
      containerPadding: 16,
    },
  },
};

// Export individual color system for easier access
export const Colors = DesignSystem.colors;
export const Typography = DesignSystem.typography;
export const Spacing = DesignSystem.spacing;
export const BorderRadius = DesignSystem.borderRadius;
