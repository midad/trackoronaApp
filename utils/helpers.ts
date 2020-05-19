import {AsyncStorage} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { PERMISSIONS, request } from 'react-native-permissions';
import api from './api';

export const getUserData = async () => {
  try {
    const data = await AsyncStorage.getItem('userData');
    const parsedData = JSON.parse(data);

    return parsedData;
  } catch (error) {
    console.log({error});
  }
};

export const distance = (lat1, lon1, lat2, lon2, unit) => {
  var radlat1 = (Math.PI * lat1) / 180;
  var radlat2 = (Math.PI * lat2) / 180;
  var theta = lon1 - lon2;
  var radtheta = (Math.PI * theta) / 180;
  var dist =
    Math.sin(radlat1) * Math.sin(radlat2) +
    Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  dist = Math.acos(dist);
  dist = (dist * 180) / Math.PI;
  dist = dist * 60 * 1.1515;
  if (unit == 'K') {
    dist = dist * 1.609344;
  }
  if (unit == 'M') {
    dist = dist * 0.8684;
  }
  return dist;
};

export const calculateHoursFromDate = date => {
  const diff = new Date().getTime() - new Date(date).getTime();
  return Math.floor(diff / (1000 * 60 * 60));
};

export const replaceObject = (parentObject, childKey, newChildObject) => {
  const newParentObject = parentObject;
  delete newParentObject[childKey];
  newParentObject[childKey] = newChildObject;

  return newParentObject;
};

export const handleHours = hours => {
  if (hours === 0) {
    return 'لحظات...';
  }
  if (hours === 1) {
    return 'ساعة';
  }
  if (hours === 2) {
    return 'ساعتين';
  }
  if (hours > 2 && hours < 11) {
    return `${hours} ساعات`;
  }
  if (hours > 11) {
    return `${hours} ساعة`;
  }
};

export const getCurrentCoordinates = (userData, setUserDataAndSyncStore) => {
  Geolocation.setRNConfiguration({
    skipPermissionRequests: false,
    authorizationLevel: 'always',
  });
  
  Geolocation.getCurrentPosition(
    async info => {
      // const data = await AsyncStorage.getItem('userData');
      // const userData = JSON.parse(data);
      console.log({info});
      const res = await api.put(`/users/updateLocations/${userData.user.id}`, {
        locations: {
          latitude: info.coords.latitude.toString(),
          longitude: info.coords.longitude.toString(),
          createdAt: new Date(),
        },
      });
      console.log('*******_____', res);
      setUserDataAndSyncStore(res.json());
    },
    err =>
      request(PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION).then(result => {
        if (result === 'granted') {
          Geolocation.getCurrentPosition(
            info => console.log({info}),
            err => console.log({err}),
          );
        }
      }),
  );
}

export const regionFrom = (lat, lon, distance) => {
  distance = distance/2
  const circumference = 40075
  const oneDegreeOfLatitudeInMeters = 111.32 * 1000
  const angularDistance = distance/circumference

  const latitudeDelta = distance / oneDegreeOfLatitudeInMeters
  const longitudeDelta = Math.abs(Math.atan2(
          Math.sin(angularDistance)*Math.cos(lat),
          Math.cos(angularDistance) - Math.sin(lat) * Math.sin(lat)))

  return {
      latitude: lat,
      longitude: lon,
      latitudeDelta,
      longitudeDelta,
  }
}