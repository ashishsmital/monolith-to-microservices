/*
Copyright 2019 Google LLC

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    https://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import React, { useState, useEffect } from "react";
import { useRouteMatch, Link } from "react-router-dom";
import {
  Box,
  Paper,
  Grid,
  Typography,
  Chip,
  Skeleton,
  Button,
  Container
} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function ProductDetails() {
  const match = useRouteMatch();
  const [product, setProduct] = useState({});
  const [hasErrors, setErrors] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const productId = match.params.id;

  const isValidProductId = (id) => {
    return id && /^[A-Z0-9]{10}$/.test(id);
  };

  async function fetchProduct(id, signal) {
    setLoading(true);
    setErrors(false); // Reset error state
    try {
      const response = await fetch(
        `${process.env.REACT_APP_PRODUCTS_URL}/${id}`,
        { signal }
      );
      const data = await response.json();
      
      if (!data) {
        setErrors(true);
      } else {
        setProduct(data);
      }
    } catch (err) {
      if (!signal.aborted) {
        setErrors(true);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!isValidProductId(productId)) {
      setErrors(true);
      setLoading(false);
      return;
    }
    
    const abortController = new AbortController();
    fetchProduct(productId, abortController.signal);
    
    return () => abortController.abort();
  }, [productId]);

  // Loading state
  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Skeleton variant="rectangular" height={400} />
          <Skeleton variant="text" sx={{ fontSize: '2rem', mt: 2 }} />
          <Skeleton variant="text" sx={{ fontSize: '1.5rem' }} />
          <Skeleton variant="text" />
        </Paper>
      </Container>
    );
  }

  // Error state
  if (hasErrors) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Paper 
          elevation={3}
          sx={{
            background: "#f99",
            padding: (theme) => theme.spacing(3, 2),
          }}
        >
          <Typography variant="h5" gutterBottom>
            Product Not Found
          </Typography>
          <Typography variant="body1" paragraph>
            The product you're looking for could not be found.
          </Typography>
          <Button
            component={Link}
            to="/products"
            startIcon={<ArrowBackIcon />}
            variant="contained"
            color="primary"
          >
            Return to Products
          </Button>
        </Paper>
      </Container>
    );
  }

  // Success state
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Button
        component={Link}
        to="/products"
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 2 }}
      >
        Back to Products
      </Button>
      
      <Paper sx={{ p: 3 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <img
              src={`/${product.picture}`}
              alt={product.name}
              style={{ width: '100%', height: 'auto' }}
              loading="lazy"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" gutterBottom>
              {product.name}
            </Typography>
            <Typography variant="h5" color="primary" gutterBottom>
              ${product.cost?.toFixed(2)}
            </Typography>
            <Typography variant="body1" paragraph>
              {product.description}
            </Typography>
            {product.categories && product.categories.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Categories:
                </Typography>
                {product.categories.map((category, index) => (
                  <Chip
                    key={index}
                    label={category}
                    sx={{ mr: 1, mb: 1 }}
                  />
                ))}
              </Box>
            )}
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}