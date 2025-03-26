const express = require("express");
const router = express.Router();
const TaskController = require("../controllers/taskController.js");
const protect = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, TaskController.getTasks)
    .post(protect, TaskController.createTask);

router.route('/:id')
    .put(protect, TaskController.updateTask)
    .delete(protect, TaskController.deleteTask);

module.exports = router;