import {StatusBar} from 'expo-status-bar';
import {Platform, StyleSheet} from 'react-native';
import {Text, Surface} from 'react-native-paper';

export default function ModalScreen() {
  return (
    <Surface style={styles.container}>
      <Text style={styles.title}>Modal</Text>
      <Surface elevation={3}>
        <Text>This is a modal. You can swipe it down to close.</Text>
      </Surface>

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
