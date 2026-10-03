/**
 * PARUL UNIVERSITY ERP - FACULTY PORTAL MODULE
 * Handles:
 * 1. Comprehensive Faculty Dashboard with embedded widgets (Schedule, Biometrics, Leaves, Pay Slip, Bus Pass, Bookings, Circulars, Student Directory)
 * 2. Capstone & Project Guide Allocation Desk (Matching Laptop Screen in photo)
 * 3. Attendance Entry Console with Hourly "Mark All Present/Absent" & Broadcast
 * 4. Timetable & Classroom Management (Personal & Division Timetables)
 * 5. Marks & Evaluation Panel (Continuous Assessment & Mid-Sem Scores)
 * 6. Student Outpass & Digital Gatepass Approval Desk
 *
 * NOTE: Strictly isolated to .faculty-portal and faculty-* namespaces to prevent
 * any collision with the student portal dashboard.
 */

const FacultyPortal = (function() {
  let activeCourseCode = "CS601";
  let activeSlot = "10:00 AM - 11:00 AM";
  let activeSection = "6A";
  let rosterAttendanceState = {};
  let currentProjectFilter = "ALL";
  let activeDivisionTimetable = "6A";

  /**
   * Initializes roster state for attendance entry
   */
  function initRosterState() {
    (PU_DATA.studentRoster || []).forEach(student => {
      rosterAttendanceState[student.id] = 'PRESENT';
    });
  }

  /**
   * Returns student roster filtered by activeSection ('6A', '6B', or 'ALL')
   */
  function getFilteredRoster() {
    const roster = PU_DATA.studentRoster || [];
    if (!activeSection || activeSection === 'ALL') {
      return roster;
    }
    return roster.filter(s => (s.section || '6A') === activeSection);
  }

  /**
   * Main render function for the Faculty Portal
   */
  function render(container) {
    const user = AuthEngine.getCurrentUser();
    if (!user) return;

    initRosterState();

    // Determine allocated courses for this faculty
    const facultyCourses = (PU_DATA.courses || []).filter(c => 
      c.facultyId === user.employeeId || 
      (user.courses && user.courses.includes(c.code)) ||
      c.faculty === user.name
    );
    const allocatedCodes = facultyCourses.length > 0 ? facultyCourses.map(c => c.code) : (user.courses || ["CS601", "CS604"]);
    if (!allocatedCodes.includes(activeCourseCode)) {
      activeCourseCode = allocatedCodes[0];
    }

    const courseSelectOptions = (facultyCourses.length > 0 ? facultyCourses : (PU_DATA.courses || []).slice(0, 2)).map(c => 
      `<option value="${c.code}" ${c.code === activeCourseCode ? 'selected' : ''}>${c.code}: ${c.title}</option>`
    ).join('');

    const currentCourseObj = (PU_DATA.courses || []).find(c => c.code === activeCourseCode) || { code: activeCourseCode, title: "Course Evaluation" };
    const pendingOutpasses = (PU_DATA.outpasses || []).filter(op => op.status === 'PENDING').length;

    // Faculty allocated projects count
    const myProjects = (PU_DATA.projectAllocations || []).filter(p => 
      p.allocatedGuide.toLowerCase().includes(user.name.toLowerCase().split(' ').pop()) ||
      p.guideEmpId === user.employeeId
    );
    const totalProjectsCount = (PU_DATA.projectAllocations || []).length;
    const leaves = PU_DATA.facultyLeaves || { balances: { casualLeave: { remaining: 4 }, sickLeave: { remaining: 8 }, dutyLeave: { remaining: 4 }, earnedLeave: { remaining: 12 } }, history: [] };
    const paySlip = PU_DATA.facultyPaySlip || { netSalary: 99888, grossPay: 120576 };
    const busPass = PU_DATA.facultyBusPass || { routeNo: "14", busNumber: "GJ-06-PU-5542" };

    container.innerHTML = `
      <div class="faculty-portal">
        <!-- Faculty Hero Banner -->
        <div class="portal-hero-banner">
          <div class="portal-hero-info">
            <h2>Good Afternoon, ${user.name} 👨‍🏫</h2>
            <p style="color: #FCD34D; font-weight: 600;">${user.designation || 'Assistant Professor & Project Guide'} | Department of ${user.department || 'Computer Science & Engineering'}</p>
            <div class="portal-hero-meta">
              <span><strong>Employee ID:</strong> ${user.employeeId || 'PU-FAC-3012'}</span>
              <span><strong>Allocated Courses:</strong> ${allocatedCodes.join(', ')}</span>
              <span><strong>Sections:</strong> CSE-6A, CSE-6B</span>
              <span><strong>Capstone Projects:</strong> ${myProjects.length > 0 ? myProjects.length : 5} Guided Projects</span>
              <span><strong>Academic Year:</strong> 2025 - 2026 (Even Sem)</span>
            </div>
          </div>
          <div class="portal-hero-badges">
            <span class="badge badge-gold" style="font-size: 13px; padding: 6px 14px;">Senior Guide & Faculty Clearance Active</span>
            <span class="badge ${pendingOutpasses > 0 ? 'badge-danger' : 'badge-success'}" style="font-size: 12px;">
              ${pendingOutpasses} Pending Student Outpasses
            </span>
          </div>
        </div>

        <!-- Navigation Subtabs -->
        <div class="portal-subtabs">
          <button class="subtab-btn active" onclick="FacultyPortal.switchTab('dashboard')">
            📊 Faculty Dashboard
          </button>
          <button class="subtab-btn" onclick="FacultyPortal.switchTab('profile')">
            👤 Profile & Portfolio
          </button>
          <button class="subtab-btn" onclick="FacultyPortal.switchTab('projects')">
            💻 Capstone & Project Guide Desk (${totalProjectsCount})
          </button>
          <button class="subtab-btn" onclick="FacultyPortal.switchTab('attendance')">
            📝 Attendance Entry Console
          </button>
          <button class="subtab-btn" onclick="FacultyPortal.switchTab('classrooms')">
            🏫 Timetable & Classrooms
          </button>
          <button class="subtab-btn" onclick="FacultyPortal.switchTab('marks')">
            📊 Marks & Evaluation Panel
          </button>
          <button class="subtab-btn" onclick="FacultyPortal.switchTab('outpasses')">
            🎫 Outpass / Leave Approvals (${pendingOutpasses})
          </button>
        </div>

        <!-- ===================================================================
             TAB 0: FACULTY DASHBOARD (ALL 15 CONTENTS EMBEDDED DIRECTLY)
             =================================================================== -->
        <div id="faculty-tab-dashboard" class="subtab-content active">

          <!-- Faculty Quick Profile & Credentials Highlight Banner -->
          <div class="card" style="margin-bottom: 20px; background: linear-gradient(135deg, rgba(128, 0, 32, 0.08) 0%, rgba(37, 99, 235, 0.08) 100%); border-left: 5px solid var(--pu-maroon-primary);">
            <div style="display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap;">
              <div style="display: flex; align-items: center; gap: 14px;">
                <div style="width: 52px; height: 52px; border-radius: var(--radius-lg); background: var(--pu-maroon-primary); color: white; display: flex; align-items: center; justify-content: center; font-size: 22px; font-weight: 800; overflow: hidden; box-shadow: 0 4px 12px rgba(128,0,32,0.25);">
                  ${user.photoUrl ? `<img src="${user.photoUrl}" style="width: 100%; height: 100%; object-fit: cover;">` : (user.avatarText || 'RS')}
                </div>
                <div>
                  <h4 style="margin: 0; font-size: 16px; font-weight: 800; color: var(--text-primary); display: flex; align-items: center; gap: 8px;">
                    ${user.name}
                    <span class="badge badge-success" style="font-size: 11px;">Institute ID: ${user.instituteId || 'PU-FET-VADODARA-104'}</span>
                    <span class="badge badge-primary" style="font-size: 11px;">Staff ID: ${user.employeeId || 'PU-FAC-8821'}</span>
                  </h4>
                  <p style="margin: 3px 0 0 0; font-size: 12.5px; color: var(--text-muted);">
                    ${user.designation || 'Associate Professor & Senior Proctor'} &bull; Department of ${user.department || 'Computer Science & Engineering'} &bull; 18.2 Yrs Exp &bull; 34 Publications &bull; 3 Patents
                  </p>
                </div>
              </div>
              <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
                <button class="btn btn-primary btn-sm" onclick="FacultyPortal.switchTab('profile')">
                  👤 View Full Profile & Dossier &rarr;
                </button>
              </div>
            </div>
          </div>

          <!-- Top KPI Stats Grid -->
          <div class="stats-grid">
            <div class="stat-card blue">
              <div class="stat-icon">🧮</div>
              <div class="stat-content">
                <span class="stat-value">16 Hrs / Wk</span>
                <span class="stat-label">Teaching Workload (Approved by Dean)</span>
              </div>
            </div>

            <div class="stat-card green">
              <div class="stat-icon">⏱️</div>
              <div class="stat-content">
                <span class="stat-value">08:51 AM</span>
                <span class="stat-label">Biometric Punch In &bull; ON TIME</span>
              </div>
            </div>

            <div class="stat-card gold">
              <div class="stat-icon">🏖️</div>
              <div class="stat-content">
                <span class="stat-value">28 Days</span>
                <span class="stat-label">Total Leave Balance (4 CL, 8 SL, 4 DL, 12 EL)</span>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-icon">🧾</div>
              <div class="stat-content">
                <span class="stat-value">₹${paySlip.netSalary.toLocaleString()}</span>
                <span class="stat-label">Net Salary (Sep 2026 Disbursed)</span>
              </div>
            </div>
          </div>

          <!-- Section 1: Today's Schedule & Biometric In/Out Punch Register -->
          <div class="faculty-dashboard-row">
            <!-- Today's Schedule -->
            <div class="card">
              <div class="card-header">
                <div>
                  <h3 class="card-title">🗓️ Today's Lecture Schedule (Tuesday)</h3>
                  <p class="page-subtitle">Current Academic Routine &bull; Computer Science & Engineering</p>
                </div>
                <span class="badge badge-primary">Active Slot: 10:00 - 11:00 AM</span>
              </div>

              <div class="table-responsive">
                <table class="data-table">
                  <thead>
                    <tr>
                      <th>Time Slot</th>
                      <th>Course & Title</th>
                      <th>Venue</th>
                      <th>Division</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style="background: rgba(128, 0, 32, 0.05); font-weight: 700;">
                      <td><code>10:00 - 11:00 AM</code></td>
                      <td><strong>CS601</strong>: Advanced Operating Systems</td>
                      <td>Hall 204</td>
                      <td><span class="badge badge-primary">CSE-6A</span></td>
                      <td><span class="badge badge-success">⚡ Live Slot</span></td>
                    </tr>
                    <tr>
                      <td><code>11:15 - 12:15 PM</code></td>
                      <td><strong>CS601</strong>: Advanced Operating Systems</td>
                      <td>Hall 205</td>
                      <td><span class="badge badge-gold">CSE-6B</span></td>
                      <td><span class="badge badge-info">Upcoming</span></td>
                    </tr>
                    <tr>
                      <td><code>01:00 - 02:00 PM</code></td>
                      <td>Faculty Lunch & Mentorship Office Hours</td>
                      <td>Faculty Cabin 312</td>
                      <td>All</td>
                      <td><span class="badge badge-secondary">Recess</span></td>
                    </tr>
                    <tr>
                      <td><code>02:00 - 04:00 PM</code></td>
                      <td><strong>CS604</strong>: Full Stack Web Engineering Lab</td>
                      <td>Lab 304</td>
                      <td><span class="badge badge-primary">CSE-6A</span></td>
                      <td><span class="badge badge-info">Upcoming</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div class="faculty-quick-actions-bar">
                <button class="btn btn-primary btn-sm" onclick="FacultyPortal.switchTab('attendance')">
                  ⚡ Take Attendance for Current Slot
                </button>
                <button class="btn btn-secondary btn-sm" onclick="FacultyPortal.openModal('division-timetable')">
                  📅 View Division Timetables
                </button>
                <button class="btn btn-secondary btn-sm" onclick="FacultyPortal.switchTab('classrooms')">
                  Weekly Schedule &rarr;
                </button>
              </div>
            </div>

            <!-- Biometric In/Out Register -->
            <div class="card">
              <div class="card-header">
                <div>
                  <h3 class="card-title">⏱️ Biometric In/Out Attendance Register</h3>
                  <p class="page-subtitle">Terminal: GATE-03-BIO &bull; General Shift (08:45 AM - 05:15 PM)</p>
                </div>
                <span class="badge badge-success">Punch Active</span>
              </div>

              <div class="table-responsive">
                <table class="data-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>In Time</th>
                      <th>Out Time</th>
                      <th>Duration</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${(PU_DATA.facultyInOutLogs || []).slice(0, 4).map(log => `
                      <tr>
                        <td><strong>${log.date}</strong></td>
                        <td style="color: #10B981; font-weight: 700;">${log.punchIn}</td>
                        <td style="color: #2563EB; font-weight: 700;">${log.punchOut}</td>
                        <td>${log.duration}</td>
                        <td>
                          <span class="badge ${log.status === 'ON TIME' ? 'badge-success' : 'badge-gold'}">
                            ${log.status}
                          </span>
                        </td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>

              <div style="margin-top: 14px; display: flex; justify-content: space-between; align-items: center; font-size: 12px; color: var(--text-muted);">
                <span>15-minute institutional punch grace period active.</span>
                <button class="btn btn-secondary btn-sm" onclick="FacultyPortal.openModal('in-out-register')">
                  Full Punch History &rarr;
                </button>
              </div>
            </div>
          </div>

          <!-- Section 2: Faculty Leave Management & Official Monthly Pay Slip -->
          <div class="faculty-dashboard-row">
            <!-- Leave Management -->
            <div class="card">
              <div class="card-header">
                <div>
                  <h3 class="card-title">🏖️ Faculty Leave Management</h3>
                  <p class="page-subtitle">Leave Balances & Fast Leave Request</p>
                </div>
                <button class="btn btn-secondary btn-sm" onclick="FacultyPortal.openModal('leave')">
                  View Full History
                </button>
              </div>

              <!-- Balance Badges -->
              <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 16px;">
                <div style="background: var(--bg-subtle); padding: 10px; border-radius: var(--radius-md); text-align: center; border: 1px solid var(--border-subtle);">
                  <div style="font-size: 11px; color: var(--text-muted); font-weight: 700;">Casual (CL)</div>
                  <div style="font-size: 18px; font-weight: 800; color: #2563EB;">${leaves.balances.casualLeave.remaining}</div>
                  <div style="font-size: 10px; color: var(--text-muted);">Remaining</div>
                </div>
                <div style="background: var(--bg-subtle); padding: 10px; border-radius: var(--radius-md); text-align: center; border: 1px solid var(--border-subtle);">
                  <div style="font-size: 11px; color: var(--text-muted); font-weight: 700;">Sick (SL)</div>
                  <div style="font-size: 18px; font-weight: 800; color: #10B981;">${leaves.balances.sickLeave.remaining}</div>
                  <div style="font-size: 10px; color: var(--text-muted);">Remaining</div>
                </div>
                <div style="background: var(--bg-subtle); padding: 10px; border-radius: var(--radius-md); text-align: center; border: 1px solid var(--border-subtle);">
                  <div style="font-size: 11px; color: var(--text-muted); font-weight: 700;">Duty (DL)</div>
                  <div style="font-size: 18px; font-weight: 800; color: #D97706;">${leaves.balances.dutyLeave.remaining}</div>
                  <div style="font-size: 10px; color: var(--text-muted);">Remaining</div>
                </div>
                <div style="background: var(--bg-subtle); padding: 10px; border-radius: var(--radius-md); text-align: center; border: 1px solid var(--border-subtle);">
                  <div style="font-size: 11px; color: var(--text-muted); font-weight: 700;">Earned (EL)</div>
                  <div style="font-size: 18px; font-weight: 800; color: var(--pu-maroon-primary);">${leaves.balances.earnedLeave.remaining}</div>
                  <div style="font-size: 10px; color: var(--text-muted);">Remaining</div>
                </div>
              </div>

              <!-- Quick Apply Form -->
              <div style="background: var(--bg-subtle); padding: 14px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
                <div style="font-weight: 700; font-size: 12.5px; color: var(--pu-maroon-primary); margin-bottom: 8px;">Fast Leave Application:</div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 8px;">
                  <select id="dash-leave-type" class="form-select" style="font-size: 12px; padding: 6px 10px;">
                    <option>Casual Leave (CL)</option>
                    <option>Duty Leave (DL)</option>
                    <option>Sick / Medical Leave (SL)</option>
                  </select>
                  <select id="dash-leave-sub" class="form-select" style="font-size: 12px; padding: 6px 10px;">
                    <option>Substitute: Prof. Ananya Patel</option>
                    <option>Substitute: Dr. Rajesh Sharma</option>
                    <option>Substitute: Prof. Jatin Morwal</option>
                  </select>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 10px;">
                  <input type="date" id="dash-leave-from" class="form-control" value="2026-10-12" style="font-size: 12px; padding: 6px 10px;">
                  <input type="text" id="dash-leave-reason" class="form-control" placeholder="Reason (e.g. Conference)" style="font-size: 12px; padding: 6px 10px;">
                </div>
                <button class="btn btn-primary btn-sm" style="width: 100%;" onclick="FacultyPortal.submitDashboardLeave()">
                  ✓ Submit Leave to Head of Department
                </button>
              </div>
            </div>

            <!-- Official Salary Statement / Pay Slip -->
            <div class="card">
              <div class="card-header">
                <div>
                  <h3 class="card-title">🧾 Official Salary Statement (${paySlip.month || 'September 2026'})</h3>
                  <p class="page-subtitle">Disbursed to HDFC Bank A/C •••• 5591 &bull; PAN: ABCPS1234F</p>
                </div>
                <button class="btn btn-secondary btn-sm" onclick="FacultyPortal.openModal('pay-slip')">
                  🖨️ Print / Save PDF
                </button>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 14px;">
                <div style="background: rgba(16, 185, 129, 0.05); padding: 12px; border-radius: var(--radius-md); border: 1px solid rgba(16, 185, 129, 0.2);">
                  <div style="font-size: 11px; font-weight: 700; color: #059669; text-transform: uppercase;">Earnings Breakdown</div>
                  <div style="font-size: 12.5px; margin-top: 6px; line-height: 1.6;">
                    <div>Basic Pay: <strong>₹62,400</strong></div>
                    <div>Dearness Allowance (DA): <strong>₹31,200</strong></div>
                    <div>HRA: <strong>₹14,976</strong></div>
                    <div>Special Allowance: <strong>₹8,500</strong></div>
                    <div style="border-top: 1px solid rgba(16, 185, 129, 0.2); margin-top: 4px; padding-top: 4px; font-weight: 700; color: #059669;">
                      Gross: ₹1,20,576
                    </div>
                  </div>
                </div>

                <div style="background: rgba(239, 68, 68, 0.05); padding: 12px; border-radius: var(--radius-md); border: 1px solid rgba(239, 68, 68, 0.2);">
                  <div style="font-size: 11px; font-weight: 700; color: #DC2626; text-transform: uppercase;">Deductions Breakdown</div>
                  <div style="font-size: 12.5px; margin-top: 6px; line-height: 1.6;">
                    <div>Provident Fund (PF): <strong>₹7,488</strong></div>
                    <div>Professional Tax (PT): <strong>₹200</strong></div>
                    <div>TDS / Income Tax: <strong>₹11,000</strong></div>
                    <div>Bus Transit Pass: <strong>₹2,000</strong></div>
                    <div style="border-top: 1px solid rgba(239, 68, 68, 0.2); margin-top: 4px; padding-top: 4px; font-weight: 700; color: #DC2626;">
                      Total Deductions: ₹20,688
                    </div>
                  </div>
                </div>
              </div>

              <!-- Net Payable Banner -->
              <div style="background: linear-gradient(135deg, rgba(128, 0, 32, 0.08) 0%, rgba(217, 119, 6, 0.08) 100%); border: 1px solid rgba(128, 0, 32, 0.25); border-radius: var(--radius-md); padding: 12px 18px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <div style="font-size: 11px; text-transform: uppercase; color: var(--text-secondary); font-weight: 700;">Net Salary Credited</div>
                  <div style="font-size: 11px; color: var(--text-muted); font-style: italic;">Ninety Nine Thousand Eight Hundred Eighty Eight Rupees Only</div>
                </div>
                <div style="font-size: 22px; font-weight: 800; color: var(--pu-maroon-primary);">
                  ₹99,888
                </div>
              </div>
            </div>
          </div>

          <!-- Section 3: Staff Transit Bus Pass & Campus Facility Reservations -->
          <div class="faculty-dashboard-row">
            <!-- Staff Transit Pass -->
            <div class="card">
              <div class="card-header">
                <div>
                  <h3 class="card-title">🚌 Staff Transit Card & University Bus Pass</h3>
                  <p class="page-subtitle">Route 14 &bull; Vadodara Station ⇄ Parul University Limda</p>
                </div>
                <span class="badge badge-gold">Active Pass</span>
              </div>

              <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 16px; align-items: center;">
                <div style="font-size: 13px; line-height: 1.8;">
                  <div><strong>Bus Number:</strong> <strong>${busPass.busNumber}</strong></div>
                  <div><strong>Designated Stop:</strong> Waghodia Cross Road (Near Flyover)</div>
                  <div><strong>Morning Pickup:</strong> <strong>07:45 AM</strong> &bull; <strong>Evening Return:</strong> <strong>05:30 PM</strong></div>
                  <div><strong>Assigned Driver:</strong> Mr. Mukesh Solanki (<a href="tel:+919825477123" style="color: var(--pu-maroon-primary);">+91 98254 77123</a>)</div>
                  <div><strong>Pass Validity:</strong> <span class="badge badge-success">30-June-2027</span></div>
                </div>

                <div style="text-align: center; border: 2px dashed var(--border-subtle); padding: 12px; border-radius: var(--radius-md); background: var(--bg-subtle);">
                  <div style="font-size: 32px; margin-bottom: 4px;">🪪</div>
                  <code style="font-size: 10.5px;">PU-BP-3012</code>
                  <div style="font-size: 10px; color: var(--text-muted); margin-top: 2px;">RFID Transit Verified</div>
                </div>
              </div>

              <div class="faculty-quick-actions-bar" style="margin-top: 14px;">
                <button class="btn btn-secondary btn-sm" onclick="FacultyPortal.openModal('passenger-attendance')">
                  🚎 Open Bus Route 14 Passenger Roll-Call
                </button>
                <button class="btn btn-secondary btn-sm" onclick="FacultyPortal.openModal('bus-pass')">
                  View Digital ID Card &rarr;
                </button>
              </div>
            </div>

            <!-- Campus Resource Bookings -->
            <div class="card">
              <div class="card-header">
                <div>
                  <h3 class="card-title">🏛️ Campus Facility & Laboratory Bookings</h3>
                  <p class="page-subtitle">Reserved Seminar Halls, AI Computing Labs & Meeting Rooms</p>
                </div>
                <button class="btn btn-primary btn-sm" onclick="FacultyPortal.openModal('resource-book')">
                  + Book Hall / Lab
                </button>
              </div>

              <div class="table-responsive">
                <table class="data-table">
                  <thead>
                    <tr>
                      <th>Facility</th>
                      <th>Date & Slot</th>
                      <th>Purpose</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${(PU_DATA.resourceBookings || []).map(b => `
                      <tr>
                        <td><strong>${b.resourceName.split('(')[0]}</strong></td>
                        <td>${b.date}<br><small style="color: var(--text-muted);">${b.slot}</small></td>
                        <td>${b.purpose}</td>
                        <td><span class="badge ${b.status === 'CONFIRMED' ? 'badge-success' : 'badge-gold'}">${b.status}</span></td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- Section 4: University Circulars & Quick Student Proctor Lookup -->
          <div class="faculty-dashboard-row">
            <!-- Official Circulars -->
            <div class="card">
              <div class="card-header">
                <div>
                  <h3 class="card-title">📜 University Circulars & Official Orders</h3>
                  <p class="page-subtitle">Office of the Registrar & Academic Dean</p>
                </div>
                <button class="btn btn-secondary btn-sm" onclick="FacultyPortal.openModal('circular')">
                  View All &rarr;
                </button>
              </div>

              <div style="display: flex; flex-direction: column; gap: 10px;">
                ${(PU_DATA.circulars || []).slice(0, 3).map(c => `
                  <div style="padding: 12px; background: var(--bg-subtle); border-radius: var(--radius-md); border-left: 3px solid ${c.urgency === 'High' ? '#EF4444' : '#2563EB'};">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                      <div style="font-weight: 700; font-size: 13px; color: var(--text-primary);">${c.title}</div>
                      <span class="badge ${c.urgency === 'High' ? 'badge-danger' : 'badge-primary'}" style="font-size: 10px;">${c.category}</span>
                    </div>
                    <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">
                      ${c.authority} &bull; ${c.date}
                    </div>
                    <p style="font-size: 12px; color: var(--text-secondary); margin: 6px 0 0 0; line-height: 1.4;">
                      ${c.summary}
                    </p>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Quick Student Proctor Search -->
            <div class="card">
              <div class="card-header">
                <div>
                  <h3 class="card-title">🎓 Student Directory & Proctor Search</h3>
                  <p class="page-subtitle">Instant lookup across all departments & hostels</p>
                </div>
                <span class="badge badge-info">Roster Lookup</span>
              </div>

              <div style="margin-bottom: 12px;">
                <input 
                  type="text" 
                  id="dash-student-search" 
                  class="form-control" 
                  placeholder="Type student name, enrollment no, or roll no (e.g. Aarav, 210303105001)..." 
                  oninput="FacultyPortal.filterDashboardStudents(this.value)">
              </div>

              <div id="dash-student-results" style="display: flex; flex-direction: column; gap: 8px; max-height: 280px; overflow-y: auto;">
                ${renderDashboardStudentList('')}
              </div>
            </div>
          </div>

          <!-- Bottom Utilities Action Bar -->
          <div style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 16px 20px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <span style="font-size: 18px;">⚡</span>
              <div>
                <strong style="font-size: 13.5px; color: var(--text-primary);">Examination & Campus Utilities</strong>
                <div style="font-size: 12px; color: var(--text-muted);">Quick-access tools for invigilation, helpdesk, and transit</div>
              </div>
            </div>
            <div style="display: flex; gap: 10px; flex-wrap: wrap;">
              <button class="btn btn-secondary btn-sm" onclick="FacultyPortal.openModal('scan-block')">
                🔍 Scan Exam Block Attendance (Block B-204)
              </button>
              <button class="btn btn-secondary btn-sm" onclick="FacultyPortal.openModal('grievance')">
                📝 Campus Support & Grievance Desk
              </button>
              <button class="btn btn-secondary btn-sm" onclick="FacultyPortal.openModal('passenger-attendance')">
                🚎 Bus Passenger Roll-Call
              </button>
            </div>
          </div>

        </div>

        <!-- ===================================================================
             TAB 1: CAPSTONE & PROJECT GUIDE DESK (MATCHES LAPTOP SCREEN IN PHOTO)
             =================================================================== -->
        <div id="faculty-tab-projects" class="subtab-content">
          <div class="card" style="margin-bottom: 24px;">
            <div class="card-header">
              <div>
                <h3 class="card-title">📋 Allocated Project Guide & Capstone Mentorship Console</h3>
                <p class="page-subtitle">Track project milestones, evaluate student submissions, and submit faculty remarks</p>
              </div>
              <div style="display: flex; gap: 10px; align-items: center;">
                <label class="form-label" style="margin: 0; font-size: 12px;">Filter Guide:</label>
                <select id="faculty-guide-filter" class="form-select" style="min-width: 220px;" onchange="FacultyPortal.handleGuideFilterChange(this.value)">
                  <option value="ALL">All Allocated Guides</option>
                  <option value="Mr. Pritam Samanta" ${user.name.includes('Pritam') ? 'selected' : ''}>Prof. Pritam Samanta</option>
                  <option value="Prof. Jatin Morwal" ${user.name.includes('Jatin') ? 'selected' : ''}>Prof. Jatin Morwal</option>
                </select>
              </div>
            </div>

            <!-- Guide Allocation Banner -->
            <div class="faculty-project-guide-banner">
              <div>
                <strong style="color: var(--pu-maroon-primary); font-size: 14px;">Academic Year 2025-2026: Capstone Minor & Major Projects</strong>
                <div style="font-size: 12.5px; color: var(--text-secondary); margin-top: 2px;">
                  All progress evaluations are directly synced to the Academic Council Master Database.
                </div>
              </div>
              <div style="display: flex; gap: 12px;">
                <span class="badge badge-success">7 Active Projects</span>
                <span class="badge badge-gold">14 Student Researchers</span>
              </div>
            </div>

            <!-- Project Allocations Table -->
            <div class="table-responsive">
              <table class="data-table">
                <thead>
                  <tr>
                    <th style="width: 240px;">Project Title & Code</th>
                    <th style="width: 170px;">Allocated Guide</th>
                    <th style="width: 210px;">Student Team</th>
                    <th style="width: 130px;">Track / Domain</th>
                    <th style="width: 120px;">Progress</th>
                    <th>Faculty Remarks & Guide Evaluation</th>
                    <th style="width: 100px; text-align: center;">Actions</th>
                  </tr>
                </thead>
                <tbody id="faculty-projects-tbody">
                  ${renderProjectRows()}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- ===================================================================
             TAB 2: ATTENDANCE ENTRY CONSOLE
             =================================================================== -->
        <div id="faculty-tab-attendance" class="subtab-content">
          <!-- Control Bar -->
          <div class="attendance-console-bar">
            <div class="attendance-filters">
              <div style="display: flex; flex-direction: column; gap: 4px;">
                <label class="form-label" style="margin: 0; font-size: 11px;">Subject / Course</label>
                <select id="faculty-course-select" class="form-select" style="min-width: 260px;" onchange="FacultyPortal.handleCourseChange(this.value)">
                  ${courseSelectOptions}
                </select>
              </div>

              <div style="display: flex; flex-direction: column; gap: 4px;">
                <label class="form-label" style="margin: 0; font-size: 11px;">Batch / Section</label>
                <select id="faculty-section-select" class="form-select" style="min-width: 150px;" onchange="FacultyPortal.handleSectionChange(this.value)">
                  <option value="6A" ${activeSection === '6A' ? 'selected' : ''}>CSE-6A (Div A - 3 Students)</option>
                  <option value="6B" ${activeSection === '6B' ? 'selected' : ''}>CSE-6B (Div B - 3 Students)</option>
                  <option value="ALL" ${activeSection === 'ALL' ? 'selected' : ''}>All Divisions (6 Students)</option>
                </select>
              </div>

              <div style="display: flex; flex-direction: column; gap: 4px;">
                <label class="form-label" style="margin: 0; font-size: 11px;">Lecture Slot</label>
                <select id="faculty-slot-select" class="form-select" style="min-width: 190px;">
                  <option selected>10:00 AM - 11:00 AM (Current)</option>
                  <option>11:00 AM - 12:00 PM</option>
                  <option>02:00 PM - 03:00 PM</option>
                </select>
              </div>

              <div style="display: flex; flex-direction: column; gap: 4px;">
                <label class="form-label" style="margin: 0; font-size: 11px;">Lecture Date</label>
                <input type="date" class="form-control" value="2026-09-29" style="min-width: 140px;">
              </div>
            </div>

            <div class="attendance-actions">
              <button class="btn btn-secondary btn-sm" onclick="FacultyPortal.markAll('PRESENT')">
                ✓ Mark All Present
              </button>
              <button class="btn btn-secondary btn-sm" onclick="FacultyPortal.markAll('ABSENT')">
                ✕ Mark All Absent
              </button>
              <button class="btn btn-primary" onclick="FacultyPortal.saveAndBroadcastAttendance()">
                ⚡ Save & Broadcast to Students
              </button>
            </div>
          </div>

          <!-- Slot Summary Indicator -->
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; padding: 12px 18px; background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-md);">
            <div style="font-size: 13.5px;">
              Showing Student Roster for <strong id="faculty-active-course-label">${activeCourseCode} (CSE-${activeSection})</strong> &bull; Total in Division: <strong id="faculty-roster-count-label">${getFilteredRoster().length} students</strong>
            </div>
            <div id="slot-attendance-summary" style="font-weight: 700; font-size: 13.5px; color: var(--color-success);">
              ${calculateSlotSummary()}
            </div>
          </div>

          <!-- Student Attendance Table -->
          <div class="card" style="padding: 0; overflow: hidden;">
            <div class="table-responsive">
              <table class="data-table">
                <thead>
                  <tr>
                    <th style="width: 70px;">Roll No</th>
                    <th style="width: 140px;">Enrollment No</th>
                    <th>Student Name</th>
                    <th>Hostel / Residence</th>
                    <th style="text-align: center; width: 120px;">Current Subject %</th>
                    <th style="text-align: center; width: 220px;">Attendance Status</th>
                  </tr>
                </thead>
                <tbody id="faculty-roster-tbody">
                  ${renderRosterRows()}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- ===================================================================
             TAB 3: CLASSROOM & TIMETABLE MANAGEMENT
             =================================================================== -->
        <div id="faculty-tab-classrooms" class="subtab-content">
          <div class="card" style="margin-bottom: 24px;">
            <div class="card-header">
              <div>
                <h3 class="card-title">📅 Weekly Lecture Timetable (${user.name})</h3>
                <p class="page-subtitle">Department of Computer Science & Engineering - Even Semester</p>
              </div>
              <div style="display: flex; gap: 8px;">
                <button class="btn btn-secondary btn-sm" onclick="FacultyPortal.openModal('division-timetable')">
                  View Division Timetables
                </button>
                <span class="badge badge-maroon">Semester 6 Schedule</span>
              </div>
            </div>
            <div class="table-responsive">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Day</th>
                    <th>09:00 - 10:00</th>
                    <th>10:00 - 11:00</th>
                    <th>11:15 - 12:15</th>
                    <th>01:00 - 02:00</th>
                    <th>02:00 - 04:00</th>
                  </tr>
                </thead>
                <tbody>
                  ${renderTimetableRows(user, allocatedCodes)}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- ===================================================================
             TAB 4: MARKS & EVALUATION PANEL
             =================================================================== -->
        <div id="faculty-tab-marks" class="subtab-content">
          <div class="card">
            <div class="card-header">
              <div>
                <h3 class="card-title">Continuous Internal Assessment & Mid-Sem Marks Sheet</h3>
                <p class="page-subtitle" id="faculty-marks-course-subtitle">Evaluation grade entry for Course: ${currentCourseObj.code} - ${currentCourseObj.title}</p>
              </div>
              <div style="display: flex; gap: 12px;">
                <button class="btn btn-primary" onclick="FacultyPortal.saveMarksEvaluation()">
                  💾 Save & Lock Evaluation Scores
                </button>
              </div>
            </div>

            <div class="table-responsive">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Roll No</th>
                    <th>Student Name</th>
                    <th>Internal Test (40)</th>
                    <th>Mid-Sem Exam (20)</th>
                    <th>Lab / Practical (20)</th>
                    <th>Calculated Total (80)</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${renderMarksRows()}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- ===================================================================
             TAB 5: OUTPASS / LEAVE APPROVAL DESK
             =================================================================== -->
        <div id="faculty-tab-outpasses" class="subtab-content">
          <div class="card">
            <div class="card-header">
              <div>
                <h3 class="card-title">Student Outpass & Digital Gatepass Approval Desk</h3>
                <p class="page-subtitle">Proctor verification queue with 1-click real-time sync</p>
              </div>
              <span class="badge badge-maroon">Proctor Authority: ${user.name}</span>
            </div>

            <div id="faculty-outpass-approval-list">
              ${renderFacultyOutpasses()}
            </div>
          </div>
        </div>

        <!-- ===================================================================
             TAB 6: PROFILE, CREDENTIALS & PERFORMANCE PORTFOLIO
             =================================================================== -->
        <div id="faculty-tab-profile" class="subtab-content">
          ${renderFacultyProfileTab(user)}
        </div>
        <div class="faculty-modal-overlay" id="faculty-service-modal-overlay">
          <div class="faculty-modal-box">
            <div class="faculty-modal-header">
              <div class="faculty-modal-title" id="faculty-modal-title">
                Service Module
              </div>
              <button class="btn-icon" onclick="FacultyPortal.closeModal()">&times;</button>
            </div>
            <div class="faculty-modal-body" id="faculty-modal-body">
              <!-- Rendered dynamically -->
            </div>
          </div>
        </div>

      </div>
    `;
  }

  /**
   * Render Capstone & Project Allocation Rows
   */
  function renderProjectRows() {
    const user = AuthEngine.getCurrentUser();
    let projects = PU_DATA.projectAllocations || [];

    if (currentProjectFilter !== 'ALL') {
      projects = projects.filter(p => p.allocatedGuide.toLowerCase().includes(currentProjectFilter.toLowerCase().split(' ').pop()));
    }

    if (projects.length === 0) {
      return `<tr><td colspan="7" style="text-align: center; padding: 24px; color: var(--text-muted);">No projects found matching the selected filter.</td></tr>`;
    }

    return projects.map(p => {
      const isMyProject = user && (p.allocatedGuide.toLowerCase().includes(user.name.toLowerCase().split(' ').pop()) || p.guideEmpId === user.employeeId);
      const guideBadgeClass = p.allocatedGuide.includes('Pritam') ? 'badge-primary' : 'badge-gold';

      const teamHtml = p.team.map(m => `
        <div style="font-size: 12.5px; margin-bottom: 2px;">
          <strong>${m.name}</strong> <code style="font-size: 11px;">(${m.enrollmentNo})</code>
          <span style="color: var(--text-muted); font-size: 11px;"> - ${m.role}</span>
        </div>
      `).join('');

      return `
        <tr style="${isMyProject ? 'background: rgba(128, 0, 32, 0.02);' : ''}">
          <td>
            <div style="font-weight: 700; color: var(--pu-maroon-primary); font-size: 13.5px;">${p.title}</div>
            <code style="font-size: 11px; color: var(--text-muted);">${p.id} &bull; Updated ${p.lastUpdated}</code>
          </td>
          <td>
            <span class="badge ${guideBadgeClass}" style="font-size: 11.5px;">${p.allocatedGuide}</span>
          </td>
          <td>${teamHtml}</td>
          <td>
            <span class="badge badge-info" style="font-size: 10.5px;">${p.track}</span>
          </td>
          <td>
            <div style="display: flex; justify-content: space-between; font-size: 12px; font-weight: 700;">
              <span>${p.status}</span>
              <span>${p.progress}%</span>
            </div>
            <div class="faculty-project-progress-bar">
              <div class="faculty-project-progress-fill" style="width: ${p.progress}%;"></div>
            </div>
          </td>
          <td>
            <div style="display: flex; flex-direction: column; gap: 6px;">
              <textarea 
                id="remark-${p.id}" 
                class="form-control" 
                rows="2" 
                style="font-size: 12px; resize: vertical;" 
                placeholder="Enter guide feedback and evaluation...">${p.remarks}</textarea>
              <div style="display: flex; align-items: center; justify-content: space-between; font-size: 11.5px;">
                <span>Score: <input type="number" id="score-${p.id}" value="${p.score}" min="0" max="100" style="width: 50px; padding: 2px 4px; font-weight: 700; text-align: center;"> / 100</span>
                <span class="badge badge-success" style="font-size: 10px;">Milestone Approved</span>
              </div>
            </div>
          </td>
          <td style="text-align: center;">
            <button class="btn btn-secondary btn-sm" onclick="FacultyPortal.saveProjectRemark('${p.id}')" title="Save faculty remark and evaluation">
              💾 Save
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }

  function handleGuideFilterChange(val) {
    currentProjectFilter = val;
    const tbody = document.getElementById('faculty-projects-tbody');
    if (tbody) tbody.innerHTML = renderProjectRows();
  }

  function saveProjectRemark(projectId) {
    const remarkEl = document.getElementById(`remark-${projectId}`);
    const scoreEl = document.getElementById(`score-${projectId}`);
    const project = (PU_DATA.projectAllocations || []).find(p => p.id === projectId);

    if (project && remarkEl) {
      project.remarks = remarkEl.value;
      if (scoreEl) project.score = parseInt(scoreEl.value, 10) || project.score;
      project.lastUpdated = new Date().toISOString().split('T')[0];

      RealtimeEngine.logAuditEvent({
        actor: AuthEngine.getCurrentUser()?.name || "Faculty Guide",
        role: "FACULTY",
        action: "PROJECT_EVALUATION_SAVED",
        resource: `Capstone Project ${projectId}: ${project.title}`,
        status: "SUCCESS"
      });

      RealtimeEngine.showToast({
        title: "Remarks & Score Saved!",
        message: `Evaluation for "${project.title}" has been updated and locked in Academic Council records.`,
        type: "success"
      });
    }
  }

  /**
   * Fast leave submit from dashboard
   */
  function submitDashboardLeave() {
    const type = document.getElementById('dash-leave-type')?.value || 'Casual Leave (CL)';
    const sub = document.getElementById('dash-leave-sub')?.value || 'Substitute: Prof. Ananya Patel';
    const from = document.getElementById('dash-leave-from')?.value || '2026-10-12';
    const reason = document.getElementById('dash-leave-reason')?.value || 'Academic Assignment';

    const newId = `LV-2026-${Math.floor(100 + Math.random() * 900)}`;
    if (PU_DATA.facultyLeaves && PU_DATA.facultyLeaves.history) {
      PU_DATA.facultyLeaves.history.unshift({
        id: newId,
        type,
        fromDate: from,
        toDate: from,
        days: 1,
        reason,
        substitute: sub.replace('Substitute: ', ''),
        status: "APPROVED",
        approvedBy: "Head of Department (CSE)"
      });
    }

    RealtimeEngine.logAuditEvent({
      actor: AuthEngine.getCurrentUser()?.name || "Faculty Member",
      role: "FACULTY",
      action: "FACULTY_LEAVE_APPLIED",
      resource: `Leave Request #${newId}`,
      status: "SUCCESS"
    });

    RealtimeEngine.showToast({
      title: "Leave Application Submitted!",
      message: `Your ${type} (#${newId}) has been registered and cleared by HOD.`,
      type: "success"
    });

    render(document.getElementById('portal-view-container'));
  }

  /**
   * Filter students on the dashboard
   */
  function filterDashboardStudents(query) {
    const container = document.getElementById('dash-student-results');
    if (container) container.innerHTML = renderDashboardStudentList(query);
  }

  function renderDashboardStudentList(query) {
    const q = (query || '').toLowerCase().trim();
    let list = PU_DATA.studentRoster || [];
    if (q) {
      list = list.filter(s => 
        s.name.toLowerCase().includes(q) || 
        s.enrollmentNo.includes(q) || 
        s.rollNo.toLowerCase().includes(q)
      );
    }

    if (list.length === 0) {
      return `<div style="text-align: center; padding: 18px; color: var(--text-muted); font-size: 13px;">No matching students found.</div>`;
    }

    return list.map(s => {
      const stats = (s.attendanceStats && s.attendanceStats['CS601']) || { held: 38, attended: 34 };
      const pct = calculateAttendancePercentage(stats.attended, stats.held);

      return `
        <div style="padding: 10px 12px; background: var(--bg-subtle); border-radius: var(--radius-sm); border: 1px solid var(--border-subtle); display: flex; justify-content: space-between; align-items: center;">
          <div>
            <div style="font-weight: 700; font-size: 13px; color: var(--text-primary);">${s.name} <span class="badge ${s.section === '6A' ? 'badge-primary' : 'badge-gold'}" style="font-size: 9.5px;">Div ${s.section}</span></div>
            <code style="font-size: 11px;">${s.enrollmentNo} &bull; ${s.rollNo} &bull; ${s.hostel}</code>
          </div>
          <div style="text-align: right;">
            <strong style="color: ${pct >= 75 ? '#10B981' : '#EF4444'}; font-size: 13.5px;">${pct}%</strong>
            <div style="font-size: 10px; color: var(--text-muted);">${stats.attended}/${stats.held} Classes</div>
          </div>
        </div>
      `;
    }).join('');
  }

  /**
   * Opens dedicated modals for utilities
   */
  function openModal(serviceKey) {
    const modalOverlay = document.getElementById('faculty-service-modal-overlay');
    const modalTitle = document.getElementById('faculty-modal-title');
    const modalBody = document.getElementById('faculty-modal-body');
    if (!modalOverlay || !modalTitle || !modalBody) return;

    const user = AuthEngine.getCurrentUser() || { name: "Mr. Pritam Samanta", employeeId: "PU-FAC-3012" };

    switch(serviceKey) {
      case 'division-timetable':
        modalTitle.innerHTML = `📅 Division-Wise Academic Timetable`;
        modalBody.innerHTML = `
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <label class="form-label" style="margin: 0; font-weight: 700;">Select Division:</label>
              <select class="form-select" style="min-width: 160px;" onchange="FacultyPortal.changeDivisionTimetable(this.value)">
                <option value="6A" ${activeDivisionTimetable === '6A' ? 'selected' : ''}>B.Tech CSE - 6A</option>
                <option value="6B" ${activeDivisionTimetable === '6B' ? 'selected' : ''}>B.Tech CSE - 6B</option>
              </select>
            </div>
            <span class="badge badge-primary">Classroom: Room 204 / 205 (Block B)</span>
          </div>
          <div id="division-timetable-table-container">
            ${renderDivisionTimetableTable(activeDivisionTimetable)}
          </div>
        `;
        break;

      case 'in-out-register':
        const punchLogs = PU_DATA.facultyInOutLogs || [];
        modalTitle.innerHTML = `⏱️ Full Biometric Punch History`;
        modalBody.innerHTML = `
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <div><strong>Biometric ID:</strong> <code>PU-BIO-3012</code> &bull; General Shift (08:45 AM - 05:15 PM)</div>
            <span class="badge badge-success">Punch Device: Active (GATE-03)</span>
          </div>
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>In Time</th>
                  <th>In Machine</th>
                  <th>Out Time</th>
                  <th>Out Machine</th>
                  <th>Total Duration</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${punchLogs.map(log => `
                  <tr>
                    <td><strong>${log.date}</strong></td>
                    <td style="color: #10B981; font-weight: 700;">${log.punchIn}</td>
                    <td><code>${log.machineIn}</code></td>
                    <td style="color: #2563EB; font-weight: 700;">${log.punchOut}</td>
                    <td><code>${log.machineOut}</code></td>
                    <td><strong>${log.duration}</strong></td>
                    <td><span class="badge ${log.status === 'ON TIME' ? 'badge-success' : 'badge-gold'}">${log.status}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `;
        break;

      case 'leave':
        const leaves = PU_DATA.facultyLeaves || { balances: {}, history: [] };
        modalTitle.innerHTML = `🏖️ Faculty Leave Application & Balance Console`;
        modalBody.innerHTML = `
          <h4 style="font-size: 14px; margin-bottom: 8px;">Leave Application History</h4>
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Leave ID</th>
                  <th>Type</th>
                  <th>Dates</th>
                  <th>Days</th>
                  <th>Reason</th>
                  <th>Substitute</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${leaves.history.map(l => `
                  <tr>
                    <td><code>${l.id}</code></td>
                    <td><strong>${l.type}</strong></td>
                    <td>${l.fromDate} to ${l.toDate}</td>
                    <td>${l.days} day(s)</td>
                    <td>${l.reason}</td>
                    <td>${l.substitute}</td>
                    <td><span class="badge badge-success">${l.status}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `;
        break;

      case 'pay-slip':
        const slip = PU_DATA.facultyPaySlip;
        modalTitle.innerHTML = `🧾 Official Salary Statement / Pay Slip (${slip.month})`;
        modalBody.innerHTML = `
          <div style="border: 2px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 24px; background: var(--bg-card); font-family: var(--font-sans);">
            <div style="text-align: center; border-bottom: 2px solid var(--pu-maroon-primary); padding-bottom: 16px; margin-bottom: 18px;">
              <h2 style="font-size: 20px; color: var(--pu-maroon-primary); margin: 0 0 4px 0;">PARUL UNIVERSITY</h2>
              <div style="font-size: 12px; color: var(--text-secondary); text-transform: uppercase;">P.O. Limda, Ta. Waghodia, Dist. Vadodara - 391760, Gujarat</div>
              <h3 style="font-size: 15px; margin: 8px 0 0 0; color: var(--text-primary);">MONTHLY SALARY SLIP - ${slip.month.toUpperCase()}</h3>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 13px; margin-bottom: 18px; padding-bottom: 14px; border-bottom: 1px dashed var(--border-subtle);">
              <div><strong>Employee Name:</strong> ${user.name}</div>
              <div><strong>Employee ID:</strong> ${user.employeeId || 'PU-FAC-3012'}</div>
              <div><strong>Department:</strong> ${user.department || 'Computer Science & Engineering'}</div>
              <div><strong>Designation:</strong> ${user.designation || 'Assistant Professor'}</div>
              <div><strong>Bank A/C:</strong> ${slip.bankName} (${slip.accountNo})</div>
              <div><strong>PAN / PF No:</strong> ${slip.panNo} / ${slip.pfNo}</div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
              <div>
                <h4 style="margin: 0 0 8px 0; color: #10B981; font-size: 13.5px; border-bottom: 1px solid var(--border-subtle); padding-bottom: 4px;">EARNINGS (₹)</h4>
                <div style="display: flex; justify-content: space-between; font-size: 13px; padding: 4px 0;"><span>Basic Pay:</span> <strong>₹${slip.earnings.basicPay.toLocaleString()}</strong></div>
                <div style="display: flex; justify-content: space-between; font-size: 13px; padding: 4px 0;"><span>Dearness Allowance (DA):</span> <strong>₹${slip.earnings.dearnessAllowance.toLocaleString()}</strong></div>
                <div style="display: flex; justify-content: space-between; font-size: 13px; padding: 4px 0;"><span>House Rent Allowance (HRA):</span> <strong>₹${slip.earnings.houseRentAllowance.toLocaleString()}</strong></div>
                <div style="display: flex; justify-content: space-between; font-size: 13px; padding: 4px 0;"><span>Special Allowance:</span> <strong>₹${slip.earnings.specialAllowance.toLocaleString()}</strong></div>
                <div style="display: flex; justify-content: space-between; font-size: 13px; padding: 4px 0;"><span>Conveyance:</span> <strong>₹${slip.earnings.conveyanceAllowance.toLocaleString()}</strong></div>
                <div style="display: flex; justify-content: space-between; font-size: 14px; padding: 8px 0; border-top: 1px solid var(--border-subtle); margin-top: 6px;"><span>Gross Earnings:</span> <strong style="color: #10B981;">₹${slip.earnings.grossPay.toLocaleString()}</strong></div>
              </div>

              <div>
                <h4 style="margin: 0 0 8px 0; color: #EF4444; font-size: 13.5px; border-bottom: 1px solid var(--border-subtle); padding-bottom: 4px;">DEDUCTIONS (₹)</h4>
                <div style="display: flex; justify-content: space-between; font-size: 13px; padding: 4px 0;"><span>Provident Fund (PF):</span> <strong>₹${slip.deductions.providentFund.toLocaleString()}</strong></div>
                <div style="display: flex; justify-content: space-between; font-size: 13px; padding: 4px 0;"><span>Professional Tax (PT):</span> <strong>₹${slip.deductions.professionalTax.toLocaleString()}</strong></div>
                <div style="display: flex; justify-content: space-between; font-size: 13px; padding: 4px 0;"><span>TDS / Income Tax:</span> <strong>₹${slip.deductions.incomeTaxTDS.toLocaleString()}</strong></div>
                <div style="display: flex; justify-content: space-between; font-size: 13px; padding: 4px 0;"><span>Bus Pass Transit:</span> <strong>₹${slip.deductions.busTransportDeduction.toLocaleString()}</strong></div>
                <div style="display: flex; justify-content: space-between; font-size: 14px; padding: 8px 0; border-top: 1px solid var(--border-subtle); margin-top: 26px;"><span>Total Deductions:</span> <strong style="color: #EF4444;">₹${slip.deductions.totalDeductions.toLocaleString()}</strong></div>
              </div>
            </div>

            <div style="background: rgba(128, 0, 32, 0.08); border: 1px solid rgba(128, 0, 32, 0.2); border-radius: var(--radius-md); padding: 14px 18px; display: flex; justify-content: space-between; align-items: center;">
              <div>
                <div style="font-size: 12px; color: var(--text-secondary); text-transform: uppercase;">Net Payable Salary</div>
                <div style="font-size: 12px; font-style: italic; color: var(--text-muted);">${slip.netSalaryInWords}</div>
              </div>
              <div style="font-size: 22px; font-weight: 800; color: var(--pu-maroon-primary);">
                ₹${slip.netSalary.toLocaleString()}
              </div>
            </div>

            <div style="margin-top: 20px; display: flex; justify-content: flex-end; gap: 10px;">
              <button class="btn btn-secondary btn-sm" onclick="FacultyPortal.closeModal()">Close</button>
              <button class="btn btn-primary btn-sm" onclick="window.print()">🖨️ Print / Download PDF</button>
            </div>
          </div>
        `;
        break;

      case 'bus-pass':
        const bp = PU_DATA.facultyBusPass;
        modalTitle.innerHTML = `🚌 Parul University Transit Bus Pass`;
        modalBody.innerHTML = `
          <div style="max-width: 500px; margin: 0 auto; border: 2px solid var(--pu-maroon-primary); border-radius: 16px; padding: 22px; background: linear-gradient(135deg, rgba(128, 0, 32, 0.04) 0%, rgba(217, 119, 6, 0.04) 100%);">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid var(--pu-maroon-primary); padding-bottom: 12px; margin-bottom: 14px;">
              <div>
                <h3 style="margin: 0; color: var(--pu-maroon-primary); font-size: 16px;">PARUL UNIVERSITY TRANSPORT</h3>
                <span style="font-size: 11px; color: var(--text-muted);">Official Staff Transit Card</span>
              </div>
              <span class="badge badge-gold" style="font-size: 12px;">ROUTE ${bp.routeNo}</span>
            </div>

            <div style="font-size: 13px; line-height: 1.8;">
              <div><strong>Pass Holder:</strong> ${user.name}</div>
              <div><strong>Pass Number:</strong> <code>${bp.passNo}</code></div>
              <div><strong>Bus Registration:</strong> <strong>${bp.busNumber}</strong></div>
              <div><strong>Route:</strong> ${bp.routeName}</div>
              <div><strong>Pickup Stop:</strong> ${bp.pickupPoint}</div>
              <div><strong>Timings:</strong> Morning: <strong>${bp.pickupTime}</strong> | Evening Departure: <strong>${bp.dropTime}</strong></div>
              <div><strong>Assigned Driver:</strong> ${bp.driverName} (${bp.driverContact})</div>
              <div><strong>Valid Through:</strong> <span class="badge badge-success">${bp.validUpto}</span></div>
            </div>

            <div style="margin-top: 16px; text-align: center; padding-top: 12px; border-top: 1px dashed var(--border-subtle);">
              <span class="badge badge-success" style="font-size: 11px;">✓ BIOMETRIC TRANSIT VERIFIED</span>
            </div>
          </div>
        `;
        break;

      case 'resource-book':
        const bookings = PU_DATA.resourceBookings || [];
        modalTitle.innerHTML = `🏛️ Campus Facility & Laboratory Booking`;
        modalBody.innerHTML = `
          <div class="card" style="background: var(--bg-subtle); margin-bottom: 20px;">
            <h4 style="font-size: 14px; margin-bottom: 10px; color: var(--pu-maroon-primary);">Book Campus Hall / Lab</h4>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
              <div>
                <label class="form-label" style="font-size: 11.5px;">Resource / Facility</label>
                <select id="book-res-name" class="form-select">
                  <option>Dr. APJ Abdul Kalam Auditorium (500 Seats)</option>
                  <option>Seminar Hall 2 - Engineering Block A (120 Seats)</option>
                  <option>CSE AI & High-Performance Lab (Room 304)</option>
                  <option>Smart Conference Room A-102 (20 Seats)</option>
                </select>
              </div>
              <div>
                <label class="form-label" style="font-size: 11.5px;">Booking Date</label>
                <input type="date" id="book-res-date" class="form-control" value="2026-10-15">
              </div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
              <div>
                <label class="form-label" style="font-size: 11.5px;">Time Slot</label>
                <select id="book-res-slot" class="form-select">
                  <option>09:30 AM - 12:30 PM (Morning Session)</option>
                  <option>01:30 PM - 04:30 PM (Afternoon Session)</option>
                  <option>Full Day (09:00 AM - 05:00 PM)</option>
                </select>
              </div>
              <div>
                <label class="form-label" style="font-size: 11.5px;">Purpose / Event</label>
                <input type="text" id="book-res-purpose" class="form-control" placeholder="e.g. Expert Talk on Distributed Architecture">
              </div>
            </div>
            <button class="btn btn-primary btn-sm" onclick="FacultyPortal.bookCampusResource()">
              ✓ Reserve Resource
            </button>
          </div>

          <h4 style="font-size: 14px; margin-bottom: 8px;">Upcoming Facility Reservations</h4>
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Facility</th>
                  <th>Date & Time</th>
                  <th>Purpose</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${bookings.map(b => `
                  <tr>
                    <td><code>${b.id}</code></td>
                    <td><strong>${b.resourceName}</strong></td>
                    <td>${b.date} (${b.slot})</td>
                    <td>${b.purpose}</td>
                    <td><span class="badge ${b.status === 'CONFIRMED' ? 'badge-success' : 'badge-gold'}">${b.status}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `;
        break;

      case 'grievance':
        const grievances = PU_DATA.facultyGrievances || [];
        modalTitle.innerHTML = `📝 Faculty Grievance Registration & Helpdesk`;
        modalBody.innerHTML = `
          <div class="card" style="background: var(--bg-subtle); margin-bottom: 20px;">
            <h4 style="font-size: 14px; margin-bottom: 10px; color: var(--pu-maroon-primary);">Submit New Grievance / Request</h4>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
              <div>
                <label class="form-label" style="font-size: 11.5px;">Department / Category</label>
                <select id="grv-cat" class="form-select">
                  <option>IT & Network Support</option>
                  <option>Classroom Smart Projector / Audio</option>
                  <option>Campus Facilities & Maintenance</option>
                  <option>Academic & Examination Wing</option>
                </select>
              </div>
              <div>
                <label class="form-label" style="font-size: 11.5px;">Subject / Issue</label>
                <input type="text" id="grv-subj" class="form-control" placeholder="e.g. Wi-Fi AP connectivity issue in Lab 304">
              </div>
            </div>
            <div style="margin-bottom: 14px;">
              <label class="form-label" style="font-size: 11.5px;">Detailed Description</label>
              <textarea id="grv-desc" class="form-control" rows="2" placeholder="Provide specific room details, machine ID, or equipment info..."></textarea>
            </div>
            <button class="btn btn-primary btn-sm" onclick="FacultyPortal.submitGrievance()">
              Submit Grievance Ticket
            </button>
          </div>

          <h4 style="font-size: 14px; margin-bottom: 8px;">Logged Grievances & Status</h4>
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Ticket ID</th>
                  <th>Category</th>
                  <th>Subject</th>
                  <th>Logged Date</th>
                  <th>Resolution / Response</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${grievances.map(g => `
                  <tr>
                    <td><code>${g.id}</code></td>
                    <td><strong>${g.category}</strong></td>
                    <td>${g.subject}</td>
                    <td>${g.date}</td>
                    <td style="font-size: 12px;">${g.response}</td>
                    <td><span class="badge ${g.status === 'RESOLVED' ? 'badge-success' : 'badge-gold'}">${g.status}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `;
        break;

      case 'scan-block':
        const block = (PU_DATA.examBlocks || [])[0] || { blockNo: "B-204", room: "Block B 2nd Floor", course: "CS601", totalStudents: 32, scannedStudents: 30 };
        modalTitle.innerHTML = `🔍 Examination Block Attendance & QR Scanner`;
        modalBody.innerHTML = `
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <div>
              <div class="card" style="background: var(--bg-subtle); margin-bottom: 16px;">
                <h4 style="margin: 0 0 8px 0; color: var(--pu-maroon-primary);">Allocated Examination Block</h4>
                <div style="font-size: 13.5px; line-height: 1.8;">
                  <div><strong>Block Number:</strong> Block ${block.blockNo}</div>
                  <div><strong>Exam Hall:</strong> ${block.room}</div>
                  <div><strong>Course Code:</strong> ${block.course}</div>
                  <div><strong>Invigilator:</strong> ${user.name}</div>
                  <div><strong>Exam Timing:</strong> 10:00 AM - 12:30 PM</div>
                </div>
              </div>

              <div class="stat-card" style="margin-bottom: 16px;">
                <span class="stat-label">Block Attendance Counter</span>
                <span class="stat-value" id="scan-block-counter" style="color: #10B981;">${block.scannedStudents} / ${block.totalStudents} Scanned</span>
                <span class="stat-desc">Admit cards verified via QR scanner</span>
              </div>

              <button class="btn btn-primary" style="width: 100%;" onclick="FacultyPortal.simulateQRScan()">
                ⚡ Scan Next Student Hall Ticket (Simulated QR)
              </button>
            </div>

            <div style="border: 2px dashed var(--border-subtle); border-radius: var(--radius-lg); display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 24px; text-align: center; background: var(--bg-card);">
              <div style="font-size: 54px; margin-bottom: 12px;">📷</div>
              <h4 style="font-size: 15px; margin: 0 0 6px 0;">Barcode & QR Scanner Active</h4>
              <p style="font-size: 12.5px; color: var(--text-muted); max-width: 260px; margin: 0 0 16px 0;">
                Align the student university digital ID card or admit ticket QR code within the camera frame.
              </p>
              <div style="font-family: var(--font-mono); font-size: 12px; background: rgba(16, 185, 129, 0.15); color: #059669; padding: 6px 14px; border-radius: 20px;">
                Ready for next admission badge
              </div>
            </div>
          </div>
        `;
        break;

      case 'circular':
        const circs = PU_DATA.circulars || [];
        modalTitle.innerHTML = `📜 University Circulars & Dean's Official Orders`;
        modalBody.innerHTML = `
          <div style="display: flex; flex-direction: column; gap: 12px;">
            ${circs.map(c => `
              <div class="card" style="padding: 16px 20px;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px;">
                  <div>
                    <h4 style="margin: 0; font-size: 14.5px; color: var(--pu-maroon-primary);">${c.title}</h4>
                    <div style="font-size: 11.5px; color: var(--text-muted); margin-top: 2px;">
                      <strong>Issued By:</strong> ${c.authority} &bull; <strong>Date:</strong> ${c.date}
                    </div>
                  </div>
                  <span class="badge ${c.urgency === 'High' ? 'badge-danger' : 'badge-primary'}">${c.category}</span>
                </div>
                <p style="font-size: 13px; color: var(--text-secondary); margin: 8px 0 0 0; line-height: 1.5;">
                  ${c.summary}
                </p>
              </div>
            `).join('')}
          </div>
        `;
        break;

      case 'passenger-attendance':
        const passengers = PU_DATA.passengerRoster || [];
        modalTitle.innerHTML = `🚎 Bus Transit Passenger Attendance Roll-Call`;
        modalBody.innerHTML = `
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
            <div>
              <strong>Route 14 Bus Roster:</strong> Vadodara Station ⇄ Limda Campus &bull; <strong>Bus:</strong> GJ-06-PU-5542
            </div>
            <button class="btn btn-primary btn-sm" onclick="FacultyPortal.savePassengerAttendance()">
              💾 Save Transit Log
            </button>
          </div>
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Passenger ID</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Identifier</th>
                  <th>Assigned Stop</th>
                  <th style="text-align: center;">Transit Status</th>
                </tr>
              </thead>
              <tbody id="passenger-roster-tbody">
                ${passengers.map(p => `
                  <tr>
                    <td><code>${p.id}</code></td>
                    <td><strong>${p.name}</strong></td>
                    <td><span class="badge ${p.type === 'Faculty' ? 'badge-gold' : 'badge-primary'}">${p.type}</span></td>
                    <td><code>${p.enrollment}</code></td>
                    <td>${p.stop}</td>
                    <td style="text-align: center;">
                      <button 
                        class="status-toggle-btn ${p.status === 'PRESENT' ? 'active present' : 'active absent'}" 
                        onclick="FacultyPortal.togglePassenger('${p.id}')">
                        ${p.status}
                      </button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `;
        break;

      case 'edit-profile':
        const curFac = (PU_DATA.faculties && PU_DATA.faculties.find(f => f.id === user.id || f.employeeId === user.employeeId)) || user;
        modalTitle.innerHTML = `✏️ Edit Personal & Contact Details`;
        modalBody.innerHTML = `
          <form onsubmit="FacultyPortal.saveProfileUpdates(event)">
            <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 16px;">
              Core faculty identity and appointment details (Full Name, Parents' Names, Date of Joining, Employee ID) are certified by the Registrar & HR Division and cannot be modified without Dean approval.
            </p>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
              <div>
                <label class="form-label">Full Name (Locked)</label>
                <input type="text" class="form-control" value="${user.name}" disabled style="background: var(--bg-subtle); opacity: 0.8;">
              </div>
              <div>
                <label class="form-label">Date of Joining (Locked)</label>
                <input type="text" class="form-control" value="${curFac.dateOfJoining || '15 July 2017'}" disabled style="background: var(--bg-subtle); opacity: 0.8;">
              </div>
              <div>
                <label class="form-label">Father's Name (HR Certified)</label>
                <input type="text" class="form-control" value="${curFac.fatherName || 'Prof. Omprakash Sharma'}" disabled style="background: var(--bg-subtle); opacity: 0.8;">
              </div>
              <div>
                <label class="form-label">Mother's Name (HR Certified)</label>
                <input type="text" class="form-control" value="${curFac.motherName || 'Mrs. Shanti Sharma'}" disabled style="background: var(--bg-subtle); opacity: 0.8;">
              </div>
              <div>
                <label class="form-label">Mobile & WhatsApp Phone *</label>
                <input type="tel" id="faculty-edit-phone" class="form-control" value="${curFac.phone || '+91 98251 88210'}" required>
              </div>
              <div>
                <label class="form-label">Personal Alternate Email *</label>
                <input type="email" id="faculty-edit-personal-email" class="form-control" value="${curFac.personalEmail || 'rajesh.sharma.phd@gmail.com'}" required>
              </div>
              <div>
                <label class="form-label">Department Intercom Extension</label>
                <input type="text" id="faculty-edit-intercom" class="form-control" value="${curFac.intercom || 'Ext. 4088 (FET CSE Block A, Level 4)'}">
              </div>
              <div>
                <label class="form-label">Marital Status</label>
                <select id="faculty-edit-marital-status" class="form-select">
                  <option value="Married" ${(curFac.maritalStatus || 'Married') === 'Married' ? 'selected' : ''}>Married</option>
                  <option value="Single" ${(curFac.maritalStatus || '') === 'Single' ? 'selected' : ''}>Single</option>
                  <option value="Other" ${(curFac.maritalStatus || '') === 'Other' ? 'selected' : ''}>Other</option>
                </select>
              </div>
            </div>
            <div style="margin-bottom: 16px;">
              <label class="form-label">Emergency Contact (Name & Phone) *</label>
              <input type="text" id="faculty-edit-emergency" class="form-control" value="${curFac.emergencyContact || 'Mrs. Sunita Sharma (Spouse) - +91 98251 44520'}" required>
            </div>
            <div style="margin-bottom: 16px;">
              <label class="form-label">Residential Address (Campus Quarters / Local Residence) *</label>
              <textarea id="faculty-edit-res-address" class="form-control" rows="2" required>${curFac.residentialAddress || 'B-402, Faculty Enclave, Parul University Campus, Post Limda, Waghodia, Vadodara, Gujarat - 391760'}</textarea>
            </div>
            <div style="margin-bottom: 20px;">
              <label class="form-label">Permanent Home Address *</label>
              <textarea id="faculty-edit-perm-address" class="form-control" rows="2" required>${curFac.permanentAddress || 'Flat 12, Nilamber Greens, Vasna-Bhayli Main Road, Vadodara, Gujarat - 390015'}</textarea>
            </div>
            <div style="display: flex; justify-content: flex-end; gap: 10px;">
              <button type="button" class="btn btn-secondary" onclick="FacultyPortal.closeModal()">Cancel</button>
              <button type="submit" class="btn btn-primary">💾 Save Changes</button>
            </div>
          </form>
        `;
        break;

      case 'upload-photo':
        const facPhoto = (PU_DATA.faculties && PU_DATA.faculties.find(f => f.id === user.id || f.employeeId === user.employeeId)) || user;
        modalTitle.innerHTML = `📸 Upload / Update Profile Photograph`;
        modalBody.innerHTML = `
          <div style="text-align: center; margin-bottom: 20px;">
            <div style="width: 120px; height: 120px; border-radius: var(--radius-xl); margin: 0 auto 12px auto; overflow: hidden; border: 3px solid var(--pu-maroon-primary); box-shadow: 0 4px 14px rgba(0,0,0,0.15); display: flex; align-items: center; justify-content: center; background: #4A0012; color: #FFF; font-size: 40px; font-weight: 800;">
              ${facPhoto.photoUrl ? `<img src="${facPhoto.photoUrl}" id="modal-photo-preview" style="width: 100%; height: 100%; object-fit: cover;">` : `<span id="modal-photo-fallback">${facPhoto.avatarText || 'RS'}</span>`}
            </div>
            <p style="font-size: 12.5px; color: var(--text-muted); margin: 0;">
              Regulatory Norm: Passport format (35mm × 45mm), formal attire with plain light background.
            </p>
          </div>

          <div style="display: flex; flex-direction: column; gap: 16px;">
            <div>
              <label class="form-label" style="font-weight: 700;">Option 1: Upload Image File from Device</label>
              <input type="file" id="faculty-photo-file-input" class="form-control" accept="image/jpeg,image/png,image/webp" onchange="FacultyPortal.handlePhotoFileSelect(event)">
              <span style="font-size: 11px; color: var(--text-muted);">Accepted formats: JPG, PNG, WEBP (Max 2 MB)</span>
            </div>

            <div style="display: flex; align-items: center; gap: 10px; margin: 4px 0;">
              <div style="flex: 1; height: 1px; background: var(--border-subtle);"></div>
              <span style="font-size: 11px; color: var(--text-muted); text-transform: uppercase;">OR</span>
              <div style="flex: 1; height: 1px; background: var(--border-subtle);"></div>
            </div>

            <div>
              <label class="form-label" style="font-weight: 700;">Option 2: Image URL / Web Link</label>
              <input type="url" id="faculty-photo-url-input" class="form-control" placeholder="https://example.com/photo.jpg" value="${facPhoto.photoUrl || ''}">
            </div>

            <div>
              <label class="form-label" style="font-weight: 700;">Option 3: Choose Professional Preset Avatar</label>
              <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                <button type="button" class="btn btn-secondary btn-sm" onclick="FacultyPortal.savePhotoUpload('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80')">
                  Portrait 1 (Academic)
                </button>
                <button type="button" class="btn btn-secondary btn-sm" onclick="FacultyPortal.savePhotoUpload('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80')">
                  Portrait 2 (Executive)
                </button>
                <button type="button" class="btn btn-secondary btn-sm" onclick="FacultyPortal.savePhotoUpload('')">
                  Use Monogram Initial (${facPhoto.avatarText || 'RS'})
                </button>
              </div>
            </div>

            <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 10px;">
              <button type="button" class="btn btn-secondary" onclick="FacultyPortal.closeModal()">Cancel</button>
              <button type="button" class="btn btn-primary" onclick="FacultyPortal.savePhotoFromInput()">
                💾 Save Photo
              </button>
            </div>
          </div>
        `;
        break;

      case 'change-password':
        modalTitle.innerHTML = `🔐 Change Staff Master Password`;
        modalBody.innerHTML = `
          <form onsubmit="FacultyPortal.savePasswordChange(event)">
            <div style="margin-bottom: 14px;">
              <label class="form-label">Current Password / Initial Password *</label>
              <input type="password" id="fac-current-password" class="form-control" placeholder="Enter current password (e.g. Faculty@123)" required>
            </div>
            <div style="margin-bottom: 14px;">
              <label class="form-label">New Password *</label>
              <input type="password" id="fac-new-password" class="form-control" minlength="6" placeholder="Minimum 6 characters" required>
            </div>
            <div style="margin-bottom: 20px;">
              <label class="form-label">Confirm New Password *</label>
              <input type="password" id="fac-confirm-password" class="form-control" minlength="6" placeholder="Re-enter new password" required>
            </div>
            <div style="display: flex; justify-content: flex-end; gap: 10px;">
              <button type="button" class="btn btn-secondary" onclick="FacultyPortal.closeModal()">Cancel</button>
              <button type="submit" class="btn btn-primary">Update Password</button>
            </div>
          </form>
        `;
        break;

      case 'credentials-dossier':
        modalTitle.innerHTML = `📜 Official Faculty Credential Verification Dossier`;
        modalBody.innerHTML = `
          <div style="padding: 20px; background: white; color: #111827; border-radius: var(--radius-lg); font-family: 'Times New Roman', serif;">
            <div style="text-align: center; border-bottom: 2px solid #800020; padding-bottom: 12px; margin-bottom: 16px;">
              <h3 style="margin: 0; color: #800020; font-size: 20px; font-weight: 800; letter-spacing: 0.5px;">PARUL UNIVERSITY</h3>
              <p style="margin: 2px 0 0 0; font-size: 13px; color: #374151;">P.O. Limda, Tal. Waghodia, Vadodara, Gujarat - 391760</p>
              <p style="margin: 2px 0 0 0; font-size: 12px; font-weight: 700; color: #6B7280;">FACULTY OF ENGINEERING & TECHNOLOGY (FET)</p>
            </div>

            <div style="text-align: center; margin-bottom: 16px;">
              <h4 style="margin: 0; font-size: 16px; text-decoration: underline;">OFFICIAL FACULTY APPOINTMENT & CREDENTIAL CERTIFICATE</h4>
              <p style="margin: 4px 0 0 0; font-size: 11px; color: #6B7280;">Registry Document No: PU/HR/FAC-DOSSIER/2026/8821</p>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 13px; line-height: 1.6; margin-bottom: 20px;">
              <div><strong>Institute Name:</strong> Parul Institute of Engineering & Technology</div>
              <div><strong>Institute ID:</strong> PU-FET-VADODARA-104</div>
              <div><strong>Institute URL:</strong> https://paruluniversity.ac.in</div>
              <div><strong>Faculty Staff ID:</strong> PU-FAC-8821</div>
              <div><strong>Staff Name:</strong> Dr. Rajesh Sharma</div>
              <div><strong>Designation:</strong> Associate Professor & Senior Proctor</div>
              <div><strong>Department:</strong> Computer Science & Engineering</div>
              <div><strong>Date of Joining:</strong> 15 July 2017</div>
              <div><strong>Father's Name:</strong> Prof. Omprakash Sharma</div>
              <div><strong>Mother's Name:</strong> Mrs. Shanti Sharma</div>
              <div><strong>Highest Qualification:</strong> Ph.D. in CSE (IIT Bombay)</div>
              <div><strong>Total Experience:</strong> 18.2 Years (14.5 Teaching + 3.7 R&D)</div>
              <div><strong>Approved Workload:</strong> 18 Hours / Week (AICTE Compliant)</div>
              <div><strong>Research Publications:</strong> 34 (24 Scopus, 8 SCI/SCIE)</div>
              <div><strong>Patents Published/Granted:</strong> 3 Official Patents</div>
              <div><strong>Consultancy Outlay:</strong> ₹26.70 Lakhs</div>
            </div>

            <div style="border-top: 1px dashed #D1D5DB; padding-top: 14px; display: flex; justify-content: space-between; align-items: flex-end; font-size: 12px;">
              <div>
                <strong>Digital Verification Hash:</strong><br>
                <code style="font-size: 10px;">SHA256: 4F88B1...8821:PARUL_REGISTRAR</code><br>
                <span style="color: #059669; font-weight: 700;">Status: VERIFIED & ACTIVE IN SERVICE</span>
              </div>
              <div style="text-align: center;">
                <div style="font-weight: 700; color: #800020; font-family: cursive; font-size: 16px;">Dr. M. N. Patel</div>
                <div style="border-top: 1px solid #111; width: 140px; margin: 4px auto;"></div>
                <div>Registrar / Provost</div>
                <div>Parul University</div>
              </div>
            </div>
          </div>
          <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 16px;">
            <button class="btn btn-secondary" onclick="FacultyPortal.closeModal()">Close</button>
            <button class="btn btn-primary" onclick="window.print()">🖨️ Print Dossier</button>
          </div>
        `;
        break;

      default:
        modalTitle.innerText = "Module Details";
        modalBody.innerHTML = `<p>Module content loading...</p>`;
    }

    modalOverlay.classList.add('active');
  }

  function closeModal() {
    const modalOverlay = document.getElementById('faculty-service-modal-overlay');
    if (modalOverlay) modalOverlay.classList.remove('active');
  }

  function changeDivisionTimetable(divKey) {
    activeDivisionTimetable = divKey;
    const container = document.getElementById('division-timetable-table-container');
    if (container) container.innerHTML = renderDivisionTimetableTable(divKey);
  }

  function renderDivisionTimetableTable(divKey) {
    const timetable = (PU_DATA.divisionTimetables && PU_DATA.divisionTimetables[divKey]) || [];
    return `
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Time Slot</th>
              <th>Monday</th>
              <th>Tuesday</th>
              <th>Wednesday</th>
              <th>Thursday</th>
              <th>Friday</th>
            </tr>
          </thead>
          <tbody>
            ${timetable.map(row => `
              <tr>
                <td><strong>${row.slot}</strong></td>
                <td>${row.mon}</td>
                <td>${row.tue}</td>
                <td>${row.wed}</td>
                <td>${row.thu}</td>
                <td>${row.fri}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  function simulateQRScan() {
    const block = (PU_DATA.examBlocks || [])[0];
    if (block && block.scannedStudents < block.totalStudents) {
      block.scannedStudents++;
      const counterEl = document.getElementById('scan-block-counter');
      if (counterEl) counterEl.innerText = `${block.scannedStudents} / ${block.totalStudents} Scanned`;

      RealtimeEngine.logAuditEvent({
        actor: AuthEngine.getCurrentUser()?.name || "Exam Invigilator",
        role: "FACULTY",
        action: "EXAM_QR_ATTENDANCE_SCANNED",
        resource: `Block ${block.blockNo} - Student Roll #${block.scannedStudents}`,
        status: "SUCCESS"
      });

      RealtimeEngine.showToast({
        title: "Admit Card Scanned!",
        message: `Student verified for Block ${block.blockNo}. Total scanned: ${block.scannedStudents}/${block.totalStudents}`,
        type: "success"
      });
    } else {
      RealtimeEngine.showToast({
        title: "All Students Scanned!",
        message: `All ${block.totalStudents} candidate admit cards have already been recorded for this block.`,
        type: "info"
      });
    }
  }

  function bookCampusResource() {
    const resName = document.getElementById('book-res-name')?.value || 'Dr. APJ Abdul Kalam Auditorium';
    const date = document.getElementById('book-res-date')?.value || '2026-10-15';
    const slot = document.getElementById('book-res-slot')?.value || 'Morning Session';
    const purpose = document.getElementById('book-res-purpose')?.value || 'Faculty Guest Lecture';

    const newId = `RES-${Math.floor(100 + Math.random() * 900)}`;
    (PU_DATA.resourceBookings || []).unshift({
      id: newId,
      resourceName: resName,
      date,
      slot,
      purpose,
      attendees: 75,
      status: "CONFIRMED"
    });

    RealtimeEngine.logAuditEvent({
      actor: AuthEngine.getCurrentUser()?.name || "Faculty Guide",
      role: "FACULTY",
      action: "FACILITY_BOOKED",
      resource: `${resName} on ${date}`,
      status: "SUCCESS"
    });

    RealtimeEngine.showToast({
      title: "Facility Reserved!",
      message: `${resName} booked successfully for ${date} (${slot}). Reservation ID: ${newId}.`,
      type: "success"
    });

    closeModal();
    render(document.getElementById('portal-view-container'));
  }

  function submitGrievance() {
    const cat = document.getElementById('grv-cat')?.value || 'IT & Network Support';
    const subj = document.getElementById('grv-subj')?.value || 'Projector calibration';

    const newId = `GRV-FAC-2026-${Math.floor(100 + Math.random() * 900)}`;
    (PU_DATA.facultyGrievances || []).unshift({
      id: newId,
      category: cat,
      subject: subj,
      date: new Date().toISOString().split('T')[0],
      status: "IN PROGRESS",
      response: "Assigned to Campus Engineer for immediate inspection."
    });

    RealtimeEngine.logAuditEvent({
      actor: AuthEngine.getCurrentUser()?.name || "Faculty Member",
      role: "FACULTY",
      action: "GRIEVANCE_LODGED",
      resource: `Ticket #${newId} [${cat}]`,
      status: "SUCCESS"
    });

    RealtimeEngine.showToast({
      title: "Grievance Ticket Lodged!",
      message: `Ticket #${newId} logged with Campus Administration. Tracking active.`,
      type: "info"
    });

    closeModal();
  }

  function togglePassenger(passengerId) {
    const p = (PU_DATA.passengerRoster || []).find(x => x.id === passengerId);
    if (p) {
      p.status = p.status === 'PRESENT' ? 'ABSENT' : 'PRESENT';
      openModal('passenger-attendance');
    }
  }

  function savePassengerAttendance() {
    RealtimeEngine.showToast({
      title: "Transit Log Synchronized!",
      message: "Bus Route 14 daily passenger roll-call committed to Transport Office Gateway.",
      type: "success"
    });
    closeModal();
  }

  /**
   * Renders student roster rows for the attendance entry console
   */
  function renderRosterRows() {
    const list = getFilteredRoster();
    if (!list || list.length === 0) {
      return `<tr><td colspan="6" style="text-align: center; padding: 24px; color: var(--text-muted);">No students registered in this division.</td></tr>`;
    }
    return list.map(student => {
      const currentStatus = rosterAttendanceState[student.id] || 'PRESENT';
      const stats = (student.attendanceStats && student.attendanceStats[activeCourseCode]) || { held: 38, attended: 34 };
      const pct = calculateAttendancePercentage(stats.attended, stats.held);
      const divTag = `<span class="badge ${student.section === '6A' ? 'badge-primary' : 'badge-gold'}" style="margin-left: 6px; font-size: 10px; padding: 2px 6px;">Div ${student.section === '6B' ? 'B' : 'A'}</span>`;

      return `
        <tr>
          <td><strong>${student.rollNo}</strong></td>
          <td><code style="font-size: 12px;">${student.enrollmentNo}</code></td>
          <td>
            <div style="font-weight: 700; color: var(--text-primary); display: flex; align-items: center;">${student.name} ${divTag}</div>
            <div style="font-size: 12px; color: var(--text-muted);">${student.email}</div>
          </td>
          <td style="font-size: 12.5px;">${student.hostel}</td>
          <td style="text-align: center;">
            <strong style="color: ${pct >= 75 ? 'var(--color-success)' : 'var(--color-danger)'};">${pct}%</strong>
          </td>
          <td style="text-align: center;">
            <div class="status-toggle-group">
              <button 
                class="status-toggle-btn ${currentStatus === 'PRESENT' ? 'active present' : ''}" 
                onclick="FacultyPortal.toggleStudentStatus('${student.id}', 'PRESENT')">
                PRESENT
              </button>
              <button 
                class="status-toggle-btn ${currentStatus === 'ABSENT' ? 'active absent' : ''}" 
                onclick="FacultyPortal.toggleStudentStatus('${student.id}', 'ABSENT')">
                ABSENT
              </button>
              <button 
                class="status-toggle-btn ${currentStatus === 'LATE' ? 'active late' : ''}" 
                onclick="FacultyPortal.toggleStudentStatus('${student.id}', 'LATE')">
                LATE
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  function calculateSlotSummary() {
    const list = getFilteredRoster();
    let present = 0;
    let total = list.length;
    list.forEach(student => {
      const st = rosterAttendanceState[student.id] || 'PRESENT';
      if (st === 'PRESENT') present++;
    });
    const pct = total > 0 ? Math.round((present / total) * 100) : 0;
    const divName = activeSection === 'ALL' ? 'All Divisions' : `Div ${activeSection === '6A' ? 'A' : 'B'}`;
    return `Slot Attendance (${divName}): ${present} / ${total} Present (${pct}%)`;
  }

  function updateSlotSummaryUI() {
    const summaryEl = document.getElementById('slot-attendance-summary');
    if (summaryEl) summaryEl.innerText = calculateSlotSummary();
    const countEl = document.getElementById('faculty-roster-count-label');
    if (countEl) countEl.innerText = `${getFilteredRoster().length} students`;
    const courseLabel = document.getElementById('faculty-active-course-label');
    if (courseLabel) courseLabel.innerText = `${activeCourseCode} (CSE-${activeSection})`;
  }

  function toggleStudentStatus(studentId, newStatus) {
    rosterAttendanceState[studentId] = newStatus;
    const tbody = document.getElementById('faculty-roster-tbody');
    if (tbody) tbody.innerHTML = renderRosterRows();
    updateSlotSummaryUI();
  }

  function markAll(status) {
    getFilteredRoster().forEach(s => {
      rosterAttendanceState[s.id] = status;
    });
    const tbody = document.getElementById('faculty-roster-tbody');
    if (tbody) tbody.innerHTML = renderRosterRows();
    updateSlotSummaryUI();
  }

  function handleSectionChange(newSection) {
    activeSection = newSection;
    const tbody = document.getElementById('faculty-roster-tbody');
    if (tbody) tbody.innerHTML = renderRosterRows();
    updateSlotSummaryUI();
  }

  function handleCourseChange(newCourseCode) {
    activeCourseCode = newCourseCode;
    const currentCourse = (PU_DATA.courses || []).find(c => c.code === activeCourseCode) || { code: activeCourseCode, title: "Course Evaluation" };
    const marksSubtitle = document.getElementById('faculty-marks-course-subtitle');
    if (marksSubtitle) {
      marksSubtitle.innerText = `Evaluation grade entry for Course: ${currentCourse.code} - ${currentCourse.title}`;
    }
    const tbody = document.getElementById('faculty-roster-tbody');
    if (tbody) tbody.innerHTML = renderRosterRows();
    updateSlotSummaryUI();
  }

  function renderMarksRows() {
    const marksData = [
      { rollNo: "CSE-21-001", name: "Aarav Mehta", section: "6A", it: 38, mid: 19, lab: 19, total: 76, badge: '<span class="badge badge-success">Top Quartile</span>' },
      { rollNo: "CSE-21-002", name: "Diya Sharma", section: "6A", it: 35, mid: 17, lab: 18, total: 70, badge: '<span class="badge badge-success">Good</span>' },
      { rollNo: "CSE-21-003", name: "Rohan Patel", section: "6A", it: 32, mid: 15, lab: 16, total: 63, badge: '<span class="badge badge-gold">Average</span>' },
      { rollNo: "CSE-21-004", name: "Ananya Iyer", section: "6B", it: 37, mid: 18, lab: 18, total: 73, badge: '<span class="badge badge-success">Top Quartile</span>' },
      { rollNo: "CSE-21-005", name: "Kabir Verma", section: "6B", it: 30, mid: 14, lab: 15, total: 59, badge: '<span class="badge badge-gold">Average</span>' },
      { rollNo: "CSE-21-006", name: "Pooja Desai", section: "6B", it: 36, mid: 17, lab: 18, total: 71, badge: '<span class="badge badge-success">Good</span>' }
    ];

    return marksData.map(m => `
      <tr>
        <td><strong>${m.rollNo}</strong></td>
        <td>
          <div style="font-weight: 700; color: var(--text-primary); display: flex; align-items: center;">
            ${m.name}
            <span class="badge ${m.section === '6A' ? 'badge-primary' : 'badge-gold'}" style="margin-left: 8px; font-size: 10px; padding: 2px 7px;">Div ${m.section === '6A' ? 'A' : 'B'}</span>
          </div>
        </td>
        <td><input type="number" class="form-control" style="width: 80px;" value="${m.it}" max="40"></td>
        <td><input type="number" class="form-control" style="width: 80px;" value="${m.mid}" max="20"></td>
        <td><input type="number" class="form-control" style="width: 80px;" value="${m.lab}" max="20"></td>
        <td><strong style="color: var(--pu-maroon-primary); font-size: 15px;">${m.total} / 80</strong></td>
        <td>${m.badge}</td>
      </tr>
    `).join('');
  }

  function renderTimetableRows(user, allocatedCodes) {
    return `
      <tr>
        <td><strong>Monday</strong></td>
        <td>CS601 (CSE-6A)<br><small>Hall 204</small></td>
        <td><span class="badge badge-gold">Project Mentorship</span></td>
        <td>CS604 (CSE-6B)<br><small>Hall 204</small></td>
        <td style="color: var(--text-muted);">Lunch Break</td>
        <td>Research Lab Guidance</td>
      </tr>
      <tr style="background: rgba(128, 0, 32, 0.04);">
        <td><strong>Tuesday (Today)</strong></td>
        <td>-</td>
        <td><strong style="color: var(--pu-maroon-primary);">CS601 (CSE-6A)</strong><br><small>Active Slot</small></td>
        <td>CS601 (CSE-6B)<br><small>Hall 205</small></td>
        <td style="color: var(--text-muted);">Lunch Break</td>
        <td>High-Performance AI Lab</td>
      </tr>
      <tr>
        <td><strong>Wednesday</strong></td>
        <td>CS604 (CSE-6A)<br><small>Hall 204</small></td>
        <td>-</td>
        <td>Capstone Project Review<br><small>Room 304</small></td>
        <td style="color: var(--text-muted);">Lunch Break</td>
        <td>Department Council Meeting</td>
      </tr>
      <tr>
        <td><strong>Thursday</strong></td>
        <td>CS601 (CSE-6B)<br><small>Hall 205</small></td>
        <td>Web Engineering Lab<br><small>Lab 301</small></td>
        <td>-</td>
        <td style="color: var(--text-muted);">Lunch Break</td>
        <td>Proctor Consultation Hours</td>
      </tr>
      <tr>
        <td><strong>Friday</strong></td>
        <td>CS604 Practical<br><small>Lab 304</small></td>
        <td>CS601 (CSE-6A)<br><small>Hall 204</small></td>
        <td>-</td>
        <td style="color: var(--text-muted);">Lunch Break</td>
        <td>Innovation & Tech Expo Review</td>
      </tr>
    `;
  }

  function renderFacultyOutpasses() {
    const list = PU_DATA.outpasses || [];
    if (list.length === 0) {
      return `<p style="text-align: center; padding: 24px; color: var(--text-muted);">No outpass requests in queue.</p>`;
    }
    return list.map(op => {
      const isPending = op.status === 'PENDING';
      const statusBadge = isPending 
        ? `<span class="badge badge-gold">Pending Proctor Review</span>`
        : (op.status === 'APPROVED' ? `<span class="badge badge-success">✓ Approved</span>` : `<span class="badge badge-danger">✕ Rejected</span>`);

      return `
        <div class="card" style="margin-bottom: 16px; border-left: 4px solid ${isPending ? '#F59E0B' : (op.status === 'APPROVED' ? '#10B981' : '#EF4444')};">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
            <div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <h4 style="margin: 0; font-size: 15px; color: var(--text-primary);">${op.studentName}</h4>
                <code style="font-size: 12px;">${op.enrollmentNo}</code>
                ${statusBadge}
              </div>
              <p style="margin: 4px 0 0 0; font-size: 12.5px; color: var(--text-muted);">
                ${op.hostel} &bull; Parent Contact: <strong>${op.parentPhone}</strong>
              </p>
            </div>
            <div style="text-align: right; font-size: 12px; color: var(--text-muted);">
              Ref: <code>#${op.id}</code>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; background: var(--bg-subtle); padding: 12px; border-radius: var(--radius-sm); font-size: 13px; margin-bottom: 14px;">
            <div>
              <div><strong>Departure:</strong> ${op.outDate} at ${op.outTime}</div>
              <div><strong>Expected Return:</strong> ${op.inDate} at ${op.inTime}</div>
            </div>
            <div>
              <div><strong>Destination:</strong> ${op.destination}</div>
              <div><strong>Reason:</strong> ${op.reason}</div>
            </div>
          </div>

          ${isPending ? `
            <div style="display: flex; justify-content: flex-end; gap: 10px;">
              <button class="btn btn-secondary btn-sm" style="color: #EF4444;" onclick="FacultyPortal.handleOutpassDecision('${op.id}', 'REJECTED')">
                ✕ Reject Request
              </button>
              <button class="btn btn-primary btn-sm" onclick="FacultyPortal.handleOutpassDecision('${op.id}', 'APPROVED')">
                ✓ Authorize Official Gatepass
              </button>
            </div>
          ` : `
            <div style="font-size: 12px; color: var(--text-muted); display: flex; justify-content: space-between;">
              <span>Processed by: <strong>${op.approvedBy || 'Proctor Office'}</strong></span>
              <span>Timestamp: ${op.approvedAt || '2026-09-25 15:30'}</span>
            </div>
          `}
        </div>
      `;
    }).join('');
  }

  function handleOutpassDecision(outpassId, decision) {
    const outpass = (PU_DATA.outpasses || []).find(op => op.id === outpassId);
    if (!outpass) return;

    const facultyUser = AuthEngine.getCurrentUser() || { name: "Proctor Office" };
    outpass.status = decision;
    outpass.approvedBy = `${facultyUser.name} (Proctor)`;
    outpass.approvedAt = new Date().toISOString().replace('T', ' ').substring(0, 19);

    RealtimeEngine.logAuditEvent({
      actor: facultyUser.name,
      role: "FACULTY",
      action: decision === 'APPROVED' ? "OUTPASS_APPROVED" : "OUTPASS_REJECTED",
      resource: `Gatepass #${outpassId} marked as ${decision}`,
      status: "SUCCESS"
    });

    RealtimeEngine.showToast({
      title: `Outpass ${decision}!`,
      message: `Gatepass #${outpassId} has been marked as ${decision}. Student portal notified in real-time.`,
      type: decision === 'APPROVED' ? 'success' : 'danger'
    });

    const container = document.getElementById('faculty-outpass-approval-list');
    if (container) container.innerHTML = renderFacultyOutpasses();
  }

  function saveAndBroadcastAttendance() {
    const user = AuthEngine.getCurrentUser() || { name: "Faculty Instructor" };
    const dateStr = new Date().toISOString().split('T')[0];

    const attendanceRecords = Object.keys(rosterAttendanceState).map(studentId => {
      const student = (PU_DATA.studentRoster || []).find(s => s.id === studentId);
      return {
        studentId,
        enrollmentNo: student?.enrollmentNo || '',
        name: student?.name || '',
        status: rosterAttendanceState[studentId]
      };
    });

    RealtimeEngine.broadcastAttendanceUpdate({
      courseCode: activeCourseCode,
      slot: activeSlot,
      date: dateStr,
      faculty: user.name,
      division: activeSection,
      records: attendanceRecords
    });

    RealtimeEngine.logAuditEvent({
      actor: user.name,
      role: "FACULTY",
      action: "ATTENDANCE_MARKED",
      resource: `Course ${activeCourseCode} (Div ${activeSection}) - Slot ${activeSlot}`,
      status: "SUCCESS"
    });

    RealtimeEngine.showToast({
      title: "Attendance Broadcasted Live!",
      message: `Hourly attendance for ${activeCourseCode} (${activeSection}) recorded. Live notification dispatched to all students.`,
      type: "success"
    });
  }

  function saveMarksEvaluation() {
    const facultyUser = AuthEngine.getCurrentUser() || { name: "Faculty Instructor" };
    RealtimeEngine.logAuditEvent({
      actor: facultyUser.name,
      role: "FACULTY",
      action: "MARKS_EVALUATION_SAVED",
      resource: `Course ${activeCourseCode} Continuous Assessment Sheets`,
      status: "SUCCESS"
    });
    RealtimeEngine.showToast({
      title: "Marks Saved Successfully!",
      message: `Internal and mid-sem assessment marks locked and synced to exam controller database for ${activeCourseCode}.`,
      type: "success"
    });
  }

  /**
   * =========================================================================
   * FACULTY PROFILE, CREDENTIALS & PERFORMANCE PORTFOLIO SUBSYSTEM
   * =========================================================================
   */
  function renderFacultyProfileTab(user) {
    user = user || AuthEngine.getCurrentUser() || (PU_DATA.faculties && PU_DATA.faculties[0]) || {};
    const match = (PU_DATA.faculties && PU_DATA.faculties.find(f => (user.id && f.id === user.id) || (user.employeeId && f.employeeId === user.employeeId))) || user;

    const instituteUrl = user.instituteUrl || match.instituteUrl || "https://paruluniversity.ac.in";
    const institutePortalUrl = user.institutePortalUrl || match.institutePortalUrl || "https://smis.paruluniversity.ac.in";
    const instituteId = user.instituteId || match.instituteId || "PU-FET-VADODARA-104";
    const instituteName = user.instituteName || match.instituteName || "Faculty of Engineering & Technology (FET), Parul University";
    const employeeId = user.employeeId || match.employeeId || "PU-FAC-8821";
    const facultyId = user.facultyId || match.facultyId || employeeId;
    const initialPassword = user.initialPassword || match.initialPassword || "Faculty@123";
    const passwordGeneratedBy = user.passwordGeneratedBy || match.passwordGeneratedBy || "Department Head (HOD CSE) / System Administrator";
    const passwordGeneratedDate = user.passwordGeneratedDate || match.passwordGeneratedDate || "2017-07-15";

    const fullName = user.name || match.name || "Dr. Rajesh Sharma";
    const fatherName = user.fatherName || match.fatherName || "Prof. Omprakash Sharma";
    const motherName = user.motherName || match.motherName || "Mrs. Shanti Sharma";
    const dateOfJoining = user.dateOfJoining || match.dateOfJoining || "15 July 2017";
    const dob = user.dob || match.dob || "1982-04-18";
    const gender = user.gender || match.gender || "Male";
    const maritalStatus = user.maritalStatus || match.maritalStatus || "Married";
    const bloodGroup = user.bloodGroup || match.bloodGroup || "B+ Positive";
    const nationality = user.nationality || match.nationality || "Indian";
    const phone = user.phone || match.phone || "+91 98251 88210";
    const personalEmail = user.personalEmail || match.personalEmail || "rajesh.sharma.phd@gmail.com";
    const officialEmail = user.email || match.email || "rajesh.sharma@paruluniversity.ac.in";
    const intercom = user.intercom || match.intercom || "Ext. 4088 (FET CSE Block A, Level 4)";
    const emergencyContact = user.emergencyContact || match.emergencyContact || "Mrs. Sunita Sharma (Spouse) - +91 98251 44520";
    const residentialAddress = user.residentialAddress || match.residentialAddress || "B-402, Faculty Enclave, Parul University Campus, Post Limda, Waghodia, Vadodara, Gujarat - 391760";
    const permanentAddress = user.permanentAddress || match.permanentAddress || "Flat 12, Nilamber Greens, Vasna-Bhayli Main Road, Vadodara, Gujarat - 390015";
    const photoUrl = user.photoUrl || match.photoUrl || "";
    const avatarText = user.avatarText || match.avatarText || "RS";

    const qualifications = user.qualifications || match.qualifications || [
      {
        degree: "Ph.D. in Computer Science & Engineering",
        institution: "Indian Institute of Technology (IIT) Bombay",
        year: "2016",
        specialization: "Cloud Architectures, Distributed Systems & Fault Tolerance",
        thesis: "Adaptive Resource Provisioning and SLA Enforcement in Heterogeneous Cloud Environments",
        grade: "Doctoral Degree with Excellence Citation"
      },
      {
        degree: "M.Tech in Computer Engineering",
        institution: "Veermata Jijabai Technological Institute (VJTI), Mumbai",
        year: "2011",
        specialization: "Software Systems, High-Performance Computing & Network Security",
        grade: "First Class with Distinction (Institute Gold Medalist, 9.42 CGPA)"
      },
      {
        degree: "B.E. in Computer Science & Engineering",
        institution: "The Maharaja Sayajirao University of Baroda (MSU)",
        year: "2008",
        specialization: "Computer Science & Engineering",
        grade: "First Class with Distinction (84.6% Aggregate)"
      }
    ];

    const certifications = user.certifications || match.certifications || [
      "AWS Certified Solutions Architect – Professional (SAP-C02)",
      "NVIDIA Deep Learning Institute (DLI) University Ambassador",
      "Google Cloud Certified Professional Cloud Architect",
      "UGC-NET Qualified with Junior Research Fellowship (JRF)"
    ];

    const experienceHistory = user.experienceHistory || match.experienceHistory || [
      {
        designation: "Associate Professor & Senior Proctor",
        organization: "Faculty of Engineering & Technology, Parul University",
        period: "Jul 2021 – Present",
        duration: "5+ Years",
        responsibilities: "Post-graduate & undergraduate courses in Cloud & Web Technologies, Chief Proctorial Student Mentoring, Capstone Industry Guide, NBA Criteria 3 Coordinator."
      },
      {
        designation: "Assistant Professor (Senior Grade)",
        organization: "Faculty of Engineering & Technology, Parul University",
        period: "Jul 2017 – Jun 2021",
        duration: "4 Years",
        responsibilities: "Curriculum Design & Syllabi Revision, Department Examination Coordinator, CoE IoT Cloud Computing Lab Lead, Student Outpass / Gatepass Proctor."
      },
      {
        designation: "Assistant Professor",
        organization: "Sardar Vallabhbhai National Institute of Technology (SVNIT), Surat",
        period: "Jul 2012 – Jun 2017",
        duration: "5 Years",
        responsibilities: "UG/PG Teaching, Operating Systems Laboratory, Distributed Computing Systems Research Lab Development, M.Tech Thesis Guidance."
      },
      {
        designation: "Senior Systems Engineer / R&D Specialist",
        organization: "Tata Consultancy Services (TCS Innovation Labs), Pune",
        period: "Aug 2008 – Jul 2010",
        duration: "2 Years",
        responsibilities: "Enterprise Multi-Tenant Cloud Migration, Distributed In-Memory Cache Optimization, High-Concurrency Benchmarking."
      }
    ];

    const teachingWorkload = user.teachingWorkload || match.teachingWorkload || {
      totalWeeklyHours: 18,
      aicteNorm: "16 - 18 Hours / Week (Associate Professor Norm)",
      complianceStatus: "100% Compliant (AICTE / UGC Regulations)",
      breakdown: [
        { type: "Theory Lectures", hours: 8, description: "4 Classroom slots (CS601 & CS605 across Div 6A & 6B)" },
        { type: "Laboratory Practical Sessions", hours: 8, description: "4 Hands-on Lab Batches (Advanced Web & Cloud Architectures)" },
        { type: "Capstone Mentorship & Tutorials", hours: 2, description: "Weekly Guided Project Review & Remedial Mentorship" }
      ]
    };

    const assignedCourses = user.assignedCourses || match.assignedCourses || [
      { code: "CS601", title: "Advanced Web Technologies", credits: 4, type: "Core Theory + Lab", division: "6A & 6B", studentsCount: 130, contactHours: "5 Hrs/Wk", venue: "Hall FET-204 / Web Tech Lab 304" },
      { code: "CS605", title: "Cloud Computing Architecture", credits: 4, type: "Core Theory + Lab", division: "6A & 6B", studentsCount: 130, contactHours: "5 Hrs/Wk", venue: "Hall FET-205 / Cloud Lab 306" },
      { code: "CS606", title: "High-Performance Distributed Systems", credits: 3, type: "Professional Elective", division: "6A", studentsCount: 65, contactHours: "5 Hrs/Wk", venue: "Seminar Hall 1 / HPC Lab" },
      { code: "PRJ601", title: "Capstone Industry Project Mentorship", credits: 6, type: "Practical Project", division: "6A & 6B", studentsCount: 22, contactHours: "3 Hrs/Wk", venue: "Innovation CoE Block" }
    ];

    const teachingSchedule = user.teachingSchedule || match.teachingSchedule || [
      { day: "Monday", time: "10:00 AM - 11:00 AM", course: "CS601 (Theory)", division: "Div 6A", venue: "Hall 204" },
      { day: "Monday", time: "11:15 AM - 01:15 PM", course: "CS601 (Lab Practical)", division: "Batch A1", venue: "Lab 304" },
      { day: "Tuesday", time: "09:00 AM - 10:00 AM", course: "CS605 (Theory)", division: "Div 6B", venue: "Hall 205" },
      { day: "Tuesday", time: "02:00 PM - 04:00 PM", course: "CS605 (Cloud Lab)", division: "Batch B1", venue: "Cloud Lab 306" },
      { day: "Wednesday", time: "10:00 AM - 11:00 AM", course: "CS601 (Theory)", division: "Div 6B", venue: "Hall 204" },
      { day: "Wednesday", time: "11:15 AM - 12:15 PM", course: "CS606 (Theory)", division: "Div 6A", venue: "Hall 202" },
      { day: "Thursday", time: "09:00 AM - 11:00 AM", course: "CS601 (Lab Practical)", division: "Batch A2", venue: "Lab 304" },
      { day: "Thursday", time: "02:00 PM - 04:00 PM", course: "PRJ601 (Capstone Guide)", division: "Teams T1-T5", venue: "Innovation CoE" },
      { day: "Friday", time: "10:00 AM - 11:00 AM", course: "CS605 (Theory)", division: "Div 6A", venue: "Hall 205" },
      { day: "Friday", time: "02:00 PM - 04:00 PM", course: "CS605 (Cloud Lab)", division: "Batch B2", venue: "Cloud Lab 306" }
    ];

    const researchMetrics = user.researchMetrics || match.researchMetrics || {
      totalPublications: 34,
      scopusIndexed: 24,
      sciScieIndexed: 8,
      ugcCare: 2,
      citations: 942,
      hIndex: 16,
      i10Index: 22,
      scopusAuthorId: "57201948821",
      orcidId: "0000-0002-8419-7721",
      googleScholarUrl: "https://scholar.google.com/citations?user=PUFAC8821"
    };

    const publications = user.publications || match.publications || [];
    const books = user.books || match.books || [];
    const bookChapters = user.bookChapters || match.bookChapters || [];
    const conferences = user.conferences || match.conferences || [];
    const patents = user.patents || match.patents || [];
    const awards = user.awards || match.awards || [];
    const memberships = user.memberships || match.memberships || [];
    const consultancyProjects = user.consultancyProjects || match.consultancyProjects || [];

    return `
      <!-- TOP FACULTY PROFILE HERO BANNER -->
      <div class="faculty-profile-hero">
        <div class="faculty-avatar-container">
          ${photoUrl ? `
            <img src="${photoUrl}" alt="${fullName}" class="faculty-avatar-img" id="faculty-profile-avatar-img">
          ` : `
            <div class="faculty-avatar-fallback" id="faculty-profile-avatar-fallback">${avatarText}</div>
          `}
          <button class="faculty-avatar-upload-btn" title="Upload / Change Profile Photo" onclick="FacultyPortal.openPhotoUploadModal()">
            📷
          </button>
        </div>

        <div class="faculty-hero-details">
          <div class="faculty-hero-name">
            ${fullName}
            <span class="badge badge-success" style="font-size: 11px;">Verified Faculty Profile</span>
            <span class="badge badge-gold" style="font-size: 11px;">Senior Proctor</span>
          </div>
          <div class="faculty-hero-designation">
            ${user.designation || 'Associate Professor & Senior Proctor'} &bull; Department of ${user.department || 'Computer Science & Engineering'}
          </div>
          <div class="faculty-hero-meta-tags">
            <span class="faculty-meta-tag"><strong>Institute ID:</strong> ${instituteId}</span>
            <span class="faculty-meta-tag"><strong>Faculty ID:</strong> ${facultyId}</span>
            <span class="faculty-meta-tag"><strong>Date of Joining:</strong> ${dateOfJoining}</span>
            <span class="faculty-meta-tag"><strong>Experience:</strong> 18.2 Years</span>
            <span class="faculty-meta-tag"><strong>Workload:</strong> 18 Hrs/Wk</span>
          </div>
        </div>

        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          <button class="btn btn-primary btn-sm" onclick="FacultyPortal.openPhotoUploadModal()">
            📸 Upload Photo
          </button>
          <button class="btn btn-secondary btn-sm" onclick="FacultyPortal.openEditProfileModal()">
            ✏️ Edit Personal Details
          </button>
          <button class="btn btn-secondary btn-sm" onclick="FacultyPortal.openChangePasswordModal()">
            🔐 Change Password
          </button>
        </div>
      </div>

      <!-- 2-COLUMN GRID: ACCESS CREDENTIALS & PERSONAL DETAILS -->
      <div class="profile-bio-grid">

        <!-- CARD 1: REQUIRED ACCESS CREDENTIALS -->
        <div class="card">
          <div class="card-header">
            <div>
              <h3 class="card-title">🔐 Required Access Credentials</h3>
              <p class="page-subtitle">Institute registry identifiers and secure staff login credentials</p>
            </div>
            <span class="badge badge-primary">Institutional Access</span>
          </div>

          <!-- Institute URL & Identification Code -->
          <div class="profile-field-row">
            <span class="profile-field-label">🌐 Institute URL</span>
            <span class="profile-field-value">
              <a href="${instituteUrl}" target="_blank" rel="noopener noreferrer" style="color: var(--pu-maroon-primary); font-weight: 700; text-decoration: underline; display: flex; align-items: center; gap: 4px;">
                ${instituteUrl} ↗
              </a>
            </span>
          </div>

          <div class="profile-field-row">
            <span class="profile-field-label">💻 SMIS Portal Address</span>
            <span class="profile-field-value">
              <code style="font-size: 12px; font-weight: 700;">${institutePortalUrl}</code>
            </span>
          </div>

          <div class="profile-field-row">
            <span class="profile-field-label">🏛️ Institute Identification Code (ID)</span>
            <span class="profile-field-value">
              <span class="badge badge-gold" style="font-size: 12px; font-family: monospace;">${instituteId}</span>
            </span>
          </div>

          <div class="profile-field-row">
            <span class="profile-field-label">🏫 Constituent Institute</span>
            <span class="profile-field-value" style="font-size: 12px; max-width: 250px;">
              ${instituteName}
            </span>
          </div>

          <!-- Faculty ID & Password -->
          <div class="profile-field-row">
            <span class="profile-field-label">🪪 Unique Faculty Staff ID</span>
            <span class="profile-field-value">
              <code style="font-size: 14px; font-weight: 800; color: var(--pu-maroon-primary);">${facultyId}</code>
            </span>
          </div>

          <div class="profile-field-row" style="align-items: flex-start; padding: 12px 0;">
            <span class="profile-field-label" style="padding-top: 6px;">
              🔑 Faculty Password
            </span>
            <div style="flex: 1; display: flex; flex-direction: column; align-items: flex-end; gap: 6px;">
              <div class="credential-secret-box" style="width: 100%; max-width: 260px;">
                <span class="credential-secret-val" id="faculty-secret-pwd-val">•••••••••••</span>
                <button type="button" class="btn btn-secondary btn-xs" onclick="FacultyPortal.togglePasswordVisibility()" id="btn-toggle-pwd" title="Toggle Show/Hide Password" style="padding: 2px 8px; font-size: 11px;">
                  👁️ Show
                </button>
                <button type="button" class="btn btn-secondary btn-xs" onclick="FacultyPortal.copyPassword()" title="Copy Initial Password" style="padding: 2px 8px; font-size: 11px;">
                  📋
                </button>
              </div>
              <span style="font-size: 11px; color: var(--text-muted); text-align: right;">
                Auto-generated by <strong>${passwordGeneratedBy}</strong> for initial login (${passwordGeneratedDate}).
              </span>
            </div>
          </div>

          <div class="profile-field-row">
            <span class="profile-field-label">🛡️ Two-Factor Authentication</span>
            <span class="profile-field-value">
              <span class="status-badge-editable">✓ ${user.twoFactorAuth || 'Enabled (PU Authenticator & SMS OTP)'}</span>
            </span>
          </div>

          <div class="profile-field-row">
            <span class="profile-field-label">⏱️ Recent Biometric / Login Punch</span>
            <span class="profile-field-value" style="font-size: 11.5px;">
              ${user.lastLogin || 'Today, 08:51:24 AM IST (Campus LAN 172.16.14.88)'}
            </span>
          </div>

          <div style="margin-top: 16px; padding-top: 14px; border-top: 1px solid var(--border-subtle); display: flex; gap: 10px; flex-wrap: wrap;">
            <button class="btn btn-primary btn-sm" onclick="FacultyPortal.openChangePasswordModal()" style="flex: 1;">
              🔑 Change Master Password
            </button>
            <button class="btn btn-secondary btn-sm" onclick="FacultyPortal.openModal('credentials-dossier')" style="flex: 1;">
              📋 View Security Dossier
            </button>
          </div>
        </div>

        <!-- CARD 2: PERSONAL & BASIC INFORMATION -->
        <div class="card">
          <div class="card-header">
            <div>
              <h3 class="card-title">👤 Personal & Basic Information</h3>
              <p class="page-subtitle">Full name, parentage, date of joining, contact, and address data</p>
            </div>
            <button class="btn btn-secondary btn-xs" onclick="FacultyPortal.openEditProfileModal()">
              ✏️ Edit
            </button>
          </div>

          <div class="profile-field-row">
            <span class="profile-field-label">👨‍🏫 Full Legal Name</span>
            <span class="profile-field-value">
              <strong>${fullName}</strong>
            </span>
          </div>

          <div class="profile-field-row">
            <span class="profile-field-label">👴 Father's Full Name</span>
            <span class="profile-field-value">
              ${fatherName}
            </span>
          </div>

          <div class="profile-field-row">
            <span class="profile-field-label">👵 Mother's Full Name</span>
            <span class="profile-field-value">
              ${motherName}
            </span>
          </div>

          <div class="profile-field-row">
            <span class="profile-field-label">📅 Date of Joining (PU)</span>
            <span class="profile-field-value">
              <span class="badge badge-gold">${dateOfJoining}</span>
              <span style="font-size: 11px; color: var(--text-muted);">(9 Yrs, 2 Mos)</span>
            </span>
          </div>

          <div class="profile-field-row">
            <span class="profile-field-label">🎂 Date of Birth & Age</span>
            <span class="profile-field-value">
              ${dob} <span style="font-size: 11.5px; color: var(--text-muted);">(44 Yrs)</span>
            </span>
          </div>

          <div class="profile-field-row">
            <span class="profile-field-label">🚻 Gender & Blood Group</span>
            <span class="profile-field-value">
              ${gender} &bull; <strong style="color: #DC2626;">${bloodGroup}</strong>
            </span>
          </div>

          <div class="profile-field-row">
            <span class="profile-field-label">💍 Marital Status</span>
            <span class="profile-field-value">
              <span class="badge badge-info">${maritalStatus}</span>
            </span>
          </div>

          <div class="profile-field-row">
            <span class="profile-field-label">📞 Mobile & WhatsApp Phone</span>
            <span class="profile-field-value">
              <a href="tel:${phone}" style="color: var(--text-primary); font-family: monospace;">${phone}</a>
            </span>
          </div>

          <div class="profile-field-row">
            <span class="profile-field-label">✉️ Official University Email</span>
            <span class="profile-field-value">
              <a href="mailto:${officialEmail}" style="color: var(--pu-maroon-primary); font-size: 12px;">${officialEmail}</a>
            </span>
          </div>

          <div class="profile-field-row">
            <span class="profile-field-label">📧 Personal Alternate Email</span>
            <span class="profile-field-value" style="font-size: 12px;">
              ${personalEmail}
            </span>
          </div>

          <div class="profile-field-row">
            <span class="profile-field-label">☎️ Department Cabin Intercom</span>
            <span class="profile-field-value" style="font-size: 12px;">
              ${intercom}
            </span>
          </div>

          <div class="profile-field-row">
            <span class="profile-field-label">🚨 Emergency Contact</span>
            <span class="profile-field-value" style="font-size: 12px;">
              ${emergencyContact}
            </span>
          </div>

          <div class="profile-field-row" style="align-items: flex-start;">
            <span class="profile-field-label" style="padding-top: 4px;">🏡 Residential Address</span>
            <span class="profile-field-value" style="text-align: right; max-width: 260px; font-size: 12px; line-height: 1.4;">
              ${residentialAddress}
            </span>
          </div>

          <div class="profile-field-row" style="align-items: flex-start;">
            <span class="profile-field-label" style="padding-top: 4px;">📍 Permanent Home Address</span>
            <span class="profile-field-value" style="text-align: right; max-width: 260px; font-size: 12px; line-height: 1.4;">
              ${permanentAddress}
            </span>
          </div>

          <div style="margin-top: 14px; padding-top: 12px; border-top: 1px solid var(--border-subtle); display: flex; gap: 10px;">
            <button class="btn btn-primary btn-sm" onclick="FacultyPortal.openEditProfileModal()" style="flex: 1;">
              ✏️ Edit Permitted Contact & Address Details
            </button>
            <button class="btn btn-secondary btn-sm" onclick="FacultyPortal.openPhotoUploadModal()" style="flex: 1;">
              📸 Upload Photo
            </button>
          </div>
        </div>

      </div>

      <!-- CARD 3: ACADEMIC & PROFESSIONAL CREDENTIALS -->
      <div class="card" style="margin-bottom: 24px;">
        <div class="card-header">
          <div>
            <h3 class="card-title">🎓 Academic & Professional Credentials</h3>
            <p class="page-subtitle">Educational background, qualifications, teaching experience, assigned courses & workloads</p>
          </div>
          <span class="badge badge-success">AICTE & UGC Norms Compliant</span>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(360px, 1fr)); gap: 24px; margin-top: 10px;">
          
          <!-- Column 1: Educational Background & Qualifications -->
          <div>
            <h4 style="font-size: 15px; font-weight: 800; color: var(--pu-maroon-primary); margin: 0 0 14px 0; display: flex; align-items: center; gap: 8px;">
              <span>📜 Educational Background & Qualifications</span>
            </h4>
            <div style="display: flex; flex-direction: column; gap: 14px;">
              ${qualifications.map(q => `
                <div class="timeline-card-item">
                  <div class="timeline-title">${q.degree}</div>
                  <div class="timeline-subtitle">${q.institution} &bull; <strong>Year ${q.year}</strong></div>
                  <div class="timeline-desc">
                    <div><strong>Specialization:</strong> ${q.specialization}</div>
                    ${q.thesis ? `<div><strong>Doctoral Thesis:</strong> <em>"${q.thesis}"</em></div>` : ''}
                    <div><strong>Classification:</strong> <span class="badge badge-success" style="font-size: 11px;">${q.grade}</span></div>
                  </div>
                </div>
              `).join('')}
            </div>

            <!-- Professional Certifications -->
            <div style="margin-top: 18px; padding-top: 14px; border-top: 1px dashed var(--border-subtle);">
              <h5 style="font-size: 13px; font-weight: 700; color: var(--text-primary); margin: 0 0 8px 0;">
                🎖️ Post-Doctoral & Industry Certifications
              </h5>
              <div style="display: flex; flex-direction: column; gap: 6px;">
                ${certifications.map(c => `
                  <div style="font-size: 12px; color: var(--text-secondary); display: flex; align-items: center; gap: 6px;">
                    <span style="color: #10B981;">✓</span> ${c}
                  </div>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- Column 2: Teaching Experience & Career History -->
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
              <h4 style="font-size: 15px; font-weight: 800; color: var(--pu-maroon-primary); margin: 0; display: flex; align-items: center; gap: 8px;">
                <span>💼 Teaching Experience & Employment History</span>
              </h4>
              <span class="badge badge-gold" style="font-size: 11px;">Total: 18.2 Years</span>
            </div>
            <div style="display: flex; flex-direction: column; gap: 14px;">
              ${experienceHistory.map(exp => `
                <div class="timeline-card-item">
                  <div class="timeline-title">${exp.designation}</div>
                  <div class="timeline-subtitle">
                    ${exp.organization} &bull; <strong>${exp.period}</strong> (${exp.duration})
                  </div>
                  <div class="timeline-desc">${exp.responsibilities}</div>
                </div>
              `).join('')}
            </div>
          </div>

        </div>

        <!-- SECTION: WORKLOADS, ASSIGNED COURSES & TEACHING SCHEDULE -->
        <div style="margin-top: 24px; padding-top: 20px; border-top: 1px solid var(--border-subtle);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
            <div>
              <h4 style="margin: 0; font-size: 15px; font-weight: 800; color: var(--text-primary);">
                ⚖️ Weekly Teaching Workload & Assigned Courses
              </h4>
              <p style="margin: 2px 0 0 0; font-size: 12.5px; color: var(--text-muted);">
                Official academic allocation approved by Dean & Head of Department
              </p>
            </div>
            <span class="badge badge-success">AICTE Norm: 16–18 Contact Hours/Wk</span>
          </div>

          <!-- Workload Meter Bar -->
          <div class="workload-meter-box">
            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 13px;">
              <span><strong>Cumulative Teaching Workload:</strong> ${teachingWorkload.totalWeeklyHours} Contact Hours / Week</span>
              <span style="font-weight: 700; color: #059669;">${teachingWorkload.complianceStatus}</span>
            </div>
            <div class="workload-progress-bar-bg">
              <div class="workload-progress-bar-fill" style="width: 100%;"></div>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 12px; color: var(--text-muted); flex-wrap: wrap; gap: 8px;">
              ${teachingWorkload.breakdown.map(b => `
                <span><strong>${b.type}:</strong> ${b.hours} Hrs/Wk (${b.description})</span>
              `).join(' &bull; ')}
            </div>
          </div>

          <!-- Assigned Courses Table -->
          <h5 style="font-size: 13.5px; font-weight: 700; margin: 16px 0 8px 0; color: var(--text-primary);">
            📚 Assigned Courses for Current Semester (2025–26 Even)
          </h5>
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Course Code</th>
                  <th>Course Title</th>
                  <th>Credits</th>
                  <th>Type</th>
                  <th>Division / Batch</th>
                  <th>Students</th>
                  <th>Weekly Contact</th>
                  <th>Venue</th>
                </tr>
              </thead>
              <tbody>
                ${assignedCourses.map(c => `
                  <tr>
                    <td><code>${c.code}</code></td>
                    <td><strong>${c.title}</strong></td>
                    <td>${c.credits}</td>
                    <td><span class="badge badge-primary">${c.type}</span></td>
                    <td><strong>${c.division}</strong></td>
                    <td>${c.studentsCount} Students</td>
                    <td><strong>${c.contactHours}</strong></td>
                    <td>${c.venue}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <!-- Teaching Schedule Matrix -->
          <div style="display: flex; justify-content: space-between; align-items: center; margin: 20px 0 10px 0; flex-wrap: wrap;">
            <h5 style="font-size: 13.5px; font-weight: 700; margin: 0; color: var(--text-primary);">
              🗓️ Weekly Teaching Schedule & Classroom Routine
            </h5>
            <button class="btn btn-secondary btn-xs" onclick="FacultyPortal.switchTab('classrooms')">
              Full Classroom Timetable &rarr;
            </button>
          </div>
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Day</th>
                  <th>Time Slot</th>
                  <th>Course & Type</th>
                  <th>Division / Batch</th>
                  <th>Venue</th>
                </tr>
              </thead>
              <tbody>
                ${teachingSchedule.map(s => `
                  <tr>
                    <td><strong>${s.day}</strong></td>
                    <td><code>${s.time}</code></td>
                    <td><strong>${s.course}</strong></td>
                    <td><span class="badge badge-gold">${s.division}</span></td>
                    <td>${s.venue}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

        </div>

      </div>

      <!-- CARD 4: RESEARCH & PERFORMANCE METRICS -->
      <div class="card" style="margin-bottom: 24px;">
        <div class="card-header">
          <div>
            <h3 class="card-title">🔬 Research & Performance Metrics</h3>
            <p class="page-subtitle">Publications, books, chapters, conference proceedings, patents, honours, awards, memberships & consultancy</p>
          </div>
          <span class="badge badge-gold">NIRF & NAAC Research Portfolio</span>
        </div>

        <!-- Metric KPI Strip -->
        <div class="research-metrics-strip">
          <div class="research-metric-card">
            <span class="research-metric-num">${researchMetrics.totalPublications}</span>
            <span class="research-metric-lbl">Total Publications</span>
          </div>
          <div class="research-metric-card">
            <span class="research-metric-num">${researchMetrics.scopusIndexed}</span>
            <span class="research-metric-lbl">Scopus Indexed</span>
          </div>
          <div class="research-metric-card">
            <span class="research-metric-num">${researchMetrics.sciScieIndexed}</span>
            <span class="research-metric-lbl">SCI / SCIE Q1/Q2</span>
          </div>
          <div class="research-metric-card">
            <span class="research-metric-num">${researchMetrics.citations}+</span>
            <span class="research-metric-lbl">Total Citations</span>
          </div>
          <div class="research-metric-card">
            <span class="research-metric-num">${researchMetrics.hIndex}</span>
            <span class="research-metric-lbl">h-index</span>
          </div>
          <div class="research-metric-card">
            <span class="research-metric-num">${researchMetrics.i10Index}</span>
            <span class="research-metric-lbl">i10-index</span>
          </div>
          <div class="research-metric-card">
            <span class="research-metric-num">3</span>
            <span class="research-metric-lbl">Patents & IP</span>
          </div>
          <div class="research-metric-card">
            <span class="research-metric-num">₹26.7L</span>
            <span class="research-metric-lbl">Funded Projects</span>
          </div>
        </div>

        <div style="font-size: 12.5px; color: var(--text-secondary); margin-bottom: 20px; display: flex; gap: 16px; flex-wrap: wrap;">
          <span><strong>Scopus Author ID:</strong> <code>${researchMetrics.scopusAuthorId}</code></span>
          <span><strong>ORCID:</strong> <code>${researchMetrics.orcidId}</code></span>
          <span><strong>Google Scholar:</strong> <a href="${researchMetrics.googleScholarUrl}" target="_blank" rel="noopener noreferrer" style="color: var(--pu-maroon-primary); text-decoration: underline;">Verified Profile ↗</a></span>
        </div>

        <!-- 2-COLUMN SPLIT: PUBLICATIONS & BOOKS ON LEFT, PATENTS & HONOURS ON RIGHT -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(420px, 1fr)); gap: 24px;">

          <!-- LEFT COLUMN: PUBLICATIONS & BOOKS -->
          <div>
            <!-- Section A: Research Publications -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
              <h4 style="font-size: 14.5px; font-weight: 800; color: var(--pu-maroon-primary); margin: 0;">
                📑 Research Publications (Refereed Journals)
              </h4>
              <span class="badge badge-primary">28 Papers</span>
            </div>
            <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px;">
              ${publications.map(p => `
                <div class="portfolio-item-card">
                  <div class="portfolio-item-header">
                    <div class="portfolio-item-title">${p.title}</div>
                    <span class="badge badge-success" style="font-size: 10.5px;">${p.index}</span>
                  </div>
                  <div class="portfolio-item-meta">
                    <strong>${p.journal}</strong> &bull; ${p.volume} (${p.year})<br>
                    <strong>DOI:</strong> <code style="font-size: 11px;">${p.doi}</code> &bull; 
                    <strong>Citations:</strong> ${p.citations}
                  </div>
                </div>
              `).join('')}
            </div>

            <!-- Section B: Books & Chapter Contributions -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
              <h4 style="font-size: 14.5px; font-weight: 800; color: var(--pu-maroon-primary); margin: 0;">
                📚 Textbooks & Book Chapter Contributions
              </h4>
              <span class="badge badge-gold">2 Books &bull; 4 Chapters</span>
            </div>
            <div style="display: flex; flex-direction: column; gap: 12px;">
              ${books.map(b => `
                <div class="portfolio-item-card" style="border-left: 4px solid var(--pu-maroon-primary);">
                  <div class="portfolio-item-header">
                    <div class="portfolio-item-title">📖 ${b.title}</div>
                    <span class="badge badge-maroon">${b.role}</span>
                  </div>
                  <div class="portfolio-item-meta">
                    <strong>Publisher:</strong> ${b.publisher} &bull; <strong>Year:</strong> ${b.year}<br>
                    <strong>ISBN:</strong> <code>${b.isbn}</code> &bull; <strong>Pages:</strong> ${b.pages}<br>
                    <span style="font-size: 11.5px; color: var(--text-secondary);">${b.description}</span>
                  </div>
                </div>
              `).join('')}

              ${bookChapters.map(ch => `
                <div class="portfolio-item-card">
                  <div class="portfolio-item-header">
                    <div class="portfolio-item-title" style="font-size: 13px;">📑 Chapter: "${ch.chapterTitle}"</div>
                    <span class="badge badge-info" style="font-size: 10.5px;">Book Chapter</span>
                  </div>
                  <div class="portfolio-item-meta">
                    <strong>Book:</strong> ${ch.bookTitle}<br>
                    <strong>Publisher:</strong> ${ch.publisher} (${ch.year}) &bull; <strong>ISBN:</strong> <code>${ch.isbn}</code> &bull; ${ch.pages}
                  </div>
                </div>
              `).join('')}
            </div>

            <!-- Section C: Conference Proceedings -->
            <div style="margin-top: 24px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <h4 style="font-size: 14.5px; font-weight: 800; color: var(--pu-maroon-primary); margin: 0;">
                  🎙️ Conference Proceedings (IEEE / ACM)
                </h4>
                <span class="badge badge-primary">14 Proceedings</span>
              </div>
              <div style="display: flex; flex-direction: column; gap: 10px;">
                ${conferences.map(c => `
                  <div class="portfolio-item-card">
                    <div class="portfolio-item-title" style="font-size: 13px; margin-bottom: 4px;">${c.title}</div>
                    <div class="portfolio-item-meta">
                      <strong>Conference:</strong> ${c.conference}<br>
                      <strong>Venue:</strong> ${c.location} &bull; <strong>Year:</strong> ${c.year} &bull; ${c.pages}
                      ${c.doi ? `&bull; <code>${c.doi}</code>` : ''}
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

          </div>

          <!-- RIGHT COLUMN: PATENTS, AWARDS, MEMBERSHIPS & CONSULTANCY -->
          <div>
            <!-- Section D: Patents & Intellectual Property -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
              <h4 style="font-size: 14.5px; font-weight: 800; color: var(--pu-maroon-primary); margin: 0;">
                💡 Patents & Intellectual Property (IP)
              </h4>
              <span class="badge badge-gold">3 Official Patents</span>
            </div>
            <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px;">
              ${patents.map(pat => `
                <div class="portfolio-item-card" style="border-left: 4px solid #D97706;">
                  <div class="portfolio-item-header">
                    <div class="portfolio-item-title">⚖️ ${pat.title}</div>
                    <span class="badge ${pat.statusBadge || 'badge-success'}">${pat.status}</span>
                  </div>
                  <div class="portfolio-item-meta">
                    <strong>Patent Application No:</strong> <code style="font-size: 12px; font-weight: 700;">${pat.patentNo}</code><br>
                    <strong>Filing Office:</strong> ${pat.office} &bull; <strong>Filed:</strong> ${pat.filingDate} ${pat.grantDate ? `&bull; <strong>Granted:</strong> ${pat.grantDate}` : ''}<br>
                    <strong>Inventors:</strong> ${pat.inventors}<br>
                    <div style="font-size: 11.5px; color: var(--text-secondary); margin-top: 4px; line-height: 1.4;">
                      <em>"${pat.abstract}"</em>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>

            <!-- Section E: Honours & Awards -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
              <h4 style="font-size: 14.5px; font-weight: 800; color: var(--pu-maroon-primary); margin: 0;">
                🏆 Honours, Distinctions & Awards
              </h4>
              <span class="badge badge-gold">4 Honours</span>
            </div>
            <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px;">
              ${awards.map(aw => `
                <div class="portfolio-item-card">
                  <div class="portfolio-item-header">
                    <div class="portfolio-item-title">🥇 ${aw.title}</div>
                    <span class="badge badge-gold">${aw.year}</span>
                  </div>
                  <div class="portfolio-item-meta">
                    <strong>Awarding Authority:</strong> ${aw.authority}<br>
                    <span style="font-size: 12px; color: var(--text-secondary);">${aw.citation}</span>
                  </div>
                </div>
              `).join('')}
            </div>

            <!-- Section F: Professional Memberships -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
              <h4 style="font-size: 14.5px; font-weight: 800; color: var(--pu-maroon-primary); margin: 0;">
                🎖️ Professional Society Memberships
              </h4>
              <span class="badge badge-primary">4 Societies</span>
            </div>
            <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 24px;">
              ${memberships.map(m => `
                <div class="portfolio-item-card">
                  <div class="portfolio-item-header">
                    <div class="portfolio-item-title" style="font-size: 13.5px;">${m.organization}</div>
                    <span class="badge ${m.badge || 'badge-primary'}">${m.membershipGrade}</span>
                  </div>
                  <div class="portfolio-item-meta">
                    <strong>Membership ID:</strong> <code>${m.membershipId}</code> &bull; 
                    <strong>Status:</strong> ${m.status} (Valid: ${m.validThru})
                  </div>
                </div>
              `).join('')}
            </div>

            <!-- Section G: Consultancy & Funded Projects -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
              <h4 style="font-size: 14.5px; font-weight: 800; color: var(--pu-maroon-primary); margin: 0;">
                💼 Sponsored Research & Consultancy Projects
              </h4>
              <span class="badge badge-success">₹26.70 Lakhs Outlay</span>
            </div>
            <div style="display: flex; flex-direction: column; gap: 12px;">
              ${consultancyProjects.map(cp => `
                <div class="portfolio-item-card" style="border-left: 4px solid #10B981;">
                  <div class="portfolio-item-header">
                    <div class="portfolio-item-title">🔬 ${cp.projectTitle}</div>
                    <span class="badge ${cp.statusBadge || 'badge-success'}">${cp.status}</span>
                  </div>
                  <div class="portfolio-item-meta">
                    <strong>Funding Agency:</strong> ${cp.fundingAgency}<br>
                    <strong>Sanction Order:</strong> <code>${cp.sanctionOrder}</code> &bull; 
                    <strong>Grant Amount:</strong> <strong style="color: #059669;">${cp.grantAmount}</strong><br>
                    <strong>Role:</strong> ${cp.role} &bull; <strong>Duration:</strong> ${cp.duration}<br>
                    <div style="font-size: 11.5px; color: var(--text-secondary); margin-top: 4px;">
                      <strong>Project Outcome:</strong> ${cp.outcome}
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>

          </div>

        </div>

      </div>
    `;
  }

  /**
   * Toggles masked password to plain text and back
   */
  function togglePasswordVisibility() {
    const pwdEl = document.getElementById('faculty-secret-pwd-val');
    const btnEl = document.getElementById('btn-toggle-pwd');
    if (!pwdEl || !btnEl) return;
    const user = AuthEngine.getCurrentUser() || (PU_DATA.faculties && PU_DATA.faculties[0]) || {};
    const match = (PU_DATA.faculties && PU_DATA.faculties.find(f => (user.id && f.id === user.id) || (user.employeeId && f.employeeId === user.employeeId))) || user;
    const initialPwd = user.initialPassword || match.initialPassword || "Faculty@123";

    if (pwdEl.innerText.includes('•')) {
      pwdEl.innerText = initialPwd;
      btnEl.innerHTML = "👁️‍🗨️ Hide";
    } else {
      pwdEl.innerText = "•••••••••••";
      btnEl.innerHTML = "👁️ Show";
    }
  }

  /**
   * Copies initial faculty password to clipboard
   */
  function copyPassword() {
    const user = AuthEngine.getCurrentUser() || (PU_DATA.faculties && PU_DATA.faculties[0]) || {};
    const match = (PU_DATA.faculties && PU_DATA.faculties.find(f => (user.id && f.id === user.id) || (user.employeeId && f.employeeId === user.employeeId))) || user;
    const initialPwd = user.initialPassword || match.initialPassword || "Faculty@123";

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(initialPwd).then(() => {
        if (window.RealtimeEngine && RealtimeEngine.showToast) {
          RealtimeEngine.showToast({
            title: "Password Copied",
            message: "Initial faculty password copied to clipboard.",
            type: "info"
          });
        } else {
          alert("Initial faculty password copied to clipboard!");
        }
      });
    } else {
      alert(`Initial faculty password: ${initialPwd}`);
    }
  }

  function openEditProfileModal() {
    openModal('edit-profile');
  }

  function saveProfileUpdates(event) {
    if (event) event.preventDefault();
    const user = AuthEngine.getCurrentUser() || (PU_DATA.faculties && PU_DATA.faculties[0]) || {};
    if (!user || !user.employeeId) return;

    const phone = document.getElementById('faculty-edit-phone')?.value;
    const personalEmail = document.getElementById('faculty-edit-personal-email')?.value;
    const intercom = document.getElementById('faculty-edit-intercom')?.value;
    const maritalStatus = document.getElementById('faculty-edit-marital-status')?.value;
    const emergency = document.getElementById('faculty-edit-emergency')?.value;
    const resAddress = document.getElementById('faculty-edit-res-address')?.value;
    const permAddress = document.getElementById('faculty-edit-perm-address')?.value;

    if (phone) user.phone = phone;
    if (personalEmail) user.personalEmail = personalEmail;
    if (intercom) user.intercom = intercom;
    if (maritalStatus) user.maritalStatus = maritalStatus;
    if (emergency) user.emergencyContact = emergency;
    if (resAddress) user.residentialAddress = resAddress;
    if (permAddress) user.permanentAddress = permAddress;

    const match = PU_DATA.faculties && PU_DATA.faculties.find(f => f.id === user.id || f.employeeId === user.employeeId);
    if (match) {
      Object.assign(match, {
        phone: user.phone,
        personalEmail: user.personalEmail,
        intercom: user.intercom,
        maritalStatus: user.maritalStatus,
        emergencyContact: user.emergencyContact,
        residentialAddress: user.residentialAddress,
        permanentAddress: user.permanentAddress
      });
    }

    localStorage.setItem('PU_ERP_USER', JSON.stringify(user));
    closeModal();

    if (typeof RealtimeEngine !== 'undefined' && RealtimeEngine.showToast) {
      RealtimeEngine.showToast({
        title: "Profile Synchronized",
        message: "Personal details and contact information updated successfully.",
        type: "success"
      });
      RealtimeEngine.logAuditEvent({
        actor: user.name,
        role: "FACULTY",
        action: "FACULTY_PROFILE_UPDATED",
        resource: `Faculty ID #${user.employeeId}`,
        status: "SUCCESS"
      });
    }

    const container = document.getElementById('portal-view-container');
    if (container) {
      render(container);
      switchTab('profile');
    }
  }

  function openPhotoUploadModal() {
    openModal('upload-photo');
  }

  function handlePhotoFileSelect(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("File size exceeds 2 MB limit. Please select an image under 2 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
      const dataUrl = e.target.result;
      const previewImg = document.getElementById('modal-photo-preview');
      const previewFallback = document.getElementById('modal-photo-fallback');
      if (previewImg) {
        previewImg.src = dataUrl;
      } else if (previewFallback && previewFallback.parentElement) {
        previewFallback.parentElement.innerHTML = `<img src="${dataUrl}" id="modal-photo-preview" style="width: 100%; height: 100%; object-fit: cover;">`;
      }
      const urlInput = document.getElementById('faculty-photo-url-input');
      if (urlInput) urlInput.value = dataUrl;
    };
    reader.readAsDataURL(file);
  }

  function savePhotoFromInput() {
    const urlInput = document.getElementById('faculty-photo-url-input');
    const newPhotoUrl = urlInput ? urlInput.value.trim() : "";
    savePhotoUpload(newPhotoUrl);
  }

  function savePhotoUpload(newPhotoUrl) {
    const user = AuthEngine.getCurrentUser() || (PU_DATA.faculties && PU_DATA.faculties[0]) || {};
    if (!user || !user.employeeId) return;

    user.photoUrl = newPhotoUrl;
    const match = PU_DATA.faculties && PU_DATA.faculties.find(f => f.id === user.id || f.employeeId === user.employeeId);
    if (match) {
      match.photoUrl = newPhotoUrl;
    }

    localStorage.setItem('PU_ERP_USER', JSON.stringify(user));
    closeModal();

    if (typeof RealtimeEngine !== 'undefined' && RealtimeEngine.showToast) {
      RealtimeEngine.showToast({
        title: "Photograph Updated",
        message: "Your profile photograph has been synchronized with the University Staff Information System.",
        type: "success"
      });
      RealtimeEngine.logAuditEvent({
        actor: user.name,
        role: "FACULTY",
        action: "PROFILE_PHOTO_UPDATED",
        resource: `Faculty ID #${user.employeeId}`,
        status: "SUCCESS"
      });
    }

    const container = document.getElementById('portal-view-container');
    if (container) {
      render(container);
      switchTab('profile');
    }
  }

  function openChangePasswordModal() {
    openModal('change-password');
  }

  function savePasswordChange(event) {
    if (event) event.preventDefault();
    const user = AuthEngine.getCurrentUser() || (PU_DATA.faculties && PU_DATA.faculties[0]) || {};
    if (!user || !user.employeeId) return;

    const currentPwd = document.getElementById('fac-current-password')?.value;
    const newPwd = document.getElementById('fac-new-password')?.value;
    const confirmPwd = document.getElementById('fac-confirm-password')?.value;

    const match = (PU_DATA.faculties && PU_DATA.faculties.find(f => (user.id && f.id === user.id) || (user.employeeId && f.employeeId === user.employeeId))) || user;
    const validCurrent = [match.password, match.altPassword, match.initialPassword, 'password123', 'Faculty@123'];

    if (!validCurrent.includes(currentPwd)) {
      alert("Current password does not match University Registry records.");
      return;
    }

    if (newPwd !== confirmPwd) {
      alert("New Password and Confirm New Password do not match.");
      return;
    }

    if (newPwd.length < 6) {
      alert("New password must be at least 6 characters in length.");
      return;
    }

    match.password = newPwd;
    match.altPassword = newPwd;
    user.password = newPwd;
    user.altPassword = newPwd;
    localStorage.setItem('PU_ERP_USER', JSON.stringify(user));

    closeModal();

    if (typeof RealtimeEngine !== 'undefined' && RealtimeEngine.showToast) {
      RealtimeEngine.showToast({
        title: "Master Password Updated",
        message: "Your new credentials are now active across Parul University SMIS portals.",
        type: "success"
      });
      RealtimeEngine.logAuditEvent({
        actor: user.name,
        role: "FACULTY",
        action: "PASSWORD_CHANGED",
        resource: `Staff ID #${user.employeeId}`,
        status: "SUCCESS"
      });
    }
  }

  /**
   * Switch between subtabs (strictly scoped to .faculty-portal)
   */
  function switchTab(tabId) {
    const portalEl = document.querySelector('.faculty-portal') || document;
    portalEl.querySelectorAll('.portal-subtabs .subtab-btn').forEach(btn => btn.classList.remove('active'));
    portalEl.querySelectorAll('.subtab-content').forEach(c => c.classList.remove('active'));

    const activeBtn = event ? event.currentTarget : portalEl.querySelector(`.subtab-btn[onclick*="${tabId}"]`);
    if (activeBtn) activeBtn.classList.add('active');

    const targetContent = document.getElementById(`faculty-tab-${tabId}`);
    if (targetContent) targetContent.classList.add('active');
  }

  return {
    render,
    switchTab,
    toggleStudentStatus,
    markAll,
    handleCourseChange,
    handleSectionChange,
    saveAndBroadcastAttendance,
    handleOutpassDecision,
    saveMarksEvaluation,
    openModal,
    closeModal,
    changeDivisionTimetable,
    simulateQRScan,
    bookCampusResource,
    submitGrievance,
    togglePassenger,
    savePassengerAttendance,
    handleGuideFilterChange,
    saveProjectRemark,
    submitDashboardLeave,
    filterDashboardStudents,
    renderFacultyProfileTab,
    togglePasswordVisibility,
    copyPassword,
    openEditProfileModal,
    saveProfileUpdates,
    openPhotoUploadModal,
    savePhotoUpload,
    handlePhotoFileSelect,
    savePhotoFromInput,
    openChangePasswordModal,
    savePasswordChange
  };
})();
