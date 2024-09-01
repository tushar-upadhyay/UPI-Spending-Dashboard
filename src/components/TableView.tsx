import styled from "@emotion/styled";
import { Typography } from "@mui/material";

interface TabelViewData {
    title: string;
    value: string;
}
interface TabelViewProps {
    data: TabelViewData[]
}


const Div = styled.div({
        display: 'grid',
        columnGap: '50px',
        rowGap:"16px",
        gridTemplateColumns: 'auto auto',
        padding: '10px',   
});

export default function TableView(props: TabelViewProps) {
    return (
        <div style={{display:'flex',justifyContent:'center'}}>
        <Div>
            {props.data.map((data: TabelViewData,index: number)=>{
                return (
                        <div key={index}>
                          <Typography variant="h6" key={index + data.title}>{data.title}:</Typography>  
                     
                          <Typography variant="h6" key={index + data.value}>{data.value}</Typography>  
                   
                    </div>
                )
            })}
        </Div>
        </div>
    )
}