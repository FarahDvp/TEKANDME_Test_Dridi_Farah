const Task = require('../models/Task');

const getTasks = async (req, res) => {
    try {
        const { status, search, sortBy } = req.query;
        let filter = { user: req.user.id };

        if (status) filter.status = status;
        if (search) filter.$or = [
            { title: new RegExp(search, 'i') },
            { description: new RegExp(search, 'i') }
        ];

        let sort = {};
        if (sortBy) {
            if (sortBy === 'dueDate') {
                sort = { dueDate: 1 };
            } else if (sortBy === 'createdAt') {
                sort = { createdAt: 1 };
            } else if (sortBy === 'priority') {
                sort = { priority: -1 };
            }
        }

        const tasks = await Task.find(filter).sort(sort);
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getTasksByDate = async (req, res) => {
    try {
        const tasks = await Task.aggregate([
            { $match: { user: req.user.id } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$dueDate" } },
                    tasks: { $push: "$$ROOT" }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const createTask = async (req, res) => {
    const { title, description, dueDate } = req.body;

    if (!title || !dueDate) {
        return res.status(400).json({ message: 'Title and due date are required' });
    }

    try {
        const task = new Task({
            title,
            description,
            dueDate,
            user: req.user.id
        });
        await task.save();
        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: 'Error creating task' });
    }
};

const updateTask = async (req, res) => {
    try {
        let task = await Task.findById(req.params.id);

        if (!task) return res.status(404).json({ message: 'Task not found' });

        if (task.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized access' });
        }

        task = await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: 'Error updating task' });
    }
};

const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) return res.status(404).json({ message: 'Task not found' });

        if (task.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized access' });
        }

        await task.deleteOne();
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting task' });
    }
};

module.exports = {
    getTasks,
    getTasksByDate,
    createTask,
    updateTask,
    deleteTask
};