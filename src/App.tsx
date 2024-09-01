
import { Box } from '@mui/material';
import FileSelector from './pages/FileSelector';
import { DataProviderContext, FilterContext } from './contexts/dataProviderContext';
import { BrowserRouter, Route, RouterProvider, Routes, createBrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import { useState } from 'react';
import { DataProvider } from './interfaces/transaction';
import { PrivateRoutes } from './pages/ProtectedRoute';
import UseCombinedData from './Hooks/useCombinedData';


function App() {

  const [dataProviderValue,setDataProviderValue,combinedData] = UseCombinedData();

  return (
    <Box height={'100vh'}>
    <DataProviderContext.Provider value={{combinedData:combinedData,data:dataProviderValue,setData:setDataProviderValue}}>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<FileSelector />}></Route>
          <Route element={<PrivateRoutes />} >

            <Route path='/dashboard' element={<Home />}>
            </Route>

            </Route>
            
        </Routes>
        </BrowserRouter>
    </DataProviderContext.Provider>
    </Box>
  );
}

export default App;
