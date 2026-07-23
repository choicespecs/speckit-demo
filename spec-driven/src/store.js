// In-memory task store — see specs/001-task-list-api/data-model.md for the Task shape
// and specs/001-task-list-api/research.md for why state is isolated here rather than
// inlined in the route handlers.

let tasks = [];
let nextId = 1;

function create(description) {
  const task = { id: nextId++, description, done: false };
  tasks.push(task);
  return task;
}

function list() {
  return tasks;
}

function markDone(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return null;
  task.done = true;
  return task;
}

function remove(id) {
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) return false;
  tasks.splice(index, 1);
  return true;
}

module.exports = { create, list, markDone, remove };
