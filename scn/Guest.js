import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Alert, Image, Modal, PermissionsAndroid, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Geolocation from 'react-native-geolocation-service'
import { BannerAdSize, GAMBannerAd, InterstitialAd } from 'react-native-google-mobile-ads'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import MapView from 'react-native-map-clustering'
import { mapStyle } from 'Saimai/mapStyle'
import AsyncStorage from '@react-native-async-storage/async-storage'
import database from '@react-native-firebase/database'
import messaging from '@react-native-firebase/messaging'

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

const Guest = () => {
  const [coordinates, setCoordinates] = useState([])
  const [loading, setLoading] = useState(true)
  const [screenCoordinate, setScreenCoordinate] = useState({ lat: 13.7649, lng: 100.5383 })
  const interstitialAdUnitId = Platform.OS == 'ios' ? 'ca-app-pub-8757434016538668/8554349967' : 'ca-app-pub-8757434016538668/3275200609'
  const interstitialAd = InterstitialAd.createForAdRequest(interstitialAdUnitId)
  const [earthButtonClicked, setEarthButtonClicked] = useState(true)
  const [modalBlockCheck, setModalBlockCheck] = useState(false)
  const [creatorId, setCreatorId] = useState()
  const [toiletDirectory, setToiletDirectory] = useState()
  const [modalToiletInformations, setModalToiletInformations] = useState(false)
  const [toiletInformationsTitle, setToiletInformationsTitle] = useState()
  const [toiletInformationsDescription, setToiletInformationsDescription] = useState()
  const [modalProfileInformations, setModalProfileInformations] = useState(false)
  const [profileInformationsUsername, setProfileInformationsUsername] = useState()
  const [profileInformationsBiography, setProfileInformationsBiography] = useState()
  const [modalToiletRatings, setModalToiletRatings] = useState(false)
  const [titleRatingsAverage, setTitleRatingsAverage] = useState()
  const [titleRatingsReviews, setTitleRatingsReviews] = useState()
  const bannerAdUnitId = Platform.OS == 'ios' ? 'ca-app-pub-8757434016538668/8060623427' : 'ca-app-pub-8757434016538668/5720620290'
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
  }, [])
  const handlePlaceSelect = details => {
    const placeId = details.place_id
    fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=[key]`)
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
              setModalBlockCheck(true)
              database().ref('TOILETS/' + coordinate.LATITUDE.toString().replace('.', '_') + 'x' + coordinate.LONGITUDE.toString().replace('.', '_')).once('value', function(snapshot) {
                setCreatorId(snapshot.val().CREATOR)
              })
              setToiletDirectory(coordinate.LATITUDE.toString().replace('.', '_') + 'x' + coordinate.LONGITUDE.toString().replace('.', '_'))
            }}
          />
        ))}
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
              key: '[key]',
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
        width: 64,
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
                    database().ref('TOILETS/' + toiletDirectory + '/INFORMATIONS').once('value', function(snapshot) {
                      setToiletInformationsTitle(snapshot.val().TITLE)
                      setToiletInformationsDescription(snapshot.val().DESCRIPTION)
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
                onPress={() => setModalToiletRatings(false)}
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
    </View>
  )
}

export default Guest