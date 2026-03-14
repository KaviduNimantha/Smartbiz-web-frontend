import React, { useState } from 'react';
import {
  Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Typography, Avatar, Divider, IconButton, useMediaQuery, useTheme, Tooltip
} from '@mui/material';
import {
  BusinessOutlined, BarChartOutlined, SmartToyOutlined,
  WorkspacePremiumOutlined, LogoutOutlined, MenuOutlined,
  ChevronLeftOutlined, AdminPanelSettingsOutlined
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { authApi } from '../../api/authApi';

const DRAWER_WIDTH = 260;
const DRAWER_COLLAPSED_WIDTH = 72;

const ADMIN_NAV = [
  { label: 'System Statistics',      icon: <BarChartOutlined />,              path: '/admin/dashboard' },
  { label: 'Manage Businesses',      icon: <BusinessOutlined />,              path: '/admin/businesses' },
  { label: 'AI Usage Logs',          icon: <SmartToyOutlined />,              path: '/admin/ai-logs' },
  { label: 'Subscription Plans',     icon: <WorkspacePremiumOutlined />,      path: '/admin/plans' },
];

const AdminSidebar = ({ open, onToggle, mobileOpen, onMobileClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const drawerContent = (collapsed) => (
    <Box sx={{
      height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden',
      background: 'linear-gradient(180deg, #1b0036 0%, #2d0060 60%, #1a006e 100%)',
      color: '#fff',
    }}>
      {/* Header */}
      <Box sx={{ px: collapsed ? 1 : 2.5, py: 2.5, display: 'flex', alignItems: 'center', gap: 1.5, minHeight: 72 }}>
        {!collapsed && (
          <>
            <AdminPanelSettingsOutlined sx={{ color: '#c084fc', fontSize: 28 }} />
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#fff', letterSpacing: '-0.3px', flex: 1, fontSize: '1rem' }}>
              SmartBiz Admin
            </Typography>
          </>
        )}
        {collapsed && <Box sx={{ flex: 1 }} />}
        {!isMobile && (
          <IconButton onClick={onToggle} size="small"
            sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: '#fff', bgcolor: 'rgba(255,255,255,0.1)' } }}>
            {collapsed ? <MenuOutlined /> : <ChevronLeftOutlined />}
          </IconButton>
        )}
      </Box>

      {/* Admin badge */}
      {!collapsed && (
        <Box sx={{ px: 2.5, pb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, borderRadius: 2, bgcolor: 'rgba(192, 132, 252, 0.15)', border: '1px solid rgba(192,132,252,0.3)' }}>
            <Avatar sx={{ width: 36, height: 36, bgcolor: '#7c3aed', fontSize: '0.9rem', fontWeight: 700 }}>A</Avatar>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#fff' }}>Administrator</Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>Full Access</Typography>
            </Box>
          </Box>
        </Box>
      )}

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mx: 2 }} />

      <List sx={{ flex: 1, px: collapsed ? 0.5 : 1.5, pt: 1 }}>
        {ADMIN_NAV.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <Tooltip title={collapsed ? item.label : ''} placement="right" arrow>
                <ListItemButton
                  onClick={() => { navigate(item.path); if (isMobile) onMobileClose(); }}
                  sx={{
                    borderRadius: 2, minHeight: 44,
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    px: collapsed ? 1 : 1.5,
                    bgcolor: isActive ? 'rgba(192,132,252,0.2)' : 'transparent',
                    '&:hover': { bgcolor: 'rgba(192,132,252,0.12)' },
                    transition: 'background 0.2s',
                  }}
                >
                  <ListItemIcon sx={{ color: isActive ? '#c084fc' : 'rgba(255,255,255,0.6)', minWidth: collapsed ? 0 : 36 }}>
                    {item.icon}
                  </ListItemIcon>
                  {!collapsed && (
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: isActive ? 600 : 400, color: isActive ? '#c084fc' : 'rgba(255,255,255,0.8)' }}
                    />
                  )}
                </ListItemButton>
              </Tooltip>
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mx: 2 }} />
      <List sx={{ px: collapsed ? 0.5 : 1.5, pb: 2 }}>
        <ListItem disablePadding>
          <Tooltip title={collapsed ? 'Logout' : ''} placement="right" arrow>
            <ListItemButton onClick={() => authApi.logoutUser()}
              sx={{ borderRadius: 2, minHeight: 44, justifyContent: collapsed ? 'center' : 'flex-start', px: collapsed ? 1 : 1.5, '&:hover': { bgcolor: 'rgba(255,100,100,0.15)' } }}>
              <ListItemIcon sx={{ color: 'rgba(255,255,255,0.6)', minWidth: collapsed ? 0 : 36 }}><LogoutOutlined /></ListItemIcon>
              {!collapsed && <ListItemText primary="Logout" primaryTypographyProps={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.8)' }} />}
            </ListItemButton>
          </Tooltip>
        </ListItem>
      </List>
    </Box>
  );

  if (isMobile) {
    return (
      <Drawer variant="temporary" open={mobileOpen} onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{ '& .MuiDrawer-paper': { width: DRAWER_WIDTH, border: 'none' } }}>
        {drawerContent(false)}
      </Drawer>
    );
  }
  return (
    <Drawer variant="permanent" open
      sx={{
        width: open ? DRAWER_WIDTH : DRAWER_COLLAPSED_WIDTH, flexShrink: 0,
        '& .MuiDrawer-paper': { width: open ? DRAWER_WIDTH : DRAWER_COLLAPSED_WIDTH, border: 'none', transition: 'width 0.25s ease', overflowX: 'hidden' },
      }}>
      {drawerContent(!open)}
    </Drawer>
  );
};

export default AdminSidebar;
