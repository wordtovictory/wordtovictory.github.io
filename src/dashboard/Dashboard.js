import '../App.css';
import {BOOKS} from '../bible/constants.ts';
import {useEffect, useState} from "react";
import {Box, Container} from "@mui/material";
import BookRecord from "./BookRecord";
import StatisticsPanel from "./StatisticsPanel";
import ControlPanel from "./ControlPanel";

const BOOKS1 = BOOKS.slice(0, 23);
const BOOKS2 = BOOKS.slice(23, BOOKS.length);
const statisticsPanelStyle = {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
};

function Dashboard() {
    const [readStatus, setReadStatus] = useState({});

    useEffect(() => {
        const readStatus = {}
        BOOKS.map(book => {
            for (let i = 1; i < book.numChapters + 1; i++) {
                const chapterKey = book.name + "_" + i;
                readStatus[chapterKey] = localStorage.getItem(chapterKey) === "true";
            }
        })
        setReadStatus(readStatus);
    }, [])

    return (
        <Container maxWidth="xl">
            <Box sx={{ width: '100%', py: 2 }}>
                <Box sx={statisticsPanelStyle}>
                    <StatisticsPanel readStatus={readStatus}/>
                </Box>
                <Box sx={{ height: 32 }} />
                <Box sx={{ 
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    gap: 2
                }}>
                    <Box sx={{ width: { xs: '100%', md: '50%' } }}>
                        {BOOKS1.map(book =>
                            <BookRecord key={book.name} book={book} readStatus={readStatus} setReadStatus={setReadStatus}/>
                        )}
                    </Box>
                    <Box sx={{ width: { xs: '100%', md: '50%' } }}>
                        {BOOKS2.map(book =>
                            <BookRecord key={book.name} book={book} readStatus={readStatus} setReadStatus={setReadStatus}/>
                        )}
                    </Box>
                </Box>
                <Box sx={{ height: 32 }} />
                <ControlPanel readStatus={readStatus} setReadStatus={setReadStatus}/>
                <Box sx={{ height: 32 }} />
            </Box>
        </Container>
    );
}

export default Dashboard;
