require('dotenv').config();
const express = require('express');
const Sentry = require('@sentry/node');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3001;

// Initialize Sentry
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Sentry.Integrations.Express({ app }),
  ],
  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  tracesSampleRate: 1.0,
});

// The request handler must be the first middleware on the app
app.use(Sentry.Handlers.requestHandler());

// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());

// Database configuration
const pool = new Pool(); // Uses environment variables by default

app.use(cors());
app.use(express.json());

// Error handler middleware
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  Sentry.captureException(err);
  res.status(500).json({ error: 'Internal server error' });
};

// GET /api/tasks endpoint with pagination
app.get('/api/tasks', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const status = req.query.status;

    let query = 'SELECT * FROM tasks';
    let countQuery = 'SELECT COUNT(*) FROM tasks';
    const values = [];

    if (status) {
      query += ' WHERE status = $1';
      countQuery += ' WHERE status = $1';
      values.push(status);
    }

    query += ' ORDER BY id LIMIT $' + (values.length + 1) + ' OFFSET $' + (values.length + 2);
    
    // Get total count
    const countResult = await pool.query(countQuery, status ? [status] : []);
    const total = parseInt(countResult.rows[0].count);

    // Get paginated tasks
    const result = await pool.query(query, [...values, limit, offset]);

    const pagination = {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };

    res.json({
      tasks: result.rows,
      pagination
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/tasks - Create new task
app.post('/api/tasks', async (req, res, next) => {
  try {
    const { title, description, status, label = '' } = req.body;
    const result = await pool.query(
      'INSERT INTO tasks (title, description, status, label) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, description, status, label]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// PUT /api/tasks/:id - Update task
app.put('/api/tasks/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, status, label } = req.body;
    const result = await pool.query(
      'UPDATE tasks SET title = $1, description = $2, status = $3, label = $4 WHERE id = $5 RETURNING *',
      [title, description, status, label, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/tasks/:id - Delete task
app.delete('/api/tasks/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    next(err);
  }
});

// GET /api/preferences/:userId - Get user preferences
app.get('/api/preferences/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params;
    const result = await pool.query('SELECT * FROM user_preferences WHERE user_id = $1', [userId]);
    if (result.rows.length === 0) {
      // Create default preferences if none exist
      const defaultResult = await pool.query(
        'INSERT INTO user_preferences (user_id, view_mode) VALUES ($1, $2) RETURNING *',
        [userId, 'kanban']
      );
      return res.json(defaultResult.rows[0]);
    }
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// PUT /api/preferences/:userId - Update user preferences
app.put('/api/preferences/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { viewMode } = req.body;
    const result = await pool.query(
      'INSERT INTO user_preferences (user_id, view_mode) VALUES ($1, $2) ' +
      'ON CONFLICT (user_id) DO UPDATE SET view_mode = $2 RETURNING *',
      [userId, viewMode]
    );
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// The error handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());

// Regular error handlers
app.use(errorHandler);

// Initialize database connection and start server
pool.connect()
  .then(() => {
    console.log('Connected to PostgreSQL database');
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch(err => {
    console.error('Failed to connect to PostgreSQL database:', err);
    process.exit(1);
  });