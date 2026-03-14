import React, { useState } from 'react';
import {
  Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Typography, Avatar, Divider, IconButton, useMediaQuery, useTheme, Tooltip
} from '@mui/material';
import {
  DashboardOutlined, GroupsOutlined, InventoryOutlined,
  PeopleOutlined, ReceiptLongOutlined, AccountBalanceWalletOutlined,
  SmartToyOutlined, LogoutOutlined, MenuOutlined, ChevronLeftOutlined,
  WorkspacePremiumOutlined
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { authApi } from '../../api/authApi';

const DRAWER_WIDTH = 260;
const DRAWER_COLLAPSED_WIDTH = 72;

const NAV_ITEMS = [
  { label: 'Business Dashboard', icon: <DashboardOutlined />, path: '/dashboard' },
  { label: 'Suppliers',          icon: <InventoryOutlined />,  path: '/suppliers' },
  { label: 'Products & Stock',   icon: <GroupsOutlined />,     path: '/products' },
  { label: 'Customers',          icon: <PeopleOutlined />,     path: '/customers' },
  { label: 'Sales',              icon: <ReceiptLongOutlined />, path: '/sales' },
  { label: 'Expenses',           icon: <AccountBalanceWalletOutlined />, path: '/expenses' },
  { label: 'AI Assistant',       icon: <SmartToyOutlined />,  path: '/ai-assistant' },
  { label: 'Subscription Plans', icon: <WorkspacePremiumOutlined />, path: '/subscription-plans' },
];

const Sidebar = ({ open, onToggle, mobileOpen, onMobileClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const user = (() => {
    try { return JSON.parse(localStorage.getItem('user')) || {}; } catch { return {}; }
  })();

  const handleLogout = () => {
    authApi.logoutUser();
  };

  const drawerContent = (collapsed) => (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(180deg, #1a237e 0%, #283593 60%, #1565c0 100%)',
        color: '#fff',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box sx={{ px: collapsed ? 1 : 2.5, py: 2.5, display: 'flex', alignItems: 'center', gap: 1.5, minHeight: 72 }}>
        {!collapsed && (
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#fff', letterSpacing: '-0.3px', flex: 1 }}>
            SmartBiz
          </Typography>
        )}
        {collapsed && <Box sx={{ flex: 1 }} />}
        {!isMobile && (
          <IconButton onClick={onToggle} size="small" sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: '#fff', bgcolor: 'rgba(255,255,255,0.1)' } }}>
            {collapsed ? <MenuOutlined /> : <ChevronLeftOutlined />}
          </IconButton>
        )}
      </Box>

      {/* User Info */}
      {!collapsed && (
        <Box sx={{ px: 2.5, pb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.1)' }}>
            <Avatar sx={{ width: 36, height: 36, bgcolor: '#4f8ef7', fontSize: '0.9rem', fontWeight: 700 }}>
              {(user.ownerName || user.businessName || 'U')[0].toUpperCase()}
            </Avatar>
            <Box sx={{ overflow: 'hidden' }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user.ownerName || 'Business Owner'}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                {user.businessName || ''}
              </Typography>
            </Box>
          </Box>
        </Box>
      )}

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.12)', mx: 2 }} />

      {/* Navigation */}
      <List sx={{ flex: 1, px: collapsed ? 0.5 : 1.5, pt: 1 }}>
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <Tooltip title={collapsed ? item.label : ''} placement="right" arrow>
                <ListItemButton
                  onClick={() => { navigate(item.path); if (isMobile) onMobileClose(); }}
                  sx={{
                    borderRadius: 2,
                    minHeight: 44,
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    px: collapsed ? 1 : 1.5,
                    bgcolor: isActive ? 'rgba(255,255,255,0.18)' : 'transparent',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.12)' },
                    transition: 'background 0.2s',
                  }}
                >
                  <ListItemIcon sx={{ color: isActive ? '#fff' : 'rgba(255,255,255,0.65)', minWidth: collapsed ? 0 : 36, mr: collapsed ? 0 : 0 }}>
                    {item.icon}
                  </ListItemIcon>
                  {!collapsed && (
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: isActive ? 600 : 400, color: isActive ? '#fff' : 'rgba(255,255,255,0.8)' }}
                    />
                  )}
                </ListItemButton>
              </Tooltip>
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.12)', mx: 2 }} />

      {/* Logout */}
      <List sx={{ px: collapsed ? 0.5 : 1.5, pb: 2 }}>
        <ListItem disablePadding>
          <Tooltip title={collapsed ? 'Logout' : ''} placement="right" arrow>
            <ListItemButton
              onClick={handleLogout}
              sx={{ borderRadius: 2, minHeight: 44, justifyContent: collapsed ? 'center' : 'flex-start', px: collapsed ? 1 : 1.5, '&:hover': { bgcolor: 'rgba(255,100,100,0.15)' } }}
            >
              <ListItemIcon sx={{ color: 'rgba(255,255,255,0.65)', minWidth: collapsed ? 0 : 36 }}>
                <LogoutOutlined />
              </ListItemIcon>
              {!collapsed && (
                <ListItemText primary="Logout" primaryTypographyProps={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.8)' }} />
              )}
            </ListItemButton>
          </Tooltip>
        </ListItem>
      </List>
    </Box>
  );

  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{ '& .MuiDrawer-paper': { width: DRAWER_WIDTH, border: 'none' } }}
      >
        {drawerContent(false)}
      </Drawer>
    );
  }

  return (
    <Drawer
      variant="permanent"
      open
      sx={{
        width: open ? DRAWER_WIDTH : DRAWER_COLLAPSED_WIDTH,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        '& .MuiDrawer-paper': {
          width: open ? DRAWER_WIDTH : DRAWER_COLLAPSED_WIDTH,
          border: 'none',
          transition: 'width 0.25s ease',
          overflowX: 'hidden',
        },
      }}
    >
      {drawerContent(!open)}
    </Drawer>
  );
};

export default Sidebar;
