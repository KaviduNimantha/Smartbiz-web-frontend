import React, { useEffect, useState } from 'react';
import {
  Box, Button, Typography, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, CircularProgress, Snackbar, Alert, Tooltip, Chip
} from '@mui/material';
import { AddOutlined, EditOutlined, DeleteOutlined } from '@mui/icons-material';
import DashboardLayout from '../components/layout/DashboardLayout';
import { expenseApi } from '../api/expenseApi';

const emptyForm = { title: '', amount: '', date: '' };

const Expenses = () => {
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
    try { const res = await expenseApi.getAll(); setRows(res.data || []); }
    catch { showSnack('Failed to load expenses', 'error'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleOpen = (row = null) => {
    if (row) { setEditId(row.id); setForm({ title: row.title || '', amount: row.amount || '', date: row.date ? row.date.substring(0, 10) : '' }); }
    else { setEditId(null); setForm(emptyForm); }
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.amount) { showSnack('Please fill in all required fields', 'warning'); return; }
    setSaving(true);
    try {
      if (editId) { await expenseApi.update(editId, form); showSnack('Expense updated'); }
      else { await expenseApi.add(form); showSnack('Expense added'); }
      setDialogOpen(false); fetchAll();
    } catch (err) { showSnack(err.message || 'Operation failed', 'error'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    try { await expenseApi.delete(deleteId); showSnack('Expense deleted'); setDeleteId(null); fetchAll(); }
    catch (err) { showSnack(err.message || 'Delete failed', 'error'); }
  };

  const totalExpenses = rows.reduce((sum, r) => sum + parseFloat(r.amount || 0), 0);

  return (
    <DashboardLayout title="Expenses">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a237e' }}>Expense Records</Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Chip label={`Total: $${totalExpenses.toFixed(2)}`} sx={{ bgcolor: '#fff3e0', color: '#e65100', fontWeight: 700 }} />
          <Button variant="contained" startIcon={<AddOutlined />} onClick={() => handleOpen()}
            sx={{ borderRadius: 2, background: 'linear-gradient(90deg, #4f8ef7, #7c5cbf)', fontWeight: 600 }}>
            Add Expense
          </Button>
        </Box>
      </Box>

      <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        {loading ? <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress /></Box> : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f5f7ff' }}>
                  {['Title', 'Amount', 'Date', 'Actions'].map((h) => (
                    <TableCell key={h} sx={{ fontWeight: 700, color: '#1a237e', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow><TableCell colSpan={4} align="center" sx={{ py: 6, color: '#aaa' }}>No expenses yet.</TableCell></TableRow>
                ) : rows.map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell sx={{ fontWeight: 600 }}>{row.title}</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#c62828' }}>${parseFloat(row.amount || 0).toFixed(2)}</TableCell>
                    <TableCell sx={{ color: '#888', fontSize: '0.85rem' }}>{row.date ? new Date(row.date).toLocaleDateString() : '—'}</TableCell>
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

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700, color: '#1a237e' }}>{editId ? 'Edit Expense' : 'Add Expense'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField label="Title" fullWidth value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} size="small" />
            <TextField label="Amount ($)" type="number" fullWidth value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} size="small" />
            <TextField label="Date" type="date" fullWidth value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} InputLabelProps={{ shrink: true }} size="small" />
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

      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)} PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Delete Expense</DialogTitle>
        <DialogContent><Typography>Are you sure you want to delete this expense?</Typography></DialogContent>
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

export default Expenses;
