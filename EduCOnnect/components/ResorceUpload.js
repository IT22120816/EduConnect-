import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  FlatList, 
  ActivityIndicator, 
  ScrollView 
} from 'react-native';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import * as DocumentPicker from 'expo-document-picker';
import { db, storage, auth } from '../firebaseConfig';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { collection, addDoc, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import BottomNavBarTeacher from './BottemNavBarTeacher';  // Import the same bottom nav bar

export default function PdfUploadPage() {
  const [pdfName, setPdfName] = useState('');
  const [pdfCategory, setPdfCategory] = useState('');
  const [pdfDescription, setPdfDescription] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [uploadedPdfs, setUploadedPdfs] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loadingPdfs, setLoadingPdfs] = useState(true);

  const [fontsLoaded] = useFonts({ Poppins_400Regular, Poppins_700Bold });

  useEffect(() => {
    // Firestore subscription to fetch uploaded PDFs
    const unsubscribe = onSnapshot(collection(db, 'pdfs'), (querySnapshot) => {
      const pdfs = [];
      querySnapshot.forEach((doc) => {
        pdfs.push({ id: doc.id, ...doc.data() });
      });
      setUploadedPdfs(pdfs);
      setLoadingPdfs(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSelectPdf = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
      });

      if (result.type === 'success') {
        setPdfFile(result);
        Alert.alert('Success', `PDF selected: ${result.name}`);
      } else {
        Alert.alert('Cancelled', 'PDF selection was cancelled.');
      }
    } catch (error) {
      console.error('Error selecting PDF:', error);
      Alert.alert('Error', 'Failed to select PDF. Please try again.');
    }
  };

  const handleUploadPdf = async () => {
    if (!pdfFile || !pdfName || !pdfCategory || !pdfDescription) {
      Alert.alert('Error', 'Please fill in all fields and select a PDF.');
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      const { uri, name } = pdfFile;

      const response = await fetch(uri);
      const blob = await response.blob();
      const storageRefPath = `pdfs/${Date.now()}_${name}`;
      const storageRef = ref(storage, storageRefPath);

      const uploadTask = uploadBytesResumable(storageRef, blob);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progressPercent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progressPercent);
        },
        (error) => {
          console.error('Upload error:', error);
          Alert.alert('Upload Error', error.message);
          setUploading(false);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          await addDoc(collection(db, 'pdfs'), {
            name: pdfName,
            category: pdfCategory,
            description: pdfDescription,
            pdfURL: downloadURL,
            userId: auth.currentUser.uid,
          });

          setPdfName('');
          setPdfCategory('');
          setPdfDescription('');
          setPdfFile(null);
          setUploading(false);
          Alert.alert('Success', 'PDF uploaded successfully!');
        }
      );
    } catch (error) {
      console.error('Error uploading PDF:', error);
      Alert.alert('Error', error.message);
      setUploading(false);
    }
  };

  const handleDeletePdf = async (id, pdfURL) => {
    try {
      const storageRef = ref(storage, pdfURL);
      await deleteObject(storageRef);
      await deleteDoc(doc(db, 'pdfs', id));
      Alert.alert('Deleted', 'PDF deleted successfully.');
    } catch (error) {
      console.error('Error deleting PDF:', error);
      Alert.alert('Error', 'Failed to delete PDF.');
    }
  };

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3D5CFF" />
        <Text style={styles.loadingText}>Loading Fonts...</Text>
      </View>
    );
  }

  if (loadingPdfs) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3D5CFF" />
        <Text style={styles.loadingText}>Loading PDFs...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* ScrollView for Main Content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Upload Lecture PDF</Text>
        
        <TextInput
          style={styles.input}
          placeholder="PDF Name"
          value={pdfName}
          onChangeText={setPdfName}
          placeholderTextColor="#B0B0C3"
        />
        
        <TextInput
          style={styles.input}
          placeholder="PDF Category"
          value={pdfCategory}
          onChangeText={setPdfCategory}
          placeholderTextColor="#B0B0C3"
        />
        
        <TextInput
          style={styles.input}
          placeholder="PDF Description"
          value={pdfDescription}
          onChangeText={setPdfDescription}
          placeholderTextColor="#B0B0C3"
        />
        
        <TouchableOpacity onPress={handleSelectPdf} style={styles.button}>
          <Text style={styles.buttonText}>Select PDF</Text>
        </TouchableOpacity>

        {/* Upload Button or Uploading Indicator */}
        {uploading ? (
          <View style={styles.progressContainer}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={styles.progressText}>Uploading: {Math.round(progress)}%</Text>
          </View>
        ) : (
          <TouchableOpacity onPress={handleUploadPdf} style={styles.button}>
            <Text style={styles.buttonText}>Upload PDF</Text>
          </TouchableOpacity>
        )}

        {/* List of Uploaded PDFs */}
        <FlatList
          data={uploadedPdfs}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.uploadedList}
          renderItem={({ item }) => (
            <View style={styles.uploadedPdfContainer}>
              <Text style={styles.pdfTitle}>{item.name}</Text>
              <Text style={styles.pdfDescription}>{item.description}</Text>
              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.editButton}>
                  <Text style={styles.buttonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.deleteButton}
                  onPress={() => handleDeletePdf(item.id, item.pdfURL)}
                >
                  <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.emptyListText}>No PDFs uploaded yet.</Text>}
        />
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <BottomNavBarTeacher style={styles.bottomNavBar} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1F1F39',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#1F1F39',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
    fontFamily: 'Poppins_400Regular',
    fontSize: 16,
  },
  title: {
    fontSize: 27,
    color: '#fff',
    fontFamily: 'Poppins_700Bold',
    marginBottom: 20,
    marginTop: 30,
  },
  input: {
    backgroundColor: '#292C4D',
    color: '#fff',
    padding: 15,
    marginVertical: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#3D5CFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'Poppins_700Bold',
    fontSize: 16,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressText: {
    color: '#fff',
    marginLeft: 10,
  },
  uploadedList: {
    marginTop: 20,
  },
  uploadedPdfContainer: {
    backgroundColor: '#292C4D',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  pdfTitle: {
    color: '#fff',
    fontFamily: 'Poppins_700Bold',
    fontSize: 16,
  },
  pdfDescription: {
    color: '#B0B0C3',
    fontFamily: 'Poppins_400Regular',
    marginTop: 5,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  editButton: {
    backgroundColor: '#3D5CFF',
    padding: 10,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: '#FF3D71',
    padding: 10,
    borderRadius: 5,
  },
  emptyListText: {
    color: '#fff',
    fontFamily: 'Poppins_400Regular',
    textAlign: 'center',
    marginTop: 20,
  },
  bottomNavBar: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
});
