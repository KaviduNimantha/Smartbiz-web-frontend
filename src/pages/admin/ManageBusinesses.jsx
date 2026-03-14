import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, CircularProgress, Switch, Snackbar, Alert, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions, Button
} from '@mui/material';
import { BusinessOutlined } from '@mui/icons-material';
import AdminLayout from '../../components/layout/AdminLayout';
import { adminApi } from '../../api/adminApi';

const ManageBusinesses = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });
  const [confirmId, setConfirmId] = useState(null);
  const [confirmRow, setConfirmRow] = useState(null);
  const [toggling, setToggling] = useState(false);

  const showSnack = (message, severity = 'success') => setSnack({ open: true, message, severity });

  const fetchAll = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getBusinesses();
      setRows(res.data || []);
    } catch { showSnack('Failed to load businesses', 'error'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleToggle = (row) => {
    setConfirmId(row.id);
    setConfirmRow(row);
  };

  const confirmToggle = async () => {
    setToggling(true);
    try {
      const res = await adminApi.toggleBusinessStatus(confirmId);
      const updated = res.data;
      setRows((prev) => prev.map((r) => r.id === confirmId ? { ...r, isActive: updated.isActive } : r));
      showSnack(`Account ${updated.isActive ? 'activated' : 'deactivated'} successfully`);
    } catch (err) {
      showSnack(err.message || 'Toggle failed', 'error');
    } finally {
      setToggling(false);
      setConfirmId(null);
      setConfirmRow(null);
    }
  };

  return (
    <AdminLayout title="Manage Businesses">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1b0036' }}>Registered Business Owners</Typography>
        <Chip icon={<BusinessOutlined />} label={`${rows.length} Businesses`}
          sx={{ bgcolor: '#f3e8ff', color: '#7c3aed', fontWeight: 600 }} />
      </Box>

      <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress sx={{ color: '#7c3aed' }} /></Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f5f0ff' }}>
                  {['Business Name', 'Owner', 'Email', 'Join Date', 'Status', 'Toggle'].map((h) => (
                    <TableCell key={h} sx={{ fontWeight: 700, color: '#1b0036', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow><TableCell colSpan={6} align="center" sx={{ py: 6, color: '#aaa' }}>No registered businesses yet.</TableCell></TableRow>
                ) : rows.map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell sx={{ fontWeight: 700 }}>{row.businessName}</TableCell>
                    <TableCell>{row.ownerName}</TableCell>
                    <TableCell sx={{ color: '#555', fontSize: '0.875rem' }}>{row.email}</TableCell>
                    <TableCell sx={{ color: '#888', fontSize: '0.85rem' }}>
                      {row.createdAt ? new Date(row.createdAt).toLocaleDateString() : '—'}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={row.isActive ? 'Active' : 'Inactive'}
                        size="small"
                        sx={{
                          bgcolor: row.isActive ? '#e8f5e9' : '#ffebee',
                          color: row.isActive ? '#2e7d32' : '#c62828',
                          fontWeight: 600,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={!!row.isActive}
                        onChange={() => handleToggle(row)}
                        color="secondary"
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Confirm dialog */}
      <Dialog open={!!confirmId} onClose={() => { setConfirmId(null); setConfirmRow(null); }}
        PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700, color: '#1b0036' }}>Confirm Status Change</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to <strong>{confirmRow?.isActive ? 'deactivate' : 'activate'}</strong>{' '}
            <strong>{confirmRow?.businessName}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setConfirmId(null); setConfirmRow(null); }}>Cancel</Button>
          <Button variant="contained" onClick={confirmToggle} disabled={toggling}
            sx={{ bgcolor: confirmRow?.isActive ? '#f44336' : '#4caf50', '&:hover': { bgcolor: confirmRow?.isActive ? '#d32f2f' : '#388e3c' } }}>
            {toggling ? <CircularProgress size={20} color="inherit" /> : confirmRow?.isActive ? 'Deactivate' : 'Activate'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack({ ...snack, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={snack.severity} variant="filled" onClose={() => setSnack({ ...snack, open: false })}>{snack.message}</Alert>
      </Snackbar>
    </AdminLayout>
  );
};

export default ManageBusinesses;
