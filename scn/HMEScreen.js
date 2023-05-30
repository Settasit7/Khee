import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, TextInput, Modal, Dimensions, Linking } from 'react-native';
import { enableLatestRenderer, PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import MapView from 'react-native-map-clustering';
import Geolocation from 'react-native-geolocation-service';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

import { mapStyle } from 'Saimai/mapStyle';

enableLatestRenderer();
var c = 0

function App() {
  const [initializing, setInitializing] = useState(true)
  const [user, setUser] = useState()

  function onAuthStateChanged(user) {
    setUser(user)
    if (initializing) setInitializing(false)
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  if (initializing) return null

  if (!user) {
    return true
  }
}

const HMEScreen = ({navigation}) => {

  if (App()) {
    navigation.navigate('Lgn')
  }

  const [coordinates, setCoordinates] = useState([])

  const [modalPlaceInfoVisible, setModalPlaceInfoVisible] = useState(false)
  const [selectedTitle, setSelectedTitle] = useState(null)
  const [selectedDetails, setSelectedDetails] = useState(null)

  const [ict, setIct] = useState(false)

  //const [blockedUsers, setBlockedUsers] = useState(new Set())
  
  //useEffect(() => {
  //  database().ref('users/' + auth().currentUser.uid + '/block/').once('child', function(snapshot) {
  //    const blockedList = snapshot.val()
  //    if (blockedList) {
  //      Object.values(blockedList).forEach((item) => {
  //        setBlockedUsers(prev => new Set(prev.add(item)))
  //      })
  //    }
  //  })
  //  console.log(blockedUsers)
  //}, [])

  useEffect(() => {
    database().ref('places').once('value', function(snapshot) {
      const locations = snapshot.val()
      if (locations) {
        const coordinatesArray = Object.values(locations)
        setCoordinates(coordinatesArray)
      }
    })
  }, []);

  const [cdn, setCdn] = useState({ lat: 13.7649, lng: 100.5383 })
  const [pin, setPin] = useState({ lat: -90, lng: 0 })

  if (c == 0) {
    Geolocation.getCurrentPosition(
      (cdn) => {
        setCdn({ lat: cdn.coords.latitude, lng: cdn.coords.longitude })
      }, 
      (error) => {
        console.log(error.code, error.message)
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    )
    database().ref('developer/').once('value', function(snapshot) {
      setAd(snapshot.val().ad)
      setLink(snapshot.val().link)
    })
    c = 1
  }

  const [typ, setTyp] = useState(false)
  const [ipn, setIpn] = useState(false)
  const [ibk, setIbk] = useState(true)
  const [ilk, setIlk] = useState(true)

  const [modalPlaceEditVisible, setModalPlaceEditVisible] = useState(false)
  const [title, setTitle] = useState()
  const [details, setDetails] = useState()

  const [modalUserEditVisible, setModalUserEditVisible] = useState(false)
  const [username, setUsername] = useState()
  const [biography, setBiography] = useState()

  const [modalUserInfoVisible, setModalUserInfoVisible] = useState(false)
  const [selectedUid, setSelectedUid] = useState()
  const [selectedUsername, setSelectedUsername] = useState()
  const [selectedBiography, setSelectedBiography] = useState()
  const [selectedLike, setSelectedLike] = useState()

  const [modalDonateVisible, setModalDonateVisible] = useState(false)
  const [ad, setAd] = useState()
  const [image, setImage] = useState()
  const [link, setLink] = useState()
  const [message, setMessage] = useState()

  return (
    <View style={{
      flex: 1,
    }}>

      <MapView
        clusterColor='violet'
        customMapStyle={mapStyle}
        provider={PROVIDER_GOOGLE}
        style={StyleSheet.absoluteFill}
        showsUserLocation={true}
        showsMyLocationButton={false}
        showsCompass={false}
        region={{
          latitude: cdn.lat,
          longitude: cdn.lng,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        mapType={typ ? 'hybrid' : 'standard' }
        onPress={(e) => {
          if (ipn) {
            setPin({ lat: e.nativeEvent.coordinate.latitude, lng: e.nativeEvent.coordinate.longitude })
            setModalPlaceEditVisible(true)
            setTitle('')
            setDetails('')
            setIpn(false)
          }
        }}
      >

        <Marker style={{
          width: 44, 
          height: 44,
        }}
          pinColor='violet'
          coordinate={{ latitude: pin.lat, longitude: pin.lng }}>
        </Marker>
        
        {coordinates.map((coordinate, index) => (
          //!(blockedUsers.has(coordinate.contributor))&&
          <Marker style={{
            width: 44, 
            height: 44,
          }}
            pinColor='violet'
            key={index}
            coordinate={{ latitude: coordinate.location.latitude, longitude: coordinate.location.longitude}}
            onPress={() => {
              setSelectedTitle(coordinate.title)
              setSelectedDetails(coordinate.details)
              setSelectedUid(coordinate.contributor)
              setSelectedLike(coordinate.like.like)
              if (coordinate.contributor == auth().currentUser.uid) {
                setIct(true)
              }
              database().ref('users/' + coordinate.contributor + '/info').once('value', function(snapshot) {
                setSelectedUsername(snapshot.val().username)
                setSelectedBiography(snapshot.val().biography)
              })
              database().ref('users/' + auth().currentUser.uid + '/block/' + selectedUid).once('value', function(snapshot) {
                if (snapshot.val() != null) {
                  setIbk(true)
                }
                else if (snapshot.val() == null) {
                  database().ref('users/' + selectedUid + '/block/' + auth().currentUser.uid).once('value', function(superSnapshot) {
                    if (superSnapshot.val() != null) {
                      setIbk(true)
                    }
                    else if (superSnapshot.val() == null) {
                      setIbk(false)
                      if (!ibk) {
                        setModalPlaceInfoVisible(true)
                      }
                    }
                  })
                }
              })
              database().ref('users/' + auth().currentUser.uid + '/like/' + selectedUid + selectedTitle + selectedDetails).once('value', function(snapshot) {
                if (snapshot.val() == null) {
                  setIlk(false)
                }
                else {
                  setIlk(true)
                }
              })
            }}>
          </Marker>
        ))}

      </MapView>

      <TouchableOpacity 
        onPress={() => {
          if (link != '0') {
            Linking.openURL(link)
          }
        }}
        style={{
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 4,
          elevation: 5,
        }}>
        <Image style={{
          position: 'absolute',
          alignSelf: 'center',
          width: Dimensions.get('window').width - 32,
          height: (Dimensions.get('window').width - 32) * (50 / 320),
          top: 54,
          borderRadius: 5,
        }} 
          Image source={{uri: ad}}
        />
      </TouchableOpacity>

      <View style={{
        position: 'absolute',
        width: 90,
        height: 90,
        right: 6,
        bottom: 62,
        borderRadius: 45,
        backgroundColor: '#f5f5f7',
        shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 4,
          elevation: 5,
      }}
        pointerEvents="none"
      >
      </View>

      <View style={{
        position: 'absolute',
        width: 34,
        height: 34,
        right: 14,
        bottom: 160,
        borderRadius: 17,
        backgroundColor: '#f5f5f7',
        shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 4,
          elevation: 5,
      }}
        pointerEvents="none"
      >
      </View>

      <View style={{
        position: 'absolute',
        width: 70,
        height: 70,
        right: 8,
        bottom: 192,
        borderRadius: 35,
        backgroundColor: '#f5f5f7',
        shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 4,
          elevation: 5,
      }}
        pointerEvents="none"
      >
      </View>

      <View style={{
        position: 'absolute',
        width: 100,
        height: 100,
        right: 42,
        bottom: 120,
        borderRadius: 50,
        backgroundColor: '#f5f5f7',
        shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 4,
          elevation: 5,
      }}
        pointerEvents="none"
      >
      </View>

      <TouchableOpacity style={{
        position: 'absolute',
        width: 54,
        height: 54,
        right: 16,
        bottom: 200,
        borderRadius: 27,
        backgroundColor: typ ? 'white' : 'black',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
      }} 
        activeOpacity={0.5} 
        onPress={() => {
          if (!typ) {
            setTyp(true);
          }
          else {
            setTyp(false);
          }
        }}
      >
        <Image style={{
          position: 'absolute',
          width: 36,
          height: 36,
          right: 9,
          bottom: 9,
        }} 
          Image source={require('Saimai/img/earth.png')}
        />
      </TouchableOpacity>

      <TouchableOpacity style={{
        position: 'absolute',          
        width: 76,
        height: 76,
        right: 54,
        bottom: 132,
        borderRadius: 38,
        backgroundColor: ipn ? 'black' : 'white',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
      }} 
        activeOpacity={0.5} 
        onPress={() => {
          if (!ipn) {
            setIpn(true);
          }
          else {
            setIpn(false);
          }
        }}
      >
        <Image style={{
          position: 'absolute',
          width: 44,
          height: 44,
          right: 16,
          bottom: 22,
        }} 
          Image source={require('Saimai/img/pin.png')}
        />
      </TouchableOpacity>

      <TouchableOpacity style={{
        position: 'absolute',          
        width: 26,
        height: 26,
        right: 18,
        bottom: 164,
        borderRadius: 13,
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
      }} 
        activeOpacity={0.5} 
        onPress={() => {
          setModalUserEditVisible(true)
          database().ref('users/' + auth().currentUser.uid + '/info').once('value', function(snapshot) {
            setUsername(snapshot.val().username)
            setBiography(snapshot.val().biography)
          })
        }}
      >
        <Image style={{
          position: 'absolute',
          width: 18,
          height: 18,
          right: 4,
          bottom: 4,
        }} 
          Image source={require('Saimai/img/edit.png')}
        />
      </TouchableOpacity>

      <TouchableOpacity style={{
        position: 'absolute',          
        width: 38,
        height: 38,
        right: 32,
        bottom: 88,
        borderRadius: 19,
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
      }} 
        activeOpacity={0.5} 
        onPress={() => {
          setModalDonateVisible(true)
          database().ref('developer/').once('value', function(snapshot) {
            setImage(snapshot.val().image)
            setMessage(snapshot.val().message8)
          })
        }}
      >
        <Image style={{
          position: 'absolute',
          width: 24,
          height: 24,
          left: 7,
          bottom: 7,
        }} 
          Image source={require('Saimai/img/megaphone.png')}
        />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalPlaceEditVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalPlaceEditVisible(false);
        }}>
        <View style={{
          height: 360,
          marginTop: 118,
          marginLeft: 16,
          marginRight: 16,
          borderRadius: 5,
          backgroundColor: 'white',
          padding: 16,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 4,
          elevation: 5,
        }}>
          <View style={{
            padding: 16,
          }}>
            <TouchableOpacity style={{
              position: 'absolute',
              alignSelf: 'flex-start',
            }}
              onPress={() => {
                setModalPlaceEditVisible(false)
                setPin({ lat: -90, lng: 0 })
              }}>
              <Text style={{
                color: '#2e64e5',
              }}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={{
              position: 'absolute',
              alignSelf: 'flex-end',
            }}
              onPress={() => {
                if (title != '' && details != '') {
                  database().ref('places/' + auth().currentUser.uid + title + details).set({
                    location: { latitude: pin.lat, longitude: pin.lng },
                    title: title,
                    details: details,
                    contributor: auth().currentUser.uid,
                    like: { like: 0 },
                  })
                  setPin({ lat: -90, lng: 0 })
                  setModalPlaceEditVisible(false)
                  database().ref('places').once('value', function(snapshot) {
                    const locations = snapshot.val()
                    if (locations) {
                      const coordinatesArray = Object.values(locations)
                      setCoordinates(coordinatesArray)
                    }
                  })
                }
              }}>
              <Text style={{
                fontWeight: 'bold',
                color: '#fc6bb0',
              }}>
                Done
              </Text>
            </TouchableOpacity>
          </View>
          <Image style={{
            alignSelf: 'center',
            width: 120,
            height: 120,
            top: -12,
            borderRadius: 60,
          }}
            Image source={require('Saimai/img/poop.png')}
          />
          <View style={{
            alignSelf: 'center',
            justifyContent: 'center',
            width: 240,
            height: 36,
            top: 0,
            borderColor: '#cccccc',
            borderWidth: 1,
            borderRadius: 5,
          }}>
            <TextInput style={{
              padding: 6,
              fontSize: 16,
              color: '#1d1d1f',
            }}
              labelValue={title}
              onChangeText={(addTitle) => setTitle(addTitle.replace(/\//g, ' '))}
              placeholder='Title'
              placeholderTextColor='darkgrey'
              maxLength={24}
            />
            </View>
            <View style={{
            alignSelf: 'center',
            width: 240,
            height: 90,
            top: 6,
            borderColor: '#cccccc',
            borderWidth: 1,
            borderRadius: 5,
          }}>
            <TextInput style={{
              padding: 6,
              fontSize: 16,
              color: '#1d1d1f',
            }}
              labelValue={details}
              onChangeText={(addDetails) => setDetails(addDetails.replace(/\//g, ' '))}
              placeholder='Details'
              placeholderTextColor='darkgrey'
              multiline
              maxLength={84}
            />
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalPlaceInfoVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalPlaceInfoVisible(false);
        }}>
        <View style={{
          height: 360,
          marginTop: 118,
          marginLeft: 16,
          marginRight: 16,
          borderRadius: 5,
          backgroundColor: 'white',
          padding: 16,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 4,
          elevation: 5,
        }}>
          <View style={{
            padding: 16,
          }}>
            <TouchableOpacity style={{
              position: 'absolute',
              alignSelf: 'flex-start',
            }}
              onPress={() => {
                setModalPlaceInfoVisible(false)
                setIct(false)
                setIbk(true)
              }}>
              <Text style={{
                color: '#2e64e5',
              }}>
                Close
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={{
              display: ict ? 'flex' : 'none',
              position: 'absolute',
              alignSelf: 'flex-end',
            }}
              onPress={() => {
                database().ref('places/' + auth().currentUser.uid + selectedTitle + selectedDetails).set(null)
                setModalPlaceInfoVisible(false)
                setIct(false)
                setIbk(true)
                database().ref('places').once('value', function(snapshot) {
                  const locations = snapshot.val()
                  if (locations) {
                    const coordinatesArray = Object.values(locations)
                    setCoordinates(coordinatesArray)
                  }
                })
              }}>
              <Text style={{
                fontWeight: 'bold',
                color: '#ff605c',
              }}>
                Delete
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={{
              display: ict ? 'none' : 'flex',
              position: 'absolute',
              alignSelf: 'flex-end',
            }}
              onPress={() => {
                Linking.openURL('mailto:settasit123@gmail.com?subject=Report%20content&body=Please%20inform%20user%20UID%20and%20location%20title')
              }}>
              <Text style={{
                fontWeight: 'bold',
                color: '#ff605c',
              }}>
                Report
              </Text>
            </TouchableOpacity>
          </View>
          <Image style={{
            alignSelf: 'center',
            width: 120,
            height: 120,
            top: -12,
            borderRadius: 60,
          }}
            Image source={require('Saimai/img/poop.png')}
          />
          <View style={{
            alignSelf: 'center',
            justifyContent: 'center',
            width: 240,
            height: 36,
            top: 0,
          }}>
            <Text style={{
                alignSelf: 'center',
                fontWeight: 'bold',
                fontSize: 20,
                color: '#1d1d1f',
            }}>
              {selectedTitle}
            </Text>
          </View>
          <View style={{
            alignSelf: 'center',
            width: 240,
            height: 90,
            top: 6,
          }}>
            <Text style={{
                alignSelf: 'center',
                fontWeight: 'normal',
                fontSize: 16,
                color: '#1d1d1f',
            }}>
              {selectedDetails}
            </Text>
          </View>
          <View style={{
            padding: 16,
            bottom: -36,
          }}>
            <Text style={{
              position: 'absolute',
              alignSelf: 'flex-start',
              bottom: 16,
              color: '#1d1d1f',
            }}>
              Contributor:
              <Text> </Text>
              <Text style={{
                fontWeight: 'bold',
                color: '#1d1d1f',
              }}
                onPress={() => {
                  setModalPlaceInfoVisible(false)
                  setModalUserInfoVisible(true)
                  setIbk(true)
                }} 
              >
                {selectedUsername}
              </Text>
            </Text>
            <Text style={{
              position: 'absolute',
              alignSelf: 'flex-end',
              bottom: 16,
              fontWeight: ilk ? 'bold' : 'normal',
              color: '#2e64e5',
            }}
              onPress={() => {
                if (ilk == false) {
                  setIlk(true)
                  database().ref('places/' + selectedUid + selectedTitle + selectedDetails + '/like').set({
                    like: selectedLike + 1,
                  })
                  database().ref('places/' + selectedUid + selectedTitle + selectedDetails + '/like').once('value', function(snapshot) {
                    setSelectedLike(snapshot.val().like)
                  })
                  database().ref('users/' + auth().currentUser.uid + '/like/' + selectedUid + selectedTitle + selectedDetails).set({
                    c: 1,
                  })
                }
                else {
                  setIlk(false)
                  database().ref('places/' + selectedUid + selectedTitle + selectedDetails + '/like').set({
                    like: selectedLike - 1,
                  })
                  database().ref('places/' + selectedUid + selectedTitle + selectedDetails + '/like').once('value', function(snapshot) {
                    setSelectedLike(snapshot.val().like)
                  })
                  database().ref('users/' + auth().currentUser.uid + '/like/' + selectedUid + selectedTitle + selectedDetails).set(null)
                }
                database().ref('places').once('value', function(snapshot) {
                  const locations = snapshot.val()
                  if (locations) {
                    const coordinatesArray = Object.values(locations)
                    setCoordinates(coordinatesArray)
                  }
                })
              }}
            >
              Like:
              <Text> </Text>
              <Text>
                {selectedLike}
              </Text>
            </Text>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalUserEditVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalUserEditVisible(false);
        }}>
        <View style={{
          height: 360,
          marginTop: 118,
          marginLeft: 16,
          marginRight: 16,
          borderRadius: 5,
          backgroundColor: 'white',
          padding: 16,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 4,
          elevation: 5,
        }}>
          <View style={{
            padding: 16,
          }}>
            <TouchableOpacity style={{
              position: 'absolute',
              alignSelf: 'flex-start',
            }}
              onPress={() => {
                setUsername('')
                setBiography('')
                setModalUserEditVisible(false)
              }}>
              <Text style={{
                color: '#2e64e5',
              }}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={{
              position: 'absolute',
              alignSelf: 'flex-end',
            }}
              onPress={() => {
                if (username != '' && biography != '') {
                  database().ref('users/' + auth().currentUser.uid + '/info').set({
                    email: auth().currentUser.email,
                    username: username,
                    biography: biography,
                  })
                  setUsername('')
                  setBiography('')
                  setModalUserEditVisible(false)
                }
              }}>
              <Text style={{
                fontWeight: 'bold',
                color: '#fc6bb0',
              }}>
                Done
              </Text>
            </TouchableOpacity>
          </View>
          <Image style={{
            alignSelf: 'center',
            width: 90,
            height: 90,
            top: -12,
            borderRadius: 60,
          }}
            Image source={require('Saimai/img/user.png')}
          />
          <View style={{
            alignSelf: 'center',
            justifyContent: 'center',
            width: 240,
            height: 36,
            top: 30,
            borderColor: '#cccccc',
            borderWidth: 1,
            borderRadius: 5,
          }}>
            <TextInput style={{
              padding: 6,
              fontSize: 16,
              color: '#1d1d1f',
            }}
              value={username}
              labelValue={username}
              onChangeText={(addUsername) => setUsername(addUsername)}
              placeholder='Username'
              placeholderTextColor='darkgrey'
              maxLength={24}
            />
            </View>
            <View style={{
            alignSelf: 'center',
            width: 240,
            height: 90,
            top: 36,
            borderColor: '#cccccc',
            borderWidth: 1,
            borderRadius: 5,
          }}>
            <TextInput style={{
              padding: 6,
              fontSize: 16,
              color: '#1d1d1f',
            }}
              value={biography}
              labelValue={biography}
              onChangeText={(addBiography) => setBiography(addBiography)}
              placeholder='Biography'
              placeholderTextColor='darkgrey'
              multiline
              maxLength={84}
            />
          </View>
          <View style={{
            padding: 16,
            bottom: -66,
          }}>
            <TouchableOpacity style={{
              position: 'absolute',
              alignSelf: 'flex-start',
            }}
              onPress={() => {
                setUsername('')
                setBiography('')
                setModalUserEditVisible(false)
                auth()
                  .signOut()
                  .then(() => console.log('User signed out!'));
                navigation.navigate('Lgn')
              }}>
              <Text style={{
                color: '#f44336',
              }}>
                Logout
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={{
              position: 'absolute',
              alignSelf: 'flex-end',
            }}
              onPress={() => {
                setUsername('')
                setBiography('')
                setModalUserEditVisible(false)
                navigation.navigate('Lgn')

                auth().currentUser.delete()
              }}>
              <Text style={{
                fontWeight: 'bold',
                color: '#ff605c',
              }}>
                Delete account
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalUserInfoVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalPlaceInfoVisible(false);
        }}>
        <View style={{
          height: 360,
          marginTop: 118,
          marginLeft: 16,
          marginRight: 16,
          borderRadius: 5,
          backgroundColor: 'white',
          padding: 16,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 4,
          elevation: 5,
        }}>
          <View style={{
            padding: 16,
          }}>
            <TouchableOpacity style={{
              position: 'absolute',
              alignSelf: 'flex-start',
            }}
              onPress={() => {
                setModalUserInfoVisible(false)
              }}>
              <Text style={{
                color: '#2e64e5',
              }}>
                Close
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={{
              display: ict ? 'none' : 'flex',
              position: 'absolute',
              alignSelf: 'flex-end',
              right: 54,
            }}
              onPress={() => {
                database().ref('users/' + auth().currentUser.uid + '/block/' + selectedUid).set({
                  c: 1,
                })
                setModalUserInfoVisible(false)
              }}>
              <Text style={{
                fontWeight: 'bold',
                color: '#ff605c',
              }}>
                Block
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={{
              display: ict ? 'none' : 'flex',
              position: 'absolute',
              alignSelf: 'flex-end',
            }}
              onPress={() => {
                Linking.openURL('mailto:settasit123@gmail.com?subject=Report%20user&body=Plase%20inform%20user%20UID')
              }}>
              <Text style={{
                fontWeight: 'bold',
                color: '#ff605c',
              }}>
                Report
              </Text>
            </TouchableOpacity>
          </View>
          <Image style={{
            alignSelf: 'center',
            width: 90,
            height: 90,
            top: -12,
            borderRadius: 60,
          }}
            Image source={require('Saimai/img/user.png')}
          />
          <View style={{
            alignSelf: 'center',
            justifyContent: 'center',
            width: 240,
            height: 36,
            top: 30,
          }}>
            <Text style={{
                alignSelf: 'center',
                fontWeight: 'bold',
                fontSize: 20,
                color: '#1d1d1f',
            }}>
              {selectedUsername}
            </Text>
          </View>
          <View style={{
            alignSelf: 'center',
            width: 240,
            height: 90,
            top: 36,
          }}>
            <Text style={{
                alignSelf: 'center',
                fontWeight: 'normal',
                fontSize: 16,
                color: '#1d1d1f',
            }}>
              {selectedBiography}
            </Text>
          </View>
          <View style={{
            alignSelf: 'center',
            width: 240,
            height: 90,
            top: 36,
          }}>
            <Text style={{
                alignSelf: 'center',
                fontWeight: 'normal',
                fontSize: 12,
                color: '#1d1d1f',
            }}>
              UID: {selectedUid}
            </Text>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalDonateVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalDonateVisible(false);
        }}>
          <View style={{
          height: 420,
          marginTop: 118,
          marginLeft: 16,
          marginRight: 16,
          borderRadius: 5,
          backgroundColor: 'white',
          padding: 16,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 4,
          elevation: 5,
        }}>
          <View style={{
            padding: 16,
          }}>
            <TouchableOpacity style={{
              position: 'absolute',
              alignSelf: 'flex-start',
            }}
              onPress={() => {
                setModalDonateVisible(false)
              }}>
              <Text style={{
                color: '#2e64e5',
              }}>
                Close
              </Text>
            </TouchableOpacity>
          </View>
          <Image style={{
            alignSelf: 'center',
            width: 300,
            height: 300,
            top: -12,
          }}
            Image source={{uri: image}}
          />
          <Text style={{
            alignSelf: 'center',
            fontWeight: 'normal',
            fontSize: 14,
            top: 24,
            color: '#1d1d1f',
          }}>
            {message}
          </Text>
        </View>
      </Modal>
    </View>
  )
}

export default HMEScreen;