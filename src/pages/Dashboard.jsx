import React, { useEffect, useState } from 'react';
import { Grid, Typography, Box, Paper, CircularProgress } from '@mui/material';
import {
  TrendingUpOutlined, AccountBalanceWalletOutlined, ShowChartOutlined, InventoryOutlined
} from '@mui/icons-material';
import DashboardLayout from '../components/layout/DashboardLayout';
import StatCard from '../components/common/StatCard';
import { dashboardApi } from '../api/dashboardApi';

const formatCurrency = (val) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val || 0);

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    dashboardApi.getOverview()
      .then((res) => setData(res.data))
      .catch((err) => setError(err.message || 'Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  const user = (() => { try { return JSON.parse(localStorage.getItem('user')) || {}; } catch { return {}; } })();

  const stats = [
    {
      title: 'Total Sales',
      value: data ? formatCurrency(data.totalSales) : '—',
      icon: <TrendingUpOutlined fontSize="inherit" />,
      color: '#4f8ef7',
      subtitle: 'All time revenue',
    },
    {
      title: 'Total Expenses',
      value: data ? formatCurrency(data.totalExpenses) : '—',
      icon: <AccountBalanceWalletOutlined fontSize="inherit" />,
      color: '#f77f4f',
      subtitle: 'All time expenses',
    },
    {
      title: 'Net Profit',
      value: data ? formatCurrency(data.totalProfit) : '—',
      icon: <ShowChartOutlined fontSize="inherit" />,
      color: data?.totalProfit >= 0 ? '#4caf50' : '#f44336',
      subtitle: 'Sales minus expenses',
    },
    {
      title: 'Products',
      value: data ? data.totalProducts : '—',
      icon: <InventoryOutlined fontSize="inherit" />,
      color: '#7c5cbf',
      subtitle: 'Total product listings',
    },
  ];

  return (
    <DashboardLayout title="Business Dashboard">
      {/* Welcome banner */}
      <Paper
        elevation={0}
        sx={{
          mb: 3, p: 3, borderRadius: 3,
          background: 'linear-gradient(135deg, #1a237e 0%, #1565c0 100%)',
          color: '#fff',
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
          Welcome back, {user.ownerName || 'Business Owner'} 👋
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.75)' }}>
          {user.businessName} — Here's your business at a glance
        </Typography>
      </Paper>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Paper elevation={0} sx={{ p: 3, borderRadius: 3, bgcolor: '#fff3f3', border: '1px solid #ffcdd2' }}>
          <Typography color="error">{error}</Typography>
        </Paper>
      )}

      {data && (
        /* MUI v7 Grid v2: use size prop instead of item+xs/sm/lg */
        <Grid container spacing={2.5}>
          {stats.map((stat) => (
            <Grid key={stat.title} size={{ xs: 12, sm: 6, lg: 3 }}>
              <StatCard {...stat} />
            </Grid>
          ))}
        </Grid>
      )}
    </DashboardLayout>
  );
};

export default Dashboard;
