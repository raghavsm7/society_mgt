import React, { useEffect, useState } from 'react'
import {
    Text,
    View,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Alert,
  } from "react-native";

import { Picker } from "@react-native-picker/picker";
import { apiService } from '@/services/api';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '@/types/navigation';
import Toast from 'react-native-toast-message';

type NavigationProp = StackNavigationProp<RootStackParamList>;

interface ManualEntryProps {
  setActiveSection: (section: string | null) => void;
}

export const Manual_Entry = ({ setActiveSection }: ManualEntryProps) => {
    const navigation = useNavigation<NavigationProp>();
    const [formData, setFormData] = useState({
        visitorType: "",
        vehicleNo: "",
        name: "",
        phoneNo: "",
        flatNo: "",
        societyCode: ""
      });
      
      const [submitting, setSubmitting] = useState(false);
      const [manualEntryType, setManualEntryType] = useState("delivery");
      const [loading, setLoading] = useState(false);

      useEffect(() => {
        const fetchGuardDetails = async () => {
          try {
            const guardDetails = await apiService.getGuardDetails();
            console.log("Guard Details: ", guardDetails.data);
            
            const firstGuard = guardDetails.data.length > 0 ? guardDetails.data[0] : null;

            if (firstGuard) {
              setFormData((prev) => ({
                ...prev,
                societyCode: firstGuard?.societyCode
              }))
            }
          } catch (error) {
            console.log(error);
          }
        }
        fetchGuardDetails();
      }, [])
    
      const handleInputChange = (name: string, value: string) => {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      };
    
      const validateForm = () => {
        if (!formData.visitorType || !formData.name || !formData.phoneNo || !formData.flatNo) {
          // Alert.alert('Error', 'Please fill all required fields');
          Toast.show({
            type: "error",
            text1: "Error",
            text2: "Please fill all required fields",
            position: "top",
            visibilityTime: 3000,
          })
          return false;
        }
        // Check if phone number is exactly 10 digits
    if (!/^\d{10}$/.test(formData.phoneNo)) {
    Toast.show({
      type: "error",
      text1: "Invalid Phone Number",
      text2: "Phone number must be exactly 10 digits",
      position: "top",
      visibilityTime: 3000,
    });
    return false;
  }
        return true;
      };
      
      const handleSubmit = async () => {
          if(!validateForm()) 
            return;
          setSubmitting(true);
          try {
            setLoading(true);
            await apiService.addManualEntryByGuard({
              ...formData,
              societyCode: formData.societyCode
            });
            // clear form and reload data
            setFormData({flatNo: '', phoneNo: '', name: '', visitorType: '', vehicleNo: '', societyCode: formData.societyCode}); 
            setManualEntryType('delivery');
            console.log(formData) //current user's Id
            Toast.show({
              type: "success",
              text1: "Success",
              text2: "Entry submitted successfully!",
              position: "top",
              visibilityTime: 1000,
              onHide: () => {
                setActiveSection(null);  // Reset the active section in parent
                navigation.navigate('UserDashboard');
              }
            })
            // Alert.alert(
            //   "Success", 
            //   "Entry submitted successfully!",
            //   [
            //     {
            //       text: "OK",
            //       onPress: () => {
            //         setActiveSection(null);  // Reset the active section in parent
            //         navigation.navigate('UserDashboard');
            //       }
            //     }
            //   ]
            // );
          } catch (error) {
            // Alert.alert('Error', 'Failed to add manual entry');
            Toast.show({
              type: "error",
              text1: "Error",
              text2: "Failed to add manual entry",
              position: "top",
              visibilityTime: 3000,
            })
          } finally {
            setLoading(false);
            setSubmitting(false);
          }
      };
    
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
    <View style={styles.section}>
    <Text style={styles.subtitle}>Manual Entry Content</Text>
   
    <View style={styles.manualEntryForm}>
      {/* Visitor Type Picker */}
      <Text style={styles.label}>Visitor Type</Text>
      <Picker
        selectedValue={manualEntryType}
        onValueChange={(value) => {
        setManualEntryType(value)
        handleInputChange('visitorType', value)
      }}
        style={styles.picker}
      >
        <Picker.Item label="Delivery Boy" value="delivery" />
        <Picker.Item label="Maid" value="maid" />
        <Picker.Item label="Garbage Collector" value="garbage" />
        <Picker.Item label="Plumber" value="plumber" />
        <Picker.Item label="Electrician" value="electrician" />
        <Picker.Item label="Others" value="others" />
      </Picker>

      {/* Name Input */}
      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={formData.name}
        onChangeText={(text) => handleInputChange("name", text)}
      />

      {/* Vehicle Number Input */}
      <Text style={styles.label}>Vehicle Number (if any)</Text>
      <TextInput
        style={styles.input}
        placeholder="Vehicle Number (if any)"
        value={formData.vehicleNo}
        onChangeText={(text) => handleInputChange("vehicleNo", text) }
      />

      {/* Phone Number Input */}
      <Text style={styles.label}>Phone Number</Text>
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={formData.phoneNo}
        onChangeText={(text) => handleInputChange("phoneNo", text)}
        keyboardType="phone-pad"
      />

      {/* Flat/House Number Input */}
      <Text style={styles.label}>Flat/House Number</Text>
      <TextInput
        style={styles.input}
        placeholder="Flat/House Number"
        value={formData.flatNo}
        onChangeText={(text) => handleInputChange("flatNo", text)}
      />

      {/* Submit Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit}
        disabled={submitting}
      >
        {submitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Submit</Text>
        )}
      </TouchableOpacity>
    </View>
  </View>
  </View>
  </ScrollView>
  )
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 16,
        backgroundColor: "#f9f9f9",
      },
      card: {
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 16,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
      },
    section: {
        marginTop: 16,
      },
      subtitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 8,
      }, 
      label: {
        marginBottom: 8,
        color: "#555",
      },
      manualEntryForm: {
        padding: 16,
        backgroundColor: "#fff",
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      picker: {
        height: 50,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        backgroundColor: "#f9f9f9",
      },
      input: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 4,
        padding: 8,
        marginRight: 8,
        marginBottom: 12,
      },
      button: {
        backgroundColor: "#007bff",
        borderRadius: 4,
        padding: 8,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20
      },
      buttonText: {
        color: "#fff",
        fontWeight: "bold",
      },
})
