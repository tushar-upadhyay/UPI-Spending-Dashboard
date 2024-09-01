import * as pdfJsLib from 'pdfjs-dist/webpack.mjs';
import { PDFExtractResult } from '../interfaces/pdfExtract';
import { App, Transaction, TransactionRecord, TransactionType } from '../interfaces/transaction';
import { FileContent } from 'use-file-picker/dist/interfaces';
const extractArray = async (buffer: any, options?: any, cb?: any): Promise<PDFExtractResult> => {
    return new Promise<PDFExtractResult>((resolve: any, reject: any) => {
        options.data = buffer;
        options.password = '7224008629';
        const pdf: any = {
            meta: {},
            pages: [],
            pdfInfo: undefined
        };
        // Will be using promises to load document, pages and misc data instead of callback.
        pdfJsLib.getDocument(options).promise.then((doc: any) => {
            const firstPage = (options && options.firstPage) ? options.firstPage : 1;
            const lastPage = Math.min((options && options.lastPage) ? options.lastPage : doc.numPages, doc.numPages);
            pdf.pdfInfo = doc._pdfInfo;
            const promises = [
                doc.getMetadata().then((data: any) => {
                    pdf.meta = { info: data.info, metadata: data.metadata ? data.metadata.getAll() || null : null };
                })
            ];
            const loadPage = (pageNum: any) => doc.getPage(pageNum).then((page: any) => {
                const viewport = page.getViewport({ scale: 1.0 });
                const pag: any = {
                    pageInfo: {
                        num: pageNum,
                        scale: viewport.scale,
                        rotation: viewport.rotation,
                        offsetX: viewport.offsetX,
                        offsetY: viewport.offsetY,
                        width: viewport.width,
                        height: viewport.height
                    }
                };
                pdf.pages.push(pag);
                const normalizeWhitespace = !!(options && options.normalizeWhitespace === true);
                const disableCombineTextItems = !!(options && options.disableCombineTextItems === true);
                return Promise.all([
                    page.getAnnotations().then((annotations: any) => {
                        pag.links = annotations.filter((annot: any) => annot.subtype === "Link" && !!annot.url)
                            .map((link: any) => link.url);
                    }),
                    page.getTextContent({ disableNormalization: !normalizeWhitespace }).then((content: any) => {
                        // Content contains lots of information about the text layout and styles, but we need only strings at the moment
                        pag.content = content.items.map((item: any) => {
                            const tm = item.transform;
                            let x = tm[4];
                            let y = pag.pageInfo.height - tm[5];
                            if (viewport.rotation === 90) {
                                x = tm[5];
                                y = tm[4];
                            }
                            // see https://github.com/mozilla/pdf.js/issues/8276
                            const height = Math.sqrt(tm[2] * tm[2] + tm[3] * tm[3]);
                            return {
                                x: x,
                                y: y,
                                str: item.str,
                                dir: item.dir,
                                width: item.width,
                                height: height,
                                fontName: item.fontName
                            };
                        });
                    })
                ]).then(() => {
                    // console.log("done page content parsing");
                }, (err) => {
                    reject(err);
                });
            });
            for (let i = firstPage; i <= lastPage; i++) {
                promises.push(loadPage(i));
            }
            return Promise.all(promises);
        }).then(() => {
            pdf.pages.sort((a: any, b: any) => a.pageInfo.num - b.pageInfo.num);
            resolve(pdf);
        }, (err: any) => {
            reject(err)
        });
    })
}

const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

export const parsePhonePayPdfData = async (pdfArray: Uint8Array): Promise<TransactionRecord> => {
    const pdfData = await extractArray(pdfArray, {});
    let totalDebited = 0;
    let totalCredited = 0;
    const transactions: Transaction[] = [];
    pdfData.pages.map((data) => {
        const content = data.content;
        let i = 0;
        while (i < content.length) {
            const contentData = content[i];
            if (contentData.str === 'Debit' || contentData.str === 'Credit') {
                let dateString: string = content[i - 9].str;
                const time = content[i - 8].str;
                let [h, m] = time.split(" ")[0].split(":");
                const isPM = time.split(" ")[1];
                if (isPM && h !== '12') {
                    h = String(Number(h) + 12)
                }
                if (!isPM && h === '12') {
                    h = '00'
                }
                dateString += ` ${h}:${m}:00`;
                const date: Date = new Date(dateString);


                const type = content[i].str as TransactionType;
                let amount = Number(content[i + 2].str.replace('INR ', ''));
                if (Number.isNaN(amount)) {
                    amount = Number(Number(content[i + 3].str.replace('INR ', '')).toFixed(2));
                };
                let toOrFrom = content[i - 6].str;
                toOrFrom = toOrFrom.replace('Paid to ', '');
                toOrFrom = toOrFrom.replace('Received from ', '');
                const accountUsed = content[i - 2].str.split(' ').reverse()[0];
                if (type === 'Credit') {
                    totalCredited += amount;
                }
                else {
                    totalDebited += amount;
                }
                const detail = {
                    time,
                    date,
                    type,
                    amount,
                    toOrFrom,
                    accountUsed,
                    app: App.PhonePe
                }
                if(accountUsed !== 'Card')
                transactions.push(detail);
            }
            i++;
        }
    });

    return ({
        totalCredited: Number(totalCredited.toFixed(2)),
        totalDebited: Number(totalDebited.toFixed(2)),
        transactions
    });

}



function parseTransactions(doc: HTMLElement): TransactionRecord {

    const transactions: Transaction[] = [];
    let totalCredited = 0;
    let totalDebited = 0;

    const transactionDivs = doc.querySelectorAll('.outer-cell');
    transactionDivs.forEach(div => {
        const titleElem = div.querySelector('.mdl-typography--title');
        const contentElem = div.querySelector('.mdl-typography--body-1');
        const detailsElem = div.querySelector('.mdl-typography--caption');
        // console.log(contentElem?.textContent)

        if (titleElem && contentElem && detailsElem) {
            const transactionString = contentElem?.textContent?.toLowerCase() as string;
            const isDebitType = transactionString.includes('paid') || transactionString.includes('sent');
            const isCreditType = transactionString.includes('received');
            let transactionType: TransactionType | null = null;

            if (isDebitType) {
                transactionType = 'Debit';
            }
            else if (isCreditType) {
                transactionType = 'Credit';
            }

            if (transactionType !== null) {

                const t = transactionString.split(' ');

                const amountPattern = /₹(\d+(?:\.\d{2})?)/;
                let amount = 0;
                const aMatch = transactionString.match(amountPattern);
                if (aMatch) {
                    amount = Number(aMatch[1])
                }
                if (transactionType === 'Debit') {
                    totalDebited += amount
                }
                else {
                    totalCredited += amount
                }

                let date: Date = new Date();
                const datePattern = /([a-z]{3})\s(\d{1,2}),\s(\d{4}),\s(\d{1,2}):(\d{2}):(\d{2})\s(am|pm)\s([a-z]{3})/

                const match = transactionString.match(datePattern);
               
                if (match) {
                    let [fullMatch, month, day, year, hours, minutes, seconds, ampm, timezone] = match;
                    console.log(month,day)
                    if (ampm === 'pm') {
                        if (hours === '12') {
                            hours = '00'
                        }
                        else {
                            hours = String(Number(hours) + 12)
                        }
                    }
                    let dateString = `${month} ${day} ${year} ${hours}:${minutes}:00`;
                    date = new Date(dateString);
                } else {
                    console.log("No match found");
                }

                
                transactions.push({
                    accountUsed: '',
                    amount: Number(amount),
                    date: date,
                    time: '',
                    toOrFrom: '',
                    type: transactionType,
                    app: App.GooglePe

                });
            }


        }
    });

    return {
        totalCredited: Number(totalCredited.toFixed(2)),
        totalDebited: Number(totalDebited.toFixed(2)),
        transactions: transactions
    };
}


export const parseGoogleActivityData = (file: FileContent<ArrayBuffer>) => {

    const string = new TextDecoder().decode(file.content);
    const $ = document.createElement('html');
    $.innerHTML = string;

    return parseTransactions($);


}