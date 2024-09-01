import { Card, CardHeader, CardMedia, CardContent } from "@mui/material";
import TableView from "./TableView";
import { UseFilteredData } from "../Hooks/useFilteredData";
import { FlexDiv, FlexDivRow } from "./CustomComponents";
import { PieChart } from "./Chart";
import { App, TransactionRecord } from "../interfaces/transaction";

interface InputProp {
    app: App;
}

export default function PhonePeCard(props: InputProp) {

    const data = UseFilteredData();
    console.log(data)

    if(!data){
        return <></>
    }

    if(!data[props.app].show){
        return <></>
    }

    function getPhonePeData() {
        return [{
            title: 'Total Credited',
            value: `₹${data && data[props.app].totalCredited}`
        }, {

            title: 'Total Debited',
            value: `₹${data && data[props.app].totalDebited}`

        }];

    }


    return (
        
   
        <Card variant="elevation" sx={{ maxWidth: 400, margin: '16px' ,height:200}}>
            <CardMedia
                component="img"
                height={80}
                sx={{ objectFit: 'contain' }}
                image={require(`../assets/${props.app}.png`)}
            />
            {/* <CardHeader
                subheader={`${data?.phonePe.data.transactions[0]?.date.toLocaleDateString()} - ${data?.phonePe.data.transactions[data.phonePe.data.transactions.length - 1]?.date.toLocaleDateString()}`}
            /> */}
            
            <CardContent >
                <TableView data={getPhonePeData()} />
            </CardContent>
        </Card>
    
    )
}