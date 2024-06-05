import React, { useState } from 'react'
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native'
import auth from '@react-native-firebase/auth'

const ResetPassword = ({navigation}) => {
    const [email, setEmail] = useState()
    const [buttonBackgroundColor, setButtonBackgroundColor] = useState('#fa7100')
    const [buttonTitle, setButtonTitle] = useState('Send email')
    const [buttonDisabled, setButtonDisabled] = useState(false)

    return (
        <View style={{
            flex: 1
        }}>
            <Image style={{
                position: 'absolute',
                alignSelf: 'center',
                width: 270,
                height: 270,
                top: 54
            }}
                Image source={require('Saimai/img/image_06.png')}
            />
            <Text style={{
                position: 'absolute',
                alignSelf: 'center',
                top: 288,
                fontWeight: 'bold',
                fontSize: 48,
                color: '#1d1d1f'
            }}>
                Reset
            </Text>
            <Text style={{
                position: 'absolute',
                alignSelf: 'center',
                top: 333,
                fontWeight: 'bold',
                fontSize: 44,
                color: '#1d1d1f'
            }}>
                password
            </Text>
            <View style={{
                position: 'absolute',
                alignSelf: 'center',
                justifyContent: 'center',
                width: 300,
                height: 36,
                top: 402,
                borderColor: '#cccccc',
                borderWidth: 1,
                borderRadius: 8
            }}>
                <TextInput style={{
                    padding: 6,
                    fontSize: 16,
                    color: '#1d1d1f'
                }}
                    labelValue={email}
                    onChangeText={userEmail => {
                        setButtonBackgroundColor('#fa7100')
                        setButtonTitle('Send email')
                        setButtonDisabled(false)
                        setEmail(userEmail)
                    }}
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
                top: 450,
                backgroundColor: buttonBackgroundColor,
                borderRadius: 8
            }}
                disabled={buttonDisabled}
                onPress={() => {
                    if (email != '' && email != null) {
                        auth().sendPasswordResetEmail(email)
                            .then(() => {
                                setButtonBackgroundColor('#cccccc')
                                setButtonTitle('Check your email inbox')
                                setButtonDisabled(true)
                            })
                            .catch(error => {
                                setButtonBackgroundColor('#ff605c')
                                setButtonTitle('Error: ' + error.code)
                                setButtonDisabled(true)
                            })
                    }
                }}
            >
                <Text style={{
                    alignSelf: 'center',
                    fontWeight: 'bold',
                    fontSize: 16,
                    color: '#ffffff'
                }}>
                    {buttonTitle}
                </Text>
            </TouchableOpacity>
            <Text style={{
                position: 'absolute',
                alignSelf: 'center',
                bottom: 36,
                color: '#1d1d1f'
            }}>
                Reset password already?
                <Text> </Text>
                <Text style={{
                    color: '#2e64e5'
                }}
                    onPress={() => navigation.navigate('login')}
                >
                    Login
                </Text>
            </Text>
        </View>
    )
}

export default ResetPassword