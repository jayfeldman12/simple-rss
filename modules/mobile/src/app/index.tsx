import {Redirect} from 'expo-router';
import {useEffect} from 'react';
import {StatusBar, View} from 'react-native';
import {useTokenStore} from '../store/tokenStore';

export default function App() {
  const {token, loading: loadingToken} = useTokenStore(
    state => state.tokenInfo,
  );
  const fetchToken = useTokenStore(state => state.fetchToken);

  useEffect(() => {
    fetchToken();
  }, []);

  if (loadingToken) {
    return (
      <View>
        <StatusBar />
      </View>
    );
  }

  if (token) {
    return <Redirect href={'/feed'} />;
  } else {
    return <Redirect href={'/login'} />;
  }
}
