/**
 * PARUL UNIVERSITY ERP - MASTER APPLICATION CONTROLLER
 * Coordinates routing, authentication state, theme toggling, and portal rendering.
 */

// Global function called by AuthEngine to re-render the application
function renderApp() {
  const user = AuthEngine.getCurrentUser();
  const authContainer = document.getElementById('auth-container');
  const dashboardContainer = document.getElementById('dashboard-container');
  const topbar = document.getElementById('app-topbar');

  if (!user) {
    // Show Auth Screen
    if (authContainer) authContainer.style.display = 'block';
    if (dashboardContainer) dashboardContainer.style.display = 'none';
    if (topbar) topbar.style.display = 'none';
    renderAuthUI();
  } else {
    // Show Portal Dashboard
    if (authContainer) authContainer.style.display = 'none';
    if (dashboardContainer) dashboardContainer.style.display = 'flex';
    if (topbar) topbar.style.display = 'flex';
    
    updateTopbarUserMeta(user);
    renderActivePortal(user);
  }
}

/**
 * Updates topbar user profile pill and active role pills
 */
function updateTopbarUserMeta(user) {
  const avatarEl = document.getElementById('topbar-user-avatar');
  const nameEl = document.getElementById('topbar-user-name');
  const roleEl = document.getElementById('topbar-user-role');

  if (avatarEl) avatarEl.innerText = user.avatarText || user.name.substring(0, 2).toUpperCase();
  if (nameEl) nameEl.innerText = user.name;
  if (roleEl) roleEl.innerText = user.role + (user.enrollmentNo ? ` • ${user.enrollmentNo}` : (user.employeeId ? ` • ${user.employeeId}` : ''));

  // Strict Role Display: Show ONLY the authenticated role
  const roleContainer = document.getElementById('active-role-container');
  if (roleContainer) {
    if (user.role === 'STUDENT') {
      roleContainer.innerHTML = `
        <div class="active-role-pill role-student" title="Authenticated as Student">
          <span class="role-icon">🎓</span>
          <span class="role-title">Student</span>
        </div>
      `;
    } else if (user.role === 'FACULTY') {
      roleContainer.innerHTML = `
        <div class="active-role-pill role-faculty" title="Authenticated as Faculty">
          <span class="role-icon">👨‍🏫</span>
          <span class="role-title">Faculty</span>
        </div>
      `;
    } else if (user.role === 'ADMIN') {
      roleContainer.innerHTML = `
        <div class="active-role-pill role-admin" title="Authenticated as Administrator">
          <span class="role-icon">🛡️</span>
          <span class="role-title">Admin</span>
        </div>
      `;
    }
  }
}

/**
 * Renders the dedicated portal based on strict role segregation
 */
function renderActivePortal(user) {
  const portalContainer = document.getElementById('portal-view-container');
  if (!portalContainer) return;

  if (user.role === 'STUDENT') {
    StudentPortal.render(portalContainer);
  } else if (user.role === 'FACULTY') {
    FacultyPortal.render(portalContainer);
  } else if (user.role === 'ADMIN') {
    AdminPortal.render(portalContainer);
  }
}

/**
 * Auth UI controller (tabs, role picker, register vs sign in)
 */
let currentAuthRole = 'STUDENT';
let currentAuthMode = 'signin'; // 'signin' or 'signup'

function renderAuthUI() {
  const roleSegmented = document.getElementById('auth-role-control');
  if (roleSegmented) {
    roleSegmented.querySelectorAll('.role-pill').forEach(pill => {
      pill.classList.toggle('active', pill.dataset.role === currentAuthRole);
    });
  }

  const signinForm = document.getElementById('form-signin');
  const signupForm = document.getElementById('form-signup');
  const tabSignin = document.getElementById('tab-mode-signin');
  const tabSignup = document.getElementById('tab-mode-signup');

  if (currentAuthMode === 'signin') {
    if (signinForm) signinForm.style.display = 'block';
    if (signupForm) signupForm.style.display = 'none';
    if (tabSignin) tabSignin.classList.add('active');
    if (tabSignup) tabSignup.classList.remove('active');
    updateSigninFieldsForRole();
  } else {
    if (signinForm) signinForm.style.display = 'none';
    if (signupForm) signupForm.style.display = 'block';
    if (tabSignin) tabSignin.classList.remove('active');
    if (tabSignup) tabSignup.classList.add('active');
    updateSignupFieldsForRole();
  }
}

function selectAuthRole(role) {
  currentAuthRole = role;
  renderAuthUI();
}

function selectAuthMode(mode) {
  currentAuthMode = mode;
  renderAuthUI();
}

function updateSigninFieldsForRole() {
  const labelId = document.getElementById('signin-label-id');
  const idInput = document.getElementById('signin-identifier');
  const pwdInput = document.getElementById('signin-password');

  if (!labelId || !idInput || !pwdInput) return;

  if (currentAuthRole === 'STUDENT') {
    labelId.innerText = 'Institutional Identifier (Enrollment No / Student Email)';
    idInput.placeholder = 'e.g. 210303105001 or aarav.mehta@paruluniversity.ac.in';
    if (!idInput.value || idInput.value.startsWith('PU-') || idInput.value.includes('admin') || idInput.value.includes('faculty') || idInput.value.includes('sharma') || idInput.value.includes('patel')) {
      idInput.value = '210303105001';
      pwdInput.value = 'password123';
    }
  } else if (currentAuthRole === 'FACULTY') {
    labelId.innerText = 'Institutional Identifier (Employee ID / Faculty Email)';
    idInput.placeholder = 'e.g. PU-FAC-3012 (Mr. Pritam Samanta), PU-FAC-8821, or PU-FAC-2045';
    if (!idInput.value || idInput.value.startsWith('210303') || idInput.value.includes('admin') || idInput.value.includes('aarav')) {
      idInput.value = 'PU-FAC-3012';
      pwdInput.value = 'password123';
    }
  } else if (currentAuthRole === 'ADMIN') {
    labelId.innerText = 'Institutional Identifier (Admin ID / Email)';
    idInput.placeholder = 'e.g. PU-ADM-001 or admin@paruluniversity.ac.in';
    idInput.value = 'admin@paruluniversity.ac.in';
    pwdInput.value = 'Admin@123';
  }
}

function updateSignupFieldsForRole() {
  const studentFields = document.getElementById('signup-student-fields');
  const facultyFields = document.getElementById('signup-faculty-fields');
  const adminNotice = document.getElementById('signup-admin-notice');
  const signupSubmitBtn = document.getElementById('btn-signup-submit');

  if (studentFields) studentFields.style.display = (currentAuthRole === 'STUDENT') ? 'block' : 'none';
  if (facultyFields) facultyFields.style.display = (currentAuthRole === 'FACULTY') ? 'block' : 'none';
  if (adminNotice) adminNotice.style.display = (currentAuthRole === 'ADMIN') ? 'block' : 'none';
  if (signupSubmitBtn) signupSubmitBtn.style.display = (currentAuthRole === 'ADMIN') ? 'none' : 'block';
}

/**
 * Handles Sign In submission
 */
function handleSignInSubmit(e) {
  e.preventDefault();
  const idInput = document.getElementById('signin-identifier');
  const pwdInput = document.getElementById('signin-password');
  const identifier = idInput ? idInput.value : '';
  const password = pwdInput ? pwdInput.value : '';

  AuthEngine.signIn(currentAuthRole, identifier, password);
}

/**
 * Handles Sign Up submission
 */
function handleSignUpSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('signup-name').value.trim();
  const email = document.getElementById('signup-email').value.trim();
  const password = document.getElementById('signup-password').value;

  try {
    if (currentAuthRole === 'STUDENT') {
      const enrNo = document.getElementById('signup-enr-no').value.trim();
      AuthEngine.registerStudent(name, enrNo, email, password);
    } else if (currentAuthRole === 'FACULTY') {
      const empId = document.getElementById('signup-emp-id').value.trim();
      AuthEngine.registerFaculty(name, empId, email, password);
    }
  } catch (err) {
    alert(`Registration Verification Failed:\n\n${err.message}`);
  }
}

/**
 * Theme toggle
 */
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('PU_ERP_THEME', newTheme);

  const themeBtn = document.getElementById('theme-toggle-btn');
  if (themeBtn) {
    themeBtn.innerHTML = newTheme === 'dark' ? '☀️' : '🌙';
  }
}

function initTheme() {
  const savedTheme = localStorage.getItem('PU_ERP_THEME') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  const themeBtn = document.getElementById('theme-toggle-btn');
  if (themeBtn) {
    themeBtn.innerHTML = savedTheme === 'dark' ? '☀️' : '🌙';
  }
}

/**
 * Application Lifecycle Entry Point
 */
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  AuthEngine.init();
  RealtimeEngine.init();
  renderApp();
});
