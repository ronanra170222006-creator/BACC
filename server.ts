import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
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

  // Return user representation without secret hash
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
    // Re-create user if missing in backend due to container restarts, ensuring seamless experience
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
    // If the user exists, save the password hash for simplified auth but keep their original status/plan!
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
    // Re-create user if missing in backend due to container restarts, ensuring seamless experience
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

  // Update payment info
  users[userIndex].plan = plan;
  users[userIndex].refSms = refSms.trim();
  users[userIndex].status = 'pending'; // In wait validation

  writeUsers(users);

  const { passwordHash, ...safeUser } = users[userIndex];
  res.json(safeUser);
});

// --------------------------------------------------------------------------
// ADMIN API
// --------------------------------------------------------------------------

// Validate admin helper
function isValidAdmin(adminId: any, adminPass: any) {
  return adminId === 'Ratsimazafy' && adminPass === '17022006';
}

// Get all students
app.get('/api/admin/users', (req, res) => {
  const { adminId, adminPass } = req.query;

  if (!isValidAdmin(adminId, adminPass)) {
    return res.status(401).json({ error: 'Identification administrateur incorrecte.' });
  }

  const users = readUsers();
  // Safe mapping
  const safeUsers = users.map(({ passwordHash, ...u }) => u);
  res.json(safeUsers);
});

// Validate student payment
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

// Reset database for developer quick testing
app.post('/api/admin/reset', (req, res) => {
  const { adminId, adminPass } = req.body;

  if (!isValidAdmin(adminId, adminPass)) {
    return res.status(401).json({ error: 'Identification administrateur incorrecte.' });
  }

  writeUsers([]);
  res.json({ success: true });
});

// --------------------------------------------------------------------------
// GEMINI INTELLIGENT BACC TUTOR
// --------------------------------------------------------------------------

let aiClient: GoogleGenAI | null = null;

function hasValidApiKey(): boolean {
  const key = process.env.GEMINI_API_KEY;
  return !!(key && !key.includes("MY_GEMINI_API_KEY") && key.trim() !== "");
}

function hasValidOpenAiKey(): boolean {
  const key = process.env.OPENAI_API_KEY;
  return !!(key && !key.includes("MY_OPENAI_API_KEY") && key.trim() !== "");
}

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key || key.includes("MY_GEMINI_API_KEY")) {
      throw new Error("La clé d'API de Google Gemini (GEMINI_API_KEY) n'est pas configurée dans les Secrets d'AI Studio.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

function generateMockTutorResponse(message: string, contextLessonId?: string): string {
  const norm = message.toLowerCase().trim();
  
  // Custom indicator that the key is missing but the AI falling back gracefully
  const disclaimer = "\n\n*(Note du Tuteur : La clé d'API de Google Gemini n'est pas configurée dans les Secrets, ainsi je fonctionne en mode d'assistant local intelligent pour vous accompagner sans interruption).*";
  
  if (contextLessonId) {
    const lesson = baccLessons.find(l => l.id === contextLessonId);
    if (lesson) {
      return `Bonjour ! En tant que Tuteur BACC, j'analyse ta question concernant le cours **"${lesson.title}"** (${lesson.category}).
      
Voici les points clés indispensables pour le BACC :
${lesson.keyPoints.map(kp => `- ${kp}`).join('\n')}

Pour réussir tes exercices, voici les formules à appliquer :
${lesson.keyFormulas.map(kf => `- $${kf}$`).join('\n')}

**Conseil de méthodologie :** 
Commence par bien relire l'énoncé, identifie les hypothèses données, écris la formule correspondante et résous l'équation étape par étape. N'hésite pas à me poser une question précise sur un calcul de ce chapitre !${disclaimer}`;
    }
  }

  // Keywords matching
  if (norm.includes('complex') || norm.includes('imaginaire') || norm.includes('module') || norm.includes('euler')) {
    return `Bonjour ! Pour ton exercice sur les **Nombres Complexes** (Séries C, D, S, Technique), garde en tête la structure suivante :
    
1. **Forme algébrique** : $z = a + ib$ (où $a$ est réel et $b$ est imaginaire).
2. **Formule de Moivre** : $(\\cos \\theta + i \\sin \\theta)^n = \\cos(n\\theta) + i \\sin(n\\theta)$.
3. **Formules d'Euler** : Utiles pour la linéarisation des fonctions trigonométriques.

**Exemple d'exercice résolu au BACC :**
Trouver le module de $z = 3 + 3i$.
- $|z| = \\sqrt{3^2 + 3^2} = \\sqrt{18} = 3\\sqrt{2}$.
- Argument $\\theta$ : $\\cos\\theta = 3/(3\\sqrt{2}) = 1/\\sqrt{2} = \\frac{\\sqrt{2}}{2}$ et $\\sin\\theta = \\frac{\\sqrt{2}}{2}$, d'où $\\theta = \\frac{\\pi}{4} \\pmod{2\\pi}$.

Quelle est l'équation ou la transformation géométrique exacte qui te pose problème ?${disclaimer}`;
  }

  if (norm.includes('suite') || norm.includes('somme') || norm.includes('limite') || norm.includes('arithmétique') || norm.includes('géométrique')) {
    return `Bonjour ! Les **Suites Numériques** sont un triptyque classique du BACC (Séries A1, A2, C, D, OSE, S, L, Technique).

Pour les **Suites Arithmétiques** :
- Terme général : $u_n = u_0 + nr$
- Somme : $S_n = (\\text{Nombre de termes}) \\times \\frac{u_{\\text{premier}} + u_{\\text{dernier}}}{2}$

Pour les **Suites Géométriques** :
- Terme général : $v_n = v_0 \\times q^n$
- Somme : $S_n = v_0 \\times \\frac{1 - q^{n+1}}{1 - q}$ (pour $q \\neq 1$)

Dis-moi, as-tu besoin d'aide pour montrer qu'une suite est géométrique, ou pour calculer sa limite de convergence ?${disclaimer}`;
  }

  if (norm.includes('philo') || norm.includes('etat') || norm.includes('justice') || norm.includes('philosophie') || norm.includes('rousseau') || norm.includes('hobbes')) {
    return `Salutations ! En **Philosophie**, l'étude de **l'État et de la Justice** constitue un axe majeur du BACC malgache.

Voici un plan de dissertation type pour t'entraîner :
- **Thèse 1 (Hobbes)** : L'État est le garant de la justice. Sans État (l'état de nature), l'homme vit sous la loi de la jungle (« l'homme est un loup pour l'homme »).
- **Antithèse 2 (Marx / Nietzsche)** : L'État peut être un instrument d'exploitation ou de contrainte. Marx le considère comme l'outil de la classe bourgeoise dominante pour opprimer le prolétariat.
- **Synthèse** : La vraie justice réside dans l'harmonie entre les lois civiles de l'État et l'éthique morale des citoyens.

As-tu besoin d'une explication sur un auteur spécifique comme Rousseau (*Contrat Social*) ou d'une aide à la rédaction de ton introduction ?${disclaimer}`;
  }

  if (norm.includes('physique') || norm.includes('chimie') || norm.includes('cinétique') || norm.includes('concentration') || norm.includes('newton')) {
    return `Bonjour ! En **Physique-Chimie**, la rigueur est payante au BACC. 
    
**Rappels essentiels :**
- **Cinématique / Dynamique (Lois de Newton)** : La somme des forces extérieures est égale au produit de la masse par l'accélération $\\sum \\vec{F} = m \\cdot \\vec{a}$.
- **Chimie des solutions** : pH d'une solution acide forte $pH = -\\log[H_3O^+]$ et produit ionique de l'eau $Ke = [H_3O^+][OH^-] = 10^{-14}$ à $25^{\\circ} C$.

Quel exercice ou paragraphe de cours souhaites-tu que nous résolvions ensemble, étape par étape ?${disclaimer}`;
  }

  // Malagasy response helper
  if (norm.includes('miarahaba') || norm.includes('salama') || norm.includes('fianarana') || norm.includes('akory') || norm.includes('manao ahoana')) {
    return `Miarahaba anao ! Vonona tanteraka aho hanampy anao amin'ny famerenana ny taranja rehetra (Mathématiques, Physique, SVT, Philosophie, tantara sy jeografia, Malagasy...).

**Ny fianarana tokoa no lovatsara indrindra !** 

Inona ny taranja na lesona tianao harahina androany ? Afaka manontany ahy mivantana momba ny lohahevitra sarotra aminao ianao mba hahazoanao ny fomba famahana azy etape par etape.${disclaimer}`;
  }

  // Default response
  return `Bonjour ! Je suis ton **Tuteur IA dédié au BACC 2026**. 

Je suis là pour t'expliquer les cours officiels de Madagascar, te donner des astuces méthodologiques, et t'aider à comprendre les sujets types de façon interactive et progressive.

**Comment procéder ?**
1. Choisis un cours ou un sujet dans les onglets de l'application.
2. Pose-moi une question sur une formule, une définition, ou un paragraphe qui te semble difficile.
3. Je te guiderai pas à pas sans te donner bêtement la réponse !

Que révisons-nous aujourd'hui ? (Maths, Philosophie, Physiques-Chimie, SVT...)${disclaimer}`;
}

app.post('/api/gemini/explain', async (req, res) => {
  const { email, message, history, contextLessonId, contextSubjectId, images, model } = req.body;

  if (!email || !message) {
    return res.status(400).json({ error: "Email et message requis pour le tuteur IA." });
  }

  // 1. Verify user is validated before answering
  const users = readUsers();
  let user = users.find(u => u.email === email.toLowerCase().trim());
  if (!user) {
    // Re-create user if missing in backend due to container restarts, ensuring seamless experience but as pending
    user = {
      id: `student_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      email: email.toLowerCase().trim(),
      name: email.toLowerCase().trim().split('@')[0],
      phone: '0340000000',
      passwordHash: 'dummy',
      plan: null,
      refSms: '',
      status: 'pending'
    };
    users.push(user);
    writeUsers(users);
    return res.status(403).json({ error: "Votre compte n'est pas encore activé. Veuillez vous acquitter de votre abonnement." });
  }

  if (user.status !== 'validated') {
    return res.status(403).json({ error: "Votre compte n'est pas encore validé par l'administration. Veuillez patienter ou contacter le support." });
  }

  // Set streaming headers
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });

  const streamStringResponse = async (text: string) => {
    // Send in chunks of ~12 chars every 8ms to simulate fast typing
    const chunks = text.match(/.{1,12}/g) || [text];
    for (const chunk of chunks) {
      res.write(`data: ${JSON.stringify({ text: chunk })}\n\n`);
      await new Promise(resolve => setTimeout(resolve, 8));
    }
    res.write(`data: [DONE]\n\n`);
    res.end();
  };

  // Prepare custom context injecting BACC lesson program knowledge
  let courseSummarySnippet = '';
  if (contextLessonId) {
    const lesson = baccLessons.find(l => l.id === contextLessonId);
    if (lesson) {
      courseSummarySnippet = `L'élève étudie actuellement le chapitre de cours suivant : "${lesson.title}" (${lesson.category}). Voici le contenu de révision : \n${lesson.content}\n`;
    }
  } else if (contextSubjectId) {
    const subject = baccSubjects.find((s: any) => s.id === contextSubjectId);
    if (subject) {
      courseSummarySnippet = `L'élève étudie actuellement le sujet d'examen officiel de Madagascar suivant : "${subject.name}" (Série ${subject.series}, Année ${subject.year}, Matière ${subject.category}).\nVoici le texte intégral de ce sujet pour que tu puisses l'aider à le résoudre :\n${subject.content}\nS'il te plaît, traite l'intégralité du sujet demandé en lui donnant la bonne réponse, la méthode pas à pas, et les formules détaillées.`;
    }
  }

  const systemInstruction = `
Tu es le "Tuteur IA du BACC" officiel pour Madagascar en l'année 2026 (répondant sous le modèle de reponse ${model === 'chatgpt' ? 'ChatGPT (GPT-4o-mini)' : 'Google Gemini 3.5 Flash'}).
Ton rôle est d'accompagner l'étudiant de Terminale pas à pas dans ses révisions, de répondre à ses questions de cours et de traiter en intégralité ses devoirs ou exercices qu'il t'envoie, que ce soit par écrit ou par photo de sujet.

CONSIGNES PARTICULIÈRES :
1. TRAITE LE DEVOIR ET LES EXERCICES : Si l'étudiant te demande de résoudre ou traiter le devoir/sujet d'examen (y compris d'après une photo envoyée), tu dois résoudre complètement les différents calculs, exercices ou questions, étape par étape, en donnant l'intégralité de la correction correcte et détaillée avec les bons résultats.
2. Utilise le programme officiel des lycées de Madagascar pour orienter tes explications (Mathématiques séries A/C/D, Physique-Chimie, Histoire-Géographie coloniale de de 1896, 1947 à 1960, Philosophie, etc.).
3. Réponds de façon encourageante, pédagogique, avec des termes compréhensibles, en insistant sur la logique et la déduction.
4. Écris les calculs proprement (au format LaTeX ou texte clair bien espacé).
5. Tu t'exprimes en français (ou malgache s'il te salue ou te pose des questions en malgache "Miarahaba", "Salama", etc.).

${courseSummarySnippet}
`;

  // --- MODEL BRANCH: CHATGPT (OPENAI) ---
  if (model === 'chatgpt') {
    if (!hasValidOpenAiKey()) {
      let mockReply = `[Note du Tuteur - ChatGPT Hors Ligne]\n\nPour activer l'analyse active par **ChatGPT (GPT-4o-mini)**, veuillez configurer la clé d'API \`OPENAI_API_KEY\` dans le panneau de Secrets d'AI Studio.\n\nEn attendant que le développeur ajoute l'API Key, voici une explication de principe tirée de notre base méthode locale :\n\n${generateMockTutorResponse(message, contextLessonId)}`;
      if (images && images.length > 0) {
        mockReply = `[Analyse d'images - ChatGPT local]\nJ'ai reçu tes ${images.length} photo(s). Quand l'API Key OpenAI sera configurée, je pourrai faire l'analyse visuelle réelle.\n\nVoici ce que nous pouvons faire d'ici là :\n${mockReply}`;
      }
      return streamStringResponse(mockReply);
    }

    try {
      const openaiMessages: any[] = [
        { role: 'system', content: systemInstruction }
      ];

      for (const msg of (history || [])) {
        openaiMessages.push({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.text
        });
      }

      // Format current user query with images
      if (images && Array.isArray(images) && images.length > 0) {
        const contentParts: any[] = [{ type: 'text', text: message }];
        for (const img of images) {
          let base64Data = img.data || '';
          if (base64Data.includes(';base64,')) {
            base64Data = base64Data.split(';base64,')[1];
          }
          contentParts.push({
            type: 'image_url',
            image_url: {
              url: `data:${img.mimeType || 'image/jpeg'};base64,${base64Data}`
            }
          });
        }
        openaiMessages.push({ role: 'user', content: contentParts });
      } else {
        openaiMessages.push({ role: 'user', content: message });
      }

      const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: openaiMessages,
          stream: true
        })
      });

      if (!openaiResponse.ok) {
        const errorText = await openaiResponse.text();
        throw new Error(`OpenAI API returned status ${openaiResponse.status}: ${errorText}`);
      }

      const reader = openaiResponse.body?.getReader();
      if (!reader) {
        throw new Error("Impossible d'obtenir un décodeur de flux OpenAI.");
      }

      const decoder = new TextDecoder('utf-8');
      let incompleteLine = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunkText = decoder.decode(value, { stream: true });
        const combined = incompleteLine + chunkText;
        const lines = combined.split('\n');
        
        incompleteLine = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;
          if (trimmed.startsWith('data: ')) {
            const dataStr = trimmed.slice(6).trim();
            if (dataStr === '[DONE]') continue;
            try {
              const parsed = JSON.parse(dataStr);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                res.write(`data: ${JSON.stringify({ text: content })}\n\n`);
              }
            } catch (e) {
              // Ignore partial chunk syntax errors
            }
          }
        }
      }

      res.write(`data: [DONE]\n\n`);
      return res.end();

    } catch (error: any) {
      console.error("OpenAI API Exception, falling back locally:", error);
      const mockReply = `⚠️ [Problème ChatGPT] Impossible d'interroger la clé d'API OpenAI pour le moment.\n\n${generateMockTutorResponse(message, contextLessonId)}`;
      return streamStringResponse(mockReply);
    }
  }

  // --- MODEL BRANCH: GEMINI (DEFAULT) ---
  if (!hasValidApiKey()) {
    let mockReply = generateMockTutorResponse(message, contextLessonId);
    if (images && images.length > 0) {
      mockReply = `[Analyse d'images] J'ai bien reçu tes ${images.length} photo(s). En tant que conseiller BACC en local, je détecte que tu as besoin que je t'explique et que je résolve cet exercice.\n\nVoici une correction de principe :\n1. Écris l'équation de base liée au problème de ton image.\n2. Remplace par les valeurs réelles fournies dans l'énoncé.\n3. Rédige l'étape de calcul intermédiaire et vérifie l'unité de mesure !\n\n*Configure ta clé d'API Google Gemini dans l'onglet des Secrets pour obtenir l'analyse visuelle réelle par l'IA.*\n\n${mockReply}`;
    }
    return streamStringResponse(mockReply);
  }

  try {
    const ai = getAiClient();

    // Fill chat history
    const contents: any[] = [];
    for (const msg of (history || [])) {
      contents.push({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      });
    }

    // Build the final turn parts (with images + text prompt)
    const finalParts: any[] = [];
    if (images && Array.isArray(images) && images.length > 0) {
      for (const img of images) {
        let base64Data = img.data || '';
        if (base64Data.includes(';base64,')) {
          base64Data = base64Data.split(';base64,')[1];
        }
        finalParts.push({
          inlineData: {
            mimeType: img.mimeType || 'image/jpeg',
            data: base64Data
          }
        });
      }
    }
    
    finalParts.push({ text: message });

    contents.push({
      role: 'user',
      parts: finalParts
    });

    // Call generateContentStream with system instruction
    const responseStream = await ai.models.generateContentStream({
      model: 'gemini-3.5-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    for await (const chunk of responseStream) {
      if (chunk.text) {
        res.write(`data: ${JSON.stringify({ text: chunk.text })}\n\n`);
      }
    }
    res.write(`data: [DONE]\n\n`);
    res.end();

  } catch (error: any) {
    console.error("Gemini API Error, falling back to local assistant:", error);
    const mockReply = generateMockTutorResponse(message, contextLessonId);
    await streamStringResponse(mockReply);
  }
});

// --------------------------------------------------------------------------
// VITE DEV SERVER AND STATIC FILE ROUTING
// --------------------------------------------------------------------------

async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`BACC Revision Server booted up successfully.`);
    console.log(`Access at: http://0.0.0.0:${PORT}`);
    console.log(`Database connected locally at: ${DB_PATH}`);
  });
}

start();
