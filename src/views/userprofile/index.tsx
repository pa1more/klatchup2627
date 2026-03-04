import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ScreenWrapper from '../../components/ScreenWrapper'
import Toolbar from '../../components/Toolbar'
import ToolbarIcon from '../../components/ToolbarIcon'
import ImagesCarousel from '../../components/ImagesCarousel'
import { DesignSystem } from '../../theme/DesignSystem'
import InterestExpandableItem from '../../components/InterestExpandableItem'

const styles = StyleSheet.create({
  containerMain: {
    paddingHorizontal: 15,
  },
  textBio: {
    color: DesignSystem.colors.white,
    fontSize: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: DesignSystem.colors.white,
    padding: 10,
    fontWeight: '400',
  },
  textSectionTitle: {
    color: DesignSystem.colors.white,
    fontWeight: '500',
    fontSize: 22,
    marginVertical: 10,
  },
  containerBtn: {
    backgroundColor: '#170224',
    height: '8%',
  },
})

const UserProfile = ({ route }: any) => {

  let item = route.params;
  
  let parsedInterests: any[] = [];
  try {
    // Handle interests - could be string or array
    const interests = item.item?.interests;
    if (typeof interests === 'string') {
      parsedInterests = JSON.parse(interests);
    } else if (Array.isArray(interests)) {
      parsedInterests = interests;
    }
  } catch (error) {
    console.warn('Failed to parse interests:', error);
    parsedInterests = [];
  }

  return (
    <ScreenWrapper>
      <Toolbar
        title=""
        rightComponent={
          <ToolbarIcon
            icon={require('../../assets/icons/ic_report.png')}
            onPress={() => { }}
          />
        }
      />
      <View style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <ImagesCarousel
            images={
              (() => {
                try {
                  if (!item?.item?.showPictures) return [];
                  const pictures = item.item.showPictures;
                  const parsed = typeof pictures === 'string' ? JSON.parse(pictures) : pictures;
                  return Array.isArray(parsed)
                    ? parsed
                        .sort((a: { priority: number }, b: { priority: number }) => a.priority - b.priority)
                        .map((img: any) => img.path)
                    : [];
                } catch (error) {
                  console.warn('Invalid showPictures:', error);
                  return [];
                }
              })()
            }
          />
          <View style={styles.containerMain}>

            <Text style={styles.textBio}>
              {item?.item?.bio || 'No bio'}
            </Text>

            <Text style={styles.textSectionTitle}>Interests</Text>
           
            {parsedInterests.length > 0 ? parsedInterests.map((interest: { name: string | undefined; subInterest: string | undefined }, index: React.Key | null | undefined) => (
              <InterestExpandableItem
                key={index}
                title={interest.name}
                description={interest.subInterest}
              />
            )) : <Text style={styles.textBio}>No interests added</Text>}

            <Text style={styles.textSectionTitle}>Education</Text>
            <Text style={styles.textBio}> {item?.item?.education || 'Not specified'}</Text>

            <Text style={styles.textSectionTitle}>Work</Text>
            <Text style={styles.textBio}> {item?.item?.work || 'Not specified'}</Text>
          </View>
          <View style={{ paddingBottom: 200 }} />
        </ScrollView>
        <View style={styles.containerBtn} />
      </View>
    </ScreenWrapper>
  )
}

export default UserProfile
