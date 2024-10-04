import { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';

const Chat = ({ route, navigation }) => {
  const { name, backgroundColor } = route.params;
  // displays entered user name from start screen in navigation bar
  useEffect(() => {
    navigation.setOptions({ title: name });
  }, []);

  return (
    // pass selected background color grom start screen
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={styles.text}>Hello Chat!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    color: '#FFFFFF',
    fontSize: 20
  }
});

export default Chat;
