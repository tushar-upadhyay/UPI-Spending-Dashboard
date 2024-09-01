import { AppBar, Card, CardContent, CardHeader, CardMedia, Container, Typography } from "@mui/material";
import { DataProviderContext, FilterContext } from "../contexts/dataProviderContext";
import { useContext, useState } from "react";
import TableView from "../components/TableView";
import { DatePicker } from "@mui/x-date-pickers";
import DateFilter from "../components/DateFilter";

import { App, Filter, FilterContextType } from "../interfaces/transaction";
import { UseFilteredData } from "../Hooks/useFilteredData";
import Filters from "../components/Filter";
import PhonePeCard from "../components/PhonePeCard";
import Chart from "../components/Chart";
import { AnchorTemporaryDrawer } from "../components/Drawer";
import { FlexDivRow } from "../components/CustomComponents";

export default function Home() {
    return (
        <>
        <AppBar></AppBar>
            <div style={{ padding: 24 }}>
                <AnchorTemporaryDrawer />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <FlexDivRow>
                        <PhonePeCard app={App.GooglePe} />
                        <PhonePeCard app={App.PhonePe} />
                    </FlexDivRow>

                    <FlexDivRow style={{ justifyContent: 'space-evenly' }}>
                        <Chart type='Credit' />
                        <Chart type='Debit' />
                    </FlexDivRow>
                </div>
            </div>
        </>

    )

}