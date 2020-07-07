/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState,useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  TextInput,
  Button,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from 'react-native';
import auth from '@react-native-firebase/auth';
import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

const App: () => React$Node = () => {
  const [confirm, setConfirm] = useState(null);
  const [userNum,setUserNum] = useState('')
  const [code, setCode] = useState('');
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [warning,setWarning] = useState('');
  function logOut (){
    auth()
    .signOut()
    setUser(null)
    setConfirm(null)
    setUserNum('')
    setWarning('')
    setCode('')

  }

  async function signInWithPhoneNumber() {
    const confirmation = await auth().signInWithPhoneNumber(userNum,true);
    setConfirm(confirmation);
  }

  async function confirmCode() {
    try {
      await confirm.confirm(code)
      setWarning("Success!!")
      // setUser({phoneNumber:userNum})
      setUserNum('')
    } catch (error) {
      setWarning(error.toString())
      setCode('')
      console.log('Invalid code.');
    }
  }

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    // console.log(auth().currentUser)
    // (auth().currentUser)?
    // logOut():{}

    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  // if (initializing) return <ActivityIndicator/>
  if (user) {
    return (
      <View>
        <Text
        style={[styles.sectionTitle,styles.sectionContainer]}
        >Welcome {user.phoneNumber}</Text>
        <Text
        style={[styles.sectionDescription,styles.sectionContainer]}
        >
          Your UID is: {user.uid}
        </Text>
        <Button
        title="Log out"
        onPress={logOut}
        />
      </View>
    );
  }

  if(!confirm){
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS == "ios" ? "padding" : "height"}
        style={styles.scrollView}
      >
        <View style={styles.body}>
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Please Enter phone number</Text>
            <TextInput
            value={userNum}
            onChangeText={setUserNum}
            style={styles.addBorder}
            keyboardType="phone-pad"
            />
          </View>
          <View style={styles.sectionContainer}>
            <Button
            onPress={signInWithPhoneNumber}
            title="Send text"
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </>
  );}

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS == "ios" ? "padding" : "height"}
        style={styles.scrollView}
      >
          <View style={styles.body}>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Please Enter code</Text>
              <TextInput
              value={code}
              onChangeText={setCode}
              style={styles.addBorder}
              textContentType='oneTimeCode'
              />
            </View>
            <Text
            style={[styles.sectionDescription,styles.sectionContainer]}
            >
              If your number is used with this phone, we will auto detect code. Thank you
            </Text>
            <View style={styles.sectionContainer}>
              <Button
              onPress={confirmCode}
              title="Confirm Code"
              />
              <Text
              style={styles.sectionDescription}
              >
                {warning}
              </Text>
              <Button
              title="Go back"
              color='red'
              onPress={logOut}
              />
            </View>
          </View>
      </KeyboardAvoidingView>
    </>
  );

  

  
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  addBorder: {
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 10,
    margin:15,
    padding:10
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
