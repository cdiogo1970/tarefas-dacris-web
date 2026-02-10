const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'tarefas-cris-secret-key-2026';

// Middleware
app.use(cors({
    origin: [
        'https://tarefas-cris-web.onrender.com',
        'http://localhost:8080',
        /\.onrender\.com$/
    ],
    credentials: true
}));
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// In-memory database (replace with real database in production)
const db = {
    users: [],
    tasks: [],
    themes: [],
};

// Auth middleware
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token não fornecido' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Token inválido' });
        }
        req.user = user;
        next();
    });
}

// ============================================
// AUTH ROUTES
// ============================================

// Register
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
        }

        // Check if user exists
        const existingUser = db.users.find(u => u.email === email);
        if (existingUser) {
            return res.status(400).json({ message: 'Email já cadastrado' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = {
            id: uuidv4(),
            name,
            email,
            password: hashedPassword,
            createdAt: new Date().toISOString(),
        };

        db.users.push(user);

        // Create default themes for new user
        const defaultThemes = [
            { id: uuidv4(), userId: user.id, name: 'Trabalho', color: '#0a7ea4' },
            { id: uuidv4(), userId: user.id, name: 'Pessoal', color: '#22C55E' },
            { id: uuidv4(), userId: user.id, name: 'Estudos', color: '#F59E0B' },
        ];
        db.themes.push(...defaultThemes);

        // Generate token
        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);

        res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email } });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'Erro ao criar conta' });
    }
});

// Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: 'Email e senha são obrigatórios' });
        }

        // Find user
        const user = db.users.find(u => u.email === email);
        if (!user) {
            return res.status(401).json({ message: 'Email ou senha incorretos' });
        }

        // Check password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Email ou senha incorretos' });
        }

        // Generate token
        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);

        res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Erro ao fazer login' });
    }
});

// Get current user
app.get('/api/auth/me', authenticateToken, (req, res) => {
    const user = db.users.find(u => u.id === req.user.id);
    if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    res.json({ id: user.id, name: user.name, email: user.email });
});

// ============================================
// TASKS ROUTES
// ============================================

// Get all tasks
app.get('/api/tasks', authenticateToken, (req, res) => {
    const userTasks = db.tasks.filter(t => t.userId === req.user.id);
    res.json(userTasks);
});

// Create task
app.post('/api/tasks', authenticateToken, (req, res) => {
    const { title, description, themeId, priority, date, time } = req.body;

    if (!title) {
        return res.status(400).json({ message: 'Título é obrigatório' });
    }

    const task = {
        id: uuidv4(),
        userId: req.user.id,
        title,
        description: description || '',
        themeId: themeId || null,
        priority: priority || 'medium',
        date: date || null,
        time: time || null,
        completed: false,
        createdAt: new Date().toISOString(),
    };

    db.tasks.push(task);
    res.status(201).json(task);
});

// Update task
app.put('/api/tasks/:id', authenticateToken, (req, res) => {
    const taskIndex = db.tasks.findIndex(t => t.id === req.params.id && t.userId === req.user.id);
    
    if (taskIndex === -1) {
        return res.status(404).json({ message: 'Tarefa não encontrada' });
    }

    const { title, description, themeId, priority, date, time, completed } = req.body;

    db.tasks[taskIndex] = {
        ...db.tasks[taskIndex],
        title: title !== undefined ? title : db.tasks[taskIndex].title,
        description: description !== undefined ? description : db.tasks[taskIndex].description,
        themeId: themeId !== undefined ? themeId : db.tasks[taskIndex].themeId,
        priority: priority !== undefined ? priority : db.tasks[taskIndex].priority,
        date: date !== undefined ? date : db.tasks[taskIndex].date,
        time: time !== undefined ? time : db.tasks[taskIndex].time,
        completed: completed !== undefined ? completed : db.tasks[taskIndex].completed,
    };

    res.json(db.tasks[taskIndex]);
});

// Delete task
app.delete('/api/tasks/:id', authenticateToken, (req, res) => {
    const taskIndex = db.tasks.findIndex(t => t.id === req.params.id && t.userId === req.user.id);
    
    if (taskIndex === -1) {
        return res.status(404).json({ message: 'Tarefa não encontrada' });
    }

    db.tasks.splice(taskIndex, 1);
    res.json({ message: 'Tarefa excluída com sucesso' });
});

// ============================================
// THEMES ROUTES
// ============================================

// Get all themes
app.get('/api/themes', authenticateToken, (req, res) => {
    const userThemes = db.themes.filter(t => t.userId === req.user.id);
    res.json(userThemes);
});

// Create theme
app.post('/api/themes', authenticateToken, (req, res) => {
    const { name, color } = req.body;

    if (!name || !color) {
        return res.status(400).json({ message: 'Nome e cor são obrigatórios' });
    }

    const theme = {
        id: uuidv4(),
        userId: req.user.id,
        name,
        color,
    };

    db.themes.push(theme);
    res.status(201).json(theme);
});

// Update theme
app.put('/api/themes/:id', authenticateToken, (req, res) => {
    const themeIndex = db.themes.findIndex(t => t.id === req.params.id && t.userId === req.user.id);
    
    if (themeIndex === -1) {
        return res.status(404).json({ message: 'Tema não encontrado' });
    }

    const { name, color } = req.body;

    db.themes[themeIndex] = {
        ...db.themes[themeIndex],
        name: name !== undefined ? name : db.themes[themeIndex].name,
        color: color !== undefined ? color : db.themes[themeIndex].color,
    };

    res.json(db.themes[themeIndex]);
});

// Delete theme
app.delete('/api/themes/:id', authenticateToken, (req, res) => {
    const themeIndex = db.themes.findIndex(t => t.id === req.params.id && t.userId === req.user.id);
    
    if (themeIndex === -1) {
        return res.status(404).json({ message: 'Tema não encontrado' });
    }

    db.themes.splice(themeIndex, 1);
    res.json({ message: 'Tema excluído com sucesso' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
