import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { FiPlus, FiEdit, FiTrash2, FiEye, FiX, FiSearch, FiFilter, FiExternalLink, FiGithub, FiCalendar, FiTrendingUp, FiTrendingDown } from "react-icons/fi";

export default function Projects() {
  const { data: session } = useSession();
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [skillsFilter, setSkillsFilter] = useState("");
  const [loadingSkills, setLoadingSkills] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    skills: [],
    githubUrl: "",
    demoUrl: "",
  });
  const [newSkill, setNewSkill] = useState("");

  useEffect(() => {
    if (session) {
      fetchProjects();
    }
  }, [session]);

  useEffect(() => {
    filterProjects();
  }, [projects, searchTerm, skillsFilter]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/projects");

      if (!response.ok) {
        throw new Error(`Failed to fetch projects: ${response.status}`);
      }

      const data = await response.json();
      // Ensure skills is always an array
      const projectsWithSkillsArray = data.map(project => ({
        ...project,
        skills: Array.isArray(project.skills) ? project.skills : []
      }));
      setProjects(projectsWithSkillsArray);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSkillStats = async () => {
    try {
      setLoadingSkills(true);
      const response = await fetch("/api/skills");

      if (!response.ok) {
        throw new Error(`Failed to fetch skill stats: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching skill stats:", error);
      setError("Failed to load skill statistics");
      return [];
    } finally {
      setLoadingSkills(false);
    }
  };

  const filterProjects = () => {
    let filtered = projects;

    if (searchTerm) {
      filtered = filtered.filter(
        (project) =>
          project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (skillsFilter) {
      filtered = filtered.filter((project) =>
        project.skills.some((skill) =>
          skill.toLowerCase().includes(skillsFilter.toLowerCase())
        )
      );
    }

    setFilteredProjects(filtered);
  };

  const filterByTopSkills = async () => {
    try {
      const skillStats = await fetchSkillStats();
      if (skillStats.length > 0) {
        const topSkill = skillStats[0].name;
        setSkillsFilter(topSkill);
      }
    } catch (error) {
      console.error("Error filtering by top skills:", error);
    }
  };

  const filterByLeastSkills = async () => {
    try {
      const skillStats = await fetchSkillStats();
      if (skillStats.length > 0) {
        const leastSkill = skillStats[skillStats.length - 1].name;
        setSkillsFilter(leastSkill);
      }
    } catch (error) {
      console.error("Error filtering by least skills:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError(null);
      const url = editingProject
        ? `/api/projects/${editingProject._id}`
        : "/api/projects";
      const method = editingProject ? "PUT" : "POST";

      // Prepare the data to send - ensure skills is properly formatted
      const dataToSend = {
        ...formData,
        skills: formData.skills.filter(skill => skill.trim() !== "") // Remove empty skills
      };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error ||
            `Failed to ${editingProject ? "update" : "create"} project`
        );
      }

      const savedProject = await response.json();
      
      // Ensure skills is an array in the response
      const projectWithSkillsArray = {
        ...savedProject,
        skills: Array.isArray(savedProject.skills) ? savedProject.skills : []
      };

      if (editingProject) {
        setProjects(
          projects.map((p) => (p._id === projectWithSkillsArray._id ? projectWithSkillsArray : p))
        );
      } else {
        setProjects([...projects, projectWithSkillsArray]);
      }

      resetForm();
      setShowModal(false);
    } catch (error) {
      console.error("Error saving project:", error);
      setError(error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      setError(null);
      const response = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete project: ${response.status}`);
      }

      setProjects(projects.filter((p) => p._id !== id));
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Error deleting project:", error);
      setError(error.message);
    }
  };

  const openEditModal = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title || "",
      description: project.description || "",
      skills: Array.isArray(project.skills) ? project.skills : [],
      githubUrl: project.githubUrl || "",
      demoUrl: project.demoUrl || "",
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      skills: [],
      githubUrl: "",
      demoUrl: "",
    });
    setNewSkill("");
    setEditingProject(null);
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, newSkill.trim()],
      });
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((skill) => skill !== skillToRemove),
    });
  };

  const handleSkillKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiEye className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Please sign in to view projects</h2>
          <p className="text-slate-600 mb-6">You need to be authenticated to access this page</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-slate-600">Loading your projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Your AI Projects</h1>
              <p className="text-slate-600 mt-2">Manage and showcase your machine learning projects</p>
            </div>
            <button 
              onClick={() => setShowModal(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-transform"
            >
              <FiPlus className="w-5 h-5" />
              <span>New Project</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-xl mb-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FiX className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
              <div className="ml-auto pl-3">
                <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">
                  <FiX className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filter */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 border border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50"
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiFilter className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Filter by skills (Python, TensorFlow...)"
                value={skillsFilter}
                onChange={(e) => setSkillsFilter(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50"
              />
            </div>
          </div>
          
          {/* Skill Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={filterByTopSkills}
              disabled={loadingSkills}
              className="flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-xl hover:bg-blue-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiTrendingUp className="w-4 h-4" />
              <span>{loadingSkills ? "Loading..." : "Filter by Top Skill"}</span>
            </button>
            
            <button
              onClick={filterByLeastSkills}
              disabled={loadingSkills}
              className="flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-xl hover:bg-purple-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiTrendingDown className="w-4 h-4" />
              <span>{loadingSkills ? "Loading..." : "Filter by Least Used Skill"}</span>
            </button>
            
            {skillsFilter && (
              <button
                onClick={() => setSkillsFilter("")}
                className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-200 transition-colors"
              >
                <FiX className="w-4 h-4" />
                <span>Clear Filter</span>
              </button>
            )}
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-slate-200">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiPlus className="w-12 h-12 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">No projects found</h3>
              <p className="text-slate-600 mb-6">
                {projects.length === 0 
                  ? "Get started by creating your first AI/ML project!" 
                  : "No projects match your search criteria. Try adjusting your filters."}
              </p>
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setSkillsFilter('');
                  setShowModal(true);
                }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all flex items-center gap-2 mx-auto shadow-lg hover:shadow-xl"
              >
                <FiPlus className="w-5 h-5" />
                <span>Create New Project</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div key={project._id} className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col border border-slate-200 group">
                {/* Card Header with Gradient */}
                <div className="px-6 pt-6 pb-4 bg-gradient-to-r from-blue-50 to-purple-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-semibold text-slate-900 truncate">{project.title}</h3>
                      <p className="text-slate-600 text-sm mt-1 line-clamp-2">
                        {project.description || 'No description provided.'}
                      </p>
                    </div>
                    <div className="flex gap-2 ml-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => openEditModal(project)}
                        className="text-blue-600 hover:text-blue-800 p-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                      >
                        <FiEdit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => setDeleteConfirm(project._id)}
                        className="text-red-600 hover:text-red-800 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Skills Section */}
                <div className="px-6 py-4">
                  <div className="flex flex-wrap gap-2">
                    {project.skills?.slice(0, 5).map((skill, i) => (
                      <span key={i} className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 text-xs px-3 py-1.5 rounded-lg font-medium border border-blue-200">
                        {skill}
                      </span>
                    ))}
                    {project.skills?.length > 5 && (
                      <span className="bg-slate-100 text-slate-600 text-xs px-3 py-1.5 rounded-lg">
                        +{project.skills.length - 5} more
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Card Footer */}
                <div className="px-6 py-4 mt-auto border-t border-slate-100">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-slate-500 text-sm">
                      <FiCalendar className="mr-1.5" />
                      {new Date(project.updatedAt || project.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex gap-3">
                      {project.githubUrl && (
                        <a 
                          href={project.githubUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-slate-600 hover:text-slate-900 flex items-center gap-1 text-sm p-2 rounded-lg hover:bg-slate-100 transition-colors"
                          title="View on GitHub"
                        >
                          <FiGithub className="w-4 h-4" />
                        </a>
                      )}
                      {project.demoUrl && (
                        <a 
                          href={project.demoUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm p-2 rounded-lg hover:bg-blue-50 transition-colors"
                          title="View Live Demo"
                        >
                          <FiExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create/Edit Project Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-200">
              <div className="p-6 border-b border-slate-200 sticky top-0 bg-white z-10">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-slate-900">
                    {editingProject ? 'Edit Project' : 'Create New Project'}
                  </h2>
                  <button 
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="text-slate-400 hover:text-slate-600 rounded-lg p-1 hover:bg-slate-100"
                  >
                    <FiX className="w-6 h-6" />
                  </button>
                </div>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Project Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50"
                    placeholder="e.g., Image Classification Model"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows="3"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50"
                    placeholder="Describe your project..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Skills & Technologies</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={handleSkillKeyPress}
                      className="flex-1 px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50"
                      placeholder="Add a skill (Python, TensorFlow...)"
                    />
                    <button
                      type="button"
                      onClick={addSkill}
                      className="bg-blue-600 text-white px-4 py-3 rounded-xl hover:bg-blue-700 transition-colors flex items-center"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((skill, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 px-3 py-2 rounded-lg text-sm flex items-center gap-2 font-medium">
                        {skill}
                        <button 
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="text-blue-600 hover:text-blue-800 rounded-full"
                        >
                          <FiX className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">GitHub URL</label>
                    <input
                      type="url"
                      value={formData.githubUrl}
                      onChange={(e) => setFormData({...formData, githubUrl: e.target.value})}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50"
                      placeholder="https://github.com/username/repo"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Live Link</label>
                    <input
                      type="url"
                      value={formData.demoUrl}
                      onChange={(e) => setFormData({...formData, demoUrl: e.target.value})}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50"
                      placeholder="https://your-project-demo.com"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="px-5 py-2.5 text-slate-700 hover:text-slate-900 border border-slate-200 rounded-xl hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    {editingProject ? 'Update Project' : 'Create Project'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 border border-slate-200">
              <h3 className="text-lg font-medium text-slate-900 mb-4">Confirm Deletion</h3>
              <p className="text-slate-600 mb-6">Are you sure you want to delete this project? This action cannot be undone.</p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-5 py-2.5 text-slate-700 hover:text-slate-900 border border-slate-200 rounded-xl hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="bg-red-600 text-white px-5 py-2.5 rounded-xl hover:bg-red-700 transition-colors"
                >
                  Delete Project
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}