import '../App.css';
import {Box} from "@mui/material";
import {CircularProgressbar} from "react-circular-progressbar";
import 'react-circular-progressbar/dist/styles.css';
import { useTheme } from '../theme/ThemeContext';

export default function StatisticsPanel(props) {
    const { currentTheme } = useTheme();
    const {readStatus} = props;

    const numChaptersRead = Object.values(readStatus).reduce((a, b) => a + b, 0);
    const toalChapters = 1189;

    console.log(numChaptersRead);

    const percentage = numChaptersRead / toalChapters * 100;
    return (
        <Box sx={{ backgroundColor: currentTheme.background }}>
            <p style={{ color: currentTheme.text }}>{numChaptersRead} of {toalChapters} chapters read</p>
            <div style={{width: 200, height: 200}}>
                <CircularProgressbar 
                    value={percentage} 
                    text={`${percentage.toFixed(1)}%`}
                    styles={{
                        path: {
                            stroke: currentTheme.primary,
                        },
                        text: {
                            fill: currentTheme.text,
                        },
                        trail: {
                            stroke: currentTheme.progressTrail
                        }
                    }}
                />
            </div>
        </Box>
    );
}
