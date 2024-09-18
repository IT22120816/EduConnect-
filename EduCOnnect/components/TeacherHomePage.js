import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function TeacherHomePage() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to the Teacher Home Page</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1F1F39',
  },
  text: {
    fontSize: 20,
    color: '#ffffff',
    fontFamily: 'Poppins_700Bold',
  },
});
