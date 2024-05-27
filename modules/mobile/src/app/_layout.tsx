import {QueryClientProvider} from '@tanstack/react-query';
import {Slot} from 'expo-router';
import {StatusBar} from 'expo-status-bar';
import {StyleSheet, View} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {colors} from '../colors';
import {queryClient} from '../queries/client';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark,
  },
});

export default function Root() {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <StatusBar />
          <View style={styles.container}>
            <Slot />
          </View>
        </SafeAreaProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
