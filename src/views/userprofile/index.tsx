import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ScreenWrapper from '../../components/ScreenWrapper'
import Toolbar from '../../components/Toolbar'
import ToolbarIcon from '../../components/ToolbarIcon'
import ImagesCarousel from '../../components/ImagesCarousel'
import Colors from '../../theme/Colors'
import Fonts from '../../theme/Fonts'
import InterestExpandableItem from '../../components/InterestExpandableItem'

const styles = StyleSheet.create({
  containerMain: {
    paddingHorizontal: 15,
  },
  textBio: {
    color: Colors.white,
    fontSize: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.white,
    padding: 10,
    fontFamily: Fonts.PromptRegular,
  },
  textSectionTitle: {
    color: Colors.white,
    fontFamily: Fonts.PromptMedium,
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
  const parsedInterests = JSON.parse(item.item.interests);

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
                  if (!item.item?.showPictures) return [];
                  const parsed = JSON.parse(item.item.showPictures);
                  return parsed
                    .sort((a: { priority: number }, b: { priority: number }) => a.priority - b.priority)
                    .map((img: any) => img.path);
                } catch (error) {
                  console.warn('Invalid showPictures:', error);
                  return [];
                }
              })()
            }
          />
          <View style={styles.containerMain}>

            <Text style={styles.textBio}>
              {item.item.bio}
            </Text>

            <Text style={styles.textSectionTitle}>Interests</Text>
           
            {parsedInterests.map((item: { name: string | undefined; subInterest: string | undefined }, index: React.Key | null | undefined) => (
              <InterestExpandableItem
                key={index}
                title={item.name}
                description={item.subInterest}
              />
            ))}

            <Text style={styles.textSectionTitle}>Education</Text>
            <Text style={styles.textBio}> {item.item.education}</Text>

            <Text style={styles.textSectionTitle}>Work</Text>
            <Text style={styles.textBio}> {item.item.work}</Text>
          </View>
          <View style={{ paddingBottom: 200 }} />
        </ScrollView>
        <View style={styles.containerBtn} />
      </View>
    </ScreenWrapper>
  )
}

export default UserProfile
