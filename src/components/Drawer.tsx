import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { FixedDiv, VerticalSpace } from './CustomComponents';
import Show from './Show';
import CancelIcon from '@mui/icons-material/Cancel';
import { Typography } from '@mui/material';
import './styles.css'
import DateFilter from './DateFilter';
import AmountFilter from './AmountFilter';



export const AnchorTemporaryDrawer = () => {
    const [state, setState] = React.useState(true);

    function toggle() {
        setState((state) => !state);
    }

    const list = () => (
        <Box
            sx={{ width: 400}}
            role="presentation"
        >
            <FixedDiv onClick={toggle} top={0} right={0} style={{ backgroundColor: 'transparent', padding: 0, marginTop: 16 }}>
                <CancelIcon />
            </FixedDiv>
            <div className='drawer-body'>
                <Typography variant='h5'>
                    Dashboard Filters
                </Typography>
                <Typography variant='body2'>
                    Filters will be applied to the dashboard
                </Typography>
                <VerticalSpace height='18'/>
                <Typography variant='body1'>
                    Date Range
                </Typography>
                <VerticalSpace height='16'/>
                <DateFilter />
                
                <VerticalSpace height='18'/>
                <Typography variant='body1'>
                    Amount Range
                </Typography>
              
                <AmountFilter />


            </div>

        </Box>
    );

    return (
        <div>
            <Show show={!state}>
                <FixedDiv onClick={toggle} bottom={0} right={0}>
                    <FilterAltIcon style={{color:'white'}}/>
                </FixedDiv>
            </Show>
            <Drawer
                anchor={'right'}
                open={state}
                onClose={toggle}
            >
                {list()}
            </Drawer>

        </div>
    );
}
