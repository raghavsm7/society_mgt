import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const HomeImg = require("../../../assets/auth/bg.png")
const OnBoardingImg1 = require("../../../assets/onboarding/onboarding1.png");
const OnBoardingImg2 = require("../../../assets/onboarding/onboarding2.png");
const OnBoardingImg3 = require("../../../assets/onboarding/onboarding3.png");

const { width } = Dimensions.get('window');

const slides = [
  {
    id: 1,
    image: HomeImg,
    title: 'Welcome to Society',
    subtitle: '',
    isHome: true
  },
  {
    id: 2,
    image: OnBoardingImg1,
    title: 'Improve your family safety',
    subtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.'
  },
  {
    id: 3,
    image: OnBoardingImg2,
    title: 'Get service staff at your doorstep',
    subtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.'
  },
  {
    id: 4,
    image: OnBoardingImg3,
    title: 'Get notify about events',
    subtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.'
  }
];

export const OnboardingScreen = () => {
  const navigation = useNavigation();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / width);
    setCurrentSlideIndex(currentIndex);
  };

  const completeOnboarding = async () => {
    await AsyncStorage.setItem('hasSeenOnboarding', 'true');
    navigation.navigate('Login' as never);
  }

  const handleNext = async() => {
    if (currentSlideIndex < slides.length - 1) {
      scrollViewRef.current?.scrollTo({
        x: width * (currentSlideIndex + 1),
        animated: true
      });
      setCurrentSlideIndex(currentSlideIndex + 1);
    } else {
      // navigation.navigate('Login' as never);
      await completeOnboarding();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {slides.map((slide, index) => (
          <View key={slide.id} style={styles.slide}>
            {/* <Image source={slide.image} style={styles.image} resizeMode="contain" /> */}
            <Image
          source={slide.image}
          style={[
            styles.image,
            slide.isHome && { width: '90%', height: '70%' } // Increase width and height for HomeImg
          ]}
          resizeMode="contain"
        />
            {slide.isHome ? (
              <Text style={styles.societyName}>{slide.title}</Text>
            ) : (
              <View style={styles.textContainer}>
                <Text style={styles.title}>{slide.title}</Text>
                <Text style={styles.subtitle}>{slide.subtitle}</Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      <View style={styles.pagination}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              currentSlideIndex === index && styles.paginationDotActive
            ]}
          />
        ))}
      </View>

      {currentSlideIndex >= 0 && (
        <TouchableOpacity
          style={styles.button}
          onPress={handleNext}
        >
          <Text style={styles.buttonText}>
            {currentSlideIndex === slides.length - 1 ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  slide: {
    width,
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  image: {
    width: width - 40,
    height: width - 40,
    marginTop: 50,
  },
  societyName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2196F3',
    marginTop: 70,
    textAlign: 'center',
  },
  textContainer: {
    alignItems: 'center',
    marginTop: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#2196F3',
    width: 20,
  },
  button: {
    backgroundColor: '#2196F3',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginBottom: 30,
    marginHorizontal: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});