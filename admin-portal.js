/**
 * PARUL UNIVERSITY ERP - ADMIN PORTAL MODULE
 * Handles Executive Analytics, SMART Account Setup & Enterprise Subscriptions,
 * User Provisioning, Role Assignment, User Management & Master DB Roster,
 * Academic Setup, Global Exam Result Publishing Engine, and Real-Time CDC System Audit Logs.
 */

const AdminPortal = (function() {

  let passwordVisible = false;

  /**
   * Main render function for Admin Portal
   */
  function render(container) {
    const user = AuthEngine.getCurrentUser();
    if (!user) return;

    container.innerHTML = `
      <!-- Admin Hero Banner -->
      <div class="portal-hero-banner">
        <div class="portal-hero-info">
          <h2>Academic Administration & Registrar Console 🛡️</h2>
          <p style="color: #FCD34D; font-weight: 600;">Office of the Registrar & Controller of Examinations | Parul University</p>
          <div class="portal-hero-meta">
            <span><strong>Administrator:</strong> ${user.name}</span>
            <span><strong>Admin ID:</strong> ${user.adminId || 'PU-ADM-001'}</span>
            <span><strong>Access Level:</strong> Master Super-Admin</span>
            <span><strong>Network State:</strong> Real-Time CDC Sync Active</span>
          </div>
        </div>
        <div class="portal-hero-badges">
          <span class="badge badge-maroon" style="font-size: 13px; padding: 6px 14px; background: rgba(255,255,255,0.15); color: #FFFFFF; border-color: rgba(255,255,255,0.3);">
            🔒 Super-Admin Security Clearance
          </span>
          <span class="badge badge-success" style="font-size: 12px;">Active Node: PU-CENTRAL-GW1</span>
        </div>
      </div>

      <!-- Navigation Subtabs -->
      <div class="portal-subtabs">
        <button class="subtab-btn active" onclick="AdminPortal.switchTab('overview')">
          📊 Executive Analytics
        </button>
        <button class="subtab-btn" onclick="AdminPortal.switchTab('subscriptions')">
          🛡️ SMART Setup & Subscriptions
        </button>
        <button class="subtab-btn" onclick="AdminPortal.switchTab('users')">
          👥 User Management & Master DB
        </button>
        <button class="subtab-btn" onclick="AdminPortal.switchTab('academic')">
          🏛️ Master Academic Setup
        </button>
        <button class="subtab-btn" onclick="AdminPortal.switchTab('exams')">
          🎓 Examination & Result Publishing Engine
        </button>
        <button class="subtab-btn" onclick="AdminPortal.switchTab('audit')">
          ⚡ System Audit Logs (CDC Stream)
        </button>
      </div>

      <!-- TAB 1: EXECUTIVE ANALYTICS -->
      <div id="admin-tab-overview" class="subtab-content active">
        <!-- SMART Enterprise Highlights Highlight Banner -->
        <div class="card" style="margin-bottom: 24px; background: linear-gradient(135deg, rgba(140, 29, 64, 0.08) 0%, rgba(217, 119, 6, 0.08) 100%); border: 1px solid rgba(140, 29, 64, 0.2);">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
            <div style="display: flex; gap: 16px; align-items: center;">
              <div style="font-size: 32px; background: var(--bg-surface); padding: 12px; border-radius: var(--radius-lg); box-shadow: var(--shadow-sm);">🛡️</div>
              <div>
                <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 4px; flex-wrap: wrap;">
                  <h3 style="font-size: 17px; margin: 0; font-weight: 800;">SMART Account & Enterprise Subscription Hub</h3>
                  <span class="badge badge-success">Adult Admin Verified</span>
                  <span class="badge badge-primary">PO #PO-PARUL-SMART-2025-88124</span>
                </div>
                <p style="font-size: 13px; color: var(--text-secondary); margin: 0;">
                  3 Software Suites Active (SMART Learning Suite, Notebook, Lumio) &bull; 15,257 / 16,150 Allocated Seats &bull; 8 Provisioned Faculty &bull; Organization Role Matrix Configured
                </p>
              </div>
            </div>
            <div style="display: flex; gap: 10px;">
              <button class="btn btn-primary" onclick="AdminPortal.switchTab('subscriptions')">
                Manage SMART Subscriptions & Provisioning ➔
              </button>
            </div>
          </div>
        </div>

        <!-- University-wide Stats -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">🎓</div>
            <div class="stat-content">
              <span class="stat-value">14,250</span>
              <span class="stat-label">Total Enrolled Students</span>
            </div>
          </div>
          <div class="stat-card gold">
            <div class="stat-icon">👨‍🏫</div>
            <div class="stat-content">
              <span class="stat-value">820</span>
              <span class="stat-label">Faculty & Instructors</span>
            </div>
          </div>
          <div class="stat-card green">
            <div class="stat-icon">📈</div>
            <div class="stat-content">
              <span class="stat-value">84.2%</span>
              <span class="stat-label">University Avg Attendance</span>
            </div>
          </div>
          <div class="stat-card blue">
            <div class="stat-icon">🛡️</div>
            <div class="stat-content">
              <span class="stat-value">99.98%</span>
              <span class="stat-label">System Uptime & Compliance</span>
            </div>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 24px;">
          <!-- Department Health Summary -->
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Departmental Academic Performance</h3>
              <span class="badge badge-success">Accredited A++</span>
            </div>
            <div class="table-responsive">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Department</th>
                    <th>Students</th>
                    <th>Faculty</th>
                    <th>Avg Attendance</th>
                    <th>Compliance</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Computer Science & Engineering</strong></td>
                    <td>3,420</td>
                    <td>142</td>
                    <td><strong style="color: var(--color-success);">86.4%</strong></td>
                    <td><span class="badge badge-success">High</span></td>
                  </tr>
                  <tr>
                    <td><strong>Artificial Intelligence & ML</strong></td>
                    <td>1,840</td>
                    <td>78</td>
                    <td><strong style="color: var(--color-success);">88.1%</strong></td>
                    <td><span class="badge badge-success">High</span></td>
                  </tr>
                  <tr>
                    <td><strong>Information Technology</strong></td>
                    <td>2,100</td>
                    <td>94</td>
                    <td><strong style="color: var(--color-success);">83.7%</strong></td>
                    <td><span class="badge badge-success">High</span></td>
                  </tr>
                  <tr>
                    <td><strong>Mechanical Engineering</strong></td>
                    <td>1,950</td>
                    <td>85</td>
                    <td><strong style="color: #F59E0B;">78.2%</strong></td>
                    <td><span class="badge badge-gold">Moderate</span></td>
                  </tr>
                  <tr>
                    <td><strong>Civil Engineering</strong></td>
                    <td>1,240</td>
                    <td>62</td>
                    <td><strong style="color: #F59E0B;">76.9%</strong></td>
                    <td><span class="badge badge-gold">Moderate</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Quick Action Controls -->
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Administrative Triggers</h3>
            </div>
            <div style="display: flex; flex-direction: column; gap: 14px;">
              <button class="btn btn-secondary" style="width: 100%; justify-content: flex-start;" onclick="AdminPortal.switchTab('subscriptions')">
                🛡️ Open SMART Subscriptions Console
              </button>
              <button class="btn btn-secondary" style="width: 100%; justify-content: flex-start;" onclick="AdminPortal.switchTab('exams')">
                📢 Go to Result Publishing Engine
              </button>
              <button class="btn btn-secondary" style="width: 100%; justify-content: flex-start;" onclick="AdminPortal.switchTab('users')">
                ➕ Add Enrollment to Master Database
              </button>
              <button class="btn btn-secondary" style="width: 100%; justify-content: flex-start;" onclick="AdminPortal.switchTab('audit')">
                📜 Inspect Real-Time CDC Audit Trail
              </button>
              <button class="btn btn-primary btn-sm" style="margin-top: 10px;" onclick="AdminPortal.triggerSystemHealthCheck()">
                ⚡ Run Database Integrity & CDC Health Check
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB 2: SMART SETUP & SUBSCRIPTIONS (New Core Subsystem) -->
      <div id="admin-tab-subscriptions" class="subtab-content">
        ${renderSmartSubscriptionsTab()}
      </div>

      <!-- TAB 3: USER MANAGEMENT & MASTER DB -->
      <div id="admin-tab-users" class="subtab-content">
        <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 24px;">
          <!-- Add Master Enrollment Card -->
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Authorize Student Enrollment</h3>
              <span class="badge badge-info">Master DB</span>
            </div>
            <form id="add-enrollment-form" onsubmit="AdminPortal.handleAddMasterEnrollment(event)">
              <div class="form-group">
                <label class="form-label">Enrollment Number</label>
                <input type="text" id="new-enr-no" class="form-control" placeholder="e.g. 210303105088" required>
              </div>
              <div class="form-group">
                <label class="form-label">Student Full Name</label>
                <input type="text" id="new-enr-name" class="form-control" placeholder="e.g. Priya Shah" required>
              </div>
              <div class="form-group">
                <label class="form-label">Degree Program</label>
                <input type="text" id="new-enr-program" class="form-control" value="B.Tech CSE" required>
              </div>
              <div class="form-group">
                <label class="form-label">Semester & Section</label>
                <input type="text" id="new-enr-sec" class="form-control" value="Semester 6 - Section 6A" required>
              </div>
              <button type="submit" class="btn btn-primary" style="width: 100%;">
                ➕ Add to Registrar Master DB
              </button>
            </form>
          </div>

          <!-- Master Enrollment List -->
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Verified Student Master Database</h3>
              <span class="badge badge-maroon" id="admin-master-db-count">${PU_DATA.masterEnrollments.length} Records</span>
            </div>
            <div class="table-responsive">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Enrollment No</th>
                    <th>Candidate Name</th>
                    <th>Program</th>
                    <th>Section</th>
                    <th>Status</th>
                    <th style="text-align: center; width: 80px;">Action</th>
                  </tr>
                </thead>
                <tbody id="admin-master-enrollment-tbody">
                  ${renderMasterEnrollmentRows()}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB 4: MASTER ACADEMIC SETUP -->
      <div id="admin-tab-academic" class="subtab-content">
        <div class="card">
          <div class="card-header">
            <div>
              <h3 class="card-title">Academic Architecture & Course Credits (FET - CSE)</h3>
              <p class="page-subtitle">Master syllabus parameters mapped for Even Semester 2026</p>
            </div>
            <span class="badge badge-gold">Autonomous Regulation</span>
          </div>

          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Course Code</th>
                  <th>Course Title</th>
                  <th>Department</th>
                  <th>Assigned Faculty</th>
                  <th style="text-align: center;">Credits</th>
                  <th style="text-align: center;">Scheduled Hours</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${PU_DATA.courses.map(course => `
                  <tr>
                    <td><code>${course.code}</code></td>
                    <td><strong>${course.title}</strong></td>
                    <td>${course.department}</td>
                    <td>${course.faculty}</td>
                    <td style="text-align: center; font-weight: 700;">${course.credits}</td>
                    <td style="text-align: center;">${course.totalHours} hrs</td>
                    <td><span class="badge badge-success">Active & Audited</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- TAB 5: EXAMINATION & RESULT PUBLISHING ENGINE -->
      <div id="admin-tab-exams" class="subtab-content">
        <div class="card">
          <div class="card-header">
            <div>
              <h3 class="card-title">Master Semester Result Publishing Engine</h3>
              <p class="page-subtitle">Triggers headless grade compilation, digital signature binding, and student notifications</p>
            </div>
            <span class="badge badge-maroon">Controller of Examinations</span>
          </div>

          <div style="background: var(--bg-subtle); padding: 24px; border-radius: var(--radius-lg); border: 1px solid var(--border-subtle); margin-bottom: 24px;">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px;">
              <div>
                <h4 style="font-size: 18px; margin-bottom: 6px;">Semester VI (Even Semester 2026) Results</h4>
                <p style="font-size: 13.5px; color: var(--text-secondary);">
                  Status: <strong>${PU_DATA.grades.isPublished ? '<span style="color: var(--color-success);">PUBLISHED & DIGITALLY SEALED</span>' : '<span style="color: var(--color-warning);">DRAFT / PENDING RELEASE</span>'}</strong>
                </p>
                <div style="font-size: 12px; color: var(--text-muted); margin-top: 4px;">
                  Target cohort: 3,420 B.Tech CSE Candidates &bull; Verification Hash: SHA-256 Enabled
                </div>
              </div>

              <div>
                <button class="btn btn-gold" style="font-size: 15px; padding: 12px 24px;" onclick="AdminPortal.publishSemesterResults()">
                  🚀 ${PU_DATA.grades.isPublished ? 'Re-Publish & Broadcast Updated Results' : 'Publish Semester 6 Results Now'}
                </button>
              </div>
            </div>
          </div>

          <div class="card">
            <h4 style="margin-bottom: 12px; font-size: 15px;">Automated Grade Card Generation Pipeline Status</h4>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;">
              <div style="padding: 16px; background: var(--bg-subtle); border-radius: var(--radius-md); border-left: 3px solid var(--color-success);">
                <div style="font-size: 12px; color: var(--text-muted);">Step 1: Marks Verification</div>
                <div style="font-weight: 700; color: var(--text-primary); margin-top: 4px;">100% Faculty Marks Ingested</div>
              </div>
              <div style="padding: 16px; background: var(--bg-subtle); border-radius: var(--radius-md); border-left: 3px solid var(--color-success);">
                <div style="font-size: 12px; color: var(--text-muted);">Step 2: SGPA / CGPA Engine</div>
                <div style="font-weight: 700; color: var(--text-primary); margin-top: 4px;">Weighted Algorithms Verified</div>
              </div>
              <div style="padding: 16px; background: var(--bg-subtle); border-radius: var(--radius-md); border-left: 3px solid var(--pu-maroon-primary);">
                <div style="font-size: 12px; color: var(--text-muted);">Step 3: Headless PDF Renderer</div>
                <div style="font-weight: 700; color: var(--text-primary); margin-top: 4px;">Instant Student PDF Download Ready</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB 6: SYSTEM AUDIT LOGS (CDC STREAM) -->
      <div id="admin-tab-audit" class="subtab-content">
        <div class="audit-stream-container">
          <div class="audit-stream-header">
            <div>
              <h3 class="card-title" style="margin: 0;">⚡ Real-Time Change Data Capture (CDC) Audit Stream</h3>
              <p class="page-subtitle" style="margin-top: 2px;">Immutable ledger of all insertions, updates, and logins across Parul University network</p>
            </div>
            <div style="display: flex; gap: 10px; align-items: center;">
              <span class="badge badge-success">● Streaming Live</span>
              <button class="btn btn-secondary btn-sm" onclick="AdminPortal.exportAuditCSV()">
                📥 Export CSV
              </button>
            </div>
          </div>

          <div class="table-responsive" style="max-height: 520px; overflow-y: auto;">
            <table class="audit-stream-table">
              <thead>
                <tr>
                  <th style="width: 140px;">Timestamp</th>
                  <th style="width: 90px;">Log ID</th>
                  <th>Actor / User</th>
                  <th style="width: 100px;">Role</th>
                  <th>Action / Event</th>
                  <th>Target Resource</th>
                  <th style="width: 110px;">Client IP</th>
                  <th style="width: 80px;">Status</th>
                </tr>
              </thead>
              <tbody id="admin-audit-stream-tbody">
                ${renderAuditRows()}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Dedicated Admin Portal Modal Overlay -->
      <div class="admin-modal-overlay" id="admin-modal-overlay"></div>
    `;
  }

  /**
   * Renders the complete SMART Setup, Subscriptions, User Provisioning & Roles tab
   */
  function renderSmartSubscriptionsTab() {
    const profile = PU_DATA.adminProfile;
    const subscriptions = PU_DATA.smartSubscriptions;
    const provisioned = PU_DATA.provisionedUsers;
    const roles = PU_DATA.organizationRoles;

    const totalSeats = subscriptions.reduce((sum, s) => sum + s.totalSeats, 0);
    const totalAllocated = subscriptions.reduce((sum, s) => sum + s.allocatedSeats, 0);
    const totalAvailable = subscriptions.reduce((sum, s) => sum + s.availableSeats, 0);

    return `
      <!-- Top KPI Highlights -->
      <div class="stats-grid" style="margin-bottom: 24px;">
        <div class="stat-card">
          <div class="stat-icon">💻</div>
          <div class="stat-content">
            <span class="stat-value" id="stat-active-suites">${subscriptions.length} Active Suites</span>
            <span class="stat-label">Software Subscriptions</span>
          </div>
        </div>
        <div class="stat-card gold">
          <div class="stat-icon">🎟️</div>
          <div class="stat-content">
            <span class="stat-value" id="stat-allocated-seats">${totalAllocated.toLocaleString()} / ${totalSeats.toLocaleString()}</span>
            <span class="stat-label">Total Allocated Seats</span>
          </div>
        </div>
        <div class="stat-card green">
          <div class="stat-icon">✨</div>
          <div class="stat-content">
            <span class="stat-value" id="stat-available-seats" style="color: var(--color-success);">${totalAvailable.toLocaleString()}</span>
            <span class="stat-label">Available Seats to Provision</span>
          </div>
        </div>
        <div class="stat-card blue">
          <div class="stat-icon">👥</div>
          <div class="stat-content">
            <span class="stat-value" id="stat-provisioned-users">${provisioned.length} Educators</span>
            <span class="stat-label">Active Software Access</span>
          </div>
        </div>
      </div>

      <!-- SECTION 1: REQUIRED INFORMATION AND STEPS (STEPPER PIPELINE) -->
      <div class="card" style="margin-bottom: 26px;">
        <div class="card-header">
          <div>
            <h3 class="card-title">Required Information and Setup Pipeline</h3>
            <p class="page-subtitle">Standardized onboarding protocol for Parul University enterprise software licensing</p>
          </div>
          <span class="badge badge-success">✓ 3 of 3 Requirements Completed</span>
        </div>

        <div class="smart-stepper-grid">
          <!-- Step 1: Valid Email Address -->
          <div class="smart-step-card active-step">
            <div>
              <div class="smart-step-badge">Step 1 &bull; Organization Email</div>
              <div class="smart-step-title">
                <span>📧</span> Valid Email Address
              </div>
              <p class="smart-step-desc">
                An email tied to your organization's software purchase or an invitation from an existing administrator.
              </p>
              <div class="smart-step-meta-box">
                <div class="smart-step-meta-row">
                  <span class="smart-step-meta-label">Purchase Email:</span>
                  <span class="smart-step-meta-val" id="admin-purchase-email"><code>${profile.email}</code></span>
                </div>
                <div class="smart-step-meta-row">
                  <span class="smart-step-meta-label">Domain Status:</span>
                  <span class="badge badge-success" style="font-size: 11px;">Verified Domain Licensee</span>
                </div>
                <div class="smart-step-meta-row">
                  <span class="smart-step-meta-label">Organization:</span>
                  <span class="smart-step-meta-val">${profile.organization}</span>
                </div>
                <div class="smart-step-meta-row">
                  <span class="smart-step-meta-label">Org ID:</span>
                  <span class="smart-step-meta-val"><code>${profile.organizationId}</code></span>
                </div>
              </div>
            </div>
            <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 10px;">
              <button class="btn btn-secondary btn-sm" onclick="AdminPortal.verifyDomainEmail()">
                🔄 Re-Verify Email
              </button>
              <button class="btn btn-primary btn-sm" onclick="AdminPortal.openInviteAdminModal()">
                ✉️ Send Admin Invite
              </button>
            </div>
          </div>

          <!-- Step 2: SMART Account Setup -->
          <div class="smart-step-card active-step">
            <div>
              <div class="smart-step-badge">Step 2 &bull; Identity & User Type</div>
              <div class="smart-step-title">
                <span>🛡️</span> SMART Account Setup
              </div>
              <p class="smart-step-desc">
                Registration details including your name, a secure password, and selecting <strong>"Adult"</strong> as your user type.
              </p>
              <div class="smart-step-meta-box">
                <div class="smart-step-meta-row">
                  <span class="smart-step-meta-label">Administrator:</span>
                  <span class="smart-step-meta-val" id="admin-reg-name"><strong>${profile.name}</strong></span>
                </div>
                <div class="smart-step-meta-row">
                  <span class="smart-step-meta-label">Secure Password:</span>
                  <div style="display: flex; align-items: center; gap: 6px;">
                    <span id="admin-password-display" style="font-family: monospace; font-weight: 700;">••••••••••••••</span>
                    <button type="button" class="btn btn-secondary btn-sm" style="padding: 1px 6px; font-size: 11px;" onclick="AdminPortal.togglePasswordVisibility()" id="btn-toggle-pwd">
                      👁️ Show
                    </button>
                  </div>
                </div>
                <div class="smart-step-meta-row">
                  <span class="smart-step-meta-label">Selected User Type:</span>
                  <span class="badge badge-maroon" style="font-size: 11px; font-weight: 800; background: var(--pu-maroon-primary); color: #fff;">
                    ✓ Adult (Designated Authority)
                  </span>
                </div>
                <div class="smart-step-meta-row">
                  <span class="smart-step-meta-label">Authority Level:</span>
                  <span class="smart-step-meta-val" style="font-size: 11px; color: var(--text-secondary);">${profile.userTypeDescription}</span>
                </div>
              </div>
            </div>
            <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 10px;">
              <button class="btn btn-secondary btn-sm" onclick="AdminPortal.openUpdateRegistrationModal()">
                ✏️ Edit Registration Details
              </button>
            </div>
          </div>

          <!-- Step 3: Purchase Confirmation or Product Key -->
          <div class="smart-step-card active-step">
            <div>
              <div class="smart-step-badge">Step 3 &bull; License Entitlement</div>
              <div class="smart-step-title">
                <span>🔑</span> Purchase Confirmation / Product Key
              </div>
              <p class="smart-step-desc">
                Documentation or an email receipt confirming your organization's software subscriptions (such as SMART Learning Suite) to claim licenses.
              </p>
              <div class="smart-step-meta-box">
                <div class="smart-step-meta-row">
                  <span class="smart-step-meta-label">Purchase Order (PO):</span>
                  <span class="smart-step-meta-val"><code>${profile.purchaseOrder}</code></span>
                </div>
                <div class="smart-step-meta-row">
                  <span class="smart-step-meta-label">Official Invoice:</span>
                  <span class="smart-step-meta-val"><code>${profile.invoiceNumber}</code></span>
                </div>
                <div class="smart-step-meta-row">
                  <span class="smart-step-meta-label">Primary Product Key:</span>
                  <span class="smart-step-meta-val"><code>${profile.primaryProductKey}</code></span>
                </div>
                <div class="smart-step-meta-row">
                  <span class="smart-step-meta-label">License Status:</span>
                  <span class="badge badge-success" style="font-size: 11px;">Active &amp; Claimed</span>
                </div>
              </div>
            </div>
            <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 10px;">
              <button class="btn btn-secondary btn-sm" onclick="AdminPortal.openViewReceiptModal('SUB-SMART-SLS-01')">
                📄 View Purchase Receipt
              </button>
              <button class="btn btn-primary btn-sm" onclick="AdminPortal.openClaimKeyModal()">
                ➕ Claim Product Key
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- SECTION 2: ADMIN PROFILE CAPABILITIES - SUBSCRIPTION MANAGEMENT -->
      <div class="card" style="margin-bottom: 26px;">
        <div class="card-header">
          <div>
            <h3 class="card-title">Subscription Management</h3>
            <p class="page-subtitle">Activate and view software subscriptions, renewal dates, and available seat counts</p>
          </div>
          <div style="display: flex; gap: 10px;">
            <button class="btn btn-secondary btn-sm" onclick="AdminPortal.openViewReceiptModal('SUB-SMART-SLS-01')">
              📜 View Purchase Documentation
            </button>
            <button class="btn btn-primary btn-sm" onclick="AdminPortal.openClaimKeyModal()">
              ⚡ Activate New Subscription
            </button>
          </div>
        </div>

        <div class="sub-suites-grid" id="admin-subscriptions-grid">
          ${renderSubscriptionCards()}
        </div>
      </div>

      <!-- SECTION 3: ADMIN PROFILE CAPABILITIES - USER PROVISIONING -->
      <div class="card" style="margin-bottom: 26px;">
        <div class="card-header">
          <div>
            <h3 class="card-title">User Provisioning</h3>
            <p class="page-subtitle">Add, update, or remove educator and user email addresses to grant software access</p>
          </div>
          <div style="display: flex; gap: 10px;">
            <button class="btn btn-primary" onclick="AdminPortal.openAddProvisionModal()">
              ➕ Provision / Grant Educator Access
            </button>
          </div>
        </div>

        <!-- Search & Filters -->
        <div style="display: flex; justify-content: space-between; align-items: center; gap: 14px; margin-bottom: 18px; flex-wrap: wrap;">
          <div style="display: flex; gap: 10px; flex: 1; min-width: 280px;">
            <input type="text" id="provision-search-input" class="form-control" placeholder="Search by educator name, email or department..." oninput="AdminPortal.filterProvisionTable()">
          </div>
          <div style="display: flex; gap: 10px; align-items: center;">
            <select id="provision-filter-suite" class="form-control" style="width: auto;" onchange="AdminPortal.filterProvisionTable()">
              <option value="ALL">All Software Suites</option>
              <option value="SMART Learning Suite">SMART Learning Suite</option>
              <option value="SMART Notebook">SMART Notebook</option>
              <option value="SMART Lumio">SMART Lumio</option>
            </select>
            <span class="badge badge-maroon" id="provision-count-badge">${provisioned.length} Active Educators</span>
          </div>
        </div>

        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Educator / User</th>
                <th>Valid University Email</th>
                <th>Department</th>
                <th>Assigned Role</th>
                <th>Granted Software Access</th>
                <th>Date Granted</th>
                <th style="text-align: center; width: 140px;">Actions</th>
              </tr>
            </thead>
            <tbody id="admin-provision-tbody">
              ${renderProvisionRows(provisioned)}
            </tbody>
          </table>
        </div>
      </div>

      <!-- SECTION 4: ADMIN PROFILE CAPABILITIES - ROLE ASSIGNMENT -->
      <div class="card">
        <div class="card-header">
          <div>
            <h3 class="card-title">Role Assignment</h3>
            <p class="page-subtitle">Manage other administrators, tech instructors, or supervisors within your assigned organization</p>
          </div>
          <div style="display: flex; gap: 10px;">
            <button class="btn btn-primary" onclick="AdminPortal.openAssignRoleModal()">
              ➕ Assign New Role
            </button>
          </div>
        </div>

        <!-- Role Hierarchy Description Box -->
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 20px;">
          <div style="background: var(--bg-subtle); padding: 14px; border-radius: var(--radius-md); border-left: 3px solid var(--pu-maroon-primary);">
            <div style="font-size: 11px; font-weight: 800; color: var(--pu-maroon-primary); text-transform: uppercase;">Super-Admin</div>
            <div style="font-weight: 700; font-size: 13px; margin: 2px 0;">Master Authority</div>
            <div style="font-size: 11.5px; color: var(--text-secondary);">Enterprise billing, license keys, root security</div>
          </div>
          <div style="background: var(--bg-subtle); padding: 14px; border-radius: var(--radius-md); border-left: 3px solid #0284C7;">
            <div style="font-size: 11px; font-weight: 800; color: #0284C7; text-transform: uppercase;">Co-Administrator</div>
            <div style="font-weight: 700; font-size: 13px; margin: 2px 0;">Organization Admin</div>
            <div style="font-size: 11.5px; color: var(--text-secondary);">User provisioning, seat quotas, staff onboarding</div>
          </div>
          <div style="background: var(--bg-subtle); padding: 14px; border-radius: var(--radius-md); border-left: 3px solid #D97706;">
            <div style="font-size: 11px; font-weight: 800; color: #D97706; text-transform: uppercase;">Tech Lead</div>
            <div style="font-weight: 700; font-size: 13px; margin: 2px 0;">Tech Instructor</div>
            <div style="font-size: 11.5px; color: var(--text-secondary);">Smart displays, classroom hardware, lab tooling</div>
          </div>
          <div style="background: var(--bg-subtle); padding: 14px; border-radius: var(--radius-md); border-left: 3px solid #10B981;">
            <div style="font-size: 11px; font-weight: 800; color: #10B981; text-transform: uppercase;">Compliance</div>
            <div style="font-weight: 700; font-size: 13px; margin: 2px 0;">Departmental Supervisor</div>
            <div style="font-size: 11.5px; color: var(--text-secondary);">Faculty attendance, syllabus audit, usage metrics</div>
          </div>
        </div>

        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Staff Member</th>
                <th>Department</th>
                <th style="min-width: 190px;">Assigned Role (In-Line Reassign)</th>
                <th>Operational Scope &amp; Delegation</th>
                <th>Assigned By &amp; Date</th>
                <th style="text-align: center; width: 100px;">Actions</th>
              </tr>
            </thead>
            <tbody id="admin-roles-tbody">
              ${renderRoleRows(roles)}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  /**
   * Renders subscription cards with seat progress meters and renewal dates
   */
  function renderSubscriptionCards() {
    return PU_DATA.smartSubscriptions.map(sub => {
      const usagePct = Math.round((sub.allocatedSeats / sub.totalSeats) * 100);
      const isNearFull = usagePct >= 95;
      return `
        <div class="sub-suite-card">
          <div>
            <div class="sub-suite-header">
              <div style="display: flex; gap: 12px; align-items: flex-start;">
                <div class="sub-suite-icon">${sub.icon}</div>
                <div>
                  <div class="sub-suite-name">${sub.name}</div>
                  <div class="sub-suite-category">${sub.category}</div>
                </div>
              </div>
              <span class="badge ${sub.statusBadge}">${sub.status}</span>
            </div>

            <div style="font-size: 12px; margin-bottom: 10px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                <span style="color: var(--text-muted);">Product Key:</span>
                <code style="font-weight: 700; font-size: 11.5px;">${sub.productKey}</code>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                <span style="color: var(--text-muted);">Purchase Order:</span>
                <span style="font-weight: 600;">${sub.purchaseConfirmation}</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: var(--text-muted);">Renewal Date:</span>
                <strong style="color: var(--text-primary);">${sub.renewalDate} <span class="badge badge-gold" style="font-size: 10px; padding: 1px 5px;">${sub.daysRemaining} days left</span></strong>
              </div>
            </div>

            <!-- Available Seats Progress Bar & Counts -->
            <div class="seat-meter-container">
              <div class="seat-meter-header">
                <span>Seat Allocation Status</span>
                <span><strong>${usagePct}%</strong> Utilized</span>
              </div>
              <div class="seat-meter-bar">
                <div class="seat-meter-fill ${isNearFull ? 'full' : ''}" style="width: ${usagePct}%;"></div>
              </div>
              <div class="seat-numbers-row">
                <span style="color: var(--text-muted);">Allocated: <strong>${sub.allocatedSeats.toLocaleString()}</strong></span>
                <span style="color: var(--color-success); font-weight: 800;">Available: ${sub.availableSeats.toLocaleString()} Seats</span>
                <span style="color: var(--text-muted);">Total: <strong>${sub.totalSeats.toLocaleString()}</strong></span>
              </div>
            </div>

            <!-- Included Features -->
            <div style="display: flex; flex-wrap: wrap; gap: 4px; margin-top: 10px;">
              ${sub.features.map(f => `<span class="software-tag" style="font-size: 10px;">✓ ${f}</span>`).join('')}
            </div>
          </div>

          <div style="display: flex; gap: 8px; margin-top: 18px;">
            <button class="btn btn-secondary btn-sm" style="flex: 1;" onclick="AdminPortal.openViewReceiptModal('${sub.id}')">
              📄 Receipt
            </button>
            <button class="btn btn-primary btn-sm" style="flex: 1;" onclick="AdminPortal.extendSeatsPrompt('${sub.id}')">
              ➕ Add Seats
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  /**
   * Renders provisioned educator table rows
   */
  function renderProvisionRows(users) {
    if (!users || users.length === 0) {
      return `<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 24px;">No provisioned educators found matching filter.</td></tr>`;
    }
    return users.map(user => `
      <tr>
        <td>
          <div style="display: flex; align-items: center; gap: 10px;">
            <div class="provision-user-avatar">${user.avatarText || user.name.substring(0, 2).toUpperCase()}</div>
            <div>
              <strong style="color: var(--text-primary); font-size: 13.5px;">${user.name}</strong>
              <div style="font-size: 11px; color: var(--text-muted);">${user.id}</div>
            </div>
          </div>
        </td>
        <td>
          <code>${user.email}</code>
          <div style="font-size: 10.5px; color: var(--color-success); font-weight: 600;">✓ Verified Domain Email</div>
        </td>
        <td>${user.department}</td>
        <td>
          <span class="badge ${user.role.includes('Admin') ? 'badge-primary' : (user.role.includes('Tech') ? 'badge-gold' : 'badge-info')}" style="font-size: 11px;">
            ${user.role}
          </span>
        </td>
        <td>
          <div style="display: flex; flex-wrap: wrap; gap: 4px;">
            ${user.subscriptions.map(s => `<span class="software-tag">${s}</span>`).join('')}
          </div>
        </td>
        <td><small style="color: var(--text-secondary);">${user.addedDate}</small></td>
        <td style="text-align: center;">
          <div style="display: flex; gap: 6px; justify-content: center;">
            <button class="btn btn-secondary btn-sm" style="padding: 3px 8px; font-size: 11px;" onclick="AdminPortal.openEditProvisionModal('${user.id}')" title="Update software access">
              ✏️ Edit
            </button>
            <button class="btn btn-secondary btn-sm" style="padding: 3px 8px; font-size: 11px; color: #DC2626;" onclick="AdminPortal.handleRevokeProvisionUser('${user.id}')" title="Revoke software access and release seats">
              🗑️ Revoke
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  /**
   * Renders organization roles table rows
   */
  function renderRoleRows(roles) {
    return roles.map(item => `
      <tr>
        <td>
          <strong style="color: var(--text-primary); font-size: 13.5px;">${item.name}</strong>
          <div style="font-size: 11.5px; color: var(--text-muted); font-family: monospace;">${item.email}</div>
        </td>
        <td>${item.department}</td>
        <td>
          ${item.role === 'Master Super-Admin' ? `
            <span class="badge badge-maroon" style="padding: 6px 12px; font-weight: 800;">🔒 Master Super-Admin</span>
          ` : `
            <select class="role-select-inline" onchange="AdminPortal.handleInlineRoleChange('${item.id}', this.value)" title="Change assigned administrative role">
              <option value="Organization Administrator" ${item.role === 'Organization Administrator' ? 'selected' : ''}>Organization Administrator</option>
              <option value="Tech Instructor" ${item.role === 'Tech Instructor' ? 'selected' : ''}>Tech Instructor</option>
              <option value="Departmental Supervisor" ${item.role === 'Departmental Supervisor' ? 'selected' : ''}>Departmental Supervisor</option>
            </select>
          `}
        </td>
        <td style="font-size: 12.5px; color: var(--text-secondary); max-width: 280px;">
          ${item.scope}
        </td>
        <td style="font-size: 12px;">
          <div><strong>${item.assignedBy}</strong></div>
          <div style="color: var(--text-muted); font-size: 11px;">${item.assignedDate}</div>
        </td>
        <td style="text-align: center;">
          ${item.role === 'Master Super-Admin' ? `
            <span style="font-size: 11px; color: var(--text-muted);">Root Protected</span>
          ` : `
            <button class="btn btn-secondary btn-sm" style="padding: 3px 8px; font-size: 11px; color: #DC2626;" onclick="AdminPortal.handleRemoveRole('${item.id}')" title="Remove role assignment">
              🗑️ Remove
            </button>
          `}
        </td>
      </tr>
    `).join('');
  }

  /**
   * Modal Management: Open, Populate & Close
   */
  function showModal(title, bodyHtml, footerHtml = '') {
    const overlay = document.getElementById('admin-modal-overlay');
    if (!overlay) return;
    overlay.innerHTML = `
      <div class="admin-modal-box">
        <div class="admin-modal-header">
          <div class="admin-modal-title">${title}</div>
          <button class="btn btn-secondary btn-sm" onclick="AdminPortal.closeModal()" style="border: none; font-size: 16px; padding: 2px 8px;">✕</button>
        </div>
        <div class="admin-modal-body">
          ${bodyHtml}
        </div>
        ${footerHtml ? `<div class="admin-modal-footer">${footerHtml}</div>` : ''}
      </div>
    `;
    overlay.classList.add('active');
  }

  function closeModal() {
    const overlay = document.getElementById('admin-modal-overlay');
    if (overlay) {
      overlay.classList.remove('active');
      overlay.innerHTML = '';
    }
  }

  /**
   * Password Visibility Toggle
   */
  function togglePasswordVisibility() {
    passwordVisible = !passwordVisible;
    const disp = document.getElementById('admin-password-display');
    const btn = document.getElementById('btn-toggle-pwd');
    if (disp && btn) {
      if (passwordVisible) {
        disp.innerText = PU_DATA.adminProfile.initialPassword;
        disp.style.color = 'var(--pu-maroon-primary)';
        btn.innerText = '🙈 Hide';
      } else {
        disp.innerText = '••••••••••••••';
        disp.style.color = '';
        btn.innerText = '👁️ Show';
      }
    }
  }

  /**
   * Verify Domain Email check
   */
  function verifyDomainEmail() {
    RealtimeEngine.showToast({
      title: "Domain Email Verified",
      message: `${PU_DATA.adminProfile.email} is active and tied to Parul University Purchase Order #${PU_DATA.adminProfile.purchaseOrder}.`,
      type: "success"
    });
  }

  /**
   * Invite Administrator Modal
   */
  function openInviteAdminModal() {
    const bodyHtml = `
      <form id="invite-admin-form" onsubmit="AdminPortal.handleSendAdminInvite(event)">
        <p style="font-size: 13.5px; color: var(--text-secondary); margin-bottom: 16px;">
          Send an official cryptographic invitation link to onboard another administrator or supervisor under the Parul University enterprise domain.
        </p>
        <div class="form-group">
          <label class="form-label">Administrator Full Name</label>
          <input type="text" id="inv-admin-name" class="form-control" placeholder="e.g. Dr. Harish Chandra" required>
        </div>
        <div class="form-group">
          <label class="form-label">Valid University Email Address</label>
          <input type="email" id="inv-admin-email" class="form-control" placeholder="e.g. harish.chandra@paruluniversity.ac.in" required>
          <small style="color: var(--text-muted); font-size: 11px;">Must be an authorized email under @paruluniversity.ac.in</small>
        </div>
        <div class="form-group">
          <label class="form-label">Assigned Administrative Role</label>
          <select id="inv-admin-role" class="form-control" required>
            <option value="Organization Administrator">Organization Administrator (User Provisioning & Quotas)</option>
            <option value="Tech Instructor">Tech Instructor (Smart Displays & Interactive Classroom)</option>
            <option value="Departmental Supervisor">Departmental Supervisor (Faculty Attendance & Compliance)</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Department / School</label>
          <input type="text" id="inv-admin-dept" class="form-control" value="Faculty of Engineering & Technology" required>
        </div>
        <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px;">
          <button type="button" class="btn btn-secondary" onclick="AdminPortal.closeModal()">Cancel</button>
          <button type="submit" class="btn btn-primary">✉️ Send Invitation Link</button>
        </div>
      </form>
    `;
    showModal("✉️ Invite Administrator or Supervisor", bodyHtml);
  }

  function handleSendAdminInvite(e) {
    e.preventDefault();
    const name = document.getElementById('inv-admin-name').value.trim();
    const email = document.getElementById('inv-admin-email').value.trim();
    const role = document.getElementById('inv-admin-role').value;
    const dept = document.getElementById('inv-admin-dept').value.trim();

    if (!email.includes('@paruluniversity.ac.in')) {
      alert("Please enter a valid Parul University domain email address (@paruluniversity.ac.in).");
      return;
    }

    RealtimeEngine.logAuditEvent({
      actor: AuthEngine.getCurrentUser() ? AuthEngine.getCurrentUser().name : "Admin",
      role: "ADMIN",
      action: "ADMIN_INVITATION_SENT",
      resource: `Dispatched invite to ${name} (${email}) for role: ${role}`,
      status: "SUCCESS"
    });

    RealtimeEngine.showToast({
      title: "Invitation Dispatched!",
      message: `Onboarding token sent to ${email}. Valid for 72 hours under PO #${PU_DATA.adminProfile.purchaseOrder}.`,
      type: "success"
    });

    closeModal();
  }

  /**
   * Edit Registration Details Modal
   */
  function openUpdateRegistrationModal() {
    const profile = PU_DATA.adminProfile;
    const bodyHtml = `
      <form id="update-reg-form" onsubmit="AdminPortal.handleSaveRegistrationDetails(event)">
        <div class="form-group">
          <label class="form-label">Administrator Full Name</label>
          <input type="text" id="reg-admin-name" class="form-control" value="${profile.name}" required>
        </div>
        <div class="form-group">
          <label class="form-label">Designated Authority Title</label>
          <input type="text" id="reg-admin-desig" class="form-control" value="${profile.designation}" required>
        </div>
        <div class="form-group">
          <label class="form-label">Secure Admin Password</label>
          <input type="text" id="reg-admin-pwd" class="form-control" value="${profile.initialPassword}" required>
        </div>
        <div class="form-group">
          <label class="form-label">Selected User Type</label>
          <select id="reg-admin-usertype" class="form-control" disabled style="background: var(--bg-subtle);">
            <option value="Adult" selected>Adult (Designated Institutional Authority - Mandatory for Admins)</option>
          </select>
          <small style="color: var(--color-success); font-size: 11px; font-weight: 600;">✓ "Adult" user type is locked to maintain multi-user software license administration authority.</small>
        </div>
        <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px;">
          <button type="button" class="btn btn-secondary" onclick="AdminPortal.closeModal()">Cancel</button>
          <button type="submit" class="btn btn-primary">💾 Save Account Details</button>
        </div>
      </form>
    `;
    showModal("✏️ Update SMART Account Registration Details", bodyHtml);
  }

  function handleSaveRegistrationDetails(e) {
    e.preventDefault();
    const name = document.getElementById('reg-admin-name').value.trim();
    const desig = document.getElementById('reg-admin-desig').value.trim();
    const pwd = document.getElementById('reg-admin-pwd').value.trim();

    PU_DATA.adminProfile.name = name;
    PU_DATA.adminProfile.designation = desig;
    PU_DATA.adminProfile.initialPassword = pwd;

    RealtimeEngine.logAuditEvent({
      actor: name,
      role: "ADMIN",
      action: "ACCOUNT_REGISTRATION_UPDATED",
      resource: "Updated SMART Admin profile details & password hash",
      status: "SUCCESS"
    });

    RealtimeEngine.showToast({
      title: "Account Details Saved",
      message: "Administrator profile details updated successfully.",
      type: "success"
    });

    closeModal();
    const nameEl = document.getElementById('admin-reg-name');
    if (nameEl) nameEl.innerHTML = `<strong>${name}</strong>`;
  }

  /**
   * View Purchase Receipt Modal
   */
  function openViewReceiptModal(subId) {
    const sub = PU_DATA.smartSubscriptions.find(s => s.id === subId) || PU_DATA.smartSubscriptions[0];
    const profile = PU_DATA.adminProfile;

    const bodyHtml = `
      <div style="background: var(--bg-subtle); border: 2px dashed var(--border-subtle); border-radius: var(--radius-lg); padding: 24px; position: relative;">
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid var(--pu-maroon-primary); padding-bottom: 16px; margin-bottom: 16px;">
          <div>
            <h3 style="margin: 0; color: var(--pu-maroon-primary); font-size: 19px; font-weight: 800;">OFFICIAL PURCHASE CONFIRMATION &amp; LICENSE RECEIPT</h3>
            <p style="margin: 4px 0 0 0; font-size: 12.5px; color: var(--text-secondary);">SMART Technologies ULC &bull; Academic Enterprise Volume Consortium</p>
          </div>
          <div style="text-align: right;">
            <span class="badge badge-success" style="font-size: 12px; padding: 4px 10px;">PAID &amp; VERIFIED</span>
            <div style="font-size: 11px; color: var(--text-muted); margin-top: 4px;">Date: ${sub.startDate}</div>
          </div>
        </div>

        <!-- Meta Grid -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; font-size: 12.5px; margin-bottom: 18px;">
          <div>
            <div style="color: var(--text-muted);">Licensed Institution:</div>
            <div style="font-weight: 800; font-size: 14px; color: var(--text-primary);">${profile.organization}</div>
            <div style="color: var(--text-secondary);">Consortium ID: <code>${profile.organizationId}</code></div>
          </div>
          <div>
            <div style="color: var(--text-muted);">Designated Administrator:</div>
            <div style="font-weight: 800; font-size: 14px; color: var(--text-primary);">${profile.name} (Adult)</div>
            <div style="color: var(--text-secondary);">Licensee Email: <code>${profile.email}</code></div>
          </div>
        </div>

        <!-- Documentation Table -->
        <table class="data-table" style="font-size: 12px; margin-bottom: 16px;">
          <thead>
            <tr>
              <th>Documentation Item</th>
              <th>Reference / Key</th>
              <th>Allocation Scope</th>
              <th>Validity Term</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>${sub.name}</strong></td>
              <td><code>${sub.productKey}</code></td>
              <td><strong>${sub.totalSeats.toLocaleString()} Seats</strong> (${sub.licenseType})</td>
              <td>${sub.startDate} to <strong>${sub.renewalDate}</strong></td>
            </tr>
            <tr>
              <td><strong>Purchase Order (PO)</strong></td>
              <td><code>${sub.purchaseConfirmation}</code></td>
              <td>University Master Academic Contract</td>
              <td>Signed &amp; Approved</td>
            </tr>
            <tr>
              <td><strong>Official Tax Invoice</strong></td>
              <td><code>${sub.invoiceNo}</code></td>
              <td>GST Registered &bull; Tax Seal Affixed</td>
              <td>Fully Reconciled</td>
            </tr>
          </tbody>
        </table>

        <!-- Entitlement Statement -->
        <div style="font-size: 11.5px; color: var(--text-secondary); line-height: 1.5; background: var(--bg-surface); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
          <strong>Legal Entitlement Statement:</strong> This receipt confirms that Parul University has legally procured and claimed full volume licensing rights for <em>${sub.name}</em>. The designated institutional authority has selected the mandatory <strong>"Adult"</strong> user verification tier, granting authorized administrative rights to provision faculty and supervise organization-wide classroom software deployments.
        </div>

        <!-- Digital Stamp -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 18px; padding-top: 12px; border-top: 1px solid var(--border-subtle); font-size: 11.5px;">
          <span style="color: var(--text-muted);">Verification SHA-256: <code>e8b4...91f2 (Valid)</code></span>
          <span style="color: var(--pu-maroon-primary); font-weight: 800;">Digital Institutional Seal: PARUL-VADODARA-SMART-2026</span>
        </div>
      </div>
      <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 18px;">
        <button class="btn btn-secondary" onclick="window.print()">🖨️ Print Documentation</button>
        <button class="btn btn-primary" onclick="AdminPortal.closeModal()">Close Receipt</button>
      </div>
    `;
    showModal("📄 Purchase Confirmation & Documentation Receipt", bodyHtml);
  }

  /**
   * Claim Product Key Modal
   */
  function openClaimKeyModal() {
    const bodyHtml = `
      <form id="claim-key-form" onsubmit="AdminPortal.handleClaimProductKey(event)">
        <p style="font-size: 13px; color: var(--text-secondary); margin-bottom: 16px;">
          Enter documentation or an email receipt confirming your organization's software subscriptions (such as SMART Learning Suite) to claim new seats or activate additional products.
        </p>
        <div class="form-group">
          <label class="form-label">Software Subscription Suite</label>
          <select id="claim-suite-select" class="form-control" required>
            <option value="SMART Learning Suite (SLS) Enterprise Edition">SMART Learning Suite (SLS) Enterprise Edition</option>
            <option value="SMART Notebook Collaborative Classroom Suite">SMART Notebook Collaborative Classroom Suite</option>
            <option value="SMART Lumio Cloud Teaching Platform">SMART Lumio Cloud Teaching Platform</option>
            <option value="SMART Podium Interactive Pen Display Suite">SMART Podium Interactive Pen Display Suite (New)</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Official Product Key (25-Character License Code)</label>
          <input type="text" id="claim-product-key" class="form-control" placeholder="e.g. SMART-SLS-2027-PU-9912-K7L4" required style="font-family: monospace; text-transform: uppercase;">
        </div>
        <div class="form-group">
          <label class="form-label">Purchase Order (PO) Confirmation / Email Receipt Number</label>
          <input type="text" id="claim-po-number" class="form-control" placeholder="e.g. PO-PARUL-SMART-2026-90412" required>
        </div>
        <div class="form-group">
          <label class="form-label">Number of Educational Seats to Claim</label>
          <input type="number" id="claim-seat-count" class="form-control" value="250" min="10" max="50000" required>
        </div>
        <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px;">
          <button type="button" class="btn btn-secondary" onclick="AdminPortal.closeModal()">Cancel</button>
          <button type="submit" class="btn btn-primary">🔑 Claim &amp; Activate Licenses</button>
        </div>
      </form>
    `;
    showModal("🔑 Claim Licenses & Activate Software Subscription", bodyHtml);
  }

  function handleClaimProductKey(e) {
    e.preventDefault();
    const suiteName = document.getElementById('claim-suite-select').value;
    const key = document.getElementById('claim-product-key').value.trim();
    const po = document.getElementById('claim-po-number').value.trim();
    const seats = parseInt(document.getElementById('claim-seat-count').value, 10);

    // Check if subscription exists
    let sub = PU_DATA.smartSubscriptions.find(s => s.name.toLowerCase() === suiteName.toLowerCase());
    if (sub) {
      sub.totalSeats += seats;
      sub.availableSeats += seats;
      sub.productKey = key;
      sub.purchaseConfirmation = po;
    } else {
      PU_DATA.smartSubscriptions.push({
        id: `SUB-SMART-CUSTOM-${Date.now()}`,
        name: suiteName,
        category: "Interactive Academic Software",
        productKey: key,
        status: "ACTIVE",
        statusBadge: "badge-success",
        purchaseConfirmation: po,
        invoiceNo: `INV-SMART-${Date.now().toString().slice(-5)}`,
        licenseType: "Volume Educational Consortium",
        totalSeats: seats,
        allocatedSeats: 0,
        availableSeats: seats,
        startDate: "2026-10-01",
        renewalDate: "2027-09-30",
        daysRemaining: 365,
        icon: "💻",
        features: ["Classroom Interactive Workspace", "Cloud Student Collaboration", "Formative Assessment Engine"]
      });
    }

    RealtimeEngine.logAuditEvent({
      actor: AuthEngine.getCurrentUser() ? AuthEngine.getCurrentUser().name : "Admin",
      role: "ADMIN",
      action: "PRODUCT_KEY_CLAIMED",
      resource: `Claimed ${seats} seats for ${suiteName} under PO #${po} (Key: ${key})`,
      status: "SUCCESS"
    });

    RealtimeEngine.showToast({
      title: "Licenses Claimed Successfully!",
      message: `Activated ${seats} seats for ${suiteName}. Product key validated with SMART Technologies.`,
      type: "success"
    });

    closeModal();
    refreshSubscriptionsUI();
  }

  /**
   * Extend Seats Prompt
   */
  function extendSeatsPrompt(subId) {
    const sub = PU_DATA.smartSubscriptions.find(s => s.id === subId);
    if (!sub) return;

    const addCountStr = prompt(`Enter additional educational seats to add to ${sub.name}:`, "100");
    if (!addCountStr) return;
    const count = parseInt(addCountStr, 10);
    if (isNaN(count) || count <= 0) {
      alert("Please enter a valid positive number of seats.");
      return;
    }

    sub.totalSeats += count;
    sub.availableSeats += count;

    RealtimeEngine.logAuditEvent({
      actor: AuthEngine.getCurrentUser() ? AuthEngine.getCurrentUser().name : "Admin",
      role: "ADMIN",
      action: "SUBSCRIPTION_SEATS_EXTENDED",
      resource: `Added ${count} seats to ${sub.name} (Total: ${sub.totalSeats})`,
      status: "SUCCESS"
    });

    RealtimeEngine.showToast({
      title: "Seats Extended",
      message: `Added ${count} seats to ${sub.name}. Available seats: ${sub.availableSeats}.`,
      type: "success"
    });

    refreshSubscriptionsUI();
  }

  /**
   * User Provisioning: Add Educator Modal
   */
  function openAddProvisionModal() {
    const bodyHtml = `
      <form id="add-provision-form" onsubmit="AdminPortal.handleSaveProvisionUser(event)">
        <p style="font-size: 13px; color: var(--text-secondary); margin-bottom: 16px;">
          Grant software access by provisioning an educator's valid university email address. Each assigned software suite consumes 1 seat from the available quota.
        </p>
        <div class="form-group">
          <label class="form-label">Educator Full Name</label>
          <input type="text" id="prov-name" class="form-control" placeholder="e.g. Dr. Bhavin Patel" required>
        </div>
        <div class="form-group">
          <label class="form-label">Valid University Email Address</label>
          <input type="email" id="prov-email" class="form-control" placeholder="e.g. bhavin.patel@paruluniversity.ac.in" required>
          <small style="color: var(--text-muted); font-size: 11px;">Must end with @paruluniversity.ac.in</small>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
          <div class="form-group">
            <label class="form-label">Academic Department</label>
            <select id="prov-dept" class="form-control" required>
              <option value="Computer Science & Engineering">Computer Science &amp; Engineering</option>
              <option value="Artificial Intelligence">Artificial Intelligence</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Mechanical Engineering">Mechanical Engineering</option>
              <option value="Civil Engineering">Civil Engineering</option>
              <option value="Electrical Engineering">Electrical Engineering</option>
              <option value="Applied Sciences & Humanities">Applied Sciences &amp; Humanities</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Assigned Institutional Role</label>
            <select id="prov-role" class="form-control" required>
              <option value="Educator">Educator / Faculty</option>
              <option value="Tech Instructor">Tech Instructor</option>
              <option value="Departmental Supervisor">Departmental Supervisor</option>
              <option value="Organization Administrator">Organization Administrator</option>
            </select>
          </div>
        </div>

        <div class="form-group" style="margin-top: 10px;">
          <label class="form-label">Grant Software Access (Select Suites):</label>
          <div style="display: flex; flex-direction: column; gap: 8px; background: var(--bg-subtle); padding: 14px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
            ${PU_DATA.smartSubscriptions.map(s => `
              <label style="display: flex; align-items: center; justify-content: space-between; font-size: 13px; cursor: pointer;">
                <span style="display: flex; align-items: center; gap: 8px;">
                  <input type="checkbox" name="prov-suites" value="${s.name}" ${s.availableSeats > 0 ? 'checked' : 'disabled'}>
                  <strong>${s.name}</strong>
                </span>
                <span class="badge ${s.availableSeats > 0 ? 'badge-success' : 'badge-danger'}" style="font-size: 11px;">
                  ${s.availableSeats > 0 ? `${s.availableSeats} Seats Available` : 'Seat Pool Exhausted'}
                </span>
              </label>
            `).join('')}
          </div>
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px;">
          <button type="button" class="btn btn-secondary" onclick="AdminPortal.closeModal()">Cancel</button>
          <button type="submit" class="btn btn-primary">➕ Provision &amp; Grant Access</button>
        </div>
      </form>
    `;
    showModal("➕ Provision Educator & Grant Software Access", bodyHtml);
  }

  function handleSaveProvisionUser(e) {
    e.preventDefault();
    const name = document.getElementById('prov-name').value.trim();
    const email = document.getElementById('prov-email').value.trim();
    const dept = document.getElementById('prov-dept').value;
    const role = document.getElementById('prov-role').value;

    const checkedBoxes = Array.from(document.querySelectorAll('input[name="prov-suites"]:checked'));
    const selectedSuites = checkedBoxes.map(cb => cb.value);

    if (selectedSuites.length === 0) {
      alert("Please select at least one software suite to grant access.");
      return;
    }

    if (!email.includes('@paruluniversity.ac.in')) {
      alert("Please enter an official Parul University email address (@paruluniversity.ac.in).");
      return;
    }

    if (PU_DATA.provisionedUsers.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      alert(`User with email ${email} is already provisioned.`);
      return;
    }

    // Allocate seats
    selectedSuites.forEach(sName => {
      const sub = PU_DATA.smartSubscriptions.find(s => s.name === sName);
      if (sub && sub.availableSeats > 0) {
        sub.allocatedSeats += 1;
        sub.availableSeats -= 1;
      }
    });

    const newUser = {
      id: `PROV-${String(PU_DATA.provisionedUsers.length + 1).padStart(2, '0')}`,
      name: name,
      email: email,
      department: dept,
      role: role,
      subscriptions: selectedSuites,
      status: "Active",
      addedDate: new Date().toISOString().split('T')[0],
      avatarText: name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    };

    PU_DATA.provisionedUsers.unshift(newUser);

    RealtimeEngine.logAuditEvent({
      actor: AuthEngine.getCurrentUser() ? AuthEngine.getCurrentUser().name : "Admin",
      role: "ADMIN",
      action: "USER_PROVISIONED",
      resource: `Provisioned ${name} (${email}) with access to: ${selectedSuites.join(', ')}`,
      status: "SUCCESS"
    });

    RealtimeEngine.showToast({
      title: "Educator Provisioned!",
      message: `Software access granted to ${name}. Seat allocations updated.`,
      type: "success"
    });

    closeModal();
    filterProvisionTable();
    refreshSubscriptionsUI();
  }

  /**
   * User Provisioning: Edit Access Modal
   */
  function openEditProvisionModal(userId) {
    const user = PU_DATA.provisionedUsers.find(u => u.id === userId);
    if (!user) return;

    const bodyHtml = `
      <form id="edit-provision-form" onsubmit="AdminPortal.handleUpdateProvisionUser(event, '${user.id}')">
        <div class="form-group">
          <label class="form-label">Educator Full Name</label>
          <input type="text" id="edit-prov-name" class="form-control" value="${user.name}" required>
        </div>
        <div class="form-group">
          <label class="form-label">University Email Address</label>
          <input type="email" id="edit-prov-email" class="form-control" value="${user.email}" required>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
          <div class="form-group">
            <label class="form-label">Academic Department</label>
            <input type="text" id="edit-prov-dept" class="form-control" value="${user.department}" required>
          </div>
          <div class="form-group">
            <label class="form-label">Role</label>
            <select id="edit-prov-role" class="form-control">
              <option value="Educator" ${user.role === 'Educator' ? 'selected' : ''}>Educator / Faculty</option>
              <option value="Tech Instructor" ${user.role === 'Tech Instructor' ? 'selected' : ''}>Tech Instructor</option>
              <option value="Departmental Supervisor" ${user.role === 'Departmental Supervisor' ? 'selected' : ''}>Departmental Supervisor</option>
              <option value="Organization Administrator" ${user.role === 'Organization Administrator' ? 'selected' : ''}>Organization Administrator</option>
            </select>
          </div>
        </div>

        <div class="form-group" style="margin-top: 10px;">
          <label class="form-label">Modify Software Access Suites:</label>
          <div style="display: flex; flex-direction: column; gap: 8px; background: var(--bg-subtle); padding: 14px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
            ${PU_DATA.smartSubscriptions.map(s => {
              const hasAccess = user.subscriptions.some(subName => s.name.toLowerCase().includes(subName.toLowerCase()) || subName.toLowerCase().includes(s.name.toLowerCase()));
              return `
                <label style="display: flex; align-items: center; justify-content: space-between; font-size: 13px; cursor: pointer;">
                  <span style="display: flex; align-items: center; gap: 8px;">
                    <input type="checkbox" name="edit-prov-suites" value="${s.name}" ${hasAccess ? 'checked' : ''}>
                    <strong>${s.name}</strong>
                  </span>
                  <span class="badge ${hasAccess ? 'badge-primary' : (s.availableSeats > 0 ? 'badge-success' : 'badge-danger')}" style="font-size: 11px;">
                    ${hasAccess ? 'Currently Assigned' : `${s.availableSeats} Available`}
                  </span>
                </label>
              `;
            }).join('')}
          </div>
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px;">
          <button type="button" class="btn btn-secondary" onclick="AdminPortal.closeModal()">Cancel</button>
          <button type="submit" class="btn btn-primary">💾 Update Access Settings</button>
        </div>
      </form>
    `;
    showModal(`✏️ Update Software Access: ${user.name}`, bodyHtml);
  }

  function handleUpdateProvisionUser(e, userId) {
    e.preventDefault();
    const user = PU_DATA.provisionedUsers.find(u => u.id === userId);
    if (!user) return;

    const name = document.getElementById('edit-prov-name').value.trim();
    const email = document.getElementById('edit-prov-email').value.trim();
    const dept = document.getElementById('edit-prov-dept').value.trim();
    const role = document.getElementById('edit-prov-role').value;

    const checkedBoxes = Array.from(document.querySelectorAll('input[name="edit-prov-suites"]:checked'));
    const newSuites = checkedBoxes.map(cb => cb.value);

    if (newSuites.length === 0) {
      alert("Please select at least one software suite.");
      return;
    }

    // Reconcile seat changes
    // 1. Release removed suites
    user.subscriptions.forEach(oldSuite => {
      if (!newSuites.includes(oldSuite)) {
        const sub = PU_DATA.smartSubscriptions.find(s => s.name === oldSuite);
        if (sub && sub.allocatedSeats > 0) {
          sub.allocatedSeats -= 1;
          sub.availableSeats += 1;
        }
      }
    });

    // 2. Allocate newly added suites
    newSuites.forEach(newSuite => {
      if (!user.subscriptions.includes(newSuite)) {
        const sub = PU_DATA.smartSubscriptions.find(s => s.name === newSuite);
        if (sub && sub.availableSeats > 0) {
          sub.allocatedSeats += 1;
          sub.availableSeats -= 1;
        }
      }
    });

    user.name = name;
    user.email = email;
    user.department = dept;
    user.role = role;
    user.subscriptions = newSuites;

    RealtimeEngine.logAuditEvent({
      actor: AuthEngine.getCurrentUser() ? AuthEngine.getCurrentUser().name : "Admin",
      role: "ADMIN",
      action: "USER_PROVISION_UPDATED",
      resource: `Updated software access for ${name} (${email}): ${newSuites.join(', ')}`,
      status: "SUCCESS"
    });

    RealtimeEngine.showToast({
      title: "Provisioning Updated",
      message: `Updated software access profile for ${name}.`,
      type: "success"
    });

    closeModal();
    filterProvisionTable();
    refreshSubscriptionsUI();
  }

  /**
   * User Provisioning: Revoke Access
   */
  function handleRevokeProvisionUser(userId) {
    const user = PU_DATA.provisionedUsers.find(u => u.id === userId);
    if (!user) return;

    if (!confirm(`Are you sure you want to revoke software access for ${user.name} (${user.email})? Software licenses and allocated seats will be immediately returned to the available seat pool.`)) {
      return;
    }

    // Return seats back to pool
    user.subscriptions.forEach(sName => {
      const sub = PU_DATA.smartSubscriptions.find(s => s.name.toLowerCase().includes(sName.toLowerCase()) || sName.toLowerCase().includes(s.name.toLowerCase()));
      if (sub && sub.allocatedSeats > 0) {
        sub.allocatedSeats -= 1;
        sub.availableSeats += 1;
      }
    });

    const idx = PU_DATA.provisionedUsers.findIndex(u => u.id === userId);
    PU_DATA.provisionedUsers.splice(idx, 1);

    RealtimeEngine.logAuditEvent({
      actor: AuthEngine.getCurrentUser() ? AuthEngine.getCurrentUser().name : "Admin",
      role: "ADMIN",
      action: "USER_PROVISION_REVOKED",
      resource: `Revoked software licenses for ${user.name} (${user.email}). Released seats back to pool.`,
      status: "SUCCESS"
    });

    RealtimeEngine.showToast({
      title: "Software Access Revoked",
      message: `Revoked software access for ${user.name}. Available seat pool restored.`,
      type: "info"
    });

    filterProvisionTable();
    refreshSubscriptionsUI();
  }

  /**
   * Filter Provision Table by query and suite
   */
  function filterProvisionTable() {
    const query = (document.getElementById('provision-search-input') ? document.getElementById('provision-search-input').value : '').toLowerCase().trim();
    const suiteFilter = document.getElementById('provision-filter-suite') ? document.getElementById('provision-filter-suite').value : 'ALL';

    const filtered = PU_DATA.provisionedUsers.filter(u => {
      const matchesQuery = !query || u.name.toLowerCase().includes(query) || u.email.toLowerCase().includes(query) || u.department.toLowerCase().includes(query);
      const matchesSuite = suiteFilter === 'ALL' || u.subscriptions.some(s => s.toLowerCase().includes(suiteFilter.toLowerCase()));
      return matchesQuery && matchesSuite;
    });

    const tbody = document.getElementById('admin-provision-tbody');
    if (tbody) tbody.innerHTML = renderProvisionRows(filtered);

    const countBadge = document.getElementById('provision-count-badge');
    if (countBadge) countBadge.innerText = `${filtered.length} Active Educators`;
  }

  /**
   * Role Assignment: In-Line Role Change
   */
  function handleInlineRoleChange(roleId, newRole) {
    const roleObj = PU_DATA.organizationRoles.find(r => r.id === roleId);
    if (!roleObj) return;

    const oldRole = roleObj.role;
    roleObj.role = newRole;

    if (newRole === 'Organization Administrator') {
      roleObj.scope = "User Provisioning, Seat Quota Management & Educator Onboarding";
      roleObj.statusBadge = "badge-primary";
    } else if (newRole === 'Tech Instructor') {
      roleObj.scope = "Smart Display Hardware Calibration & Interactive Curriculum Training";
      roleObj.statusBadge = "badge-gold";
    } else if (newRole === 'Departmental Supervisor') {
      roleObj.scope = "Faculty Attendance, Software Utilization Audit & Academic Compliance";
      roleObj.statusBadge = "badge-info";
    }

    RealtimeEngine.logAuditEvent({
      actor: AuthEngine.getCurrentUser() ? AuthEngine.getCurrentUser().name : "Admin",
      role: "ADMIN",
      action: "ROLE_ASSIGNMENT_UPDATED",
      resource: `Reassigned ${roleObj.name} from [${oldRole}] to [${newRole}]`,
      status: "SUCCESS"
    });

    RealtimeEngine.showToast({
      title: "Role Assignment Updated",
      message: `${roleObj.name} has been assigned as ${newRole} for Parul University.`,
      type: "success"
    });
  }

  /**
   * Role Assignment: Add New Role Modal
   */
  function openAssignRoleModal() {
    const bodyHtml = `
      <form id="assign-role-form" onsubmit="AdminPortal.handleSaveNewRole(event)">
        <p style="font-size: 13px; color: var(--text-secondary); margin-bottom: 16px;">
          Delegate operational permissions by assigning an administrative, tech instruction, or supervisory role to an existing staff member.
        </p>
        <div class="form-group">
          <label class="form-label">Staff Member Full Name</label>
          <input type="text" id="role-staff-name" class="form-control" placeholder="e.g. Dr. Ramesh Chokshi" required>
        </div>
        <div class="form-group">
          <label class="form-label">University Email Address</label>
          <input type="email" id="role-staff-email" class="form-control" placeholder="e.g. ramesh.chokshi@paruluniversity.ac.in" required>
        </div>
        <div class="form-group">
          <label class="form-label">Academic Department</label>
          <input type="text" id="role-staff-dept" class="form-control" value="Faculty of Engineering & Technology" required>
        </div>
        <div class="form-group">
          <label class="form-label">Select Assigned Role</label>
          <select id="role-staff-type" class="form-control" required>
            <option value="Organization Administrator">Organization Administrator (User Provisioning & Quotas)</option>
            <option value="Tech Instructor">Tech Instructor (Hardware Calibration & Interactive Delivery)</option>
            <option value="Departmental Supervisor">Departmental Supervisor (Faculty Attendance & Compliance)</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Custom Operational Scope Description</label>
          <input type="text" id="role-staff-scope" class="form-control" placeholder="e.g. Mechanical Department Lab Lead & Display Proctor" required>
        </div>
        <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px;">
          <button type="button" class="btn btn-secondary" onclick="AdminPortal.closeModal()">Cancel</button>
          <button type="submit" class="btn btn-primary">➕ Authorize &amp; Assign Role</button>
        </div>
      </form>
    `;
    showModal("➕ Assign Organization Role", bodyHtml);
  }

  function handleSaveNewRole(e) {
    e.preventDefault();
    const name = document.getElementById('role-staff-name').value.trim();
    const email = document.getElementById('role-staff-email').value.trim();
    const dept = document.getElementById('role-staff-dept').value.trim();
    const role = document.getElementById('role-staff-type').value;
    const scope = document.getElementById('role-staff-scope').value.trim();

    const newRoleObj = {
      id: `ROLE-${String(PU_DATA.organizationRoles.length + 1).padStart(2, '0')}`,
      name: name,
      email: email,
      role: role,
      department: dept,
      scope: scope,
      assignedBy: AuthEngine.getCurrentUser() ? AuthEngine.getCurrentUser().name : "Dr. Ketan Kotecha",
      assignedDate: new Date().toISOString().split('T')[0],
      status: "Active",
      statusBadge: role.includes('Admin') ? 'badge-primary' : (role.includes('Tech') ? 'badge-gold' : 'badge-info')
    };

    PU_DATA.organizationRoles.push(newRoleObj);

    RealtimeEngine.logAuditEvent({
      actor: AuthEngine.getCurrentUser() ? AuthEngine.getCurrentUser().name : "Admin",
      role: "ADMIN",
      action: "ROLE_ASSIGNED",
      resource: `Assigned role [${role}] to ${name} (${email})`,
      status: "SUCCESS"
    });

    RealtimeEngine.showToast({
      title: "Role Assigned Successfully",
      message: `${name} has been assigned as ${role}.`,
      type: "success"
    });

    closeModal();
    const tbody = document.getElementById('admin-roles-tbody');
    if (tbody) tbody.innerHTML = renderRoleRows(PU_DATA.organizationRoles);
  }

  function handleRemoveRole(roleId) {
    const roleObj = PU_DATA.organizationRoles.find(r => r.id === roleId);
    if (!roleObj) return;

    if (!confirm(`Are you sure you want to remove the assigned role for ${roleObj.name} (${roleObj.role})?`)) {
      return;
    }

    const idx = PU_DATA.organizationRoles.findIndex(r => r.id === roleId);
    PU_DATA.organizationRoles.splice(idx, 1);

    RealtimeEngine.logAuditEvent({
      actor: AuthEngine.getCurrentUser() ? AuthEngine.getCurrentUser().name : "Admin",
      role: "ADMIN",
      action: "ROLE_ASSIGNMENT_REMOVED",
      resource: `Removed role [${roleObj.role}] from ${roleObj.name}`,
      status: "SUCCESS"
    });

    RealtimeEngine.showToast({
      title: "Role Removed",
      message: `Role assignment for ${roleObj.name} has been removed.`,
      type: "info"
    });

    const tbody = document.getElementById('admin-roles-tbody');
    if (tbody) tbody.innerHTML = renderRoleRows(PU_DATA.organizationRoles);
  }

  /**
   * Refreshes dynamic metrics and subscription cards
   */
  function refreshSubscriptionsUI() {
    const grid = document.getElementById('admin-subscriptions-grid');
    if (grid) grid.innerHTML = renderSubscriptionCards();

    const totalSeats = PU_DATA.smartSubscriptions.reduce((sum, s) => sum + s.totalSeats, 0);
    const totalAllocated = PU_DATA.smartSubscriptions.reduce((sum, s) => sum + s.allocatedSeats, 0);
    const totalAvailable = PU_DATA.smartSubscriptions.reduce((sum, s) => sum + s.availableSeats, 0);

    const allocEl = document.getElementById('stat-allocated-seats');
    if (allocEl) allocEl.innerText = `${totalAllocated.toLocaleString()} / ${totalSeats.toLocaleString()}`;

    const availEl = document.getElementById('stat-available-seats');
    if (availEl) availEl.innerText = totalAvailable.toLocaleString();

    const provEl = document.getElementById('stat-provisioned-users');
    if (provEl) provEl.innerText = `${PU_DATA.provisionedUsers.length} Educators`;

    const countBadge = document.getElementById('provision-count-badge');
    if (countBadge) countBadge.innerText = `${PU_DATA.provisionedUsers.length} Active Educators`;
  }

  /**
   * Renders the master database enrollment rows
   */
  function renderMasterEnrollmentRows() {
    return PU_DATA.masterEnrollments.map(item => `
      <tr>
        <td><code>${item.enrollmentNo}</code></td>
        <td><strong>${item.name}</strong></td>
        <td>${item.program}</td>
        <td><span class="badge ${item.section === '6A' ? 'badge-primary' : 'badge-gold'}" style="font-size: 11px; padding: 2px 7px;">${item.section} (Div ${item.section === '6A' ? 'A' : 'B'})</span></td>
        <td>
          ${item.registered 
            ? '<span class="badge badge-success">✓ Registered</span>' 
            : '<span class="badge badge-gold">⏳ Master DB Ready (Unregistered)</span>'}
        </td>
        <td style="text-align: center;">
          <button class="btn btn-secondary btn-sm" style="padding: 2px 8px; color: #DC2626; font-size: 11px;" onclick="AdminPortal.handleDeleteMasterEnrollment('${item.enrollmentNo}')" title="Delete enrollment record">
            🗑️ Delete
          </button>
        </td>
      </tr>
    `).join('');
  }

  /**
   * Renders audit log rows
   */
  function renderAuditRows() {
    return PU_DATA.auditLogs.map(log => `
      <tr>
        <td><small style="font-family: monospace;">${log.timestamp}</small></td>
        <td><code>${log.id}</code></td>
        <td><strong>${log.actor}</strong></td>
        <td><span class="audit-role-tag audit-role-${log.role.toLowerCase()}">${log.role}</span></td>
        <td><span class="audit-action-tag">${log.action}</span></td>
        <td style="color: var(--text-secondary);">${log.resource}</td>
        <td><small style="font-family: monospace;">${log.ip}</small></td>
        <td><span class="badge ${log.status === 'SUCCESS' ? 'badge-success' : 'badge-gold'}">${log.status}</span></td>
      </tr>
    `).join('');
  }

  /**
   * Prepend new audit log row in real-time with highlight animation
   */
  function prependAuditLogRow(log) {
    const tbody = document.getElementById('admin-audit-stream-tbody');
    if (!tbody) return;

    const row = document.createElement('tr');
    row.className = 'new-entry';
    row.innerHTML = `
      <td><small style="font-family: monospace;">${log.timestamp}</small></td>
      <td><code>${log.id}</code></td>
      <td><strong>${log.actor}</strong></td>
      <td><span class="audit-role-tag audit-role-${log.role.toLowerCase()}">${log.role}</span></td>
      <td><span class="audit-action-tag">${log.action}</span></td>
      <td style="color: var(--text-secondary);">${log.resource}</td>
      <td><small style="font-family: monospace;">${log.ip}</small></td>
      <td><span class="badge ${log.status === 'SUCCESS' ? 'badge-success' : 'badge-gold'}">${log.status}</span></td>
    `;

    tbody.insertBefore(row, tbody.firstChild);
  }

  /**
   * Add new master enrollment to Registrar's DB
   */
  function handleAddMasterEnrollment(e) {
    e.preventDefault();
    const adminUser = AuthEngine.getCurrentUser();
    const enr = document.getElementById('new-enr-no').value.trim();
    const name = document.getElementById('new-enr-name').value.trim();
    const program = document.getElementById('new-enr-program').value.trim();
    const sec = document.getElementById('new-enr-sec').value.trim();

    if (PU_DATA.masterEnrollments.some(item => item.enrollmentNo === enr)) {
      alert(`Enrollment number ${enr} already exists in Registrar Master DB.`);
      return;
    }

    const newRecord = {
      enrollmentNo: enr,
      name: name,
      program: program,
      semester: 6,
      section: sec,
      registered: false
    };

    PU_DATA.masterEnrollments.unshift(newRecord);

    RealtimeEngine.logAuditEvent({
      actor: adminUser.name,
      role: "ADMIN",
      action: "MASTER_ENROLLMENT_ADDED",
      resource: `Authorized Enrollment #${enr} (${name})`,
      status: "SUCCESS"
    });

    RealtimeEngine.showToast({
      title: "Enrollment Authorized!",
      message: `Candidate ${name} (${enr}) added to Registrar Master DB. Ready for registration verification.`,
      type: "success"
    });

    const tbody = document.getElementById('admin-master-enrollment-tbody');
    if (tbody) tbody.innerHTML = renderMasterEnrollmentRows();

    document.getElementById('add-enrollment-form').reset();
  }

  /**
   * Publishes semester examination results
   */
  function publishSemesterResults() {
    const adminUser = AuthEngine.getCurrentUser();

    // Broadcast result published event
    RealtimeEngine.broadcastEvent('EXAM_RESULTS_PUBLISHED', {
      semester: 6,
      publishedBy: adminUser.name,
      timestamp: new Date().toISOString()
    });

    RealtimeEngine.logAuditEvent({
      actor: adminUser.name,
      role: "ADMIN",
      action: "EXAM_RESULTS_PUBLISHED",
      resource: "Semester 6 Final Examination Results",
      status: "SUCCESS"
    });

    RealtimeEngine.showToast({
      title: "Semester Results Published!",
      message: "Published official results for Semester 6. Real-time broadcast pushed to all students.",
      type: "success"
    });

    // Re-render
    const targetContent = document.getElementById('portal-view-container');
    if (targetContent) {
      render(targetContent);
      switchTab('exams');
    }
  }

  function triggerSystemHealthCheck() {
    RealtimeEngine.showToast({
      title: "Database Health Check: 100% OK",
      message: "Change Data Capture (CDC) stream verified. Active replica nodes in sync.",
      type: "info"
    });
  }

  function exportAuditCSV() {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Timestamp,LogID,Actor,Role,Action,Resource,IP,Status\n" + 
      PU_DATA.auditLogs.map(l => `"${l.timestamp}","${l.id}","${l.actor}","${l.role}","${l.action}","${l.resource}","${l.ip}","${l.status}"`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Parul_SMIS_Audit_Trail_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  /**
   * Switch between subtabs
   */
  function switchTab(tabId) {
    document.querySelectorAll('.portal-subtabs .subtab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.subtab-content').forEach(c => c.classList.remove('active'));

    const activeBtn = event ? event.currentTarget : document.querySelector(`.subtab-btn[onclick*="${tabId}"]`);
    if (activeBtn) activeBtn.classList.add('active');

    const targetContent = document.getElementById(`admin-tab-${tabId}`);
    if (targetContent) targetContent.classList.add('active');
  }

  /**
   * Delete a student enrollment from Registrar's DB
   */
  function handleDeleteMasterEnrollment(enrNo) {
    if (!confirm(`Are you sure you want to remove Enrollment #${enrNo} from the Registrar Master Database?`)) {
      return;
    }
    const adminUser = AuthEngine.getCurrentUser();
    const idx = PU_DATA.masterEnrollments.findIndex(m => m.enrollmentNo === enrNo);
    if (idx !== -1) {
      const removed = PU_DATA.masterEnrollments.splice(idx, 1)[0];
      RealtimeEngine.logAuditEvent({
        actor: adminUser ? adminUser.name : "Admin",
        role: "ADMIN",
        action: "MASTER_ENROLLMENT_DELETED",
        resource: `Removed Enrollment #${enrNo} (${removed.name})`,
        status: "SUCCESS"
      });
      RealtimeEngine.showToast({
        title: "Enrollment Removed",
        message: `Candidate ${removed.name} (#${enrNo}) has been deleted from Registrar Master DB.`,
        type: "info"
      });
      const tbody = document.getElementById('admin-master-enrollment-tbody');
      if (tbody) tbody.innerHTML = renderMasterEnrollmentRows();
      const countBadge = document.getElementById('admin-master-db-count');
      if (countBadge) countBadge.innerText = `${PU_DATA.masterEnrollments.length} Records`;
    }
  }

  return {
    render,
    switchTab,
    renderMasterEnrollmentRows,
    renderAuditRows,
    prependAuditLogRow,
    handleAddMasterEnrollment,
    handleDeleteMasterEnrollment,
    publishSemesterResults,
    triggerSystemHealthCheck,
    exportAuditCSV,
    // SMART Subsystem Public Functions
    togglePasswordVisibility,
    verifyDomainEmail,
    openInviteAdminModal,
    handleSendAdminInvite,
    openUpdateRegistrationModal,
    handleSaveRegistrationDetails,
    openViewReceiptModal,
    openClaimKeyModal,
    handleClaimProductKey,
    extendSeatsPrompt,
    openAddProvisionModal,
    handleSaveProvisionUser,
    openEditProvisionModal,
    handleUpdateProvisionUser,
    handleRevokeProvisionUser,
    filterProvisionTable,
    openAssignRoleModal,
    handleSaveNewRole,
    handleInlineRoleChange,
    handleRemoveRole,
    closeModal,
    refreshSubscriptionsUI
  };
})();
