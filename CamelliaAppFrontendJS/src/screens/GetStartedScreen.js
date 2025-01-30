// src/screens/GetStartedScreen.js
import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import customTheme from '../utils/theme';
import { useTranslation } from 'react-i18next';

const GetStartedScreen = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  

  return (
    <View style={styles.container}>
      {/* Top Left Logo */}
      <TouchableOpacity style={styles.topLeft}>
        <Image
          source={"https://upload.wikimedia.org/wikipedia/commons/d/dc/Ministry_of_Science_and_Technology_India.svg"}
          style={styles.roundedLogo}
          resizeMode="contain"
        />
      </TouchableOpacity>

      {/* Top Right Logo */}
      <TouchableOpacity style={styles.topRight}>
        <Image
          source={require('../assets/images/logo.png')}
          style={styles.roundedLogo}
          resizeMode="contain"
        />
      </TouchableOpacity>

      {/* Center Image with App Name */}
      <View style={styles.centerContent}>
        <Image
          source={require('../assets/images/landing.png')}
          style={styles.teaLeaf}
          resizeMode="contain"
        />
        <Text style={styles.appName}>{t('Camellia')}</Text>
      </View>

      {/* Get Started Button */}
      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('LanguageSelection')}
          style={styles.button}
          contentStyle={styles.buttonContent}
          labelStyle={styles.buttonLabel}
        >
          {t('Get Started')}
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: customTheme.colors.background, // Off White
    padding: 16,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topLeft: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  topRight: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  roundedLogo: {
    width: 100, // Increased size
    height: 100,
    borderRadius:50,
    overflow:'hidden',
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40, // Extra spacing for a better layout
  },
  teaLeaf: {
    width: 350, // Increased image size
    height: 350,
  },
  appName: {
    marginTop: 20,
    fontSize: 36, // Bigger font size
    fontWeight: 'bold',
    //fontFamily: 'Poppins-Bold', // Catchy font
    color: customTheme.colors.text, // Dark Green
    textTransform: 'uppercase', // More modern styling
    letterSpacing: 1, // Slight spacing for better readability
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 30,
    width: '100%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: customTheme.colors.primary, // Use custom theme
    borderRadius: 30, // Rounded button
    elevation: 2, // Shadow effect
  },
  buttonContent: {
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  buttonLabel: {
    fontSize: 16, // Bigger font for readability
    color: customTheme.colors.surface, // Off White text
    fontWeight: 'bold',
    //fontFamily: 'Poppins-Bold', // Consistent font
  },
});

export default GetStartedScreen;
