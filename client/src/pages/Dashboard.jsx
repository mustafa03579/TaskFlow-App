import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Dashboard.module.css';
import Logo from '../components/Logo';
import { getGreeting, getFirstName } from '../utils/greeting';
import { clearSession, getSession, getToken, authHeaders } from '../utils/auth';
import ThemeToggle from '../components/ThemeToggle';

function Dashboard() {
  const navigate = useNavigate();

  // Redirect to sign in if no valid session
  useEffect(() => {
    if (!getToken()) {
      navigate('/signin');
    }
  }, [navigate]);

  // Map priority label → CSS module class
  const priorityClass = {
    'High Priority':   'prioHigh',
    'Medium Priority': 'prioMed',
    'Low Priority':    'prioLow',
  };

  const { text: greetText, emoji } = useMemo(() => getGreeting(), []);
  const session = getSession();
  const userName = getFirstName(session?.email || 'user');
  const [activeTab, setActiveTab] = useState('tasks');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Database State
  const [tasks, setTasks] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loadingInitial, setLoadingInitial] = useState(true);

  // Form State
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('Medium Priority');
  const [newJob, setNewJob] = useState({ company: '', role: '', status: 'Applied', notes: '' });

  // ── Fetch Data on Load ─────────────────────────────────
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tasksRes, jobsRes] = await Promise.all([
          fetch('/api/tasks', { headers: authHeaders() }),
          fetch('/api/jobs', { headers: authHeaders() })
        ]);
        
        if (tasksRes.ok) setTasks(await tasksRes.json());
        if (jobsRes.ok) setJobs(await jobsRes.json());
      } catch (error) {
        console.error('Failed to load user data', error);
      } finally {
        setLoadingInitial(false);
      }
    };

    if (getToken()) fetchData();
  }, []);

  const handleSignOut = () => {
    clearSession();
    navigate('/');
  };

  // ── TASK HANDLERS ──────────────────────────────────────
  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) return;

    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ title: newTaskTitle, priority: newTaskPriority })
      });
      if (res.ok) {
        const createdTask = await res.json();
        setTasks([createdTask, ...tasks]); // Add to top
        setNewTaskTitle('');
      }
    } catch (error) {
      console.error('Failed to add task:', error);
    }
  };

  const handleToggleTask = async (task) => {
    // Optimistic UI update
    setTasks(tasks.map(t => t.id === task.id ? { ...t, completed: !t.completed } : t));

    try {
      await fetch(`/api/tasks/${task.id}/toggle`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({ completed: !task.completed })
      });
    } catch (error) {
      // Revert if failed
      setTasks(tasks.map(t => t.id === task.id ? { ...t, completed: task.completed } : t));
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE', headers: authHeaders() });
      if (res.ok) setTasks(tasks.filter(t => t.id !== id));
    } catch (error) {
      console.error('Failed to delete task', error);
    }
  };

  // ── JOB HANDLERS ───────────────────────────────────────
  const handleAddJob = async (e) => {
    e.preventDefault();
    if (!newJob.company || !newJob.role) return;

    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(newJob)
      });
      if (res.ok) {
        const createdJob = await res.json();
        setJobs([createdJob, ...jobs]);
        setIsModalOpen(false);
        setNewJob({ company: '', role: '', status: 'Applied', notes: '' });
      }
    } catch (error) {
      console.error('Failed to add application', error);
    }
  };

  const handleDeleteJob = async (id) => {
    try {
      const res = await fetch(`/api/jobs/${id}`, { method: 'DELETE', headers: authHeaders() });
      if (res.ok) setJobs(jobs.filter(j => j.id !== id));
    } catch (error) {
      console.error('Failed to delete application', error);
    }
  };

  // derived stats
  const activeTasks = tasks.filter(t => !t.completed).length;
  const highPriority = tasks.filter(t => !t.completed && t.priority === 'High Priority').length;
  const medPriority = tasks.filter(t => !t.completed && t.priority === 'Medium Priority').length;
  const lowPriority = tasks.filter(t => !t.completed && t.priority === 'Low Priority').length;

  if (loadingInitial) return <div className={styles.appContainer} style={{display:'flex',justifyContent:'center',alignItems:'center'}}>Loading your dashboard...</div>;

  return (
    <div className={styles.appContainer}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <Logo size={36} to="/" />
          <div className={styles.navToggles}>
            <button 
              className={`${styles.navPill} ${activeTab === 'tasks' ? styles.activePill : ''}`}
              onClick={() => setActiveTab('tasks')}
            >
              Tasks
            </button>
            <button 
              className={`${styles.navPill} ${activeTab === 'applications' ? styles.activePill : ''}`}
              onClick={() => setActiveTab('applications')}
            >
              Applications
            </button>
          </div>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.greetingBadge}>
            <span className={styles.greetingEmoji}>{emoji}</span>
            <span className={styles.greetingText}>
              {greetText}, <strong>{userName}</strong>
            </span>
          </div>
          <ThemeToggle />
          <button className={styles.signOutBtn} onClick={handleSignOut}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            Sign out
          </button>
        </div>
      </header>

      <main className={styles.mainContent}>
        {activeTab === 'tasks' && (
          <div className={styles.tabSection}>
            <h1 className={styles.pageTitle}>Tasks</h1>
            <p className={styles.pageSubtitle}>Focus on what needs to be done.</p>

            <div className={styles.statsRow}>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>TOTAL ACTIVE</span>
                <span className={styles.statValue}>{activeTasks}</span>
              </div>
              <div className={`${styles.statCard} ${styles.highPriCard}`}>
                <span className={styles.statLabel}>HIGH PRIORITY</span>
                <span className={styles.statValue}>{highPriority}</span>
              </div>
              <div className={`${styles.statCard} ${styles.medPriCard}`}>
                <span className={styles.statLabel}>MEDIUM</span>
                <span className={styles.statValue}>{medPriority}</span>
              </div>
              <div className={`${styles.statCard} ${styles.lowPriCard}`}>
                <span className={styles.statLabel}>LOW PRIORITY</span>
                <span className={styles.statValue}>{lowPriority}</span>
              </div>
            </div>

            <div className={styles.inputRow}>
              <input 
                type="text" 
                placeholder="What needs to be done?" 
                value={newTaskTitle}
                onChange={e => setNewTaskTitle(e.target.value)}
                className={styles.taskInput}
                onKeyDown={e => e.key === 'Enter' && handleAddTask()}
              />
              <select 
                className={styles.prioritySelect}
                value={newTaskPriority}
                onChange={e => setNewTaskPriority(e.target.value)}
              >
                <option>Low Priority</option>
                <option>Medium Priority</option>
                <option>High Priority</option>
              </select>
              <button className={styles.addBtn} onClick={handleAddTask}>+</button>
            </div>

            {tasks.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyCircle}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                </div>
                <h3>You're all caught up!</h3>
                <p>Enjoy the quiet, or add a new task above.</p>
              </div>
            ) : (
              <div className={styles.taskList}>
                {tasks.map(task => (
                  <div key={task.id} className={`${styles.taskItem} ${task.completed ? styles.taskDone : ''}`}>
                    <div className={styles.taskLeft}>
                      {/* Custom styled checkbox */}
                      <button
                        className={`${styles.checkCircle} ${task.completed ? styles.checkCircleDone : ''}`}
                        onClick={() => handleToggleTask(task)}
                        title="Mark as done"
                      >
                        {task.completed && (
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <polyline points="2,6 5,9 10,3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </button>
                      <span className={task.completed ? styles.completedText : styles.taskTitle}>{task.title}</span>
                    </div>
                    <div className={styles.taskRight}>
                      <span className={`${styles.priorityPill} ${styles[priorityClass[task.priority]]}`}>
                        <span className={styles.priorityDot} />
                        {task.priority.replace(' Priority', '')}
                      </span>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => handleDeleteTask(task.id)}
                        title="Delete task"
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6"/>
                          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                          <path d="M10 11v6M14 11v6"/>
                          <path d="M9 6V4h6v2"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'applications' && (
          <div className={styles.tabSection}>
            <div className={styles.pageHeaderFlex}>
              <div>
                <h1 className={styles.pageTitle}>Applications</h1>
                <p className={styles.pageSubtitle}>Track your job search progress beautifully.</p>
              </div>
              <button className={styles.primaryBtn} onClick={() => setIsModalOpen(true)}>
                + New Application
              </button>
            </div>

            <div className={styles.statsRow}>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>TOTAL</span>
                <span className={styles.statValue}>{jobs.length}</span>
              </div>
              <div className={`${styles.statCard} ${styles.appliedCard}`}>
                <span className={styles.statLabel}>APPLIED</span>
                <span className={styles.statValue}>{jobs.filter(j => j.status === 'Applied').length}</span>
              </div>
              <div className={`${styles.statCard} ${styles.interviewingCard}`}>
                <span className={styles.statLabel}>INTERVIEWING</span>
                <span className={styles.statValue}>{jobs.filter(j => j.status === 'Interviewing').length}</span>
              </div>
              <div className={`${styles.statCard} ${styles.offeredCard}`}>
                <span className={styles.statLabel}>OFFERED</span>
                <span className={styles.statValue}>{jobs.filter(j => j.status === 'Offered').length}</span>
              </div>
              <div className={`${styles.statCard} ${styles.rejectedCard}`}>
                <span className={styles.statLabel}>REJECTED</span>
                <span className={styles.statValue}>{jobs.filter(j => j.status === 'Rejected').length}</span>
              </div>
            </div>

            <div className={styles.jobList}>
              {jobs.map(job => (
                <div key={job.id} className={styles.jobItem}>
                  <div className={styles.jobDetails}>
                    <div className={styles.jobTitleGroup}>
                      <span className={styles.jobRoleText}>{job.role}</span>
                      <span className={styles.jobAt}>at</span>
                      <span className={styles.jobCompanyText}>{job.company}</span>
                    </div>
                    <div className={styles.jobDate}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                      {new Date(job.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                    <div className={styles.jobSubText}>applying for</div>
                  </div>
                  <div className={styles.jobRight}>
                    <div className={`${styles.statusPill} ${styles[job.status.toLowerCase()]}`}>
                      <div className={styles.dot}></div>
                      {job.status}
                    </div>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => handleDeleteJob(job.id)}
                      title="Delete application"
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                        <path d="M10 11v6M14 11v6"/>
                        <path d="M9 6V4h6v2"/>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>Log an application</h2>
              <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleAddJob} className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label>Company</label>
                <input 
                  type="text" 
                  autoFocus
                  placeholder="e.g. Acme Corp" 
                  value={newJob.company}
                  onChange={e => setNewJob({...newJob, company: e.target.value})}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Role</label>
                <input 
                  type="text" 
                  placeholder="e.g. Frontend Engineer" 
                  value={newJob.role}
                  onChange={e => setNewJob({...newJob, role: e.target.value})}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Status</label>
                <select 
                  value={newJob.status}
                  onChange={e => setNewJob({...newJob, status: e.target.value})}
                >
                  <option>Applied</option>
                  <option>Interviewing</option>
                  <option>Offered</option>
                  <option>Rejected</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Notes (optional)</label>
                <textarea 
                  placeholder="Any details about the process..." 
                  rows="3"
                  value={newJob.notes}
                  onChange={e => setNewJob({...newJob, notes: e.target.value})}
                ></textarea>
              </div>
              <div className={styles.modalFooter}>
                <button type="button" className={styles.cancelBtn} onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className={styles.saveBtn}>Save Application</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
