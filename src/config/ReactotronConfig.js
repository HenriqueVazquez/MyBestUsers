import { Host_IP } from '@env';
import Reactotron from 'reactotron-react-native';
import AsyncStorage from '@react-native-community/async-storage';

if (__DEV__) {
  // eslint-disable-next-line no-undef
  const tron = Reactotron.setAsyncStorageHandler(AsyncStorage) // AsyncStorage would either come from `react-native` or `@react-native-community/async-storage` depending on where you get it fro
    .configure({ host: `${Host_IP}` }) // controls connection & communication settings, inform your IP
    .useReactNative() // add all built-in react native plugins
    .connect(); // let's connect!

  console.tron = tron;

  tron.clear();
}
