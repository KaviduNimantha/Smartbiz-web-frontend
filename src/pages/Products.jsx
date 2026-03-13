import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, CircularProgress, Chip
} from '@mui/material';
import { InventoryOutlined } from '@mui/icons-material';
import DashboardLayout from '../components/layout/DashboardLayout';
import { productApi } from '../api/productApi';

const Products = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productApi.getAll()
      .then((res) => setRows(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const getStockColor = (qty) => {
    if (qty <= 0) return { bg: '#ffebee', color: '#c62828', label: 'Out of Stock' };
    if (qty <= 10) return { bg: '#fff8e1', color: '#f57f17', label: 'Low Stock' };
    return { bg: '#e8f5e9', color: '#2e7d32', label: 'In Stock' };
  };

  return (
    <DashboardLayout title="Products & Stock">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a237e' }}>
          Product Inventory
        </Typography>
        <Chip icon={<InventoryOutlined />} label={`${rows.length} Products`} sx={{ bgcolor: '#e8f0fe', color: '#1a237e', fontWeight: 600 }} />
      </Box>

      <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress /></Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f5f7ff' }}>
                  {['Product Name', 'Price', 'Stock Quantity', 'Status', 'Added'].map((h) => (
                    <TableCell key={h} sx={{ fontWeight: 700, color: '#1a237e', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow><TableCell colSpan={5} align="center" sx={{ py: 6, color: '#aaa' }}>No products yet. Add suppliers to create products.</TableCell></TableRow>
                ) : rows.map((row) => {
                  const qty = row.Stock?.quantity ?? 0;
                  const { bg, color, label } = getStockColor(qty);
                  return (
                    <TableRow key={row.id} hover>
                      <TableCell sx={{ fontWeight: 600 }}>{row.productName}</TableCell>
                      <TableCell>${parseFloat(row.price || 0).toFixed(2)}</TableCell>
                      <TableCell>
                        <Chip label={qty} size="small" sx={{ bgcolor: bg, color, fontWeight: 700, minWidth: 50 }} />
                      </TableCell>
                      <TableCell>
                        <Chip label={label} size="small" sx={{ bgcolor: bg, color, fontWeight: 600, fontSize: '0.75rem' }} />
                      </TableCell>
                      <TableCell sx={{ color: '#888', fontSize: '0.85rem' }}>
                        {row.createdAt ? new Date(row.createdAt).toLocaleDateString() : '—'}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </DashboardLayout>
  );
};

export default Products;
