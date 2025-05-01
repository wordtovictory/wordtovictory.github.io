import '../App.css';
import Button from '@mui/material/Button';
import Box from "@mui/material/Box";
import { useTheme } from '../theme/ThemeContext';

export default function BookRecord(props) {
    const { currentTheme } = useTheme();
    const {book, readStatus, setReadStatus} = props;

    const bookRecordstyle = {display: 'flex', backgroundColor: currentTheme.background};
    const bookNameStyle = {flex: '0 0 120px', color: currentTheme.text}

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
            <Box>
                {Array.from({length: Math.ceil(book.numChapters)}, (_, i) => {
                        const chapterNum = i + 1;
                        const chapterKey = book.name + "_" + chapterNum;
                        return <Button
                            key={chapterKey}
                            size="small"
                            variant={getButtonVariant(chapterKey)}
                            color={getButtonColor(chapterKey)}
                            disableElevation
                            value={chapterKey}
                            sx={{
                                minWidth: 38,
                                maxWidth: 38,
                                minHeight: 28,
                                maxHeight: 28,
                                color: currentTheme.text,
                                '&:hover': {
                                    color: currentTheme.text
                                }
                            }}
                            onClick={toggleRead}>{chapterNum}</Button>
                    }
                )}
            </Box>
        </Box>
    );
}
