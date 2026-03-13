import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Link as MuiLink,
  Paper,
  Alert,
  Snackbar,
  CircularProgress,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  EmailOutlined,
  LockOutlined,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { email, password } = formData;
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await authApi.loginUser({ email, password });
      // response.data.user contains id, email, role, businessName, ownerName
      const user = response.data?.user;
      if (user?.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', py: 4 }}
    >
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: { xs: 3, sm: 5 },
          borderRadius: 4,
          backgroundColor: 'rgba(255, 255, 255, 0.12)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.4)',
        }}
      >
        {/* Brand */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 800, color: '#fff', letterSpacing: '-0.5px', mb: 0.5 }}
          >
            SmartBiz
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)' }}>
            Sign in to your account
          </Typography>
        </Box>

        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={handleChange}
            type="email"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailOutlined sx={{ color: 'rgba(255,255,255,0.6)' }} />
                </InputAdornment>
              ),
            }}
            sx={inputSx}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlined sx={{ color: 'rgba(255,255,255,0.6)' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword((v) => !v)} edge="end" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={inputSx}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              mb: 2,
              py: 1.5,
              fontWeight: 700,
              fontSize: '1rem',
              borderRadius: 3,
              background: 'linear-gradient(90deg, #4f8ef7, #7c5cbf)',
              boxShadow: '0 4px 20px rgba(79, 142, 247, 0.4)',
              '&:hover': {
                background: 'linear-gradient(90deg, #3a78e8, #6a4aadad)',
                boxShadow: '0 6px 24px rgba(79, 142, 247, 0.5)',
              },
            }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
          </Button>

          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item>
              <MuiLink
                href="#"
                variant="body2"
                sx={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', '&:hover': { color: '#fff' } }}
              >
                Forgot password?
              </MuiLink>
            </Grid>
            <Grid item>
              <MuiLink
                component={Link}
                to="/register"
                variant="body2"
                sx={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', '&:hover': { color: '#fff' } }}
              >
                No account?{' '}
                <Box component="span" sx={{ fontWeight: 700, color: '#4f8ef7' }}>
                  Sign Up
                </Box>
              </MuiLink>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setError(null)} severity="error" variant="filled" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
};

// Shared glassmorphism input styles
const inputSx = {
  '& .MuiOutlinedInput-root': {
    color: '#fff',
    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.25)' },
    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
    '&.Mui-focused fieldset': { borderColor: '#4f8ef7' },
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 2,
  },
  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.6)' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#4f8ef7' },
};

export default Login;
