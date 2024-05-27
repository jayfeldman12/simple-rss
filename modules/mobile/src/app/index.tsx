import {Redirect} from 'expo-router';
import {StatusBar, Text, View} from 'react-native';
import {useAuthStore} from '../store/authStore';

export default function App() {
  const isLoggedIn = useAuthStore(state => state.isLoggedIn);
  const isLoadingAuth = useAuthStore(state => state.loading);

  if (isLoadingAuth) {
    return (
      <View>
        <StatusBar />
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!isLoggedIn) {
    return <Redirect href={'/login'} />;
  } else {
    return <Redirect href={'/feed'} />;
  }
}
