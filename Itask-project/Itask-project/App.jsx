import React, { useState, useEffect } from 'react';
import { Calendar, Users, CheckSquare, List, BarChart3, Download, Plus, Edit2, Trash2, LogOut, User, Lock, Eye, EyeOff, Clock, AlertCircle, TrendingUp, Layers } from 'lucide-react';

// ==================== ITASKS LOGO COMPONENT ====================

function ITasksLogo({ size = 40, showText = false, textSize = 18 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{
        width: size,
        height: size,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: size * 0.25,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
      }}>
        <Layers size={size * 0.55} color="white" strokeWidth={2.5} />
        <div style={{
          position: 'absolute',
          top: size * 0.15,
          right: size * 0.15,
          width: size * 0.25,
          height: size * 0.25,
          background: '#10b981',
          borderRadius: '50%',
          border: `${size * 0.05}px solid white`
        }}></div>
      </div>
      {showText && (
        <div>
          <div style={{ 
            fontSize: textSize, 
            fontWeight: 700, 
            color: '#1a1a2e',
            letterSpacing: '-0.5px'
          }}>
            <span style={{ color: '#667eea' }}>i</span>Tasks Manager
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== STORAGE & DATA LAYER ====================

const StorageManager = {
  async init() {
    const defaultUsers = [
      {
        id: 1,
        nome: 'Admin Gestor',
        username: 'admin',
        password: 'admin123',
        tipo: 'Gestor',
        departamento: 'IT',
        gereUtilizadores: true
      }
    ];
    
    try {
      const users = await window.storage.get('users');
      if (!users) {
        await window.storage.set('users', JSON.stringify(defaultUsers));
      }
    } catch (error) {
      await window.storage.set('users', JSON.stringify(defaultUsers));
    }
  },

  async getUsers() {
    try {
      const result = await window.storage.get('users');
      return result ? JSON.parse(result.value) : [];
    } catch {
      return [];
    }
  },

  async saveUsers(users) {
    try {
      await window.storage.set('users', JSON.stringify(users));
      return true;
    } catch {
      return false;
    }
  },

  async getTasks() {
    try {
      const result = await window.storage.get('tasks');
      return result ? JSON.parse(result.value) : [];
    } catch {
      return [];
    }
  },

  async saveTasks(tasks) {
    try {
      await window.storage.set('tasks', JSON.stringify(tasks));
      return true;
    } catch {
      return false;
    }
  },

  async getTaskTypes() {
    try {
      const result = await window.storage.get('taskTypes');
      return result ? JSON.parse(result.value) : [
        { id: 1, nome: 'Bug Fix' },
        { id: 2, nome: 'Feature' },
        { id: 3, nome: 'Refactoring' },
        { id: 4, nome: 'Testing' }
      ];
    } catch {
      return [
        { id: 1, nome: 'Bug Fix' },
        { id: 2, nome: 'Feature' },
        { id: 3, nome: 'Refactoring' },
        { id: 4, nome: 'Testing' }
      ];
    }
  },

  async saveTaskTypes(types) {
    try {
      await window.storage.set('taskTypes', JSON.stringify(types));
      return true;
    } catch {
      return false;
    }
  }
};

// ==================== MAIN APP COMPONENT ====================

export default function KanbanApp() {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [taskTypes, setTaskTypes] = useState([]);
  const [currentView, setCurrentView] = useState('login');
  const [selectedTask, setSelectedTask] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    await StorageManager.init();
    const loadedUsers = await StorageManager.getUsers();
    const loadedTasks = await StorageManager.getTasks();
    const loadedTypes = await StorageManager.getTaskTypes();
    setUsers(loadedUsers);
    setTasks(loadedTasks);
    setTaskTypes(loadedTypes);
    setIsLoading(false);
  };

  const login = (username, password) => {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      setCurrentUser(user);
      setCurrentView('kanban');
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentView('login');
    setSelectedTask(null);
  };

  const saveUsers = async (newUsers) => {
    setUsers(newUsers);
    await StorageManager.saveUsers(newUsers);
  };

  const saveTasks = async (newTasks) => {
    setTasks(newTasks);
    await StorageManager.saveTasks(newTasks);
  };

  const saveTaskTypes = async (newTypes) => {
    setTaskTypes(newTypes);
    await StorageManager.saveTaskTypes(newTypes);
  };

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
      }}>
        <div style={{ textAlign: 'center', color: 'white' }}>
          <div style={{
            width: 60,
            height: 60,
            border: '4px solid rgba(255,255,255,0.3)',
            borderTop: '4px solid white',
            borderRadius: '50%',
            margin: '0 auto 20px',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{ fontSize: 18, fontWeight: 500 }}>A carregar...</p>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <LoginScreen 
        onLogin={login}
        users={users}
      />
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
    }}>
      <Header 
        user={currentUser}
        currentView={currentView}
        onViewChange={setCurrentView}
        onLogout={logout}
      />

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '20px' }}>
        {currentView === 'kanban' && (
          <TaskBoard
            user={currentUser}
            tasks={tasks}
            users={users}
            taskTypes={taskTypes}
            onTaskUpdate={saveTasks}
            onTaskSelect={(task) => {
              setSelectedTask(task);
              setCurrentView('taskForm');
            }}
            onCreateTask={() => {
              setSelectedTask({ new: true });
              setCurrentView('taskForm');
            }}
          />
        )}

        {currentView === 'taskForm' && (
          <TaskForm
            user={currentUser}
            task={selectedTask}
            tasks={tasks}
            users={users}
            taskTypes={taskTypes}
            onSave={(task) => {
              if (task.new) {
                delete task.new;
                const newTasks = [...tasks, { 
                  ...task, 
                  id: Date.now(),
                  dataCriacao: new Date().toISOString(),
                  estadoAtual: 'ToDo',
                  dataRealInicio: null,
                  dataRealFim: null
                }];
                saveTasks(newTasks);
              } else {
                const newTasks = tasks.map(t => t.id === task.id ? task : t);
                saveTasks(newTasks);
              }
              setCurrentView('kanban');
              setSelectedTask(null);
            }}
            onCancel={() => {
              setCurrentView('kanban');
              setSelectedTask(null);
            }}
          />
        )}

        {currentView === 'users' && (
          <UserManagement
            currentUser={currentUser}
            users={users}
            onSaveUsers={saveUsers}
          />
        )}

        {currentView === 'taskTypes' && (
          <TaskTypeManagement
            taskTypes={taskTypes}
            onSaveTypes={saveTaskTypes}
          />
        )}

        {currentView === 'myCompleted' && (
          <MyCompletedTasks
            user={currentUser}
            tasks={tasks}
          />
        )}

        {currentView === 'managerCompleted' && (
          <ManagerCompletedTasks
            user={currentUser}
            tasks={tasks}
            users={users}
            taskTypes={taskTypes}
            onExportCSV={(csvData) => {
              const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
              const link = document.createElement('a');
              link.href = URL.createObjectURL(blob);
              link.download = `tarefas_concluidas_${new Date().toISOString().split('T')[0]}.csv`;
              link.click();
            }}
          />
        )}

        {currentView === 'managerPending' && (
          <ManagerPendingTasks
            user={currentUser}
            tasks={tasks}
            users={users}
          />
        )}

        {currentView === 'timeEstimate' && (
          <TimeEstimate
            user={currentUser}
            tasks={tasks}
          />
        )}
      </div>
    </div>
  );
}

// ==================== LOGIN SCREEN ====================

function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = onLogin(username, password);
    if (!success) {
      setError('Username ou password incorretos');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: 20
    }}>
      <div style={{
        background: 'white',
        borderRadius: 24,
        padding: 48,
        width: '100%',
        maxWidth: 420,
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            width: 80,
            height: 80,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: 20,
            margin: '0 auto 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)'
          }}>
            <Layers size={44} color="white" strokeWidth={2.5} />
            <div style={{
              position: 'absolute',
              top: 12,
              right: 12,
              width: 20,
              height: 20,
              background: '#10b981',
              borderRadius: '50%',
              border: '3px solid white',
              boxShadow: '0 2px 8px rgba(16, 185, 129, 0.4)'
            }}></div>
          </div>
          <h1 style={{
            fontSize: 32,
            fontWeight: 700,
            color: '#1a1a2e',
            marginBottom: 8,
            letterSpacing: '-0.5px'
          }}>
            <span style={{ color: '#667eea' }}>i</span>Tasks Manager
          </h1>
          <p style={{ color: '#64748b', fontSize: 15 }}>Sistema Inteligente de Gestão de Tarefas</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 24 }}>
            <label style={{
              display: 'block',
              fontSize: 14,
              fontWeight: 600,
              color: '#334155',
              marginBottom: 8
            }}>
              <User size={16} style={{ marginRight: 8, verticalAlign: 'middle' }} />
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Digite o seu username"
              required
              style={{
                width: '100%',
                padding: '14px 16px',
                border: '2px solid #e2e8f0',
                borderRadius: 12,
                fontSize: 15,
                outline: 'none',
                transition: 'all 0.2s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>

          <div style={{ marginBottom: 32 }}>
            <label style={{
              display: 'block',
              fontSize: 14,
              fontWeight: 600,
              color: '#334155',
              marginBottom: 8
            }}>
              <Lock size={16} style={{ marginRight: 8, verticalAlign: 'middle' }} />
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite a sua password"
                required
                style={{
                  width: '100%',
                  padding: '14px 48px 14px 16px',
                  border: '2px solid #e2e8f0',
                  borderRadius: 12,
                  fontSize: 15,
                  outline: 'none',
                  transition: 'all 0.2s',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#64748b'
                }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && (
            <div style={{
              padding: 12,
              background: '#fee2e2',
              color: '#dc2626',
              borderRadius: 8,
              marginBottom: 20,
              fontSize: 14,
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '16px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: 12,
              fontSize: 16,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'transform 0.2s',
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            Entrar
          </button>
        </form>

        <div style={{
          marginTop: 32,
          padding: 20,
          background: '#f8fafc',
          borderRadius: 12,
          fontSize: 13,
          color: '#64748b',
          lineHeight: 1.6
        }}>
          <strong style={{ color: '#334155' }}>Utilizador de teste:</strong><br />
          Username: <code style={{ background: 'white', padding: '2px 6px', borderRadius: 4 }}>admin</code><br />
          Password: <code style={{ background: 'white', padding: '2px 6px', borderRadius: 4 }}>admin123</code>
        </div>
      </div>
    </div>
  );
}

// ==================== HEADER ====================

function Header({ user, currentView, onViewChange, onLogout }) {
  const menuItems = [
    { id: 'kanban', label: 'Quadro de Tarefas', icon: List, roles: ['Gestor', 'Programador'] },
    { id: 'users', label: 'Utilizadores', icon: Users, roles: ['Gestor'], condition: u => u.gereUtilizadores },
    { id: 'taskTypes', label: 'Tipos de Tarefa', icon: CheckSquare, roles: ['Gestor'] },
    { id: 'myCompleted', label: 'Minhas Tarefas Concluídas', icon: BarChart3, roles: ['Programador'] },
    { id: 'managerCompleted', label: 'Tarefas Concluídas', icon: BarChart3, roles: ['Gestor'] },
    { id: 'managerPending', label: 'Tarefas Pendentes', icon: Clock, roles: ['Gestor'] },
    { id: 'timeEstimate', label: 'Estimativa de Tempo', icon: TrendingUp, roles: ['Gestor'] }
  ];

  const visibleItems = menuItems.filter(item => 
    item.roles.includes(user.tipo) && (!item.condition || item.condition(user))
  );

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.98)',
      borderBottom: '1px solid rgba(0,0,0,0.1)',
      backdropFilter: 'blur(10px)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
    }}>
      <div style={{
        maxWidth: 1400,
        margin: '0 auto',
        padding: '16px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 16
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 40,
            height: 40,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
          }}>
            <Layers size={22} color="white" strokeWidth={2.5} />
            <div style={{
              position: 'absolute',
              top: 6,
              right: 6,
              width: 10,
              height: 10,
              background: '#10b981',
              borderRadius: '50%',
              border: '2px solid white'
            }}></div>
          </div>
          <div>
            <div style={{ 
              fontSize: 18, 
              fontWeight: 700, 
              color: '#1a1a2e',
              letterSpacing: '-0.3px'
            }}>
              <span style={{ color: '#667eea' }}>i</span>Tasks Manager
            </div>
            <div style={{ fontSize: 13, color: '#64748b' }}>
              Olá, {user.nome}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{
            display: 'flex',
            gap: 4,
            background: '#f8fafc',
            padding: 4,
            borderRadius: 12,
            flexWrap: 'wrap'
          }}>
            {visibleItems.map(item => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  style={{
                    padding: '10px 16px',
                    background: isActive ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                    color: isActive ? 'white' : '#64748b',
                    border: 'none',
                    borderRadius: 8,
                    cursor: 'pointer',
                    fontSize: 14,
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    transition: 'all 0.2s',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.target.style.background = '#e2e8f0';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.target.style.background = 'transparent';
                  }}
                  title={item.label}
                >
                  <Icon size={16} />
                  <span style={{ display: window.innerWidth > 768 ? 'inline' : 'none' }}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>

          <button
            onClick={onLogout}
            style={{
              padding: '10px 16px',
              background: '#fee2e2',
              color: '#dc2626',
              border: 'none',
              borderRadius: 10,
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.background = '#fecaca'}
            onMouseLeave={(e) => e.target.style.background = '#fee2e2'}
          >
            <LogOut size={16} />
            Sair
          </button>
        </div>
      </div>
    </div>
  );
}

// ==================== KANBAN BOARD ====================

function TaskBoard({ user, tasks, users, taskTypes, onTaskUpdate, onTaskSelect, onCreateTask }) {
  const estados = ['ToDo', 'Doing', 'Done'];
  
  const myTasks = user.tipo === 'Programador' 
    ? tasks.filter(t => t.idProgramador === user.id)
    : tasks.filter(t => t.idGestor === user.id);

  const canMoveTask = (task, newEstado) => {
    if (user.tipo !== 'Programador') return false;
    if (task.idProgramador !== user.id) return false;
    if (task.estadoAtual === 'Done') return false;
    if (newEstado === 'Done' && task.estadoAtual !== 'Doing') return false;
    
    const userTasks = tasks.filter(t => t.idProgramador === user.id);
    const currentOrder = task.ordemExecucao;
    
    if (newEstado === 'Doing') {
      const doingCount = userTasks.filter(t => t.estadoAtual === 'Doing').length;
      if (doingCount >= 2 && task.estadoAtual !== 'Doing') {
        return { allowed: false, reason: 'Máximo de 2 tarefas simultâneas em "Doing"' };
      }
      
      const hasLowerOrderNotDone = userTasks.some(t => 
        t.ordemExecucao < currentOrder && t.estadoAtual === 'ToDo'
      );
      if (hasLowerOrderNotDone) {
        return { allowed: false, reason: 'Execute as tarefas pela ordem definida' };
      }
    }
    
    if (newEstado === 'Done') {
      const hasLowerOrderNotDone = userTasks.some(t => 
        t.ordemExecucao < currentOrder && t.estadoAtual !== 'Done'
      );
      if (hasLowerOrderNotDone) {
        return { allowed: false, reason: 'Execute as tarefas pela ordem definida' };
      }
    }
    
    return { allowed: true };
  };

  const moveTask = (task, newEstado) => {
    const validation = canMoveTask(task, newEstado);
    
    if (!validation.allowed) {
      alert(validation.reason || 'Não é possível mover esta tarefa. Verifique as regras de ordenação e limite de tarefas.');
      return;
    }

    const updatedTask = { ...task, estadoAtual: newEstado };
    
    if (newEstado === 'Doing' && task.estadoAtual === 'ToDo') {
      updatedTask.dataRealInicio = new Date().toISOString();
    } else if (newEstado === 'Done' && task.estadoAtual === 'Doing') {
      updatedTask.dataRealFim = new Date().toISOString();
    }

    const newTasks = tasks.map(t => t.id === task.id ? updatedTask : t);
    onTaskUpdate(newTasks);
  };

  const getProgrammerName = (id) => {
    const programmer = users.find(u => u.id === id);
    return programmer ? programmer.nome : 'N/A';
  };

  const getTaskTypeName = (id) => {
    const type = taskTypes.find(t => t.id === id);
    return type ? type.nome : 'N/A';
  };

  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
        flexWrap: 'wrap',
        gap: 16
      }}>
        <h2 style={{ color: 'white', fontSize: 28, fontWeight: 700, margin: 0 }}>
          Quadro de Tarefas
        </h2>
        {user.tipo === 'Gestor' && (
          <button
            onClick={onCreateTask}
            style={{
              padding: '12px 24px',
              background: 'white',
              color: '#667eea',
              border: 'none',
              borderRadius: 12,
              fontSize: 15,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            <Plus size={20} />
            Nova Tarefa
          </button>
        )}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: 20
      }}>
        {estados.map(estado => {
          const estadoTasks = myTasks.filter(t => t.estadoAtual === estado);
          
          return (
            <div key={estado} style={{
              background: 'rgba(255, 255, 255, 0.98)',
              borderRadius: 16,
              padding: 20,
              minHeight: 400
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 16,
                paddingBottom: 12,
                borderBottom: '2px solid #e2e8f0'
              }}>
                <h3 style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: '#1a1a2e',
                  margin: 0
                }}>
                  {estado}
                </h3>
                <span style={{
                  background: estado === 'Done' ? '#dcfce7' : estado === 'Doing' ? '#fef3c7' : '#dbeafe',
                  color: estado === 'Done' ? '#166534' : estado === 'Doing' ? '#854d0e' : '#1e40af',
                  padding: '4px 12px',
                  borderRadius: 20,
                  fontSize: 13,
                  fontWeight: 600
                }}>
                  {estadoTasks.length}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {estadoTasks.sort((a, b) => a.ordemExecucao - b.ordemExecucao).map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    user={user}
                    getProgrammerName={getProgrammerName}
                    getTaskTypeName={getTaskTypeName}
                    onMove={moveTask}
                    onSelect={() => onTaskSelect(task)}
                    canMove={canMoveTask}
                  />
                ))}
                
                {estadoTasks.length === 0 && (
                  <div style={{
                    padding: 40,
                    textAlign: 'center',
                    color: '#94a3b8',
                    fontSize: 14
                  }}>
                    Nenhuma tarefa em {estado}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TaskCard({ task, user, getProgrammerName, getTaskTypeName, onMove, onSelect, canMove }) {
  const [showActions, setShowActions] = useState(false);

  const nextStates = {
    'ToDo': ['Doing'],
    'Doing': ['Done'],
    'Done': []
  };

  const availableMoves = nextStates[task.estadoAtual]
    .map(state => ({ state, validation: canMove(task, state) }))
    .filter(move => move.validation.allowed);

  return (
    <div
      style={{
        background: 'white',
        border: '1px solid #e2e8f0',
        borderRadius: 12,
        padding: 16,
        cursor: 'pointer',
        transition: 'all 0.2s',
        position: 'relative'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
        setShowActions(true);
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'none';
        setShowActions(false);
      }}
      onClick={onSelect}
    >
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'start',
        marginBottom: 12
      }}>
        <div style={{
          fontSize: 15,
          fontWeight: 600,
          color: '#1a1a2e',
          lineHeight: 1.4,
          flex: 1
        }}>
          {task.descricao}
        </div>
        <div style={{
          background: '#f1f5f9',
          padding: '4px 10px',
          borderRadius: 6,
          fontSize: 12,
          fontWeight: 600,
          color: '#475569',
          whiteSpace: 'nowrap',
          marginLeft: 8
        }}>
          #{task.ordemExecucao}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#64748b' }}>
          <User size={14} />
          <span>{getProgrammerName(task.idProgramador)}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#64748b' }}>
          <CheckSquare size={14} />
          <span>{getTaskTypeName(task.idTipoTarefa)}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#64748b' }}>
          <BarChart3 size={14} />
          <span>{task.storyPoints} SP</span>
        </div>
        {task.dataPrevistaFim && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#64748b' }}>
            <Calendar size={14} />
            <span>{new Date(task.dataPrevistaFim).toLocaleDateString('pt-PT')}</span>
          </div>
        )}
      </div>

      {user.tipo === 'Programador' && showActions && availableMoves.length > 0 && (
        <div style={{
          marginTop: 12,
          paddingTop: 12,
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          gap: 6
        }}>
          {availableMoves.map(move => (
            <button
              key={move.state}
              onClick={(e) => {
                e.stopPropagation();
                onMove(task, move.state);
              }}
              style={{
                flex: 1,
                padding: '8px',
                background: move.state === 'Done' ? '#dcfce7' : '#fef3c7',
                color: move.state === 'Done' ? '#166534' : '#854d0e',
                border: 'none',
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Mover para {move.state}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ==================== TASK FORM ====================

function TaskForm({ user, task, tasks, users, taskTypes, onSave, onCancel }) {
  const isNew = task?.new;
  const isReadOnly = user.tipo === 'Programador' && !isNew;
  const isDone = task?.estadoAtual === 'Done';
  
  const [formData, setFormData] = useState({
    id: task?.id || null,
    idGestor: task?.idGestor || user.id,
    idProgramador: task?.idProgramador || '',
    idTipoTarefa: task?.idTipoTarefa || '',
    descricao: task?.descricao || '',
    ordemExecucao: task?.ordemExecucao || '',
    storyPoints: task?.storyPoints || '',
    dataPrevistaInicio: task?.dataPrevistaInicio?.split('T')[0] || '',
    dataPrevistaFim: task?.dataPrevistaFim?.split('T')[0] || '',
    estadoAtual: task?.estadoAtual || 'ToDo',
    dataCriacao: task?.dataCriacao || new Date().toISOString(),
    dataRealInicio: task?.dataRealInicio || null,
    dataRealFim: task?.dataRealFim || null
  });

  const myProgrammers = users.filter(u => u.tipo === 'Programador' && u.idGestor === user.id);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.idProgramador || !formData.idTipoTarefa || !formData.descricao || 
        !formData.ordemExecucao || !formData.storyPoints) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    const duplicateOrder = tasks.find(t => 
      t.id !== formData.id &&
      t.idProgramador === parseInt(formData.idProgramador) &&
      t.ordemExecucao === parseInt(formData.ordemExecucao)
    );

    if (duplicateOrder) {
      alert('Já existe uma tarefa com esta ordem para este programador');
      return;
    }

    const taskToSave = {
      ...formData,
      idProgramador: parseInt(formData.idProgramador),
      idTipoTarefa: parseInt(formData.idTipoTarefa),
      ordemExecucao: parseInt(formData.ordemExecucao),
      storyPoints: parseInt(formData.storyPoints),
      new: isNew
    };

    onSave(taskToSave);
  };

  return (
    <div style={{
      background: 'white',
      borderRadius: 16,
      padding: 32,
      maxWidth: 800,
      margin: '0 auto'
    }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, color: '#1a1a2e', marginBottom: 24 }}>
        {isNew ? 'Nova Tarefa' : isReadOnly ? 'Detalhes da Tarefa' : 'Editar Tarefa'}
      </h2>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gap: 20 }}>
          <div>
            <label style={labelStyle}>Programador *</label>
            <select
              value={formData.idProgramador}
              onChange={(e) => setFormData({...formData, idProgramador: e.target.value})}
              disabled={isReadOnly || isDone}
              style={inputStyle}
              required
            >
              <option value="">Selecione um programador</option>
              {myProgrammers.map(p => (
                <option key={p.id} value={p.id}>{p.nome}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={labelStyle}>Tipo de Tarefa *</label>
            <select
              value={formData.idTipoTarefa}
              onChange={(e) => setFormData({...formData, idTipoTarefa: e.target.value})}
              disabled={isReadOnly || isDone}
              style={inputStyle}
              required
            >
              <option value="">Selecione um tipo</option>
              {taskTypes.map(t => (
                <option key={t.id} value={t.id}>{t.nome}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={labelStyle}>Descrição *</label>
            <textarea
              value={formData.descricao}
              onChange={(e) => setFormData({...formData, descricao: e.target.value})}
              disabled={isReadOnly || isDone}
              style={{...inputStyle, minHeight: 100, resize: 'vertical'}}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div>
              <label style={labelStyle}>Ordem de Execução *</label>
              <input
                type="number"
                value={formData.ordemExecucao}
                onChange={(e) => setFormData({...formData, ordemExecucao: e.target.value})}
                disabled={isReadOnly || isDone}
                style={inputStyle}
                min="1"
                required
              />
            </div>

            <div>
              <label style={labelStyle}>Story Points *</label>
              <input
                type="number"
                value={formData.storyPoints}
                onChange={(e) => setFormData({...formData, storyPoints: e.target.value})}
                disabled={isReadOnly || isDone}
                style={inputStyle}
                min="1"
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div>
              <label style={labelStyle}>Data Prevista Início</label>
              <input
                type="date"
                value={formData.dataPrevistaInicio}
                onChange={(e) => setFormData({...formData, dataPrevistaInicio: e.target.value})}
                disabled={isReadOnly || isDone}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Data Prevista Fim</label>
              <input
                type="date"
                value={formData.dataPrevistaFim}
                onChange={(e) => setFormData({...formData, dataPrevistaFim: e.target.value})}
                disabled={isReadOnly || isDone}
                style={inputStyle}
              />
            </div>
          </div>

          {!isNew && (
            <>
              <div>
                <label style={labelStyle}>Estado Atual</label>
                <input
                  type="text"
                  value={formData.estadoAtual}
                  disabled
                  style={{...inputStyle, background: '#f1f5f9', cursor: 'not-allowed'}}
                />
              </div>

              {formData.dataRealInicio && (
                <div>
                  <label style={labelStyle}>Data Real Início</label>
                  <input
                    type="text"
                    value={new Date(formData.dataRealInicio).toLocaleString('pt-PT')}
                    disabled
                    style={{...inputStyle, background: '#f1f5f9', cursor: 'not-allowed'}}
                  />
                </div>
              )}

              {formData.dataRealFim && (
                <div>
                  <label style={labelStyle}>Data Real Fim</label>
                  <input
                    type="text"
                    value={new Date(formData.dataRealFim).toLocaleString('pt-PT')}
                    disabled
                    style={{...inputStyle, background: '#f1f5f9', cursor: 'not-allowed'}}
                  />
                </div>
              )}
            </>
          )}
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
          {!isReadOnly && !isDone && (
            <button
              type="submit"
              style={{
                flex: 1,
                padding: '14px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: 12,
                fontSize: 15,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'transform 0.2s'
              }}
            >
              {isNew ? 'Criar Tarefa' : 'Guardar Alterações'}
            </button>
          )}
          <button
            type="button"
            onClick={onCancel}
            style={{
              flex: 1,
              padding: '14px',
              background: '#f1f5f9',
              color: '#64748b',
              border: 'none',
              borderRadius: 12,
              fontSize: 15,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {isReadOnly ? 'Fechar' : 'Cancelar'}
          </button>
        </div>
      </form>
    </div>
  );
}

const labelStyle = {
  display: 'block',
  fontSize: 14,
  fontWeight: 600,
  color: '#334155',
  marginBottom: 8
};

const inputStyle = {
  width: '100%',
  padding: '12px 16px',
  border: '2px solid #e2e8f0',
  borderRadius: 10,
  fontSize: 15,
  outline: 'none',
  transition: 'border-color 0.2s',
  boxSizing: 'border-box'
};

// ==================== USER MANAGEMENT ====================

function UserManagement({ currentUser, users, onSaveUsers }) {
  const [editingUser, setEditingUser] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const gestores = users.filter(u => u.tipo === 'Gestor');

  const handleSave = (userData) => {
    if (userData.new) {
      if (users.some(u => u.username === userData.username)) {
        alert('Username já existe');
        return;
      }
      delete userData.new;
      const newUsers = [...users, { ...userData, id: Date.now() }];
      onSaveUsers(newUsers);
    } else {
      const newUsers = users.map(u => u.id === userData.id ? userData : u);
      onSaveUsers(newUsers);
    }
    setShowForm(false);
    setEditingUser(null);
  };

  const handleDelete = (userId) => {
    if (window.confirm('Tem certeza que deseja eliminar este utilizador?')) {
      const newUsers = users.filter(u => u.id !== userId);
      onSaveUsers(newUsers);
    }
  };

  if (showForm) {
    return (
      <UserForm
        user={editingUser}
        gestores={gestores}
        onSave={handleSave}
        onCancel={() => {
          setShowForm(false);
          setEditingUser(null);
        }}
      />
    );
  }

  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
        flexWrap: 'wrap',
        gap: 16
      }}>
        <h2 style={{ color: 'white', fontSize: 28, fontWeight: 700, margin: 0 }}>
          Gestão de Utilizadores
        </h2>
        <button
          onClick={() => {
            setEditingUser({ new: true, tipo: 'Programador' });
            setShowForm(true);
          }}
          style={{
            padding: '12px 24px',
            background: 'white',
            color: '#667eea',
            border: 'none',
            borderRadius: 12,
            fontSize: 15,
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            transition: 'all 0.2s'
          }}
        >
          <Plus size={20} />
          Novo Utilizador
        </button>
      </div>

      <div style={{
        background: 'white',
        borderRadius: 16,
        padding: 20,
        overflowX: 'auto'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
              <th style={tableHeaderStyle}>Nome</th>
              <th style={tableHeaderStyle}>Username</th>
              <th style={tableHeaderStyle}>Tipo</th>
              <th style={tableHeaderStyle}>Departamento</th>
              <th style={tableHeaderStyle}>Nível</th>
              <th style={tableHeaderStyle}>Gestor</th>
              <th style={tableHeaderStyle}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => {
              const gestor = users.find(u => u.id === user.idGestor);
              return (
                <tr key={user.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={tableCellStyle}>{user.nome}</td>
                  <td style={tableCellStyle}>{user.username}</td>
                  <td style={tableCellStyle}>
                    <span style={{
                      background: user.tipo === 'Gestor' ? '#dbeafe' : '#fef3c7',
                      color: user.tipo === 'Gestor' ? '#1e40af' : '#854d0e',
                      padding: '4px 12px',
                      borderRadius: 12,
                      fontSize: 12,
                      fontWeight: 600
                    }}>
                      {user.tipo}
                    </span>
                  </td>
                  <td style={tableCellStyle}>{user.departamento || '-'}</td>
                  <td style={tableCellStyle}>{user.nivelExperiencia || '-'}</td>
                  <td style={tableCellStyle}>{gestor?.nome || '-'}</td>
                  <td style={tableCellStyle}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        onClick={() => {
                          setEditingUser(user);
                          setShowForm(true);
                        }}
                        style={actionButtonStyle}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        style={{...actionButtonStyle, background: '#fee2e2', color: '#dc2626'}}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function UserForm({ user, gestores, onSave, onCancel }) {
  const isNew = user?.new;
  const [formData, setFormData] = useState({
    id: user?.id || null,
    nome: user?.nome || '',
    username: user?.username || '',
    password: user?.password || '',
    tipo: user?.tipo || 'Programador',
    departamento: user?.departamento || 'IT',
    nivelExperiencia: user?.nivelExperiencia || 'Júnior',
    idGestor: user?.idGestor || '',
    gereUtilizadores: user?.gereUtilizadores || false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.username || !formData.password) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    if (formData.tipo === 'Programador' && !formData.idGestor) {
      alert('Programador deve ter um gestor associado');
      return;
    }

    onSave({ ...formData, new: isNew });
  };

  return (
    <div style={{
      background: 'white',
      borderRadius: 16,
      padding: 32,
      maxWidth: 800,
      margin: '0 auto'
    }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, color: '#1a1a2e', marginBottom: 24 }}>
        {isNew ? 'Novo Utilizador' : 'Editar Utilizador'}
      </h2>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gap: 20 }}>
          <div>
            <label style={labelStyle}>Nome *</label>
            <input
              type="text"
              value={formData.nome}
              onChange={(e) => setFormData({...formData, nome: e.target.value})}
              style={inputStyle}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div>
              <label style={labelStyle}>Username *</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                style={inputStyle}
                required
              />
            </div>

            <div>
              <label style={labelStyle}>Password *</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                style={inputStyle}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div>
              <label style={labelStyle}>Tipo *</label>
              <select
                value={formData.tipo}
                onChange={(e) => setFormData({...formData, tipo: e.target.value})}
                style={inputStyle}
                required
              >
                <option value="Programador">Programador</option>
                <option value="Gestor">Gestor</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>Departamento</label>
              <select
                value={formData.departamento}
                onChange={(e) => setFormData({...formData, departamento: e.target.value})}
                style={inputStyle}
              >
                <option value="IT">IT</option>
                <option value="Marketing">Marketing</option>
                <option value="Administração">Administração</option>
              </select>
            </div>
          </div>

          {formData.tipo === 'Programador' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div>
                <label style={labelStyle}>Nível de Experiência</label>
                <select
                  value={formData.nivelExperiencia}
                  onChange={(e) => setFormData({...formData, nivelExperiencia: e.target.value})}
                  style={inputStyle}
                >
                  <option value="Júnior">Júnior</option>
                  <option value="Sénior">Sénior</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>Gestor *</label>
                <select
                  value={formData.idGestor}
                  onChange={(e) => setFormData({...formData, idGestor: parseInt(e.target.value)})}
                  style={inputStyle}
                  required
                >
                  <option value="">Selecione um gestor</option>
                  {gestores.map(g => (
                    <option key={g.id} value={g.id}>{g.nome}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {formData.tipo === 'Gestor' && (
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formData.gereUtilizadores}
                  onChange={(e) => setFormData({...formData, gereUtilizadores: e.target.checked})}
                  style={{ width: 18, height: 18, cursor: 'pointer' }}
                />
                <span style={{ fontSize: 14, fontWeight: 600, color: '#334155' }}>
                  Pode gerir utilizadores
                </span>
              </label>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
          <button
            type="submit"
            style={{
              flex: 1,
              padding: '14px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: 12,
              fontSize: 15,
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            {isNew ? 'Criar Utilizador' : 'Guardar Alterações'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            style={{
              flex: 1,
              padding: '14px',
              background: '#f1f5f9',
              color: '#64748b',
              border: 'none',
              borderRadius: 12,
              fontSize: 15,
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

// ==================== TASK TYPE MANAGEMENT ====================

function TaskTypeManagement({ taskTypes, onSaveTypes }) {
  const [newType, setNewType] = useState('');

  const handleAdd = () => {
    if (!newType.trim()) return;
    const types = [...taskTypes, { id: Date.now(), nome: newType }];
    onSaveTypes(types);
    setNewType('');
  };

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja eliminar este tipo de tarefa?')) {
      const types = taskTypes.filter(t => t.id !== id);
      onSaveTypes(types);
    }
  };

  return (
    <div>
      <h2 style={{ color: 'white', fontSize: 28, fontWeight: 700, marginBottom: 24 }}>
        Tipos de Tarefa
      </h2>

      <div style={{
        background: 'white',
        borderRadius: 16,
        padding: 24
      }}>
        <div style={{ marginBottom: 24 }}>
          <label style={labelStyle}>Adicionar Novo Tipo</label>
          <div style={{ display: 'flex', gap: 12 }}>
            <input
              type="text"
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
              placeholder="Nome do tipo de tarefa"
              style={{ ...inputStyle, flex: 1 }}
              onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
            />
            <button
              onClick={handleAdd}
              style={{
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: 10,
                fontSize: 15,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}
            >
              <Plus size={20} />
              Adicionar
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gap: 12 }}>
          {taskTypes.map(type => (
            <div
              key={type.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 16,
                background: '#f8fafc',
                borderRadius: 12,
                border: '1px solid #e2e8f0'
              }}
            >
              <span style={{ fontSize: 15, fontWeight: 600, color: '#1a1a2e' }}>
                {type.nome}
              </span>
              <button
                onClick={() => handleDelete(type.id)}
                style={{
                  padding: '8px 12px',
                  background: '#fee2e2',
                  color: '#dc2626',
                  border: 'none',
                  borderRadius: 8,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                <Trash2 size={16} />
                Eliminar
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ==================== MY COMPLETED TASKS ====================

function MyCompletedTasks({ user, tasks }) {
  const myCompletedTasks = tasks.filter(t => 
    t.idProgramador === user.id && t.estadoAtual === 'Done'
  );

  const calculateDays = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    return diff;
  };

  return (
    <div>
      <h2 style={{ color: 'white', fontSize: 28, fontWeight: 700, marginBottom: 24 }}>
        Minhas Tarefas Concluídas
      </h2>

      <div style={{
        background: 'white',
        borderRadius: 16,
        padding: 20,
        overflowX: 'auto'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
              <th style={tableHeaderStyle}>Descrição</th>
              <th style={tableHeaderStyle}>Data Início</th>
              <th style={tableHeaderStyle}>Data Fim</th>
              <th style={tableHeaderStyle}>Dias</th>
              <th style={tableHeaderStyle}>Story Points</th>
            </tr>
          </thead>
          <tbody>
            {myCompletedTasks.map(task => {
              const days = calculateDays(task.dataRealInicio, task.dataRealFim);
              return (
                <tr key={task.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={tableCellStyle}>{task.descricao}</td>
                  <td style={tableCellStyle}>
                    {new Date(task.dataRealInicio).toLocaleDateString('pt-PT')}
                  </td>
                  <td style={tableCellStyle}>
                    {new Date(task.dataRealFim).toLocaleDateString('pt-PT')}
                  </td>
                  <td style={tableCellStyle}>
                    <span style={{
                      background: '#dcfce7',
                      color: '#166534',
                      padding: '4px 12px',
                      borderRadius: 12,
                      fontSize: 13,
                      fontWeight: 600
                    }}>
                      {days} dias
                    </span>
                  </td>
                  <td style={tableCellStyle}>{task.storyPoints} SP</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {myCompletedTasks.length === 0 && (
          <div style={{
            padding: 60,
            textAlign: 'center',
            color: '#94a3b8'
          }}>
            Nenhuma tarefa concluída ainda
          </div>
        )}
      </div>
    </div>
  );
}

// ==================== MANAGER COMPLETED TASKS ====================

function ManagerCompletedTasks({ user, tasks, users, taskTypes, onExportCSV }) {
  const myCompletedTasks = tasks.filter(t => 
    t.idGestor === user.id && t.estadoAtual === 'Done'
  );

  const calculateDays = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
  };

  const calculatePrevistoDays = (start, end) => {
    if (!start || !end) return 0;
    const startDate = new Date(start);
    const endDate = new Date(end);
    return Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
  };

  const getProgrammerName = (id) => {
    const prog = users.find(u => u.id === id);
    return prog ? prog.nome : 'N/A';
  };

  const getTaskTypeName = (id) => {
    const type = taskTypes.find(t => t.id === id);
    return type ? type.nome : id;
  };

  const handleExport = () => {
    const header = 'Programador;Descricao;DataPrevistaInicio;DataPrevistaFim;TipoTarefa;DataRealInicio;DataRealFim\n';
    const rows = myCompletedTasks.map(task => {
      return [
        getProgrammerName(task.idProgramador),
        task.descricao,
        task.dataPrevistaInicio || '',
        task.dataPrevistaFim || '',
        getTaskTypeName(task.idTipoTarefa),
        task.dataRealInicio || '',
        task.dataRealFim || ''
      ].join(';');
    }).join('\n');
    
    onExportCSV(header + rows);
  };

  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
        flexWrap: 'wrap',
        gap: 16
      }}>
        <h2 style={{ color: 'white', fontSize: 28, fontWeight: 700, margin: 0 }}>
          Tarefas Concluídas
        </h2>
        {myCompletedTasks.length > 0 && (
          <button
            onClick={handleExport}
            style={{
              padding: '12px 24px',
              background: 'white',
              color: '#667eea',
              border: 'none',
              borderRadius: 12,
              fontSize: 15,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}
          >
            <Download size={20} />
            Exportar CSV
          </button>
        )}
      </div>

      <div style={{
        background: 'white',
        borderRadius: 16,
        padding: 20,
        overflowX: 'auto'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
              <th style={tableHeaderStyle}>Programador</th>
              <th style={tableHeaderStyle}>Descrição</th>
              <th style={tableHeaderStyle}>Tempo Real</th>
              <th style={tableHeaderStyle}>Tempo Previsto</th>
              <th style={tableHeaderStyle}>Diferença</th>
              <th style={tableHeaderStyle}>SP</th>
            </tr>
          </thead>
          <tbody>
            {myCompletedTasks.map(task => {
              const realDays = calculateDays(task.dataRealInicio, task.dataRealFim);
              const previstoDays = calculatePrevistoDays(task.dataPrevistaInicio, task.dataPrevistaFim);
              const diff = realDays - previstoDays;
              
              return (
                <tr key={task.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={tableCellStyle}>{getProgrammerName(task.idProgramador)}</td>
                  <td style={tableCellStyle}>{task.descricao}</td>
                  <td style={tableCellStyle}>
                    <span style={{
                      background: '#dbeafe',
                      color: '#1e40af',
                      padding: '4px 12px',
                      borderRadius: 12,
                      fontSize: 13,
                      fontWeight: 600
                    }}>
                      {realDays} dias
                    </span>
                  </td>
                  <td style={tableCellStyle}>
                    <span style={{
                      background: '#f1f5f9',
                      color: '#475569',
                      padding: '4px 12px',
                      borderRadius: 12,
                      fontSize: 13,
                      fontWeight: 600
                    }}>
                      {previstoDays} dias
                    </span>
                  </td>
                  <td style={tableCellStyle}>
                    <span style={{
                      background: diff > 0 ? '#fee2e2' : '#dcfce7',
                      color: diff > 0 ? '#dc2626' : '#166534',
                      padding: '4px 12px',
                      borderRadius: 12,
                      fontSize: 13,
                      fontWeight: 600
                    }}>
                      {diff > 0 ? '+' : ''}{diff} dias
                    </span>
                  </td>
                  <td style={tableCellStyle}>{task.storyPoints} SP</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {myCompletedTasks.length === 0 && (
          <div style={{
            padding: 60,
            textAlign: 'center',
            color: '#94a3b8'
          }}>
            Nenhuma tarefa concluída ainda
          </div>
        )}
      </div>
    </div>
  );
}

// ==================== MANAGER PENDING TASKS ====================

function ManagerPendingTasks({ user, tasks, users }) {
  const myPendingTasks = tasks.filter(t => 
    t.idGestor === user.id && t.estadoAtual !== 'Done'
  ).sort((a, b) => {
    const order = { 'ToDo': 1, 'Doing': 2 };
    return order[a.estadoAtual] - order[b.estadoAtual];
  });

  const getProgrammerName = (id) => {
    const prog = users.find(u => u.id === id);
    return prog ? prog.nome : 'N/A';
  };

  const calculateTimeLeft = (task) => {
    if (!task.dataPrevistaFim) return 'N/A';
    const now = new Date();
    const end = new Date(task.dataPrevistaFim);
    const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    return diff;
  };

  return (
    <div>
      <h2 style={{ color: 'white', fontSize: 28, fontWeight: 700, marginBottom: 24 }}>
        Tarefas Pendentes
      </h2>

      <div style={{
        background: 'white',
        borderRadius: 16,
        padding: 20,
        overflowX: 'auto'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
              <th style={tableHeaderStyle}>Estado</th>
              <th style={tableHeaderStyle}>Descrição</th>
              <th style={tableHeaderStyle}>Programador</th>
              <th style={tableHeaderStyle}>Ordem</th>
              <th style={tableHeaderStyle}>Tempo Restante</th>
            </tr>
          </thead>
          <tbody>
            {myPendingTasks.map(task => {
              const timeLeft = calculateTimeLeft(task);
              const isLate = typeof timeLeft === 'number' && timeLeft < 0;
              
              return (
                <tr key={task.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={tableCellStyle}>
                    <span style={{
                      background: task.estadoAtual === 'Doing' ? '#fef3c7' : '#dbeafe',
                      color: task.estadoAtual === 'Doing' ? '#854d0e' : '#1e40af',
                      padding: '4px 12px',
                      borderRadius: 12,
                      fontSize: 13,
                      fontWeight: 600
                    }}>
                      {task.estadoAtual}
                    </span>
                  </td>
                  <td style={tableCellStyle}>{task.descricao}</td>
                  <td style={tableCellStyle}>{getProgrammerName(task.idProgramador)}</td>
                  <td style={tableCellStyle}>#{task.ordemExecucao}</td>
                  <td style={tableCellStyle}>
                    {typeof timeLeft === 'number' ? (
                      <span style={{
                        background: isLate ? '#fee2e2' : '#dcfce7',
                        color: isLate ? '#dc2626' : '#166534',
                        padding: '4px 12px',
                        borderRadius: 12,
                        fontSize: 13,
                        fontWeight: 600,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4
                      }}>
                        {isLate && <AlertCircle size={14} />}
                        {isLate ? `Atrasado ${Math.abs(timeLeft)} dias` : `${timeLeft} dias`}
                      </span>
                    ) : (
                      <span style={{ color: '#94a3b8' }}>Sem data prevista</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {myPendingTasks.length === 0 && (
          <div style={{
            padding: 60,
            textAlign: 'center',
            color: '#94a3b8'
          }}>
            Nenhuma tarefa pendente
          </div>
        )}
      </div>
    </div>
  );
}

// ==================== TIME ESTIMATE ====================

function TimeEstimate({ user, tasks }) {
  const myTasks = tasks.filter(t => t.idGestor === user.id);
  const completedTasks = myTasks.filter(t => t.estadoAtual === 'Done');
  const todoTasks = myTasks.filter(t => t.estadoAtual === 'ToDo');

  const calculateDays = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
  };

  const avgTimeBySP = {};
  completedTasks.forEach(task => {
    if (!avgTimeBySP[task.storyPoints]) {
      avgTimeBySP[task.storyPoints] = [];
    }
    const days = calculateDays(task.dataRealInicio, task.dataRealFim);
    avgTimeBySP[task.storyPoints].push(days);
  });

  Object.keys(avgTimeBySP).forEach(sp => {
    const times = avgTimeBySP[sp];
    avgTimeBySP[sp] = times.reduce((a, b) => a + b, 0) / times.length;
  });

  const estimateTime = (sp) => {
    if (avgTimeBySP[sp]) {
      return avgTimeBySP[sp];
    }
    
    const availableSPs = Object.keys(avgTimeBySP).map(Number).sort((a, b) => a - b);
    if (availableSPs.length === 0) return null;
    
    const closest = availableSPs.reduce((prev, curr) => 
      Math.abs(curr - sp) < Math.abs(prev - sp) ? curr : prev
    );
    
    return avgTimeBySP[closest];
  };

  const totalEstimate = todoTasks.reduce((sum, task) => {
    const estimate = estimateTime(task.storyPoints);
    return sum + (estimate || 0);
  }, 0);

  return (
    <div>
      <h2 style={{ color: 'white', fontSize: 28, fontWeight: 700, marginBottom: 24 }}>
        Estimativa de Tempo
      </h2>

      <div style={{ display: 'grid', gap: 20 }}>
        <div style={{
          background: 'white',
          borderRadius: 16,
          padding: 32,
          textAlign: 'center'
        }}>
          <div style={{ fontSize: 48, fontWeight: 700, color: '#667eea', marginBottom: 12 }}>
            {totalEstimate.toFixed(1)} dias
          </div>
          <div style={{ fontSize: 16, color: '#64748b' }}>
            Tempo estimado para concluir todas as tarefas em "ToDo"
          </div>
        </div>

        <div style={{
          background: 'white',
          borderRadius: 16,
          padding: 20
        }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1a1a2e', marginBottom: 16 }}>
            Média de Tempo por Story Points
          </h3>
          <div style={{ display: 'grid', gap: 12 }}>
            {Object.entries(avgTimeBySP).map(([sp, avg]) => (
              <div
                key={sp}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: 16,
                  background: '#f8fafc',
                  borderRadius: 12
                }}
              >
                <span style={{ fontSize: 15, fontWeight: 600, color: '#1a1a2e' }}>
                  {sp} Story Points
                </span>
                <span style={{
                  background: '#dbeafe',
                  color: '#1e40af',
                  padding: '6px 16px',
                  borderRadius: 12,
                  fontSize: 14,
                  fontWeight: 600
                }}>
                  {avg.toFixed(1)} dias
                </span>
              </div>
            ))}
          </div>

          {Object.keys(avgTimeBySP).length === 0 && (
            <div style={{
              padding: 40,
              textAlign: 'center',
              color: '#94a3b8'
            }}>
              Nenhuma tarefa concluída para calcular médias
            </div>
          )}
        </div>

        <div style={{
          background: 'white',
          borderRadius: 16,
          padding: 20,
          overflowX: 'auto'
        }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1a1a2e', marginBottom: 16 }}>
            Tarefas em "ToDo" com Estimativas
          </h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                <th style={tableHeaderStyle}>Descrição</th>
                <th style={tableHeaderStyle}>Story Points</th>
                <th style={tableHeaderStyle}>Tempo Estimado</th>
              </tr>
            </thead>
            <tbody>
              {todoTasks.map(task => {
                const estimate = estimateTime(task.storyPoints);
                return (
                  <tr key={task.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={tableCellStyle}>{task.descricao}</td>
                    <td style={tableCellStyle}>{task.storyPoints} SP</td>
                    <td style={tableCellStyle}>
                      {estimate ? (
                        <span style={{
                          background: '#dcfce7',
                          color: '#166534',
                          padding: '4px 12px',
                          borderRadius: 12,
                          fontSize: 13,
                          fontWeight: 600
                        }}>
                          {estimate.toFixed(1)} dias
                        </span>
                      ) : (
                        <span style={{ color: '#94a3b8' }}>Sem dados</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {todoTasks.length === 0 && (
            <div style={{
              padding: 40,
              textAlign: 'center',
              color: '#94a3b8'
            }}>
              Nenhuma tarefa em "ToDo"
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ==================== TABLE STYLES ====================

const tableHeaderStyle = {
  padding: '12px 16px',
  textAlign: 'left',
  fontSize: 13,
  fontWeight: 700,
  color: '#64748b',
  textTransform: 'uppercase',
  letterSpacing: '0.5px'
};

const tableCellStyle = {
  padding: '16px',
  fontSize: 14,
  color: '#1a1a2e'
};

const actionButtonStyle = {
  padding: '8px 12px',
  background: '#dbeafe',
  color: '#1e40af',
  border: 'none',
  borderRadius: 8,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: 4,
  transition: 'all 0.2s'
};