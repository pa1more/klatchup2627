import { ScrollView, StyleSheet, Text } from 'react-native'
import React from 'react'
import ScreenWrapper from '../../components/ScreenWrapper'
import Toolbar from '../../components/Toolbar'
import { DesignSystem } from '../../theme/DesignSystem'

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  textSubheading: {
    color: DesignSystem.colors.white,
    fontSize: 15,
    fontWeight: '400',
    textAlign: 'justify',
    marginBottom: 10,
  },
  textContent: {
    color: DesignSystem.colors.white,
    fontSize: 13,
    fontWeight: '400',
    textAlign: 'justify',
  },
})

const Terms = () => {
  return (
    <ScreenWrapper>
      <Toolbar title="Terms of Use" />
      <ScrollView contentContainerStyle={styles.container}>
        <Text
          style={
            styles.textSubheading
          }>{`Last updated ${new Date().toLocaleDateString()}`}</Text>
        <Text style={styles.textContent}>
          KlatchUp Terms of Use


          Terms of Use

          Effective Date:

          1. Acceptance of Terms

          By accessing or using KlatchUp (“the App”), you agree to be bound by these Terms of Use and our Privacy Policy. If you do not agree, please do not use the App.

          2. Eligibility

          You must be at least 18 years old to use the App. By using the App, you represent and warrant that you meet this age requirement.

          3. Account Registration

          You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account. You agree to provide accurate and complete information during registration and to update such information to keep it accurate and complete.

          4. User Conduct

          You agree not to:

          -Use the App for any unlawful purpose.
          -Harass, abuse, or harm another person.
          -Post or transmit any content that is defamatory, obscene, or otherwise objectionable.
          -Use the App to distribute unsolicited promotional or commercial content.


          5. Content

          You are solely responsible for the content you post on the App. By posting content, you grant KlatchUp a non-exclusive, transferable, sub-licensable, royalty-free, worldwide license to use, display, and distribute such content on and through the App.

          6. Live Location Sharing

          The App may collect and share your live location data to provide location-based services. You can manage your location preferences in your device settings. Please refer to our Privacy Policy for more details.

          7. In-Person Meetings

          If you choose to meet another user in person, you do so at your own risk. KlatchUp is not responsible for any actions or events that occur during such meetings. We recommend informing a friend or family member of your plans.

          8. Chat Functionality

          The App provides chat functionality for users to communicate. You agree to use this feature responsibly and not to send any offensive, threatening, or inappropriate messages. KlatchUp reserves the right to monitor and review chats for compliance with these Terms.

          9. Termination

          KlatchUp reserves the right to suspend or terminate your account at any time for any reason, including violation of these Terms.

          10. Disclaimers

          KlatchUp is provided on an “as is” and “as available” basis. We disclaim all warranties, express or implied, including the implied warranties of merchantability and fitness for a particular purpose.

          11. Limitation of Liability

          To the maximum extent permitted by law, KlatchUp shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the App.

          12. Governing Law

          These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law principles.
        </Text>
      </ScrollView>
    </ScreenWrapper>
  )
}

export default Terms
