import { useContext, useEffect, useState } from "react";
import { DataProviderContext, FilterContext } from "../contexts/dataProviderContext";
import { AppTotalData, DataProvider, Filter, FilteredData, Transaction, TransactionRecord } from "../interfaces/transaction";


export function UseFilteredData() {
    const { combinedData } = useContext(DataProviderContext);
    const { filters, setFilters } = useContext(FilterContext);
    const [filteredData, setFilteredData] = useState<FilteredData | null>();
    useEffect(() => {
        const d = filter();
        if (d) {
            setFilteredData(d)
        }
    }, [filters]);

    useEffect(() => {
        if (combinedData?.transactions && combinedData.transactions.length>0) {
            setFilters(setInitialFilters(combinedData?.transactions));
        }
    }, [combinedData]);


    function setInitialFilters(transactions: Transaction[]): Filter {
        const filter: Filter = {

        };
        
        transactions.sort((a,b)=> a.date.getTime() - b.date.getTime())

        const startDate = transactions[0].date;
        const endDate = transactions[transactions.length - 1].date;
        console.log(startDate,endDate)
        filter.dateFilter = { from: startDate, to: endDate, maxDate: endDate, minDate: startDate };
        filter.sortFilter = { sortedBy: 'date', sortOrder: 'asc' };

        let lowestAmount = Infinity;
        let highestAmount = 0;

        for (let i = 0; i < transactions.length; i++) {
            const amount = transactions[i].amount;
            if (amount < lowestAmount) {
                lowestAmount = amount;
            }
            if (amount > highestAmount) {
                highestAmount = amount;
            }
        }

        filter.amountFilter = { greaterThan: lowestAmount, lessThan: highestAmount, max: highestAmount };
        return filter;


    }

    function filter(): FilteredData | null {
        let tempData = structuredClone(combinedData);
        if (tempData !== null) {
            const appTotalData: AppTotalData = {
                GooglePe: {
                    show: false,
                    totalCredited: 0,
                    totalDebited: 0
                },
                PhonePe: {
                    show: false,
                    totalCredited: 0,
                    totalDebited: 0
                }
            }
            if (tempData) {

                if (filters?.amountFilter) {

                    const filter = filters.amountFilter;

                    tempData.transactions = tempData.transactions.filter((data: any) => (data.amount >= filter.greaterThan && data.amount <= filter.lessThan));

                }
                if (filters?.dateFilter) {
                    const filter = filters.dateFilter;
                    tempData.transactions = tempData.transactions.filter((data: any) => data.date > filter.from && data.date < filter.to);
                }
                let amountCredited = 0;
                let amountDebited = 0;
                tempData.transactions.forEach((transaction: Transaction) => {
                    if (transaction.type === 'Credit') {
                        const app = transaction.app;
                        appTotalData[app].show = true;
                        appTotalData[app].totalCredited += transaction.amount;
                        appTotalData[app].totalCredited = Number(appTotalData[app].totalCredited.toFixed(2))
                        amountCredited += transaction.amount;
                    }
                    if (transaction.type === 'Debit') {
                        const app = transaction.app;
                        appTotalData[app].show = true;
                        appTotalData[app].totalDebited += transaction.amount;
                        appTotalData[app].totalDebited = Number(appTotalData[app].totalDebited.toFixed(2))
                        amountDebited += transaction.amount;
                    }
                });
                tempData.totalCredited = Number(amountCredited.toFixed(2));
                tempData.totalDebited = Number(amountDebited.toFixed(2));
            }

            const filteredData: FilteredData = {
                combinedData: tempData,
                ...appTotalData

            }
            return filteredData;
        }
        return null;

    }

    return filteredData;

}