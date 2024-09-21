import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Dimensions, TextInput, TouchableOpacity } from 'react-native';
import BottomNavBar from './BottomNavBar';
import { StatusBar } from 'expo-status-bar';
import { Video } from 'expo-av';
import { db } from '../firebaseConfig'; 
import { collection, query, onSnapshot } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation

const { width } = Dimensions.get('window');

const banners = [
  { id: 1, image: require('../assets/banner1.png') },
  { id: 2, image: require('../assets/banner2.jpg') },
  { id: 3, image: require('../assets/banner3.png') },
];

export default function StudentHomePage() {
  const scrollRef = useRef(null);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [lectures, setLectures] = useState([]);
  const navigation = useNavigation(); // Initialize navigation

  useEffect(() => {
    const scrollToNextBanner = () => {
      let nextIndex = currentBannerIndex + 1;
      if (nextIndex >= banners.length) nextIndex = 0;
      setCurrentBannerIndex(nextIndex);
      scrollRef.current?.scrollTo({ x: nextIndex * width * 0.9, animated: true });
    };

    const interval = setInterval(scrollToNextBanner, 3000);
    return () => clearInterval(interval);
  }, [currentBannerIndex]);

  useEffect(() => {
    const q = query(collection(db, 'lectures'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedLectures = [];
      querySnapshot.forEach((doc) => {
        fetchedLectures.push({ id: doc.id, ...doc.data() });
      });
      setLectures(fetchedLectures);
    });
    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor="#3D5CFF" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.headerContainer}>
          <View style={styles.topBar}>
            <Image style={styles.iconButton} source={require('../assets/bell_icon.png')} />
            <View style={styles.searchContainer}>
              <Image style={styles.searchIcon} source={require('../assets/search.png')} />
              <TextInput
                style={styles.searchInput}
                placeholder="Find Course"
                placeholderTextColor="#B0B0C3"
              />
              <Image style={styles.filterIcon} source={require('../assets/filter.png')} />
            </View>
            <Image style={styles.iconButton} source={require('../assets/hamburger_icon.png')} />
          </View>

          {/* Banner inside header */}
          <View style={styles.bannerWrapper}>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              ref={scrollRef}
              style={styles.bannerScroll}
            >
              {banners.map((banner) => (
                <View key={banner.id} style={styles.bannerContainer}>
                  <Image source={banner.image} style={styles.bannerImage} />
                </View>
              ))}
            </ScrollView>
          </View>
        </View>

        {/* "Continue Watching" Section */}
        <View style={styles.roundedContainer}>
          <Text style={styles.sectionTitle}>Continue watching</Text>
          <View style={styles.progressContainer}>
            <Text style={styles.learnedText}>Learned today</Text>
            <Text style={styles.timeText}>0min / 60min</Text>
          </View>
          {/* Placeholder for progress bar */}
          <View style={styles.progressBar}>
            <View style={styles.progress} />
          </View>
        </View>

        {/* "Popular Courses" Section */}
        <View style={styles.roundedContainer}>
          <Text style={styles.sectionTitle}>Our most popular courses</Text>
          {lectures.length > 0 ? (
            lectures.map((lecture) => (
              <TouchableOpacity
                key={lecture.id}
                style={styles.lectureWrapper}
                onPress={() => navigation.navigate('LectureDetailScreen', { lecture })} // Navigate to detail screen
              >
                <Video
                  source={{ uri: lecture.videoURL }} // Video URL from the lecture data
                  style={styles.thumbnailImage}
                  useNativeControls
                  resizeMode="cover"
                  isLooping
                  shouldPlay={false}
                />
                <View style={styles.detailsContainer}>
                  <Text style={styles.courseTitle}>{lecture.name}</Text>
                  <Text style={styles.courseDescription}>{lecture.description}</Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.placeholderText}>No popular courses available.</Text>
          )}
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNavBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1F1F39',
  },
  headerContainer: {
    backgroundColor: '#3D5CFF',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingBottom: 30,
    marginTop: 29,
    overflow: 'visible',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 10,
  },
  iconButton: {
    width: 24,
    height: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#3E3E55',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 10,
  },
  searchIcon: {
    width: 20,
    height: 20,
  },
  searchInput: {
    color: '#B0B0C3',
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    flex: 1,
    marginLeft: 10,
  },
  filterIcon: {
    width: 20,
    height: 20,
  },
  bannerWrapper: {
    marginTop: 10,
    alignItems: 'center',
  },
  bannerScroll: {
    width: width * 0.9,
    borderRadius: 20,
  },
  bannerContainer: {
    width: width * 0.9,
    height: 160,
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  roundedContainer: {
    backgroundColor: '#2F2F42',
    borderRadius: 20,
    padding: 15,
    marginTop: 20,
    width: width * 0.9,
    overflow: 'hidden',
    alignSelf: 'center',
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Poppins_600SemiBold',
    marginBottom: 10,
  },
  lectureWrapper: {
    backgroundColor: '#3E3E55', // Updated color to match the UI
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    flexDirection: 'row',
    elevation: 5, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 }, // iOS shadow offset
    shadowOpacity: 0.3, // iOS shadow opacity
    shadowRadius: 4, // iOS shadow blur
  },
  thumbnailImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 16,
  },
  detailsContainer: {
    flex: 1,
  },
  courseTitle: {
    color: '#fff',
    fontFamily: 'Poppins_600SemiBold',
  },
  courseDescription: {
    color: '#B0B0C3',
    fontFamily: 'Poppins_400Regular',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  learnedText: {
    color: '#B0B0C3',
    fontFamily: 'Poppins_400Regular',
  },
  timeText: {
    color: '#3D5CFF',
    fontFamily: 'Poppins_400Regular',
  },
  progressBar: {
    height: 10,
    backgroundColor: '#3E3E55',
    borderRadius: 5,
  },
  progress: {
    width: '0%', 
    height: '100%',
    backgroundColor: '#3D5CFF',
    borderRadius: 5,
  },
  placeholderText: {
    color: '#B0B0C3',
    fontFamily: 'Poppins_400Regular',
  },
});
