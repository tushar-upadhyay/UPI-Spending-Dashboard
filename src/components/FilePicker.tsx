import { useFilePicker } from 'use-file-picker';
import React, { useEffect, useState } from 'react';
import { FileContent } from 'use-file-picker/dist/interfaces';
// import {GlobalWorkerOptions} from 'pdfjs-dist';
import { parsePhonePayPdfData} from '../utilties/pdfParser';
import { TransactionRecord } from '../interfaces/transaction';

// GlobalWorkerOptions.workerSrc = worker;

// import { PDFExtract } from 'pdf.js-extract';
// const pdfExtract = new PDFExtract();
export default function FilePicker() {
  const { openFilePicker, filesContent, loading } = useFilePicker({
    accept: '.pdf',
    readAs:'ArrayBuffer'

  });

  const [transactionRecord,setTransactionRecord] = useState<TransactionRecord>();

  async function parseFile(file: FileContent<ArrayBuffer>) {
    const buffer = file.content;
    const array = new Uint8Array(buffer);
    const transactionRecord = await parsePhonePayPdfData(array);
    setTransactionRecord(transactionRecord);
  }

  useEffect(()=>{
        if(filesContent.length>0)
        parseFile(filesContent[0]);
  },[filesContent])

  if (loading) {
    return <div>Loading...</div>;
  }

  if(transactionRecord){
    return (
        <div>
            <h1>Total Credited: {transactionRecord.totalCredited}</h1>
            <h1>Total Debited: {transactionRecord.totalDebited}</h1>
        </div>
    )
  }

  return (
    <div>
      <button onClick={() => openFilePicker()}>Select files</button>
      <br />
      {filesContent.map((file, index) => (
        <div>
          <h2>{file.name}</h2>
          {/* <div key={index}>{file}</div> */}
          <br />
        </div>
      ))}
    </div>
  );

}