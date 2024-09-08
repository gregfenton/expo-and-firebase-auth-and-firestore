import Ionicons from '@expo/vector-icons/Ionicons';
import {StyleSheet} from 'react-native';

import {Collapsible} from '@/components/Collapsible';
import {ParallaxScrollView} from '@/components/ParallaxScrollView';
import {ThemedText} from '@/components/ThemedText';
import {ThemedView} from '@/components/ThemedView';
import {Button} from 'react-native-paper';

import {useAuthContext} from '@/providers/AuthProvider';

export default function SignOutScreen() {
  const {logout} = useAuthContext();

  return (
    <ParallaxScrollView
      headerBackgroundColor={{light: '#D0D0D0', dark: '#353636'}}
      headerImage={<Ionicons size={310} name="code-slash" style={styles.headerImage} />}
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Sign Out</ThemedText>
      </ThemedView>
      <Collapsible title="The sign out button">
        <Button mode="contained" onPress={() => logout()}>
          Sign Out
        </Button>
      </Collapsible>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
