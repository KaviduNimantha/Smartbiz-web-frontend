import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Grid, Card, CardContent, CardActions,
  Button, Chip, Divider, CircularProgress, Snackbar, Alert, Dialog,
  DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import {
  CheckOutlined, WorkspacePremiumOutlined, StarOutlined
} from '@mui/icons-material';
import DashboardLayout from '../components/layout/DashboardLayout';
import { subscriptionApi } from '../api/subscriptionApi';

const PLAN_COLORS = ['#4f8ef7', '#7c3aed', '#f77f4f', '#4caf50', '#e91e63'];

const OwnerSubscriptionPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(false);
  const [confirmPlan, setConfirmPlan] = useState(null);
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });

  // Get current user's subscriptionPlanId from localStorage
  const user = (() => { try { return JSON.parse(localStorage.getItem('user')) || {}; } catch { return {}; } })();
  const [currentPlanId, setCurrentPlanId] = useState(user.subscriptionPlanId || null);

  const showSnack = (m, s = 'success') => setSnack({ open: true, message: m, severity: s });

  useEffect(() => {
    subscriptionApi.getPlans()
      .then((res) => setPlans(res.data || []))
      .catch(() => showSnack('Failed to load plans', 'error'))
      .finally(() => setLoading(false));
  }, []);

  const parseFeatures = (f) => {
    if (!f) return [];
    if (Array.isArray(f)) return f;
    try { return JSON.parse(f); } catch { return [String(f)]; }
  };

  const handleSelect = async () => {
    if (!confirmPlan) return;
    setSubscribing(true);
    try {
      const res = await subscriptionApi.selectPlan(confirmPlan.id);
      setCurrentPlanId(confirmPlan.id);
      // Update localStorage so subsequent renders know the plan
      const updatedUser = { ...user, subscriptionPlanId: confirmPlan.id };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      showSnack(res.message || `Subscribed to ${confirmPlan.name} plan!`);
      setConfirmPlan(null);
    } catch (err) {
      showSnack(err.message || 'Failed to select plan', 'error');
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <DashboardLayout title="Subscription Plans">
      {/* Header */}
      <Paper elevation={0} sx={{
        mb: 3, p: 3, borderRadius: 3,
        background: 'linear-gradient(135deg, #1a237e 0%, #7c3aed 100%)', color: '#fff',
        display: 'flex', alignItems: 'center', gap: 2,
      }}>
        <WorkspacePremiumOutlined sx={{ fontSize: 40 }} />
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.25 }}>Choose Your Plan</Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.75)' }}>
            Upgrade your SmartBiz experience with a subscription
          </Typography>
        </Box>
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>
      ) : plans.length === 0 ? (
        <Paper elevation={0} sx={{ p: 6, borderRadius: 3, textAlign: 'center', border: '2px dashed rgba(0,0,0,0.1)' }}>
          <Typography variant="h6" sx={{ color: '#888' }}>No subscription plans available yet.</Typography>
          <Typography variant="body2" sx={{ color: '#aaa', mt: 1 }}>Contact your administrator.</Typography>
        </Paper>
      ) : (
        <Grid container spacing={2.5} justifyContent="center">
          {plans.map((plan, idx) => {
            const color = PLAN_COLORS[idx % PLAN_COLORS.length];
            const featureList = parseFeatures(plan.features);
            const isActive = currentPlanId === plan.id;
            return (
              <Grid key={plan.id} size={{ xs: 12, sm: 6, lg: 4 }}>
                <Card elevation={0} sx={{
                  borderRadius: 3, height: '100%', display: 'flex', flexDirection: 'column',
                  border: isActive ? `2px solid ${color}` : `2px solid ${color}22`,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  position: 'relative',
                  '&:hover': { transform: 'translateY(-4px)', boxShadow: `0 12px 32px ${color}33` },
                }}>
                  {isActive && (
                    <Chip
                      icon={<StarOutlined sx={{ fontSize: 14 }} />}
                      label="Current Plan"
                      size="small"
                      sx={{
                        position: 'absolute', top: -1, right: 16,
                        bgcolor: color, color: '#fff', fontWeight: 700, borderRadius: '0 0 8px 8px',
                        fontSize: '0.72rem',
                      }}
                    />
                  )}
                  <CardContent sx={{ p: 3, flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                      <Box sx={{ width: 48, height: 48, borderRadius: 2.5, bgcolor: `${color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>
                        <WorkspacePremiumOutlined />
                      </Box>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 800, color: '#1a237e', lineHeight: 1 }}>{plan.name}</Typography>
                        <Chip label={plan.billingCycle} size="small"
                          sx={{ mt: 0.5, bgcolor: `${color}22`, color, fontWeight: 600, textTransform: 'capitalize', fontSize: '0.7rem' }} />
                      </Box>
                    </Box>

                    <Typography variant="h3" sx={{ fontWeight: 900, color, mb: 0.5, lineHeight: 1 }}>
                      ${parseFloat(plan.price || 0).toFixed(2)}
                      <Typography component="span" variant="body2" sx={{ color: '#999', fontWeight: 400, ml: 0.5 }}>
                        /{plan.billingCycle}
                      </Typography>
                    </Typography>

                    {featureList.length > 0 && (
                      <>
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                          {featureList.map((f, i) => (
                            <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <CheckOutlined sx={{ fontSize: 16, color, flexShrink: 0 }} />
                              <Typography variant="body2" sx={{ color: '#555' }}>{f}</Typography>
                            </Box>
                          ))}
                        </Box>
                      </>
                    )}
                  </CardContent>

                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button
                      fullWidth variant={isActive ? 'outlined' : 'contained'}
                      disabled={isActive}
                      onClick={() => setConfirmPlan(plan)}
                      sx={{
                        borderRadius: 2, fontWeight: 700, py: 1.25,
                        ...(isActive
                          ? { borderColor: color, color }
                          : { bgcolor: color, '&:hover': { bgcolor: color, filter: 'brightness(0.9)' } }
                        ),
                      }}
                    >
                      {isActive ? '✓ Active Plan' : 'Subscribe'}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Confirm subscription dialog */}
      <Dialog open={!!confirmPlan} onClose={() => setConfirmPlan(null)} PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700, color: '#1a237e' }}>Confirm Subscription</DialogTitle>
        <DialogContent>
          <Typography>
            Subscribe to the <strong>{confirmPlan?.name}</strong> plan for{' '}
            <strong>${parseFloat(confirmPlan?.price || 0).toFixed(2)}/{confirmPlan?.billingCycle}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmPlan(null)}>Cancel</Button>
          <Button variant="contained" onClick={handleSelect} disabled={subscribing}
            sx={{ background: 'linear-gradient(90deg, #4f8ef7, #7c3aed)', borderRadius: 2, fontWeight: 600 }}>
            {subscribing ? <CircularProgress size={20} color="inherit" /> : 'Confirm & Subscribe'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack({ ...snack, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={snack.severity} variant="filled" onClose={() => setSnack({ ...snack, open: false })}>{snack.message}</Alert>
      </Snackbar>
    </DashboardLayout>
  );
};

export default OwnerSubscriptionPlans;
