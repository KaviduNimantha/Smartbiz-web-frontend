import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, CircularProgress, Chip
} from '@mui/material';
import DashboardLayout from '../components/layout/DashboardLayout';
import { salesApi } from '../api/salesApi';

const Sales = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    salesApi.getAll()
      .then((res) => setRows(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const totalRevenue = rows.reduce((sum, r) => sum + parseFloat(r.totalPrice || 0), 0);

  return (
    <DashboardLayout title="Sales">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a237e' }}>Sales Records</Typography>
        <Chip
          label={`Total Revenue: $${totalRevenue.toFixed(2)}`}
          sx={{ bgcolor: '#e8f5e9', color: '#2e7d32', fontWeight: 700, fontSize: '0.9rem', px: 1 }}
        />
      </Box>

      <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress /></Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f5f7ff' }}>
                  {['#', 'Customer', 'Product', 'Qty', 'Total Price', 'Date'].map((h) => (
                    <TableCell key={h} sx={{ fontWeight: 700, color: '#1a237e', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow><TableCell colSpan={6} align="center" sx={{ py: 6, color: '#aaa' }}>No sales records yet.</TableCell></TableRow>
                ) : rows.map((row, idx) => (
                  <TableRow key={row.id} hover>
                    <TableCell sx={{ color: '#aaa', fontSize: '0.85rem' }}>{idx + 1}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{row.Customer?.customerName || '—'}</TableCell>
                    <TableCell>{row.productName}</TableCell>
                    <TableCell><Chip label={row.quantity} size="small" sx={{ bgcolor: '#e8f0fe', color: '#1a237e', fontWeight: 600 }} /></TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#2e7d32' }}>
                      ${parseFloat(row.totalPrice || 0).toFixed(2)}
                    </TableCell>
                    <TableCell sx={{ color: '#888', fontSize: '0.85rem' }}>
                      {row.date ? new Date(row.date).toLocaleDateString() : '—'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </DashboardLayout>
  );
};

export default Sales;
