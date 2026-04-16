const { Project, User } = require('../models/index');

const getProjects = async (req, res) => {
    try {
        const projects = await Project.findAll({
            where: { ownerId: req.user.id },
            include: [{ model: User, as: 'owner', attributes: ['name', 'email'] }]
        });
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createProject = async (req, res) => {
    try {
        const { name, description, deadline, color } = req.body;
        const project = await Project.create({
            name, description, deadline, color,
            ownerId: req.user.id
        });
        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateProject = async (req, res) => {
    try {
        const project = await Project.findByPk(req.params.id);
        if (!project) return res.status(404).json({ message: 'Project not found' });
        await project.update(req.body);
        res.json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteProject = async (req, res) => {
    try {
        const project = await Project.findByPk(req.params.id);
        if (!project) return res.status(404).json({ message: 'Project not found' });
        await project.destroy();
        res.json({ message: 'Project deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addMember = async (req, res) => {
    try {
        const project = await Project.findByPk(req.params.id);
        if (!project) return res.status(404).json({ message: 'Project not found' });
        res.json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getProjects, createProject, updateProject, deleteProject, addMember };