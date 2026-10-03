/**
 * PARUL UNIVERSITY ERP - REAL-TIME GATEWAY & API SERVER
 * Express HTTP + WebSocket Server for Real-Time Change Data Capture (CDC) Sync.
 */

const express = require('express');
const http = require('http');
const path = require('path');
const { WebSocketServer, WebSocket } = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const PORT = process.env.PORT || 3000;

// Middleware: Disable browser caching to ensure live CSS/JS edits take effect immediately
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');
  next();
});

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'), {
  etag: false,
  lastModified: false,
  maxAge: 0
}));

// In-Memory Server State & Student Login Directory
const serverState = {
  students: [
    {
      id: "std-1",
      enrollmentNo: "210303105001",
      rollNo: "CSE-21-001",
      name: "Aarav Mehta",
      email: "aarav.mehta@paruluniversity.ac.in",
      password: "password123",
      altPassword: "Student@123",
      section: "6A",
      role: "STUDENT"
    },
    {
      id: "std-2",
      enrollmentNo: "210303105002",
      rollNo: "CSE-21-002",
      name: "Diya Sharma",
      email: "diya.sharma@paruluniversity.ac.in",
      password: "password123",
      altPassword: "Student@123",
      section: "6A",
      role: "STUDENT"
    },
    {
      id: "std-3",
      enrollmentNo: "210303105003",
      rollNo: "CSE-21-003",
      name: "Rohan Patel",
      email: "rohan.patel@paruluniversity.ac.in",
      password: "password123",
      altPassword: "Student@123",
      section: "6A",
      role: "STUDENT"
    },
    {
      id: "std-4",
      enrollmentNo: "210303105004",
      rollNo: "CSE-21-004",
      name: "Ananya Iyer",
      email: "ananya.iyer@paruluniversity.ac.in",
      password: "password123",
      section: "6B",
      role: "STUDENT"
    },
    {
      id: "std-5",
      enrollmentNo: "210303105005",
      rollNo: "CSE-21-005",
      name: "Kabir Verma",
      email: "kabir.verma@paruluniversity.ac.in",
      password: "password123",
      altPassword: "Student@123",
      section: "6B",
      role: "STUDENT"
    },
    {
      id: "std-6",
      enrollmentNo: "210303105099",
      rollNo: "CSE-21-006",
      name: "Pooja Desai",
      email: "pooja.desai@paruluniversity.ac.in",
      password: "password123",
      altPassword: "Student@123",
      section: "6B",
      role: "STUDENT"
    }
  ],
  faculties: [
    {
      id: "fac-5",
      employeeId: "PU-FAC-3012",
      name: "Mr. Pritam Samanta",
      email: "pritam.samanta@paruluniversity.ac.in",
      password: "password123",
      altPassword: "Faculty@123",
      designation: "Assistant Professor & Project Guide",
      department: "Computer Science & Engineering",
      role: "FACULTY",
      courses: ["CS601", "CS604"]
    },
    {
      id: "fac-6",
      employeeId: "PU-FAC-2045",
      name: "Prof. Jatin Morwal",
      email: "jatin.morwal@paruluniversity.ac.in",
      password: "password123",
      altPassword: "Faculty@123",
      designation: "Assistant Professor & Project Guide",
      department: "Computer Science & Engineering",
      role: "FACULTY",
      courses: ["CS602", "CS603"]
    },
    {
      id: "fac-1",
      employeeId: "PU-FAC-8821",
      name: "Dr. Rajesh Sharma",
      email: "rajesh.sharma@paruluniversity.ac.in",
      password: "password123",
      altPassword: "Faculty@123",
      designation: "Associate Professor & Senior Proctor",
      department: "Computer Science & Engineering",
      role: "FACULTY",
      courses: ["CS601", "CS605"]
    },
    {
      id: "fac-2",
      employeeId: "PU-FAC-4019",
      name: "Prof. Ananya Patel",
      email: "ananya.patel@paruluniversity.ac.in",
      password: "password123",
      altPassword: "Faculty@123",
      designation: "Assistant Professor",
      department: "Computer Science & Engineering",
      role: "FACULTY",
      courses: ["CS602"]
    },
    {
      id: "fac-3",
      employeeId: "PU-FAC-7102",
      name: "Dr. Vikramaditya Joshi",
      email: "vikram.joshi@paruluniversity.ac.in",
      password: "password123",
      altPassword: "Faculty@123",
      designation: "Professor",
      department: "Artificial Intelligence",
      role: "FACULTY",
      courses: ["CS603", "CS606"]
    },
    {
      id: "fac-4",
      employeeId: "PU-FAC-5520",
      name: "Prof. Sneha Kulkarni",
      email: "sneha.kulkarni@paruluniversity.ac.in",
      password: "password123",
      altPassword: "Faculty@123",
      designation: "Assistant Professor",
      department: "Information Technology",
      role: "FACULTY",
      courses: ["CS604"]
    }
  ],
  admins: [
    {
      id: "adm-1",
      adminId: "PU-ADM-001",
      name: "Dr. Ketan Kotecha",
      email: "admin@paruluniversity.ac.in",
      password: "password123",
      altPassword: "Admin@123",
      designation: "Chief Academic Administrator & Registrar",
      department: "Provost Office",
      role: "ADMIN"
    }
  ],
  attendanceUpdates: [],
  outpasses: [],
  auditLogs: [
    {
      id: "LOG-SERVER-1001",
      timestamp: new Date().toISOString(),
      actor: "System Gateway",
      role: "SYSTEM",
      action: "SERVER_STARTED",
      resource: `Parul University Gateway on port ${PORT}`,
      ip: "127.0.0.1",
      status: "SUCCESS"
    }
  ]
};

// WebSocket Real-time Event Hub
wss.on('connection', (ws, req) => {
  const clientIp = req.socket.remoteAddress;
  console.log(`[WebSocket] New client connected from ${clientIp}`);

  // Send initial welcome & handshake
  ws.send(JSON.stringify({
    type: 'CONNECTION_ESTABLISHED',
    message: 'Connected to Parul University SMIS Real-Time Event Hub',
    timestamp: new Date().toISOString()
  }));

  // Handle incoming broadcasts from clients (Faculty marking attendance, Admin publishing, etc.)
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message.toString());
      console.log(`[WebSocket Broadcast] Event Type: ${data.type} from ${data.senderRole || 'UNKNOWN'}`);

      // Broadcast to all connected clients (except sender)
      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(data));
        }
      });
    } catch (err) {
      console.error('[WebSocket Error] Failed to parse message:', err);
    }
  });

  ws.on('close', () => {
    console.log(`[WebSocket] Client disconnected (${clientIp})`);
  });
});

// REST API Endpoints

// 1. Health check & system state
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    system: 'Parul University Smart Management Information System Portal',
    activeConnections: wss.clients.size,
    timestamp: new Date().toISOString(),
    compliance: {
      inactivityTimeout: '1 Hour (3,600,000 ms)',
      accreditation: 'NAAC A++',
      cdcSync: 'Active'
    }
  });
});

// 2. Student Directory & Credentials API
app.get('/api/students', (req, res) => {
  res.json({
    count: serverState.students.length,
    students: serverState.students.map(s => ({
      id: s.id,
      enrollmentNo: s.enrollmentNo,
      rollNo: s.rollNo,
      name: s.name,
      email: s.email,
      defaultPassword: s.password
    }))
  });
});

// 3. Faculty Directory API
app.get('/api/faculties', (req, res) => {
  res.json({
    count: serverState.faculties.length,
    faculties: serverState.faculties.map(f => ({
      id: f.id,
      employeeId: f.employeeId,
      name: f.name,
      email: f.email,
      designation: f.designation,
      department: f.department,
      courses: f.courses
    }))
  });
});

// 4. Central Login Authentication Endpoint (Supports Student, Faculty, Admin)
app.post('/api/auth/login', (req, res) => {
  const { identifier, password, role = 'STUDENT' } = req.body;
  if (!identifier) {
    return res.status(400).json({ error: 'Identifier is required.' });
  }

  const clean = identifier.trim().toLowerCase();
  const upperRole = (role || 'STUDENT').toUpperCase();

  if (upperRole === 'FACULTY') {
    const match = serverState.faculties.find(f => 
      f.employeeId.toLowerCase() === clean || 
      f.email.toLowerCase() === clean ||
      f.name.toLowerCase() === clean
    );

    if (!match) {
      return res.status(401).json({ error: 'Faculty record not found. Please verify your Employee ID (e.g. PU-FAC-8821, PU-FAC-4019, PU-FAC-7102) or Email.' });
    }

    const validPwds = [match.password, match.altPassword, 'password123', 'Faculty@123', match.name.split(' ')[0] + '@123'];
    if (password && !validPwds.includes(password)) {
      return res.status(401).json({ error: `Invalid password for ${match.name}. Default is "${match.password}" or "Faculty@123"` });
    }

    return res.json({
      status: 'AUTHENTICATED',
      user: {
        id: match.id,
        role: 'FACULTY',
        name: match.name,
        email: match.email,
        employeeId: match.employeeId,
        designation: match.designation,
        department: match.department,
        courses: match.courses
      },
      token: `PU-JWT-${match.id}-${Date.now()}`
    });
  }

  if (upperRole === 'ADMIN') {
    const match = serverState.admins.find(a => 
      a.adminId.toLowerCase() === clean || 
      a.email.toLowerCase() === clean
    );

    if (!match) {
      return res.status(401).json({ error: 'Administrator record not found.' });
    }

    const validPwds = [match.password, match.altPassword, 'password123', 'Admin@123', 'admin123'];
    if (password && !validPwds.includes(password)) {
      return res.status(401).json({ error: 'Invalid password. Default is "Admin@123"' });
    }

    return res.json({
      status: 'AUTHENTICATED',
      user: {
        id: match.id,
        role: 'ADMIN',
        name: match.name,
        email: match.email,
        adminId: match.adminId,
        designation: match.designation,
        department: match.department
      },
      token: `PU-JWT-${match.id}-${Date.now()}`
    });
  }

  // Student Authentication
  const match = serverState.students.find(s => 
    s.enrollmentNo.toLowerCase() === clean || 
    s.email.toLowerCase() === clean ||
    s.rollNo.toLowerCase() === clean
  );

  if (!match) {
    return res.status(401).json({ error: 'Student record not found. Please verify your Enrollment Number or Email.' });
  }

  const validPwds = [match.password, match.altPassword, 'password123', 'Student@123', match.name.split(' ')[0] + '@123'];
  if (password && !validPwds.includes(password)) {
    return res.status(401).json({ error: `Invalid password. Default password is "${match.password}" or "Student@123"` });
  }

  res.json({
    status: 'AUTHENTICATED',
    user: {
      id: match.id,
      role: 'STUDENT',
      name: match.name,
      email: match.email,
      enrollmentNo: match.enrollmentNo,
      rollNo: match.rollNo
    },
    token: `PU-JWT-${match.id}-${Date.now()}`
  });
});

// 4. Fallback to index.html for SPA routes
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ [Error] Port ${PORT} is already in use by another process.`);
    console.error(`👉 Solutions:`);
    console.error(`   1. Stop the process holding port ${PORT}: Stop-Process -Name node -Force`);
    console.error(`   2. Or start on a different port: $env:PORT=3001; node server.js\n`);
    process.exit(1);
  } else {
    throw err;
  }
});

server.listen(PORT, () => {
  console.log(`================================================================`);
  console.log(`  PARUL UNIVERSITY SMIS PORTAL - LIVE GATEWAY`);
  console.log(`  Server Running at: http://localhost:${PORT}`);
  console.log(`  WebSocket Hub at:  ws://localhost:${PORT}`);
  console.log(`  Role Portals: /student, /faculty, /admin`);
  console.log(`  1-Hour Inactivity Monitor: ACTIVE`);
  console.log(`================================================================`);
});

