import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Dimensions } from 'react-native';
import BottomNavBar from './BottomNavBar';

const { width } = Dimensions.get('window');

const banners = [
  { id: 1, image: require('../assets/banner1.png') },
  { id: 2, image: require('../assets/banner2.jpg') },
  { id: 3, image: require('../assets/banner3.png') },
];

export default function StudentHomePage() {
  const scrollRef = useRef(null);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  useEffect(() => {
    const scrollToNextBanner = () => {
      let nextIndex = currentBannerIndex + 1;
      if (nextIndex >= banners.length) nextIndex = 0;
      setCurrentBannerIndex(nextIndex);

      scrollRef.current?.scrollTo({ x: nextIndex * width, animated: true });
    };

    const interval = setInterval(scrollToNextBanner, 3000); 
    return () => clearInterval(interval); 
  }, [currentBannerIndex]);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Image style={styles.searchIcon} source={require('../assets/search.png')} />
          <Text style={styles.searchPlaceholder}>Find Course</Text>
          <Image style={styles.filterIcon} source={require('../assets/filter.png')} />
        </View>

        {/* Auto-scrolling Banner */}
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          ref={scrollRef}
        >
          {banners.map((banner, index) => (
            <View key={banner.id} style={styles.bannerContainer}>
              <Image source={banner.image} style={styles.bannerImage} />
            </View>
          ))}
        </ScrollView>

        {/* "Continue Watching" Section */}
        <View style={styles.sectionContainer}>
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
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Our most popular courses</Text>
          {/* Course List Placeholder */}
          <Text style={styles.placeholderText}>[Course List Placeholder]</Text>
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
  searchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#3E3E55',
    padding: 10,
    borderRadius: 8,
    margin: 15,
  },
  searchIcon: {
    width: 20,
    height: 20,
  },
  searchPlaceholder: {
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
  bannerContainer: {
    width: width * 0.9, 
    height: 160,
    borderRadius: 20,
    overflow: 'hidden',
    marginHorizontal: width * 0.05, 
    justifyContent: 'center', 
    alignItems: 'center', 
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover', 
  },
  sectionContainer: {
    padding: 15,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Poppins_600SemiBold',
    marginBottom: 10,
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
    width: '0%', // Dynamic progress based on learning
    height: '100%',
    backgroundColor: '#3D5CFF',
    borderRadius: 5,
  },
  placeholderText: {
    color: '#B0B0C3',
    fontFamily: 'Poppins_400Regular',
  },
});
