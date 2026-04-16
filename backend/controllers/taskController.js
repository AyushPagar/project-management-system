const { Task, User } = require('../models/index');

const getTasks = async (req, res) => {
    try {
        const tasks = await Task.findAll({
            where: { projectId: req.params.projectId },
            include: [{ model: User, as: 'assignedTo', attributes: ['name', 'email'] }]
        });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createTask = async (req, res) => {
    try {
        const { title, description, assignedToId, priority, deadline, status } = req.body;
        const task = await Task.create({
            title, description, assignedToId, priority, deadline, status,
            projectId: req.params.projectId,
            createdById: req.user.id
        });
        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateTask = async (req, res) => {
    try {
        const task = await Task.findByPk(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });
        await task.update(req.body);
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteTask = async (req, res) => {
    try {
        const task = await Task.findByPk(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });
        await task.destroy();
        res.json({ message: 'Task deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };