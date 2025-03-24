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
import { FinanceService } from '@/components/finance/financeService';
import { Members_Visitors } from '@/components/visitors/Members_Visitors';
import { Profile } from '@/components/profile/Profile';
import Payment from '@/components/payment/Payment';
import BookAmenities from '@/components/bookAmenities/BookAmenities';
import HelpDesk from '@/components/helpDesk/HelpDesk';
// import { FinanceTracker } from '@/components/finance/FinanceTracker';

const MemberImg = require("../../../assets/home/members.png");
const VisitorImg = require("../../../assets/home/visitor.png")
const NoticeBoardImg = require("../../../assets/home/noticeBoard.png");
const PaymentImg = require("../../../assets/home/payment.png")
const BookAmenitiesImg = require("../../../assets/home/bookAmenities.png")
const HelpDeskImg = require("../../../assets/home/helpDesk.png")

type TabType = 'home' | 'community' | 'service' | 'profile';

export const UserDashboard = () => {
  const { logout, user } = useAuth();
  const [residents, setResidents] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [isFinanceEnabled, setIsFinanceEnabled] = useState(false);


  const societyCode = user?.societyCode || '';

  // useEffect(() => {
  //   if (user?.isApproved) {
  //     loadResidents();
  //   }
  // }, [user?.isApproved]);

  // const loadResidents = async () => {
  //   if (!user?.societyCode) return;
    
  //   try {
  //     setIsLoading(true);
  //     const data = await apiService.getSocietyResidents(user.societyCode);
  //     setResidents(data.residents);
  //   } catch (error) {
  //     console.error('Failed to load residents:', error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

 const dashboardCards = [
    // { image: MemberImg, title: 'Members' },
    { image: VisitorImg, title: 'Visitors' },
    // { image: NoticeBoardImg, title: 'Notice Board' },
    { image: PaymentImg, title: 'Payment' },
    { image: BookAmenitiesImg, title: 'Book Amenities' },
    { image: HelpDeskImg, title: 'Help Desk' },
  ];

  const renderContent = () => {

    

    if(activeTab === 'community') {
      // return (<NoticeBoard societyCode={societyCode} />)
      return <NoticeBoard societyCode={societyCode} />
    }
    
    if (activeTab === 'service') {
      return  <FinanceService />
    }

    if (activeTab === 'profile') {
      return ( <Profile />)
    }


    if (!user?.isApproved) {
      return (
        <View style={styles.pendingContent}>
          <Text style={styles.pendingMessage}>
            Your account is pending approval from society admin
          </Text>
        </View>
      );
    }

    // return activeSection === 'Members' ? (
    //   <MembersScreen 
    //     residents={residents}
    //     isAdmin={false}
    //     societyCode={societyCode}
    //   />
    // ) : (
    //   <ScrollView style={styles.content}>
    //     <View style={styles.cardsContainer}>
    //       {dashboardCards.map((card, index) => (
    //         <DashboardCard
    //           key={index}
    //           image={card.image}
    //           title={card.title}
    //           onPress={() => setActiveSection(card.title)}
    //         />
    //       ))}
    //     </View>
    //   </ScrollView>
    // );


    // if (activeSection === 'Notice Board') {
    //   return <NoticeBoard societyCode={societyCode} />;
    // }
  
    if (activeSection === 'Members') {
      return (
        <MembersScreen
          residents={residents}
          isAdmin={false}
          societyCode={societyCode}
        />
      );
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
  },
  content: {
    flex: 1,
    padding: 16,
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  pendingContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  pendingMessage: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
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
});