import { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ImageBackground,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView
} from 'react-native';

const colors = ['#090C08', '#474056', '#8A95A5', '#B9C6AE'];

const Start = ({ navigation }) => {
  const [name, setName] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('');

  return (
    <ImageBackground
      source={require('../img/Background_Image.png')}
      resizeMode="cover"
      style={styles.image}
    >
      <Text style={styles.title}>Chit Chat!</Text>
      <View style={styles.container}>
        <TextInput
          style={styles.textInput}
          value={name}
          onChangeText={setName}
          placeholder="Your name"
        />

        <Text style={styles.colorSelectText}>Choose Background Color:</Text>

        <View style={styles.colorSelectBox}>
          {colors.map((color) => (
            <TouchableOpacity
              key={color}
              style={[styles.chooseColor, { backgroundColor: color }]}
              onPress={() => setBackgroundColor(color)} //sets background color in chat
            />
          ))}
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Chat', { name, backgroundColor })} //navigates to chat
        >
          <Text style={styles.buttonText}>Start Chatting</Text>
        </TouchableOpacity>
       
      </View>
      {Platform.OS === 'android' ? (
          <KeyboardAvoidingView behavior="height" />
        ) : null}
        {Platform.OS === 'ios' ? (
          <KeyboardAvoidingView behavior="padding" />
        ) : null}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    height: '44%',
    width: '88%',
    marginBottom: 40
  },
  title: {
    flex: 1,
    fontSize: 45,
    fontWeight: '600',
    color: '#FFFFFF',
    justifyContent: 'center',
    marginTop: 90
  },
  textInput: {
    width: '88%',
    padding: 15,
    borderWidth: 1,
    marginBottom: 10,
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    opacity: 0.5,
    borderRadius: 3
  },
  image: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  colorSelectBox: {
    flexDirection: 'row',
    width: '88%',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  colorSelectText: {
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    alignSelf: 'flex-start',
    marginLeft: 20,
    marginBottom: 10
  },
  // colorBoxContainer: {
  //   flexDirection: 'row',
  //   alignSelf: 'flex-start',
  //   justifyContent: 'space-between'
  // },
  chooseColor: {
    width: 42,
    height: 42,
    borderRadius: 21,
    border: 5,
    borderColor: '#FFFFFF',
    marginRight: 10
  },

  button: {
    backgroundColor: '#757083',
    padding: 10,
    width: '88%',
    height: '18%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600'
  }
});

export default Start;
