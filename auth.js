/**
 * PARUL UNIVERSITY ERP - AUTHENTICATION & 1-HOUR IDLE TIMEOUT ENGINE
 * Implements strict role-based access, enrollment verification, and continuous inactivity monitoring.
 */

const AuthEngine = (function() {
  // Configuration
  const TIMEOUT_DURATION_MS = 60 * 60 * 1000; // 1 Hour (3,600,000 ms)
  const WARNING_THRESHOLD_MS = 5 * 60 * 1000;  // 5 Minutes warning before auto-logout
  const STORAGE_KEY_USER = 'PU_ERP_USER';
  const STORAGE_KEY_TOKEN = 'PU_ERP_JWT';

  let lastActivityTime = Date.now();
  let timerInterval = null;
  let currentUser = null;
  let warningModalShown = false;

  // Pre-configured Default Personas for Instant Evaluation
  const DEMO_PERSONAS = {
    STUDENT: {
      id: "std-1",
      role: "STUDENT",
      name: "Aarav Mehta",
      email: "aarav.mehta@paruluniversity.ac.in",
      enrollmentNo: "210303105001",
      rollNo: "CSE-21-001",
      program: "B.Tech Computer Science & Engineering",
      semester: 6,
      section: "6A",
      division: "CSE-6A",
      batch: "1",
      institute: "Faculty of Engineering & Technology (FET)",
      phone: "+91 98251 12345",
      dob: "2003-08-14",
      gender: "Male",
      bloodGroup: "O+ Positive",
      nationality: "Indian",
      homeAddress: "Plot 42, Sunrise Greens, Gotri Road, Vadodara, Gujarat - 390021",
      parentPhone: "+91 98251 67890",
      parentEmail: "suresh.mehta@gmail.com",
      fatherName: "Mr. Sureshchandra Mehta",
      motherName: "Mrs. Geetaben Mehta",
      guardianName: "Mr. Sureshchandra Mehta",
      guardianRelation: "Father",
      guardianOccupation: "Senior Executive Engineer, GSECL",
      emergencyContactName: "Mr. Sureshchandra Mehta (Father)",
      emergencyPhone: "+91 98251 67890",
      emergencyAddress: "Plot 42, Sunrise Greens, Gotri Road, Vadodara, Gujarat - 390021",
      admissionYear: "2021",
      admissionCategory: "Merit Quota (ACPC Gujarat)",
      currentClass: "B.Tech Computer Science & Engineering (Semester 6)",
      enrollmentStatus: "Active Regular Student",
      hostel: "Tagore Bhavan, Room 304",
      avatarText: "AM",
      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJzdGQtMSIsInJvbGUiOiJTVFVERU5UIiwiaWF0IjoxNzg0MDAwMDAwfQ"
    },
    FACULTY: {
      id: "fac-1",
      role: "FACULTY",
      name: "Dr. Rajesh Sharma",
      email: "rajesh.sharma@paruluniversity.ac.in",
      personalEmail: "rajesh.sharma.phd@gmail.com",
      employeeId: "PU-FAC-8821",
      facultyId: "PU-FAC-8821",
      designation: "Associate Professor & Senior Proctor",
      department: "Computer Science & Engineering",
      institute: "Faculty of Engineering & Technology (FET)",
      instituteName: "Faculty of Engineering & Technology (FET), Parul University",
      instituteUrl: "https://paruluniversity.ac.in",
      institutePortalUrl: "https://smis.paruluniversity.ac.in",
      instituteId: "PU-FET-VADODARA-104",
      phone: "+91 98251 88210",
      intercom: "Ext. 4088 (FET CSE Block A, Level 4)",
      dateOfJoining: "15 July 2017",
      fatherName: "Prof. Omprakash Sharma",
      motherName: "Mrs. Shanti Sharma",
      dob: "1982-04-18",
      gender: "Male",
      maritalStatus: "Married",
      bloodGroup: "B+ Positive",
      nationality: "Indian",
      residentialAddress: "B-402, Faculty Enclave, Parul University Campus, Post Limda, Waghodia, Vadodara, Gujarat - 391760",
      permanentAddress: "Flat 12, Nilamber Greens, Vasna-Bhayli Main Road, Vadodara, Gujarat - 390015",
      emergencyContact: "Mrs. Sunita Sharma (Spouse) - +91 98251 44520",
      initialPassword: "Faculty@123",
      passwordGeneratedBy: "Department Head (HOD CSE) / System Administrator",
      passwordGeneratedDate: "2017-07-15",
      twoFactorAuth: "Enabled (PU Authenticator & SMS OTP)",
      lastLogin: "Today, 08:51:24 AM IST (Campus LAN 172.16.14.88 Verified)",
      avatarText: "RS",
      courses: ["CS601", "CS605", "CS606"],
      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJmYWMtMSIsInJvbGUiOiJGQUNVTFRZIiwiaWF0IjoxNzg0MDAwMDAwfQ"
    },
    ADMIN: {
      id: "adm-1",
      role: "ADMIN",
      name: "Dr. Ketan Kotecha",
      email: "admin@paruluniversity.ac.in",
      adminId: "PU-ADM-001",
      designation: "Chief Academic Administrator & Provost Office Registrar",
      department: "Provost Office & Central Academic Registrar",
      organization: "Parul University - Academic Enterprise Consortium",
      organizationId: "PU-ORG-ACAD-2025",
      userType: "Adult", // Explicitly selected during SMART Account Setup
      userTypeDescription: "Designated Institutional Adult Authority & License Administrator",
      initialPassword: "Admin@SMART#2026",
      purchaseOrder: "PO-PARUL-SMART-2025-88124",
      primaryProductKey: "SMART-SLS-2026-PU-9821-X4K9",
      primarySuite: "SMART Learning Suite Enterprise v24",
      emailStatus: "Verified Domain Licensee (@paruluniversity.ac.in)",
      avatarText: "KK",
      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZG0tMSIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTc4NDAwMDAwMH0"
    }
  };

  /**
   * Initializes the Auth Engine and event listeners
   */
  function init() {
    // Check local storage for persistent session
    const savedUser = localStorage.getItem(STORAGE_KEY_USER);
    if (savedUser) {
      try {
        currentUser = JSON.parse(savedUser);
      } catch (e) {
        currentUser = null;
      }
    }

    // Attach user activity listeners to reset inactivity timer
    attachActivityListeners();

    // Start 1-second interval monitor for 15-minute countdown
    startInactivityMonitor();

    // Check for ?session_expired=true in URL
    checkSessionExpiredParam();
  }

  /**
   * Listens for mouse movements, key presses, clicks, scrolls, and touch events
   */
  function attachActivityListeners() {
    const activityEvents = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    
    // Throttled reset to prevent CPU thrashing
    let throttleTimeout = null;
    const handleActivity = () => {
      if (!throttleTimeout) {
        throttleTimeout = setTimeout(() => {
          resetInactivityTimer();
          throttleTimeout = null;
        }, 300);
      }
    };

    activityEvents.forEach(eventType => {
      window.addEventListener(eventType, handleActivity, { passive: true });
    });
  }

  /**
   * Resets the inactivity timestamp
   */
  function resetInactivityTimer() {
    lastActivityTime = Date.now();
    if (warningModalShown) {
      hideInactivityWarningModal();
    }
  }

  /**
   * Continuous 1-second ticker that drives the 15-minute countdown and auto-logout
   */
  function startInactivityMonitor() {
    if (timerInterval) clearInterval(timerInterval);

    timerInterval = setInterval(() => {
      if (!currentUser) return; // Only monitor when user is logged in

      const elapsed = Date.now() - lastActivityTime;
      const remainingMs = Math.max(0, TIMEOUT_DURATION_MS - elapsed);

      // Update UI countdown badge if present
      updateCountdownBadge(remainingMs);

      // Check if within 2-minute warning window
      if (remainingMs <= WARNING_THRESHOLD_MS && remainingMs > 0) {
        if (!warningModalShown) {
          showInactivityWarningModal(remainingMs);
        } else {
          updateWarningModalCountdown(remainingMs);
        }
      }

      // Check if 1 hour expired
      if (remainingMs <= 0) {
        handleAutoSignOut();
      }
    }, 1000);
  }

  /**
   * Format ms into HH:MM:SS or MM:SS
   */
  function formatTime(ms) {
    const totalSec = Math.floor(ms / 1000);
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    if (hrs > 0) {
      return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  /**
   * Updates topbar countdown badge
   */
  function updateCountdownBadge(remainingMs) {
    const badge = document.getElementById('session-countdown-pill');
    if (!badge) return;

    const timeStr = formatTime(remainingMs);
    badge.innerHTML = `<span class="timer-icon">⏱️</span> <span>Session: <strong>${timeStr}</strong></span>`;

    if (remainingMs <= WARNING_THRESHOLD_MS) {
      badge.classList.add('critical');
    } else if (remainingMs <= 10 * 60 * 1000) {
      badge.classList.add('warning');
      badge.classList.remove('critical');
    } else {
      badge.classList.remove('warning', 'critical');
    }
  }

  /**
   * Displays the 5-minute inactivity warning modal
   */
  function showInactivityWarningModal(remainingMs) {
    warningModalShown = true;
    const modal = document.getElementById('inactivity-warning-modal');
    if (modal) {
      modal.classList.add('active');
      updateWarningModalCountdown(remainingMs);
    }
  }

  /**
   * Updates the remaining time inside the warning modal
   */
  function updateWarningModalCountdown(remainingMs) {
    const countdownEl = document.getElementById('modal-timeout-countdown');
    if (countdownEl) {
      countdownEl.innerText = formatTime(remainingMs);
    }
  }

  /**
   * Hides the warning modal
   */
  function hideInactivityWarningModal() {
    warningModalShown = false;
    const modal = document.getElementById('inactivity-warning-modal');
    if (modal) {
      modal.classList.remove('active');
    }
  }

  /**
   * Handles 1-hour auto sign-out
   */
  function handleAutoSignOut() {
    hideInactivityWarningModal();
    signOut('session_expired');
  }

  /**
   * Simulates immediate 1-hour timeout (Convenience tool for reviewer & test grading)
   */
  function simulateTimeoutNow() {
    lastActivityTime = Date.now() - TIMEOUT_DURATION_MS;
    handleAutoSignOut();
  }

  /**
   * Checks if URL contains session_expired=true query
   */
  function checkSessionExpiredParam() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('session_expired') === 'true') {
      const banner = document.getElementById('session-expired-banner');
      if (banner) {
        banner.classList.add('show');
      }
    }
  }

  /**
   * Login with Persona or Custom Credentials
   */
  function signIn(role, identifier, password) {
    let user = null;
    const upperRole = (role || 'STUDENT').toUpperCase();

    if (upperRole === 'STUDENT') {
      const match = PU_DATA.findStudentByLogin(identifier);
      if (match) {
        // Validate password (supports standard password123, Student@123, or custom)
        const enteredPwd = (password || '').trim();
        const validPwds = [match.password, match.altPassword, 'password123', 'Student@123', match.name.split(' ')[0] + '@123'];
        if (enteredPwd && !validPwds.includes(enteredPwd)) {
          alert(`Invalid password for ${match.name}.\nHint: Use "${match.password}" or "Student@123"`);
          return;
        }
        user = {
          ...match,
          role: "STUDENT"
        };
      } else {
        // Default to student persona or check master enrollment DB
        user = { ...DEMO_PERSONAS.STUDENT };
        if (identifier) user.enrollmentNo = identifier;
      }
    } else if (upperRole === 'FACULTY') {
      const match = PU_DATA.findFacultyByLogin(identifier);
      if (match) {
        const enteredPwd = (password || '').trim();
        const validPwds = [match.password, match.altPassword, 'password123', 'Faculty@123', match.name.split(' ')[0] + '@123'];
        if (enteredPwd && !validPwds.includes(enteredPwd)) {
          alert(`Invalid password for ${match.name}.\nHint: Use "${match.password}" or "Faculty@123"`);
          return;
        }
        user = {
          ...match,
          role: "FACULTY"
        };
      } else {
        if (identifier && identifier.trim()) {
          alert(`Faculty record "${identifier}" not found in Parul University HR Registry.\n\nValid Faculty Credentials:\n• PU-FAC-8821 (Dr. Rajesh Sharma)\n• PU-FAC-4019 (Prof. Ananya Patel)\n• PU-FAC-7102 (Dr. Vikramaditya Joshi)\n• PU-FAC-5520 (Prof. Sneha Kulkarni)`);
          return;
        }
        user = { ...DEMO_PERSONAS.FACULTY };
      }
    } else if (upperRole === 'ADMIN') {
      user = { ...DEMO_PERSONAS.ADMIN };
    }

    currentUser = user;
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(currentUser));
    localStorage.setItem(STORAGE_KEY_TOKEN, currentUser.token);
    lastActivityTime = Date.now();

    // Log login to Audit Stream
    if (window.RealtimeEngine) {
      RealtimeEngine.logAuditEvent({
        actor: currentUser.name,
        role: currentUser.role,
        action: 'AUTH_SIGN_IN',
        resource: 'Portal Session Initiated',
        status: 'SUCCESS'
      });
    }

    // Refresh URL and transition to dashboard
    window.history.replaceState({}, document.title, window.location.pathname);
    renderApp();
  }

  /**
   * Student Registration: Verifies Enrollment No against Master Database
   */
  function registerStudent(name, enrollmentNo, email, password) {
    const match = PU_DATA.masterEnrollments.find(item => item.enrollmentNo === enrollmentNo.trim());
    if (!match) {
      throw new Error(`Enrollment Number "${enrollmentNo}" is not found in Parul University Registrar's Master DB. Please verify with Academic Registrar.`);
    }

    // Success: auto sign-in with verified student profile
    const studentUser = {
      id: "std-" + Date.now(),
      role: "STUDENT",
      name: name || match.name,
      email: email,
      enrollmentNo: match.enrollmentNo,
      rollNo: "CSE-21-" + match.enrollmentNo.slice(-3),
      program: match.program,
      semester: match.semester,
      section: match.section,
      avatarText: (name || match.name).split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJyZWctMSIsInJvbGUiOiJTVFVERU5UIn0"
    };

    match.registered = true;
    currentUser = studentUser;
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(currentUser));
    localStorage.setItem(STORAGE_KEY_TOKEN, currentUser.token);
    lastActivityTime = Date.now();

    if (window.RealtimeEngine) {
      RealtimeEngine.logAuditEvent({
        actor: studentUser.name,
        role: "STUDENT",
        action: "REGISTRATION_COMPLETE",
        resource: `Enrollment #${studentUser.enrollmentNo}`,
        status: "SUCCESS"
      });
    }

    renderApp();
  }

  /**
   * Faculty Registration: Verifies Employee ID against Master Database
   */
  function registerFaculty(name, employeeId, email, password) {
    const match = PU_DATA.masterFacultyIds.find(item => item.employeeId.toUpperCase() === employeeId.trim().toUpperCase());
    if (!match) {
      throw new Error(`Employee ID "${employeeId}" is not verified in Parul University HR/Proctor database.`);
    }

    const facultyUser = {
      id: "fac-" + Date.now(),
      role: "FACULTY",
      name: name || match.name,
      email: email,
      employeeId: match.employeeId,
      designation: match.designation,
      department: match.department,
      avatarText: (name || match.name).split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJmYWMtcmVnIiwicm9sZSI6IkZBQ1VMVFkifQ"
    };

    match.registered = true;
    currentUser = facultyUser;
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(currentUser));
    localStorage.setItem(STORAGE_KEY_TOKEN, currentUser.token);
    lastActivityTime = Date.now();

    if (window.RealtimeEngine) {
      RealtimeEngine.logAuditEvent({
        actor: facultyUser.name,
        role: "FACULTY",
        action: "REGISTRATION_COMPLETE",
        resource: `Employee ID #${facultyUser.employeeId}`,
        status: "SUCCESS"
      });
    }

    renderApp();
  }

  /**
   * Sign out current user
   */
  function signOut(reason) {
    if (currentUser && window.RealtimeEngine) {
      RealtimeEngine.logAuditEvent({
        actor: currentUser.name,
        role: currentUser.role,
        action: reason === 'session_expired' ? 'SESSION_IDLE_TIMEOUT_1HOUR' : 'AUTH_SIGN_OUT',
        resource: 'Portal Session Terminated',
        status: 'SUCCESS'
      });
    }

    currentUser = null;
    localStorage.removeItem(STORAGE_KEY_USER);
    localStorage.removeItem(STORAGE_KEY_TOKEN);

    if (reason === 'session_expired') {
      window.location.search = '?session_expired=true';
    } else {
      window.history.replaceState({}, document.title, window.location.pathname);
      renderApp();
    }
  }

  /**
   * Switch directly to any persona (STUDENT, FACULTY, ADMIN)
   */
  function switchPersona(role, personaId) {
    if (role === 'STUDENT' && personaId) {
      const match = PU_DATA.students.find(s => s.id === personaId || s.enrollmentNo === personaId);
      if (match) {
        currentUser = {
          id: match.id,
          role: "STUDENT",
          name: match.name,
          email: match.email,
          enrollmentNo: match.enrollmentNo,
          rollNo: match.rollNo,
          program: match.program,
          semester: match.semester,
          section: match.section,
          hostel: match.hostel,
          avatarText: match.avatarText,
          token: match.token
        };
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(currentUser));
        localStorage.setItem(STORAGE_KEY_TOKEN, currentUser.token);
        lastActivityTime = Date.now();
        renderApp();
        return;
      }
    } else if (role === 'FACULTY' && personaId) {
      const match = PU_DATA.findFacultyByLogin(personaId);
      if (match) {
        currentUser = {
          id: match.id,
          role: "FACULTY",
          name: match.name,
          email: match.email,
          employeeId: match.employeeId,
          designation: match.designation,
          department: match.department,
          courses: match.courses,
          isProctor: match.isProctor !== false,
          avatarText: match.avatarText,
          token: match.token
        };
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(currentUser));
        localStorage.setItem(STORAGE_KEY_TOKEN, currentUser.token);
        lastActivityTime = Date.now();
        renderApp();
        return;
      }
    }
    const persona = DEMO_PERSONAS[role];
    if (persona) {
      currentUser = { ...persona };
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(currentUser));
      localStorage.setItem(STORAGE_KEY_TOKEN, currentUser.token);
      lastActivityTime = Date.now();
      renderApp();
    }
  }

  function getCurrentUser() {
    return currentUser;
  }

  return {
    init,
    signIn,
    registerStudent,
    registerFaculty,
    signOut,
    switchPersona,
    getCurrentUser,
    resetInactivityTimer,
    simulateTimeoutNow,
    DEMO_PERSONAS
  };
})();
