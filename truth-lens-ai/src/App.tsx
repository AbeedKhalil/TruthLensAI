import React, { useState } from 'react';
import { Container, TextField, Button, Paper, Typography, Box, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';

function App() {
  const [text, setText] = useState('');
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_KEY = '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';
  const MODEL_URL = 'https://api-inference.huggingface.co/models/facebook/bart-large-mnli';

  const analyzeText = async () => {
    if (!text.trim()) {
      setError('Please enter some text to analyze');
      return;
    }

    setLoading(true);
    setError('');
    setResults(null);

    try {
      // Bias Analysis
      const biasResponse = await axios.post(
        MODEL_URL,
        {
          inputs: text,
          parameters: {
            candidate_labels: [
              'biased language',
              'hate speech',
              'neutral language',
              'respectful language'
            ]
          }
        },
        { headers: { Authorization: `Bearer ${API_KEY}` } }
      );

      // Fact Check Analysis
      const factResponse = await axios.post(
        MODEL_URL,
        {
          inputs: text,
          parameters: {
            candidate_labels: [
              'factual information',
              'opinion',
              'misleading information',
              'needs verification'
            ]
          }
        },
        { headers: { Authorization: `Bearer ${API_KEY}` } }
      );

      const formatResults = (response: any) => {
        const { labels, scores } = response;
        return labels.map((label: string, index: number) => ({
          label,
          score: Math.round(scores[index] * 100)
        })).sort((a: any, b: any) => b.score - a.score);
      };

      setResults({
        bias: formatResults(biasResponse.data),
        factCheck: formatResults(factResponse.data)
      });
    } catch (err: any) {
      console.error('Analysis error:', err);
      if (err.response?.status === 503) {
        setError('The model is currently loading. Please wait a few seconds and try again.');
      } else {
        setError('Error analyzing text. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const ResultSection = ({ title, results }: { title: string; results: any[] }) => (
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
        {title}
      </Typography>
      {results.map(({ label, score }) => (
        <Box key={label} sx={{ mb: 1 }}>
          <Typography variant="body1">
            {label}: <strong>{score}%</strong>
          </Typography>
        </Box>
      ))}
    </Box>
  );

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        TruthLens AI - Bias & Misinformation Detector
      </Typography>
      
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <TextField
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          label="Enter text to analyze"
          placeholder="Enter the text you want to analyze for bias and factual accuracy..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button 
          variant="contained" 
          onClick={analyzeText}
          disabled={loading}
          fullWidth
        >
          {loading ? <CircularProgress size={24} /> : 'Analyze Text'}
        </Button>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {results && (
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Analysis Results</Typography>
          
          <ResultSection title="Bias Analysis" results={results.bias} />
          <ResultSection title="Fact Check" results={results.factCheck} />
          
          <Alert severity="info" sx={{ mt: 2 }}>
            Note: These results are AI-generated predictions and should be used as guidance rather than absolute truth.
          </Alert>
        </Paper>
      )}
    </Container>
  );
}

export default App;