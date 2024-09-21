// LectureDetailScreen.js
import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { Video } from 'expo-av';
import { useNavigation } from '@react-navigation/native';

const LectureDetailScreen = ({ route }) => {
  const navigation = useNavigation();
  const { lecture } = route.params; 

  return (
    <View style={styles.container}>
      <Button title="Back" onPress={() => navigation.goBack()} />
      <Video
        source={{ uri: lecture.videoURL }}
        style={styles.video}
        useNativeControls
        resizeMode="contain"
        shouldPlay
      />
      <Text style={styles.title}>{lecture.name}</Text>
      <Text style={styles.description}>{lecture.description}</Text>
      {/* Like, Dislike, and Save buttons can go here */}
      <View style={styles.buttonContainer}>
        <Button title="Like" onPress={() => {}} />
        <Button title="Dislike" onPress={() => {}} />
        <Button title="Save" onPress={() => {}} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1F1F39',
    padding: 20,
  },
  video: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    marginVertical: 10,
  },
  description: {
    color: '#B0B0C3',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default LectureDetailScreen;
