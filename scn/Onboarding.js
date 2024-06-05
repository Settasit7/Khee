import React from 'react'
import { Image, Text, TouchableOpacity } from 'react-native'
import Onboarding from 'react-native-onboarding-swiper'

const Done = ({...props}) => (
    <TouchableOpacity style={{
        marginHorizontal: 18
    }}
        {...props}
    >
        <Text style={{
            fontSize: 16
        }}>
            Done
        </Text>
    </TouchableOpacity>
)

const Onboarding_ = ({navigation}) => {

    return (
        <Onboarding
            onSkip={() => navigation.navigate('signUp')}
            onDone={() => navigation.navigate('signUp')}
            DoneButtonComponent={Done}
            pages={[
                {
                    title: 'Explore a City',
                    image: <Image style={{
                        width: 300,
                        height: 300
                    }}
                        Image source={require('Saimai/img/image_01.png')}
                    />,
                    backgroundColor: '#b0e2ed'
                },
                {
                    title: 'Pin a Toilet',
                    image: <Image style={{
                        width: 300,
                        height: 300
                    }}
                        Image source={require('Saimai/img/image_02.png')}
                    />,
                    backgroundColor: '#edb0e2'
                },
                {
                    title: 'Be a Hero',
                    image: <Image style={{
                        width: 300,
                        height: 300
                    }}
                        Image source={require('Saimai/img/image_03.png')}
                    />,
                    backgroundColor: '#eddeb0'
                }
            ]}
        />
    )
}

export default Onboarding_