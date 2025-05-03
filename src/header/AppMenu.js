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
    Button,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider
} from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import MenuIcon from '@mui/icons-material/Menu';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BarChartIcon from '@mui/icons-material/BarChart';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'reactfire';
import { signOut } from 'firebase/auth';

export default function AppMenu({ isLoggedIn, setIsLoggedIn }) {
    const { currentTheme, toggleTheme, fillBoxes, toggleFillBoxes } = useTheme();
    const isDarkMode = currentTheme === appThemes.darkOrange;
    const [anchorEl, setAnchorEl] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const open = Boolean(anchorEl);
    const navigate = useNavigate();
    const auth = useAuth();

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogin = () => {
        navigate('/login');
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            setIsLoggedIn(false);
            navigate('/login');
            handleClose();
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setDrawerOpen(open);
    };

    const menuItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
        { text: 'Statistics', icon: <BarChartIcon />, path: '/statistics' }
    ];

    const drawer = (
        <Box
            sx={{
                width: 250,
                backgroundColor: currentTheme.appMenu.backgroundColor,
                color: currentTheme.appMenu.textColor,
                height: '100%'
            }}
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
        >
            <List>
                {menuItems.map((item) => (
                    <ListItem 
                        button 
                        key={item.text}
                        onClick={() => navigate(item.path)}
                        sx={{
                            '&:hover': {
                                backgroundColor: currentTheme.button.background.hover
                            }
                        }}
                    >
                        <ListItemIcon sx={{ color: currentTheme.appMenu.textColor }}>
                            {item.icon}
                        </ListItemIcon>
                        <ListItemText primary={item.text} />
                    </ListItem>
                ))}
                <ListItem
                    button
                    onClick={toggleTheme}
                    sx={{
                        '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.08)',
                        }
                    }}
                >
                    <ListItemIcon sx={{ color: currentTheme.appMenu.textColor }}>
                        {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
                    </ListItemIcon>
                    <ListItemText primary={isDarkMode ? 'Light Mode' : 'Dark Mode'} />
                </ListItem>
                <ListItem
                    button
                    onClick={toggleFillBoxes}
                    sx={{
                        '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.08)',
                        }
                    }}
                >
                    <ListItemIcon sx={{ color: currentTheme.appMenu.textColor }}>
                        {fillBoxes ? <Brightness7Icon /> : <Brightness4Icon />}
                    </ListItemIcon>
                    <ListItemText primary={fillBoxes ? 'Filled Boxes' : 'Empty Boxes'} />
                </ListItem>
            </List>
            <Divider sx={{ backgroundColor: currentTheme.button.border }} />
        </Box>
    );

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
                <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    onClick={toggleDrawer(true)}
                    sx={{ mr: 2, color: currentTheme.appMenu.textColor }}
                >
                    <MenuIcon />
                </IconButton>
                <Drawer
                    anchor="left"
                    open={drawerOpen}
                    onClose={toggleDrawer(false)}
                >
                    {drawer}
                </Drawer>
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
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Button
                            variant="contained"
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
                        <IconButton
                            onClick={handleClick}
                            sx={{ color: currentTheme.appMenu.textColor }}
                        >
                            <MoreVertIcon />
                        </IconButton>
                    </Box>
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
                    {isLoggedIn && (
                        <MenuItem onClick={() => navigate('/profile')}>
                            Profile
                        </MenuItem>
                    )}
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
                    {isLoggedIn && (
                        <MenuItem>
                            <Button 
                                variant="contained"
                                fullWidth
                                onClick={handleLogout}
                                startIcon={<LogoutIcon />}
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
                        </MenuItem>
                    )}
                </Menu>
            </Toolbar>
        </AppBar>
    );
}