import {router} from 'expo-router';
import {getAuth, signInWithEmailAndPassword} from 'firebase/auth';
import {useState} from 'react';
import { StyleSheet } from 'react-native';
import {Button, Surface, Text, TextInput} from 'react-native-paper';

export default function LoginScreen() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleLogin = () => {
    signInWithEmailAndPassword(getAuth(), email, password)
      .then((user) => {
        if (user) router.replace('/(tabs)');
      })
      .catch((err) => {
        alert(err?.message);
      });
  };

  return (
    <Surface style={styles.surface}>
      <Text style={styles.title}>Login Screen</Text>
      <TextInput
        keyboardType="email-address"
        onChangeText={(text) => setEmail(text)}
        placeholder="Email"
        style={styles.input}
      />
      <TextInput
        onChangeText={(text) => setPassword(text)}
        placeholder="Password"
        secureTextEntry
        style={styles.input}
      />
      <Button style={styles.button} mode="elevated" onPress={handleLogin}>Login</Button>
    </Surface>
  );
}

const styles = StyleSheet.create({
  surface: {
    padding: 20,
    width: 320,
    margin: 'auto',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    margin: 40,
    fontSize: 20,
  },
  input: {
    margin: 5,
    width: 300,
  },
  button: {
    marginTop: 10,
  },
});
