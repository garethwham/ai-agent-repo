const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// In-memory tasks storage (in a real app, this would be a database)
const tasks = [
  {
    id: 1,
    title: 'Design UI mockups',
    description: 'Create initial wireframes for the application',
    status: 'To Do',
    label: ''
  },
  {
    id: 2,
    title: 'Implement React components',
    description: 'Build the core components for the task tracking system',
    status: 'In Progress',
    label: ''
  },
  {
    id: 3,
    title: 'Write documentation',
    description: 'Document the component structure and usage',
    status: 'Done',
    label: ''
  }
];

// GET /api/tasks endpoint with pagination
app.get('/api/tasks', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const status = req.query.status;

  let filteredTasks = [...tasks];

  // Filter by status if provided
  if (status) {
    filteredTasks = filteredTasks.filter(task => task.status === status);
  }

  // Calculate pagination
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  // Prepare pagination metadata
  const pagination = {
    total: filteredTasks.length,
    page,
    limit,
    totalPages: Math.ceil(filteredTasks.length / limit)
  };

  // Get paginated tasks
  const paginatedTasks = filteredTasks.slice(startIndex, endIndex);

  res.json({
    tasks: paginatedTasks,
    pagination
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});