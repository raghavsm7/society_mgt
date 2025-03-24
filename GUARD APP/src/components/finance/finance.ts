export type Expense = {
    _id: string;
    spentDate: string;
    description: string;
    amount: number;
    // societyCode: string;
    createdBy: {
        name: string;
        _id: string;
    }
};

export type Fund = {
    _id: string;
    // date: string;
    flatNo: string;
    description: string;
    amount: string;
    // societyCode: string;
    paidForMonth: string;
    createdBy: string;
}

export type FinancialBalance = {
    totalFunds: number;
    totalExpenses: number;
    balance: number;
}