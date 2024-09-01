import styled from "@emotion/styled";

export const FlexDiv = styled.div({
    display: 'flex',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column'
});

interface FixedDivProps {
    bottom?: number;
    top?: number;
    right?: number;
    left?: number;
    
}

export const FixedDiv = styled.div<FixedDivProps>`
    position: fixed;
    bottom: ${(props: FixedDivProps) => props.bottom}px;
    top: ${(props: FixedDivProps) => props.top}px;
    left: ${(props: FixedDivProps) => props.left}px;
    right: ${(props: FixedDivProps) => props.right}px;
    margin-bottom: 16px;
    cursor: pointer;
    z-index:69;
    margin-right:16px;
    padding: 16px;
    border-radius: 50%;
    background-color: #6200EE;
    text-align:center;
    display:flex;

`


export const FlexDivRow = styled.div({
    marginTop: '16px',
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap:'wrap',
    gap: '8px'
});

export const Pointer = styled.div({
    cursor: 'pointer'
});

interface VerticalSpaceProps {
    height: string;
}

export const VerticalSpace = styled.div<VerticalSpaceProps>`
    height: ${(props: any) => props.height}px
`