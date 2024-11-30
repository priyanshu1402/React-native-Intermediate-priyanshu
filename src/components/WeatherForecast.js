import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {COLORS} from '../Assets/theme/COLOR';
import {request_weather_data} from '../Redux/Actions/publicDataActions';
import {getWeatherIcon} from '../utils';
import CityInfo from './CityInfo';
import CurrentWeather from './CurrentWeather';
import HourlyInfo from './HourlyInfo';
import FetchLocation from '../FetchLocation';
import I18n from '../Translation';
const windowWidth = Dimensions.get('window').width;

const WeatherForecast = () => {
  const [selectedCity, setSelectedCity] = useState('Bhopal');
  const [selectedState, setSelectedState] = useState('Gujarat');
  const [degree, setdegree] = useState('celsius')
  const [selectedDayDate, setSelectedDayDate] = useState(
    new Date().toISOString().split('T')[0],
  );
  const {weather_data, weather_loading} = useSelector(state => state.params);

  const dispatch = useDispatch();

  const [language, setLanguage] = useState(I18n.locale); 

  const changeLanguage = (langCode) => {
    I18n.locale = langCode; 
    setLanguage(langCode);  
  };

  useEffect(() => {
    FetchLocation(setSelectedCity, setSelectedState)
  }, []);
  useEffect(() => {
    dispatch(request_weather_data(selectedCity));
  }, [selectedCity]);

  function celsiusToFahrenheit(celsius) {
    if(degree=="celsius"){
      return celsius +"°C"
    }else{
      return ((celsius * 9) / 5 + 32).toFixed(2) +"°F";

    }
  }
  

  const renderCurrentWeatherCards = ({item}) => {
    const today = new Date();
    const cardDate = new Date(item?.datetime);

    let dateString = cardDate.toLocaleDateString();
    if (cardDate.getDate() === today.getDate()) {
      dateString = 'Today';
    } else if (cardDate.getDate() === today.getDate() + 1) {
      dateString = 'Tomorrow';
    }

    const weatherIcon = getWeatherIcon(item.conditions);

    return (
      <TouchableOpacity
        style={[
          styles.forecastCard,
          item.datetime === selectedDayDate
            ? {backgroundColor: COLORS.primary}
            : {},
        ]}
        onPress={() => {
          setSelectedDayDate(item.datetime);
        }}>
        <Text
          style={[
            styles.forecastDate,
            item.datetime === selectedDayDate
              ? {color: COLORS.light_shade}
              : {},
          ]}>
          {dateString}
        </Text>
        <View style={{alignItems: 'center'}}>
          <Image source={weatherIcon} style={styles.forecastCondition} />
        </View>
        <Text
          style={[
            styles.forecastTempText,
            item.datetime === selectedDayDate
              ? {color: COLORS.light_shade}
              : {},
          ]}>
          {celsiusToFahrenheit(item.temp)}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderHourlyInfo = ({item, index}) => {
    return <HourlyInfo data={item} celsiusToFahrenheit={celsiusToFahrenheit} />;
  };

  const getSelectedDateHours =
    weather_data?.days?.filter(a => a.datetime == selectedDayDate)?.[0]
      ?.hours || [];
  const getSelectedDay =
    weather_data?.days?.filter(a => a.datetime == selectedDayDate)?.[0] || [];

  return (
    <View>
      <CityInfo changeLanguage={changeLanguage} setSelectedCity={setSelectedCity} setSelectedState={setSelectedState} city={selectedCity} state={selectedState} />

      <TouchableOpacity onPress={()=>{
        if (degree=="celsius") {
          setdegree("fahrenheit")
        }else {
          setdegree("celsius")          
        }
      }} style={{marginLeft:'auto', marginTop:5}}>
        <Text style={{color:'#000'}}>{I18n.t(`Change to ${degree=="fahrenheit"?"Celsius":"Fahrenheit"}`)} </Text>
      </TouchableOpacity>

      <FlatList
      data={[1]}
      renderItem={()=>{
        return(
        <View>
          {weather_loading ? (
            <ActivityIndicator size={'small'} color={COLORS.primary} />
          ) : (
            <>
              {weather_data && (
                <View style={styles.scrollFlat}>
                  <FlatList
                    data={weather_data?.days}
                    renderItem={renderCurrentWeatherCards}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={item => item.datetime}
                    horizontal
                  />
                </View>
              )}
  
              {getSelectedDay && (
                <CurrentWeather celsiusToFahrenheit={celsiusToFahrenheit} currentWeather={getSelectedDay} />
              )}
  
              <FlatList
                data={getSelectedDateHours}
                renderItem={renderHourlyInfo}
                showsHorizontalScrollIndicator={false}
                keyExtractor={item => item.datetime}
                style={styles.list}
                contentContainerStyle={{alignItems: 'center'}}
              />
            </>
          )}
        </View>

        )
      }}
      />

    </View>
  );
};

const styles = StyleSheet.create({
  forecastContainer: {
    width: windowWidth * 0.9,
    alignSelf: 'center',
    marginTop: 12,
  },
  forecastTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 8,
    color: COLORS.dark_shade,
  },
  selectCity: {
    padding: 10,
    backgroundColor: COLORS.secondary,
    alignItems: 'center',
    width: windowWidth * 0.9,
    alignSelf: 'center',
    borderRadius: 8,
    marginTop: 10,
  },
  selectCityText: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  weatherCard: {
    margin: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 8,
  },
  forecastCard: {
    // width: (windowWidth * 0.4) / 2,
    height: (windowWidth * 0.65) / 2,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 40,
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0,0,0,0.8)',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 6,
      },
    }),
    marginBottom: 8,
    marginTop: 8,
    marginHorizontal: 7,
    alignSelf: 'center',
  },
  forecastDate: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    color: COLORS.primary,
  },
  forecastCondition: {width: 50, height: 60},

  forecastTempText: {
    color: COLORS.temp,
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
  },
  scrollFlat: {
    marginTop: 22,
    width: windowWidth,
    alignSelf: 'center',
    marginBottom: (windowWidth * 0.2) / 2,
    marginLeft: 14,
  },
  selectCityHeaderText: {color: COLORS.windSpeedText, fontStyle: 'italic'},
  list: {
    alignSelf: 'center',
    marginTop: 20,
    width: '100%',
    marginBottom: 70,
  },
});

export default WeatherForecast;
