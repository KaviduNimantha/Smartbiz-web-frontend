import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, CircularProgress, Chip, TextField, InputAdornment
} from '@mui/material';
import { SearchOutlined, SmartToyOutlined } from '@mui/icons-material';
import AdminLayout from '../../components/layout/AdminLayout';
import { adminApi } from '../../api/adminApi';

const AI_TYPE_COLORS = {
  report: { bg: '#e8f0fe', color: '#1a237e' },
  email: { bg: '#fce4ec', color: '#880e4f' },
  marketing: { bg: '#fff8e1', color: '#f57f17' },
  invoice: { bg: '#e8f5e9', color: '#2e7d32' },
  chat: { bg: '#f3e5f5', color: '#6a1b9a' },
};

const AIUsageLogs = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    adminApi.getLogs()
      .then((res) => setRows(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = rows.filter((r) => {
    const q = search.toLowerCase();
    return (
      (r.User?.businessName || '').toLowerCase().includes(q) ||
      (r.User?.email || '').toLowerCase().includes(q) ||
      (r.queryType || '').toLowerCase().includes(q)
    );
  });

  return (
    <AdminLayout title="AI Usage Logs">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#1b0036' }}>AI Query Logs</Typography>
          <Chip icon={<SmartToyOutlined />} label={`${rows.length} total queries`}
            sx={{ bgcolor: '#f3e8ff', color: '#7c3aed', fontWeight: 600 }} />
        </Box>
        <TextField
          placeholder="Search by business, email, type…"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchOutlined sx={{ color: '#999', fontSize: 18 }} /></InputAdornment> }}
          sx={{ width: 280, bgcolor: '#fff', borderRadius: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
        />
      </Box>

      <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress sx={{ color: '#7c3aed' }} /></Box>
        ) : (
          <TableContainer sx={{ maxHeight: 600 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {['Business', 'Email', 'Query Type', 'Prompt (Preview)', 'Date'].map((h) => (
                    <TableCell key={h} sx={{ fontWeight: 700, color: '#1b0036', bgcolor: '#f5f0ff', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow><TableCell colSpan={5} align="center" sx={{ py: 6, color: '#aaa' }}>No AI usage logs yet.</TableCell></TableRow>
                ) : filtered.map((row) => {
                  const typeColors = AI_TYPE_COLORS[row.queryType] || { bg: '#f5f5f5', color: '#555' };
                  return (
                    <TableRow key={row.id} hover>
                      <TableCell sx={{ fontWeight: 600 }}>{row.User?.businessName || '—'}</TableCell>
                      <TableCell sx={{ color: '#666', fontSize: '0.85rem' }}>{row.User?.email || '—'}</TableCell>
                      <TableCell>
                        <Chip label={row.queryType || '—'} size="small"
                          sx={{ bgcolor: typeColors.bg, color: typeColors.color, fontWeight: 600, textTransform: 'capitalize' }} />
                      </TableCell>
                      <TableCell sx={{ maxWidth: 280, color: '#555', fontSize: '0.8rem' }}>
                        <Box sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {row.prompt || row.query || '—'}
                        </Box>
                      </TableCell>
                      <TableCell sx={{ color: '#888', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                        {row.createdAt ? new Date(row.createdAt).toLocaleString() : '—'}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </AdminLayout>
  );
};

export default AIUsageLogs;
