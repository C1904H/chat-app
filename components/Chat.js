import { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Platform,
  KeyboardAvoidingView,
  TouchableOpacity
} from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';

const Chat = ({ route, navigation }) => {
  const { name, backgroundColor } = route.params;
  // message state initialization using useState()
  const [messages, setMessages] = useState([]);

  // what's called when user sends a message
  const onSend = (newMessages) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, newMessages)
    );
  };

  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          // sets received message bubble appearance
          right: {
            backgroundColor: '#000'
          },
          // sets senders message bubble appearance
          left: {
            backgroundColor: '#FFF'
          }
        }}
      />
    );
  };

  // set state with static message to see each element of UI displayed
  useEffect(() => {
    setMessages([
      // simulated user message
      {
        _id: 1,
        text: 'Hello Developer',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any'
        }
      },
      // sets static system message
      {
        _id: 2,
        text: 'Welcome to the Chat!',
        createdAt: new Date(),
        system: true
      }
    ]);
  }, []);

  // displays entered user name from start screen in navigation bar
  useEffect(() => {
    navigation.setOptions({ title: name });
  }, []);

  return (
    // pass selected background color from start screen
    <View style={[styles.container, { backgroundColor }]}>
      <GiftedChat
        // accessiblity features
        accessible={true}
        accessibilityLabel="Message input field"
        accessibilityHint="Type your message here and then press enter"
        accessibilityRole="message-input"
        // displays message bubbles
        messages={messages}
        renderBubble={renderBubble}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: 1
        }}
      />
      {/* Stops keyboard from hiding message input field for android */}
      {Platform.OS === 'android' ? (
        <KeyboardAvoidingView behavior="height" />
      ) : null}
      {/* and ios */}
      {Platform.OS === 'ios' ? (
        <KeyboardAvoidingView behavior="padding" />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default Chat;
