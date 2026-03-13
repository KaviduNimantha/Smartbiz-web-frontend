import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const StatCard = ({ title, value, icon, color, subtitle }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        bgcolor: '#fff',
        border: '1px solid rgba(0,0,0,0.06)',
        display: 'flex',
        alignItems: 'center',
        gap: 2.5,
        transition: 'box-shadow 0.2s, transform 0.2s',
        '&:hover': {
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
          transform: 'translateY(-2px)',
        },
      }}
    >
      <Box
        sx={{
          width: 56,
          height: 56,
          borderRadius: 2.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: `${color}22`,
          color: color,
          flexShrink: 0,
          fontSize: '1.75rem',
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography variant="body2" sx={{ color: '#888', fontWeight: 500, mb: 0.25 }}>
          {title}
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 800, color: '#1a237e', lineHeight: 1.1 }}>
          {value}
        </Typography>
        {subtitle && (
          <Typography variant="caption" sx={{ color: '#aaa', mt: 0.25, display: 'block' }}>
            {subtitle}
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

export default StatCard;
