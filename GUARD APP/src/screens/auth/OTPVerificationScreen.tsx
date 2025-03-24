// import React, { useState } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { AuthScreenProps } from '@/types/navigation';

// export const OTPVerificationScreen: React.FC<AuthScreenProps<'OTPVerification'>> = ({ 
//   navigation, 
//   route 
// }) => {
//   const { phoneNumber } = route.params;
//   const [otp, setOtp] = useState(['', '', '', '']);

//   const handleVerify = () => {
//     const otpString = otp.join('');
//     if (otpString.length !== 4) {
//       alert('Please enter a valid OTP');
//       return;
//     }
//     navigation.navigate('Home');
//   };

//   const handleOtpChange = (value: string, index: number) => {
//     const newOtp = [...otp];
//     newOtp[index] = value;
//     setOtp(newOtp);

//     // Auto-focus next input
//     if (value && index < 3) {
//       const nextInput = document.querySelector(`#otp-${index + 1}`) as HTMLInputElement;
//       if (nextInput) nextInput.focus();
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.content}>
//         <Text style={styles.title}>OTP VERIFICATION</Text>
//         <Text style={styles.subtitle}>
//           Please enter OTP we sent to you on your mobile no.
//         </Text>

//         <View style={styles.otpContainer}>
//           {otp.map((digit, index) => (
//             <TextInput
//               key={`otp-${index}`}
//               style={styles.otpInput}
//               value={digit}
//               onChangeText={(value) => handleOtpChange(value, index)}
//               keyboardType="numeric"
//               maxLength={1}
//               nativeID={`otp-${index}`}
//             />
//           ))}
//         </View>

//         <TouchableOpacity style={styles.verifyButton} onPress={handleVerify}>
//           <Text style={styles.verifyButtonText}>Verify</Text>
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   content: {
//     flex: 1,
//     padding: 20,
//     justifyContent: 'center',
//   },
//   title: {
//     fontSize: 32,
//     fontWeight: 'bold',
//     marginBottom: 10,
//     textAlign: 'center',
//   },
//   subtitle: {
//     fontSize: 16,
//     color: '#666',
//     marginBottom: 30,
//     textAlign: 'center',
//   },
//   otpContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginHorizontal: 50,
//     marginBottom: 30,
//   },
//   otpInput: {
//     width: 45,
//     height: 45,
//     borderWidth: 1,
//     borderColor: '#000',
//     borderRadius: 8,
//     fontSize: 24,
//     textAlign: 'center',
//     backgroundColor: '#f5f5f5',
//   },
//   verifyButton: {
//     backgroundColor: '#2196F3',
//     padding: 15,
//     borderRadius: 10,
//     alignItems: 'center',
//     marginTop: 30,
//   },
//   verifyButtonText: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
// });