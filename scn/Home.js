import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Alert, Image, Linking, Modal, PermissionsAndroid, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import Geolocation from 'react-native-geolocation-service'
import { AppOpenAd, BannerAdSize, GAMBannerAd, InterstitialAd } from 'react-native-google-mobile-ads'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import MapView from 'react-native-map-clustering'
import { mapStyle } from 'Saimai/mapStyle'
import AsyncStorage from '@react-native-async-storage/async-storage'
import auth from '@react-native-firebase/auth'
import database from '@react-native-firebase/database'
import messaging from '@react-native-firebase/messaging'

function NoAuth() {
  const [initializing, setInitializing] = useState(true)
  const [user, setUser] = useState()
  function onAuthStateChanged(user) {
    setUser(user)
    if (initializing) {
      setInitializing(false)
    }
  }
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged)
    return subscriber
  }, [])
  if (initializing) {
    return null
  }
  if (!user) {
    return true
  }
}
const getFcmToken = async() => {
  let checkToken = await AsyncStorage.getItem('fcmToken')
  if (!checkToken) {
    try {
      const fcmToken = await messaging().getToken()
      if (fcmToken) {
        await AsyncStorage.setItem('fcmToken', fcmToken)
      }
    } catch(error) {
      console.error(error)
    }
  }
}
async function RequestUserPermissioniOS() {
  const authStatus = await messaging().requestPermission()
  const enabled = authStatus == messaging.AuthorizationStatus.AUTHORIZED || authStatus == messaging.AuthorizationStatus.PROVISIONAL
  if (enabled) {
    getFcmToken()
  }
}
async function RequestUserPermissionAndroid() {
  const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS)
  if (granted == PermissionsAndroid.RESULTS.GRANTED) {
    getFcmToken()
  }
}

const Home = ({navigation}) => {
  const [coordinates, setCoordinates] = useState([])
  const [loading, setLoading] = useState(true)
  const appOpenAdUnitId = Platform.OS == 'ios' ? 'ca-app-pub-8757434016538668/9851436995' : 'ca-app-pub-8757434016538668/5984026946'
  const appOpenAd = AppOpenAd.createForAdRequest(appOpenAdUnitId)
  const [screenCoordinate, setScreenCoordinate] = useState({ lat: 13.7649, lng: 100.5383 })
  const interstitialAdUnitId = Platform.OS == 'ios' ? 'ca-app-pub-8757434016538668/8554349967' : 'ca-app-pub-8757434016538668/3275200609'
  const interstitialAd = InterstitialAd.createForAdRequest(interstitialAdUnitId)
  const [pinCoordinate, setPinCoordinate] = useState({ lat: -90, lng: 0 })
  const [earthButtonClicked, setEarthButtonClicked] = useState(true)
  const [poopButtonClicked, setPoopButtonClicked] = useState(false)
  const [profileButtonClicked, setProfileButtonClicked] = useState(false)
  const [modalBlockCheck, setModalBlockCheck] = useState(false)
  const [creatorId, setCreatorId] = useState()
  const [toiletDirectory, setToiletDirectory] = useState()
  const [modalToiletInformations, setModalToiletInformations] = useState(false)
  const [toiletInformationsTitle, setToiletInformationsTitle] = useState()
  const [toiletInformationsDescription, setToiletInformationsDescription] = useState()
  const [isCreator, setIsCreator] = useState(false)
  const [modalProfileInformations, setModalProfileInformations] = useState(false)
  const [profileInformationsUsername, setProfileInformationsUsername] = useState()
  const [profileInformationsBiography, setProfileInformationsBiography] = useState()
  const [displayUnblockButton, setDisplayUnblockButton] = useState(false)
  const [displayBlockButton, setDisplayBlockButton] = useState(true)
  const [modalToiletRatings, setModalToiletRatings] = useState(false)
  const [titleRatingsAverage, setTitleRatingsAverage] = useState()
  const [titleRatingsReviews, setTitleRatingsReviews] = useState()
  const [toiletRatingsAverage, setToiletRatingsAverage] = useState()
  const [toiletRatingsReviews, setToiletRatingsReviews] = useState()
  const [displayReviewButtons, setDisplayReviewButtons] = useState(false)
  const [modalToiletCreate, setModalToiletCreate] = useState(false)
  const [toiletCreateTitle, setToiletCreateTitle] = useState()
  const [toiletCreateDescription, setToiletCreateDescription] = useState()
  const [fieldRequired, setFieldRequired] = useState(false)
  const [repetitivePin, setRepetitivePin] = useState(false)
  const [modalProfileCreate, setModalProfileCreate] = useState(false)
  const [profileCreateUsername, setProfileCreateUsername] = useState()
  const [profileCreateBiography, setProfileCreateBiography] = useState()
  const [modalLogout, setModalLogout] = useState(false)
  const [modalDeleteAccount, setModalDeleteAccount] = useState(false)
  const bannerAdUnitId = Platform.OS == 'ios' ? 'ca-app-pub-8757434016538668/8060623427' : 'ca-app-pub-8757434016538668/5720620290'
  if (NoAuth()) {
    navigation.navigate('login')
  }
  useEffect(() => {
    Geolocation.getCurrentPosition(cdn => {
        setScreenCoordinate({ lat: cdn.coords.latitude, lng: cdn.coords.longitude })
      }, error => {
        console.error(error)
      }, {
        enableHighAccuracy: true
      }
    )
    if (Platform.OS == 'ios') {
      RequestUserPermissioniOS()
    } else {
      RequestUserPermissionAndroid()
    }
    database().ref('COORDINATES').once('value', function(snapshot) {
      const locations = snapshot.val()
      if (locations) {
        const coordinatesArray = Object.values(locations)
        setCoordinates(coordinatesArray)
      }
      setLoading(false)
    })
    appOpenAd.load()
    setTimeout(() => {
      try {
        appOpenAd.show()
      } catch(error) {
        console.error(error)
      }
    }, 5000)
  }, [])
  const handlePlaceSelect = details => {
    const placeId = details.place_id
    fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=***************************************`)
      .then(response => response.json())
      .then(data => {
        setScreenCoordinate({ lat: data.result.geometry.location.lat, lng: data.result.geometry.location.lng })
      })
      .catch(error => {
        console.error(error)
      })
    interstitialAd.load()
    setTimeout(() => {
      Alert.alert('Ad Loading', 'The ad will appear in a moment', [
        {
          text: 'OK'
        }
      ])
    }, 2000)
    setTimeout(() => {
      try {
        interstitialAd.show()
      } catch(error) {
        console.error(error)
      }
    }, 5000)
  }

  return (
    <View style={{
      flex: 1
    }}>
      <MapView style={StyleSheet.absoluteFill}
        clusterColor='violet'
        region={{ latitude: screenCoordinate.lat, longitude: screenCoordinate.lng, latitudeDelta: 0.01, longitudeDelta: 0.01 }}
        provider={PROVIDER_GOOGLE}
        mapType={earthButtonClicked ? 'standard' : 'hybrid'}
        customMapStyle={mapStyle}
        showsUserLocation={true}
        showsMyLocationButton={false}
        showsCompass={false}
        onPress={e => {
          if (poopButtonClicked) {
            setPinCoordinate({ lat: e.nativeEvent.coordinate.latitude, lng: e.nativeEvent.coordinate.longitude })
            setModalToiletCreate(true)
            setToiletCreateTitle('')
            setToiletCreateDescription('')
            setFieldRequired(false)
            if (repetitivePin) {
              setRepetitivePin(false)
            }
          }
        }}
      >
        {coordinates.map((coordinate, index) => (
          <Marker style={{
            width: 44,
            height: 44
          }}
            pinColor='violet'
            coordinate={{ latitude: coordinate.LATITUDE, longitude: coordinate.LONGITUDE }}
            key={index}
            onPress={() => {
              if (!poopButtonClicked) {
                setModalBlockCheck(true)
                database().ref('TOILETS/' + coordinate.LATITUDE.toString().replace('.', '_') + 'x' + coordinate.LONGITUDE.toString().replace('.', '_')).once('value', function(snapshot) {
                  setCreatorId(snapshot.val().CREATOR)
                })
                setToiletDirectory(coordinate.LATITUDE.toString().replace('.', '_') + 'x' + coordinate.LONGITUDE.toString().replace('.', '_'))
              } else {
                setRepetitivePin(true)
              }
            }}
          />
        ))}
        <Marker style={{
          width: 44,
          height: 44
        }}
          pinColor='violet'
          coordinate={{ latitude: pinCoordinate.lat, longitude: pinCoordinate.lng }}
        />
      </MapView>
      <View style={{
        paddingHorizontal: 14
      }}>
        <View style={{
          alignSelf: 'center',
          flexDirection: 'row',
          width: '100%',
          maxWidth: 400,
          paddingTop: 60
        }}>
          <View style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            marginTop: 60,
            borderRadius: 22,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5
          }}/>
          <GooglePlacesAutocomplete styles={{
            textInputContainer: {
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2
              },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 5
            },
            textInput: {
              paddingLeft: 36,
              borderRadius: 22
            },
            listView: {
              borderRadius: 22
            }
          }}
            placeholder='Search'
            query={{
              key: '***************************************',
              language: 'en'
            }}
            onPress={details => handlePlaceSelect(details)}
          />
          <Text style={{
            position: 'absolute',
            fontSize: 16,
            top: 72.5,
            left: 9
          }}>
            🔎
          </Text>
        </View>
      </View>
      <View style={{
        position: 'absolute',
        alignSelf: 'center',
        flexDirection: 'row',
        width: 174,
        height: 64,
        bottom: 72,
        backgroundColor: '#f5f5f7',
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
      }}>
        <View style={{
          flex: 1
        }}>
          <TouchableOpacity style={{
            position: 'absolute',
            width: 48,
            height: 48,
            left: 8,
            bottom: 8,
            backgroundColor: earthButtonClicked ? '#1d1d1f' : '#ffffff',
            borderRadius: 8,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5
          }}
            activeOpacity={0.5}
            onPress={() => {
              if (!earthButtonClicked) {
                setEarthButtonClicked(true)
              } else {
                setEarthButtonClicked(false)
              }
              setPoopButtonClicked(false)
            }}
          >
            <Image style={{
              position: 'absolute',
              width: 30,
              height: 30,
              right: 9,
              bottom: 9
            }}
              Image source={require('Saimai/img/image_07.png')}
            />
          </TouchableOpacity>
        </View>
        <View style={{
          flex: 1
        }}>
          <TouchableOpacity style={{
            position: 'absolute',
            alignSelf: 'center',
            width: 48,
            height: 48,
            bottom: 8,
            backgroundColor: poopButtonClicked ? '#1d1d1f' : '#ffffff',
            borderRadius: 8,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5
          }}
            activeOpacity={0.5}
            onPress={() => {
              if (!poopButtonClicked) {
                setPoopButtonClicked(true)
              } else {
                setPoopButtonClicked(false)
              }
            }}
          >
            <Image style={{
              position: 'absolute',
              width: 56,
              height: 56,
              right: -4,
              bottom: -4
            }}
              Image source={require('Saimai/img/image_08.png')}
            />
          </TouchableOpacity>
        </View>
        <View style={{
          flex: 1
        }}>
          <TouchableOpacity style={{
            position: 'absolute',
            width: 48,
            height: 48,
            right: 8,
            bottom: 8,
            backgroundColor: profileButtonClicked ? '#1d1d1f' : '#ffffff',
            borderRadius: 8,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5
          }}
            activeOpacity={0.5}
            onPress={() => {
              setProfileButtonClicked(true)
              setModalProfileCreate(true)
              database().ref('USERS/' + auth().currentUser.uid + '/INFORMATIONS').once('value', function(snapshot) {
                setProfileCreateUsername(snapshot.val().USERNAME)
                setProfileCreateBiography(snapshot.val().BIOGRAPHY)
              })
              setPoopButtonClicked(false)
              setFieldRequired(false)
            }}
          >
            <Image style={{
              position: 'absolute',
              width: 36,
              height: 36,
              right: 6,
              bottom: 6
            }}
              Image source={require('Saimai/img/image_09.png')}
            />
          </TouchableOpacity>
        </View>
      </View>
      <Modal
        animationType='slide'
        transparent={true}
        visible={modalBlockCheck}
      >
        <View style={{
          paddingHorizontal: 16
        }}>
          <View style={{
            alignSelf: 'center',
            width: '100%',
            maxWidth: 398,
            height: 360,
            marginTop: Platform.OS == 'ios' ? 118 : 94,
            padding: 8,
            backgroundColor: '#ffffff',
            borderRadius: 16,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5
          }}>
            <View style={{
              padding: 16
            }}/>
            <Image style={{
              alignSelf: 'center',
              width: 90,
              height: 90,
              top: -12
            }}
              Image source={require('Saimai/img/image_10.png')}
            />
            <View style={{
              alignSelf: 'center',
              justifyContent: 'center',
              width: 240,
              height: 36,
              top: 30
            }}>
              <Text selectable style={{
                alignSelf: 'center',
                fontWeight: 'bold',
                fontSize: 20,
                color: '#1d1d1f'
              }}>
                See info?
              </Text>
            </View>
            <View style={{
              position: 'absolute',
              alignSelf: 'center',
              flexDirection: 'row',
              width: 120,
              height: 64,
              bottom: 72
            }}>
              <View style={{
                flex: 1
              }}>
                <TouchableOpacity style={{
                  position: 'absolute',
                  width: 48,
                  height: 48,
                  left: 8,
                  bottom: 8,
                  backgroundColor: '#ffffff',
                  borderRadius: 8,
                  shadowColor: '#1d1d1f',
                  shadowOffset: {
                    width: 0,
                    height: 2
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 4,
                  elevation: 5
                }}
                  activeOpacity={0.5}
                  onPress={() => setModalBlockCheck(false)}
                >
                  <Image style={{
                    alignSelf: 'center',
                    width: 22,
                    height: 22,
                    top: 13
                  }}
                    Image source={require('Saimai/img/image_13.png')}
                  />
                </TouchableOpacity>
              </View>
              <View style={{
                flex: 1
              }}>
                <TouchableOpacity style={{
                  position: 'absolute',
                  width: 48,
                  height: 48,
                  right: 8,
                  bottom: 8,
                  backgroundColor: '#6bc8a3',
                  borderRadius: 8,
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 2
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 4,
                  elevation: 5
                }}
                  activeOpacity={0.5}
                  onPress={() => {
                    setModalBlockCheck(false)
                    setModalToiletInformations(true)
                    setToiletInformationsTitle('')
                    setToiletInformationsDescription('⏳')
                    setIsCreator(false)
                    setDisplayUnblockButton(false)
                    setDisplayBlockButton(true)
                    database().ref('USERS/' + auth().currentUser.uid + '/BLOCKED/' + creatorId).once('value', function(snapshot) {
                      if (snapshot.val() != null) {
                        setToiletInformationsDescription('You blocked this user')
                        setDisplayUnblockButton(true)
                      } else {
                        database().ref('USERS/' + creatorId + '/BLOCKED/' + auth().currentUser.uid).once('value', function(snapshot) {
                          if (snapshot.val() != null) {
                            setToiletInformationsDescription('This user blocked you')
                            setDisplayBlockButton(false)
                          } else {
                            database().ref('TOILETS/' + toiletDirectory + '/INFORMATIONS').once('value', function(snapshot) {
                              setToiletInformationsTitle(snapshot.val().TITLE)
                              setToiletInformationsDescription(snapshot.val().DESCRIPTION)
                            })
                            if (creatorId == auth().currentUser.uid) {
                              setIsCreator(true)
                            }
                          }
                        })
                      }
                    })
                  }}
                >
                  <Image style={{
                    alignSelf: 'center',
                    width: 28,
                    height: 28,
                    top: 10
                  }}
                    Image source={require('Saimai/img/image_14.png')}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        animationType='slide'
        transparent={true}
        visible={modalToiletInformations}
      >
        <View style={{
          paddingHorizontal: 16
        }}>
          <View style={{
            alignSelf: 'center',
            width: '100%',
            maxWidth: 398,
            height: 360,
            marginTop: Platform.OS == 'ios' ? 118 : 94,
            padding: 8,
            backgroundColor: '#ffffff',
            borderRadius: 16,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5
          }}>
            <View style={{
              padding: 16
            }}>
              <TouchableOpacity style={{
                position: 'absolute',
                width: 48,
                height: 48,
                backgroundColor: '#ffffff',
                borderRadius: 8,
                shadowColor: '#1d1d1f',
                shadowOffset: {
                  width: 0,
                  height: 2
                },
                shadowOpacity: 0.25,
                shadowRadius: 4,
                elevation: 5
              }}
                activeOpacity={0.5}
                onPress={() => setModalToiletInformations(false)}
              >
                <Image style={{
                  alignSelf: 'center',
                  width: 22,
                  height: 22,
                  top: 13
                }}
                  Image source={require('Saimai/img/image_13.png')}
                />
              </TouchableOpacity>
              <TouchableOpacity style={{
                display: isCreator ? 'flex' : 'none',
                position: 'absolute',
                alignSelf: 'flex-end',
                width: 48,
                height: 48,
                backgroundColor: '#ff8b60',
                borderRadius: 8,
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 2
                },
                shadowOpacity: 0.25,
                shadowRadius: 4,
                elevation: 5
              }}
                activeOpacity={0.5}
                onPress={() => {
                  setModalToiletInformations(false)
                  database().ref('COORDINATES/' + toiletDirectory).remove()
                  database().ref('TOILETS/' + toiletDirectory).remove()
                  database().ref('COORDINATES').once('value', function(snapshot) {
                    const locations = snapshot.val()
                    if (locations) {
                      const coordinatesArray = Object.values(locations)
                      setCoordinates(coordinatesArray)
                    }
                  })
                }}
              >
                <Image style={{
                  alignSelf: 'center',
                  width: 24,
                  height: 24,
                  top: 12
                }}
                  Image source={require('Saimai/img/image_15.png')}
                />
              </TouchableOpacity>
              <TouchableOpacity style={{
                display: !isCreator ? 'flex' : 'none',
                position: 'absolute',
                alignSelf: 'flex-end',
                width: 48,
                height: 48,
                backgroundColor: '#ff6961',
                borderRadius: 8,
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 2
                },
                shadowOpacity: 0.25,
                shadowRadius: 4,
                elevation: 5
              }}
                activeOpacity={0.5}
                onPress={() => Linking.openURL('mailto:settasit123@gmail.com?subject=Report%20content&body=To%20report%20the%20content%20or%20user,%20attach%20a%20screenshot.')}
              >
                <Image style={{
                  alignSelf: 'center',
                  width: 24,
                  height: 24,
                  top: 12
                }}
                  Image source={require('Saimai/img/image_16.png')}
                />
              </TouchableOpacity>
            </View>
            <Image style={{
              alignSelf: 'center',
              width: 120,
              height: 120,
              top: -12
            }}
              Image source={require('Saimai/img/image_11.png')}
            />
            <View style={{
              alignSelf: 'center',
              justifyContent: 'center',
              width: 240,
              height: 36,
              top: 0
            }}>
              <Text selectable style={{
                alignSelf: 'center',
                fontWeight: 'bold',
                fontSize: 20,
                color: '#1d1d1f'
              }}>
                {toiletInformationsTitle}
              </Text>
            </View>
            <View style={{
              alignSelf: 'center',
              width: 240,
              height: 90,
              top: 6
            }}>
              <Text selectable style={{
                alignSelf: 'center',
                fontWeight: 'normal',
                fontSize: 16,
                color: '#1d1d1f'
              }}>
                {toiletInformationsDescription}
              </Text>
            </View>
            <View style={{
              padding: 16,
              bottom: -18
            }}>
              <TouchableOpacity style={{
                position: 'absolute',
                width: 48,
                height: 48,
                backgroundColor: '#6bc8a3',
                borderRadius: 8,
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 2
                },
                shadowOpacity: 0.25,
                shadowRadius: 4,
                elevation: 5
              }}
                activeOpacity={0.5}
                onPress={() => {
                  setModalToiletInformations(false)
                  setModalProfileInformations(true)
                  setProfileInformationsUsername('')
                  setProfileInformationsBiography('⏳')
                  database().ref('USERS/' + creatorId + '/INFORMATIONS').once('value', function(snapshot) {
                    setProfileInformationsUsername(snapshot.val().USERNAME)
                    setProfileInformationsBiography(snapshot.val().BIOGRAPHY)
                  })
                }}
              >
                <Image style={{
                  alignSelf: 'center',
                  width: 28,
                  height: 28,
                  top: 10
                }}
                  Image source={require('Saimai/img/image_17.png')}
                />
              </TouchableOpacity>
              <TouchableOpacity style={{
                position: 'absolute',
                alignSelf: 'flex-end',
                width: 48,
                height: 48,
                backgroundColor: '#ffd84c',
                borderRadius: 8,
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 2
                },
                shadowOpacity: 0.25,
                shadowRadius: 4,
                elevation: 5
              }}
                activeOpacity={0.5}
                onPress={() => {
                  setModalToiletInformations(false)
                  setModalToiletRatings(true)
                  setTitleRatingsAverage('')
                  setTitleRatingsReviews('⏳')
                  database().ref('TOILETS/' + toiletDirectory + '/RATINGS').once('value', function(snapshot) {
                    setTitleRatingsAverage(snapshot.val().AVERAGE.toFixed(1))
                    setTitleRatingsReviews(snapshot.val().REVIEWS + ' review(s)')
                    setToiletRatingsAverage(snapshot.val().AVERAGE)
                    setToiletRatingsReviews(snapshot.val().REVIEWS)
                  })
                  database().ref('USERS/' + auth().currentUser.uid + '/REVIEWED/' + toiletDirectory).once('value', function(snapshot) {
                    if (snapshot.val() == null) {
                      setDisplayReviewButtons(true)
                    }
                  })
                }}
              >
                <Image style={{
                  alignSelf: 'center',
                  width: 24,
                  height: 24,
                  top: 12
                }}
                  Image source={require('Saimai/img/image_18.png')}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        animationType='slide'
        transparent={true}
        visible={modalProfileInformations}
      >
        <View style={{
          paddingHorizontal: 16
        }}>
          <View style={{
            alignSelf: 'center',
            width: '100%',
            maxWidth: 398,
            height: 360,
            marginTop: Platform.OS == 'ios' ? 118 : 94,
            padding: 8,
            backgroundColor: '#ffffff',
            borderRadius: 16,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5
          }}>
            <View style={{
              padding: 16
            }}>
              <TouchableOpacity style={{
                position: 'absolute',
                width: 48,
                height: 48,
                backgroundColor: '#ffffff',
                borderRadius: 8,
                shadowColor: '#1d1d1f',
                shadowOffset: {
                  width: 0,
                  height: 2
                },
                shadowOpacity: 0.25,
                shadowRadius: 4,
                elevation: 5
              }}
                activeOpacity={0.5}
                onPress={() => setModalProfileInformations(false)}
              >
                <Image style={{
                  alignSelf: 'center',
                  width: 22,
                  height: 22,
                  top: 13
                }}
                  Image source={require('Saimai/img/image_13.png')}
                />
              </TouchableOpacity>
              <TouchableOpacity style={{
                display: !isCreator && displayBlockButton ? 'flex' : 'none',
                position: 'absolute',
                alignSelf: 'flex-end',
                width: 48,
                height: 48,
                right: 54,
                backgroundColor: displayUnblockButton ? '#6bc8a3' : '#ff8b60',
                borderRadius: 8,
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 2
                },
                shadowOpacity: 0.25,
                shadowRadius: 4,
                elevation: 5
              }}
                activeOpacity={0.5}
                onPress={() => {
                  setModalProfileInformations(false)
                  if (displayUnblockButton) {
                    database().ref('USERS/' + auth().currentUser.uid + '/BLOCKED/' + creatorId).remove()
                  } else {
                    database().ref('USERS/' + auth().currentUser.uid + '/BLOCKED/' + creatorId).set({
                      CONSTANT: 1
                    })
                  }
                }}
              >
                <Image style={{
                  alignSelf: 'center',
                  width: 28,
                  height: 28,
                  top: 10
                }}
                  Image source={require('Saimai/img/image_19.png')}
                />
              </TouchableOpacity>
              <TouchableOpacity style={{
                display: !isCreator ? 'flex' : 'none',
                position: 'absolute',
                alignSelf: 'flex-end',
                width: 48,
                height: 48,
                backgroundColor: '#ff6961',
                borderRadius: 8,
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 2
                },
                shadowOpacity: 0.25,
                shadowRadius: 4,
                elevation: 5
              }}
                activeOpacity={0.5}
                onPress={() => Linking.openURL('mailto:settasit123@gmail.com?subject=Report%20user&body=To%20report%20the%20content%20or%20user,%20attach%20a%20screenshot.')}
              >
                <Image style={{
                  alignSelf: 'center',
                  width: 24,
                  height: 24,
                  top: 12
                }}
                  Image source={require('Saimai/img/image_16.png')}
                />
              </TouchableOpacity>
            </View>
            <Image style={{
              alignSelf: 'center',
              width: 90,
              height: 90,
              top: -12
            }}
              Image source={require('Saimai/img/image_09.png')}
            />
            <View style={{
              alignSelf: 'center',
              justifyContent: 'center',
              width: 240,
              height: 36,
              top: 30
            }}>
              <Text selectable style={{
                alignSelf: 'center',
                fontWeight: 'bold',
                fontSize: 20,
                color: '#1d1d1f'
              }}>
                {profileInformationsUsername}
              </Text>
            </View>
            <View style={{
              alignSelf: 'center',
              width: 240,
              height: 90,
              top: 36
            }}>
              <Text selectable style={{
                alignSelf: 'center',
                fontWeight: 'normal',
                fontSize: 16,
                color: '#1d1d1f'
              }}>
                {profileInformationsBiography}
              </Text>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        animationType='slide'
        transparent={true}
        visible={modalToiletRatings}
      >
        <View style={{
          paddingHorizontal: 16
        }}>
          <View style={{
            alignSelf: 'center',
            width: '100%',
            maxWidth: 398,
            height: 360,
            marginTop: Platform.OS == 'ios' ? 118 : 94,
            padding: 8,
            backgroundColor: '#ffffff',
            borderRadius: 16,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5
          }}>
            <View style={{
              padding: 16
            }}>
              <TouchableOpacity style={{
                position: 'absolute',
                width: 48,
                height: 48,
                backgroundColor: '#ffffff',
                borderRadius: 8,
                shadowColor: '#1d1d1f',
                shadowOffset: {
                  width: 0,
                  height: 2
                },
                shadowOpacity: 0.25,
                shadowRadius: 4,
                elevation: 5
              }}
                activeOpacity={0.5}
                onPress={() => {
                  setModalToiletRatings(false)
                  if (displayReviewButtons) {
                    setDisplayReviewButtons(false)
                  }
                }}
              >
                <Image style={{
                  alignSelf: 'center',
                  width: 22,
                  height: 22,
                  top: 13
                }}
                  Image source={require('Saimai/img/image_13.png')}
                />
              </TouchableOpacity>
            </View>
            <Image style={{
              alignSelf: 'center',
              width: 90,
              height: 90,
              top: -12
            }}
              Image source={require('Saimai/img/image_12.png')}
            />
            <View style={{
              alignSelf: 'center',
              justifyContent: 'center',
              width: 240,
              height: 36,
              top: 30
            }}>
              <Text selectable style={{
                display: titleRatingsReviews != '0 review(s)' ? 'flex' : 'none',
                alignSelf: 'center',
                fontWeight: 'bold',
                fontSize: 20,
                color: '#1d1d1f'
              }}>
                {titleRatingsAverage}
              </Text>
            </View>
            <View style={{
              alignSelf: 'center',
              width: 240,
              height: 90,
              top: 36
            }}>
              <Text selectable style={{
                alignSelf: 'center',
                fontWeight: 'normal',
                fontSize: 16,
                color: '#1d1d1f'
              }}>
                {titleRatingsReviews}
              </Text>
            </View>
            <View style={{
              display: displayReviewButtons && !displayUnblockButton && displayBlockButton ? 'flex' : 'none',
              position: 'absolute',
              alignSelf: 'center',
              flexDirection: 'row',
              width: 210,
              height: 44,
              bottom: 36
            }}>
              <View style={{
                flex: 1
              }}>
                <TouchableOpacity style={{
                  position: 'absolute',
                  width: 36,
                  height: 36,
                  left: 5,
                  bottom: 4,
                  backgroundColor: '#ff8b60',
                  borderRadius: 6,
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 2
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 4,
                  elevation: 5
                }}
                  activeOpacity={0.5}
                  onPress={() => {
                    setModalToiletRatings(false)
                    setDisplayReviewButtons(false)
                    database().ref('USERS/' + auth().currentUser.uid + '/REVIEWED/' + toiletDirectory).set({
                      CONSTANT: 1
                    })
                    database().ref('TOILETS/' + toiletDirectory + '/RATINGS').set({
                      AVERAGE: ((toiletRatingsAverage * toiletRatingsReviews) + 1) / (toiletRatingsReviews + 1),
                      REVIEWS: toiletRatingsReviews + 1
                    })
                  }}
                >
                  <Text style={{
                    alignSelf: 'center',
                    top: 8,
                    fontWeight: 'bold',
                    fontSize: 16,
                    color: '#ffffff'
                  }}>
                    1
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{
                flex: 1
              }}>
                <TouchableOpacity style={{
                  position: 'absolute',
                  width: 36,
                  height: 36,
                  left: 5,
                  bottom: 4,
                  backgroundColor: '#ffb246',
                  borderRadius: 6,
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 2
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 4,
                  elevation: 5
                }}
                  activeOpacity={0.5}
                  onPress={() => {
                    setModalToiletRatings(false)
                    setDisplayReviewButtons(false)
                    database().ref('USERS/' + auth().currentUser.uid + '/REVIEWED/' + toiletDirectory).set({
                      CONSTANT: 1
                    })
                    database().ref('TOILETS/' + toiletDirectory + '/RATINGS').set({
                      AVERAGE: ((toiletRatingsAverage * toiletRatingsReviews) + 2) / (toiletRatingsReviews + 1),
                      REVIEWS: toiletRatingsReviews + 1
                    })
                  }}
                >
                  <Text style={{
                    alignSelf: 'center',
                    top: 8,
                    fontWeight: 'bold',
                    fontSize: 16,
                    color: '#ffffff'
                  }}>
                    2
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{
                flex: 1,
                padding: 3
              }}>
                <TouchableOpacity style={{
                  position: 'absolute',
                  alignSelf: 'center',
                  width: 36,
                  height: 36,
                  bottom: 4,
                  backgroundColor: '#ffd84c',
                  borderRadius: 6,
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 2
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 4,
                  elevation: 5
                }}
                  activeOpacity={0.5}
                  onPress={() => {
                    setModalToiletRatings(false)
                    setDisplayReviewButtons(false)
                    database().ref('USERS/' + auth().currentUser.uid + '/REVIEWED/' + toiletDirectory).set({
                      CONSTANT: 1
                    })
                    database().ref('TOILETS/' + toiletDirectory + '/RATINGS').set({
                      AVERAGE: ((toiletRatingsAverage * toiletRatingsReviews) + 3) / (toiletRatingsReviews + 1),
                      REVIEWS: toiletRatingsReviews + 1
                    })
                  }}
                >
                  <Text style={{
                    alignSelf: 'center',
                    top: 8,
                    fontWeight: 'bold',
                    fontSize: 16,
                    color: '#ffffff'
                  }}>
                    3
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{
                flex: 1
              }}>
                <TouchableOpacity style={{
                  position: 'absolute',
                  width: 36,
                  height: 36,
                  right: 5,
                  bottom: 4,
                  backgroundColor: '#a9d78c',
                  borderRadius: 6,
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 2
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 4,
                  elevation: 5
                }}
                  activeOpacity={0.5}
                  onPress={() => {
                    setModalToiletRatings(false)
                    setDisplayReviewButtons(false)
                    database().ref('USERS/' + auth().currentUser.uid + '/REVIEWED/' + toiletDirectory).set({
                      CONSTANT: 1
                    })
                    database().ref('TOILETS/' + toiletDirectory + '/RATINGS').set({
                      AVERAGE: ((toiletRatingsAverage * toiletRatingsReviews) + 4) / (toiletRatingsReviews + 1),
                      REVIEWS: toiletRatingsReviews + 1
                    })
                  }}
                >
                  <Text style={{
                    alignSelf: 'center',
                    top: 8,
                    fontWeight: 'bold',
                    fontSize: 16,
                    color: '#ffffff'
                  }}>
                    4
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{
                flex: 1
              }}>
                <TouchableOpacity style={{
                  position: 'absolute',
                  width: 36,
                  height: 36,
                  right: 5,
                  bottom: 4,
                  backgroundColor: '#6bc8a3',
                  borderRadius: 6,
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 2
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 4,
                  elevation: 5
                }}
                  activeOpacity={0.5}
                  onPress={() => {
                    setModalToiletRatings(false)
                    setDisplayReviewButtons(false)
                    database().ref('USERS/' + auth().currentUser.uid + '/REVIEWED/' + toiletDirectory).set({
                      CONSTANT: 1
                    })
                    database().ref('TOILETS/' + toiletDirectory + '/RATINGS').set({
                      AVERAGE: ((toiletRatingsAverage * toiletRatingsReviews) + 5) / (toiletRatingsReviews + 1),
                      REVIEWS: toiletRatingsReviews + 1
                    })
                  }}
                >
                  <Text style={{
                    alignSelf: 'center',
                    top: 8,
                    fontWeight: 'bold',
                    fontSize: 16,
                    color: '#ffffff'
                  }}>
                    5
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        animationType='slide'
        transparent={true}
        visible={modalToiletCreate}
      >
        <View style={{
          paddingHorizontal: 16
        }}>
          <View style={{
            alignSelf: 'center',
            width: '100%',
            maxWidth: 398,
            height: 360,
            marginTop: Platform.OS == 'ios' ? 118 : 94,
            padding: 8,
            backgroundColor: '#ffffff',
            borderRadius: 16,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5
          }}>
            <View style={{
              padding: 16
            }}>
              <TouchableOpacity style={{
                position: 'absolute',
                width: 48,
                height: 48,
                backgroundColor: '#ffffff',
                borderRadius: 8,
                shadowColor: '#1d1d1f',
                shadowOffset: {
                  width: 0,
                  height: 2
                },
                shadowOpacity: 0.25,
                shadowRadius: 4,
                elevation: 5
              }}
                activeOpacity={0.5}
                onPress={() => {
                  setModalToiletCreate(false)
                  setPoopButtonClicked(false)
                  setPinCoordinate({ lat: -90, lng: 0 })
                  if (repetitivePin) {
                    setRepetitivePin(false)
                  }
                }}
              >
                <Image style={{
                  alignSelf: 'center',
                  width: 22,
                  height: 22,
                  top: 13
                }}
                  Image source={require('Saimai/img/image_13.png')}
                />
              </TouchableOpacity>
              <TouchableOpacity style={{
                position: 'absolute',
                alignSelf: 'flex-end',
                width: 48,
                height: 48,
                backgroundColor: '#6bc8a3',
                borderRadius: 8,
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 2
                },
                shadowOpacity: 0.25,
                shadowRadius: 4,
                elevation: 5
              }}
                activeOpacity={0.5}
                onPress={() => {
                  if (toiletCreateTitle.replace(/\s/g, '') != '') {
                    setModalToiletCreate(false)
                    setPoopButtonClicked(false)
                    setPinCoordinate({ lat: -90, lng: 0 })
                    if (!repetitivePin) {
                      database().ref('COORDINATES/' + pinCoordinate.lat.toString().replace('.', '_') + 'x' + pinCoordinate.lng.toString().replace('.', '_')).set({
                        LATITUDE: pinCoordinate.lat,
                        LONGITUDE: pinCoordinate.lng
                      })
                      database().ref('COORDINATES').once('value', function(snapshot) {
                        const locations = snapshot.val()
                        if (locations) {
                          const coordinatesArray = Object.values(locations)
                          setCoordinates(coordinatesArray)
                        }
                      })
                      database().ref('TOILETS/' + pinCoordinate.lat.toString().replace('.', '_') + 'x' + pinCoordinate.lng.toString().replace('.', '_')).set({
                        CREATOR: auth().currentUser.uid,
                        INFORMATIONS: { DESCRIPTION: toiletCreateDescription, TITLE: toiletCreateTitle },
                        RATINGS: { AVERAGE: 0, REVIEWS: 0 }
                      })
                    } else {
                      setRepetitivePin(false)
                    }
                  } else {
                    setFieldRequired(true)
                  }
                }}
              >
                <Image style={{
                  alignSelf: 'center',
                  width: 28,
                  height: 28,
                  top: 10
                }}
                  Image source={require('Saimai/img/image_14.png')}
                />
              </TouchableOpacity>
            </View>
            <Image style={{
              alignSelf: 'center',
              width: 120,
              height: 120,
              top: -12
            }}
              Image source={require('Saimai/img/image_08.png')}
            />
            <View style={{
              alignSelf: 'center',
              justifyContent: 'center',
              width: 240,
              height: 36,
              top: 0,
              borderColor: fieldRequired ? '#ff605c' : '#cccccc',
              borderWidth: 1,
              borderRadius: 8
            }}>
              <TextInput style={{
                padding: 6,
                fontSize: 16,
                color: '#1d1d1f'
              }}
                labelValue={toiletCreateTitle}
                onChangeText={addTitle => setToiletCreateTitle(addTitle)}
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
              borderRadius: 8
            }}>
              <TextInput style={{
                padding: 6,
                fontSize: 16,
                color: '#1d1d1f'
              }}
                labelValue={toiletCreateDescription}
                onChangeText={addDescription => setToiletCreateDescription(addDescription)}
                placeholder='Description'
                placeholderTextColor='darkgrey'
                multiline
                maxLength={84}
              />
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        animationType='slide'
        transparent={true}
        visible={modalProfileCreate}
      >
        <View style={{
          paddingHorizontal: 16
        }}>
          <View style={{
            alignSelf: 'center',
            width: '100%',
            maxWidth: 398,
            height: 360,
            marginTop: Platform.OS == 'ios' ? 118 : 94,
            padding: 8,
            backgroundColor: '#ffffff',
            borderRadius: 16,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5
          }}>
            <View style={{
              padding: 16
            }}>
              <TouchableOpacity style={{
                position: 'absolute',
                width: 48,
                height: 48,
                backgroundColor: '#ffffff',
                borderRadius: 8,
                shadowColor: '#1d1d1f',
                shadowOffset: {
                  width: 0,
                  height: 2
                },
                shadowOpacity: 0.25,
                shadowRadius: 4,
                elevation: 5
              }}
                activeOpacity={0.5}
                onPress={() => {
                  setModalProfileCreate(false)
                  setProfileButtonClicked(false)
                  setProfileCreateUsername('')
                  setProfileCreateBiography('')
                }}
              >
                <Image style={{
                  alignSelf: 'center',
                  width: 22,
                  height: 22,
                  top: 13
                }}
                  Image source={require('Saimai/img/image_13.png')}
                />
              </TouchableOpacity>
              <TouchableOpacity style={{
                position: 'absolute',
                alignSelf: 'flex-end',
                width: 48,
                height: 48,
                backgroundColor: '#6bc8a3',
                borderRadius: 8,
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 2
                },
                shadowOpacity: 0.25,
                shadowRadius: 4,
                elevation: 5
              }}
                activeOpacity={0.5}
                onPress={() => {
                  if (profileCreateUsername.replace(/\s/g, '') != '') {
                    setModalProfileCreate(false)
                    setProfileButtonClicked(false)
                    database().ref('USERS/' + auth().currentUser.uid + '/INFORMATIONS').set({
                      USERNAME: profileCreateUsername,
                      BIOGRAPHY: profileCreateBiography
                    })
                    setProfileCreateUsername('')
                    setProfileCreateBiography('')
                  } else {
                    setFieldRequired(true)
                  }
                }}
              >
                <Image style={{
                  alignSelf: 'center',
                  width: 28,
                  height: 28,
                  top: 10
                }}
                  Image source={require('Saimai/img/image_14.png')}
                />
              </TouchableOpacity>
            </View>
            <Image style={{
              alignSelf: 'center',
              width: 90,
              height: 90,
              top: -12
            }}
              Image source={require('Saimai/img/image_09.png')}
            />
            <View style={{
              alignSelf: 'center',
              justifyContent: 'center',
              width: 240,
              height: 36,
              top: 30,
              borderColor: fieldRequired ? '#ff605c' : '#cccccc',
              borderWidth: 1,
              borderRadius: 8
            }}>
              <TextInput style={{
                padding: 6,
                fontSize: 16,
                color: '#1d1d1f'
              }}
                value={profileCreateUsername}
                labelValue={profileCreateUsername}
                onChangeText={addUsername => setProfileCreateUsername(addUsername)}
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
              borderRadius: 8
            }}>
              <TextInput style={{
                padding: 6,
                fontSize: 16,
                color: '#1d1d1f'
              }}
                value={profileCreateBiography}
                labelValue={profileCreateBiography}
                onChangeText={addBiography => setProfileCreateBiography(addBiography)}
                placeholder='Biography'
                placeholderTextColor='darkgrey'
                multiline
                maxLength={84}
              />
            </View>
            <View style={{
              padding: 16,
              bottom: -48
            }}>
              <TouchableOpacity style={{
                position: 'absolute',
                width: 48,
                height: 48,
                backgroundColor: '#ff8b60',
                borderRadius: 8,
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 2
                },
                shadowOpacity: 0.25,
                shadowRadius: 4,
                elevation: 5
              }}
                activeOpacity={0.5}
                onPress={() => {
                  setModalProfileCreate(false)
                  setModalLogout(true)
                  setProfileCreateUsername('')
                  setProfileCreateBiography('')
                }}
              >
                <Image style={{
                  width: 28,
                  height: 28,
                  left: 8,
                  top: 10
                }}
                  Image source={require('Saimai/img/image_20.png')}
                />
              </TouchableOpacity>
              <TouchableOpacity style={{
                position: 'absolute',
                alignSelf: 'flex-end',
                right: 6,
                bottom: -12
              }}
                onPress={() => {
                  setModalProfileCreate(false)
                  setModalDeleteAccount(true)
                  setProfileCreateUsername('')
                  setProfileCreateBiography('')
                }}
              >
                <Text style={{
                  fontWeight: 'bold',
                  color: '#ff605c'
                }}>
                  Delete account
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        animationType='slide'
        transparent={true}
        visible={modalLogout}
      >
        <View style={{
          paddingHorizontal: 16
        }}>
          <View style={{
            alignSelf: 'center',
            width: '100%',
            maxWidth: 398,
            height: 360,
            marginTop: Platform.OS == 'ios' ? 118 : 94,
            padding: 8,
            backgroundColor: '#ffffff',
            borderRadius: 16,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5
          }}>
            <View style={{
              padding: 16
            }}/>
            <Image style={{
              alignSelf: 'center',
              width: 90,
              height: 90,
              top: -12
            }}
              Image source={require('Saimai/img/image_09.png')}
            />
            <View style={{
              alignSelf: 'center',
              justifyContent: 'center',
              width: 240,
              height: 36,
              top: 30
            }}>
              <Text selectable style={{
                alignSelf: 'center',
                fontWeight: 'bold',
                fontSize: 20,
                color: '#1d1d1f'
              }}>
                Logout?
              </Text>
            </View>
            <View style={{
              position: 'absolute',
              alignSelf: 'center',
              flexDirection: 'row',
              width: 120,
              height: 64,
              bottom: 72
            }}>
              <View style={{
                flex: 1
              }}>
                <TouchableOpacity style={{
                  position: 'absolute',
                  width: 48,
                  height: 48,
                  left: 8,
                  bottom: 8,
                  backgroundColor: '#ffffff',
                  borderRadius: 8,
                  shadowColor: '#1d1d1f',
                  shadowOffset: {
                    width: 0,
                    height: 2
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 4,
                  elevation: 5
                }}
                  activeOpacity={0.5}
                  onPress={() => {
                    setModalLogout(false)
                    setProfileButtonClicked(false)
                  }}
                >
                  <Image style={{
                    alignSelf: 'center',
                    width: 22,
                    height: 22,
                    top: 13
                  }}
                    Image source={require('Saimai/img/image_13.png')}
                  />
                </TouchableOpacity>
              </View>
              <View style={{
                flex: 1
              }}>
                <TouchableOpacity style={{
                  position: 'absolute',
                  width: 48,
                  height: 48,
                  right: 8,
                  bottom: 8,
                  backgroundColor: '#ff8b60',
                  borderRadius: 8,
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 2
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 4,
                  elevation: 5
                }}
                  activeOpacity={0.5}
                  onPress={() => {
                    setModalLogout(false)
                    setProfileButtonClicked(false)
                    setProfileCreateUsername('')
                    setProfileCreateBiography('')
                    auth().signOut()
                    navigation.navigate('login')
                  }}
                >
                  <Image style={{
                    alignSelf: 'center',
                    width: 28,
                    height: 28,
                    top: 10
                  }}
                    Image source={require('Saimai/img/image_14.png')}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        animationType='slide'
        transparent={true}
        visible={modalDeleteAccount}
      >
        <View style={{
          paddingHorizontal: 16
        }}>
          <View style={{
            alignSelf: 'center',
            width: '100%',
            maxWidth: 398,
            height: 360,
            marginTop: Platform.OS == 'ios' ? 118 : 94,
            padding: 8,
            backgroundColor: '#ffffff',
            borderRadius: 16,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5
          }}>
            <View style={{
              padding: 16
            }}/>
            <Image style={{
              alignSelf: 'center',
              width: 90,
              height: 90,
              top: -12
            }}
              Image source={require('Saimai/img/image_09.png')}
            />
            <View style={{
              alignSelf: 'center',
              justifyContent: 'center',
              width: 240,
              height: 36,
              top: 30
            }}>
              <Text selectable style={{
                alignSelf: 'center',
                fontWeight: 'bold',
                fontSize: 20,
                color: '#1d1d1f'
              }}>
                Delete account?
              </Text>
            </View>
            <View style={{
              position: 'absolute',
              alignSelf: 'center',
              flexDirection: 'row',
              width: 120,
              height: 64,
              bottom: 72
            }}>
              <View style={{
                flex: 1
              }}>
                <TouchableOpacity style={{
                  position: 'absolute',
                  width: 48,
                  height: 48,
                  left: 8,
                  bottom: 8,
                  backgroundColor: '#ffffff',
                  borderRadius: 8,
                  shadowColor: '#1d1d1f',
                  shadowOffset: {
                    width: 0,
                    height: 2
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 4,
                  elevation: 5
                }}
                  activeOpacity={0.5}
                  onPress={() => {
                    setModalDeleteAccount(false)
                    setProfileButtonClicked(false)
                  }}
                >
                  <Image style={{
                    alignSelf: 'center',
                    width: 22,
                    height: 22,
                    top: 13
                  }}
                    Image source={require('Saimai/img/image_13.png')}
                  />
                </TouchableOpacity>
              </View>
              <View style={{
                flex: 1
              }}>
                <TouchableOpacity style={{
                  position: 'absolute',
                  width: 48,
                  height: 48,
                  right: 8,
                  bottom: 8,
                  backgroundColor: '#ff6961',
                  borderRadius: 8,
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 2
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 4,
                  elevation: 5
                }}
                  activeOpacity={0.5}
                  onPress={() => {
                    setModalDeleteAccount(false)
                    setProfileButtonClicked(false)
                    auth().currentUser.delete()
                    navigation.navigate('login')
                  }}
                >
                  <Image style={{
                    alignSelf: 'center',
                    width: 28,
                    height: 28,
                    top: 10
                  }}
                    Image source={require('Saimai/img/image_14.png')}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
      <View style={{
        display: loading ? 'flex' : 'none',
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
      }}>
        <ActivityIndicator 
          size='large'
        />
      </View>
      {creatorId != null && (
        <View style={{
          position: 'absolute',
          alignSelf: 'center',
          bottom: 0
        }}>
          <GAMBannerAd
            unitId={bannerAdUnitId}
            sizes={[BannerAdSize.ANCHORED_ADAPTIVE_BANNER]}
          />
        </View>
      )}
    </View>
  )
}

export default Home