import '../App.css';
import {BOOKS} from '../bible/constants.ts';
import {useEffect, useState} from "react";
import {Box, Container} from "@mui/material";
import BookRecord from "./BookRecord";
import StatisticsPanel from "./StatisticsPanel";
import ControlPanel from "./ControlPanel";
import { useTheme } from '../theme/ThemeContext';

const BOOKS1 = BOOKS.slice(0, 23);
const BOOKS2 = BOOKS.slice(23, BOOKS.length);
const statisticsPanelStyle = {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
};

function Dashboard() {
    const [readStatus, setReadStatus] = useState({});
    const { currentTheme } = useTheme();

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
        <Container maxWidth="xl" disableGutters sx={{
            width: '100%',
            px: 0,
            backgroundColor: currentTheme.background
        }}>
            <Box sx={{ width: '100%', py: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Box sx={statisticsPanelStyle}>
                    <StatisticsPanel readStatus={readStatus}/>
                </Box>
                <Box sx={{ height: 32 }} />
                <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    gap: 2,
                    width: '100%',
                    justifyContent: 'center'
                }}>
                    <Box sx={{
                        width: { xs: '100%', md: '896px' },
                        minWidth: { xs: '100%', md: '896px' }
                    }}>
                        {BOOKS1.map(book =>
                            <BookRecord key={book.name} book={book} readStatus={readStatus} setReadStatus={setReadStatus}/>
                        )}
                    </Box>
                    <Box sx={{
                        width: { xs: '100%', md: '896px' },
                        minWidth: { xs: '100%', md: '896px' }
                    }}>
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