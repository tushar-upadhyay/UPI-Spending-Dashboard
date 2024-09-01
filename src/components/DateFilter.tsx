import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { FilterContext } from '../contexts/dataProviderContext';
import { Typography } from '@mui/material';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function DateFilter(props: any) {
  const { filters, setFilters } = React.useContext(FilterContext);

  function changeFrom(date?: Date) {
    if (filters && filters.dateFilter && date) {
      filters.dateFilter.from = date;
    }
    setFilters({ ...filters });
  }
  function changeTo(date?: Date) {
    if (filters && filters.dateFilter && date) {
      filters.dateFilter.to = date;
    }
    setFilters({ ...filters });
  }

  return (


    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="From"
          slotProps={{ textField: { size: 'small' } }}
          minDate={dayjs(filters?.dateFilter?.minDate)}
          maxDate={dayjs(filters?.dateFilter?.to)}
          value={dayjs(filters?.dateFilter?.from)}
          onChange={(newValue) => changeFrom(newValue?.toDate())}
        />
        <DatePicker
          label="To"
          slotProps={{ textField: { size: 'small' } }}
          minDate={dayjs(filters?.dateFilter?.from)}
          maxDate={dayjs(filters?.dateFilter?.maxDate)}
          value={dayjs(filters?.dateFilter?.to)}
          onChange={(newValue) => changeTo(newValue?.toDate())}
        />
      </LocalizationProvider>
    </div>

  );
}