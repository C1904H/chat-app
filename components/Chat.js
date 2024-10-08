import { useEffect, useState } from 'react';
import { StyleSheet, View, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy
} from 'firebase/firestore';

const Chat = ({ route, navigation, db }) => {
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

  // Fetch messages from database in real time
  useEffect(() => {
    navigation.setOptions({ title: name });
    const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
    const unsubMessages = onSnapshot(q, (docs) => {
      let newMessages = [];
      docs.forEach((doc) => {
        newMessages.push({
          _id: doc.id,
          ...doc.data(),
          createdAt: new Date(doc.data().createdAt.toMillis())
        });
      });
      setMessages(newMessages);
    });

    // Clean up code
    return () => {
      if (unsubMessages) unsubMessages();
    };
  }, []);

  // displays entered user name from start screen in navigation bar
  // useEffect(() => {
  //   navigation.setOptions({ title: name });
  // }, []);

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
