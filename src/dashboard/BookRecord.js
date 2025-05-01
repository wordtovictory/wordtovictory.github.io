import '../App.css';
import Button from '@mui/material/Button';
import Box from "@mui/material/Box";
import { useTheme } from '../theme/ThemeContext';
import { useTheme as useMuiTheme } from '@mui/material/styles';

export default function BookRecord(props) {
    const { currentTheme } = useTheme();
    const muiTheme = useMuiTheme();
    const {book, readStatus, setReadStatus} = props;

    const bookRecordstyle = {
        display: 'flex',
        backgroundColor: currentTheme.background,
        alignItems: 'flex-start',
        width: '100%'
    };
    const bookNameStyle = { 
        width: { xs: 80, sm: 80, lg: 120 },
        minWidth: { xs: 80, sm: 80, lg: 120 },
        color: currentTheme.text,
        textAlign: 'right',
        pr: { xs: 1.3, sm: 1.3, lg: 2 },
        fontSize: { xs: '0.8rem', sm: '0.8rem', lg: '1rem' }
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
                                minWidth: { xs: 25, sm: 25, lg: 38 },
                                maxWidth: { xs: 25, sm: 25, lg: 38 },
                                minHeight: { xs: 19, sm: 19, lg: 28 },
                                maxHeight: { xs: 19, sm: 19, lg: 28 },
                                p: 0,
                                m: 0,
                                borderRadius: 0,
                                fontSize: { xs: '0.7rem', sm: '0.7rem', lg: '0.875rem' },
                                lineHeight: 1,
                                boxShadow: 'none',
                                '&:hover': {
                                    boxShadow: 'none'
                                }
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
