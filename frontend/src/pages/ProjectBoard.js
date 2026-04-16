import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';

const COLUMNS = [
    { id: 'todo', label: 'To Do', dot: 'dot-todo' },
    { id: 'inprogress', label: 'In Progress', dot: 'dot-inprogress' },
    { id: 'completed', label: 'Done', dot: 'dot-done' }
];

const ProjectBoard = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [project, setProject] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [activeCol, setActiveCol] = useState('todo');
    const [form, setForm] = useState({ title: '', description: '', priority: 'medium' });
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchData(); }, [id]);

    const fetchData = async () => {
        try {
            const [tasksRes, projectsRes] = await Promise.all([
                API.get(`/projects/${id}/tasks`),
                API.get('/projects')
            ]);
            setTasks(tasksRes.data);
            setProject(projectsRes.data.find(p => p.id == id));
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const handleAddTask = async (e) => {
        e.preventDefault();
        try {
            await API.post(`/projects/${id}/tasks`, { ...form, status: activeCol });
            setShowModal(false);
            setForm({ title: '', description: '', priority: 'medium' });
            fetchData();
        } catch (e) { console.error(e); }
    };

    const handleStatusChange = async (taskId, newStatus) => {
        try {
            await API.put(`/projects/${id}/tasks/${taskId}`, { status: newStatus });
            fetchData();
        } catch (e) { console.error(e); }
    };

    const handleDeleteTask = async (taskId) => {
        if (window.confirm('Delete this task?')) {
            await API.delete(`/projects/${id}/tasks/${taskId}`);
            fetchData();
        }
    };

    const openModal = (col) => { setActiveCol(col); setShowModal(true); };

    if (loading) return <div className="loading"><div className="spinner"></div></div>;

    return (
        <div className="board-page">
            <div className="board-header">
                <button className="btn-back" onClick={() => navigate('/dashboard')}>← Back</button>
                <div>
                    <h1 className="board-title">{project?.name || 'Project Board'}</h1>
                    <p style={{color:'var(--muted)', fontSize:'0.85rem'}}>{project?.description}</p>
                </div>
            </div>

            <div className="board-columns">
                {COLUMNS.map(col => {
                    const colTasks = tasks.filter(t => t.status === col.id);
                    return (
                        <div className="board-column" key={col.id}>
                            <div className="column-header">
                                <div className="column-title">
                                    <div className={`column-dot ${col.dot}`}></div>
                                    {col.label}
                                    <span className="column-count">{colTasks.length}</span>
                                </div>
                                <button className="btn-add-task" onClick={() => openModal(col.id)}>+</button>
                            </div>

                            {colTasks.length === 0 && (
                                <div style={{textAlign:'center', color:'var(--muted)', fontSize:'0.8rem', padding:'2rem 0'}}>
                                    No tasks yet
                                </div>
                            )}

                            {colTasks.map(task => (
                                <div className="task-card" key={task.id}>
                                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
                                        <div className="task-title">{task.title}</div>
                                        <button onClick={() => handleDeleteTask(task.id)} style={{background:'transparent',border:'none',color:'var(--muted)',cursor:'pointer',fontSize:'0.9rem',marginLeft:'0.5rem'}}>✕</button>
                                    </div>
                                    <span className={`task-priority priority-${task.priority}`}>{task.priority}</span>
                                    {task.description && <div className="task-desc">{task.description}</div>}
                                    <div style={{marginTop:'0.75rem', display:'flex', gap:'0.4rem', flexWrap:'wrap'}}>
                                        {COLUMNS.filter(c => c.id !== task.status).map(c => (
                                            <button key={c.id} onClick={() => handleStatusChange(task.id, c.id)}
                                                style={{background:'var(--bg3)', border:'1px solid var(--border2)', color:'var(--muted)', padding:'0.2rem 0.6rem', borderRadius:'6px', cursor:'pointer', fontSize:'0.72rem'}}>
                                                → {c.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    );
                })}
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <h2 className="modal-title">Add Task</h2>
                        <form onSubmit={handleAddTask}>
                            <div className="form-group">
                                <label>Task title</label>
                                <input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="What needs to be done?" required />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <input type="text" value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Optional details..." />
                            </div>
                            <div className="form-group">
                                <label>Priority</label>
                                <select value={form.priority} onChange={e => setForm({...form, priority: e.target.value})}
                                    style={{width:'100%', padding:'0.75rem 1rem', background:'var(--bg3)', border:'1px solid var(--border2)', borderRadius:'10px', color:'var(--text)', fontSize:'0.95rem', outline:'none'}}>
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn-save">Add Task</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectBoard;