import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Text, Switch, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
import { apiService } from '@/services/api';
import { User } from '@/types/auth';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardCard } from '@/components/dashboard/DashboardCard';
import { MembersScreen } from '@/components/members/MembersScreen';
import { FooterTabs } from '@/components/navigation/FooterTabs';
import { NoticeBoard } from '@/components/noticeBoard/NoticeBoard';
import { AdminNoticeBoard } from '@/components/noticeBoard/AdminNoticeBoard';
import { Profile } from '@/components/profile/Profile';
import { Members_Visitors } from '@/components/visitors/Members_Visitors';
import Payment from '@/components/payment/Payment';
import BookAmenities from '@/components/bookAmenities/BookAmenities';
import HelpDesk from '@/components/helpDesk/HelpDesk';
import { FinanceService } from '@/components/finance/financeService';
import Toast from 'react-native-toast-message';
const MemberImg = require("../../../assets/home/members.png");
const VisitorImg = require("../../../assets/home/visitor.png")
const NoticeBoardImg = require("../../../assets/home/noticeBoard.png");
const PaymentImg = require("../../../assets/home/payment.png")
const BookAmenitiesImg = require("../../../assets/home/bookAmenities.png")
const HelpDeskImg = require("../../../assets/home/helpDesk.png")

type TabType = 'home' | 'community' | 'service' | 'profile';

export const AdminDashboard = () => {
  // const [activeSection, setActiveSection] = useState<'Members' | 'Visitors' | 'Notice Board' | 'Payment' | 'Book Amenities' | 'Help Desk'>(null);
  const { logout, user } = useAuth();
  const [residents, setResidents] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [isFinanceEnabled, setIsFinanceEnabled] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const societyCode = user?.societyCode || '';

  useEffect(() => {
    loadResidents();
  }, []);

  const loadResidents = async () => {
    if (!user?.societyCode) return;
    
    try {
      setIsLoading(true);
      const response = await apiService.getSocietyResidents(user.societyCode);
    setResidents(response.residents);
    } catch (error) {
      console.error('Failed to load residents:', error);
      setResidents([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveUser = async (userId: string) => {
    if (!user?.societyCode) return;
    try {
      await apiService.approveUser(user.societyCode, userId);
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "User approved successfully.",
        position: "top",
        visibilityTime: 3000,
      })
      await loadResidents();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to approve user.",
        position: "top",
        visibilityTime: 3000,
      })
      // console.error('Failed to approve user:', error);
    }
  };

  const handleDisApproveUser = async (userId: string) => {
    if (!user?.societyCode) return;
    try {
      await apiService.disApproveUser(user.societyCode, userId);
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "User disapproved successfully.",
        position: "top",
        visibilityTime: 3000,
      })
      await loadResidents();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to disapprove user.",
        position: "top",
        visibilityTime: 3000,
      })
      // console.error('Failed to disApprove user:', error);
    }
  };

  const handleSaveChanges = () => {
    // Add your save logic here
    console.log("Finance feature enabled:", isFinanceEnabled);
  };

  const dashboardCards = [
    { image: MemberImg, title: 'Members' },
    { image: VisitorImg, title: 'Visitors' },
    { image: NoticeBoardImg, title: 'Notice Board' },
    { image: PaymentImg, title: 'Payment' },
    { image: BookAmenitiesImg, title: 'Book Amenities' },
    { image: HelpDeskImg, title: 'Help Desk' },
  ];

  const renderContent = () => {
    if (activeTab === 'service') {
      return <FinanceService />
    //   return (
    //     <View style={styles.toggleContainer}>
    //   {/* Header */}
    //   <View style={styles.header}>
    //     <Text style={styles.headerText}>Admin Settings</Text>
    //   </View>

    //   {/* Financial Features Section */}
    //   <View style={styles.featureContainer}>
    //     <View style={styles.featureDetails}>
    //       <Text style={styles.featureTitle}>Financial Features</Text>
    //       <Text style={styles.featureDescription}>
    //         Enable or disable financial features for normal users
    //       </Text>
    //     </View>

    //     <Switch
    //       value={isFinanceEnabled}
    //       onValueChange={(value) => setIsFinanceEnabled(value)}
    //       trackColor={{ false: "#d1d5db", true: "#2563eb" }}
    //       thumbColor={isFinanceEnabled ? "#ffffff" : "#ffffff"}
    //     />
    //   </View>

    //   {/* Save Changes Button */}
    //   <TouchableOpacity style={styles.button} onPress={handleSaveChanges}>
    //     <Text style={styles.buttonText}>Save Changes</Text>
    //   </TouchableOpacity>
    // </View>
    //   );
    }

    if(activeTab === 'community') {
      return (
        <NoticeBoard societyCode={societyCode}/>
      )
    }

    if (activeTab === 'profile') {
      return ( <Profile />)
    }
  
    if (activeSection === 'Members') {
      return (
        <MembersScreen
          residents={residents}
          isAdmin={true}
          onApprove={handleApproveUser}
          onDisApprove={handleDisApproveUser}
          societyCode={societyCode}
        />
      );
    }

    if (activeSection === 'Notice Board') {
      return (
        <AdminNoticeBoard />
      )
    }

    if (activeSection === 'Visitors') {
      return (
        < Members_Visitors/>
      )
    }

    if (activeSection === 'Payment') {
      return ( <Payment />)
    }

    if (activeSection === 'Book Amenities') {
      return ( <BookAmenities />)
    }

    if (activeSection === 'Help Desk') {
      return ( <HelpDesk />)
    }

    return (
      <ScrollView style={styles.content}>
        <View style={styles.cardsContainer}>
          {dashboardCards.map((card, index) => (
            <DashboardCard
              key={index}
              image={card.image}
              title={card.title}
              onPress={() => setActiveSection(card.title)}
            />
          ))}
        </View>
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <DashboardHeader 
        user={user} 
        onLogout={logout}
        showBackButton={activeSection !== null}
        // showBackButton={false}
        onBack={() => setActiveSection(null)}
      />

      <View style={styles.mainContent}>
        {renderContent()}
      </View>

      <FooterTabs
        activeTab={activeTab}
        onTabPress={setActiveTab}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  mainContent: {
    flex: 1,
    height: '70%',
    // marginBottom: '10%',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  cardsContainer: {
    // flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  comingSoon: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  comingSoonText: {
    fontSize: 18,
    color: '#666',
  },
  header: {
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
  },
  featureContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    marginTop: 16,
  },
  featureDetails: {
    flex: 1,
    marginRight: 8,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
  },
  featureDescription: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 4,
  },
  button: {
    marginTop: 24,
    backgroundColor: "#2563eb",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  toggleContainer: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    padding: 16,
    marginTop: 20
  },
});