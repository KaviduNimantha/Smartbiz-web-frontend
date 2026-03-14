import React, { useEffect, useState } from 'react';
import { Grid, Typography, Box, Paper, CircularProgress } from '@mui/material';
import {
  PeopleOutlined, ReceiptLongOutlined, TrendingUpOutlined,
  InventoryOutlined, SmartToyOutlined
} from '@mui/icons-material';
import AdminLayout from '../../components/layout/AdminLayout';
import StatCard from '../../components/common/StatCard';
import { adminApi } from '../../api/adminApi';

const formatCurrency = (val) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val || 0);

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    adminApi.getStatistics()
      .then((res) => setData(res.data))
      .catch((err) => setError(err.message || 'Failed to load statistics'))
      .finally(() => setLoading(false));
  }, []);

  const stats = data ? [
    { title: 'Registered Businesses', value: data.totalUsers, icon: <PeopleOutlined fontSize="inherit" />, color: '#7c3aed', subtitle: 'Business owners' },
    { title: 'Total Revenue', value: formatCurrency(data.totalRevenue), icon: <TrendingUpOutlined fontSize="inherit" />, color: '#4f8ef7', subtitle: 'All-time sales' },
    { title: 'Sales Transactions', value: data.totalSalesQuantity, icon: <ReceiptLongOutlined fontSize="inherit" />, color: '#4caf50', subtitle: 'Total units sold' },
    { title: 'Total Products', value: data.totalProducts, icon: <InventoryOutlined fontSize="inherit" />, color: '#f77f4f', subtitle: 'Across all businesses' },
    { title: 'AI Queries', value: data.totalAiQueries, icon: <SmartToyOutlined fontSize="inherit" />, color: '#c084fc', subtitle: 'All-time AI usage' },
  ] : [];

  return (
    <AdminLayout title="System Statistics">
      <Paper elevation={0} sx={{
        mb: 3, p: 3, borderRadius: 3,
        background: 'linear-gradient(135deg, #1b0036 0%, #7c3aed 100%)', color: '#fff',
      }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>System Overview</Typography>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.75)' }}>
          Platform-wide statistics across all registered businesses
        </Typography>
      </Paper>

      {loading && <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>}
      {error && <Paper elevation={0} sx={{ p: 3, borderRadius: 3, bgcolor: '#fff3f3', border: '1px solid #ffcdd2' }}><Typography color="error">{error}</Typography></Paper>}

      {data && (
        <Grid container spacing={2.5}>
          {stats.map((s) => (
            <Grid key={s.title} size={{ xs: 12, sm: 6, lg: 4 }}>
              <StatCard {...s} />
            </Grid>
          ))}
        </Grid>
      )}
    </AdminLayout>
  );
};

export default AdminDashboard;
