import { useEffect, useState } from "react";
import { App, DataProvider, TransactionRecord } from "../interfaces/transaction";

export default function UseCombinedData(): [DataProvider | null, React.Dispatch<React.SetStateAction<DataProvider | null>>, TransactionRecord | null] {
    const [dataProviderValue, setDataProviderValue] = useState<DataProvider | null>(null);
    const [combinedData, setCombinedData] = useState<TransactionRecord | null>(null);

    useEffect(() => {
        if (dataProviderValue) {
    
            const apps = Object.keys(App) as App[];
            
            let combinedData: TransactionRecord | null = null;

            apps.forEach((app: App) => {
                const dataProvider = dataProviderValue[app];
                if (dataProvider) {
                    if (combinedData !== null) {
                        combinedData.totalCredited += dataProvider.data.totalCredited;
                        combinedData.totalDebited += dataProvider.data.totalDebited;
                        combinedData.transactions = combinedData.transactions.concat(dataProvider.data.transactions);
                    }
                    else {
                        combinedData = dataProvider.data;
                    }
                    combinedData.totalCredited = Number(combinedData.totalCredited.toFixed(2));
                    combinedData.totalDebited = Number(combinedData.totalDebited.toFixed(2));
                }

            });
            if (combinedData) {
                
                setCombinedData(combinedData);
            }
        }
    }, [dataProviderValue])

    return [dataProviderValue, setDataProviderValue, combinedData]


}