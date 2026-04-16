import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

const COLORS = ['#7c6ff7','#38bdf8','#34d399','#fbbf24','#f87171','#a78bfa'];

const Dashboard = () => {
    const [projects, setProjects] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({ name: '', description: '', color: '#7c6ff7' });
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => { fetchProjects(); }, []);

    const fetchProjects = async () => {
        try {
            const { data } = await API.get('/projects');
            setProjects(data);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await API.post('/projects', form);
            setShowModal(false);
            setForm({ name: '', description: '', color: '#7c6ff7' });
            fetchProjects();
        } catch (e) { console.error(e); }
    };

    const handleDelete = async (id, e) => {
        e.stopPropagation();
        if (window.confirm('Delete this project?')) {
            await API.delete(`/projects/${id}`);
            fetchProjects();
        }
    };

    const active = projects.filter(p => p.status === 'active').length;
    const completed = projects.filter(p => p.status === 'completed').length;

    if (loading) return <div className="loading"><div className="spinner"></div></div>;

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <div>
                    <h1 className="dashboard-title">Hey, <span>{user?.name?.split(' ')[0]}</span> 👋</h1>
                    <p style={{color:'var(--muted)', fontSize:'0.9rem', marginTop:'0.25rem'}}>Here's what's happening with your projects</p>
                </div>
                <button className="btn-new" onClick={() => setShowModal(true)}>
                    + New Project
                </button>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-label">Total Projects</div>
                    <div className="stat-value purple">{projects.length}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Active</div>
                    <div className="stat-value blue">{active}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Completed</div>
                    <div className="stat-value green">{completed}</div>
                </div>
            </div>

            <div className="section-title">Your Projects</div>

            {projects.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">🚀</div>
                    <div className="empty-text">No projects yet</div>
                    <div className="empty-sub">Create your first project to get started</div>
                </div>
            ) : (
                <div className="projects-grid">
                    {projects.map(p => (
                        <div className="project-card" key={p.id} onClick={() => navigate(`/project/${p.id}`)}>
                            <div className="project-card-accent" style={{background: p.color || '#7c6ff7'}}></div>
                            <div className="project-card-header">
                                <div>
                                    <div className="project-name">{p.name}</div>
                                    <div className="project-desc">{p.description || 'No description'}</div>
                                </div>
                                <button onClick={e => handleDelete(p.id, e)} style={{background:'transparent',border:'none',color:'var(--muted)',cursor:'pointer',fontSize:'1.1rem'}}>✕</button>
                            </div>
                            <div className="project-meta">
                                <span className={`project-status status-${p.status}`}>{p.status}</span>
                                <span className="project-tasks">Click to open board</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <h2 className="modal-title">New Project</h2>
                        <form onSubmit={handleCreate}>
                            <div className="form-group">
                                <label>Project name</label>
                                <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="My awesome project" required />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <input type="text" value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="What's this project about?" />
                            </div>
                            <div className="form-group">
                                <label>Color</label>
                                <div style={{display:'flex', gap:'0.5rem', flexWrap:'wrap', marginTop:'0.25rem'}}>
                                    {COLORS.map(c => (
                                        <div key={c} onClick={() => setForm({...form, color: c})}
                                            style={{width:28, height:28, borderRadius:'50%', background:c, cursor:'pointer', border: form.color===c ? '2px solid white' : '2px solid transparent', transition:'border 0.2s'}}>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn-save">Create Project</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;