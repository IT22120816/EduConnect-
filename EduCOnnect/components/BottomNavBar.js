import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function BottomNavBar() {
  const navigation = useNavigation();

  return (
    <View style={styles.navBar}>
      {/* Home Button */}
      <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Home')}>
        <Icon name="home" size={28} color="#fff" />
        <Text style={styles.navText}>Home</Text>
      </TouchableOpacity>

      {/* Resources Button */}
      <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Resources')}>
        <Icon name="library-books" size={28} color="#fff" />
        <Text style={styles.navText}>Resources</Text>
      </TouchableOpacity>

      {/* Downloads Button */}
      <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Downloads')}>
        <Icon name="cloud-download" size={28} color="#fff" />
        <Text style={styles.navText}>Downloads</Text>
      </TouchableOpacity>

      {/* Community Button */}
      <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Community')}>
        <Icon name="group" size={28} color="#fff" />
        <Text style={styles.navText}>Community</Text>
      </TouchableOpacity>

      {/* Account Button */}
      <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Account')}>
        <Icon name="account-circle" size={28} color="#fff" />
        <Text style={styles.navText}>Account</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  navBar: {
    flexDirection: 'row',            // Row direction for buttons
    justifyContent: 'space-between', // Evenly spaced buttons
    backgroundColor: '#3D5CFF',      // Vibrant blue background color
    paddingVertical: 14,             // Vertical padding for height
    paddingHorizontal: 20,           // Horizontal padding for width
    borderRadius: 30,                // Rounded corners for pill shape
    marginHorizontal: 20,            // Side margins for spacing
    marginBottom: 20,                // Bottom margin for placement
    elevation: 10,                   // Floating effect for Android
    shadowColor: '#000',             // Shadow color for iOS
    shadowOffset: { width: 0, height: 5 }, // Offset shadow for depth
    shadowOpacity: 0.3,              // Opacity for shadow visibility
    shadowRadius: 8,                 // Blur radius for soft shadow
  },
  navButton: {
    alignItems: 'center',            // Center icon and text
  },
  navText: {
    color: '#fff',                   // White text color for contrast
    fontSize: 12,                    // Small font size
    fontFamily: 'Poppins_500Medium', // Medium-weight font for clarity
    marginTop: 5,                    // Spacing between icon and text
  },
});