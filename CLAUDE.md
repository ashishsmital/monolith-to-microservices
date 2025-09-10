# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Google Cloud Platform demonstration project showcasing the transformation from monolithic to microservices architecture. The project contains two implementations of the same e-commerce application:
- **Monolith**: Single Node.js/Express application serving both frontend and backend
- **Microservices**: Decomposed into three separate services (frontend, orders, products)

## Common Commands

### Initial Setup
```bash
./setup.sh  # Installs all dependencies and builds the React app for both architectures
```

### Running the Monolith
```bash
cd monolith
npm start  # Runs on port 8080
```

### Running Microservices
```bash
cd microservices
npm start  # Runs frontend (8080), orders (8081), products (8082) concurrently
```

### Running Individual Microservices
```bash
cd microservices
npm run frontend  # Port 8080
npm run products  # Port 8082
npm run orders    # Port 8081
```

### React App Development
```bash
cd react-app
npm start         # Development server
npm run build     # Builds for both monolith and microservices
```

### Testing
```bash
npm test           # Runs Playwright tests from root directory
npm run test:ui    # Opens Playwright test UI
npm run test:headed # Runs tests in headed mode
npm run test:report # Shows test report
```

### Docker Commands

**Monolith:**
```bash
cd monolith
docker build -t monolith:1.0.0 .
docker run --rm -p 8080:8080 monolith:1.0.0
```

**Microservices:**
```bash
cd microservices/src/frontend
docker build -t frontend:1.0.0 .
cd ../products
docker build -t products:1.0.0 .
cd ../orders
docker build -t orders:1.0.0 .
```

## Architecture Details

### Monolith Structure
- **Server**: `monolith/src/server.js` - Single Express server handling all routes
- **Data**: Mock data stored in `monolith/data/` (orders.json, products.json)
- **Public**: Static React build served from `monolith/public/`
- **Routes**: 
  - `/service/products` - Products API
  - `/service/orders` - Orders API

### Microservices Structure
- **Frontend Service**: `microservices/src/frontend/` - Serves React app, proxies API calls
- **Orders Service**: `microservices/src/orders/` - Handles order data (port 8081)
- **Products Service**: `microservices/src/products/` - Handles product data (port 8082)
- Each service has its own Express server and can be independently deployed

### React App Configuration
- **Monolith Mode**: Uses relative URLs (configured in `.env.monolith`)
- **Microservices Mode**: Uses absolute service URLs (configured in `.env`)
- Build process automatically creates both versions and copies to appropriate locations

### Key Technical Decisions
- Uses Express.js for all server implementations
- No database - uses JSON files for data persistence
- React app is built once and deployed as static files
- Microservices use CORS for cross-origin requests
- Concurrently package manages multiple service startup
- Environment-based configuration for API endpoints

### Important Notes
- Node.js version 16.13.0 or newer required
- The setup script handles all dependency installation across all projects
- React app must be rebuilt after changes using `npm run build` in react-app directory
- Tests use Playwright and expect the monolith to be running on port 8080