// import the screens
import Start from './components/Start';
import Chat from './components/Chat';
// import react Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import Firebase
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  disableNetwork,
  enableNetwork
} from 'firebase/firestore';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { useNetInfo } from '@react-native-community/netinfo';
import { useEffect } from 'react';
import { LogBox, Alert } from 'react-native';
LogBox.ignoreLogs(['AsyncStorage has been extracted from']);

// Create the navigator
const Stack = createNativeStackNavigator();

// My Chat-App's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyA-7_6rNc4FCmjSuf0bjT7uAEzRovdRP3I',
  authDomain: 'chatapp-876f6.firebaseapp.com',
  projectId: 'chatapp-876f6',
  storageBucket: 'chatapp-876f6.appspot.com',
  messagingSenderId: '374279041359',
  appId: '1:374279041359:web:13280268ce6962efb7553a'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

// Main Chat component that renders the chat UI
const App = () => {
  // Defines new state that represents network connectivity status
  const connectionStatus = useNetInfo();

  // Displays alert popup if connection lost
  useEffect(() => {
    if (connectionStatus.isConnected === false) {
      Alert.alert('Connection Lost!');
      disableNetwork(db); //disables Firebase attempts to reconnect to Firestore Database if offline
    } else if (connectionStatus.isConnected === true) {
      enableNetwork(db); //re-enables attempt when connected
    }
  }, [connectionStatus.isConnected]);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Start">
        <Stack.Screen
          name="Start"
          component={Start}
        />
        <Stack.Screen name="Chat">
          {(props) => (
            <Chat
              isConnected={connectionStatus.isConnected}
              db={db}
              {...props}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
