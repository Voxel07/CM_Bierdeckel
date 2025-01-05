import { useState, useRef } from 'react';
import { 
  Box,
  Paper,
  Typography,
  Button,
  Alert,
  CircularProgress,
  IconButton
} from '@mui/material';

import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';
import { AlertsManager , AlertsContext } from '../utils/AlertsManager';

import axios from 'axios';

// Styled component for the upload area
const UploadBox = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  cursor: 'pointer',
  backgroundColor: theme.palette.grey[50],
  border: `2px dashed ${theme.palette.grey[300]}`,
  '&:hover': {
    backgroundColor: theme.palette.grey[100],
  },
  height: 200,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center'
}));

const PdfUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const alertsManagerRef =  useRef(AlertsContext);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError(null);
    } else {
      setFile(null);
      setError('Please select a valid PDF file');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }
  
    setUploading(true);
    setError(null);
    setSuccess(false);
  
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      const response = await axios.post('/upload/pdf', formData, {
        headers: {
          'Content-Type': 'multipart/form-data' // Set content type for uploads
        }
      });
  
      if (!response.ok) {
        throw new Error('Upload failed');
      }
  
      const data = await response.json();
      setSuccess(true);
      setFile(null);
    } catch (err) {
      alertsManagerRef.current.showAlert('error', JSON.stringify(err));
      setError('Failed to upload file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    setError(null);
    setSuccess(false);
  };

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', p: 3 }}>
      <AlertsManager ref={alertsManagerRef} />
      <input
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        id="pdf-upload"
      />
      <label htmlFor="pdf-upload">
        <UploadBox>
          <CloudUploadIcon sx={{ fontSize: 48, color: 'grey.500', mb: 2 }} />
          <Typography variant="body1" color="textSecondary">
            {file ? (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                {file.name}
                <IconButton size="small" onClick={(e) => { e.preventDefault(); clearFile(); }}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            ) : (
              'Click to select or drag and drop a PDF'
            )}
          </Typography>
        </UploadBox>
      </label>

      {error && (
        <Alert 
          severity="error" 
          sx={{ mt: 2 }}
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}

      {success && (
        <Alert 
          severity="success" 
          sx={{ mt: 2 }}
          onClose={() => setSuccess(false)}
        >
          File uploaded successfully!
        </Alert>
      )}

      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleUpload}
        disabled={!file || uploading}
        sx={{ mt: 2 }}
        startIcon={uploading ? <CircularProgress size={20} color="inherit" /> : <CloudUploadIcon />}
      >
        {uploading ? 'Uploading...' : 'Upload PDF'}
      </Button>
    </Box>
  );
};

export default PdfUpload;