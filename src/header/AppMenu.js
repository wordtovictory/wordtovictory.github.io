import React, { useState } from 'react';
import { useTheme } from '../theme/ThemeContext';
import { appThemes } from '../theme/themeConfig';
import { 
    AppBar, 
    Toolbar, 
    Box,
    Switch,
    FormControlLabel,
    IconButton,
    Menu,
    MenuItem
} from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import MenuIcon from '@mui/icons-material/Menu';

export default function AppMenu() {
    const { currentTheme, toggleTheme, fillBoxes, toggleFillBoxes } = useTheme();
    const isDarkMode = currentTheme === appThemes.darkOrange;
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <AppBar position="static" sx={{ backgroundColor: currentTheme.appMenu.backgroundColor }}>
            <Toolbar>
                <img src={currentTheme.logo} height={50} alt="BibleTrack logo"/>
                <Box sx={{ flexGrow: 1 }} />
                <IconButton
                    onClick={handleClick}
                    sx={{ color: currentTheme.appMenu.textColor }}
                >
                    <MenuIcon />
                </IconButton>
                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    sx={{ 
                        '& .MuiPaper-root': {
                            backgroundColor: currentTheme.appMenu.backgroundColor,
                            color: currentTheme.appMenu.textColor
                        }
                    }}
                >
                    <MenuItem>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={isDarkMode}
                                    onChange={toggleTheme}
                                    icon={<Brightness7Icon />}
                                    checkedIcon={<Brightness4Icon />}
                                />
                            }
                            label="Dark Mode"
                        />
                    </MenuItem>
                    <MenuItem>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={fillBoxes}
                                    onChange={toggleFillBoxes}
                                />
                            }
                            label="Fill Empty Spaces"
                        />
                    </MenuItem>                    
                </Menu>
            </Toolbar>
        </AppBar>
    );
}