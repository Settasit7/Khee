import React from 'react';
import { Text, Image, TouchableOpacity } from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';

const Done = ({...props}) => (
    <TouchableOpacity style={{
        marginHorizontal: 18,
    }}
        {...props}
    >
        <Text style={{
            fontSize: 16,
        }}>
            Done
        </Text>
    </TouchableOpacity>
)

const OBDScreen = ({navigation}) => {
    return (
        <Onboarding
            onSkip={() => navigation.navigate('Sgn')}
            onDone={() => navigation.navigate('Sgn')}
            DoneButtonComponent={Done}
            pages={[
                {
                    backgroundColor: '#b0e2ed',
                    image: <Image style={{
                        width: 300,
                        height: 300,
                    }}
                        Image source={require('Saimai/img/onboardingImage_1.png')}/>,
                        title: 'Explore a City',
                },
                {
                    backgroundColor: '#edb0e2',
                    image: <Image style={{
                        width: 300,
                        height: 300,
                    }}
                        Image source={require('Saimai/img/onboardingImage_2.png')}/>,
                        title: 'Pin a Toilet',
                },
                {
                    backgroundColor: '#eddeb0',
                    image: <Image style={{
                        width: 300,
                        height: 300,
                    }}
                        Image source={require('Saimai/img/onboardingImage_3.png')}/>,
                        title: 'Be a Hero',
                },
            ]}
        />
    )
}

export default OBDScreen;