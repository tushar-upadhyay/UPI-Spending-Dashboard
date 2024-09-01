export interface Transaction {
    time: string;
    date: Date;
    type: TransactionType;
    amount: number;
    toOrFrom: string
    accountUsed: string;
    app: App;
}



export interface TransactionRecord {
    totalCredited: number;
    totalDebited: number;
    transactions: Transaction[];
}


export type TransactionType = 'Credit' | 'Debit' | 'Cashback';

export interface SelectedFile {
    fileName: string;
    app: App;
}

export interface FilteredData extends AppTotalData {
    
    combinedData: TransactionRecord;
}

export type AppTotalData =  {
    [key in App]: {
        show: boolean;
        totalCredited: number;
        totalDebited: number;
    };
}

export type DataProvider =  {
    [key in App]?: {
        data: TransactionRecord;
        fileName?: string;
    };
}


export interface DataProviderContextType {
    setData: ((data?:any) => void);
    data: DataProvider | null;
    combinedData: TransactionRecord | null;
}

export interface DateFilter {
    from: Date;
    to: Date;
    maxDate: Date;
    minDate: Date;
}

export interface AmountFilter {
    greaterThan: number;
    lessThan: number;
    max: number;
}

export type SortOptions = 'amount' | 'date';

export type SortOrder = 'asc' | 'desc';

export interface SortFilter {
    sortedBy: SortOptions;
    sortOrder: SortOrder;
}

export interface InputProp {
    app: App;
}

export enum App {
    PhonePe = 'PhonePe',
    GooglePe = 'GooglePe'
}

export interface Filter{
    dateFilter?: DateFilter;
    amountFilter?: AmountFilter;
    sortFilter?: SortFilter;
}


export interface FilterContextType {
    setFilters: ((data?:any) => void);
    filters: Filter | null

}