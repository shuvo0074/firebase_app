/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TextInput,
  Button
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
  const [alertText,setAlertText]=useState('')
  const [otpError,setOtpError]=useState(false)

  async function signInWithPhoneNumber() {
    console.log("-----",userNum)
    const confirmation = await auth().signInWithPhoneNumber(userNum)
    setConfirm(confirmation);
    setOtpError(false)
  }

  async function confirmCode() {

    try {
      await confirm.confirm(code)
    } catch (error) {
      console.log('Invalid code.',error);
      setAlertText(error.toString())
      setOtpError(true)
    }
  }
  if(!confirm){
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
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
                <Text style={styles.sectionTitle}>
                  Number: 
                  {
                    userNum
                  }
                </Text>
              </View>
            </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );}
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <View style={styles.body}>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Please Enter code sent to {userNum} </Text>
              <TextInput
              value={code}
              onChangeText={setCode}
              style={styles.addBorder}
              />
            </View>
            <View style={styles.sectionContainer}>
              <Button
              onPress={confirmCode}
              title="Confirm Code"
              />
              <Text style={styles.sectionTitle}>
                {
                  alertText
                }
              </Text>
              {
                otpError?
                <Button
                  onPress={()=>{
                    signInWithPhoneNumber()
                    setCode('')
                  }}
                  title="Send again"
                  color='red'
                  />
                  :<Button
                  onPress={()=>{
                    setConfirm(null)
                    setUserNum('')
                    setCode('')
                    setAlertText('')
                  }}
                  title="Go Back"
                  color='red'
                  />
              }
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
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
