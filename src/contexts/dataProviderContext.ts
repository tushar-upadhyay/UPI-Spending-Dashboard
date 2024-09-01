import React from "react";
import { DataProviderContextType, FilterContextType } from "../interfaces/transaction";

export const DataProviderContext = React.createContext<DataProviderContextType>({
    setData: ()=>{},
    data:null,
    combinedData: null
});


export const FilterContext = React.createContext<FilterContextType>({
    setFilters:()=>{},
    filters: {}
})



