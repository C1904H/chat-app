import { useEffect, useState } from 'react';
import { StyleSheet, View, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy
} from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Chat = ({ route, navigation, db, isConnected }) => {
  const { name, backgroundColor, userID } = route.params;
  // message state initialization using useState()
  const [messages, setMessages] = useState([]);

  // what's called when user sends a message
  const onSend = (newMessages) => {
    addDoc(collection(db, 'messages'), newMessages[0]);
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

  // Returns InputToolbar if connected, otherwise returns a null
  const renderInputToolbar = (props) => {
    if (isConnected) return <InputToolbar {...props} />;
    else return null;
  };

  // Fetch messages from database in real time
  let unsubMessages;
  useEffect(() => {
    navigation.setOptions({ title: name });

    if (isConnected === true) {
      // unregister current onSnapshot() listener to avoid registering multiple listeners when
      // useEffect code is re-executed.
      if (unsubMessages) unsubMessages();
      unsubMessages = null;

      // If connection, fetch data from Firestore Database
      const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
      unsubMessages = onSnapshot(q, (docs) => {
        let newMessages = [];
        docs.forEach((doc) => {
          newMessages.push({
            _id: doc.id,
            ...doc.data(),
            createdAt: new Date(doc.data().createdAt.toMillis())
          });
        });
        cacheMessages(newMessages);
        setMessages(newMessages);
      });
    } else loadCachedMessages(); //Fetches data from AsyncStorage if no connection

    // Clean up code
    return () => {
      if (unsubMessages) unsubMessages();
    };
  }, [isConnected]);

  const cacheMessages = async (messagesToCache) => {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(messagesToCache));
    } catch (error) {
      console.log(error.message);
    }
  };

  // function called if isConnected props false in useEffect(), ||[] returns empty array to cachedMessaged if not set yet in AsyncStorage (known as 'logical OR assignment operator')
  const loadCachedMessages = async () => {
    const cachedMessages = (await AsyncStorage.getItem('messages')) || [];
    setMessages(JSON.parse(cachedMessages));
  };

  return (
    // pass selected background color from start screen
    <View style={[styles.container, { backgroundColor: backgroundColor }]}>
      <GiftedChat
        // accessiblity features
        accessible={true}
        accessibilityLabel="Message input field"
        accessibilityHint="Type your message here and then press enter"
        accessibilityRole="message-input"
        // displays message bubbles
        messages={messages}
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
        onSend={(messages) => onSend(messages)}
        // attach correct user ID and name to message
        user={{
          _id: userID,
          name: name
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
    flex: 1,
    marginBottom: 40
  }
});

export default Chat;
