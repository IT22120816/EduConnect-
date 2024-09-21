// VideoUpload.js
import React, { useState } from 'react';
import { View, Button, Text, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebaseConfig'; // Adjust the import path as needed

const VideoUpload = () => {
    const [videoUri, setVideoUri] = useState(null);

    const pickVideo = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            Alert.alert("Permission to access camera roll is required!");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setVideoUri(result.assets[0].uri);
        }
    };

    const uploadVideo = async () => {
        if (!videoUri) {
            Alert.alert("Please select a video first!");
            return;
        }

        try {
            const response = await fetch(videoUri);
            const blob = await response.blob();
            const storageRef = ref(storage, `videos/${new Date().getTime()}.mp4`);

            const metadata = {
                contentType: 'video/mp4', // Ensure the content type is correct
            };

            await uploadBytes(storageRef, blob, metadata);
            Alert.alert("Video uploaded successfully!");
            const downloadURL = await getDownloadURL(storageRef);
            console.log('File available at', downloadURL);
        } catch (error) {
            console.error("Error uploading video:", error);
            Alert.alert("Failed to upload video: " + JSON.stringify(error));
        }
    };

    return (
        <View style={{ padding: 20 }}>
            <Button title="Pick a Video" onPress={pickVideo} />
            {videoUri && <Text>Video Selected: {videoUri}</Text>}
            <Button title="Upload Video" onPress={uploadVideo} />
        </View>
    );
};

export default VideoUpload;
