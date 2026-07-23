// Routes for the task list API — contract defined in
// specs/001-task-list-api/contracts/tasks-api.md. Routes are added incrementally by
// user story (see specs/001-task-list-api/tasks.md): US1 = add/list, US2 = mark done,
// US3 = delete.

const express = require('express');
const store = require('../store');

const router = express.Router();

// FR-001, FR-002, FR-006
router.post('/', (req, res) => {
  const description = req.body.description;
  if (typeof description !== 'string' || description.trim() === '') {
    return res.status(400).json({ error: 'description is required' });
  }
  const task = store.create(description);
  res.status(201).json(task);
});

// FR-003
router.get('/', (req, res) => {
  res.status(200).json(store.list());
});

// FR-004, FR-007
router.post('/:id/done', (req, res) => {
  const task = store.markDone(Number(req.params.id));
  if (!task) {
    return res.status(404).json({ error: 'task not found' });
  }
  res.status(200).json(task);
});

// FR-005, FR-007
router.delete('/:id', (req, res) => {
  const removed = store.remove(Number(req.params.id));
  if (!removed) {
    return res.status(404).json({ error: 'task not found' });
  }
  res.status(204).send();
});

module.exports = router;
