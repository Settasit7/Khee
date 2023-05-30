import React, { useEffect } from 'react';
import { LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import OBDScreen from './scn/OBDScreen';
import LGNScreen from './scn/LGNScreen';
import SGNScreen from './scn/SGNScreen';
import HMEScreen from './scn/HMEScreen';
import FGTScreen from './scn/FGTScreen';

LogBox.ignoreAllLogs();

const AppStack = createStackNavigator();

const App = () => {
  const [isFirstLaunch, setIsFirstLaunch] = React.useState(null);

  useEffect(() => {
    AsyncStorage.getItem('alreadyLaunched').then(value => {
      if (value == null) {
        AsyncStorage.setItem('alreadyLaunched', 'true');
        setIsFirstLaunch(true);
      }
      else {
        setIsFirstLaunch(false);
      }
    })
  }, [])

  if (isFirstLaunch == null) {
    return null;
  }
  else if (isFirstLaunch == true) {
    return (
      <NavigationContainer>
        <AppStack.Navigator
          screenOptions={{
            headerShown: false
          }}
        >
          <AppStack.Screen name='Obd' component={OBDScreen} options={{gestureEnabled: false}}/>
          <AppStack.Screen name='Sgn' component={SGNScreen} options={{gestureEnabled: false}}/>
          <AppStack.Screen name='Lgn' component={LGNScreen} options={{gestureEnabled: false}}/>
          <AppStack.Screen name='Hme' component={HMEScreen} options={{gestureEnabled: false}}/>
          <AppStack.Screen name='Fgt' component={FGTScreen} options={{gestureEnabled: false}}/>
        </AppStack.Navigator>
      </NavigationContainer>
    )
  }
  else {
    return (
      <NavigationContainer>
        <AppStack.Navigator
          screenOptions={{
            headerShown: false
          }}
        >
          <AppStack.Screen name='Hme' component={HMEScreen} options={{gestureEnabled: false}}/>
          <AppStack.Screen name='Lgn' component={LGNScreen} options={{gestureEnabled: false}}/>
          <AppStack.Screen name='Sgn' component={SGNScreen} options={{gestureEnabled: false}}/>
          <AppStack.Screen name='Fgt' component={FGTScreen} options={{gestureEnabled: false}}/>
        </AppStack.Navigator>
      </NavigationContainer>
    )
  }
}

export default App;