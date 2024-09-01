import { CircularProgress } from "@mui/material";


interface ShowProps {
    show: boolean;
    children: any;
}


export default function Show(props: ShowProps) {
    if(props.show){
        return props.children;
    }
    return null;
}