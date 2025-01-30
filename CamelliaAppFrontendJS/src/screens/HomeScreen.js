// src/screens/HomeScreen.js
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Alert, ActivityIndicator } from 'react-native';
import { Button, Text } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import customTheme from '../utils/theme';


const HomeScreen = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [user, setUser] = useState(null);

  const getdata = async () => {
    // const data =  await AsyncStorage.setItem('user-location', JSON.stringify(getdata))
    return console.log("ithaanda naan",await AsyncStorage.getItem('user'))
    
  }

  useEffect (()=>{
    const getUser = async()=>{
    return await AsyncStorage.getItem("user")
    }
    setUser(getUser)
    console.log("kkkk",getdata())
  },[])

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      navigation.reset({
        index: 0,
        routes: [{ name: 'GetStarted' }],
      });
    } catch (error) {
      console.error('Failed to logout:', error);
      Alert.alert('Error', 'Failed to logout. Please try again.');
    }
  };

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={customTheme.colors.primary} />
        <Text style={styles.loadingText}>{t('loading')}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>{t('welcome', { name: user.name })}</Text>
      <Text style={styles.detailText}>
        {t('phone')}: {user.phoneNumber}
      </Text>
      {/* <Text style={styles.detailText}>
        {t('location')}: {user.address.city}, {user.address.state}
      </Text> */}

      <Button
        mode="contained"
        onPress={handleLogout}
        color={customTheme.colors.primary} // Uses theme primary color
        style={styles.button}
        contentStyle={styles.buttonContent}
        labelStyle={styles.buttonLabel}
      >
        {t('logout')}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: customTheme.colors.background, // Uses theme background color
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: customTheme.colors.text, // Uses theme text color
    marginBottom: 20,
    textAlign: 'center',
  },
  detailText: {
    fontSize: 18,
    color: customTheme.colors.text, // Uses theme text color
    marginBottom: 10,
  },
  button: {
    marginTop: 30,
    width: '50%',
    backgroundColor: customTheme.colors.primary, // Uses theme primary color
    borderRadius: 25,
  },
  buttonContent: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  buttonLabel: {
    fontSize: 18,
    color: customTheme.colors.surface, // Ensures contrast with the button
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: customTheme.colors.background, // Uses theme background color
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: customTheme.colors.text, // Uses theme text color
  },
});

export default HomeScreen;
