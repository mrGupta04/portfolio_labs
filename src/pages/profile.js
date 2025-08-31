import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { FiEdit2, FiSave, FiX, FiMapPin, FiGlobe, FiGithub, FiLinkedin, FiMail, FiUser, FiRefreshCw, FiPlus } from 'react-icons/fi';

export default function Profile() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [newSkill, setNewSkill] = useState('');

  // Form state - initialize with proper structure
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    location: '',
    website: '',
    github: '',
    linkedin: '',
    skills: [],
    education: [],
    experience: []
  });

  // Fetch profile data from backend
  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/profile');

      if (!response.ok) {
        throw new Error(`Failed to fetch profile: ${response.status}`);
      }

      const data = await response.json();
      setProfile(data);
      // Initialize form data with fetched data
      setFormData({
        name: data.name || '',
        email: data.email || '',
        bio: data.bio || '',
        location: data.location || '',
        website: data.website || '',
        github: data.github || '',
        linkedin: data.linkedin || '',
        skills: data.skills || [],
        education: data.education || [],
        experience: data.experience || []
      });
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Save profile data to backend
  const saveProfile = async () => {
    if (!session) {
      setError("Not authenticated");
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
         
          'Authorization': `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to save profile: ${response.status}`);
      }

      const updatedProfile = await response.json();
      setProfile(updatedProfile);
      setIsEditing(false);
      setNewSkill('');
    } catch (err) {
      console.error('Error saving profile:', err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchProfile();
    }
  }, [session]);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleArrayChange = (arrayName, index, field, value) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addArrayItem = (arrayName, template) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: [...prev[arrayName], { ...template }]
    }));
  };

  const removeArrayItem = (arrayName, index) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].filter((_, i) => i !== index)
    }));
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (index) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiUser className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please sign in to view your profile</h2>
          <p className="text-gray-600 mb-6">You need to be authenticated to access this page</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiX className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error loading profile</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchProfile}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center mx-auto"
          >
            <FiRefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="h-40 bg-gradient-to-r from-blue-600 to-purple-600 relative">
            <div className="absolute -bottom-16 left-8">
              <div className="relative">
                {session.user.image && !imageError ? (
                  <img
                    src={session.user.image}
                    alt={profile.name}
                    className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
                    onError={handleImageError}
                  />
                ) : (
                  <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                    <span className="text-4xl font-bold text-white">
                      {profile.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="pt-20 px-8 pb-8">
            <div className="flex justify-between items-start">
              <div>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="text-3xl font-bold text-gray-900 mb-2 bg-gray-100 rounded px-3 py-1 border border-gray-300"
                  />
                ) : (
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{profile.name}</h1>
                )}

                {isEditing ? (
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    className="text-gray-600 mb-4 w-full bg-gray-100 rounded px-3 py-1 border border-gray-300"
                    rows="2"
                    placeholder="Write a short bio..."
                  />
                ) : (
                  <p className="text-gray-600 mb-4">{profile.bio || "No bio yet"}</p>
                )}

                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <FiMapPin className="w-4 h-4 mr-1" />
                    {isEditing ? (
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="bg-gray-100 rounded px-2 py-1 border border-gray-300"
                        placeholder="Your location"
                      />
                    ) : (
                      <span>{profile.location || "No location set"}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {isEditing ? (
                    <>
                      <FiX className="w-4 h-4" />
                      <span>Cancel</span>
                    </>
                  ) : (
                    <>
                      <FiEdit2 className="w-4 h-4" />
                      <span>Edit Profile</span>
                    </>
                  )}
                </button>
                {isEditing && (
                  <button
                    onClick={saveProfile}
                    disabled={saving}
                    className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    <FiSave className="w-4 h-4" />
                    <span>{saving ? 'Saving...' : 'Save'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <FiX className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Contact Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact & Links</h3>
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <FiMail className="w-5 h-5 mr-3" />
                  <span>{profile.email}</span>
                </div>

                {isEditing ? (
                  <>
                    <div className="flex items-center">
                      <FiGlobe className="w-5 h-5 mr-3 text-gray-500" />
                      <input
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={handleInputChange}
                        placeholder="Website URL"
                        className="bg-gray-100 rounded px-2 py-1 flex-1 border border-gray-300"
                      />
                    </div>
                    <div className="flex items-center">
                      <FiGithub className="w-5 h-5 mr-3 text-gray-500" />
                      <input
                        type="url"
                        name="github"
                        value={formData.github}
                        onChange={handleInputChange}
                        placeholder="GitHub URL"
                        className="bg-gray-100 rounded px-2 py-1 flex-1 border border-gray-300"
                      />
                    </div>
                    <div className="flex items-center">
                      <FiLinkedin className="w-5 h-5 mr-3 text-gray-500" />
                      <input
                        type="url"
                        name="linkedin"
                        value={formData.linkedin}
                        onChange={handleInputChange}
                        placeholder="LinkedIn URL"
                        className="bg-gray-100 rounded px-2 py-1 flex-1 border border-gray-300"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    {profile.website && (
                      <div className="flex items-center text-blue-600 hover:text-blue-800">
                        <FiGlobe className="w-5 h-5 mr-3" />
                        <a href={profile.website} target="_blank" rel="noopener noreferrer" className="truncate">Portfolio</a>
                      </div>
                    )}
                    {profile.github && (
                      <div className="flex items-center text-gray-600 hover:text-gray-800">
                        <FiGithub className="w-5 h-5 mr-3" />
                        <a href={profile.github} target="_blank" rel="noopener noreferrer" className="truncate">GitHub</a>
                      </div>
                    )}
                    {profile.linkedin && (
                      <div className="flex items-center text-blue-600 hover:text-blue-800">
                        <FiLinkedin className="w-5 h-5 mr-3" />
                        <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="truncate">LinkedIn</a>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Skills Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Skills & Expertise</h3>
              </div>

              {isEditing ? (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Add a skill"
                      className="flex-1 bg-gray-100 rounded px-3 py-2 border border-gray-300"
                    />
                    <button
                      onClick={addSkill}
                      className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition-colors"
                    >
                      <FiPlus className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((skill, index) => (
                      <div key={index} className="relative group">
                        <span className="bg-gradient-to-r from-blue-100 to-blue-50 text-blue-800 px-3 py-1 rounded-full text-sm font-medium pr-6">
                          {skill}
                        </span>
                        <button
                          onClick={() => removeSkill(index)}
                          className="absolute right-1 top-1/2 transform -translate-y-1/2 text-blue-800 opacity-70 hover:opacity-100"
                        >
                          <FiX className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {profile.skills && profile.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-gradient-to-r from-blue-100 to-blue-50 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                  {(!profile.skills || profile.skills.length === 0) && (
                    <p className="text-gray-500 text-sm">No skills added yet</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Education Section */}
            <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Education</h3>
                {isEditing && (
                  <button
                    onClick={() => addArrayItem('education', {
                      institution: '',
                      degree: '',
                      period: '',
                      description: ''
                    })}
                    className="text-blue-600 text-sm hover:text-blue-800"
                  >
                    + Add Education
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {formData.education.map((edu, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                    {isEditing ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={edu.institution || ''}
                          onChange={(e) => handleArrayChange('education', index, 'institution', e.target.value)}
                          placeholder="Institution"
                          className="w-full bg-gray-100 rounded px-3 py-1 border border-gray-300 font-semibold"
                        />
                        <input
                          type="text"
                          value={edu.degree || ''}
                          onChange={(e) => handleArrayChange('education', index, 'degree', e.target.value)}
                          placeholder="Degree"
                          className="w-full bg-gray-100 rounded px-3 py-1 border border-gray-300"
                        />
                        <input
                          type="text"
                          value={edu.period || ''}
                          onChange={(e) => handleArrayChange('education', index, 'period', e.target.value)}
                          placeholder="Period (e.g., 2018-2022)"
                          className="w-full bg-gray-100 rounded px-3 py-1 text-sm border border-gray-300"
                        />
                        <textarea
                          value={edu.description || ''}
                          onChange={(e) => handleArrayChange('education', index, 'description', e.target.value)}
                          placeholder="Description"
                          className="w-full bg-gray-100 rounded px-3 py-1 text-sm border border-gray-300"
                          rows="2"
                        />
                        <button
                          onClick={() => removeArrayItem('education', index)}
                          className="text-red-600 text-sm hover:text-red-800"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <>
                        <h4 className="font-semibold text-gray-900">{edu.institution}</h4>
                        <p className="text-gray-600">{edu.degree}</p>
                        <p className="text-sm text-gray-500">{edu.period}</p>
                        {edu.description && (
                          <p className="text-sm text-gray-600 mt-1">{edu.description}</p>
                        )}
                      </>
                    )}
                  </div>
                ))}

                {formData.education.length === 0 && !isEditing && (
                  <p className="text-gray-500">No education information added yet</p>
                )}
              </div>
            </div>

            {/* Experience Section */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Experience</h3>
                {isEditing && (
                  <button
                    onClick={() => addArrayItem('experience', {
                      company: '',
                      position: '',
                      period: '',
                      description: ''
                    })}
                    className="text-blue-600 text-sm hover:text-blue-800"
                  >
                    + Add Experience
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {formData.experience.map((exp, index) => (
                  <div key={index} className="border-l-4 border-green-500 pl-4 py-2">
                    {isEditing ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={exp.company || ''}
                          onChange={(e) => handleArrayChange('experience', index, 'company', e.target.value)}
                          placeholder="Company"
                          className="w-full bg-gray-100 rounded px-3 py-1 border border-gray-300 font-semibold"
                        />
                        <input
                          type="text"
                          value={exp.position || ''}
                          onChange={(e) => handleArrayChange('experience', index, 'position', e.target.value)}
                          placeholder="Position"
                          className="w-full bg-gray-100 rounded px-3 py-1 border border-gray-300"
                        />
                        <input
                          type="text"
                          value={exp.period || ''}
                          onChange={(e) => handleArrayChange('experience', index, 'period', e.target.value)}
                          placeholder="Period (e.g., 2020-Present)"
                          className="w-full bg-gray-100 rounded px-3 py-1 text-sm border border-gray-300"
                        />
                        <textarea
                          value={exp.description || ''}
                          onChange={(e) => handleArrayChange('experience', index, 'description', e.target.value)}
                          placeholder="Description"
                          className="w-full bg-gray-100 rounded px-3 py-1 text-sm border border-gray-300"
                          rows="2"
                        />
                        <button
                          onClick={() => removeArrayItem('experience', index)}
                          className="text-red-600 text-sm hover:text-red-800"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <>
                        <h4 className="font-semibold text-gray-900">{exp.company}</h4>
                        <p className="text-gray-600">{exp.position}</p>
                        <p className="text-sm text-gray-500">{exp.period}</p>
                        {exp.description && (
                          <p className="text-sm text-gray-600 mt-1">{exp.description}</p>
                        )}
                      </>
                    )}
                  </div>
                ))}

                {formData.experience.length === 0 && !isEditing && (
                  <p className="text-gray-500">No experience information added yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}