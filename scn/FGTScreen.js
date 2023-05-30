import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput } from 'react-native';
import auth from '@react-native-firebase/auth';

const FGTScreen = ({navigation}) => {
    const [email, setEmail] = useState();

    return (
        <View style={{
            flex: 1,
        }}>
            
            <Image style={{
                position: 'absolute',
                alignSelf: 'center',
                width: 270,
                height: 270,
                top: 54,
            }}
                Image source={require('Saimai/img/resetImage.png')}
            />

            <Text style={{
                position: 'absolute',
                alignSelf: 'center',
                top: 300,
                fontWeight: 'bold',
                fontSize: 48,
                color: '#1d1d1f',
            }}>
                Reset
            </Text>
            <Text style={{
                position: 'absolute',
                alignSelf: 'center',
                top: 357,
                fontWeight: 'bold',
                fontSize: 48,
                color: '#1d1d1f',
            }}>
                password
            </Text>

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
                    labelValue={email}
                    onChangeText={(userEmail) => setEmail(userEmail)}
                    placeholder='Email'
                    placeholderTextColor='darkgrey'
                    keyboardType='email-address'
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
                backgroundColor: '#fa7100',
                borderRadius: 5,
            }}
                onPress={() => {
                    auth().sendPasswordResetEmail(email)
            }}>
                <Text style={{
                    alignSelf: 'center',
                    color: '#ffffff',
                    fontWeight: 'bold',
                    fontSize: 16,
                }}>
                    Send email
                </Text>
            </TouchableOpacity>

            <Text style={{
                position: 'absolute',
                alignSelf: 'center',
                bottom: 36,
                color: '#1d1d1f',
            }}>
                Reset password already? 
                <Text> </Text>
                <Text style={{
                    color: '#2e64e5'
                }}
                    onPress={() => navigation.navigate('Lgn')} 
                >
                    Login
                </Text>
            </Text>

        </View>
    )
}

export default FGTScreen;