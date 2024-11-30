import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {COLORS} from '../Assets/theme/COLOR';
import {AppImages} from '../Assets/Images';
import {MapPinIcon} from 'react-native-heroicons/solid';
import {ChevronDownIcon} from 'react-native-heroicons/mini';
import CitySelectorModal from './CitySelectorModal';
import I18n from '../Translation';

const CityInfo = ({changeLanguage, setSelectedCity, setSelectedState, city, state}) => {
  const [showModal, setShowModal] = useState(false);
  const today = new Date();




  return (
    <View>
      <TouchableOpacity
        style={styles.cityInfoContainer}
        onPress={() => setShowModal(true)}>
        <View style={styles.cityNameContainer}>
          <MapPinIcon
            color={COLORS.primary}
            size={20}
            style={{marginRight: 6}}
          />
          <View>
            <Text style={styles.cityInfoText}>
              {city}, {state}
            </Text>
            <Text style={styles.todayDate}>{today.toDateString()}</Text>
          </View>
          <ChevronDownIcon color={COLORS.dark_shade} size={20} />
        </View>
        <TouchableOpacity onPress={()=>{
          console.log(I18n.locale);
          if (I18n.locale=='hi') {
            changeLanguage('en')  
          }else{
            changeLanguage('hi')
          }
          
        }}>
        <Image  style={styles.languageImage} source={AppImages.LanguageDrawer} />

        </TouchableOpacity>
        <Image style={styles.cityInfoImage} source={AppImages.map} />
      </TouchableOpacity>
      <CitySelectorModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        setSelectedCity={setSelectedCity}
        setSelectedState={setSelectedState}
      />
    </View>
  );
};
export default CityInfo;

const styles = StyleSheet.create({
  cityInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '95%',
    alignSelf: 'center',
    marginTop: 10,
  },
  cityNameContainer: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: COLORS.white,
    elevation: 20,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cityInfoText: {
    fontSize: 16,
    // width: '60%',
    color: COLORS.dark_shade,
    fontWeight: 'bold',
    marginRight: 5,
  },
  cityInfoImage: {
    width: 35,
    height: 35,
    borderRadius: 8,
  },
  languageImage: {
    width: 30,
    height: 30,
    borderRadius: 8,
  },
  todayDate: {
    fontSize: 11,
    color: COLORS.windSpeedText,
  },
});
