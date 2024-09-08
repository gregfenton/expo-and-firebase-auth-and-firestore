import {router} from 'expo-router';
import {createUserWithEmailAndPassword, getAuth} from 'firebase/auth';
import {useState} from 'react';
import {StyleSheet} from 'react-native';
import {Button, Surface, Text, TextInput} from 'react-native-paper';

export default function RegisterScreen() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleRegister = () => {
    createUserWithEmailAndPassword(getAuth(), email, password)
      .then((user) => {
        if (user) router.replace('/(tabs)');
      })
      .catch((err) => {
        alert(err?.message);
      });
  };

  return (
    <Surface style={styles.surface}>
      <Text style={styles.title}>Register Screen</Text>
      <TextInput
        placeholder="Email"
        keyboardType="email-address"
        onChangeText={(text) => setEmail(text)}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        onChangeText={(text) => setPassword(text)}
        style={styles.input}
      />
      <Button style={styles.button} mode="elevated" onPress={handleRegister}>
        Register
      </Button>
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
