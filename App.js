import React, { useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import Guest from './scn/Guest'
import Home from './scn/Home'
import Login from './scn/Login'
import Onboarding_ from './scn/Onboarding'
import ResetPassword from './scn/ResetPassword'
import SignUp from './scn/SignUp'

const AppStack = createStackNavigator()

const App = () => {
  const [isFirstLaunch, setIsFirstLaunch] = React.useState(null)
  useEffect(() => {
    AsyncStorage.getItem('alreadyLaunched').then(value => {
      if (value == null) {
        AsyncStorage.setItem('alreadyLaunched', 'true')
        setIsFirstLaunch(true)
      } else {
        setIsFirstLaunch(false)
      }
    })
  }, [])
  if (isFirstLaunch == null) {
    return null
  } else if (isFirstLaunch == true) {

    return (
      <NavigationContainer>
        <AppStack.Navigator
          screenOptions={{
            headerShown: false
          }}
        >
          <AppStack.Screen
            name='onboarding'
            component={Onboarding_}
            options={{
              gestureEnabled: false
            }}
          />
          <AppStack.Screen
            name='signUp'
            component={SignUp}
            options={{
              gestureEnabled: false
            }}
          />
          <AppStack.Screen
            name='login'
            component={Login}
            options={{
              gestureEnabled: false
            }}
          />
          <AppStack.Screen
            name='resetPassword'
            component={ResetPassword}
            options={{
              gestureEnabled: false
            }}
          />
          <AppStack.Screen
            name='home'
            component={Home}
            options={{
              gestureEnabled: false
            }}
          />
          <AppStack.Screen
            name='guest'
            component={Guest}
            options={{
              gestureEnabled: false
            }}
          />
        </AppStack.Navigator>
      </NavigationContainer>
    )
  } else {

    return (
      <NavigationContainer>
        <AppStack.Navigator
          screenOptions={{
            headerShown: false
          }}
        >
          <AppStack.Screen
            name='home'
            component={Home}
            options={{
              gestureEnabled: false
            }}
          />
          <AppStack.Screen
            name='signUp'
            component={SignUp}
            options={{
              gestureEnabled: false
            }}
          />
          <AppStack.Screen
            name='login'
            component={Login}
            options={{
              gestureEnabled: false
            }}
          />
          <AppStack.Screen
            name='resetPassword'
            component={ResetPassword}
            options={{
              gestureEnabled: false
            }}
          />
          <AppStack.Screen
            name='guest'
            component={Guest}
            options={{
              gestureEnabled: false
            }}
          />
        </AppStack.Navigator>
      </NavigationContainer>
    )
  }
}

export default App