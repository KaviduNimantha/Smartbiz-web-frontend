import React, { useState } from 'react';
import {
  Container, Box, Typography, TextField, Button, Grid,
  Link as MuiLink, Paper, Alert, Snackbar, CircularProgress,
  InputAdornment, IconButton,
} from '@mui/material';
import {
  BusinessOutlined, PersonOutlined, EmailOutlined,
  LockOutlined, Visibility, VisibilityOff,
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    businessName: '', ownerName: '', email: '', password: '', confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const { businessName, ownerName, email, password, confirmPassword } = formData;
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const validateForm = () => {
    if (!businessName || !ownerName || !email || !password || !confirmPassword) { setError('Please fill in all fields.'); return false; }
    if (password !== confirmPassword) { setError('Passwords do not match.'); return false; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return false; }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true); setError(null);
    try {
      await authApi.registerUser({ businessName, ownerName, email, password });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <Container component="main" maxWidth="sm"
      sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', py: 4 }}>
      <Paper elevation={0} sx={{
        width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: { xs: 3, sm: 5 }, borderRadius: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.12)', backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.2)', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.4)',
      }}>
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#fff', letterSpacing: '-0.5px', mb: 0.5 }}>
            SmartBiz
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
            Create your business account
          </Typography>
        </Box>

        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ width: '100%' }}>
          {/* MUI v7 Grid v2 — use size prop */}
          <Grid container spacing={2}>
            <Grid size={12}>
              <TextField name="businessName" required fullWidth id="businessName" label="Business Name"
                autoFocus value={businessName} onChange={handleChange}
                InputProps={{ startAdornment: <InputAdornment position="start"><BusinessOutlined sx={{ color: 'rgba(255,255,255,0.6)' }} /></InputAdornment> }}
                sx={inputSx} />
            </Grid>
            <Grid size={12}>
              <TextField name="ownerName" required fullWidth id="ownerName" label="Owner Name"
                value={ownerName} onChange={handleChange}
                InputProps={{ startAdornment: <InputAdornment position="start"><PersonOutlined sx={{ color: 'rgba(255,255,255,0.6)' }} /></InputAdornment> }}
                sx={inputSx} />
            </Grid>
            <Grid size={12}>
              <TextField required fullWidth id="email" label="Email Address" name="email"
                autoComplete="email" type="email" value={email} onChange={handleChange}
                InputProps={{ startAdornment: <InputAdornment position="start"><EmailOutlined sx={{ color: 'rgba(255,255,255,0.6)' }} /></InputAdornment> }}
                sx={inputSx} />
            </Grid>
            <Grid size={12}>
              <TextField required fullWidth name="password" label="Password"
                type={showPassword ? 'text' : 'password'} id="password"
                value={password} onChange={handleChange}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><LockOutlined sx={{ color: 'rgba(255,255,255,0.6)' }} /></InputAdornment>,
                  endAdornment: <InputAdornment position="end"><IconButton onClick={() => setShowPassword(v => !v)} edge="end" sx={{ color: 'rgba(255,255,255,0.6)' }}>{showPassword ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment>,
                }}
                sx={inputSx} />
            </Grid>
            <Grid size={12}>
              <TextField required fullWidth name="confirmPassword" label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'} id="confirmPassword"
                value={confirmPassword} onChange={handleChange}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><LockOutlined sx={{ color: 'rgba(255,255,255,0.6)' }} /></InputAdornment>,
                  endAdornment: <InputAdornment position="end"><IconButton onClick={() => setShowConfirmPassword(v => !v)} edge="end" sx={{ color: 'rgba(255,255,255,0.6)' }}>{showConfirmPassword ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment>,
                }}
                sx={inputSx} />
            </Grid>
          </Grid>

          <Button type="submit" fullWidth variant="contained" disabled={loading}
            sx={{ mt: 3, mb: 2, py: 1.5, fontWeight: 700, fontSize: '1rem', borderRadius: 3,
              background: 'linear-gradient(90deg, #4f8ef7, #7c5cbf)',
              boxShadow: '0 4px 20px rgba(79, 142, 247, 0.4)',
              '&:hover': { background: 'linear-gradient(90deg, #3a78e8, #6a4aad)' },
            }}>
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
          </Button>

          <Box sx={{ textAlign: 'center' }}>
            <MuiLink component={Link} to="/login" variant="body2"
              sx={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', '&:hover': { color: '#fff' } }}>
              Already have an account?{' '}
              <Box component="span" sx={{ fontWeight: 700, color: '#4f8ef7' }}>Sign In</Box>
            </MuiLink>
          </Box>
        </Box>
      </Paper>

      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={() => setError(null)} severity="error" variant="filled">{error}</Alert>
      </Snackbar>
      <Snackbar open={success} autoHideDuration={4000} onClose={() => setSuccess(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success" variant="filled">Registration successful! Redirecting to login...</Alert>
      </Snackbar>
    </Container>
  );
};

const inputSx = {
  '& .MuiOutlinedInput-root': {
    color: '#fff',
    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.25)' },
    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
    '&.Mui-focused fieldset': { borderColor: '#4f8ef7' },
    backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 2,
  },
  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.6)' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#4f8ef7' },
};

export default Register;
