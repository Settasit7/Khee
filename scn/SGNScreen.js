import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, Linking } from 'react-native';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

const SGNScreen = ({navigation}) => {
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
                Image source={require('Saimai/img/signupImage.png')}
            />

            <Text style={{
                position: 'absolute',
                alignSelf: 'center',
                top: 300,
                fontWeight: 'bold',
                fontSize: 48,
                color: '#1d1d1f',
            }}>
                Sign up
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
                backgroundColor: '#5bc236',
                borderRadius: 5,
            }}
                onPress={() => {
                    auth().createUserWithEmailAndPassword(email, password)
                        .then(() => {
                            database().ref('users/' + auth().currentUser.uid + '/info').set({
                                email: email,
                                username: 'John',
                                biography: 'Doe',
                            })
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
                    Sign up
                </Text>
            </TouchableOpacity>

            <Text style={{
                position: 'absolute',
                alignSelf: 'center',
                top: 534,
                fontSize: 13,
                color: '#1d1d1f',
            }}>
                By signing up, you agree to our
                <Text> </Text>
                <Text style={{
                    color: '#2e64e5',
                }}
                    onPress={() => Linking.openURL('https://nonnoiandroidapp.github.io/terms-khee.txt')} 
                >
                    Terms of Services
                </Text>
            </Text>  

            <Text style={{
                position: 'absolute',
                alignSelf: 'center',
                bottom: 36,
                color: '#1d1d1f',
            }}>
                Have an account? 
                <Text> </Text>
                <Text style={{
                    color: '#2e64e5',
                }}
                    onPress={() => navigation.navigate('Lgn')} 
                >
                    Login
                </Text>
            </Text>  

        </View>
    )
}

export default SGNScreen;