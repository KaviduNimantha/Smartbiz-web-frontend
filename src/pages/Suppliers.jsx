import React, { useEffect, useState } from 'react';
import {
  Box, Button, Typography, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, CircularProgress, Snackbar, Alert, Tooltip, Chip
} from '@mui/material';
import { AddOutlined, EditOutlined, DeleteOutlined } from '@mui/icons-material';
import DashboardLayout from '../components/layout/DashboardLayout';
import { supplierApi } from '../api/supplierApi';

const emptyForm = { supplierName: '', productName: '', quantity: '', price: '', date: '' };

const Suppliers = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });

  const showSnack = (message, severity = 'success') => setSnack({ open: true, message, severity });

  const fetchAll = async () => {
    setLoading(true);
    try {
      const res = await supplierApi.getAll();
      setRows(res.data || []);
    } catch { showSnack('Failed to load suppliers', 'error'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleOpen = (row = null) => {
    if (row) {
      setEditId(row.id);
      setForm({
        supplierName: row.supplierName || '',
        productName: row.productName || '',
        quantity: row.quantity || '',
        price: row.price || '',
        date: row.date ? row.date.substring(0, 10) : '',
      });
    } else {
      setEditId(null);
      setForm(emptyForm);
    }
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.supplierName || !form.productName || !form.quantity || !form.price) {
      showSnack('Please fill in all required fields', 'warning'); return;
    }
    setSaving(true);
    try {
      if (editId) {
        await supplierApi.update(editId, form);
        showSnack('Supplier updated successfully');
      } else {
        await supplierApi.add(form);
        showSnack('Supplier added and inventory updated');
      }
      setDialogOpen(false);
      fetchAll();
    } catch (err) { showSnack(err.message || 'Operation failed', 'error'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    try {
      await supplierApi.delete(deleteId);
      showSnack('Supplier deleted and stock reverted');
      setDeleteId(null);
      fetchAll();
    } catch (err) { showSnack(err.message || 'Delete failed', 'error'); }
  };

  return (
    <DashboardLayout title="Suppliers">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a237e' }}>
          Supplier Records
        </Typography>
        <Button variant="contained" startIcon={<AddOutlined />} onClick={() => handleOpen()}
          sx={{ borderRadius: 2, background: 'linear-gradient(90deg, #4f8ef7, #7c5cbf)', fontWeight: 600 }}>
          Add Supplier
        </Button>
      </Box>

      <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress /></Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f5f7ff' }}>
                  {['Supplier Name', 'Product', 'Quantity', 'Price', 'Date', 'Actions'].map((h) => (
                    <TableCell key={h} sx={{ fontWeight: 700, color: '#1a237e', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow><TableCell colSpan={6} align="center" sx={{ py: 6, color: '#aaa' }}>No suppliers yet. Add your first supplier.</TableCell></TableRow>
                ) : rows.map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell sx={{ fontWeight: 600 }}>{row.supplierName}</TableCell>
                    <TableCell>{row.productName}</TableCell>
                    <TableCell><Chip label={row.quantity} size="small" sx={{ bgcolor: '#e8f0fe', color: '#1a237e', fontWeight: 600 }} /></TableCell>
                    <TableCell>${parseFloat(row.price).toFixed(2)}</TableCell>
                    <TableCell>{row.date ? new Date(row.date).toLocaleDateString() : '—'}</TableCell>
                    <TableCell>
                      <Tooltip title="Edit"><IconButton size="small" onClick={() => handleOpen(row)} sx={{ color: '#4f8ef7' }}><EditOutlined fontSize="small" /></IconButton></Tooltip>
                      <Tooltip title="Delete"><IconButton size="small" onClick={() => setDeleteId(row.id)} sx={{ color: '#f44336' }}><DeleteOutlined fontSize="small" /></IconButton></Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700, color: '#1a237e' }}>{editId ? 'Edit Supplier' : 'Add Supplier'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            {[
              { name: 'supplierName', label: 'Supplier Name', type: 'text' },
              { name: 'productName', label: 'Product Name', type: 'text' },
              { name: 'quantity', label: 'Quantity', type: 'number' },
              { name: 'price', label: 'Price ($)', type: 'number' },
              { name: 'date', label: 'Date', type: 'date' },
            ].map((f) => (
              <TextField key={f.name} label={f.label} type={f.type} fullWidth
                value={form[f.name]} onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                InputLabelProps={f.type === 'date' ? { shrink: true } : {}}
                size="small" />
            ))}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={saving}
            sx={{ borderRadius: 2, background: 'linear-gradient(90deg, #4f8ef7, #7c5cbf)', fontWeight: 600 }}>
            {saving ? <CircularProgress size={20} color="inherit" /> : editId ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)} PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Delete Supplier</DialogTitle>
        <DialogContent><Typography>Are you sure? This will also revert the stock.</Typography></DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDelete}>Delete</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack({ ...snack, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={snack.severity} variant="filled" onClose={() => setSnack({ ...snack, open: false })}>{snack.message}</Alert>
      </Snackbar>
    </DashboardLayout>
  );
};

export default Suppliers;
