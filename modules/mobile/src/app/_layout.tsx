import {Slot} from 'expo-router';
import {StatusBar} from 'expo-status-bar';
import {SafeAreaProvider} from 'react-native-safe-area-context';

export default function Root() {
  return (
    <SafeAreaProvider>
      <StatusBar />
      <Slot />
    </SafeAreaProvider>
  );
}
