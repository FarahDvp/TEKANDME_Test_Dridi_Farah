const Task = require("../models/Task.js");

module.exports.createTask = async (req, res) => {
    try {
        const { title, description, dueDate } = req.body;
        const newTask = new Task({ title, description, dueDate });
        await newTask.save();
        res.status(201).json(newTask);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports.updateTask = async (req, res) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedTask);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports.deleteTask = async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.json({ message: 'Tâche supprimée' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
