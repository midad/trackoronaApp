import {API_URL, STATS_API_URL, REGION_STATS_API_URL} from './constants';
import {AsyncStorage} from 'react-native';
import config from './config';

const api = {
  get: async url => {
    const userId = await AsyncStorage.getItem('userId');
    let headers = [];
    headers['Content-Type'] = 'application/json';
    headers['Accept'] = 'application/json';

    return fetch(`${API_URL}${url}`, {
      method: 'get',
      headers,
    });
  },
  getStats: async () => {
    const userId = await AsyncStorage.getItem('userId');
    return fetch(`${STATS_API_URL}`, {
      headers: {
        USER_TOKEN: userId,
      },
    });
  },
  getRegionsStats: async () => {
    const userId = await AsyncStorage.getItem('userId');
    return fetch(`${REGION_STATS_API_URL}`, {
      headers: {
        USER_TOKEN: userId,
      },
    });
  },
  post: async (url, body) => {
    let headers = [];
    headers['Content-Type'] = 'application/json';
    headers['Accept'] = 'application/json';

    const userId = await AsyncStorage.getItem('userId');
    body.access_token = config.MASTER_KEY;
    return fetch(`${API_URL}${url}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        USER_TOKEN: userId,
      },
      body: JSON.stringify(body),
    });
  },
  put: async (url, body) => {
    let headers = [];
    headers['Content-Type'] = 'application/json';
    headers['Accept'] = 'application/json';
    const userId = await AsyncStorage.getItem('userId');
    const userData = JSON.parse(await AsyncStorage.getItem('userData'));
    console.log({userData});

    body.access_token = userData.token;
    console.log({body, url, API_URL});
    return fetch(`${API_URL}${url}`, {
      method: 'put',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        USER_TOKEN: userId,
      },
      body: JSON.stringify(body),
    });
  },
};

export default api;
