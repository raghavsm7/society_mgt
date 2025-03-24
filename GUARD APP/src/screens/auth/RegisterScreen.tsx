import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView, Image, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { AuthScreenProps } from '@/types/navigation';
import { useAuth } from '@/context/AuthContext';
import * as ImagePicker from 'expo-image-picker';
// import PhoneInput from 'react-native-phone-number-input';
import * as Yup from 'yup';
const HomeImg = require("../../../assets/auth/bg.png")
import * as Updates from 'expo-updates';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  societyCode: Yup.string().required('Society code is required'),
  phone: Yup.string().matches(/^\d{10}$/, 'Phone number must be exactly 10 digits') // Only 10 digits allowed
  .required('Phone number is required'),
});

export const RegisterScreen: React.FC<AuthScreenProps<'Register'>> = ({ navigation }) => {
  const { register, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    societyCode: '',
    phone: '',
    profilePicture: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setFormData(prev => ({ ...prev, profilePicture: result.assets[0].uri }));
    }
  };

  const handleRegister = async () => {
    try {
      await validationSchema.validate(formData, { abortEarly: false });

      console.log("Before calling register function");
      
      await register({
        ...formData,
        role: 'guard',
      });
      console.log("After calling register function, Registration successful!");
      
      // await Updates.reloadAsync();
      //Reset form data 
      setFormData({
        name: '',
        email: '',
        password: '',
        societyCode: '',
        phone: '',
        profilePicture: '',
      })
      // setErrors({});
      
    } catch (error: unknown) {
      if (error instanceof Yup.ValidationError) {
        const newErrors: Record<string, string> = {};
        error.inner.forEach((err) => {
          if (err.path) {
            newErrors[err.path] = err.message;
          }
        });
        setErrors(newErrors);
      } else if (error instanceof Error) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert('Error', 'An unexpected error occurred');
      }
    }
  };

  return (
    <ImageBackground source={HomeImg} style={styles.backgroundImage}>
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.title}>REGISTER</Text>
          <Text style={styles.subtitle}>Hello users, please create your account</Text>

          <TouchableOpacity style={styles.profilePictureContainer} onPress={pickImage}>
            {formData.profilePicture ? (
              <Image source={{ uri: formData.profilePicture }} style={styles.profilePicture} />
            ) : (
              <View style={styles.profilePicturePlaceholder}>
                <Icon name="camera-alt" size={40} color="#666" />
                <Text style={styles.profilePictureText}>Add Photo</Text>
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Icon name="person" size={24} color="#666" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                value={formData.name}
                onChangeText={(text) => {
                  setFormData(prev => ({ ...prev, name: text }));
                  setErrors(prev => ({ ...prev, name: '' }));
                }}
              />
            </View>
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

            <View style={styles.inputWrapper}>
              <Icon name="email" size={24} color="#666" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Email Address"
                value={formData.email}
                onChangeText={(text) => {
                  setFormData(prev => ({ ...prev, email: text }));
                  setErrors(prev => ({ ...prev, email: '' }));
                }}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

            <View style={styles.inputWrapper}>
              <Icon name="lock" size={24} color="#666" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={formData.password}
                onChangeText={(text) => {
                  setFormData(prev => ({ ...prev, password: text }));
                  setErrors(prev => ({ ...prev, password: '' }));
                }}
                secureTextEntry
              />
            </View>
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

           
<View style={styles.inputWrapper}>
<Icon name="phone" size={24} color="#666" style={styles.icon} />
  <TextInput
    style={[styles.input, { backgroundColor: '#fff', borderRadius: 10 }]}
    placeholder="Enter phone number"
    keyboardType="phone-pad"
    value={formData.phone}
    onChangeText={(text) => {
      setFormData((prev) => ({ ...prev, phone: text }));
      setErrors((prev) => ({ ...prev, phone: '' }));
    }}
  />
</View>
{errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}

            <View style={styles.inputWrapper}>
              <Icon name="apartment" size={24} color="#666" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Society Code"
                value={formData.societyCode}
                onChangeText={(text) => {
                  setFormData(prev => ({ ...prev, societyCode: text.toUpperCase() }));
                  setErrors(prev => ({ ...prev, societyCode: '' }));
                }}
                autoCapitalize="characters"
              />
            </View>
            {errors.societyCode && <Text style={styles.errorText}>{errors.societyCode}</Text>}
          </View>

          <TouchableOpacity 
            style={[styles.registerButton, isLoading && styles.disabledButton]} 
            onPress={handleRegister}
            disabled={isLoading}
          >
            <Text style={styles.registerButtonText}>
              {isLoading ? 'Registering...' : 'Register'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.loginLink}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.loginText}>
              Already have an account? <Text style={styles.loginTextBold}>Login</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1, // Ensures the image takes up the whole screen
    justifyContent: 'center', // Center the content vertically
    alignItems: 'center', // Center the content horizontally
  },
  container: {
    flex: 1,
    // backgroundColor: '#fff',
    width: '100%',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    // color: 'blue',
    color: '#2196F3',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  profilePictureContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profilePicturePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    // backgroundColor: '#f5f5f5',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profilePictureText: {
    color: '#666',
    marginTop: 5,
    fontSize: 12,
  },
  inputContainer: {
    gap: 20,
    marginBottom: 30,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
  },
  // phoneInputWrapper: {
  //   marginVertical: 10,
  // },
  phoneInputContainer: {
    width: '100%',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
  },
  phoneInputTextContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    padding: 15,
    fontSize: 16,
  },
  registerButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: -15,
    marginLeft: 5,
  },
  loginLink: {
    alignItems: 'center',
  },
  loginText: {
    fontSize: 16,
    color: '#fff',
  },
  loginTextBold: {
    // color: 'aqua',
    color: '#2196F3',
    fontWeight: 'bold',
  },
});