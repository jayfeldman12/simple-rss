import AsyncStorage from '@react-native-async-storage/async-storage';
import {Redirect} from 'expo-router';
import {useEffect} from 'react';
import {StatusBar, View} from 'react-native';
import {TOKEN_LOCAL_STORAGE} from '../queries/consts';
import {useAuthStore} from '../store/authStore';

export default function App() {
  const isLoggedIn = useAuthStore(state => state.isLoggedIn);
  const isLoadingLogin = useAuthStore(state => state.loading);
  const appLogIn = useAuthStore(state => state.logIn);
  const appLogOut = useAuthStore(state => state.logOut);

  useEffect(() => {
    const checkLogin = async () => {
      const token = await AsyncStorage.getItem(TOKEN_LOCAL_STORAGE);
      if (token) {
        appLogIn();
      } else {
        appLogOut();
      }
    };
    checkLogin();
  }, []);

  if (!isLoadingLogin) {
    return (
      <View>
        <StatusBar />
      </View>
    );
  }

  if (isLoggedIn) {
    return <Redirect href={'/feed'} />;
  } else {
    return <Redirect href={'/login'} />;
  }
}
