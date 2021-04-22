/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  TextInput,
  Button,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

const App: () => React$Node = () => {
  const [otp, setOtp] = useState('');
  const [confirm, setConfirm] = useState(false);
  const [userNum, setUserNum] = useState('+91');
  const [code, setCode] = useState('');
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [warning, setWarning] = useState('');
  function logOut() {
    auth().signOut();
    setUser(null);
    setConfirm(false);
    setUserNum('+91'); // india
    setWarning('');
    setCode('');
  }
  const [ verificationId, setVerificationId] = useState('')
  function codeInputSubmitted() {
  
    const credential = auth.PhoneAuthProvider.credential(
      verificationId,
      code
    );
  
    // To verify phone number without interfering with the existing user
    // who is signed in, we offload the verification to a worker app.
    // let fbWorkerApp = firebase.apps.find(app => app.name === 'auth-worker')
    //                || firebase.initializeApp(firebase.app().options, 'auth-worker');
    // let fbWorkerAuth = fbWorkerApp.auth();  
    // fbWorkerAuth.setPersistence(auth.Auth.Persistence.NONE); // disables caching of account credentials
  
    auth().signInWithCredential(credential)
      .then((userCredential) => {
        // userCredential.additionalUserInfo.isNewUser may be present
        // userCredential.credential can be used to link to an existing user account
        setWarning('Success!!');
        setUser(userCredential.user)

  
        // return fbWorkerAuth.signOut().catch(err => console.error('Ignored sign out error: ', err);
      })
      .catch((err) => {
        // failed
        let userErrorMessage;
        if (error.code === 'auth/invalid-verification-code') {
          userErrorMessage = 'Sorry, that code was incorrect.'
        } else if (error.code === 'auth/user-disabled') {
          userErrorMessage = 'Sorry, this phone number has been blocked.';
        } else {
          // other internal error
          // see https://firebase.google.com/docs/reference/js/auth.Auth.html#sign-inwith-credential
          userErrorMessage = 'Sorry, we couldn\'t verify that phone number at the moment. '
            + 'Please try again later. '
            + '\n\nIf the issue persists, please contact support.'
        }
        setWarning(userErrorMessage)
      })
  }
  
  function signInWithPhoneNumber() {
    auth()
    .verifyPhoneNumber(userNum)
    .then(phoneAuthSnapshot=>{
      setVerificationId(phoneAuthSnapshot.verificationId)
      if (phoneAuthSnapshot.code){
        setCode(phoneAuthSnapshot.code)
      }
      setConfirm(true)
    })
  }

  async function signInWithPhoneNumberOld() { //deprecated
    setWarning('');

    auth()
      .verifyPhoneNumber(userNum)
      .on(
        'state_changed',
        phoneAuthSnapshot => {
          switch (phoneAuthSnapshot.state) {
            case auth.PhoneAuthState.CODE_SENT:
              console.log('code sent', phoneAuthSnapshot);
              confirmResult => console.log(confirmResult);

              // on ios this is the final phone auth state event you'd receive
              // so you'd then ask for user input of the code and build a credential from it
              // as demonstrated in the `signInWithPhoneNumber` example above
              break;
            case auth.PhoneAuthState.ERROR: // or 'error'
              console.log('verification error', phoneAuthSnapshot);
              // console.log(phoneAuthSnapshot.ERROR);
              setWarning(phoneAuthSnapshot.error.toString());
              break;
          }
        },
        error => {
          // optionalErrorCb would be same logic as the ERROR case above,  if you've already handed
          // the ERROR case in the above observer then there's no need to handle it here
          console.log(error, '-0--', error.verificationId);

          setWarning(error.toString() + ' id: ' + error.verificationId);

          // verificationId is attached to error if required
        },
        phoneAuthSnapshot => {
          phoneAuthSnapshot.state == 'timeout'
            ? setWarning(
                "Request timed out: Can't use OTP from someone elses phone !",
              )
            : setConfirm(true);
          setOtp(phoneAuthSnapshot.code);
          // optionalCompleteCb would be same logic as the AUTO_VERIFIED/CODE_SENT switch cases above
          // depending on the platform. If you've already handled those cases in the observer then
          // there's absolutely no need to handle it here.

          // Platform specific logic:
          // - if this is on IOS then phoneAuthSnapshot.code will always be null
          // - if ANDROID auto verified the sms code then phoneAuthSnapshot.code will contain the verified sms code
          //   and there'd be no need to ask for user input of the code - proceed to credential creating logic
          // - if ANDROID auto verify timed out then phoneAuthSnapshot.code would be null, just like ios, you'd
          //   continue with user input logic.
          console.log('phoneAuthSnapshot', phoneAuthSnapshot);
        },
      );
    // const confirmation = await auth().signInWithPhoneNumber(userNum,true);
    // setConfirm(confirmation);
  }

  async function confirmCode() { //deprecated
    if (code === otp) {
      setWarning('Success!!');
      setUser({phoneNumber: userNum});
    }
    // try {
    //   await confirm.confirm(code)
    //   setWarning("Success!!")
    //   // setUser({phoneNumber:userNum})
    //   setUserNum('')
    // } catch (error) {
    //   setWarning(error.toString())
    //   setCode('')
    //   console.log('Invalid code.');
    // }
  }

  // Handle user state changes
  function onAuthStateChanged(user) {
    console.log('setting user', user);
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
        <Text style={[styles.sectionTitle, styles.sectionContainer]}>
          Welcome {user.phoneNumber}
        </Text>
        {/* <Text
        style={[styles.sectionDescription,styles.sectionContainer]}
        >
          Your UID is: {user.uid}
        </Text> */}
        <Button title="Log out" onPress={logOut} />
      </View>
    );
  }

  if (!confirm) {
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <KeyboardAvoidingView
          behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
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
            <Text style={styles.sectionDescription}>{warning}</Text>
            <View style={styles.sectionContainer}>
              <Button onPress={signInWithPhoneNumber} title="Send text" />
            </View>
          </View>
        </KeyboardAvoidingView>
      </>
    );
  }

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
        style={styles.scrollView}>
        <View style={styles.body}>
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Please Enter code</Text>
            <TextInput
              value={code}
              onChangeText={setCode}
              style={styles.addBorder}
              textContentType="oneTimeCode"
            />
          </View>
          <Text style={[styles.sectionDescription, styles.sectionContainer]}>
            If your number is used with this phone, we will auto detect code.
            Thank you
          </Text>
          <View style={styles.sectionContainer}>
            <Button onPress={codeInputSubmitted} title="Confirm Code" />
            <Text style={styles.sectionDescription}>{warning}</Text>
            <Button title="Go back" color="red" onPress={logOut} />
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
    margin: 15,
    padding: 10,
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
