import React, { useState, useEffect } from "react";
import { useRouteMatch, useHistory } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  Button,
  Chip,
  Divider,
  CircularProgress
} from "@mui/material";

export default function ProductDetails() {
  const match = useRouteMatch();
  const history = useHistory();
  const [hasErrors, setErrors] = useState(false);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const productId = match.params.id;

  async function fetchProduct(productId) {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_PRODUCTS_URL}/${productId}`
      );
      
      if (!response.ok) {
        throw new Error('Product not found');
      }
      
      const productData = await response.json();
      
      if (!productData) {
        setErrors(true);
      } else {
        setProduct(productData);
      }
    } catch (err) {
      setErrors(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProduct(productId);
  }, [productId]);

  const handleBackClick = () => {
    history.push('/products');
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '400px' 
      }}>
        <CircularProgress />
      </Box>
    );
  }

  if (hasErrors) {
    return (
      <Paper
        elevation={3}
        sx={{
          background: "#f99",
          padding: (theme) => theme.spacing(3, 2),
          maxWidth: "800px",
          margin: "0 auto"
        }}
      >
        <Typography component="p">
          Product not found or an error has occurred. Please try again.
        </Typography>
        <Button 
          variant="contained" 
          onClick={handleBackClick}
          sx={{ mt: 2 }}
        >
          Back to Products
        </Button>
      </Paper>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Paper
        elevation={3}
        sx={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: (theme) => theme.spacing(3),
        }}
      >
        {product && (
          <>
            <Box
              component="img"
              sx={{
                width: '100%',
                height: '400px',
                objectFit: 'contain',
                marginBottom: 3,
                borderRadius: 1
              }}
              src={`/${product.picture}`}
              alt={product.name}
            />
            
            <Typography variant="h4" component="h1" gutterBottom>
              {product.name}
            </Typography>
            
            <Typography variant="h5" color="primary" gutterBottom>
              ${product.cost.toFixed(2)}
            </Typography>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="body1" paragraph>
              {product.description}
            </Typography>
            
            {product.categories && product.categories.length > 0 && (
              <Box sx={{ mt: 2, mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Categories:
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {product.categories.map((category) => (
                    <Chip 
                      key={category} 
                      label={category} 
                      size="small" 
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Box>
            )}
            
            <Button
              variant="contained"
              onClick={handleBackClick}
              sx={{ mt: 2 }}
            >
              Back to Products
            </Button>
          </>
        )}
      </Paper>
    </Box>
  );
}