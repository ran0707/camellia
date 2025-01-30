import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Text, Button, Surface, Avatar, ActivityIndicator } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import customTheme from '../utils/theme';

const API_KEY = '9dac1789f6909ca2205c94277b32f8bd';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedUserString = await AsyncStorage.getItem('user');
        if (storedUserString) {
          const storedUser = JSON.parse(storedUserString);
          setUser(storedUser);
          if (storedUser?.location?.coordinates) {
            await fetchWeather(
              storedUser.location.coordinates.latitude,
              storedUser.location.coordinates.longitude
            );
          }
        }
      } catch (err) {
        console.error('Error loading data:', err);
      }
    };
    loadData();
  }, []);

  const fetchWeather = async (latitude, longitude) => {
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;
      const response = await fetch(url);
      const data = await response.json();
      if (data?.weather) setWeather(data);
    } catch (error) {
      console.error('Error fetching weather:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        {/* Profile & Greeting Section */}
        <View style={styles.profileSection}>
          <View>
            <Text style={styles.greeting}>Welcome Back! 👋</Text>
            <Text style={styles.userName}>{user?.name || 'Alex William'}</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <Avatar.Image size={50} source={{ uri: 'https://i.pravatar.cc/150' }} />
          </TouchableOpacity>
        </View>

        {/* Promotional Banner */}
        <Surface style={styles.bannerCard}>
          <Image source={{ uri: 'https://source.unsplash.com/random' }} style={styles.bannerImage} />
          <View style={styles.bannerTextContainer}>
            <Text style={styles.bannerTitle}>Learn how Plantia helps 10,000+ farmers</Text>
            <Text style={styles.bannerSubtitle}>Discover AI-powered plant disease detection</Text>
          </View>
        </Surface>

        {/* Scan Now & Recent Diagnoses Side by Side */}
        <View style={styles.horizontalContainer}>
          {/* Scan Now Card */}
          <Surface style={styles.scanCard}>
            <Text style={styles.scanTitle}>Know plant disease with Plantia AI</Text>
            <Text style={styles.scanSubtitle}>Instantly diagnose plant health issues.</Text>
            <Button mode="contained" style={styles.scanButton}>Scan Now</Button>
          </Surface>

          {/* Recent Diagnoses */}
          <Surface style={styles.diagnosisCard}>
            <Text style={styles.sectionTitle}>Recent Diagnoses</Text>
            <View style={styles.diagnosisItem}>
              <Icon name="leaf" size={24} color={customTheme.colors.primary} />
              <View>
                <Text style={styles.diagnosisText}>Powder Mildew</Text>
                <Text style={styles.diagnosisSubtitle}>Spinach - 2h ago</Text>
              </View>
            </View>
            <View style={styles.diagnosisItem}>
              <Icon name="bug" size={24} color={customTheme.colors.primary} />
              <View>
                <Text style={styles.diagnosisText}>Bacterial Spot</Text>
                <Text style={styles.diagnosisSubtitle}>Carrot - Jul 3, 2024</Text>
              </View>
            </View>
            <View style={styles.diagnosisItem}>
              <Icon name="fruit-cherries" size={24} color={customTheme.colors.primary} />
              <View>
                <Text style={styles.diagnosisText}>Blight</Text>
                <Text style={styles.diagnosisSubtitle}>Apple - Jun 24, 2024</Text>
              </View>
            </View>
          </Surface>
        </View>

        {/* Bottom Navigation Bar */}
        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.bottomBarItem} onPress={() => navigation.navigate('Home')}>
            <Icon name="home" size={28} color={customTheme.colors.primary} />
            <Text style={styles.bottomBarText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomBarItem} onPress={() => navigation.navigate('Community')}>
            <Icon name="account-group" size={28} color={customTheme.colors.primary} />
            <Text style={styles.bottomBarText}>Community</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomBarItem} onPress={() => navigation.navigate('Detect')}>
            <Icon name="camera" size={28} color={customTheme.colors.primary} />
            <Text style={styles.bottomBarText}>Detect</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  scrollContainer: {
    padding: 16,
  },
  profileSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  greeting: {
    fontSize: 16,
    color: '#555',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  bannerCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  bannerImage: {
    width: '100%',
    height: 180,
  },
  bannerTextContainer: {
    padding: 12,
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  bannerSubtitle: {
    fontSize: 14,
    color: '#555',
  },
  horizontalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scanCard: {
    flex: 1,
    marginRight: 8,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#DFF6FF',
  },
  diagnosisCard: {
    flex: 1,
    marginLeft: 8,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#F0F4F8',
  },
  diagnosisItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  diagnosisText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  diagnosisSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  bottomBarText: {
    fontSize: 14,
    marginTop: 4,
  },
});

export default HomeScreen;
