import React, {useState} from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {COLORS} from '../Assets/theme/COLOR';
import {cities, states} from '../Assets/theme/appDataConfig';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const CitySelectorModal = ({visible, onClose, setSelectedCity, setSelectedState}) => {
  const [expandedState, setExpandedState] = useState(null); 
  const [searchText, setSearchText] = useState(''); 


  const filteredCities = cities.filter(city =>
    city.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderStates = ({item}) => {
    const isExpanded = expandedState === item.id; 
    return (
      <View>
        <TouchableOpacity onPress={() => setExpandedState(isExpanded ? null : item.id)}>
          <Text style={styles.stateName}>{item.name}</Text>
        </TouchableOpacity>
        {isExpanded && (
          <View style={styles.cityInfoContent}>
            <FlatList
              data={filteredCities.filter(city => city.stateId === item.id)}
              renderItem={(cityItem) => renderCities(cityItem, item.name)}
              keyExtractor={item => item.id.toString()}
              showsVerticalScrollIndicator={false}
            />
          </View>
        )}
      </View>
    );
  };

  const renderCities = ({item}, state) => (
    <TouchableOpacity
      onPress={() => {
        setSelectedState(state);
        setSelectedCity(item.name);
        onClose();
      }}>
      <Text style={styles.cityName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.modalContent}>
        <View style={styles.regionInfoContent}>
          <Text style={styles.modalHeaderText}>Select Your City</Text>
          {/* Search Input */}
          <TextInput
            style={styles.searchInput}
            placeholder="Search city..."
            value={searchText}
            onChangeText={setSearchText}
          />
          <FlatList
            data={states}
            renderItem={renderStates}
            keyExtractor={item => item.id.toString()}
            showsVerticalScrollIndicator={false}
          />
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default CitySelectorModal;

const styles = StyleSheet.create({
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  regionInfoContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginVertical: 10,
    width: windowWidth * 0.9,
    height: windowHeight * 0.8,
  },
  modalHeaderText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: COLORS.primary,
  },
  stateName: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: 'bold',
    color: COLORS.dark_shade,
  },
  cityName: {
    fontSize: 14,
    marginBottom: 10,
    color: COLORS.windSpeedText,
  },
  closeText: {
    fontSize: 16,
    color: COLORS.temp,
    marginTop: 10,
  },
  cityInfoContent: {
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  searchInput: {
    height: 40,
    borderColor: COLORS.lightGray,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    color: COLORS.dark_shade,
  },
});
