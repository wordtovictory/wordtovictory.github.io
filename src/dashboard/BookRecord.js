import '../App.css';
import Button from '@mui/material/Button';
import Box from "@mui/material/Box";
import { useTheme } from '../theme/ThemeContext';

export default function BookRecord(props) {
    const { currentTheme } = useTheme();
    const {book, readStatus, setReadStatus} = props;

    const bookRecordstyle = {
        display: 'flex',
        backgroundColor: currentTheme.background,
        alignItems: 'flex-start',
        width: '100%'
    };
    const bookNameStyle = { 
        width: 120,
        minWidth: 120,
        color: currentTheme.text,
        textAlign: 'right',
        pr: 2
    }

    const toggleRead = (event) => {
        const chapterKey = event.currentTarget.value;
        const currentRead = readStatus[chapterKey];
        const newRead = !currentRead;
        const newReadStatus = {...readStatus};
        newReadStatus[chapterKey] = newRead;
        setReadStatus(newReadStatus);
        localStorage.setItem(chapterKey, JSON.stringify(newRead));
    };

    const getReadStatus = (chapterKey) => {
        return readStatus[chapterKey];
    };

    const getButtonVariant = (chapterKey) => {
        let isRead = getReadStatus(chapterKey);
        return isRead? "contained" : "outlined";
    };

    const getButtonColor = (chapterKey) => {
        return currentTheme.buttonColor;
    };

    return (
        <Box sx={bookRecordstyle}>
            <Box sx={bookNameStyle}>{book.name}</Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', flex: 1 }}>
                {Array.from({length: book.numChapters}, (_, i) => i + 1).map(chapter => {
                    const chapterKey = book.name + "_" + chapter;
                    return (
                        <Button
                            key={chapterKey}
                            value={chapterKey}
                            onClick={toggleRead}
                            variant={getButtonVariant(chapterKey)}
                            color={getButtonColor(chapterKey)}
                            sx={{
                                minWidth: 38,
                                maxWidth: 38,
                                minHeight: 28,
                                maxHeight: 28,
                                p: 0,
                                m: 0,
                                borderRadius: 0
                            }}
                        >
                            {chapter}
                        </Button>
                    );
                })}
            </Box>
        </Box>
    );
}
