const Project = require('../models/Project');

const getProjects = async (req, res) => {
  try {
    const { category, search } = req.query;
    let filter = {};

    if (category && category !== 'All') {
      filter.category = category;
    }

    let projects = await Project.find(filter).sort({ createdAt: -1 });

    if (search) {
      const searchLower = search.toLowerCase();
      projects = projects.filter(p => 
        p.title.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower) ||
        p.techStack.some(t => t.toLowerCase().includes(searchLower))
      );
    }

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createProject = async (req, res) => {
  try {
    const { title, description, images, techStack, features, githubUrl, liveUrl, category, caseStudy } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({ message: 'Title, description and category are required' });
    }

    const newProject = await Project.create({
      title,
      description,
      images: images || [],
      techStack: techStack || [],
      features: features || [],
      githubUrl: githubUrl || '',
      liveUrl: liveUrl || '',
      category,
      caseStudy: caseStudy || ''
    });

    res.status(201).json(newProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProject = async (req, res) => {
  try {
    const { title, description, images, techStack, features, githubUrl, liveUrl, category, caseStudy } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const updated = await Project.findByIdAndUpdate(
      req.params.id,
      {
        title: title !== undefined ? title : project.title,
        description: description !== undefined ? description : project.description,
        images: images !== undefined ? images : project.images,
        techStack: techStack !== undefined ? techStack : project.techStack,
        features: features !== undefined ? features : project.features,
        githubUrl: githubUrl !== undefined ? githubUrl : project.githubUrl,
        liveUrl: liveUrl !== undefined ? liveUrl : project.liveUrl,
        category: category !== undefined ? category : project.category,
        caseStudy: caseStudy !== undefined ? caseStudy : project.caseStudy
      },
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
};
