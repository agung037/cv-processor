import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  Button, 
  IconButton, 
  Menu, 
  MenuItem, 
  Divider,
  ListItemIcon,
  Avatar,
  Tooltip
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import DescriptionIcon from '@mui/icons-material/Description';
import HistoryIcon from '@mui/icons-material/History';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { currentUser, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  // Mobile navigation menu state
  const [mobileAnchorEl, setMobileAnchorEl] = useState(null);
  const mobileMenuOpen = Boolean(mobileAnchorEl);
  
  // User menu state
  const [userAnchorEl, setUserAnchorEl] = useState(null);
  const userMenuOpen = Boolean(userAnchorEl);

  // Handle mobile menu click
  const handleMobileMenuClick = (event) => {
    setMobileAnchorEl(event.currentTarget);
  };

  // Handle mobile menu close
  const handleMobileMenuClose = () => {
    setMobileAnchorEl(null);
  };

  // Handle user menu click
  const handleUserMenuClick = (event) => {
    setUserAnchorEl(event.currentTarget);
  };

  // Handle user menu close
  const handleUserMenuClose = () => {
    setUserAnchorEl(null);
  };

  // Handle logout
  const handleLogout = async () => {
    await logout();
    handleUserMenuClose();
    navigate('/login');
  };

  // Handle navigation
  const handleNavigation = (path) => {
    navigate(path);
    handleMobileMenuClose();
    handleUserMenuClose();
  };

  return (
    <>
      <Box sx={{ height: 4, backgroundColor: '#7f0000' }} /> {/* Dark red accent line */}
      <AppBar position="static" elevation={0}>
        <Toolbar>
          {/* Logo/Brand */}
          <Typography 
            variant="h6" 
            component={Link} 
            to="/"
            sx={{ 
              flexGrow: 1, 
              textDecoration: 'none',
              color: 'inherit',
              display: 'flex',
              alignItems: 'center',
              fontWeight: 'bold'
            }}
          >
            <DescriptionIcon sx={{ mr: 1 }} />
            RED CV
          </Typography>
          
          {/* Desktop Navigation */}
          {currentUser && (
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              <Button 
                color="inherit" 
                component={Link} 
                to="/"
                startIcon={<DescriptionIcon />}
              >
                Analisis CV
              </Button>
              
              <Button 
                color="inherit" 
                component={Link} 
                to="/history"
                startIcon={<HistoryIcon />}
              >
                Riwayat
              </Button>
              
              {isAdmin && (
                <Button 
                  color="inherit" 
                  component={Link} 
                  to="/admin/users"
                  startIcon={<AdminPanelSettingsIcon />}
                >
                  Kelola Pengguna
                </Button>
              )}
            </Box>
          )}
          
          {/* Authentication Buttons or User Menu */}
          {currentUser ? (
            <Box>
              <Tooltip title="Akun Saya">
                <IconButton 
                  onClick={handleUserMenuClick}
                  size="small"
                  sx={{ ml: 2 }}
                  aria-controls={userMenuOpen ? 'user-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={userMenuOpen ? 'true' : undefined}
                >
                  <Avatar 
                    sx={{ width: 32, height: 32, bgcolor: '#7f0000' }}
                  >
                    {currentUser.username?.charAt(0).toUpperCase() || 'U'}
                  </Avatar>
                </IconButton>
              </Tooltip>
              
              <Menu
                id="user-menu"
                anchorEl={userAnchorEl}
                open={userMenuOpen}
                onClose={handleUserMenuClose}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                    mt: 1.5,
                    width: 200,
                    '& .MuiAvatar-root': {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    }
                  },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem>
                  <ListItemIcon>
                    <PersonIcon fontSize="small" />
                  </ListItemIcon>
                  {currentUser.username}
                </MenuItem>
                
                <Divider />

                <MenuItem onClick={() => handleNavigation('/')}>
                  <ListItemIcon>
                    <DescriptionIcon fontSize="small" />
                  </ListItemIcon>
                  Analisis CV
                </MenuItem>
                
                <MenuItem onClick={() => handleNavigation('/history')}>
                  <ListItemIcon>
                    <HistoryIcon fontSize="small" />
                  </ListItemIcon>
                  Riwayat
                </MenuItem>
                
                {isAdmin && (
                  <MenuItem onClick={() => handleNavigation('/admin/users')}>
                    <ListItemIcon>
                      <AdminPanelSettingsIcon fontSize="small" />
                    </ListItemIcon>
                    Kelola Pengguna
                  </MenuItem>
                )}
                
                <Divider />
                
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Button 
                color="inherit" 
                component={Link} 
                to="/login"
              >
                Login
              </Button>
              <Button 
                color="inherit" 
                component={Link} 
                to="/register"
              >
                Daftar
              </Button>
            </Box>
          )}
          
          {/* Mobile Menu Button */}
          <Box sx={{ display: { xs: 'block', md: 'none' } }}>
            <IconButton
              color="inherit"
              aria-label="menu"
              onClick={handleMobileMenuClick}
            >
              <MenuIcon />
            </IconButton>
            
            <Menu
              id="mobile-menu"
              anchorEl={mobileAnchorEl}
              open={mobileMenuOpen}
              onClose={handleMobileMenuClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                  mt: 1.5,
                  width: 200
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              {currentUser ? (
                <>
                  <MenuItem onClick={() => handleNavigation('/')}>
                    <ListItemIcon>
                      <DescriptionIcon fontSize="small" />
                    </ListItemIcon>
                    Analisis CV
                  </MenuItem>
                  
                  <MenuItem onClick={() => handleNavigation('/history')}>
                    <ListItemIcon>
                      <HistoryIcon fontSize="small" />
                    </ListItemIcon>
                    Riwayat
                  </MenuItem>
                  
                  {isAdmin && (
                    <MenuItem onClick={() => handleNavigation('/admin/users')}>
                      <ListItemIcon>
                        <AdminPanelSettingsIcon fontSize="small" />
                      </ListItemIcon>
                      Kelola Pengguna
                    </MenuItem>
                  )}
                  
                  <Divider />
                  
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    Logout
                  </MenuItem>
                </>
              ) : (
                <>
                  <MenuItem onClick={() => handleNavigation('/login')}>
                    <ListItemIcon>
                      <PersonIcon fontSize="small" />
                    </ListItemIcon>
                    Login
                  </MenuItem>
                  <MenuItem onClick={() => handleNavigation('/register')}>
                    <ListItemIcon>
                      <PersonIcon fontSize="small" />
                    </ListItemIcon>
                    Daftar
                  </MenuItem>
                </>
              )}
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Header; 