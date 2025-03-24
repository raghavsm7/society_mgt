import { apiService } from "@/services/api";
import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Button,
} from "react-native";

import { CameraView, Camera } from "expo-camera";
import Toast, {BaseToast, ErrorToast, SuccessToast} from "react-native-toast-message";

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
  const [activeTab, setActiveTab] = useState("guest");
  const [showScanner, setShowScanner] = useState(false);
  const [guestVerified, setGuestVerified] = useState(false);
  const [entryId, setEntryId] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [guestDetails, setGuestDetails] = useState<GuestEntry[]>([]);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [afterScan, setAfterScan] = useState(false);

  const validateForm = () => {
    if (!code) {
      // Alert.alert("Error", "Please enter a code");
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please enter a code",
        position: "top", // or "bottom"
      visibilityTime: 3000, // Auto-hide time in ms
      });
      return false;
    }
    return true;
  };

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getCameraPermissions();
  }, []);

  // const handleCodeSubmit = async (code: string) => {
  //   if (!validateForm()) return;
  //   try {
  //     setLoading(true);
  //     const response = await apiService.verifyGuestCode(code);

  //     if (response.data.status === "cancelled") {
  //       Alert.alert("Error", "Guest entry has already cancelled");
  //       return;
  //     }

  //     if (response.data.status === "approved") {
  //       Alert.alert("Error", "Guest already allowed");
  //       return;
  //     }

  //     setGuestVerified(true);
  //     setEntryId(response.data._id);

  //     try {
  //       //Get the specific guest details
  //       const detailResponse = await apiService.getAllGuestEntries();
  //       const currentGuest = detailResponse.data.find(
  //         (guest) => guest._id === response.data._id
  //       );
  //       if (currentGuest) {
  //         setGuestDetails([currentGuest]);
  //         Alert.alert("Success", "Guest code verified successfully!");
  //       } else {
  //         Alert.alert("Error", "Guest details not found");
  //       }
  //     } catch (error) {
  //       Alert.alert("Error", "Failed to fetch guest details");
  //       setGuestVerified(false);
  //     }
  //   } catch (error) {
  //     Alert.alert("Error", "Failed to verify guest code");
  //     setGuestVerified(false);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleBarCodeScanned = async ({ type, data }: { type: string; data: string }) => {
    setScanned(true);
    // setAfterScan(true);

    //Verify the scanned code
    try {
      setLoading(true);
      const response = await apiService.verifyGuestCode(data);

      if (response.data.status === "cancelled") {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Guest entry has already been cancelled",
          position: "top",
          visibilityTime: 3000,
        })
        return;
      }

      if (response.data.status === "approved") {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Guest already allowed",
          position: "top",
          visibilityTime: 3000,
        })
        return;
      }

      setGuestVerified(true);
      setShowScanner(false)
      setEntryId(response.data._id);

      try {
          // Get the specific guest details
          const detailResponse = await apiService.getAllGuestEntries();
          const currentGuest = detailResponse.data.find((guest) => guest._id === response.data._id);

          if (currentGuest) {
            setGuestDetails([currentGuest]);
            Toast.show({
              type: "success",
              text1: "Success",
              text2: "Guest code verified successfully",
              position: "top",
              visibilityTime: 3000,
            })
          } else {
            // Alert.alert("Error", "Guest details not found");
            Toast.show({
              type: "error",
              text1: "Error",
              text2: "Guest details not found",
              position: "top",
              visibilityTime: 3000,
            })
            return;
          }
      } catch (error) {
              Toast.show({
              type: "error",
              text1: "Error",
              text2: "Failed to fetch guest details",
              position: "top",
              visibilityTime: 3000,
            })
            setGuestVerified(false);
            }    

    } catch (error) {
      // Alert.alert("Error", "Failed to verify guest code");
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to verify guest code",
        position: "top",
        visibilityTime: 3000,
      })
      setAfterScan(false);
    } finally {
      setLoading(false);
    }

    Alert.alert(
      "Scan Result",
      `Bar code with type ${type} and data ${data} has been scanned!`
    );
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text>No access to camera</Text>
      </View>
    );
  }

  const handleCodeSubmit = async (code: string) => {
    if (!validateForm()) return;
    try {
      setLoading(true);
      const response = await apiService.verifyGuestCode(code);

      if (response.data.status === "cancelled") {
        // Alert.alert("Error", "Guest entry has already cancelled");
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Guest entry has already been cancelled",
          position: "top",
          visibilityTime: 3000,
        })
        return;
      }

      if (response.data.status === "approved") {
        // Alert.alert("Error", "Guest already allowed");
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Guest already allowed",
          position: "top",
          visibilityTime: 3000,
        })
        return;
      }

      setGuestVerified(true);
      setEntryId(response.data._id);

      try {
        //Get the specific guest details
        const detailResponse = await apiService.getAllGuestEntries();
        const currentGuest = detailResponse.data.find(
          (guest) => guest._id === response.data._id
        );
        if (currentGuest) {
          setGuestDetails([currentGuest]);
          // Alert.alert("Success", "Guest code verified successfully!");
          Toast.show({
            type: "success",
            text1: "Success",
            text2: "Guest code verified successfully!",
            position: "top",
            visibilityTime: 3000,
          })
        } else {
          // Alert.alert("Error", "Guest details not found");
          Toast.show({
            type: "error",
            text1: "Error",
            text2: "Guest details not found",
            position: "top",
            visibilityTime: 3000,
          })
        }
      } catch (error) {
        // Alert.alert("Error", "Failed to fetch guest details");
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Failed to fetch guest details",
          position: "top",
          visibilityTime: 3000,
        })
        setGuestVerified(false);
      }
    } catch (error) {
      // Alert.alert("Error", "Failed to verify guest code");
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to verify guest code",
        position: "top",
        visibilityTime: 3000,
      })
      setGuestVerified(false);
    } finally {
      setLoading(false);
    }
  };

  const handleAllowEntry = async (entryId: string) => {
    if (!entryId) {
      // Alert.alert("Error", "Entry ID is missing");
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Entry ID is missing",
        position: "top",
        visibilityTime: 3000,
      })
      return;
    }
    try {
      await apiService.allowGuest(entryId);
      setGuestVerified(false);
      setCode("");
      setEntryId(null);
      // Alert.alert("Success", "Guest entry allowed successfully!");
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Guest entry allowed successfully!",
        position: "top",
        visibilityTime: 3000,
      })
    } catch (error) {
      // Alert.alert("Error", "Failed to allow guest entry");
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to allow guest entry",
        position: "top",
        visibilityTime: 3000,
      })
    }
  };

  const handleCancelEntry = async (entryId: string) => {
    if (!entryId) {
      // Alert.alert("Error", "Entry ID is missing");
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Entry ID is missing",
        position: "top",
        visibilityTime: 3000,
      })
      return;
    }
    try {
      await apiService.disallowGuest(entryId);
      setGuestVerified(false);
      setCode("");
      setEntryId(null);
      // Alert.alert("Success", "Guest entry disallowed successfully!");
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Guest entry disallowed successfully!",
        position: "top",
        visibilityTime: 3000,
      })
    } catch (error) {
      // Alert.alert("Error", "Failed to disallow guest entry");
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to disallow guest entry",
        position: "top",
        visibilityTime: 3000,
      })
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Entry System</Text>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "guest" && styles.activeTab,
            ]}
            onPress={() => setActiveTab("guest")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "guest" && styles.activeTabText,
              ]}
            >
              Guest Entry
            </Text>
          </TouchableOpacity>
        </View>
        {activeTab === "guest" ? (
          <View style={styles.section}>
            <Text style={styles.subtitle}>Guest Entry Verification</Text>
            {!showScanner ? (
              <>
                <View style={styles.inputGroup}>
                  <TextInput
                    placeholder="Enter code"
                    style={styles.input}
                    value={code}
                    onChangeText={setCode}
                  />
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => handleCodeSubmit(code)}
                  >
                    <Text style={styles.buttonText}>Verify</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => setShowScanner(true)}
                  >
                    <Text style={styles.buttonText}>Scan</Text>
                  </TouchableOpacity>
                </View>
                {guestVerified && (
                  <View style={styles.verifiedSection}>
                    <Text style={[styles.successMessage, styles.boldText]}>
                      Guest code verified successfully!
                    </Text>
                    {guestDetails.map((guest, index) => (
                      <View key={index} style={styles.detailsSection}>
                        <Text style={styles.detailText}>
                          <Text style={styles.boldText}>Guest Name:</Text>{" "}
                          {guest.guestName}
                        </Text>
                        <Text style={styles.detailText}>
                          <Text style={styles.boldText}>Visit Date:</Text>{" "}
                          {new Date(guest.visitDateTime).toLocaleDateString()}
                        </Text>
                        <Text style={styles.detailText}>
                          <Text style={styles.boldText}>Created By:</Text>{" "}
                          {guest.createdBy.name}
                        </Text>
                        <Text style={styles.detailText}>
                          <Text style={styles.boldText}>Flat No:</Text>{" "}
                          {guest.createdBy.flatNo}
                        </Text>
                      </View>
                    ))}
                    <View style={styles.actionButtons}>
                      <TouchableOpacity
                        style={[styles.button, styles.allowButton]}
                        onPress={() => entryId && handleAllowEntry(entryId)}
                      >
                        <Text style={styles.buttonText}>Allow Entry</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.button, styles.cancelButton]}
                        onPress={() => entryId && handleCancelEntry(entryId)}
                      >
                        <Text style={styles.buttonText}>Cancel</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </>
            ) : (
              <View style={styles.cameraContainer}>
                <CameraView
                  onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                  barcodeScannerSettings={{
                    barcodeTypes: ["qr", "pdf417"],
                  }}
                  style={StyleSheet.absoluteFillObject}
                />
                  {scanned && (
                    <Button
                      title="Tap to Scan Again"
                      onPress={() => setScanned(false)}
                    />
                  )}
                {/* </Camera> */}
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => setShowScanner(false) }
                >
                  <Text style={styles.buttonText}>Cancel Scan</Text>
                </TouchableOpacity>
                {afterScan && (
                  <View style={styles.verifiedSection}>
                  <Text style={[styles.successMessage, styles.boldText]}>
                    Guest code verified successfully!
                  </Text>
                  {guestDetails.map((guest, index) => (
                    <View key={index} style={styles.detailsSection}>
                      <Text style={styles.detailText}>
                        <Text style={styles.boldText}>Guest Name:</Text>{" "}
                        {guest.guestName}
                      </Text>
                      <Text style={styles.detailText}>
                        <Text style={styles.boldText}>Visit Date:</Text>{" "}
                        {new Date(guest.visitDateTime).toLocaleDateString()}
                      </Text>
                      <Text style={styles.detailText}>
                        <Text style={styles.boldText}>Created By:</Text>{" "}
                        {guest.createdBy.name}
                      </Text>
                      <Text style={styles.detailText}>
                        <Text style={styles.boldText}>Flat No:</Text>{" "}
                        {guest.createdBy.flatNo}
                      </Text>
                    </View>
                  ))}
                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      style={[styles.button, styles.allowButton]}
                      onPress={() => entryId && handleAllowEntry(entryId)}
                    >
                      <Text style={styles.buttonText}>Allow Entry</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.button, styles.cancelButton]}
                      onPress={() => entryId && handleCancelEntry(entryId)}
                    >
                      <Text style={styles.buttonText}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                )}
              </View>
            )}
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
};

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
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    paddingBottom: 8,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#007bff",
  },
  tabText: {
    color: "#888",
  },
  activeTabText: {
    color: "#007bff",
    fontWeight: "bold",
  },
  section: {
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  inputGroup: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "center",
    gap: 8
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    padding: 8,
    marginRight: 8,
  },
  button: {
    backgroundColor: "#007bff",
    borderRadius: 4,
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  iconButton: {
    backgroundColor: "#1fd655",
    borderRadius: 4,
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  verifiedSection: {
    marginTop: 16,
  },
  successMessage: {
    color: "#28a745",
    marginBottom: 8,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  allowButton: {
    backgroundColor: "#28a745",
  },
  cancelButton: {
    backgroundColor: "#dc3545",
  },
  scannerPlaceholder: {
    height: 200,
    backgroundColor: "#f1f1f1",
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  placeholderText: {
    color: "#888",
  },
  detailsSection: {
    marginVertical: 10,
  },
  detailText: {
    fontSize: 16,
    marginVertical: 4,
  },
  boldText: {
    fontWeight: "bold",
  },
  cameraContainer: {
    flex: 1,
    width: "100%",
    height: 300,
    marginVertical: 10,
  },
  camera: {
    flex: 1,
    width: "100%",
  },
});
