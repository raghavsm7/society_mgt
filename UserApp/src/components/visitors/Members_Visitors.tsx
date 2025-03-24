import { apiService } from '@/services/api';
import React, { useEffect, useState } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, ScrollView, TextInput, Image,
        ActivityIndicator, Button, Modal, 
        Alert} from 'react-native'
import { string } from 'yup';
import { RefreshControl } from 'react-native-gesture-handler';
import DateTimePicker from 'react-native-modal-datetime-picker';
import  Icon from 'react-native-vector-icons/FontAwesome';
import QRCode from 'react-native-qrcode-svg';
import Toast from 'react-native-toast-message';

interface GuestEntry {
    _id: string;
    createdBy: {
        _id: string;
        name: string;
        flatNo: string;
    };
    guestName: string;
    purpose: string;
    visitDateTime: string;
    flatNo: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    code?: string;
}

export const Members_Visitors = () => {

  const [activeTab, setActiveTab] = useState('entry');
  const [guestEntries, setGuestEntries] = useState<GuestEntry[]>([]);
  const [selectedGuest, setSelectedGuest] = useState<GuestEntry | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    guestName: '',
    visitDateTime: '',
  })

  const handleInputChange = (key: keyof typeof formData, value: string) => {
    setFormData((prev) => ({...prev, [key]: value}));
  }

  const validateForm = () => {
    if (formData.guestName === '') {
      // Alert.alert('Error', 'Please enter a guest name');
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please enter a guest name",
        position: "top",
        visibilityTime: 3000,
      })
      return false;
    }
    if (formData.visitDateTime === '') {
      // Alert.alert('Error', 'Please select a visit date and time');
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please select a visit date and time",
        position: "top",
        visibilityTime: 3000,
      })
      return false;
    }

    // Convert selected date to a Date object
    const selectedDate = new Date(formData.visitDateTime);
    const currentDate = new Date();

  //Remove time part from both dates to only compare the date
  selectedDate.setHours(0, 0, 0, 0);
  currentDate.setHours(0, 0, 0, 0);

  if (selectedDate < currentDate) {
    Toast.show({
      type: "error",
      text1: "Invalid Date",
      text2: "You cannot select a past date!",
      position: "top",
      visibilityTime: 3000,
    })
    return false;
  }
    return true;
  }

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
        const response = await apiService.addGuestEntryFromResident(formData);
        // setQrCode(response.qrCodeImage);
        // setUniqueCode(response.guestDetails.code);
        setFormData({guestName: '', visitDateTime: ''});
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Guest entry added successfully!",
          position: "top",
          visibilityTime: 3000,
        })
    } catch (error) {
        console.error('Error at submitting guest entry from resident:', error);
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Failed to add guest entry!",
          position: "top",
          visibilityTime: 3000,
        })
      } finally {
        setLoading(false);
      }
  }

  const fetchGuestHistory = async () => {
    setLoading(true);
    try{
        const response = await apiService.guestEntryHistoryByUser();
        // console.log(response);
        setGuestEntries(response.data);
    } catch (error) {
        console.error('Error at fetching Guest History:', error);
      } finally {
        setLoading(false);
      }
  };

  useEffect(() => {
    if(activeTab === 'history') {
        fetchGuestHistory();
    }
  }, [activeTab])

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchGuestHistory().finally(() => setRefreshing(false));
  }, []);

// refreshControl={
//     <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
//   }

//   const onRefresh = React.useCallback(() => {
//     setRefreshing(true);
//     // setGuestEntries().
//     finally(() => setRefreshing(false));

//   }, [])

const showDatePicker = () => {
    setDatePickerVisibility(true);
  }
  
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  }

  const handleConfirm = (date: Date) => {
    // const formattedDate = date.toLocaleDateString('en-GB');
    const formattedDate = date.toISOString().split('T')[0];
    setFormData((prev) => ({...prev, visitDateTime: formattedDate}))
    hideDatePicker();
  }

  const handlePostPress = (guest: GuestEntry) => {
   setSelectedGuest(guest);
   setModalOpen(true); 
  }

  const closeModal = () => {
    setModalOpen(false);
    setSelectedGuest(null);
  }

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
            onPress={() => setActiveTab('entry')}
            style={[
                styles.tabButton,
                activeTab === 'entry' && styles.activeTabButton,
            ]}
        >
            <Text
                style={[
                    styles.tabText,
                    activeTab === 'entry' && styles.activeTabText
                ]}
            >
            Guest Entry
            </Text>
        </TouchableOpacity>
        <TouchableOpacity
            onPress={() => setActiveTab('history')}
            style={[
                styles.tabButton,
                activeTab === 'history' && styles.activeTabButton
            ]}
        >
            <Text
                style={[
                    styles.tabText,
                    activeTab === 'history' && styles.activeTabText
                ]}
            >
                Guest History
            </Text>
        </TouchableOpacity>
      </View>

    {activeTab === 'entry' ? (
    <ScrollView style={styles.formContainer}>
        <TextInput 
            style={styles.input}
            placeholder='Guest Name'
            value={formData.guestName}
            onChangeText={(text) => handleInputChange('guestName', text)}
        />
        <View style={styles.inputWithIcon}>
        <TextInput 
            style={styles.inputWithIconTextInput}
            placeholder='Visit Date & Time'
            value={formData.visitDateTime}
            editable={false}
        />
        <TouchableOpacity onPress={showDatePicker} style={styles.iconContainer}>
        <Icon name='calendar' size={20} color="gray" />
        </TouchableOpacity>

        <DateTimePicker 
        isVisible={isDatePickerVisible}
        mode='date'
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        />
        </View>
        
        <TouchableOpacity
            onPress={handleSubmit}
            disabled={loading}
            style={[styles.button, loading && styles.buttonDisabled]}
        >
            <Text style={styles.buttonText}>
                {loading ? 'Submitting...' : 'Submit'}
            </Text>
        </TouchableOpacity>

    {/* { uniqueCode && (
        <View style = {styles.resultContainer}>
            <QRCode
                value={uniqueCode}
                size={200}
            />
            <Text style={styles.resultText}>Unique Code: {uniqueCode}</Text>
        </View>
    )} */}
    </ScrollView>
    ) : (
      <View >
     <ScrollView 
     style={styles.historyContainer}
     contentContainerStyle = {{ paddingBottom: 40}}
     refreshControl = {
      <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
     }
     >
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : guestEntries.length > 0 ? (
          guestEntries.map((guest, index) => (
            <TouchableOpacity key={index} onPress={() => handlePostPress(guest)}>
              <View style={styles.entryContainer}>
                <Text style={styles.entryText}>Guest Name: {guest.guestName}</Text>
                <Text style={styles.entryText}>Visit Date: {new Date(guest.visitDateTime).toLocaleDateString()}</Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text >No guest history available.</Text>
        )}
      </ScrollView>

      <Modal 
      visible={modalOpen} 
      transparent={true}
      animationType="slide"
      onRequestClose={closeModal}
      >
    <View style={styles.modalBackground}>
    <View style={styles.modalContainer}>
      {selectedGuest && (
        <>
          <Text style={styles.modalText}>Guest Name: {selectedGuest.guestName}</Text>
          <Text style={styles.modalText}>
            Visit Date: {new Date(selectedGuest.visitDateTime).toLocaleDateString()}
          </Text>
          <View style={styles.qrCodeContainer}>
            <QRCode
              value={selectedGuest.code}
              size={200}
            />
            <Text style={styles.qrCodeText}>Unique Code: {selectedGuest.code}</Text>
          </View>
        </>
      )}
          <Button title="Close" onPress={() => setModalOpen(false)} />
        </View>
      </View>


    </Modal>
    </View>
    )}
    </View>
  )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
    tabContainer: { flexDirection: 'row', marginBottom: 16 },
    tabButton: { flex: 1, padding: 12, alignItems: 'center' },
    activeTabButton: { borderBottomWidth: 2, borderBottomColor: '#007bff' },
    tabText: { color: '#555' },
    activeTabText: { color: '#007bff', fontWeight: 'bold' },
    formContainer: { 
        paddingHorizontal: 16
     },
    input: {
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 8,
      padding: 12,
      marginBottom: 12,
      backgroundColor: '#fff',
    },
    button: {
      backgroundColor: '#007bff',
      padding: 12,
      borderRadius: 8,
      alignItems: 'center',
    },
    buttonDisabled: { backgroundColor: '#a0c4ff' },
    buttonText: { color: '#fff', fontWeight: 'bold' },
    resultContainer: { marginTop: 16, alignItems: 'center' },
    qrCode: { width: 200, height: 200 },
    resultText: { marginTop: 12, fontSize: 16 },
    historyContainer: { paddingHorizontal: 16 },
    entryContainer: {
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 8,
      padding: 12,
      marginBottom: 12,
      backgroundColor: '#fff',
    },
    entryText: { marginBottom: 4 },
    icon: {
        marginLeft: 10,
      },
      inputWithIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        marginBottom: 12,
        backgroundColor: '#fff',
        paddingHorizontal: 12, // Padding for the overall input container
      },
      inputWithIconTextInput: {
        flex: 1, // Take up the remaining space
        height: 40,
        fontSize: 16,
      },
      iconContainer: {
        padding: 8, // Add padding to make the touchable area larger
      },
      modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        // marginBottom: 50,
      },
      modalContainer: {
        width: '80%',
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 2 },
        elevation: 5,
        // marginBottom: 50,
      },
      modalText: {
        fontSize: 18,
        marginBottom: 10,
        color: '#333',
      },
      qrCodeContainer: {
        alignItems: 'center',
        marginTop: 20,
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
      },
      qrCodeText: {
        marginTop: 12,
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        textAlign: 'center',
        marginBottom: 10,
      },
  });
