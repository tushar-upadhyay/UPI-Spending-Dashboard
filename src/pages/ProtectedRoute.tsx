import { Navigate, Outlet } from 'react-router-dom'
import { DataProviderContext, FilterContext } from '../contexts/dataProviderContext';
import { useContext, useState } from 'react';
import { Filter } from '../interfaces/transaction';
export const PrivateRoutes = () => {
    const { data } = useContext(DataProviderContext);
    const [filters,setFilters] = useState<Filter | null>(null);
    if (!!data) {
        return (
            <FilterContext.Provider value={{filters,setFilters}}>
                <Outlet />
            </FilterContext.Provider>
        )
    }
    return <Navigate to='/' />

}