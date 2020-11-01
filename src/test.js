/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect,useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TextInput,
  Button,
  TouchableOpacity
} from 'react-native';
import firestore from "@react-native-firebase/firestore"
import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

const App: () => React$Node = () => {
  const [users,setUsers]=useState([])
  const [userName,setUserName]=useState('')
  const [userNum,setUserNum]=useState(null)
  function onUserClick(id) {
    console.log(id)
    // Create a reference to the post
    const userReference = firestore().doc(`users/${id}`);
  
    return firestore().runTransaction(async transaction => {
      // Get post data first
      const userSnapshot = await transaction.get(userReference);
  
      if (!userSnapshot.exists) {
        throw 'user does not exist!';
      }
  
      await transaction.update(userReference, {
        num: userSnapshot.data().num + 1,
      })
    });
  }
  function deleteUser(id){
    firestore().collection('users').doc(id).delete().then(()=>console.log("deleted",id))
  }
  function addUser(){
    let subData={
      name:userName,num: parseInt(userNum) ,address:{
        home: `${userName} home`,
        road: `${userNum} road`
      }
    }
    setUserName('')
    setUserNum(null)
    console.log(subData)
    firestore().collection('users').add(subData).then(u=>console.log("added "))
  }
  async function loadData (){
    // const userDocuments =  await firestore().collection('users').doc("2I4Bsua7QM8RTR0PPYUc").onSnapshot(data=>{setUser(data.data())})
    // console.log(userDocuments)
    firestore().collection("users")
    .onSnapshot(datas=>{
      console.log(datas.size," users found")
      let arr=[]
      datas.forEach(data=>{
        arr.push({
          id: data.id,...data.data()
        })
        console.log(data.id,":-", data.data())
      })
      setUsers(arr)
      // console.log(users)

    })
    // .get()
    // .then(datas=>{
    //   datas.forEach(data=>{
    //     console.log(data.data())
    //   })
    // })
  }
  useEffect(()=>{
    loadData()
  },[])
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
            <View>
              <TextInput
              value={userName}
              onChangeText={value=> setUserName(value)}
              />
              <TextInput
              keyboardType='number-pad'
              value={userNum}
              onChangeText={value=> setUserNum(value)}
              />
              <Button
              title="Add user"
              onPress={addUser}
              />
            </View>
          {global.HermesInternal == null ? null : (
            <View style={styles.engine}>
              <Text style={styles.footer}>Engine: Hermes</Text>
            </View>
          )}{
            // console.log("----", users)
          }
          {
            users.map(user=>
              <View style={styles.body}
              key={user.id}
              >
                <View
                style={styles.sectionContainer}
                >
                <TouchableOpacity
                onPress={()=>deleteUser(user.id)}
                >
                  <Text style={styles.sectionTitle}
                >
                  {user.id}
                </Text>
                </TouchableOpacity>
                
                <Text style={styles.sectionDescription}>
                  {user.name}
                </Text>
                <TouchableOpacity
                onPress={()=>onUserClick(user.id)}>
                <Text style={styles.sectionDescription}>
                  {user.num}
                </Text>
                </TouchableOpacity>
                
                <Text style={styles.sectionDescription}>
                  {user.address.home}
                </Text>
                <Text style={styles.sectionDescription}>
                  {user.address.road}
                </Text>
                </View>
              </View>
              )
          }
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
