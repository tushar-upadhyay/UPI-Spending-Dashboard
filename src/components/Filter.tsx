import styled from "@emotion/styled"
import DateFilter from "./DateFilter"
import AmountFilter from "./AmountFilter"
import { Card, Paper } from "@mui/material"



const Container = styled.div({
    paddingBottom: 12,
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: '100%',
    // borderBottom:'1px solid gray'
})

export default function Filters(props: any) {

    return (
        <Paper>
            <Container>
                <DateFilter />
                <AmountFilter />
            </Container>
        </Paper>
    )

}