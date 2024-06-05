import React, { useEffect, useState } from 'react'
import { BackHandler, Image, Text, TextInput, TouchableOpacity, View } from 'react-native'
import auth from '@react-native-firebase/auth'

const Login = ({navigation}) => {
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [buttonBackgroundColor, setButtonBackgroundColor ] = useState('#2e64e5')
    const [buttonTitle, setButtonTitle] = useState('Login')
    const [buttonDisabled, setButtonDisabled] = useState(false)
    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true)
        return () => backHandler.remove()
    }, [])

    return (
        <View style={{
            flex: 1
        }}>
            <Image style={{
                position: 'absolute',
                alignSelf: 'center',
                width: 300,
                height: 300,
                top: 24
            }}
                Image source={require('Saimai/img/image_05.png')}
            />
            <Text style={{
                position: 'absolute',
                alignSelf: 'center',
                top: 288,
                fontWeight: 'bold',
                fontSize: 48,
                color: '#1d1d1f'
            }}>
                Login
            </Text>
            <View style={{
                position: 'absolute',
                alignSelf: 'center',
                justifyContent: 'center',
                width: 300,
                height: 36,
                top: 360,
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
                        setButtonBackgroundColor('#2e64e5')
                        setButtonTitle('Login')
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
                    labelValue={password}
                    onChangeText={userPassword => {
                        setButtonBackgroundColor('#2e64e5')
                        setButtonTitle('Login')
                        setButtonDisabled(false)
                        setPassword(userPassword)
                    }}
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
                top: 450,
                backgroundColor: buttonBackgroundColor,
                borderRadius: 8
            }}
                disabled={buttonDisabled}
                onPress={() => {
                    if (email != '' && email != null && password != '' && password != null) {
                        auth().signInWithEmailAndPassword(email, password)
                            .then(() => {
                                navigation.navigate('home')
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
                top: 503,
                paddingLeft: 185,
                color: '#2e64e5'
            }}
                onPress={() => navigation.navigate('resetPassword')}
            >
                Forgot password?
            </Text>
            <TouchableOpacity style={{
                position: 'absolute',
                alignSelf: 'center',
                justifyContent: 'center',
                width: 300,
                height: 48,
                bottom: 72,
                backgroundColor: '#cccccc',
                borderRadius: 8
            }}
                onPress={() => navigation.navigate('guest')}
            >
                <Text style={{
                    alignSelf: 'center',
                    fontWeight: 'bold',
                    fontSize: 16,
                    color: '#ffffff'
                }}>
                    Continue as guest
                </Text>
            </TouchableOpacity>
            <Text style={{
                position: 'absolute',
                alignSelf: 'center',
                bottom: 36,
                color: '#1d1d1f'
            }}>
                Don't have an account?
                <Text> </Text>
                <Text style={{
                    color: '#2e64e5'
                }}
                    onPress={() => navigation.navigate('signUp')}
                >
                    Sign up
                </Text>
            </Text>
        </View>
    )
}

export default Login