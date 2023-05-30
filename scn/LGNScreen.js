import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, BackHandler } from 'react-native';
import auth from '@react-native-firebase/auth';

const LGNScreen = ({navigation}) => {

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true)
        return () => backHandler.remove()
    }, [])

    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    return (
        <View style={{
            flex: 1,
        }}>
            
            <Image style={{
                position: 'absolute',
                alignSelf: 'center',
                width: 300,
                height: 300,
                top: 24,
            }}
                Image source={require('Saimai/img/loginImage.png')}
            />

            <Text style={{
                position: 'absolute',
                alignSelf: 'center',
                top: 300,
                fontWeight: 'bold',
                fontSize: 48,
                color: '#1d1d1f',
            }}>
                Login
            </Text>

            <View style={{
                position: 'absolute',
                alignSelf: 'center',
                justifyContent: 'center',
                width: 300,
                height: 36,
                top: 384,
                borderColor: '#cccccc',
                borderWidth: 1,
                borderRadius: 5,
            }}>
                <TextInput style={{
                    padding: 6,
                    fontSize: 16,
                    color: '#1d1d1f',
                }}
                    labelValue={email}
                    onChangeText={(userEmail) => setEmail(userEmail)}
                    placeholder='Email'
                    placeholderTextColor='darkgrey'
                    keyboardType='email-address'
                    autoCapitalize='none'
                    autoCorrect={false}
                />
            </View>

            <View style={{
                position: 'absolute',
                alignSelf: 'center',
                justifyContent: 'center',
                width: 300,
                height: 36,
                top: 426,
                borderColor: '#cccccc',
                borderWidth: 1,
                borderRadius: 5,
            }}>
                <TextInput style={{
                    padding: 6,
                    fontSize: 16,
                    color: '#1d1d1f',
                }}
                    labelValue={password}
                    onChangeText={(userPassword) => setPassword(userPassword)}
                    placeholder='Password'
                    placeholderTextColor='darkgrey'
                    secureTextEntry={true}
                    autoCapitalize='none'
                    autoCorrect={false}
                />
            </View>

            <TouchableOpacity style={{
                position: 'absolute',
                alignSelf: 'center',
                justifyContent: 'center',
                width: 300,
                height: 48,
                top: 474,
                backgroundColor: '#2e64e5',
                borderRadius: 5,
            }}
                onPress={() => {
                    auth().signInWithEmailAndPassword(email, password)
                        .then(() => {
                            console.log('User account created & signed in!');
                            navigation.navigate('Hme')
                        })
                        .catch(error => {
                            if (error.code === 'auth/email-already-in-use') {
                                console.log('That email address is already in use!');
                            }
                            if (error.code === 'auth/invalid-email') {
                                console.log('That email address is invalid!');
                            }
                            console.error(error);
                        });
            }}>
                <Text style={{
                    alignSelf: 'center',
                    color: '#ffffff',
                    fontWeight: 'bold',
                    fontSize: 16,
                }}>
                    Login
                </Text>
            </TouchableOpacity>

            <Text style={{
                position: 'absolute',
                alignSelf: 'center',
                top: 527,
                paddingLeft: 185,
                color: '#2e64e5',
            }}
                onPress={() => navigation.navigate('Fgt')}
            >
                Forgot password?
            </Text>

            <Text style={{
                position: 'absolute',
                alignSelf: 'center',
                bottom: 36,
                color: '#1d1d1f',
            }}>
                Don't have an account? 
                <Text> </Text>
                <Text style={{
                    color: '#2e64e5',
                }}
                    onPress={() => navigation.navigate('Sgn')} 
                >
                    Sign up
                </Text>
            </Text>

        </View>
    )
}

export default LGNScreen;