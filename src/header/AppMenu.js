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
    MenuItem,
    Button
} from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';

export default function AppMenu({ isLoggedIn, setIsLoggedIn }) {
    const { currentTheme, toggleTheme, fillBoxes, toggleFillBoxes } = useTheme();
    const isDarkMode = currentTheme === appThemes.darkOrange;
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const navigate = useNavigate();

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogin = () => {
        handleClose();
        navigate('/login');
    };

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        setIsLoggedIn(false);
    };

    return (
        <AppBar 
            position="static" 
            sx={{ 
                backgroundColor: currentTheme.appMenu.backgroundColor,
                '& .MuiAppBar-root': {
                    backgroundColor: currentTheme.appMenu.backgroundColor
                }
            }}
        >
            <Toolbar>
                <img 
                    src={currentTheme.logo} 
                    height={50} 
                    alt="BibleTrack logo"
                    onClick={() => navigate('/dashboard')}
                    style={{ cursor: 'pointer' }}
                />
                <Box sx={{ flexGrow: 1 }} />
                {isLoggedIn ? (
                    <IconButton
                        onClick={handleClick}
                        sx={{ color: currentTheme.appMenu.textColor }}
                    >
                        <AccountCircleIcon />
                    </IconButton>
                ) : (
                    <IconButton
                        onClick={handleClick}
                        sx={{ color: currentTheme.appMenu.textColor }}
                    >
                        <MenuIcon />
                    </IconButton>
                )}
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
                    <MenuItem>
                        {isLoggedIn ? (
                            <Button
                                variant="contained"
                                fullWidth
                                onClick={handleLogout}
                                sx={{
                                    backgroundColor: currentTheme.button.background.default,
                                    color: currentTheme.button.text,
                                    '&:hover': {
                                        backgroundColor: currentTheme.button.background.hover
                                    }
                                }}
                            >
                                Logout
                            </Button>
                        ) : (
                            <Button
                                variant="contained"
                                fullWidth
                                onClick={handleLogin}
                                sx={{
                                    backgroundColor: currentTheme.button.background.default,
                                    color: currentTheme.button.text,
                                    '&:hover': {
                                        backgroundColor: currentTheme.button.background.hover
                                    }
                                }}
                            >
                                Login
                            </Button>
                        )}
                    </MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
}