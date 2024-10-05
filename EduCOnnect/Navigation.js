import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import LandingPage from './components/LandingPage';
import OnboardScreen from './components/OnboardScreen';
import LoginScreen from './components/LoginScreen';
import SignUpScreen from './components/SignUpScreen';
import VideoUpload from './components/VideoUpload';
import StudentHomePage from './components/StudentHomePage';
import LectureDetailScreen from './components/LectureDetailScreen'; 
import TeacherDashboard from './components/TeacherDashboard';
import PdfUploadPage from './components/ResorceUpload';  

const Stack = createStackNavigator();

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LandingPage" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="LandingPage" component={LandingPage} />
        <Stack.Screen name="OnboardScreen" component={OnboardScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
        <Stack.Screen name="VideoUpload" component={VideoUpload} />
        <Stack.Screen name="StudentHomePage" component={StudentHomePage} />
        <Stack.Screen name="LectureDetailScreen" component={LectureDetailScreen} /> 
        <Stack.Screen name="TeacherDashboard" component={TeacherDashboard} />
        <Stack.Screen name="PdfUploadPage" component={PdfUploadPage} />  
      </Stack.Navigator>
    </NavigationContainer>
  );
}
