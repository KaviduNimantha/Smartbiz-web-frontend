import React, { useEffect, useState } from 'react';
import {
  Box, Button, Typography, Paper, Grid, Card, CardContent,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  CircularProgress, Snackbar, Alert, Chip, Divider, IconButton, Tooltip
} from '@mui/material';
import { AddOutlined, WorkspacePremiumOutlined, CheckOutlined, EditOutlined, DeleteOutlined } from '@mui/icons-material';
import AdminLayout from '../../components/layout/AdminLayout';
import { adminApi } from '../../api/adminApi';

const BILLING_CYCLES = ['monthly', 'yearly', 'lifetime'];
const emptyForm = { name: '', price: '', features: '', billingCycle: 'monthly' };
const PLAN_COLORS = ['#4f8ef7', '#7c3aed', '#f77f4f', '#4caf50', '#e91e63'];

const SubscriptionPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });

  const showSnack = (m, s = 'success') => setSnack({ open: true, message: m, severity: s });

  const fetchPlans = async () => {
    setLoading(true);
    try { const res = await adminApi.getPlans(); setPlans(res.data || []); }
    catch { showSnack('Failed to load plans', 'error'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchPlans(); }, []);

  const parseFeatures = (f) => {
    if (!f) return [];
    if (Array.isArray(f)) return f;
    try { return JSON.parse(f); } catch { return [String(f)]; }
  };

  const featuresToJson = (raw) => {
    if (!raw || raw.startsWith('[')) return raw;
    return JSON.stringify(raw.split(',').map(s => s.trim()).filter(Boolean));
  };

  const handleOpen = (plan = null) => {
    if (plan) {
      setEditId(plan.id);
      const featureList = parseFeatures(plan.features);
      setForm({ name: plan.name || '', price: plan.price || '', features: featureList.join(', '), billingCycle: plan.billingCycle || 'monthly' });
    } else {
      setEditId(null);
      setForm(emptyForm);
    }
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.price || !form.billingCycle) { showSnack('Fill in all required fields', 'warning'); return; }
    setSaving(true);
    try {
      const payload = { ...form, price: parseFloat(form.price), features: featuresToJson(form.features) };
      if (editId) {
        await adminApi.updatePlan(editId, payload);
        showSnack('Plan updated successfully');
      } else {
        await adminApi.createPlan(payload);
        showSnack('Plan created successfully');
      }
      setDialogOpen(false);
      setForm(emptyForm);
      setEditId(null);
      fetchPlans();
    } catch (err) { showSnack(err.message || 'Operation failed', 'error'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    try {
      await adminApi.deletePlan(deleteId);
      showSnack('Plan deleted successfully');
      setDeleteId(null);
      fetchPlans();
    } catch (err) { showSnack(err.message || 'Delete failed', 'error'); }
  };

  return (
    <AdminLayout title="Subscription Plans">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1b0036' }}>Manage Subscription Plans</Typography>
        <Button variant="contained" startIcon={<AddOutlined />} onClick={() => handleOpen()}
          sx={{ borderRadius: 2, background: 'linear-gradient(90deg, #7c3aed, #4f8ef7)', fontWeight: 600 }}>
          Create Plan
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress sx={{ color: '#7c3aed' }} /></Box>
      ) : plans.length === 0 ? (
        <Paper elevation={0} sx={{ p: 6, borderRadius: 3, textAlign: 'center', border: '2px dashed rgba(124,58,237,0.2)' }}>
          <WorkspacePremiumOutlined sx={{ fontSize: 48, color: '#c084fc', mb: 2 }} />
          <Typography variant="h6" sx={{ color: '#7c3aed', fontWeight: 700, mb: 1 }}>No plans yet</Typography>
          <Typography variant="body2" sx={{ color: '#aaa', mb: 3 }}>Create your first subscription plan</Typography>
          <Button variant="contained" startIcon={<AddOutlined />} onClick={() => handleOpen()}
            sx={{ background: 'linear-gradient(90deg, #7c3aed, #4f8ef7)', borderRadius: 2, fontWeight: 600 }}>
            Create First Plan
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={2.5}>
          {plans.map((plan, idx) => {
            const color = PLAN_COLORS[idx % PLAN_COLORS.length];
            const featureList = parseFeatures(plan.features);
            return (
              <Grid key={plan.id} size={{ xs: 12, sm: 6, xl: 4 }}>
                <Card elevation={0} sx={{
                  borderRadius: 3, border: `2px solid ${color}22`, height: '100%', position: 'relative',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': { transform: 'translateY(-4px)', boxShadow: `0 12px 32px ${color}33` }
                }}>
                  {/* Action buttons */}
                  <Box sx={{ position: 'absolute', top: 12, right: 12, display: 'flex', gap: 0.5 }}>
                    <Tooltip title="Edit Plan">
                      <IconButton size="small" onClick={() => handleOpen(plan)} sx={{ bgcolor: '#f0f0f0', '&:hover': { bgcolor: '#e8f0fe' } }}>
                        <EditOutlined fontSize="small" sx={{ color: '#4f8ef7' }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Plan">
                      <IconButton size="small" onClick={() => setDeleteId(plan.id)} sx={{ bgcolor: '#f0f0f0', '&:hover': { bgcolor: '#ffebee' } }}>
                        <DeleteOutlined fontSize="small" sx={{ color: '#f44336' }} />
                      </IconButton>
                    </Tooltip>
                  </Box>

                  <CardContent sx={{ p: 3, pt: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                      <Box sx={{ width: 44, height: 44, borderRadius: 2, bgcolor: `${color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>
                        <WorkspacePremiumOutlined />
                      </Box>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 800, color: '#1b0036', lineHeight: 1 }}>{plan.name}</Typography>
                        <Chip label={plan.billingCycle} size="small"
                          sx={{ mt: 0.5, bgcolor: `${color}22`, color, fontWeight: 600, textTransform: 'capitalize', fontSize: '0.7rem' }} />
                      </Box>
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 900, color, mb: 0.5 }}>
                      ${parseFloat(plan.price || 0).toFixed(2)}
                      <Typography component="span" variant="body2" sx={{ color: '#999', fontWeight: 400, ml: 0.5 }}>/{plan.billingCycle}</Typography>
                    </Typography>
                    {featureList.length > 0 && (
                      <>
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                          {featureList.map((feature, i) => (
                            <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <CheckOutlined sx={{ fontSize: 16, color, flexShrink: 0 }} />
                              <Typography variant="body2" sx={{ color: '#555' }}>{feature}</Typography>
                            </Box>
                          ))}
                        </Box>
                      </>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => { setDialogOpen(false); setEditId(null); setForm(emptyForm); }}
        maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700, color: '#1b0036' }}>{editId ? 'Edit Plan' : 'Create Plan'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField label="Plan Name *" fullWidth size="small" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Pro, Starter, Enterprise" />
            <TextField label="Price ($) *" type="number" fullWidth size="small" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            <TextField label="Billing Cycle *" select fullWidth size="small" value={form.billingCycle}
              onChange={(e) => setForm({ ...form, billingCycle: e.target.value })} SelectProps={{ native: true }}>
              {BILLING_CYCLES.map((c) => <option key={c} value={c}>{c}</option>)}
            </TextField>
            <TextField label="Features (comma-separated)" fullWidth multiline minRows={3} size="small"
              value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })}
              placeholder="Unlimited products, AI reports, Email support"
              helperText="Separate features with commas" />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => { setDialogOpen(false); setEditId(null); setForm(emptyForm); }}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={saving}
            sx={{ background: 'linear-gradient(90deg, #7c3aed, #4f8ef7)', borderRadius: 2, fontWeight: 600 }}>
            {saving ? <CircularProgress size={20} color="inherit" /> : editId ? 'Update Plan' : 'Create Plan'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)} PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Delete Plan</DialogTitle>
        <DialogContent>
          <Typography>Are you sure? This will unassign all users from this plan.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDelete}>Delete</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack({ ...snack, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={snack.severity} variant="filled" onClose={() => setSnack({ ...snack, open: false })}>{snack.message}</Alert>
      </Snackbar>
    </AdminLayout>
  );
};

export default SubscriptionPlans;
