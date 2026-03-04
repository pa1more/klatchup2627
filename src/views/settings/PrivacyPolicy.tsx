import {ScrollView, StyleSheet, Text} from 'react-native';
import React from 'react';
import ScreenWrapper from '../../components/ScreenWrapper';
import Toolbar from '../../components/Toolbar';
import { DesignSystem } from '../../theme/DesignSystem';

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
});

const PrivacyPolicy = () => {
  return (
    <ScreenWrapper>
      <Toolbar title="Privacy Policy" />
      <ScrollView contentContainerStyle={styles.container}>
        <Text
          style={
            styles.textSubheading
          }>{`Last updated ${new Date().toLocaleDateString()}`}</Text>
        <Text style={styles.textContent}>
          Magna do eiusmod est irure laboris esse aliquip nostrud enim sit sint
          eiusmod. Sunt cupidatat elit sunt sit aliqua. Culpa Lorem ex ea est
          ipsum mollit cillum amet ut pariatur aliqua anim ullamco deserunt.
          Minim reprehenderit ipsum labore reprehenderit ad officia ad. Nostrud
          commodo cillum commodo dolore commodo tempor sit laborum consectetur
          enim non magna. Lorem enim anim qui consequat tempor proident dolor.
          Do magna veniam fugiat sunt reprehenderit ad sunt officia aute.
          Officia anim ipsum irure tempor fugiat sint elit adipisicing nulla
          consectetur aute. Ullamco irure quis veniam consectetur sunt. Labore
          Lorem magna minim duis minim enim commodo et aute do nulla amet
          cillum. Incididunt minim sunt consequat et ut. Officia anim Lorem
          minim esse nulla id. Aliqua occaecat cillum duis in sit ex labore duis
          quis laborum exercitation velit pariatur. Laborum cupidatat proident
          mollit consectetur sit eiusmod minim minim culpa nulla ex. Proident
          nulla est id exercitation ut sunt aliqua incididunt deserunt. Aliqua
          ipsum fugiat incididunt et. Et est aliqua consequat non eu. Laborum
          velit ea proident aute aute laboris irure est reprehenderit. Ex ea
          cillum voluptate labore fugiat mollit enim laboris fugiat ullamco
          labore et. Esse culpa Lorem in amet et non. Officia elit amet
          cupidatat nulla eu ullamco pariatur. Nostrud amet ut culpa occaecat
          laboris. Magna incididunt id sit occaecat excepteur pariatur minim
          officia incididunt quis magna non anim. Id cupidatat esse proident
          amet. Culpa id in dolore Lorem fugiat sint. Ullamco excepteur ex
          laborum eiusmod proident aliquip proident. Magna do eiusmod est irure
          laboris esse aliquip nostrud enim sit sint eiusmod. Sunt cupidatat
          elit sunt sit aliqua. Culpa Lorem ex ea est ipsum mollit cillum amet
          ut pariatur aliqua anim ullamco deserunt. Minim reprehenderit ipsum
          labore reprehenderit ad officia ad. Nostrud commodo cillum commodo
          dolore commodo tempor sit laborum consectetur enim non magna. Lorem
          enim anim qui consequat tempor proident dolor. Do magna veniam fugiat
          sunt reprehenderit ad sunt officia aute. Officia anim ipsum irure
          tempor fugiat sint elit adipisicing nulla consectetur aute. Ullamco
          irure quis veniam consectetur sunt. Labore Lorem magna minim duis
          minim enim commodo et aute do nulla amet cillum. Incididunt minim sunt
          consequat et ut. Officia anim Lorem minim esse nulla id. Aliqua
          occaecat cillum duis in sit ex labore duis quis laborum exercitation
          velit pariatur. Laborum cupidatat proident mollit consectetur sit
          eiusmod minim minim culpa nulla ex. Proident nulla est id exercitation
          ut sunt aliqua incididunt deserunt. Aliqua ipsum fugiat incididunt et.
          Et est aliqua consequat non eu. Laborum velit ea proident aute aute
          laboris irure est reprehenderit. Ex ea cillum voluptate labore fugiat
          mollit enim laboris fugiat ullamco labore et. Esse culpa Lorem in amet
          et non. Officia elit amet cupidatat nulla eu ullamco pariatur. Nostrud
          amet ut culpa occaecat laboris. Magna incididunt id sit occaecat
          excepteur pariatur minim officia incididunt quis magna non anim. Id
          cupidatat esse proident amet. Culpa id in dolore Lorem fugiat sint.
          Ullamco excepteur ex laborum eiusmod proident aliquip proident.
        </Text>
      </ScrollView>
    </ScreenWrapper>
  );
};

export default PrivacyPolicy;
