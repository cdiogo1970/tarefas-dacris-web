// API Base URL
const API_URL = 'https://3001-imvji4vnqusqpgvtvfm9g-5b0a2211.us1.manus.computer/api';

// State
let tasks = [];
let themes = [];
let currentFilter = 'all';
let currentThemeFilter = 'all';
let currentPriorityFilter = 'all';
let currentSort = 'date';
let searchQuery = '';
let editingTaskId = null;

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    requireAuth();
    loadUserInfo();
    loadThemes();
    loadTasks();
    setupEventListeners();
});

// Load user info
async function loadUserInfo() {
    try {
        const response = await fetch(`${API_URL}/auth/me`, {
            headers: {
                'Authorization': `Bearer ${getToken()}`,
            },
        });

        if (!response.ok) {
            throw new Error('Não autorizado');
        }

        const user = await response.json();
        document.getElementById('userName').textContent = user.name;
        document.getElementById('userEmail').textContent = user.email;
    } catch (error) {
        console.error('Erro ao carregar usuário:', error);
        logout();
    }
}

// Load themes
async function loadThemes() {
    try {
        const response = await fetch(`${API_URL}/themes`, {
            headers: {
                'Authorization': `Bearer ${getToken()}`,
            },
        });

        if (!response.ok) {
            throw new Error('Erro ao carregar temas');
        }

        themes = await response.json();
        renderThemeFilters();
        renderThemeOptions();
    } catch (error) {
        console.error('Erro ao carregar temas:', error);
    }
}

// Load tasks
async function loadTasks() {
    try {
        const response = await fetch(`${API_URL}/tasks`, {
            headers: {
                'Authorization': `Bearer ${getToken()}`,
            },
        });

        if (!response.ok) {
            throw new Error('Erro ao carregar tarefas');
        }

        tasks = await response.json();
        renderTasks();
    } catch (error) {
        console.error('Erro ao carregar tarefas:', error);
    }
}

// Render theme filters
function renderThemeFilters() {
    const container = document.getElementById('themeFilters');
    if (!container) return;

    container.innerHTML = `
        <button class="filter-btn ${currentThemeFilter === 'all' ? 'active' : ''}" 
                onclick="filterByTheme('all')">
            Todos
        </button>
        ${themes.map(theme => `
            <button class="filter-btn ${currentThemeFilter === theme.id ? 'active' : ''}" 
                    onclick="filterByTheme('${theme.id}')"
                    style="border-color: ${theme.color};">
                ${theme.name}
            </button>
        `).join('')}
    `;
}

// Render theme options in form
function renderThemeOptions() {
    const select = document.getElementById('taskTheme');
    if (!select) return;

    select.innerHTML = `
        <option value="">Selecione um tema</option>
        ${themes.map(theme => `
            <option value="${theme.id}">${theme.name}</option>
        `).join('')}
    `;
}

// Filter and sort tasks
function getFilteredTasks() {
    let filtered = [...tasks];

    // Filter by status
    if (currentFilter === 'active') {
        filtered = filtered.filter(t => !t.completed);
    } else if (currentFilter === 'completed') {
        filtered = filtered.filter(t => t.completed);
    }

    // Filter by theme
    if (currentThemeFilter !== 'all') {
        filtered = filtered.filter(t => t.themeId === currentThemeFilter);
    }

    // Filter by priority
    if (currentPriorityFilter !== 'all') {
        filtered = filtered.filter(t => t.priority === currentPriorityFilter);
    }

    // Search
    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(t => 
            t.title.toLowerCase().includes(query) ||
            (t.description && t.description.toLowerCase().includes(query))
        );
    }

    // Sort
    if (currentSort === 'alphabetical') {
        filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else if (currentSort === 'date') {
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (currentSort === 'priority') {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        filtered.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    }

    return filtered;
}

// Render tasks
function renderTasks() {
    const container = document.getElementById('tasksList');
    if (!container) return;

    const filtered = getFilteredTasks();

    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>📝</p>
                <p>Nenhuma tarefa encontrada</p>
            </div>
        `;
        return;
    }

    container.innerHTML = filtered.map(task => {
        const theme = themes.find(t => t.id === task.themeId);
        const priorityClass = `priority-${task.priority}`;
        const priorityLabel = {
            low: 'Baixa',
            medium: 'Média',
            high: 'Alta'
        }[task.priority];

        return `
            <div class="task-card ${task.completed ? 'completed' : ''}" 
                 onclick="openEditModal('${task.id}')">
                <input type="checkbox" 
                       class="task-checkbox" 
                       ${task.completed ? 'checked' : ''}
                       onclick="event.stopPropagation(); toggleTask('${task.id}')"
                       onchange="toggleTask('${task.id}')">
                <div class="task-content">
                    <div class="task-header">
                        <span class="task-title">${task.title}</span>
                        <span class="priority-badge ${priorityClass}">${priorityLabel}</span>
                        ${theme ? `<span style="color: ${theme.color};">● ${theme.name}</span>` : ''}
                    </div>
                    ${task.description ? `<p class="task-description">${task.description}</p>` : ''}
                    <div class="task-meta">
                        ${task.date ? `<span>📅 ${formatDate(task.date)}</span>` : ''}
                        ${task.time ? `<span>⏰ ${task.time}</span>` : ''}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Format date to DD/MM
function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${day}/${month}`;
}

// Toggle task completion
async function toggleTask(taskId) {
    try {
        const task = tasks.find(t => t.id === taskId);
        const response = await fetch(`${API_URL}/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${getToken()}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...task,
                completed: !task.completed,
            }),
        });

        if (!response.ok) {
            throw new Error('Erro ao atualizar tarefa');
        }

        await loadTasks();
    } catch (error) {
        console.error('Erro ao atualizar tarefa:', error);
        alert('Erro ao atualizar tarefa');
    }
}

// Filter functions
function filterByStatus(status) {
    currentFilter = status;
    document.querySelectorAll('.filter-group .filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    renderTasks();
}

function filterByTheme(themeId) {
    currentThemeFilter = themeId;
    renderThemeFilters();
    renderTasks();
}

function filterByPriority(priority) {
    currentPriorityFilter = priority;
    document.querySelectorAll('#priorityFilters .filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    renderTasks();
}

function handleSearch(query) {
    searchQuery = query;
    renderTasks();
}

function handleSort(sortBy) {
    currentSort = sortBy;
    renderTasks();
}

// Modal functions
function openNewTaskModal() {
    editingTaskId = null;
    document.getElementById('modalTitle').textContent = 'Nova Tarefa';
    document.getElementById('taskForm').reset();
    document.getElementById('deleteTaskBtn').style.display = 'none';
    document.getElementById('taskModal').style.display = 'flex';
}

function openEditModal(taskId) {
    editingTaskId = taskId;
    const task = tasks.find(t => t.id === taskId);
    
    document.getElementById('modalTitle').textContent = 'Editar Tarefa';
    document.getElementById('taskTitle').value = task.title;
    document.getElementById('taskDescription').value = task.description || '';
    document.getElementById('taskTheme').value = task.themeId || '';
    document.getElementById('taskPriority').value = task.priority;
    document.getElementById('taskDate').value = task.date || '';
    document.getElementById('taskTime').value = task.time || '';
    document.getElementById('deleteTaskBtn').style.display = 'block';
    document.getElementById('taskModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('taskModal').style.display = 'none';
    editingTaskId = null;
}

// Save task
async function saveTask(e) {
    e.preventDefault();

    const taskData = {
        title: document.getElementById('taskTitle').value,
        description: document.getElementById('taskDescription').value,
        themeId: document.getElementById('taskTheme').value || null,
        priority: document.getElementById('taskPriority').value,
        date: document.getElementById('taskDate').value || null,
        time: document.getElementById('taskTime').value || null,
        completed: false,
    };

    try {
        if (editingTaskId) {
            // Update existing task
            const response = await fetch(`${API_URL}/tasks/${editingTaskId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${getToken()}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(taskData),
            });

            if (!response.ok) {
                throw new Error('Erro ao atualizar tarefa');
            }
        } else {
            // Create new task
            const response = await fetch(`${API_URL}/tasks`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${getToken()}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(taskData),
            });

            if (!response.ok) {
                throw new Error('Erro ao criar tarefa');
            }
        }

        closeModal();
        await loadTasks();
    } catch (error) {
        console.error('Erro ao salvar tarefa:', error);
        alert('Erro ao salvar tarefa');
    }
}

// Delete task
async function deleteTask() {
    if (!confirm('Tem certeza que deseja excluir esta tarefa?')) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/tasks/${editingTaskId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${getToken()}`,
            },
        });

        if (!response.ok) {
            throw new Error('Erro ao excluir tarefa');
        }

        closeModal();
        await loadTasks();
    } catch (error) {
        console.error('Erro ao excluir tarefa:', error);
        alert('Erro ao excluir tarefa');
    }
}

// Setup event listeners
function setupEventListeners() {
    // Search
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => handleSearch(e.target.value));
    }

    // Sort
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => handleSort(e.target.value));
    }

    // Task form
    const taskForm = document.getElementById('taskForm');
    if (taskForm) {
        taskForm.addEventListener('submit', saveTask);
    }

    // Close modal on background click
    const modal = document.getElementById('taskModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
}

// Mobile menu toggle
function toggleMenu() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('active');
}
