// src/screens/UserDetailsScreen.js
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { Button, TextInput, Text } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import customTheme from '../utils/theme';
import * as Location from 'expo-location';
import MessageDialog from '../components/MessageDialog'; // Import the MessageDialog component

const UserDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { language, location } = route.params; // Destructure location
  const { t, i18n } = useTranslation();

  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [street, setStreet] = useState('');
  const [locality, setLocality] = useState('');
  const [administrativeArea, setAdministrativeArea] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingAddress, setIsLoadingAddress] = useState(true);

  // States for OTP Dialog
  const [otpDialogVisible, setOtpDialogVisible] = useState(false);
  const [otp, setOtp] = useState('');

  // States for Error Dialog
  const [errorDialogVisible, setErrorDialogVisible] = useState(false);
  const [errorDialogMessage, setErrorDialogMessage] = useState('');

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const reverseGeocode = await Location.reverseGeocodeAsync({
          latitude: location.latitude,
          longitude: location.longitude,
        });

        if (reverseGeocode.length > 0) {
          const addr = reverseGeocode[0];
          setStreet(addr.street || '');
          setLocality(addr.subLocality || '');
          setAdministrativeArea(addr.subAdminArea || '');
          setCity(addr.city || '');
          setState(addr.region || '');
        } else {
          Alert.alert(t('dialogs.errorTitle'), t('dialogs.errorMessage', { message: 'Unable to fetch address from location.' }));
        }
      } catch (error) {
        console.error('Error fetching address:', error);
        showErrorDialog(t('dialogs.errorMessage', { message: 'An error occurred while fetching the address.' }));
      } finally {
        setIsLoadingAddress(false);
      }
    };

    fetchAddress();
  }, [location, t]);

  const validate = () => {
    let valid = true;
    let tempErrors = {};

    if (!name.trim()) {
      tempErrors.name = t('validationErrors.nameRequired');
      valid = false;
    }

    if (!phoneNumber || phoneNumber.length !== 10) {
      tempErrors.phoneNumber = t('validationErrors.phoneInvalid');
      valid = false;
    }

    setErrors(tempErrors);
    return valid;
  };

  const showErrorDialog = (message) => {
    setErrorDialogMessage(message);
    setErrorDialogVisible(true);
  };

  const handleSubmit = async () => {
    if (validate()) {
      setIsSubmitting(true);
      try {
        // Prepare data to send to the backend
        const userData = {
          name,
          phoneNumber,
          address: {
            street,
            locality,
            administrativeArea,
            city,
            state,
          },
          location: {
            latitude: location.latitude,
            longitude: location.longitude,
          },
          language,
        };

        // Log the userData for debugging
        console.log('Submitting User Data:', userData);

        // Replace with your actual backend API endpoint
        const API_ENDPOINT = 'http://localhost:5000/api/auth/register'; // Use your actual backend URL

        const response = await fetch(API_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });

        if (response.ok) {
          const responseData = await response.json();
          console.log('User registered successfully:', responseData);

          // Extract OTP from response
          const generatedOTP = responseData.otp;

          // Optionally, save user data locally
          await AsyncStorage.setItem('user', JSON.stringify(userData));

          // Show OTP Dialog
          setOtp(generatedOTP);
          setOtpDialogVisible(true);
        } else {
          const errorData = await response.json();
          console.error('Error registering user:', errorData);
          showErrorDialog(errorData.message || 'Failed to register user.');
        }
      } catch (error) {
        console.error('Error during submission:', error);
        showErrorDialog('An error occurred while saving your data.');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      Alert.alert('Validation Error', 'Please correct the highlighted fields.');
    }
  };

  const handleOTPDialogDismiss = () => {
    setOtpDialogVisible(false);
    // Navigate to OTPScreen after dismissing the dialog
    navigation.navigate('OTPScreen', {
      phoneNumber,
      language,
    });
  };

  if (isLoadingAddress) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={customTheme.colors.primary} />
        <Text style={styles.loadingText}>{t('loading')}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>{t('enterDetails')}</Text>

      <TextInput
        label={t('name')}
        value={name}
        onChangeText={(text) => setName(text)}
        mode="outlined"
        style={styles.input}
        error={!!errors.name}
      />
      {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

      <TextInput
        label={t('phoneNumber')}
        value={phoneNumber}
        onChangeText={(text) => setPhoneNumber(text)}
        mode="outlined"
        keyboardType="number-pad"
        maxLength={10}
        style={styles.input}
        error={!!errors.phoneNumber}
      />
      {errors.phoneNumber && (
        <Text style={styles.errorText}>{errors.phoneNumber}</Text>
      )}

      {/* Address Fields */}
      <TextInput
        label={t('street')}
        value={street}
        onChangeText={(text) => setStreet(text)}
        mode="outlined"
        style={styles.input}
      />

      <TextInput
        label={t('locality')}
        value={locality}
        onChangeText={(text) => setLocality(text)}
        mode="outlined"
        style={styles.input}
      />

      <TextInput
        label={t('administrativeArea')}
        value={administrativeArea}
        onChangeText={(text) => setAdministrativeArea(text)}
        mode="outlined"
        style={styles.input}
      />

      <TextInput
        label={t('city')}
        value={city}
        onChangeText={(text) => setCity(text)}
        mode="outlined"
        style={styles.input}
      />

      <TextInput
        label={t('state')}
        value={state}
        onChangeText={(text) => setState(text)}
        mode="outlined"
        style={styles.input}
      />

      <Button
        mode="contained"
        onPress={handleSubmit}
        color={customTheme.colors.primary} // Uses theme primary color
        style={styles.button}
        contentStyle={styles.buttonContent}
        labelStyle={styles.buttonLabel}
        disabled={isSubmitting} // Disable button while submitting
      >
        {isSubmitting ? (
          <ActivityIndicator animating={true} color={customTheme.colors.surface} />
        ) : (
          t('getOTP')
        )}
      </Button>

      {/* OTP Dialog */}
      <MessageDialog
        visible={otpDialogVisible}
        onDismiss={handleOTPDialogDismiss}
        title={t('dialogs.otpTitle')}
        message={t('dialogs.otpMessage', { otp })}
        buttonLabel={t('dialogs.ok')}
      />

      {/* Error Dialog */}
      <MessageDialog
        visible={errorDialogVisible}
        onDismiss={() => setErrorDialogVisible(false)}
        title={t('dialogs.errorTitle')}
        message={t('dialogs.errorMessage', { message: errorDialogMessage })}
        buttonLabel={t('dialogs.ok')}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: customTheme.colors.background, // Uses theme background color
    padding: 16,
    justifyContent: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: customTheme.colors.text, // Uses theme text color
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 10,
    backgroundColor: customTheme.colors.surface, // Ensures background consistency
  },
  button: {
    marginTop: 20,
    alignSelf: 'center',
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
  errorText: {
    color: 'red',
    marginBottom: 10,
    marginLeft: 4,
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

export default UserDetailsScreen;
