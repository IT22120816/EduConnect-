import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // For icons
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig'; // Ensure this path is correct

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return <View><Text>Loading...</Text></View>; // Handle loading fonts
  }

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert("Success", "Logged in successfully!");
      navigation.navigate('HomePage'); // Navigate to HomePage
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Image
          source={require('../assets/login.png')} // Ensure this path is correct
          style={styles.image}
        />
        <Text style={styles.text}>Login</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          placeholderTextColor="#B0B0C3"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#B0B0C3"
        />

        <TouchableOpacity
          style={styles.forgotPassword}
          onPress={() => {/* Navigate to Forgot Password screen */}}
        >
          <Text style={styles.linkText}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonLogin}
          onPress={handleLogin}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <View style={styles.hrContainer}>
          <View style={styles.hr} />
          <Text style={styles.orText}>or</Text>
          <View style={styles.hr} />
        </View>

        {/* Uncomment and implement social login functionality if needed */}
        {/* <View style={styles.socialButtonsContainer}>
          <TouchableOpacity style={styles.socialButton}>
            <FontAwesome name="google" size={24} color="#ffffff" />
            <Text style={styles.socialButtonText}>Login with Google</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <FontAwesome name="facebook" size={24} color="#ffffff" />
            <Text style={styles.socialButtonText}>Login with Facebook</Text>
          </TouchableOpacity>
        </View> */}

        <TouchableOpacity
          onPress={() => navigation.navigate('SignUpScreen')}
        >
          <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1F1F39',
    paddingHorizontal: 20,
  },
  contentContainer: {
    width: '100%',
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  image: {
    width: 180,
    height: 180,
    marginBottom: 10,
    resizeMode: 'contain',
  },
  text: {
    fontSize: 24,
    color: '#ffffff',
    fontFamily: 'Poppins_700Bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  input: {
    width: '100%',
    height: 40,
    backgroundColor: '#3E3E55',
    borderRadius: 8,
    paddingHorizontal: 10,
    color: '#fff',
    marginVertical: 8,
    fontFamily: 'Poppins_400Regular',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginVertical: 8,
  },
  linkText: {
    color: '#B0B0C3',
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
  },
  buttonLogin: {
    backgroundColor: '#3D5CFF',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
  },
  hrContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
  },
  hr: {
    height: 1,
    backgroundColor: '#B0B0C3',
    flex: 1,
  },
  orText: {
    fontSize: 12,
    color: '#B0B0C3',
    fontFamily: 'Poppins_400Regular',
    marginHorizontal: 10,
  },
  socialButtonsContainer: {
    width: '100%',
    marginVertical: 15,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3E3E55',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  socialButtonText: {
    color: '#ffffff',
    fontFamily: 'Poppins_400Regular',
    marginLeft: 10,
  },
});
