import '../App.css';
import {Box, Grid, Typography} from "@mui/material";
import {CircularProgressbar} from "react-circular-progressbar";
import 'react-circular-progressbar/dist/styles.css';
import { useTheme } from '../theme/ThemeContext';
import { BOOKS } from '../bible/constants.ts';

// Define book categories
const categories = {
    oldTestament: {
        name: "Old Testament",
        books: BOOKS.slice(0, 39)
    },
    newTestament: {
        name: "New Testament",
        books: BOOKS.slice(39)
    },
    law: {
        name: "The Law",
        books: BOOKS.slice(0, 5)
    },
    history: {
        name: "History",
        books: BOOKS.slice(5, 17)
    },
    wisdom: {
        name: "Wisdom",
        books: BOOKS.slice(17, 22)
    },
    prophets: {
        name: "Prophets",
        books: BOOKS.slice(22, 39)
    },
    gospels: {
        name: "The Gospels",
        books: BOOKS.slice(39, 43)
    },
    churchHistory: {
        name: "Church History",
        books: [BOOKS[43]] // Acts
    },
    paulsLetters: {
        name: "Paul's Letters",
        books: BOOKS.slice(44, 58)
    },
    generalLetters: {
        name: "General Letters",
        books: BOOKS.slice(58, 65)
    },
    prophecy: {
        name: "Prophecy",
        books: [BOOKS[65]] // Revelation
    }
};

export default function StatisticsPanel(props) {
    const { currentTheme } = useTheme();
    const {readStatus} = props;

    const calculateStats = (books) => {
        let totalChapters = 0;
        let chaptersRead = 0;

        books.forEach(book => {
            for (let i = 1; i <= book.numChapters; i++) {
                const chapterKey = book.name + "_" + i;
                totalChapters++;
                if (readStatus[chapterKey]) {
                    chaptersRead++;
                }
            }
        });

        return {
            total: totalChapters,
            read: chaptersRead,
            percentage: (chaptersRead / totalChapters) * 100
        };
    };

    const totalStats = calculateStats(BOOKS);
    const categoryStats = Object.entries(categories).map(([key, category]) => ({
        ...category,
        stats: calculateStats(category.books)
    }));

    const StatItem = ({ title, stats }) => (
        <Box sx={{ 
            backgroundColor: currentTheme.background,
            p: 2,
            borderRadius: 1,
            border: `1px solid ${currentTheme.button.border}`
        }}>
            <Typography variant="h6" sx={{ color: currentTheme.text, mb: 1 }}>
                {title}
            </Typography>
            <Typography sx={{ color: currentTheme.text }}>
                {stats.read} of {stats.total} chapters read
            </Typography>
            <div style={{width: 100, height: 100, margin: '10px auto'}}>
                <CircularProgressbar 
                    value={stats.percentage} 
                    text={`${stats.percentage.toFixed(1)}%`}
                    styles={{
                        path: {
                            stroke: currentTheme.primary,
                        },
                        text: {
                            fill: currentTheme.text,
                            fontSize: '12px'
                        },
                        trail: {
                            stroke: currentTheme.progressTrail
                        }
                    }}
                />
            </div>
        </Box>
    );

    return (
        <Box sx={{ 
            backgroundColor: currentTheme.background, 
            p: 2
        }}>
            <Typography variant="h5" sx={{ color: currentTheme.text, mb: 3, textAlign: 'center' }}>
                Overall Progress
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                <StatItem title="All Books" stats={totalStats} />
            </Box>
            
            <Typography variant="h5" sx={{ color: currentTheme.text, mb: 3, textAlign: 'center' }}>
                Category Progress
            </Typography>
            
            {/* Row 1: Old and New Testament */}
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 2 }}>
                <StatItem title={categoryStats[0].name} stats={categoryStats[0].stats} />
                <StatItem title={categoryStats[1].name} stats={categoryStats[1].stats} />
            </Box>

            {/* Row 2: Law, History, Wisdom, Prophets */}
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 2 }}>
                <StatItem title={categoryStats[2].name} stats={categoryStats[2].stats} />
                <StatItem title={categoryStats[3].name} stats={categoryStats[3].stats} />
                <StatItem title={categoryStats[4].name} stats={categoryStats[4].stats} />
                <StatItem title={categoryStats[5].name} stats={categoryStats[5].stats} />
            </Box>

            {/* Row 3: Gospels, Church History, Paul's Letters, General Letters, Prophecy */}
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                <StatItem title={categoryStats[6].name} stats={categoryStats[6].stats} />
                <StatItem title={categoryStats[7].name} stats={categoryStats[7].stats} />
                <StatItem title={categoryStats[8].name} stats={categoryStats[8].stats} />
                <StatItem title={categoryStats[9].name} stats={categoryStats[9].stats} />
                <StatItem title={categoryStats[10].name} stats={categoryStats[10].stats} />
            </Box>
        </Box>
    );
}
