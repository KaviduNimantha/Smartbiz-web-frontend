import React, { useState } from 'react';
import { Box, AppBar, Toolbar, IconButton, Typography, useMediaQuery, useTheme } from '@mui/material';
import { MenuOutlined } from '@mui/icons-material';
import AdminSidebar from './AdminSidebar';

const DRAWER_WIDTH = 260;
const DRAWER_COLLAPSED_WIDTH = 72;

const AdminLayout = ({ children, title }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f5f0ff' }}>
      <AdminSidebar
        open={sidebarOpen}
        onToggle={() => setSidebarOpen(v => !v)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <Box component="main" sx={{
        flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0,
        ml: isMobile ? 0 : (sidebarOpen ? `${DRAWER_WIDTH}px` : `${DRAWER_COLLAPSED_WIDTH}px`),
        transition: 'margin-left 0.25s ease',
      }}>
        <AppBar position="sticky" elevation={0} sx={{
          bgcolor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(124,58,237,0.1)', color: '#1b0036',
        }}>
          <Toolbar sx={{ gap: 2 }}>
            {isMobile && (
              <IconButton onClick={() => setMobileOpen(true)} edge="start" sx={{ color: '#7c3aed' }}>
                <MenuOutlined />
              </IconButton>
            )}
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1b0036', flex: 1 }}>{title}</Typography>
          </Toolbar>
        </AppBar>
        <Box sx={{ flex: 1, p: { xs: 2, sm: 3 }, overflow: 'auto' }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default AdminLayout;
