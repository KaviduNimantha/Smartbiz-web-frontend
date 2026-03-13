import React, { useState } from 'react';
import {
  Box, Typography, Paper, TextField, Button, CircularProgress,
  Tabs, Tab, Card, CardContent, Divider, Alert
} from '@mui/material';
import {
  InsightsOutlined, EmailOutlined, CampaignOutlined, ReceiptLongOutlined, SmartToyOutlined
} from '@mui/icons-material';
import DashboardLayout from '../components/layout/DashboardLayout';
import { aiApi } from '../api/aiApi';

const AI_TOOLS = [
  {
    id: 'report',
    label: 'Business Report',
    icon: <InsightsOutlined />,
    description: 'Ask questions about your business performance in plain English.',
    placeholder: 'e.g. How did I perform last month? What are my top products?',
    color: '#4f8ef7',
  },
  {
    id: 'email',
    label: 'Email Composer',
    icon: <EmailOutlined />,
    description: 'Generate professional emails for customers, suppliers, or partners.',
    placeholder: 'e.g. Write a thank-you email to a customer for their recent purchase.',
    color: '#7c5cbf',
  },
  {
    id: 'post',
    label: 'Social Media Post',
    icon: <CampaignOutlined />,
    description: 'Create engaging social media content for your business.',
    placeholder: 'e.g. Write a Facebook post for our 50% off sale this weekend.',
    color: '#f77f4f',
  },
  {
    id: 'invoice',
    label: 'Invoice Summary',
    icon: <ReceiptLongOutlined />,
    description: 'Paste invoice data and get a simple, customer-friendly explanation.',
    placeholder: 'Paste invoice data here (JSON or plain text)...',
    color: '#4caf50',
  },
];

const AIAssistant = () => {
  const [tab, setTab] = useState(0);
  const [prompts, setPrompts] = useState({ report: '', email: '', post: '', invoice: '' });
  const [results, setResults] = useState({ report: '', email: '', post: '', invoice: '' });
  const [loading, setLoading] = useState({ report: false, email: false, post: false, invoice: false });
  const [errors, setErrors] = useState({ report: '', email: '', post: '', invoice: '' });

  const tool = AI_TOOLS[tab];

  const handleGenerate = async () => {
    const id = tool.id;
    const prompt = prompts[id];
    if (!prompt.trim()) return;

    setLoading((l) => ({ ...l, [id]: true }));
    setErrors((e) => ({ ...e, [id]: '' }));
    setResults((r) => ({ ...r, [id]: '' }));

    try {
      let res;
      if (id === 'report') res = await aiApi.generateReport(prompt);
      else if (id === 'email') res = await aiApi.generateEmail(prompt);
      else if (id === 'post') res = await aiApi.generatePost(prompt);
      else if (id === 'invoice') res = await aiApi.summarizeInvoice(prompt);

      setResults((r) => ({ ...r, [id]: res.data }));
    } catch (err) {
      setErrors((e) => ({ ...e, [id]: err.message || 'AI request failed. Check your API key.' }));
    } finally {
      setLoading((l) => ({ ...l, [id]: false }));
    }
  };

  return (
    <DashboardLayout title="AI Assistant">
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          mb: 3, p: 3, borderRadius: 3,
          background: 'linear-gradient(135deg, #1a237e 0%, #7c5cbf 100%)',
          color: '#fff', display: 'flex', alignItems: 'center', gap: 2,
        }}
      >
        <SmartToyOutlined sx={{ fontSize: 40 }} />
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.25 }}>SmartBiz AI Assistant</Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.75)' }}>
            Powered by OpenAI • Generate reports, emails, social posts, and more
          </Typography>
        </Box>
      </Paper>

      {/* Tabs */}
      <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            bgcolor: '#f5f7ff',
            borderBottom: '1px solid rgba(0,0,0,0.06)',
            '& .MuiTab-root': { fontWeight: 600, textTransform: 'none', fontSize: '0.875rem', py: 2 },
            '& .Mui-selected': { color: AI_TOOLS[tab].color },
            '& .MuiTabs-indicator': { backgroundColor: AI_TOOLS[tab].color, height: 3 },
          }}
        >
          {AI_TOOLS.map((t) => (
            <Tab key={t.id} label={t.label} icon={t.icon} iconPosition="start" />
          ))}
        </Tabs>

        <Box sx={{ p: 3 }}>
          <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
            {tool.description}
          </Typography>

          <TextField
            fullWidth
            multiline
            minRows={4}
            maxRows={10}
            label={tool.label + ' Prompt'}
            placeholder={tool.placeholder}
            value={prompts[tool.id]}
            onChange={(e) => setPrompts((p) => ({ ...p, [tool.id]: e.target.value }))}
            sx={{ mb: 2 }}
          />

          <Button
            variant="contained"
            onClick={handleGenerate}
            disabled={loading[tool.id] || !prompts[tool.id].trim()}
            startIcon={loading[tool.id] ? <CircularProgress size={18} color="inherit" /> : tool.icon}
            sx={{
              py: 1.25, px: 3, fontWeight: 700, borderRadius: 2,
              bgcolor: tool.color,
              '&:hover': { bgcolor: tool.color, filter: 'brightness(0.9)' },
            }}
          >
            {loading[tool.id] ? 'Generating...' : `Generate ${tool.label}`}
          </Button>

          {errors[tool.id] && (
            <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>{errors[tool.id]}</Alert>
          )}

          {results[tool.id] && (
            <>
              <Divider sx={{ my: 3 }} />
              <Card elevation={0} sx={{ bgcolor: '#f8f9ff', border: '1px solid rgba(79,142,247,0.2)', borderRadius: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: tool.color }}>
                      ✨ AI Response
                    </Typography>
                    <Button
                      size="small"
                      onClick={() => navigator.clipboard.writeText(results[tool.id])}
                      sx={{ textTransform: 'none', color: '#888', fontSize: '0.75rem' }}
                    >
                      Copy
                    </Button>
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8, color: '#333' }}
                  >
                    {results[tool.id]}
                  </Typography>
                </CardContent>
              </Card>
            </>
          )}
        </Box>
      </Paper>
    </DashboardLayout>
  );
};

export default AIAssistant;
