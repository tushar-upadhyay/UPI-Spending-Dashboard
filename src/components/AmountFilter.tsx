import * as React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import { FilterContext } from '../contexts/dataProviderContext';
import { Button, Input, TextField, Typography } from '@mui/material';

function valuetext(value: number) {
  return `₹${value}`;
}

export default function AmountFilter() {
  const { filters, setFilters } = React.useContext(FilterContext);
  const [localAmount, setLocalAmount] = React.useState<[number, number]>([filters?.amountFilter?.greaterThan || 0, filters?.amountFilter?.lessThan || 0]);
  const [error, setError] = React.useState<boolean>(false);

  function setAmount(newValue: [number, number]) {

    if (filters && filters.amountFilter) {
      filters.amountFilter.greaterThan = newValue[0];
      filters.amountFilter.lessThan = newValue[1];
      if (newValue[1] < newValue[0]) {
        filters.amountFilter.greaterThan = newValue[1] - 1;
      }
    }
    setFilters({ ...filters });
  }

  React.useEffect(() => {
    setError(false)
    setLocalAmount([filters?.amountFilter?.greaterThan || 0, filters?.amountFilter?.lessThan || 0])
  }, [filters]);

  function validateAmount() {
    const [min, max] = localAmount;
    if (min > max) {
      setError(true)
    }

    else {
      setAmount(localAmount);
    }

  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 18, justifyContent: 'center' }}>

      <Box sx={{ width: 300 }}>

        <Slider
          size="small"
          getAriaLabel={() => 'Amount'}
          max={filters?.amountFilter?.max}
          value={[filters?.amountFilter?.greaterThan || 0, filters?.amountFilter?.lessThan || 0]}
          onChange={(_: any, value: any) => setAmount(value)}
          valueLabelDisplay="auto"
        />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <TextField
            label="Min"
            value={localAmount[0]}
            size="small"

            error={error}
            style={{ maxWidth: 100 }}
            onChange={(e: any) => setLocalAmount([Number.isNaN(e.target.value) ? 0 : Number(e.target.value), localAmount[1]])}
          /><TextField
            value={localAmount[1]}
            size="small"
            label="Max"

            error={error}
            style={{ maxWidth: 100 }}
            onChange={(e: any) => setLocalAmount([localAmount[0], Number.isNaN(e.target.value) ? 0 : Number(e.target.value)])}
          />
          <Button onClick={validateAmount} variant='contained'>Set!</Button>

        </div>
      </Box>
    </div>
  );
}