import React from 'react';
import { 
  Typography, 
  Paper, 
  Box, 
  Button,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import RefreshIcon from '@mui/icons-material/Refresh';
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';

// Custom styles for the markdown content
const markdownStyles = {
  container: {
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    lineHeight: 1.5
  },
  h1: {
    fontSize: '2rem',
    fontWeight: 600,
    marginTop: '0.5rem',
    marginBottom: '1rem',
    color: '#1976d2'
  },
  h2: {
    fontSize: '1.5rem',
    fontWeight: 500,
    marginTop: '1.5rem',
    marginBottom: '0.75rem',
    color: '#1976d2',
    borderBottom: '1px solid #e0e0e0',
    paddingBottom: '0.5rem'
  },
  h3: {
    fontSize: '1.25rem',
    fontWeight: 500,
    marginTop: '1.25rem',
    marginBottom: '0.5rem',
    color: '#333333'
  },
  p: {
    marginBottom: '1rem'
  },
  ul: {
    marginBottom: '1rem',
    paddingLeft: '1.5rem'
  },
  ol: {
    marginBottom: '1rem',
    paddingLeft: '1.5rem'
  },
  li: {
    marginBottom: '0.5rem'
  },
  strong: {
    fontWeight: 600
  },
  blockquote: {
    borderLeft: '4px solid #e0e0e0',
    paddingLeft: '1rem',
    fontStyle: 'italic',
    margin: '1rem 0'
  },
  emoji: {
    fontSize: '1.2em' // Make emojis slightly larger
  }
};

const Results = ({ advice, onReset }) => {
  let markdownContent = '';
  
  try {
    // Check if advice is a string or an object
    if (typeof advice === 'string') {
      try {
        // Try to parse it as JSON first (in case it's a stringified JSON)
        const parsedAdvice = JSON.parse(advice);
        markdownContent = parsedAdvice.markdown || '';
      } catch (error) {
        // If not a valid JSON, assume it's already markdown
        markdownContent = advice;
      }
    } else if (advice && advice.markdown) {
      // If it's an object with a markdown property
      markdownContent = advice.markdown;
    }
  } catch (error) {
    console.error("Error processing advice data:", error);
    markdownContent = '# 📄 Analisis Gagal\n\nMaaf, terjadi kesalahan saat memproses hasil analisis.';
  }
  
  const handleExport = () => {
    // Create a blob from the markdown content
    const blob = new Blob([markdownContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    // Create a temporary link and click it
    const link = document.createElement('a');
    link.href = url;
    link.download = 'CV_Analysis_Result.md';
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Custom component renderers
  const components = {
    h1: ({node, ...props}) => <Typography variant="h4" gutterBottom sx={markdownStyles.h1} {...props} />,
    h2: ({node, ...props}) => <Typography variant="h5" gutterBottom sx={markdownStyles.h2} {...props} />,
    h3: ({node, ...props}) => <Typography variant="h6" gutterBottom sx={markdownStyles.h3} {...props} />,
    p: ({node, ...props}) => <Typography variant="body1" paragraph sx={markdownStyles.p} {...props} />,
    ul: ({node, ...props}) => <Box component="ul" sx={markdownStyles.ul} {...props} />,
    ol: ({node, ...props}) => <Box component="ol" sx={markdownStyles.ol} {...props} />,
    li: ({node, ...props}) => <Box component="li" sx={markdownStyles.li} {...props} />,
    strong: ({node, ...props}) => <Box component="strong" sx={markdownStyles.strong} {...props} />,
    blockquote: ({node, ...props}) => <Box component="blockquote" sx={markdownStyles.blockquote} {...props} />,
    
    // Improved table rendering using Material UI components
    table: ({node, ...props}) => (
      <TableContainer component={Paper} sx={{ margin: '1.5rem 0', overflow: 'auto' }}>
        <Table size="small" {...props} />
      </TableContainer>
    ),
    thead: ({node, ...props}) => <TableHead bgcolor="#f5f5f5" {...props} />,
    tbody: ({node, ...props}) => <TableBody {...props} />,
    tr: ({node, ...props}) => <TableRow {...props} />,
    th: ({node, ...props}) => (
      <TableCell 
        align="left" 
        sx={{ 
          fontWeight: 'bold', 
          backgroundColor: '#f5f5f5',
          padding: '10px 16px',
          whiteSpace: 'nowrap'
        }} 
        {...props} 
      />
    ),
    td: ({node, ...props}) => (
      <TableCell 
        align="left" 
        sx={{ 
          padding: '8px 16px',
          borderBottom: '1px solid rgba(224, 224, 224, 1)'
        }} 
        {...props} 
      />
    ),
  };

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" component="h2">
            Hasil Analisis CV
          </Typography>
          
          <Box>
            <Button 
              variant="outlined" 
              startIcon={<SaveAltIcon />} 
              onClick={handleExport}
              sx={{ mr: 1 }}
            >
              Simpan
            </Button>
            
            <Button 
              variant="outlined" 
              color="secondary" 
              startIcon={<RefreshIcon />} 
              onClick={onReset}
            >
              Analisis Baru
            </Button>
          </Box>
        </Box>
        
        <Divider sx={{ mb: 3 }} />
        
        {/* Markdown content */}
        <Box sx={markdownStyles.container}>
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]} 
            rehypePlugins={[rehypeSanitize]} 
            components={components}
          >
            {markdownContent}
          </ReactMarkdown>
        </Box>
      </Paper>
    </Box>
  );
};

export default Results; 