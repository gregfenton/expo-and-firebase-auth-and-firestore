import {router} from 'expo-router';
import {StyleSheet} from 'react-native';
import {Button, Surface, Text} from 'react-native-paper';

export default function LandingScreen() {
  return (
    <Surface style={styles.surface}>
      <Text style={styles.title}>Landing Screen</Text>
      <Button style={styles.button} mode="elevated" onPress={() => router.push('/login')}>Login</Button>
      <Button style={styles.button} mode="elevated" onPress={() => router.push('/register')}>Register</Button>
    </Surface>
  );
}

const styles = StyleSheet.create({
  surface: {
    padding: 50,
    margin: 'auto',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    margin: 40,
    fontSize: 20,
  },
  button: {
    margin: 8,
  },
});
