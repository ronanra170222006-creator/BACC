import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { baccLessons } from './src/lessonsData';
import { baccSubjects } from './src/subjectsData';

dotenv.config();

const app = express();
const PORT = 3000;

// Path to low-db style offline JSON state
const DB_PATH = path.join(process.cwd(), 'users_db.json');

// Initialize local DB file if it doesn't exist
if (!fs.existsSync(DB_PATH)) {
  fs.writeFileSync(DB_PATH, JSON.stringify([], null, 2), 'utf8');
}

// User helper persistence functions
interface DBUser {
  id: string;
  email: string;
  name: string;
  phone: string;
  passwordHash: string; // Stored simply for this revision applet
  plan: 'simple' | 'speciale' | null;
  refSms: string;
  status: 'pending' | 'validated';
}

function readUsers(): DBUser[] {
  try {
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading users database, resetting:", err);
    return [];
  }
}

function writeUsers(users: DBUser[]) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(users, null, 2), 'utf8');
  } catch (err) {
    console.error("Error writing users database:", err);
  }
}

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// --------------------------------------------------------------------------
// AUTH API
// --------------------------------------------------------------------------

// Register Regular Student
app.post('/api/auth/register', (req, res) => {
  const { name, email, phone, password } = req.body;

  if (!name || !email || !phone || !password) {
    return res.status(400).json({ error: 'Tous les champs requis sont obligatoires (Nom, Email, Téléphone, Mot de passe).' });
  }

  const normalizedEmail = email.toLowerCase().trim();
  const users = readUsers();

  if (users.some(u => u.email === normalizedEmail)) {
    return res.status(400).json({ error: 'Un compte avec cette adresse email existe déjà.' });
  }

  const newUser: DBUser = {
    id: `student_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    email: normalizedEmail,
    name,
    phone,
    passwordHash: password, // For simplification in this educational sandboxed model
    plan: null,
    refSms: '',
    status: 'pending' // Pending payment by default
  };

  users.push(newUser);
  writeUsers(users);

  const { passwordHash, ...safeUser } = newUser;
  res.json(safeUser);
});

// Login Regular Student
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email et Mot de passe requis.' });
  }

  const normalizedEmail = email.toLowerCase().trim();
  const users = readUsers();

  let user = users.find(u => u.email === normalizedEmail);
  if (!user) {
    user = {
      id: `student_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      email: normalizedEmail,
      name: normalizedEmail.split('@')[0],
      phone: '0340000000',
      passwordHash: password,
      plan: null,
      refSms: '',
      status: 'pending'
    };
    users.push(user);
    writeUsers(users);
  } else {
    let altered = false;
    if (user.passwordHash !== password) {
      user.passwordHash = password;
      altered = true;
    }
    if (altered) {
      writeUsers(users);
    }
  }

  const { passwordHash, ...safeUser } = user;
  res.json(safeUser);
});

// Get User Current Status
app.get('/api/user/status', (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: 'Paramètre email manquant.' });
  }

  const normalizedEmail = String(email).toLowerCase().trim();
  const users = readUsers();

  let user = users.find(u => u.email === normalizedEmail);
  if (!user) {
    user = {
      id: `student_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      email: normalizedEmail,
      name: normalizedEmail.split('@')[0],
      phone: '0340000000',
      passwordHash: 'dummy',
      plan: null,
      refSms: '',
      status: 'pending'
    };
    users.push(user);
    writeUsers(users);
  }

  const { passwordHash, ...safeUser } = user;
  res.json(safeUser);
});

// Submit Mobile Money Reference SMS
app.post('/api/user/submit-pay', (req, res) => {
  const { email, plan, refSms } = req.body;

  if (!email || !plan || !refSms) {
    return res.status(400).json({ error: 'Données de paiement incomplètes.' });
  }

  const normalizedEmail = email.toLowerCase().trim();
  const users = readUsers();

  const userIndex = users.findIndex(u => u.email === normalizedEmail);
  if (userIndex === -1) {
    return res.status(404).json({ error: 'Utilisateur non trouvé.' });
  }

  users[userIndex].plan = plan;
  users[userIndex].refSms = refSms.trim();
  users[userIndex].status = 'pending';

  writeUsers(users);

  const { passwordHash, ...safeUser } = users[userIndex];
  res.json(safeUser);
});

// --------------------------------------------------------------------------
// ADMIN API
// --------------------------------------------------------------------------

function isValidAdmin(adminId: any, adminPass: any) {
  return adminId === 'Ratsimazafy' && adminPass === '17022006';
}

app.get('/api/admin/users', (req, res) => {
  const { adminId, adminPass } = req.query;

  if (!isValidAdmin(adminId, adminPass)) {
    return res.status(401).json({ error: 'Identification administrateur incorrecte.' });
  }

  const users = readUsers();
  const safeUsers = users.map(({ passwordHash, ...u }) => u);
  res.json(safeUsers);
});

app.post('/api/admin/verify-user', (req, res) => {
  const { adminId, adminPass, userId } = req.body;

  if (!isValidAdmin(adminId, adminPass)) {
    return res.status(401).json({ error: 'Identification administrateur incorrecte.' });
  }

  if (!userId) {
    return res.status(400).json({ error: "Identifiant étudiant manquant." });
  }

  const users = readUsers();
  const userIndex = users.findIndex(u => u.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({ error: 'Étudiant introuvable.' });
  }

  users[userIndex].status = 'validated';
  writeUsers(users);

  const { passwordHash, ...safeUser } = users[userIndex];
  res.json({ success: true, user: safeUser });
});

app.post('/api/admin/reset', (req, res) => {
  const { adminId, adminPass } = req.body;

  if (!isValidAdmin(adminId, adminPass)) {
    return res.status(401).json({ error: 'Identification administrateur incorrecte.' });
  }

  writeUsers([]);
  res.json({ success: true });
});

// --------------------------------------------------------------------------
// VITE CLIENT INTEGRATION
// --------------------------------------------------------------------------

async function startServer() {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa'
  });

  app.use(vite.middlewares);

  app.listen(PORT, () => {
    console.log(`Server is running smoothly on http://localhost:${PORT}`);
  });
}

startServer();
