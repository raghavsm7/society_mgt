import React, { useEffect, useState } from 'react'
import { Text, View, TextInput, Button, StyleSheet, Alert, ScrollView, ActivityIndicator } from "react-native";
import { useAuth } from '@/context/AuthContext';
import { Expense, FinancialBalance, Fund } from './finance';
import { apiService } from '@/services/api';
import { RefreshControl } from 'react-native-gesture-handler';
import DateTimePicker from 'react-native-modal-datetime-picker';
// import DateTimePickerModal from 'react-native-modal-datetime-picker'

  export const FinanceService = () => {
    const {user} = useAuth();
    const [activeTab, setActiveTab] = useState<'overview' | 'monthly' | 'add'>('overview');
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [funds, setFunds] = useState<Fund[]>([]);
    const [balance, setBalance] = useState<FinancialBalance | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [newFund, setNewFund] = useState({
      // date: '',
      flatNo: '',
      description: '',
      amount: '',
      paidForMonth: '',
    })
    const [newExpense, setNewExpense] = useState({
      // date: "",
      spentDate: "",
      description: "",
      amount: "",
    });

    useEffect(() => {
      if(user) {
        loadFinancialData();
      }
    }, [user])

    const loadFinancialData = async () => {
      try{
        setLoading(true);
        setError(null);
        const [expensesData, fundsData, balanceData] = await Promise.all([
          apiService.getExpenses(),
          apiService.getFunds(),
          apiService.getFinancialBalance()
        ]);

        setExpenses(expensesData);
        // console.log("EXPENSE", expensesData)
        setFunds(fundsData);
        // console.log("FUNDS", fundsData)
        setBalance(balanceData);
        // console.log("BALANCE", balanceData)
      } catch (error) {
        setError('Failed to load financial data. Please try again.');
        Alert.alert('Error', 'Failed to load financial data');
      } finally {
        setLoading(false);
      }
    }

    if (!user) {
      return (
        <View style={styles.centeredView}>
          <Text style={styles.lockedText}>Please login to access finances</Text>
        </View>
      );
    }

    const isCashier = user.role === 'cashier';

    //Group data by month
    const getMonthlyData = () => {
      const monthlyData: {
        [key: string] : {
          funds: Fund[];
          expenses: Expense[];
          totalFunds: number;
          totalExpenses: number;
        }
      } = {};

      //Group funds by month
      funds.forEach(fund => {
        const monthYear = fund.paidForMonth //"July 2024"
        if(!monthlyData[monthYear]) {
          monthlyData[monthYear] = {
            funds: [],
            expenses: [],
            totalFunds: 0,
            totalExpenses: 0
          };
        }
        monthlyData[monthYear].funds.push(fund);
        monthlyData[monthYear].totalFunds += Number(fund.amount);
      });

      //Group expenses by month
      expenses.forEach(expense => {
        const date = new Date(expense.spentDate);
        const monthYear = `${date.toLocaleString('default', {month: 'long'})} ${date.getFullYear()}`;

        if (!monthlyData[monthYear]) {
          monthlyData[monthYear] = {
            funds: [],
            expenses: [],
            totalFunds: 0,
            totalExpenses: 0
          };
        }
        monthlyData[monthYear].expenses.push(expense);
        monthlyData[monthYear].totalExpenses += Number(expense.amount);
      });

      // For debugging
      // console.log('Monthly Data', monthlyData);
      return monthlyData;
    }

    const handleAddFund = async () => {
      if(!validateForm('fund')) return;
      try {
        setLoading(true);
        await apiService.addFund({
          ...newFund,
          // date: formatDate(newFund.date),
          amount: Number(newFund.amount),
          // memberId: user?._id || '',
          // createdBy: user._id
        });
        //clear form and reload data
        setNewFund({flatNo: '', description: '', amount: '', paidForMonth: ''});
        loadFinancialData();
        console.log(newFund) //current user's Id
      } catch (error) {
        Alert.alert('Error', 'Failed to add fund');
      } finally {
        setLoading(false);
      }
    }
    
    const handleAddExpense = async () => {
      try{
        setLoading(true);
        await apiService.addExpense({
          ...newExpense,
          amount: Number(newExpense.amount),
        });

        //clear form and reload data
        setNewExpense({spentDate: '', description: '', amount: ''});
        loadFinancialData();
        Alert.alert('Success', 'Expense added successfully');
      } catch (error) {
        Alert.alert('Error', 'Failed to add expense');
      } finally {
        setLoading(false);
      }
    };

    const formatDate = (date: string) => {
      try {
        return new Date(date).toISOString().split('T')[0]; 
      } catch {
        return '';
      }
    }

    const validateForm = (type: 'fund' | 'expense') => {
      if(type === 'fund') {
        if(!newFund.flatNo || !newFund.amount || !newFund.paidForMonth) {
          Alert.alert('Error', 'Please fill all required fields');
          return false;
        }
        if (isNaN(Number(newFund.amount)) || Number(newFund.amount) <= 0) {
          Alert.alert('Error', 'Please enter a valid amount');
          return false;
        }
      } else {
        if (!newExpense.spentDate || !newExpense.description || !newExpense.amount) {
          Alert.alert('Error', 'Please fill all the required fields');
          return false;
        }
        if (isNaN(Number(newExpense.amount)) || Number(newExpense.amount) <= 0) {
          Alert.alert('Error', 'Please enter a valid amount');
          return false;
        }
      }
      return true;
    }

    const onRefresh = React.useCallback(() => {
      setRefreshing(true);
      loadFinancialData().finally(() => setRefreshing(false));
    }, []);

    const showDatePicker = () => {
      setDatePickerVisibility(true);
    }
    
    const hideDatePicker = () => {
      setDatePickerVisibility(false);
    }

    const handleConfirm = (date: Date) => {
      setSelectedDate(date);
      hideDatePicker();
    }

    const getFilteredData = () => {
      const monthYear = selectedDate.toLocaleString('default', {month: 'long', year: 'numeric'});
      const filteredData = getMonthlyData()[monthYear] || {funds: [], expenses: [], totalFunds: 0, totalExpenses: 0}
      return filteredData;
    };
    
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Society Finance Management</Text>

        {/* Updated Tab Navigation */}
        <View style={styles.tabContainer}>
          <Button
            title="Overview"
            onPress={() => setActiveTab("overview")}
            color={activeTab === "overview" ? "blue" : "gray"}
          />
          <Button
            title="Monthly View"
            onPress={() => setActiveTab("monthly")}
            color={activeTab === "monthly" ? "blue" : "gray"}
          />
        {isCashier && (
          <Button
          title='Add Entries'
          onPress={() => setActiveTab('add')}
          color={activeTab === 'add' ? 'blue' : 'gray'}
          />
        )}
        </View>
        
        {loading && (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
      )}

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

        {/* Monthly View Section */}
        {activeTab === 'monthly' && (
            <ScrollView
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
              }
              >
          <View>
            <Text style={styles.sectionTitle}>Monthly Financial Report</Text>
            <Button title='Select Month/Year' onPress={showDatePicker} />

            <DateTimePicker
              isVisible={isDatePickerVisible}
              mode='date'
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
              />

              <View style={styles.monthlyCard}>
                <Text style={styles.monthTitle}>
                  {selectedDate.toLocaleString('default', {month: 'long', year: 'numeric'})}
                </Text>

              {/* Move data fetching outside of JSX */}
              {(() => {
                const data = getFilteredData();
                return (
                  <View>
                    <View style={styles.monthlyOverview}>
              <Text>Total Funds: {data.totalFunds}</Text>
              <Text>Total Expense: {data.totalExpenses}</Text>
              <Text>Balance: {data.totalFunds - data.totalExpenses}</Text>
              </View>

              <Text style={styles.subTitle}>Funds Received</Text>
              {data.funds.map(fund => (
                <View key={fund._id} style={styles.entryItem}>
                  <Text>Flat {fund.flatNo}: {fund.amount}</Text>
                  <Text>{fund.description}</Text>
                  </View>
              ))}

              <Text style={styles.subTitle}>Expenses</Text>
            {data.expenses.map(expense => (
              <View key={expense._id} style={styles.entryItem}>
                <Text>{expense.description}: {expense.amount}</Text>
                </View>
                ))}
              </View>
    )
})()}

</View>
          </View>
            </ScrollView>
          // <View>
          //   <Text style={styles.sectionTitle}>Monthly Financial Report</Text>
          //   <ScrollView
          //     refreshControl={
          //       <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
          //     }
          //   >
          //     {Object.entries(getMonthlyData()).map(([month, data]) => (
          //       <View key={month} style={styles.monthlyCard}>
          //         <Text style={styles.monthTitle}>{month}</Text>

          //         <View style={styles.monthlyOverview}>
          //           <Text>Total Funds: {data.totalFunds}</Text>
          //           <Text>Total Expenses: {data.totalExpenses}</Text>
          //           <Text>Balance: {data.totalFunds - data.totalExpenses}</Text>
          //         </View>

          //         <Text style={styles.subTitle}>Funds Received</Text>
          //         {data.funds.map(fund => (
          //           <View key={fund._id} style={styles.entryItem}>
          //             <Text>Flat {fund.flatNo}: {fund.amount}</Text>
          //             <Text>{fund.reason}</Text>
          //           </View>
          //         ))}

          //         <Text style={styles.subTitle}>Expenses</Text>
          //         {data.expenses.map(expense => (
          //           <View key={expense._id} style={styles.entryItem}>
          //             <Text>{expense.reason}: {expense.amount}</Text>
          //             {/* <Text>Added by: {expense.createdBy.name}</Text> */}
          //           </View>
          //         ))}
          //       </View>
          //     ))}
            // </ScrollView>
            // </View>
        )}
  
        {activeTab === "overview" && (
        <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
        }
        >
          {/* Financial Summary Card */}
          <View style={styles.summaryCard}>
            <Text style={styles.sectionTitle}>Financial Overview</Text>
            <View style={styles.balanceContainer}>
              <View style={styles.balanceItem}>
                <Text style={styles.balanceLabel}>Total Funds</Text>
                <Text style={styles.balanceAmount}>{balance?.totalFunds || 0}</Text>
              </View>
              <View style={styles.balanceItem}>
                <Text style={styles.balanceLabel}>Total Expenses</Text>
                <Text style={styles.balanceAmount}>{balance?.totalExpenses || 0}</Text>
              </View>
              <View style={[styles.balanceItem, styles.totalBalance]}>
                <Text style={styles.balanceLabel}>Current Balance</Text>
                <Text style={[
                  styles.balanceAmount,
                  {color: (balance?.balance || 0) >= 0 ? 'green' : 'red'}
                ]}>
                  {balance?.balance || 0}
                </Text>
              </View>
            </View>
          </View>

          {/* Recent Transactions */}
          <View style={styles.transactionsCard}>
              <Text style={styles.sectionTitle}>Recent Transactions</Text>

          {/* Recent Funds */}
          <Text style={styles.subTitle}>Recent Funds Received</Text>
          {funds.slice(0,5).map(fund => (
            <View key={fund._id} style={styles.transactionItem}>
              <View>
                <Text style={styles.transactionTitle}>
                  Flat {fund.flatNo} - {fund.description}
                </Text>
                {/* <Text style={styles.transactionDate}>
                  {new Date(fund.date).toLocaleDateString()}
                </Text> */}
              </View>
              <Text style={styles.transactionAmount}>{fund.amount}</Text>
            </View>
          ))}

          {/* Recent Expenses */}
          <Text style={[styles.subTitle, {marginTop: 20}]}>Recent Expenses</Text>
          {expenses.slice(0, 5).map(expense => (
            <View key={expense._id} style={styles.transactionItem}>
              <View>
                <Text style={styles.transactionTitle}>{expense.description}</Text>
                <Text style={styles.transactionDate}>
                  {new Date(expense.spentDate).toLocaleDateString()}
                </Text>
              </View>
              <Text style={[styles.transactionAmount, {color: 'red'}]}>{expense.amount}</Text>
            </View>
          ))}
          </View>
        </ScrollView>
        )}
  
        {activeTab === "add" && (
          <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
          }
          >
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Add New Fund</Text>
            {/* <TextInput
              style={styles.input}
              placeholder="Date"
              value={newFund.date}
              onChangeText={(text) => setNewFund({ ...newFund, date: text })}
            /> */}
            <TextInput
              style={styles.input}
              placeholder="Flat Number"
              value={newFund.flatNo}
              onChangeText={(text) => setNewFund({ ...newFund, flatNo: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Description"
              value={newFund.description}
              onChangeText={(text) => setNewFund({ ...newFund, description: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Amount"
              value={newFund.amount}
              onChangeText={(text) => setNewFund({ ...newFund, amount: text})}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Month"
              value={newFund.paidForMonth}
              onChangeText={(text) => setNewFund({ ...newFund, paidForMonth: text})}
            />
            <Button 
              title="Add Fund" 
              onPress={handleAddFund}
              disabled={loading} 
            />
      </View>

      {/* Add Expense Form will go here */}
      <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Add New Expense</Text>
            <TextInput
              style={styles.input}
              placeholder="Spent Date"
              value={newExpense.spentDate}
              onChangeText={(text) => setNewExpense({ ...newExpense, spentDate: text})}
            />
            <TextInput
              style={styles.input}
              placeholder="Description"
              value={newExpense.description}
              onChangeText={(text) => setNewExpense({ ...newExpense, description: text})}
            />
            <TextInput
              style={styles.input}
              placeholder="Amount"
              value={newExpense.amount}
              onChangeText={(text) => setNewExpense({ ...newExpense, amount: text})}
              keyboardType="numeric"
            />
            <Button 
              title="Add Expense" 
              onPress={handleAddExpense} 
              disabled={loading}
              />

            </View>
        </ScrollView>
        )}
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: { padding: 16, backgroundColor: "#f9f9f9", flex: 1 },
    title: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 16 },
    tabContainer: { flexDirection: "row", justifyContent: "space-around", marginBottom: 16 },
    // sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },
    sectionTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 16,
      textAlign: 'center',
    },
    centeredView: { flex: 1, justifyContent: "center", alignItems: "center" },
    lockedText: { fontSize: 18, fontWeight: "bold", color: "red" },
    subText: { fontSize: 14, color: "gray", textAlign: "center", marginTop: 8 },
    monthlyCard: {
      backgroundColor: 'white',
      borderRadius: 8,
      padding: 15,
      marginBottom: 15,
      elevation: 2,
    },
    monthTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginVertical: 10,
      textAlign: 'center',
    },
    monthlyOverview: {
      backgroundColor: '#e0f7fa',
      padding: 10,
      borderRadius: 5,
      marginBottom: 10,
    },
    subTitle: {
      fontSize: 18,
      fontWeight: '600',
      marginTop: 10,
      marginBottom: 5,
    },
    entryItem: {
      borderLeftWidth: 3,
      borderLeftColor: '#00796b',
      paddingLeft: 10,
      marginVertical: 5,
    },
    formContainer: {
      padding: 15,
      backgroundColor: 'white',
      borderRadius: 8,
      marginBottom: 15,
    },
    button: {
      backgroundColor: '#00796b',
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
      marginBottom: 15,
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
    datePicker: {
      marginBottom: 20,
    },
    formTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 15,
    },
    input: {
      borderWidth: 1,
      borderColor: '#ddd',
      padding: 10,
      borderRadius: 5,
      marginBottom: 10,
    },
    summaryCard: {
      backgroundColor: 'white',
      borderRadius: 10,
      padding: 15,
      marginBottom: 15,
      elevation: 2,
    },
    balanceContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      marginTop: 10,
    },
    balanceItem: {
      flex: 1,
      minWidth: '30%',
      padding: 10,
      alignItems: 'center',
    },
    balanceLabel: {
      fontSize: 14,
      color: '#666',
      marginBottom: 5,
    },
    balanceAmount: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    totalBalance: {
      backgroundColor: '#f5f5f5',
      borderRadius: 8,
      marginTop: 10,
      width: '100%',
    },
    transactionsCard: {
      backgroundColor: 'white',
      borderRadius: 10,
      padding: 15,
      marginBottom: 15,
      elevation: 2,
    },
    transactionItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
    },
    transactionTitle: {
      fontSize: 16,
      fontWeight: '500',
    },
    transactionDate: {
      fontSize: 12,
      color: '#666',
      marginTop: 2,
    },
    transactionAmount: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    loadingContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(255,255,255,0.7)',
      zIndex: 1000,
    },
    errorContainer: {
      padding: 10,
      backgroundColor: '#ffebee',
      borderRadius: 5,
      marginBottom: 10,
    },
    errorText: {
      color: '#c62828',
      textAlign: 'center',
    },
  });






