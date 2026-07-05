const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// The "Why": CORS is required because our frontend will run on a different port (e.g., 5173 for Vite) 
// and the browser's Same-Origin Policy will block requests otherwise. 
// express.json() is needed to parse the incoming JSON payload from the frontend.
app.use(cors());
app.use(express.json());

// Healthcheck Route
// The "Why": In Kubernetes (Phase 2), we need a simple endpoint to configure Liveness and Readiness probes.
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', service: 'backend' });
});

// User Routes
app.use('/api/users', userRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`Backend service running on port ${PORT}`);
});
