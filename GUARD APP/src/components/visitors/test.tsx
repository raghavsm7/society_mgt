// import { Picker } from '@react-native-picker/picker';
// import React, { useState } from 'react';
// import {
//   Text,
//   View,
//   StyleSheet,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
//   ActivityIndicator,
// } from 'react-native';

// export const Members_Visitors = () => {
//   const [activeTab, setActiveTab] = useState('entry');
//   const [scanMode, setScanMode] = useState('scan');
//   const [manualCode, setManualCode] = useState('');
//   const [guestEntries, setGuestEntries] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [currentGuest, setCurrentGuest] = useState(null);
//   const [manualEntryType, setManualEntryType] = useState('delivery');

//   const handleQRScan = async () => {
//   // const handleQRScan = async (code) => {

//     // setLoading(true);
//     // try {
//     //   const response = await fetch('http://your-api-url/api/guest/verify', {
//     //     method: 'POST',
//     //     headers: {
//     //       'Content-Type': 'application/json',
//     //     },
//     //     body: JSON.stringify({ code }),
//     //   });
//     //   const data = await response.json();
//     //   setCurrentGuest(data);
//     // } catch (error) {
//     //   console.error('Error:', error);
//     // } finally {
//     //   setLoading(false);
//     // }
//   };

//   const handleManualSubmit = async () => {
//     // if (!manualCode) return;
//     // await handleQRScan(manualCode);
//   };

//   const handleManualEntry = async () => {
//   // const handleManualEntry = async (formData) => {
//     // setLoading(true);
//     // try {
//     //   await fetch('http://your-api-url/api/guest/manual-entry', {
//     //     method: 'POST',
//     //     headers: {
//     //       'Content-Type': 'application/json',
//     //     },
//     //     body: JSON.stringify(formData),
//     //   });
//     //   setManualCode('');
//     // } catch (error) {
//     //   console.error('Error:', error);
//     // } finally {
//     //   setLoading(false);
//     // }
//   };

//   const handleAllowGuest = async () => {
//     // setLoading(true);
//     // try {
//     //   await fetch('http://your-api-url/api/guest/allow', {
//     //     method: 'POST',
//     //     headers: {
//     //       'Content-Type': 'application/json',
//     //     },
//     //     body: JSON.stringify({ guestId: currentGuest.id }),
//     //   });
//     //   setCurrentGuest(null);
//     // } catch (error) {
//     //   console.error('Error:', error);
//     // } finally {
//     //   setLoading(false);
//     // }
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.tabContainer}>
//         <TouchableOpacity
//           style={[
//             styles.tabButton,
//             activeTab === 'entry' && styles.activeTabButton,
//           ]}
//           onPress={() => setActiveTab('entry')}
//         >
//           <Text style={styles.tabText}>Guest Entry</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={[
//             styles.tabButton,
//             activeTab === 'history' && styles.activeTabButton,
//           ]}
//           onPress={() => setActiveTab('history')}
//         >
//           <Text style={styles.tabText}>Manual Entry</Text>
//         </TouchableOpacity>
//       </View>

//       <ScrollView contentContainerStyle={styles.content}>
//         {activeTab === 'entry' ? (
//           <View style={styles.entrySection}>
//             <View style={styles.switchContainer}>
//               <TouchableOpacity
//                 style={[
//                   styles.switchButton,
//                   scanMode === 'scan' && styles.activeSwitchButton,
//                 ]}
//                 onPress={() => setScanMode('scan')}
//               >
//                 <Text style={styles.switchText}>Scan QR</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={[
//                   styles.switchButton,
//                   scanMode === 'manual' && styles.activeSwitchButton,
//                 ]}
//                 onPress={() => setScanMode('manual')}
//               >
//                 <Text style={styles.switchText}>Enter Code</Text>
//               </TouchableOpacity>
//             </View>

//             {scanMode === 'manual' ? (
//               <View style={styles.formContainer}>
//                 <TextInput
//                   style={styles.input}
//                   placeholder="Enter visitor code"
//                   value={manualCode}
//                   onChangeText={(text) => setManualCode(text)}
//                 />
//                 <TouchableOpacity
//                   style={styles.button}
//                   onPress={handleManualSubmit}
//                   disabled={loading}
//                 >
//                   {loading ? (
//                     <ActivityIndicator color="#fff" />
//                   ) : (
//                     <Text style={styles.buttonText}>Confirm</Text>
//                   )}
//                 </TouchableOpacity>
//               </View>
//             ) : (
//               <View style={styles.qrPlaceholder}>
//                 <Text style={styles.placeholderText}>QR Scanner Placeholder</Text>
//               </View>
//             )}

//             {currentGuest && (
//               <View style={styles.guestDetails}>
//                 <Text style={styles.detailText}>
//                   {/* Guest Name: {currentGuest.guestName} */}
//                 </Text>
//                 <Text style={styles.detailText}>
//                   {/* Flat Number: {currentGuest.flatNumber} */}
//                 </Text>
//                 <TouchableOpacity
//                   style={[styles.button, styles.allowButton]}
//                   onPress={handleAllowGuest}
//                 >
//                   <Text style={styles.buttonText}>Allow</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   style={[styles.button, styles.cancelButton]}
//                   onPress={() => setCurrentGuest(null)}
//                 >
//                   <Text style={styles.buttonText}>Cancel</Text>
//                 </TouchableOpacity>
//               </View>
//             )}
//           </View>
//         ) : (
//           <View style={styles.manualEntryForm}>
//   {/* Visitor Type Picker */}
//   <Text style={styles.label}>Visitor Type</Text>
//   <Picker
//     selectedValue={manualEntryType}
//     onValueChange={(value) => setManualEntryType(value)}
//     style={styles.picker}
//   >
//     <Picker.Item label="Delivery Boy" value="delivery" />
//     <Picker.Item label="Maid" value="maid" />
//     <Picker.Item label="Garbage Collector" value="garbage" />
//     <Picker.Item label="Plumber" value="plumber" />
//     <Picker.Item label="Electrician" value="electrician" />
//     <Picker.Item label="Others" value="others" />
//   </Picker>

//   {/* Vehicle Number Input */}
//   <Text style={styles.label}>Vehicle Number (if any)</Text>
//   <TextInput
//     style={styles.input}
//     placeholder="Vehicle Number (if any)"
//     value={manualCode}
//     onChangeText={(text) => setManualCode(text)}
//   />

//   {/* Name Input */}
//   <Text style={styles.label}>Name</Text>
//   <TextInput
//     style={styles.input}
//     placeholder="Name"
//     // value={currentGuest?.name || ''}
//     // onChangeText={(text) => setCurrentGuest({ ...currentGuest, name: text })}
//   />

//   {/* Phone Number Input */}
//   <Text style={styles.label}>Phone Number</Text>
//   <TextInput
//     style={styles.input}
//     placeholder="Phone Number"
//     // value={currentGuest?.phone || ''}
//     // onChangeText={(text) => setCurrentGuest({ ...currentGuest, phone: text })}
//     keyboardType="phone-pad"
//   />

//   {/* Flat/House Number Input */}
//   <Text style={styles.label}>Flat/House Number</Text>
//   <TextInput
//     style={styles.input}
//     placeholder="Flat/House Number"
//     // value={currentGuest?.flatNumber || ''}
//     // onChangeText={(text) =>
//     //   setCurrentGuest({ ...currentGuest, flatNumber: text })
//     // }
//   />

//   {/* Submit Button */}
//   <TouchableOpacity
//     style={[styles.button, loading && styles.disabledButton]}
//     onPress={() => {
//       setLoading(true);
//       // handleManualEntry({
//       //   visitorType: manualEntryType,
//       //   vehicleNo: manualCode,
//       //   ...currentGuest,
//       // });
//       setLoading(false);
//     }}
//     disabled={loading}
//   >
//     {loading ? (
//       <ActivityIndicator color="#fff" />
//     ) : (
//       <Text style={styles.buttonText}>Submit</Text>
//     )}
//   </TouchableOpacity>
// </View>
//         )}
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f9f9f9',
//     padding: 16,
//   },
//   tabContainer: {
//     flexDirection: 'row',
//     marginBottom: 16,
    
//   },
//   tabButton: {
//     flex: 1,
//     padding: 12,
//     backgroundColor: '#e0e0e0',
//     alignItems: 'center',
//     borderRadius: 8,
//     marginHorizontal: 8,
//   },
//   activeTabButton: {
//     backgroundColor: '#2196F3',
//   },
//   tabText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   content: {
//     paddingBottom: 16,
//   },
//   entrySection: {
//     padding: 16,
//     backgroundColor: '#fff',
//     borderRadius: 8,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   switchContainer: {
//     flexDirection: 'row',
//     marginBottom: 16,
//   },
//   switchButton: {
//     flex: 1,
//     padding: 12,
//     backgroundColor: '#e0e0e0',
//     alignItems: 'center',
//     borderRadius: 8,
//     marginHorizontal: 8
//   },
//   activeSwitchButton: {
//     backgroundColor: '#2196F3',
//   },
//   switchText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   formContainer: {
//     marginTop: 16,
//   },
//   input: {
//       borderWidth: 1,
//       borderColor: '#ccc',
//       padding: 12,
//       borderRadius: 8,
//       marginBottom: 16,
//       backgroundColor: '#f9f9f9',
//   },
//   button: {
//     backgroundColor: '#2196F3',
//     padding: 12,
//     alignItems: 'center',
//     borderRadius: 8,
//   },
//   buttonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   qrPlaceholder: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 32,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 8,
//   },
//   placeholderText: {
//     color: '#aaa',
//   },
//   guestDetails: {
//     marginTop: 16,
//     padding: 16,
//     backgroundColor: '#fff',
//     borderRadius: 8,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   detailText: {
//     marginBottom: 8,
//     fontWeight: 'bold',
//   },
//   allowButton: {
//     backgroundColor: '#4CAF50',
//   },
//   cancelButton: {
//     backgroundColor: '#F44336',
//     marginTop: 8,
//   },
//   manualEntryForm: {
//     padding: 16,
//     backgroundColor: '#fff',
//     borderRadius: 8,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   picker: {
//     height: 50,
//     marginBottom: 16,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 8,
//     backgroundColor: '#f9f9f9',
//   },
//   label: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginBottom: 8,
//     color: '#333',
//   },
//   disabledButton: {
//     backgroundColor: '#aaa',
//   },
  
// });

// export default Members_Visitors;
