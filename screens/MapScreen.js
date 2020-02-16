import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Platform, TouchableOpacity, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

import Colors from '../constants/Colors';

const MapScreen = props => {
  const readOnly = props.navigation.getParam('readonly');
  const initialLocation = props.navigation.getParam('initialLocation');
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);
  
  const mapRegion = {
    latitude: initialLocation ? initialLocation.lat : 37.78,
    longitude: initialLocation ? initialLocation.lng : -122.48,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421
  };

  const selectLocationHandler = event => {
    if (readOnly) {
      return;
    }
    setSelectedLocation({
      lat: event.nativeEvent.coordinate.latitude,
      lng: event.nativeEvent.coordinate.longitude
    });
  };

  const savePickedLocationHandler = useCallback(() => {
    if (!selectedLocation) {
      return;
    }
    props.navigation.navigate('NewPlace', { pickedLocation: selectedLocation });
  }, [selectedLocation]);

  useEffect(() => {
    props.navigation.setParams({ saveLocation: savePickedLocationHandler });
  }, [savePickedLocationHandler]);

  let markerCoordinates;

  if (selectedLocation) {
    markerCoordinates = {
      latitude: selectedLocation.lat,
      longitude: selectedLocation.lng
    };
  }

  return (
    <MapView
      style={styles.map}
      region={mapRegion}
      onPress={selectLocationHandler}
    >
      {selectedLocation && (
        <Marker title="Picked Location" coordinate={markerCoordinates} />
      )}
    </MapView>
  );
};

MapScreen.navigationOptions = navData => {
  const readOnly = navData.navigation.getParam('readonly');
  if (readOnly) {
    return {};
  }
  const SaveFn = navData.navigation.getParam('saveLocation');

  return {
    headerRight: () => {
      return (
        <TouchableOpacity style={styles.headerButton} onPress={SaveFn}>
          <Text style={styles.headerButtonText}>Save</Text>
        </TouchableOpacity>
      );
    }
  };
};

const styles = StyleSheet.create({
  map: {
    flex: 1
  },
  headerButton: {
    marginHorizontal: 20
  },
  headerButtonText: {
    fontSize: 16,
    color: Platform.OS === 'android' ? 'white' : Colors.primary
  }
});

export default MapScreen;
