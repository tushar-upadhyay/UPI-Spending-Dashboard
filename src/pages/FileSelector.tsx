import { Button, Container, Typography } from "@mui/material";
import styled from "@emotion/styled"
import { useFilePicker } from "use-file-picker";
import { useContext, useEffect, useState } from "react";
import { DataProvider, TransactionRecord } from '../interfaces/transaction';
import { FileContent } from "use-file-picker/dist/interfaces";
import { parseGoogleActivityData, parsePhonePayPdfData } from "../utilties/pdfParser";
import Loading from "../components/Show";
import { DataProviderContext } from "../contexts/dataProviderContext";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Show from "../components/Show";
import { useNavigate } from "react-router-dom";
import { FlexDiv, VerticalSpace, FlexDivRow, Pointer } from "../components/CustomComponents";


export default function FileSelector() {

    const { openFilePicker, filesContent, loading } = useFilePicker({
        readAs: 'ArrayBuffer',
        multiple: false
    });

    const [app, setApp] = useState<string>('');

    const navigate = useNavigate();


    function navigateToDashboard() {
        navigate('/dashboard');
    }

    const { setData, data } = useContext(DataProviderContext);

    function openFile(app: string) {
        setApp(app);
        openFilePicker();
    }

    async function parsePhonePeFile(file: FileContent<ArrayBuffer>) {
        const buffer = file.content;
        const array = new Uint8Array(buffer);
        const transactionRecord = await parsePhonePayPdfData(array);
        const newData: DataProvider = {
            ...data,
           PhonePe:{
            data: transactionRecord,
            fileName: file.name
           }
        }
        setData(newData);
    }
    function parseGooglePeFile(file: FileContent<ArrayBuffer>) {
        const transactionRecord =  parseGoogleActivityData(file);
        const newData: DataProvider = {
            ...data,
           GooglePe:{
            data: transactionRecord,
            fileName: file.name
           }
        }
        setData(newData);
    }

    useEffect(() => {
        if (filesContent.length > 0)
            if (app === 'phonePe') {
                parsePhonePeFile(filesContent[0]);
            }
            else {
                parseGooglePeFile(filesContent[0]);
            }
    }, [filesContent])

    return (

        <FlexDiv>
            <Typography variant="h2">
                Lets get started by uploading transactions PDF file!
            </Typography>
            <VerticalSpace height="18" />
            <Typography variant="h6">
                Don't worry , data will never leave your device!
            </Typography>

            <FlexDivRow>
                <Button color={!!data?.PhonePe ? "success" : 'primary'} onClick={() => openFile('phonePe')} size="large" variant="contained">
                    {!!data?.PhonePe ? data.PhonePe.fileName : 'Upload Phone Pe'}
                </Button>

                <Button color={!!data?.GooglePe ? "success" : 'primary'} onClick={() => openFile('googlePay')} size="large" variant="contained">
                    {!!data?.GooglePe ? data.GooglePe.fileName : 'Upload Google Pe'}
                </Button>
            </FlexDivRow>
            <VerticalSpace height="64" />
            <Show show={!!data}>
                <Typography variant="h4">
                    <Pointer onClick={navigateToDashboard}>Lets visualize your data 🚀🚀 <ArrowForwardIcon />           </Pointer>

                </Typography>
            </Show>
        </FlexDiv>


    )

}