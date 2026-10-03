/**
 * PARUL UNIVERSITY ERP - STUDENT PORTAL MODULE
 * Handles:
 * 1. Self Dashboard with embedded widgets (Today's Timetable, Attendance, Calendar, Exams, Mess Pass, Bus Pass, Outpass, Feedback, Grievances)
 * 2. Attendance Tracker with Subject Percentages and 75% Compliance Badges
 * 3. Time Table & 365-Day Academic Calendar (Daily routine & university milestones)
 * 4. Results & Official Statement of Grades (PDF Marksheet Generator & Hall Ticket)
 * 5. Fee Ledger, Receipts & Payment Status
 * 6. Hostel Leave / Gatepass Application with QR Verification & Digital Mess Pass
 * 7. Course Teaching Evaluation Feedback & Grievance Helpdesk
 *
 * NOTE: Strictly isolated to .student-portal and student-* namespaces to prevent
 * any collision with the faculty or admin portals.
 */

const StudentPortal = (function() {
  
  /**
   * Main render function for the Student Portal
   */
  function render(container) {
    const user = AuthEngine.getCurrentUser();
    if (!user) return;

    const statsMap = user.attendanceStats || PU_DATA.attendanceStats || {};
    let totalHeld = 0;
    let totalAttended = 0;
    Object.values(statsMap).forEach(s => {
      totalHeld += (s.held || 0);
      totalAttended += (s.attended || 0);
    });
    const overallPct = calculateAttendancePercentage(totalAttended, totalHeld) || 88.5;

    // Student Institute & Program Meta
    const instituteName = user.institute || "Faculty of Engineering & Technology (FET)";
    const programName = user.program || "B.Tech Computer Science & Engineering";
    const divisionTag = user.division || `CSE-${user.semester || 6}${user.section || 'A'}`;
    const rollDisplay = user.rollNo || "CSE-21-001";
    const batchDisplay = user.batch || "1";
    const phoneDisplay = user.phone || "+91 98251 12345";

    const userGrades = user.grades || PU_DATA.grades || { summary: { sgpa: 9.45, cgpa: 9.20 } };
    const transport = PU_DATA.studentTransport || { routeNo: "14", busNumber: "GJ-06-PU-5542", pickupStop: "Waghodia Cross Road" };
    const messPass = PU_DATA.studentMessPass || { diningHall: "Tagore Bhavan Central Dining Hall", status: "ACTIVE MEAL ACCESS" };

    container.innerHTML = `
      <div class="student-portal">
        <!-- Student Profile Hero Banner -->
        <div class="portal-hero-banner">
          <div class="portal-hero-info">
            <div style="font-size: 13px; font-weight: 800; color: #FCD34D; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 4px;">
              ${instituteName}
            </div>
            <h2>Welcome, ${user.name} 🎓</h2>
            <p style="color: #E2E8F0; font-size: 13.5px; margin-bottom: 8px;">
              <strong>${phoneDisplay}</strong> &bull; <code>${user.email}</code>
            </p>
            <div class="portal-hero-meta">
              <span><strong>Branch:</strong> ${programName}</span>
              <span><strong>Sem:</strong> ${user.semester || 5}</span>
              <span><strong>Division:</strong> ${divisionTag}</span>
              <span><strong>Roll No:</strong> ${rollDisplay}</span>
              <span><strong>Batch:</strong> ${batchDisplay}</span>
              <span><strong>Academic Year:</strong> 2026 - 2027</span>
            </div>
          </div>
          <div class="portal-hero-badges">
            <span class="badge ${overallPct >= 75 ? 'badge-success' : 'badge-danger'}" style="font-size: 13px; padding: 6px 14px;">
              ${overallPct >= 75 ? '✓ Exam Eligible (Attendance ≥ 75%)' : '⚠️ Shortage Warning (< 75%)'}
            </span>
            <span class="badge badge-gold" style="font-size: 12px;">CGPA: ${userGrades.summary.cgpa} / 10.0</span>
            <span class="badge badge-info" style="font-size: 11px;">Mess & Bus Pass Active</span>
          </div>
        </div>

        <!-- Navigation Subtabs -->
        <div class="portal-subtabs">
          <button class="subtab-btn active" onclick="StudentPortal.switchTab('dashboard')">
            📊 Self Dashboard
          </button>
          <button class="subtab-btn" onclick="StudentPortal.switchTab('profile')">
            👤 Profile & Documents
          </button>
          <button class="subtab-btn" onclick="StudentPortal.switchTab('attendance')">
            📅 Attendance Tracker (${overallPct}%)
          </button>
          <button class="subtab-btn" onclick="StudentPortal.switchTab('timetable')">
            🗓️ Time Table & Calendar
          </button>
          <button class="subtab-btn" onclick="StudentPortal.switchTab('reportcard')">
            📜 Results & Exam Schedule
          </button>
          <button class="subtab-btn" onclick="StudentPortal.switchTab('fees')">
            💳 Fee Ledger & Receipts
          </button>
          <button class="subtab-btn" onclick="StudentPortal.switchTab('outpass')">
            🎫 Gate Pass & Mess Pass
          </button>
          <button class="subtab-btn" onclick="StudentPortal.switchTab('feedback')">
            📝 Feedback & Helpdesk
          </button>
        </div>

        <!-- ===================================================================
             TAB 1: SELF DASHBOARD (12 MODULES EMBEDDED DIRECTLY)
             =================================================================== -->
        <div id="student-tab-dashboard" class="subtab-content active">

          <!-- Top KPI Stats Grid -->
          <div class="stats-grid">
            <div class="stat-card green">
              <div class="stat-icon">📊</div>
              <div class="stat-content">
                <span class="stat-value">${overallPct}%</span>
                <span class="stat-label">Overall Attendance (${totalAttended}/${totalHeld} Classes)</span>
              </div>
            </div>

            <div class="stat-card gold">
              <div class="stat-icon">🌟</div>
              <div class="stat-content">
                <span class="stat-value">${userGrades.summary.sgpa} SGPA</span>
                <span class="stat-label">Academic Standing (CGPA: ${userGrades.summary.cgpa})</span>
              </div>
            </div>

            <div class="stat-card blue">
              <div class="stat-icon">🍽️</div>
              <div class="stat-content">
                <span class="stat-value">Mess Pass Active</span>
                <span class="stat-label">${messPass.diningHall.split('(')[0]}</span>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-icon">🚌</div>
              <div class="stat-content">
                <span class="stat-value">Route 14</span>
                <span class="stat-label">Bus: ${transport.busNumber} &bull; Waghodia</span>
              </div>
            </div>
          </div>

          <!-- Student Profile, Bio-Data & Documents Quick Link Card -->
          <div class="card" style="margin-bottom: 24px; border: 1.5px solid rgba(217, 119, 6, 0.3); background: linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(254, 243, 199, 0.3));">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
              <div style="display: flex; align-items: center; gap: 14px;">
                <div style="width: 48px; height: 48px; border-radius: 12px; background: linear-gradient(135deg, var(--pu-maroon-primary), #B91C1C); color: white; display: flex; align-items: center; justify-content: center; font-size: 24px; box-shadow: 0 4px 12px rgba(128, 0, 32, 0.2);">
                  👤
                </div>
                <div>
                  <h3 style="margin: 0; font-size: 16px; font-weight: 800; color: var(--text-primary);">
                    Student Profile, Guardianship & Supporting Documents
                  </h3>
                  <p style="margin: 3px 0 0 0; font-size: 13px; color: var(--text-secondary);">
                    <strong>ID:</strong> ${user.enrollmentNo || '210303105001'} &bull; <strong>DOB:</strong> ${user.dob || '14 Aug 2003'} &bull; <strong>Guardian:</strong> ${user.guardianName || 'Mr. Sureshchandra Mehta'} &bull; <strong>Status:</strong> Enrolled (${user.admissionYear || '2021'}) &bull; <strong>Supporting Docs:</strong> 5 Verified on file
                  </p>
                </div>
              </div>
              <div style="display: flex; gap: 10px;">
                <button class="btn btn-primary btn-sm" onclick="StudentPortal.switchTab('profile')">
                  Open Bio-Data & Documents →
                </button>
                <button class="btn btn-secondary btn-sm" onclick="StudentPortal.openEditProfileModal()">
                  ✏️ Edit Contact Info
                </button>
              </div>
            </div>
          </div>

          <!-- Section 1: Today's Class Routine & Subject Attendance Progress -->
          <div class="student-dashboard-row">
            <!-- Today's Classes -->
            <div class="card">
              <div class="card-header">
                <div>
                  <h3 class="card-title">🗓️ Today's Lecture Schedule (Tuesday)</h3>
                  <p class="page-subtitle">${instituteName} &bull; Division ${divisionTag}</p>
                </div>
                <span class="badge badge-primary">Active Class: 10:00 - 11:00 AM</span>
              </div>

              <div class="table-responsive">
                <table class="data-table">
                  <thead>
                    <tr>
                      <th>Time Slot</th>
                      <th>Course & Title</th>
                      <th>Venue</th>
                      <th>Instructor</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style="background: rgba(128, 0, 32, 0.05); font-weight: 700;">
                      <td><code>10:00 - 11:00 AM</code></td>
                      <td><strong>CS601</strong>: Advanced Operating Systems</td>
                      <td>Room 204</td>
                      <td>Dr. Rajesh Sharma</td>
                      <td><span class="badge badge-success">⚡ Live Lecture</span></td>
                    </tr>
                    <tr>
                      <td><code>11:15 - 12:15 PM</code></td>
                      <td><strong>CS604</strong>: Full Stack Web Engineering</td>
                      <td>Room 204</td>
                      <td>Prof. Sneha Kulkarni</td>
                      <td><span class="badge badge-info">Next Slot</span></td>
                    </tr>
                    <tr>
                      <td><code>12:30 - 02:00 PM</code></td>
                      <td>Campus Dining Lunch Recess</td>
                      <td>Tagore Mess</td>
                      <td>Dining Hall</td>
                      <td><span class="badge badge-secondary">Recess</span></td>
                    </tr>
                    <tr>
                      <td><code>02:00 - 04:00 PM</code></td>
                      <td><strong>CS606</strong>: Artificial Intelligence Lab</td>
                      <td>Lab 304</td>
                      <td>Dr. Vikramaditya Joshi</td>
                      <td><span class="badge badge-gold">Lab Practical</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div class="faculty-quick-actions-bar">
                <button class="btn btn-secondary btn-sm" onclick="StudentPortal.switchTab('timetable')">
                  🗓️ Full Weekly Timetable &rarr;
                </button>
                <button class="btn btn-secondary btn-sm" onclick="StudentPortal.switchTab('attendance')">
                  📊 Attendance Tracker &rarr;
                </button>
              </div>
            </div>

            <!-- Subject-Wise Attendance Overview -->
            <div class="card">
              <div class="card-header">
                <div>
                  <h3 class="card-title">📅 Subject Attendance Compliance</h3>
                  <p class="page-subtitle">Required minimum 75% attendance for examination clearance</p>
                </div>
                <span class="badge badge-success">All Clear</span>
              </div>

              <div style="display: flex; flex-direction: column; gap: 12px;">
                ${renderDashboardAttendanceMini(user)}
              </div>

              <div style="margin-top: 14px; display: flex; justify-content: space-between; align-items: center; font-size: 12px; color: var(--text-muted);">
                <span>Automated biometric sync from faculty consoles active.</span>
                <button class="btn btn-secondary btn-sm" onclick="StudentPortal.switchTab('attendance')">
                  Detailed Report &rarr;
                </button>
              </div>
            </div>
          </div>

          <!-- Section 2: 365-Day Academic Calendar & Examination Schedule -->
          <div class="student-dashboard-row">
            <!-- Academic Calendar Widget -->
            <div class="card">
              <div class="card-header">
                <div>
                  <h3 class="card-title">📅 365-Day Academic Calendar (2026-2027)</h3>
                  <p class="page-subtitle">Official university terms, exams, symposiums, and recess dates</p>
                </div>
                <button class="btn btn-secondary btn-sm" onclick="StudentPortal.switchTab('timetable')">
                  Full Calendar &rarr;
                </button>
              </div>

              <div style="display: flex; flex-direction: column; gap: 10px;">
                ${(PU_DATA.academicCalendar || []).slice(0, 4).map(ev => `
                  <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; background: var(--bg-subtle); border-radius: var(--radius-md); border-left: 3px solid var(--pu-maroon-primary);">
                    <div>
                      <div style="font-weight: 700; font-size: 13px; color: var(--text-primary);">${ev.title}</div>
                      <div style="font-size: 11.5px; color: var(--text-muted);">${ev.month} 2026 &bull; ${ev.category}</div>
                    </div>
                    <span class="badge ${ev.badge}" style="font-size: 10.5px;">${ev.date}</span>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Examination Schedule & Digital Hall Ticket -->
            <div class="card">
              <div class="card-header">
                <div>
                  <h3 class="card-title">📝 Examination Schedule & Digital Hall Ticket</h3>
                  <p class="page-subtitle">End-Semester Examinations &bull; Seating Hall Allocation</p>
                </div>
                <button class="btn btn-primary btn-sm" onclick="StudentPortal.openStudentModal('exam-hallticket')">
                  🖨️ Hall Ticket
                </button>
              </div>

              <div class="table-responsive">
                <table class="data-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Course Code & Title</th>
                      <th>Exam Hall</th>
                      <th>Slot</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>Dec 18, 2026</strong></td>
                      <td><strong>CS601</strong>: Advanced Operating Systems</td>
                      <td>Block B, Room 204</td>
                      <td><span class="badge badge-info">10:00 - 01:00</span></td>
                    </tr>
                    <tr>
                      <td><strong>Dec 21, 2026</strong></td>
                      <td><strong>CS602</strong>: Cloud Computing Architecture</td>
                      <td>Block B, Room 204</td>
                      <td><span class="badge badge-info">10:00 - 01:00</span></td>
                    </tr>
                    <tr>
                      <td><strong>Dec 24, 2026</strong></td>
                      <td><strong>CS603</strong>: Machine Learning & Pattern Recog.</td>
                      <td>Block B, Room 205</td>
                      <td><span class="badge badge-info">10:00 - 01:00</span></td>
                    </tr>
                    <tr>
                      <td><strong>Dec 28, 2026</strong></td>
                      <td><strong>CS604</strong>: Full Stack Web Engineering</td>
                      <td>Block B, Room 205</td>
                      <td><span class="badge badge-gold">02:00 - 05:00</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- Section 3: Digital Campus Mess Pass & University Transport Bus Pass -->
          <div class="student-dashboard-row">
            <!-- Digital Mess Pass Card -->
            <div class="card" style="border-top: 4px solid #0284C7;">
              <div class="card-header">
                <div>
                  <h3 class="card-title">🍽️ Digital Campus Mess & Dining Meal Pass</h3>
                  <p class="page-subtitle">${messPass.diningHall}</p>
                </div>
                <span class="badge badge-success">Meal Pass Active</span>
              </div>

              <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 14px; align-items: center; margin-bottom: 14px;">
                <div style="font-size: 13px; line-height: 1.8;">
                  <div><strong>Student:</strong> ${user.name} (<code>${user.enrollmentNo}</code>)</div>
                  <div><strong>Hostel & Room:</strong> ${user.hostel || 'Sarojini Bhavan, Room 418'}</div>
                  <div><strong>Dietary Category:</strong> <span class="badge badge-success">Vegetarian / Jain</span></div>
                  <div><strong>Today's Lunch Menu:</strong> Butter Roti, Dal Tadka, Paneer Butter Masala, Jeera Rice, Chaas</div>
                </div>

                <div style="text-align: center; border: 2px dashed #0284C7; padding: 12px; border-radius: var(--radius-md); background: rgba(2, 132, 199, 0.04);">
                  <div style="font-size: 28px;">🥗</div>
                  <code style="font-size: 10px; font-weight: 700;">${messPass.passId}</code>
                  <div style="font-size: 10px; color: #0284C7; font-weight: 700; margin-top: 2px;">SCAN AT MESS COUNTER</div>
                </div>
              </div>

              <div class="faculty-quick-actions-bar">
                <button class="btn btn-secondary btn-sm" onclick="StudentPortal.openStudentModal('mess-pass')">
                  🔍 View All Meal Timings & Menus
                </button>
              </div>
            </div>

            <!-- University Transport Bus Pass Card -->
            <div class="card" style="border-top: 4px solid #D97706;">
              <div class="card-header">
                <div>
                  <h3 class="card-title">🚌 University Transport & Bus Pass (Route 14)</h3>
                  <p class="page-subtitle">Vadodara Central Station ⇄ PU Limda Campus</p>
                </div>
                <span class="badge badge-gold">Transit Verified</span>
              </div>

              <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 14px; align-items: center; margin-bottom: 14px;">
                <div style="font-size: 13px; line-height: 1.8;">
                  <div><strong>Bus Number:</strong> <strong>${transport.busNumber}</strong> (Route ${transport.routeNo})</div>
                  <div><strong>Boarding Stop:</strong> ${transport.pickupStop}</div>
                  <div><strong>Morning Pickup:</strong> <strong>${transport.morningPickup}</strong> &bull; <strong>Evening Return:</strong> <strong>${transport.eveningReturn}</strong></div>
                  <div><strong>Assigned Driver:</strong> ${transport.driverName} (<a href="tel:${transport.driverContact}" style="color: var(--pu-maroon-primary);">${transport.driverContact}</a>)</div>
                </div>

                <div style="text-align: center; border: 2px dashed #D97706; padding: 12px; border-radius: var(--radius-md); background: rgba(217, 119, 6, 0.04);">
                  <div style="font-size: 28px;">🪪</div>
                  <code style="font-size: 10px; font-weight: 700;">${transport.passNo}</code>
                  <div style="font-size: 10px; color: #D97706; font-weight: 700; margin-top: 2px;">RFID RFID VERIFIED</div>
                </div>
              </div>

              <div class="faculty-quick-actions-bar">
                <button class="btn btn-secondary btn-sm" onclick="StudentPortal.openStudentModal('transport')">
                  🚌 View Full Transit Schedule
                </button>
              </div>
            </div>
          </div>

          <!-- Section 4: Hostel Gatepass Desk & Student Grievance Helpdesk -->
          <div class="student-dashboard-row">
            <!-- Outpass & Gate Pass Desk -->
            <div class="card">
              <div class="card-header">
                <div>
                  <h3 class="card-title">🎫 Digital Hostel Leave & Gatepass</h3>
                  <p class="page-subtitle">Proctor Authorization & QR Verification</p>
                </div>
                <button class="btn btn-primary btn-sm" onclick="StudentPortal.switchTab('outpass')">
                  + Apply Gatepass
                </button>
              </div>

              <div id="dash-gatepass-preview">
                ${renderDashboardOutpassPreview()}
              </div>
            </div>

            <!-- Student Grievances Helpdesk -->
            <div class="card">
              <div class="card-header">
                <div>
                  <h3 class="card-title">📝 Grievance Registration & Helpdesk</h3>
                  <p class="page-subtitle">Submit and track institutional tickets (Wi-Fi, Hostel, Academic)</p>
                </div>
                <button class="btn btn-secondary btn-sm" onclick="StudentPortal.openStudentModal('grievance')">
                  + Lodge Grievance
                </button>
              </div>

              <div style="display: flex; flex-direction: column; gap: 10px;">
                ${(PU_DATA.studentGrievances || []).map(g => `
                  <div style="padding: 10px 14px; background: var(--bg-subtle); border-radius: var(--radius-md); border-left: 3px solid ${g.status === 'RESOLVED' ? '#10B981' : '#F59E0B'};">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                      <div style="font-weight: 700; font-size: 13px; color: var(--text-primary);">${g.subject}</div>
                      <span class="badge ${g.status === 'RESOLVED' ? 'badge-success' : 'badge-gold'}" style="font-size: 10px;">${g.status}</span>
                    </div>
                    <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">
                      Ticket #${g.id} &bull; ${g.category} &bull; ${g.date}
                    </div>
                    <div style="font-size: 12px; color: var(--text-secondary); margin-top: 4px;">
                      ${g.resolution}
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- Section 5: Course Teaching Feedback & University Notifications -->
          <div class="student-dashboard-row">
            <!-- Teaching Evaluation Feedback -->
            <div class="card">
              <div class="card-header">
                <div>
                  <h3 class="card-title">⭐ Course Teaching Evaluation & Feedback</h3>
                  <p class="page-subtitle">Submit anonymous feedback for academic quality enhancement</p>
                </div>
                <span class="badge badge-info">Semester 5 Feedback</span>
              </div>

              <div style="display: flex; flex-direction: column; gap: 10px;">
                ${(PU_DATA.studentFeedback || []).map(fb => `
                  <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; background: var(--bg-subtle); border-radius: var(--radius-md);">
                    <div>
                      <div style="font-weight: 700; font-size: 13px; color: var(--text-primary);">${fb.code}: ${fb.title}</div>
                      <div style="font-size: 11.5px; color: var(--text-muted);">Instructor: ${fb.faculty}</div>
                    </div>
                    <div>
                      ${fb.completed ? `
                        <span class="badge badge-success">✓ Feedback Submitted (${'★'.repeat(fb.rating)})</span>
                      ` : `
                        <button class="btn btn-secondary btn-sm" onclick="StudentPortal.openStudentModal('feedback', '${fb.code}')">
                          ⭐ Rate Course
                        </button>
                      `}
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- University Announcements -->
            <div class="card">
              <div class="card-header">
                <div>
                  <h3 class="card-title">📢 University Notifications & Circulars</h3>
                  <p class="page-subtitle">Office of the Registrar & Student Welfare</p>
                </div>
                <span class="badge badge-gold">Live Feed</span>
              </div>

              <div style="display: flex; flex-direction: column; gap: 10px;">
                <div style="padding: 12px; background: var(--bg-subtle); border-radius: var(--radius-md); border-left: 3px solid var(--pu-maroon-primary);">
                  <div style="font-weight: 700; font-size: 13.5px; color: var(--text-primary);">PU TechFest Dhoom 2026 Registration Open</div>
                  <div style="font-size: 12px; color: var(--text-secondary); margin-top: 4px;">Grand annual technical symposium at Vadodara Central Campus. Cash prizes over ₹15 Lakhs.</div>
                  <div style="font-size: 11px; color: var(--text-muted); margin-top: 6px;">Dean Student Welfare &bull; 2 hours ago</div>
                </div>
                <div style="padding: 12px; background: var(--bg-subtle); border-radius: var(--radius-md); border-left: 3px solid #10B981;">
                  <div style="font-weight: 700; font-size: 13.5px; color: var(--text-primary);">Mandatory 75% Attendance Compliance Notice</div>
                  <div style="font-size: 12px; color: var(--text-secondary); margin-top: 4px;">Students with subject attendance below 75% will require Proctor Clearance for End-Sem Admit Cards.</div>
                  <div style="font-size: 11px; color: var(--text-muted); margin-top: 6px;">Academic Council Circular #2026/89</div>
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- ===================================================================
             TAB: STUDENT PROFILE, BIO-DATA & DOCUMENTS (MANAGED VIA SYSTEM SETTINGS)
             =================================================================== -->
        <div id="student-tab-profile" class="subtab-content">
          ${renderStudentProfileTab(user)}
        </div>

        <!-- ===================================================================
             TAB 2: ATTENDANCE TRACKER
             =================================================================== -->
        <div id="student-tab-attendance" class="subtab-content">
          <div class="card" style="margin-bottom: 24px;">
            <div class="card-header">
              <div>
                <h3 class="card-title">Subject-Wise Attendance Breakdown</h3>
                <p class="page-subtitle">Official computation per Academic Council formula: (Attended / Held) × 100</p>
              </div>
              <div style="display: flex; gap: 10px; align-items: center;">
                <span class="badge badge-success">≥ 75% Eligible</span>
                <span class="badge badge-danger">&lt; 75% Shortage</span>
              </div>
            </div>

            <div class="attendance-grid" id="student-attendance-cards-grid">
              ${renderAttendanceCards(user)}
            </div>
          </div>
        </div>

        <!-- ===================================================================
             TAB 3: TIME TABLE & ACADEMIC CALENDAR
             =================================================================== -->
        <div id="student-tab-timetable" class="subtab-content">
          <div class="card" style="margin-bottom: 24px;">
            <div class="card-header">
              <div>
                <h3 class="card-title">🗓️ Weekly Student Timetable (${divisionTag})</h3>
                <p class="page-subtitle">${instituteName} &bull; Batch 1</p>
              </div>
              <span class="badge badge-primary">Semester ${user.semester || 5} Schedule</span>
            </div>
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
                  ${(PU_DATA.studentTimetable || PU_DATA.studentBcaTimetable || []).map(row => `
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
          </div>

          <!-- Academic Calendar Full Table -->
          <div class="card">
            <div class="card-header">
              <div>
                <h3 class="card-title">📅 365-Day Academic Calendar (Full Year)</h3>
                <p class="page-subtitle">Important dates, examination schedules, holidays, and semester breaks</p>
              </div>
              <span class="badge badge-gold">Academic Year 2026-2027</span>
            </div>
            <div class="table-responsive">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Month</th>
                    <th>Event / Activity Title</th>
                    <th>Category</th>
                    <th>Classification</th>
                  </tr>
                </thead>
                <tbody>
                  ${(PU_DATA.academicCalendar || []).map(ev => `
                    <tr>
                      <td><code>${ev.date}</code></td>
                      <td><strong>${ev.month}</strong></td>
                      <td>${ev.title}</td>
                      <td>${ev.category}</td>
                      <td><span class="badge ${ev.badge}">${ev.category}</span></td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- ===================================================================
             TAB 4: RESULTS & EXAM SCHEDULE
             =================================================================== -->
        <div id="student-tab-reportcard" class="subtab-content">
          <div class="card" style="margin-bottom: 24px;">
            <div class="card-header">
              <div>
                <h3 class="card-title">Official Grade Card & Marksheet (${programName})</h3>
                <p class="page-subtitle">Digitally verified grade transcript issued by Controller of Examinations</p>
              </div>
              <div style="display: flex; gap: 12px;">
                <button class="btn btn-primary" onclick="StudentPortal.generateGradeCardPDF()">
                  🖨️ Download / Print Official Grade Card (PDF)
                </button>
              </div>
            </div>

            <div class="table-responsive">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Course Code</th>
                    <th>Course Title</th>
                    <th style="text-align: center;">Credits</th>
                    <th style="text-align: center;">Internal (40)</th>
                    <th style="text-align: center;">Mid-Sem (20)</th>
                    <th style="text-align: center;">End-Sem (40)</th>
                    <th style="text-align: center;">Total (100)</th>
                    <th style="text-align: center;">Letter Grade</th>
                    <th style="text-align: center;">Grade Point</th>
                  </tr>
                </thead>
                <tbody>
                  ${userGrades.items.map(item => `
                    <tr>
                      <td><code>${item.code}</code></td>
                      <td><strong>${item.title}</strong></td>
                      <td style="text-align: center;">${item.credits}</td>
                      <td style="text-align: center;">${item.internal}</td>
                      <td style="text-align: center;">${item.midSem}</td>
                      <td style="text-align: center;">${item.endSem}</td>
                      <td style="text-align: center; font-weight: 700;">${item.total}</td>
                      <td style="text-align: center;"><span class="badge badge-gold">${item.grade}</span></td>
                      <td style="text-align: center; font-weight: 700; color: var(--pu-maroon-primary);">${item.gradePoint}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>

            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-top: 24px; padding: 20px; background: var(--bg-subtle); border-radius: var(--radius-md); text-align: center;">
              <div>
                <div style="font-size: 11px; color: var(--text-muted); text-transform: uppercase;">Total Credits Earned</div>
                <div style="font-size: 20px; font-weight: 800; color: var(--text-primary); margin-top: 4px;">20 / 20</div>
              </div>
              <div>
                <div style="font-size: 11px; color: var(--text-muted); text-transform: uppercase;">Semester SGPA</div>
                <div style="font-size: 20px; font-weight: 800; color: var(--pu-maroon-primary); margin-top: 4px;">${userGrades.summary.sgpa}</div>
              </div>
              <div>
                <div style="font-size: 11px; color: var(--text-muted); text-transform: uppercase;">Cumulative CGPA</div>
                <div style="font-size: 20px; font-weight: 800; color: #D97706; margin-top: 4px;">${userGrades.summary.cgpa}</div>
              </div>
              <div>
                <div style="font-size: 11px; color: var(--text-muted); text-transform: uppercase;">Classification</div>
                <div style="font-size: 13px; font-weight: 800; color: var(--color-success); margin-top: 6px;">FIRST CLASS WITH DISTINCTION</div>
              </div>
            </div>
          </div>
        </div>

        <!-- ===================================================================
             TAB 5: FEE LEDGER & RECEIPTS
             =================================================================== -->
        <div id="student-tab-fees" class="subtab-content">
          <div class="card" style="margin-bottom: 24px;">
            <div class="card-header">
              <div>
                <h3 class="card-title">💳 University Fee Ledger & Tax Receipts</h3>
                <p class="page-subtitle">Academic Year 2026-2027 Fee Clearance Certificate</p>
              </div>
              <span class="badge badge-success">✓ NO DUES (PAID IN FULL)</span>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
              <div style="display: flex; flex-direction: column; gap: 14px;">
                <div style="display: flex; justify-content: space-between; font-size: 14px;">
                  <span>Academic Tuition Fee:</span>
                  <strong>₹ 1,45,000</strong>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 14px;">
                  <span>University Examination & Assessment Fee:</span>
                  <strong>₹ 5,000</strong>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 14px;">
                  <span>Hostel Accommodation & Central Dining:</span>
                  <strong>₹ 78,000</strong>
                </div>
                <div style="border-top: 2px dashed var(--border-subtle); padding-top: 12px; display: flex; justify-content: space-between; font-size: 16px; font-weight: 800;">
                  <span>Total Amount Paid:</span>
                  <span style="color: var(--color-success);">₹ 2,28,000</span>
                </div>
                <div style="margin-top: 10px;">
                  <button class="btn btn-primary" style="width: 100%;" onclick="StudentPortal.downloadFeeReceipt()">
                    📄 Download Official Fee Receipt (${PU_DATA.fees.receiptNo})
                  </button>
                </div>
              </div>

              <div style="background: var(--bg-subtle); padding: 18px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); font-size: 13px; line-height: 1.8;">
                <div><strong>Receipt Serial:</strong> <code>${PU_DATA.fees.receiptNo}</code></div>
                <div><strong>Transaction ID:</strong> <code>${PU_DATA.fees.transactionId}</code></div>
                <div><strong>Payment Date:</strong> 15th July 2026</div>
                <div><strong>Payment Mode:</strong> Net Banking (HDFC Corporate Gateway)</div>
                <div><strong>Verified Status:</strong> <span class="badge badge-success">✓ Clearance Dispatched to Registrar</span></div>
              </div>
            </div>
          </div>
        </div>

        <!-- ===================================================================
             TAB 6: GATE PASS & MESS PASS
             =================================================================== -->
        <div id="student-tab-outpass" class="subtab-content">
          <div style="display: grid; grid-template-columns: 1fr 1.2fr; gap: 24px; margin-bottom: 24px;">
            <!-- Mess Pass Card -->
            <div class="card" style="border-top: 4px solid #0284C7;">
              <div class="card-header">
                <div>
                  <h3 class="card-title">🍽️ Dining Hall Meal Pass</h3>
                  <p class="page-subtitle">${messPass.diningHall}</p>
                </div>
                <span class="badge badge-success">Active</span>
              </div>
              <div style="font-size: 13px; line-height: 1.8; margin-bottom: 14px;">
                <div><strong>Meal Slots:</strong></div>
                <div>&bull; Breakfast: 07:30 AM - 09:00 AM</div>
                <div>&bull; Lunch: 12:30 PM - 02:00 PM</div>
                <div>&bull; Evening Tea: 05:00 PM - 06:00 PM</div>
                <div>&bull; Dinner: 07:30 PM - 09:30 PM</div>
                <div style="margin-top: 8px;"><strong>Dietary Preference:</strong> Vegetarian / Jain Meal Access</div>
              </div>
              <button class="btn btn-secondary btn-sm" onclick="StudentPortal.openStudentModal('mess-pass')">
                View Full Meal Schedule &rarr;
              </button>
            </div>

            <!-- Outpass Apply Form -->
            <div class="card">
              <div class="card-header">
                <div>
                  <h3 class="card-title">🎫 Apply for Digital Gatepass / Outpass</h3>
                  <p class="page-subtitle">Proctor approval flow with live gatekeeper sync</p>
                </div>
                <span class="badge badge-info">Approval Queue</span>
              </div>
              <form id="outpass-apply-form" onsubmit="StudentPortal.handleOutpassSubmit(event)">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
                  <div class="form-group">
                    <label class="form-label">Out Date & Time</label>
                    <input type="datetime-local" id="outpass-out-time" class="form-control" required value="2026-10-02T17:00">
                  </div>
                  <div class="form-group">
                    <label class="form-label">Expected Return Time</label>
                    <input type="datetime-local" id="outpass-in-time" class="form-control" required value="2026-10-02T21:30">
                  </div>
                </div>
                <div class="form-group">
                  <label class="form-label">Destination & City</label>
                  <input type="text" id="outpass-dest" class="form-control" placeholder="e.g. Alkapuri, Vadodara" required value="Alkapuri, Vadodara">
                </div>
                <div class="form-group">
                  <label class="form-label">Reason for Leaving Campus</label>
                  <textarea id="outpass-reason" class="form-control" rows="2" placeholder="Brief reason for warden & proctor..." required>Family dinner and medical consultation</textarea>
                </div>
                <div class="form-group">
                  <label class="form-label">Parent / Guardian Contact Number</label>
                  <input type="tel" id="outpass-phone" class="form-control" placeholder="+91 98250 XXXXX" required value="+91 94260 99887">
                </div>
                <button type="submit" class="btn btn-primary" style="width: 100%;">
                  🚀 Submit Outpass for Faculty Approval
                </button>
              </form>
            </div>
          </div>

          <!-- Active Gatepasses -->
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Active Gatepasses & Requests</h3>
              <span class="badge badge-maroon">Real-Time Sync</span>
            </div>
            <div id="student-outpass-list-container">
              ${renderOutpassList()}
            </div>
          </div>
        </div>

        <!-- ===================================================================
             TAB 7: FEEDBACK & HELPDESK
             =================================================================== -->
        <div id="student-tab-feedback" class="subtab-content">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
            <!-- Feedback -->
            <div class="card">
              <div class="card-header">
                <div>
                  <h3 class="card-title">⭐ Faculty Teaching Evaluation</h3>
                  <p class="page-subtitle">Submit anonymous feedback for academic enhancement</p>
                </div>
                <span class="badge badge-primary">Course Survey</span>
              </div>
              <div style="display: flex; flex-direction: column; gap: 12px;">
                ${(PU_DATA.studentFeedback || []).map(fb => `
                  <div style="padding: 14px; background: var(--bg-subtle); border-radius: var(--radius-md);">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px;">
                      <div>
                        <strong>${fb.code}: ${fb.title}</strong>
                        <div style="font-size: 12px; color: var(--text-muted);">Instructor: ${fb.faculty}</div>
                      </div>
                      ${fb.completed ? `<span class="badge badge-success">✓ Completed (${'★'.repeat(fb.rating)})</span>` : `<span class="badge badge-gold">Pending</span>`}
                    </div>
                    ${fb.completed ? `
                      <div style="font-size: 12px; color: var(--text-secondary); font-style: italic; margin-top: 4px;">"${fb.remark}"</div>
                    ` : `
                      <button class="btn btn-primary btn-sm" style="margin-top: 8px;" onclick="StudentPortal.openStudentModal('feedback', '${fb.code}')">
                        Rate Course & Faculty
                      </button>
                    `}
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Grievance Registration -->
            <div class="card">
              <div class="card-header">
                <div>
                  <h3 class="card-title">📝 Student Grievance Helpdesk</h3>
                  <p class="page-subtitle">Lodge official ticket with campus administration</p>
                </div>
                <button class="btn btn-primary btn-sm" onclick="StudentPortal.openStudentModal('grievance')">
                  + Lodge New Ticket
                </button>
              </div>

              <div style="display: flex; flex-direction: column; gap: 10px;">
                ${(PU_DATA.studentGrievances || []).map(g => `
                  <div style="padding: 12px; background: var(--bg-subtle); border-radius: var(--radius-md); border-left: 3px solid ${g.status === 'RESOLVED' ? '#10B981' : '#F59E0B'};">
                    <div style="display: flex; justify-content: space-between;">
                      <strong>${g.subject}</strong>
                      <span class="badge ${g.status === 'RESOLVED' ? 'badge-success' : 'badge-gold'}">${g.status}</span>
                    </div>
                    <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">Ticket #${g.id} &bull; ${g.category} &bull; ${g.date}</div>
                    <div style="font-size: 12px; color: var(--text-secondary); margin-top: 6px;">${g.resolution}</div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>

        <!-- ===================================================================
             DEDICATED MODAL OVERLAY FOR STUDENT SERVICES
             =================================================================== -->
        <div class="student-modal-overlay" id="student-service-modal-overlay">
          <div class="student-modal-box">
            <div class="student-modal-header">
              <div class="student-modal-title" id="student-modal-title">
                Service Dialog
              </div>
              <button class="btn-icon" onclick="StudentPortal.closeStudentModal()">&times;</button>
            </div>
            <div class="student-modal-body" id="student-modal-body">
              <!-- Rendered dynamically -->
            </div>
          </div>
        </div>

      </div>
    `;
  }

  /**
   * Renders Student Profile, Bio-Data, Documents, and Management Tab
   */
  function renderStudentProfileTab(user) {
    const match = (PU_DATA.students && PU_DATA.students.find(s => s.id === user.id)) || user;
    const fullName = user.name || match.name || "Aarav Mehta";
    const dob = user.dob || match.dob || "2003-08-14";
    const gender = user.gender || match.gender || "Male";
    const bloodGroup = user.bloodGroup || match.bloodGroup || "O+ Positive";
    const nationality = user.nationality || match.nationality || "Indian";
    const homeAddress = user.homeAddress || match.homeAddress || "Plot 42, Sunrise Greens, Gotri Road, Vadodara, Gujarat - 390021";

    const studentPhone = user.phone || match.phone || "+91 98251 12345";
    const parentPhone = user.parentPhone || match.parentPhone || "+91 98251 67890";
    const studentEmail = user.email || match.email || "aarav.mehta@paruluniversity.ac.in";
    const parentEmail = user.parentEmail || match.parentEmail || "suresh.mehta@gmail.com";

    const fatherName = user.fatherName || match.fatherName || "Mr. Sureshchandra Mehta";
    const motherName = user.motherName || match.motherName || "Mrs. Geetaben Mehta";
    const guardianName = user.guardianName || match.guardianName || "Mr. Sureshchandra Mehta";
    const guardianRelation = user.guardianRelation || match.guardianRelation || "Father";
    const guardianOccupation = user.guardianOccupation || match.guardianOccupation || "Senior Executive Engineer, GSECL";
    const emergencyContactName = user.emergencyContactName || match.emergencyContactName || "Mr. Sureshchandra Mehta (Father)";
    const emergencyPhone = user.emergencyPhone || match.emergencyPhone || "+91 98251 67890";
    const emergencyAddress = user.emergencyAddress || match.emergencyAddress || "Plot 42, Sunrise Greens, Gotri Road, Vadodara, Gujarat - 390021";

    const enrollmentNo = user.enrollmentNo || match.enrollmentNo || "210303105001";
    const rollNo = user.rollNo || match.rollNo || "CSE-21-001";
    const admissionYear = user.admissionYear || match.admissionYear || "2021";
    const admissionCategory = user.admissionCategory || match.admissionCategory || "ACPC State Merit Quota (General)";
    const currentClass = user.currentClass || match.currentClass || "B.Tech Computer Science & Engineering (Semester 6)";
    const divisionTag = user.division || match.division || `CSE-${user.semester || 6}${user.section || 'A'}`;
    const section = user.section || match.section || "6A";
    const batch = user.batch || match.batch || "1 (Group A)";
    const enrollmentStatus = user.enrollmentStatus || match.enrollmentStatus || "Active Regular Enrolled";
    const institute = user.institute || match.institute || "Faculty of Engineering & Technology (FET)";

    // Default supporting documents fallback
    const docs = (user.documents && user.documents.length) ? user.documents : (match.documents && match.documents.length ? match.documents : [
      {
        id: "DOC-PU-01",
        title: "Higher Secondary (12th Grade) Official Marksheet",
        type: "Previous Transcript",
        fileName: "12th_HSC_Board_Transcript_Aarav.pdf",
        fileSize: "2.4 MB",
        uploadDate: "2021-07-15",
        uploadedBy: "Admin / Admissions Office",
        status: "Verified & Approved",
        statusBadge: "badge-success",
        icon: "📑"
      },
      {
        id: "DOC-PU-02",
        title: "Secondary School Certificate (10th Board)",
        type: "Previous Transcript",
        fileName: "10th_SSC_Board_Certificate.pdf",
        fileSize: "1.8 MB",
        uploadDate: "2021-07-15",
        uploadedBy: "Admin / Admissions Office",
        status: "Verified & Approved",
        statusBadge: "badge-success",
        icon: "📜"
      },
      {
        id: "DOC-PU-03",
        title: "Municipal Birth Certificate",
        type: "Birth Certificate",
        fileName: "Birth_Certificate_Govt_Gujarat.pdf",
        fileSize: "1.1 MB",
        uploadDate: "2021-07-16",
        uploadedBy: "Student Uploaded",
        status: "Verified & Approved",
        statusBadge: "badge-success",
        icon: "🪪"
      },
      {
        id: "DOC-PU-04",
        title: "Institutional School Leaving & Transfer Certificate (TC)",
        type: "Transfer Certificate",
        fileName: "School_Transfer_Certificate_TC.pdf",
        fileSize: "1.5 MB",
        uploadDate: "2021-07-18",
        uploadedBy: "Student Uploaded",
        status: "Verified & Approved",
        statusBadge: "badge-success",
        icon: "🎓"
      },
      {
        id: "DOC-PU-05",
        title: "Semester 5 Statement of Grades & Marksheet",
        type: "Previous Transcript",
        fileName: "PU_BTech_CSE_Sem5_Marksheet.pdf",
        fileSize: "3.1 MB",
        uploadDate: "2026-01-20",
        uploadedBy: "Admin / Examination Cell",
        status: "Verified & Approved",
        statusBadge: "badge-success",
        icon: "📊"
      }
    ]);

    const statsMap = user.attendanceStats || PU_DATA.attendanceStats || {};
    let totalHeld = 0, totalAttended = 0;
    Object.values(statsMap).forEach(s => {
      totalHeld += (s.held || 0);
      totalAttended += (s.attended || 0);
    });
    const overallPct = calculateAttendancePercentage(totalAttended, totalHeld) || 88.5;
    const userGrades = user.grades || PU_DATA.grades || { summary: { sgpa: 9.50, cgpa: 9.18 } };

    return `
      <!-- Superadmin Governance Policy Alert Banner -->
      <div class="card" style="margin-bottom: 24px; background: linear-gradient(135deg, rgba(128, 0, 32, 0.06) 0%, rgba(217, 119, 6, 0.08) 100%); border-left: 5px solid var(--pu-maroon-primary);">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; flex-wrap: wrap;">
          <div style="flex: 1; min-width: 300px;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
              <span style="font-size: 22px;">🛡️</span>
              <h3 style="margin: 0; font-size: 16px; font-weight: 800; color: var(--pu-maroon-primary);">
                Superadmin Governance & Institutional System Settings
              </h3>
              <span class="badge badge-warning" style="font-size: 10.5px;">RBAC Policy Active</span>
            </div>
            <p style="margin: 0 0 10px 0; font-size: 13px; color: var(--text-secondary); line-height: 1.5;">
              Edits to profile fields are strictly managed by the <strong>Superadmin via System Settings</strong> to regulate which details students or parents can alter. Core enrollment, identity, and academic records are locked under regulatory compliance to ensure institutional audit integrity.
            </p>
            <div style="display: flex; gap: 16px; flex-wrap: wrap; font-size: 12px;">
              <span class="status-badge-locked">🔒 Locked by Superadmin: Academic & Identity Fields</span>
              <span class="status-badge-editable">✏️ Permitted by Settings: Contact & Address Updates</span>
            </div>
          </div>
          <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            <button class="btn btn-primary btn-sm" onclick="StudentPortal.openEditProfileModal()">
              ✏️ Edit Permitted Details
            </button>
            <button class="btn btn-secondary btn-sm" onclick="StudentPortal.openStudentModal('request-correction')">
              📑 Request Locked Field Correction
            </button>
          </div>
        </div>
      </div>

      <!-- 2x2 Bio-Data and Credentials Grid -->
      <div class="profile-bio-grid">

        <!-- CARD 1: PERSONAL DETAILS -->
        <div class="card">
          <div class="card-header">
            <div>
              <h3 class="card-title">👤 Personal Details</h3>
              <p class="page-subtitle">Candidate Identity & Bio-Data Registry</p>
            </div>
            <span class="badge badge-info" style="font-size: 10.5px;">Institutional Bio-Data</span>
          </div>

          <div class="profile-field-row">
            <span class="profile-field-label">Full Name</span>
            <span class="profile-field-value">
              ${fullName}
              <span class="status-badge-locked">🔒 Locked</span>
            </span>
          </div>
          <div class="profile-field-row">
            <span class="profile-field-label">Date of Birth</span>
            <span class="profile-field-value">
              ${dob} (Age 22)
              <span class="status-badge-locked">🔒 Locked</span>
            </span>
          </div>
          <div class="profile-field-row">
            <span class="profile-field-label">Gender</span>
            <span class="profile-field-value">
              ${gender}
              <span class="status-badge-locked">🔒 Locked</span>
            </span>
          </div>
          <div class="profile-field-row">
            <span class="profile-field-label">Blood Group</span>
            <span class="profile-field-value">
              ${bloodGroup}
              <span class="status-badge-editable">✏️ Editable</span>
            </span>
          </div>
          <div class="profile-field-row">
            <span class="profile-field-label">Nationality</span>
            <span class="profile-field-value">
              ${nationality}
              <span class="status-badge-locked">🔒 Locked</span>
            </span>
          </div>
          <div class="profile-field-row" style="align-items: flex-start;">
            <span class="profile-field-label" style="padding-top: 2px;">Home Address</span>
            <span class="profile-field-value" style="text-align: right; max-width: 280px; line-height: 1.4;">
              ${homeAddress}
              <span class="status-badge-editable">✏️ Editable</span>
            </span>
          </div>
        </div>

        <!-- CARD 2: CONTACT INFORMATION & GUARDIANSHIP DATA -->
        <div class="card">
          <div class="card-header">
            <div>
              <h3 class="card-title">📞 Contact & 👨‍👩‍👦 Guardianship Data</h3>
              <p class="page-subtitle">Parent Details & Emergency Notification Matrix</p>
            </div>
            <span class="badge badge-gold" style="font-size: 10.5px;">Family Roster</span>
          </div>

          <div class="profile-field-row">
            <span class="profile-field-label">Student Phone</span>
            <span class="profile-field-value">
              ${studentPhone}
              <span class="status-badge-editable">✏️ Editable</span>
            </span>
          </div>
          <div class="profile-field-row">
            <span class="profile-field-label">Parent / Guardian Phone</span>
            <span class="profile-field-value">
              ${parentPhone}
              <span class="status-badge-editable">✏️ Editable</span>
            </span>
          </div>
          <div class="profile-field-row">
            <span class="profile-field-label">Student Email</span>
            <span class="profile-field-value">
              <code>${studentEmail}</code>
              <span class="status-badge-locked">🔒 Institutional</span>
            </span>
          </div>
          <div class="profile-field-row">
            <span class="profile-field-label">Parent Email</span>
            <span class="profile-field-value">
              <code>${parentEmail}</code>
              <span class="status-badge-editable">✏️ Editable</span>
            </span>
          </div>
          <div class="profile-field-row">
            <span class="profile-field-label">Father's Name</span>
            <span class="profile-field-value">
              ${fatherName}
              <span class="status-badge-locked">🔒 Verified</span>
            </span>
          </div>
          <div class="profile-field-row">
            <span class="profile-field-label">Mother's Name</span>
            <span class="profile-field-value">
              ${motherName}
              <span class="status-badge-locked">🔒 Verified</span>
            </span>
          </div>
          <div class="profile-field-row">
            <span class="profile-field-label">Emergency Contact</span>
            <span class="profile-field-value">
              ${emergencyContactName}
              <span class="status-badge-editable">✏️ Editable</span>
            </span>
          </div>
          <div class="profile-field-row">
            <span class="profile-field-label">Emergency Phone</span>
            <span class="profile-field-value">
              <strong style="color: #DC2626;">${emergencyPhone}</strong>
              <span class="status-badge-editable">✏️ Editable</span>
            </span>
          </div>
        </div>

        <!-- CARD 3: ENROLLMENT DATA -->
        <div class="card">
          <div class="card-header">
            <div>
              <h3 class="card-title">🎓 Institutional Enrollment Data</h3>
              <p class="page-subtitle">Academic Council Master Registration</p>
            </div>
            <span class="badge badge-success" style="font-size: 10.5px;">Council Verified</span>
          </div>

          <div class="profile-field-row">
            <span class="profile-field-label">Student ID (Enrollment No)</span>
            <span class="profile-field-value">
              <strong style="font-family: var(--font-mono); color: var(--pu-maroon-primary); font-size: 14px;">${enrollmentNo}</strong>
              <span class="badge badge-gold" style="font-size: 9.5px;">Master ID</span>
            </span>
          </div>
          <div class="profile-field-row">
            <span class="profile-field-label">Admission Year</span>
            <span class="profile-field-value">
              ${admissionYear} (Batch 2021-2025/26)
              <span class="status-badge-locked">🔒 Locked</span>
            </span>
          </div>
          <div class="profile-field-row">
            <span class="profile-field-label">Class & Degree Program</span>
            <span class="profile-field-value">
              ${currentClass}
              <span class="status-badge-locked">🔒 Locked</span>
            </span>
          </div>
          <div class="profile-field-row">
            <span class="profile-field-label">Section & Division</span>
            <span class="profile-field-value">
              ${divisionTag} (Section ${section}, Batch ${batch})
              <span class="status-badge-locked">🔒 Locked</span>
            </span>
          </div>
          <div class="profile-field-row">
            <span class="profile-field-label">Roll Number</span>
            <span class="profile-field-value">
              <code>${rollNo}</code>
              <span class="status-badge-locked">🔒 Locked</span>
            </span>
          </div>
          <div class="profile-field-row">
            <span class="profile-field-label">Admission Category</span>
            <span class="profile-field-value">${admissionCategory}</span>
          </div>
          <div class="profile-field-row">
            <span class="profile-field-label">Affiliated Faculty</span>
            <span class="profile-field-value" style="font-size: 12px;">${institute}</span>
          </div>
          <div class="profile-field-row">
            <span class="profile-field-label">Academic Status</span>
            <span class="profile-field-value">
              <span class="badge badge-success">${enrollmentStatus}</span>
            </span>
          </div>
        </div>

        <!-- CARD 4: PORTAL FEATURES, CREDENTIALS & MANAGEMENT -->
        <div class="card">
          <div class="card-header">
            <div>
              <h3 class="card-title">🔐 Portal Features & Management</h3>
              <p class="page-subtitle">Assigned Role-Based Credentials & Permissions</p>
            </div>
            <span class="badge badge-primary" style="font-size: 10.5px;">RBAC Security</span>
          </div>

          <div class="profile-field-row">
            <span class="profile-field-label">Assigned Username</span>
            <span class="profile-field-value">
              <code style="font-size: 13.5px;">${enrollmentNo}</code>
              <span class="status-badge-locked">Single Sign-On</span>
            </span>
          </div>
          <div class="profile-field-row">
            <span class="profile-field-label">Assigned Password</span>
            <span class="profile-field-value">
              <span id="profile-pwd-text" style="font-family: var(--font-mono); font-weight: 700; letter-spacing: 2px;">••••••••</span>
              <button class="btn btn-secondary btn-sm" onclick="StudentPortal.togglePasswordVisibility()" style="padding: 2px 8px; font-size: 11px;" id="profile-pwd-btn">
                👁️ Show
              </button>
            </span>
          </div>
          <div class="profile-field-row">
            <span class="profile-field-label">Access Level</span>
            <span class="profile-field-value">
              <span class="badge badge-primary">STUDENT (Namespace /student/*)</span>
            </span>
          </div>
          <div class="profile-field-row">
            <span class="profile-field-label">Idle Inactivity Policy</span>
            <span class="profile-field-value">
              <span class="badge badge-info">⏱️ 1-Hour Timeout Enforced</span>
            </span>
          </div>
          <div class="profile-field-row" style="align-items: flex-start;">
            <span class="profile-field-label" style="padding-top: 2px;">Profile Field Governance</span>
            <span class="profile-field-value" style="text-align: right; max-width: 260px; font-size: 11.5px; line-height: 1.4; color: var(--text-secondary);">
              Managed by Superadmin via System Settings (Contact & Address = Allowed; Core Academic = Superadmin Restricted)
            </span>
          </div>

          <div style="margin-top: 18px; display: flex; gap: 10px; flex-wrap: wrap;">
            <button class="btn btn-primary btn-sm" onclick="StudentPortal.openEditProfileModal()" style="flex: 1;">
              ✏️ Update Permitted Details
            </button>
            <button class="btn btn-secondary btn-sm" onclick="StudentPortal.openStudentModal('change-password')" style="flex: 1;">
              🔑 Change Password
            </button>
          </div>
        </div>

      </div>

      <!-- SECTION 3: SUPPORTING DOCUMENTS (TRANSCRIPTS & CERTIFICATES) -->
      <div class="card" style="margin-bottom: 24px;">
        <div class="card-header">
          <div>
            <h3 class="card-title">📁 Supporting Documents & Digital Records</h3>
            <p class="page-subtitle">
              Digital copies of previous transcripts, birth certificates, and transfer certificates uploaded by student or admin
            </p>
          </div>
          <button class="btn btn-primary btn-sm" onclick="StudentPortal.openStudentModal('upload-document')">
            + Upload Supporting Document
          </button>
        </div>

        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Document Title & File</th>
                <th>Document Type</th>
                <th>Uploaded By</th>
                <th>Upload Date</th>
                <th>File Size</th>
                <th>Verification Status</th>
                <th style="text-align: right;">Action</th>
              </tr>
            </thead>
            <tbody>
              ${docs.map(doc => `
                <tr>
                  <td>
                    <div style="display: flex; align-items: center; gap: 10px;">
                      <span style="font-size: 20px;">${doc.icon || '📄'}</span>
                      <div>
                        <div style="font-weight: 700; color: var(--text-primary);">${doc.title}</div>
                        <code style="font-size: 11px; color: var(--text-muted);">${doc.fileName}</code>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span class="document-type-badge">${doc.type}</span>
                  </td>
                  <td>
                    <span style="font-size: 12.5px; font-weight: 600;">${doc.uploadedBy}</span>
                  </td>
                  <td>
                    <span style="font-size: 12.5px; color: var(--text-muted);">${doc.uploadDate}</span>
                  </td>
                  <td>
                    <span style="font-size: 12px; font-family: var(--font-mono);">${doc.fileSize}</span>
                  </td>
                  <td>
                    <span class="badge ${doc.statusBadge || 'badge-success'}">${doc.status}</span>
                  </td>
                  <td style="text-align: right;">
                    <div style="display: inline-flex; gap: 6px;">
                      <button class="btn btn-secondary btn-sm" onclick="StudentPortal.viewDocument('${doc.id}')" title="Preview Document">
                        👁️ View
                      </button>
                      <button class="btn btn-secondary btn-sm" onclick="StudentPortal.downloadDocument('${doc.id}')" title="Download Digital Copy">
                        ⬇️ Download
                      </button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- SECTION 4: LINKED UNIVERSITY TRACKING MODULES -->
      <div class="card">
        <div class="card-header">
          <div>
            <h3 class="card-title">🧭 Linked University Tracking Modules</h3>
            <p class="page-subtitle">
              Instant one-click navigation to real-time attendance, fee payment ledger, and examination grade cards
            </p>
          </div>
          <span class="badge badge-info" style="font-size: 11px;">Real-Time Sync Modules</span>
        </div>

        <div class="profile-tracking-grid">

          <!-- Tracking Module 1: Attendance Management -->
          <div class="profile-tracking-card">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <span style="font-size: 28px;">📅</span>
                <span class="badge ${overallPct >= 75 ? 'badge-success' : 'badge-danger'}">
                  ${overallPct >= 75 ? '✓ 75% Compliant' : '⚠️ Shortage Warning'}
                </span>
              </div>
              <h4 style="margin: 0 0 6px 0; font-size: 16px; font-weight: 800;">Real-Time Attendance Management</h4>
              <p style="margin: 0 0 14px 0; font-size: 12.5px; color: var(--text-secondary); line-height: 1.4;">
                Continuous CDC sync recording lecture attendance, subject percentage, and exam eligibility status.
              </p>
              <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 8px;">
                <span style="font-size: 26px; font-weight: 800; color: ${overallPct >= 75 ? 'var(--color-success)' : 'var(--color-danger)'};">
                  ${overallPct}%
                </span>
                <span style="font-size: 12px; color: var(--text-muted); font-weight: 600;">
                  ${totalAttended} / ${totalHeld} Classes Attended
                </span>
              </div>
              <div class="progress-bar-bg" style="height: 8px; margin-bottom: 16px;">
                <div class="progress-bar-fill ${overallPct >= 75 ? 'high' : 'low'}" style="width: ${overallPct}%;"></div>
              </div>
            </div>
            <button class="btn btn-primary btn-sm" onclick="StudentPortal.switchTab('attendance')" style="width: 100%;">
              Launch Live Attendance Tracker →
            </button>
          </div>

          <!-- Tracking Module 2: Fee Payment History -->
          <div class="profile-tracking-card">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <span style="font-size: 28px;">💳</span>
                <span class="badge badge-success">✓ Fully Paid (₹0 Due)</span>
              </div>
              <h4 style="margin: 0 0 6px 0; font-size: 16px; font-weight: 800;">Fee Payment History & Ledger</h4>
              <p style="margin: 0 0 14px 0; font-size: 12.5px; color: var(--text-secondary); line-height: 1.4;">
                Institutional fee ledger, payment breakdown, verified bank reconciliation, and instant PDF receipts.
              </p>
              <div style="margin-bottom: 16px;">
                <div style="font-size: 24px; font-weight: 800; color: var(--pu-maroon-primary); margin-bottom: 4px;">
                  ₹ 1,45,000
                </div>
                <div style="font-size: 12px; color: var(--text-muted);">
                  Tax Receipt Ref: <code>#PU-REC-2026-8819</code> &bull; HDFC Gateway
                </div>
              </div>
            </div>
            <button class="btn btn-primary btn-sm" onclick="StudentPortal.switchTab('fees')" style="width: 100%;">
              View Fee Ledger & Receipts →
            </button>
          </div>

          <!-- Tracking Module 3: Examination Results -->
          <div class="profile-tracking-card">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <span style="font-size: 28px;">📜</span>
                <span class="badge badge-gold">Grade Card Declared</span>
              </div>
              <h4 style="margin: 0 0 6px 0; font-size: 16px; font-weight: 800;">Examination Results & Grade Cards</h4>
              <p style="margin: 0 0 14px 0; font-size: 12.5px; color: var(--text-secondary); line-height: 1.4;">
                Semester marksheets, credit summaries, SGPA/CGPA standing, and printable official university transcripts.
              </p>
              <div style="margin-bottom: 16px;">
                <div style="display: flex; align-items: baseline; gap: 8px; margin-bottom: 4px;">
                  <span style="font-size: 24px; font-weight: 800; color: #D97706;">
                    ${userGrades.summary.sgpa} SGPA
                  </span>
                  <span style="font-size: 13px; font-weight: 700; color: var(--text-muted);">
                    (CGPA: ${userGrades.summary.cgpa})
                  </span>
                </div>
                <div style="font-size: 12px; color: var(--text-muted);">
                  Standing: <strong>${userGrades.summary.result || 'FIRST CLASS WITH DISTINCTION'}</strong>
                </div>
              </div>
            </div>
            <button class="btn btn-primary btn-sm" onclick="StudentPortal.switchTab('reportcard')" style="width: 100%;">
              View Official Statement of Grades →
            </button>
          </div>

        </div>
      </div>
    `;
  }

  /**
   * Renders mini attendance progress items for the dashboard
   */
  function renderDashboardAttendanceMini(user) {
    const statsMap = user.attendanceStats || PU_DATA.attendanceStats || {};
    return Object.keys(statsMap).map(code => {
      const s = statsMap[code];
      const pct = calculateAttendancePercentage(s.attended, s.held);
      const isOk = pct >= 75;
      return `
        <div>
          <div style="display: flex; justify-content: space-between; font-size: 12.5px; margin-bottom: 4px;">
            <span><strong>${code}</strong> &bull; ${s.title || code}</span>
            <span style="font-weight: 700; color: ${isOk ? 'var(--color-success)' : 'var(--color-danger)'};">${pct}% (${s.attended}/${s.held})</span>
          </div>
          <div class="progress-bar-bg" style="height: 6px;">
            <div class="progress-bar-fill ${isOk ? 'high' : 'low'}" style="width: ${pct}%;"></div>
          </div>
        </div>
      `;
    }).join('');
  }

  /**
   * Renders dashboard outpass preview
   */
  function renderDashboardOutpassPreview() {
    const list = PU_DATA.outpasses || [];
    if (list.length === 0) {
      return `<p style="padding: 16px; color: var(--text-muted); font-size: 13px;">No outpass requested recently.</p>`;
    }
    const latest = list[0];
    const isApproved = latest.status === 'APPROVED';
    return `
      <div style="padding: 14px; background: var(--bg-subtle); border-radius: var(--radius-md); border-left: 3px solid ${isApproved ? '#10B981' : '#F59E0B'};">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
          <strong>Gatepass #${latest.id}</strong>
          <span class="badge ${isApproved ? 'badge-success' : 'badge-gold'}">${latest.status}</span>
        </div>
        <div style="font-size: 12.5px; color: var(--text-secondary);">
          <strong>Destination:</strong> ${latest.destination} &bull; <strong>Reason:</strong> ${latest.reason}
        </div>
        <div style="font-size: 11.5px; color: var(--text-muted); margin-top: 4px;">
          Departure: ${latest.outDate} ${latest.outTime} &bull; Return: ${latest.inDate || latest.outDate} ${latest.inTime}
        </div>
        ${isApproved ? `
          <div style="margin-top: 10px;">
            <button class="btn btn-secondary btn-sm" onclick="StudentPortal.openStudentModal('gatepass-qr', '${latest.id}')">
              📱 View Gatekeeper QR Pass
            </button>
          </div>
        ` : ''}
      </div>
    `;
  }

  /**
   * Renders subject attendance cards
   */
  function renderAttendanceCards(user) {
    const statsMap = (user && user.attendanceStats) || PU_DATA.attendanceStats || {};
    return Object.keys(statsMap).map(code => {
      const stats = statsMap[code];
      const pct = calculateAttendancePercentage(stats.attended, stats.held);
      let statusClass = 'high';
      let badgeClass = 'badge-success';
      let statusText = 'Eligible (≥ 75%)';

      if (pct < 75 && pct >= 70) {
        statusClass = 'medium';
        badgeClass = 'badge-gold';
        statusText = 'Warning (70-74%)';
      } else if (pct < 70) {
        statusClass = 'low';
        badgeClass = 'badge-danger';
        statusText = 'Critical Shortage (< 70%)';
      }

      return `
        <div class="attendance-card">
          <div class="attendance-header">
            <div>
              <span class="attendance-code">${code} &bull; 4 Credits</span>
              <div class="attendance-name">${stats.title || code}</div>
              <div class="attendance-faculty">Faculty of Computer Applications</div>
            </div>
            <span class="badge ${badgeClass}">${statusText}</span>
          </div>

          <div class="attendance-progress-container">
            <div class="progress-bar-bg">
              <div class="progress-bar-fill ${statusClass}" style="width: ${Math.min(pct, 100)}%;"></div>
            </div>
            <span class="attendance-pct" style="color: ${pct >= 75 ? 'var(--color-success)' : 'var(--color-danger)'};">${pct}%</span>
          </div>

          <div class="attendance-footer">
            <span>Attended: <strong>${stats.attended}</strong> / ${stats.held} Hours</span>
            <span>Required for 75%: <strong>${Math.max(0, Math.ceil(stats.held * 0.75) - stats.attended)} more</strong></span>
          </div>
        </div>
      `;
    }).join('');
  }

  /**
   * Renders outpass list
   */
  function renderOutpassList() {
    if (PU_DATA.outpasses.length === 0) {
      return `<p style="padding: 20px; text-align: center; color: var(--text-muted);">No outpasses requested yet.</p>`;
    }

    return PU_DATA.outpasses.map(op => {
      const isApproved = op.status === 'APPROVED';
      const isPending = op.status === 'PENDING';
      const statusBadge = isApproved 
        ? `<span class="badge badge-success">✓ APPROVED BY PROCTOR</span>`
        : (isPending ? `<span class="badge badge-gold">⏳ PENDING FACULTY APPROVAL</span>` : `<span class="badge badge-danger">✕ REJECTED</span>`);

      return `
        <div style="border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 20px; margin-bottom: 16px; background: var(--bg-surface); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px;">
          <div>
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 6px;">
              <strong style="font-size: 16px; color: var(--text-primary);">Gatepass #${op.id}</strong>
              ${statusBadge}
            </div>
            <div style="font-size: 13px; color: var(--text-secondary); margin-bottom: 4px;">
              <strong>Destination:</strong> ${op.destination} | <strong>Reason:</strong> ${op.reason}
            </div>
            <div style="font-size: 12px; color: var(--text-muted);">
              <strong>Departure:</strong> ${op.outDate} ${op.outTime} &bull; <strong>Expected Return:</strong> ${op.inDate || op.outDate} ${op.inTime}
            </div>
            ${op.approvedBy ? `<div style="font-size: 12px; color: var(--color-success); margin-top: 6px;">Approved by: <strong>${op.approvedBy}</strong> at ${op.approvedAt}</div>` : ''}
          </div>

          ${isApproved ? `
            <div style="text-align: center; background: #FFFFFF; padding: 10px; border-radius: var(--radius-md); border: 1.5px solid #10B981; box-shadow: var(--shadow-sm);">
              <svg width="90" height="90" viewBox="0 0 100 100" style="display: block; margin: 0 auto;">
                <rect width="100" height="100" fill="#FFFFFF"/>
                <path d="M10 10h30v30h-30z M60 10h30v30h-30z M10 60h30v30h-30z" fill="#800020"/>
                <path d="M15 15h20v20h-20z M65 15h20v20h-20z M15 65h20v20h-20z" fill="#FFFFFF"/>
                <path d="M20 20h10v10h-10z M70 20h10v10h-10z M20 70h10v10h-10z" fill="#800020"/>
                <rect x="45" y="10" width="8" height="20" fill="#111827"/>
                <rect x="45" y="40" width="10" height="10" fill="#10B981"/>
                <rect x="60" y="55" width="25" height="10" fill="#111827"/>
                <rect x="75" y="70" width="15" height="18" fill="#800020"/>
                <rect x="45" y="70" width="18" height="18" fill="#111827"/>
              </svg>
              <span style="font-size: 10px; font-weight: 700; color: #059669; display: block; margin-top: 4px;">SCAN AT MAIN GATE</span>
            </div>
          ` : `
            <div style="padding: 10px 16px; background: var(--bg-subtle); border-radius: var(--radius-md); font-size: 12px; color: var(--text-muted); text-align: center;">
              Gatepass QR unlocks upon<br>Faculty Proctor approval.
            </div>
          `}
        </div>
      `;
    }).join('');
  }

  /**
   * Switch between Student Portal subtabs (strictly scoped to .student-portal)
   */
  function switchTab(tabId) {
    const portalEl = document.querySelector('.student-portal') || document;
    portalEl.querySelectorAll('.portal-subtabs .subtab-btn').forEach(btn => btn.classList.remove('active'));
    portalEl.querySelectorAll('.subtab-content').forEach(c => c.classList.remove('active'));

    const activeBtn = portalEl.querySelector(`.portal-subtabs .subtab-btn[onclick*="'${tabId}'"]`) || 
                      (typeof event !== 'undefined' && event && event.currentTarget && event.currentTarget.classList.contains('subtab-btn') ? event.currentTarget : null);
    if (activeBtn) activeBtn.classList.add('active');

    const targetContent = document.getElementById(`student-tab-${tabId}`);
    if (targetContent) targetContent.classList.add('active');
  }

  /**
   * Opens student service modals
   */
  function openStudentModal(key, extraParam) {
    const modal = document.getElementById('student-service-modal-overlay');
    const titleEl = document.getElementById('student-modal-title');
    const bodyEl = document.getElementById('student-modal-body');
    if (!modal || !titleEl || !bodyEl) return;

    const user = AuthEngine.getCurrentUser();
    const transport = PU_DATA.studentTransport;
    const messPass = PU_DATA.studentMessPass;

    switch(key) {
      case 'transport':
        titleEl.innerHTML = `🚌 Parul University Student Transport Pass (Route 14)`;
        bodyEl.innerHTML = `
          <div style="max-width: 520px; margin: 0 auto; border: 2px solid var(--pu-maroon-primary); border-radius: 16px; padding: 22px; background: linear-gradient(135deg, rgba(128, 0, 32, 0.04) 0%, rgba(217, 119, 6, 0.04) 100%);">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid var(--pu-maroon-primary); padding-bottom: 12px; margin-bottom: 14px;">
              <div>
                <h3 style="margin: 0; color: var(--pu-maroon-primary); font-size: 16px;">STUDENT COMMUTER PASS</h3>
                <span style="font-size: 11px; color: var(--text-muted);">${transport.routeName}</span>
              </div>
              <span class="badge badge-gold" style="font-size: 12px;">ROUTE ${transport.routeNo}</span>
            </div>
            <div style="font-size: 13px; line-height: 1.8;">
              <div><strong>Student Name:</strong> ${user.name} (<code>${user.enrollmentNo}</code>)</div>
              <div><strong>Pass Serial:</strong> <code>${transport.passNo}</code></div>
              <div><strong>Assigned Bus:</strong> <strong>${transport.busNumber}</strong></div>
              <div><strong>Boarding Point:</strong> ${transport.pickupStop}</div>
              <div><strong>Daily Timings:</strong> Pickup: <strong>${transport.morningPickup}</strong> &bull; Return: <strong>${transport.eveningReturn}</strong></div>
              <div><strong>Driver In-Charge:</strong> ${transport.driverName} (${transport.driverContact})</div>
              <div><strong>Valid Through:</strong> <span class="badge badge-success">${transport.validThrough}</span></div>
            </div>
          </div>
        `;
        break;

      case 'mess-pass':
        titleEl.innerHTML = `🍽️ Digital Campus Mess & Dining Hall Meal Pass`;
        bodyEl.innerHTML = `
          <div style="max-width: 540px; margin: 0 auto; border: 2px solid #0284C7; border-radius: 16px; padding: 22px; background: var(--bg-card);">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0284C7; padding-bottom: 12px; margin-bottom: 14px;">
              <div>
                <h3 style="margin: 0; color: #0284C7; font-size: 16px;">PARUL UNIVERSITY DINING SERVICES</h3>
                <span style="font-size: 11.5px; color: var(--text-muted);">${messPass.diningHall}</span>
              </div>
              <span class="badge badge-info">${messPass.status}</span>
            </div>
            <div style="font-size: 13px; margin-bottom: 16px;">
              <div><strong>Card Holder:</strong> ${user.name} &bull; <strong>Hostel:</strong> ${user.hostel || 'Sarojini Bhavan'}</div>
              <div><strong>Diet:</strong> ${messPass.dietaryType}</div>
            </div>
            <h4 style="font-size: 13.5px; margin-bottom: 8px; color: var(--pu-maroon-primary);">Daily Meal Timings & Menus:</h4>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              ${messPass.slots.map(s => `
                <div style="padding: 10px; background: var(--bg-subtle); border-radius: var(--radius-sm); font-size: 12.5px;">
                  <div style="display: flex; justify-content: space-between; font-weight: 700;">
                    <span>${s.meal}</span>
                    <span style="color: var(--text-muted);">${s.timing}</span>
                  </div>
                  <div style="color: var(--text-secondary); margin-top: 2px;">${s.todayMenu}</div>
                </div>
              `).join('')}
            </div>
          </div>
        `;
        break;

      case 'exam-hallticket':
        titleEl.innerHTML = `🖨️ University Examination Admit Card & Hall Ticket`;
        bodyEl.innerHTML = `
          <div style="border: 2px solid var(--pu-maroon-primary); border-radius: 12px; padding: 22px; background: #FFFFFF; color: #111827;">
            <div style="text-align: center; border-bottom: 2px solid var(--pu-maroon-primary); padding-bottom: 12px; margin-bottom: 16px;">
              <h3 style="margin: 0; color: #800020; font-size: 18px;">PARUL UNIVERSITY</h3>
              <div style="font-size: 11.5px; color: #4B5563;">OFFICIAL EXAMINATION ADMIT CARD / HALL TICKET</div>
              <div style="font-size: 12px; font-weight: 700; margin-top: 4px;">SEMESTER ${user.semester || 5} END-SEMESTER THEORY EXAMINATIONS</div>
            </div>
            <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 14px; font-size: 13px; margin-bottom: 16px;">
              <div>
                <div><strong>Candidate Name:</strong> ${user.name}</div>
                <div><strong>Enrollment Number:</strong> ${user.enrollmentNo}</div>
                <div><strong>Institute:</strong> ${user.institute || 'Faculty of Engineering & Technology'} &bull; <strong>Branch:</strong> ${user.program || 'B.Tech CSE'}</div>
                <div><strong>Exam Center:</strong> Parul Institute of Engineering, Block B</div>
              </div>
              <div style="text-align: center; border: 1.5px solid #10B981; padding: 8px; border-radius: 8px;">
                <div style="font-size: 24px;">✓</div>
                <div style="font-size: 10px; font-weight: 700; color: #059669;">PROCTOR VERIFIED<br>ATTENDANCE COMPLIANT</div>
              </div>
            </div>
            <button class="btn btn-primary" style="width: 100%;" onclick="window.print()">
              🖨️ Print Admit Card (PDF)
            </button>
          </div>
        `;
        break;

      case 'feedback':
        const fbCode = extraParam || 'CS602';
        titleEl.innerHTML = `⭐ Course & Faculty Teaching Feedback (${fbCode})`;
        bodyEl.innerHTML = `
          <div style="font-size: 13px; margin-bottom: 14px;">
            Please evaluate course delivery and instructional clarity for <strong>${fbCode}</strong>. Feedback is anonymous and used for faculty development.
          </div>
          <div style="margin-bottom: 14px;">
            <label class="form-label">Subject Knowledge & Explanation Clarity</label>
            <div class="student-star-rating" id="star-rating-1">
              <span class="student-star active">★</span>
              <span class="student-star active">★</span>
              <span class="student-star active">★</span>
              <span class="student-star active">★</span>
              <span class="student-star active">★</span>
            </div>
          </div>
          <div style="margin-bottom: 14px;">
            <label class="form-label">Practical Lab Guidance & Doubt Resolution</label>
            <div class="student-star-rating" id="star-rating-2">
              <span class="student-star active">★</span>
              <span class="student-star active">★</span>
              <span class="student-star active">★</span>
              <span class="student-star active">★</span>
              <span class="student-star">★</span>
            </div>
          </div>
          <div style="margin-bottom: 16px;">
            <label class="form-label">Constructive Comments</label>
            <textarea id="feedback-comment" class="form-control" rows="2" placeholder="Great lectures, request more real-world project assignments..."></textarea>
          </div>
          <button class="btn btn-primary" style="width: 100%;" onclick="StudentPortal.submitCourseFeedback('${fbCode}')">
            Submit Teaching Evaluation
          </button>
        `;
        break;

      case 'grievance':
        titleEl.innerHTML = `📝 Lodge Institutional Grievance / Ticket`;
        bodyEl.innerHTML = `
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
            <div>
              <label class="form-label" style="font-size: 11.5px;">Grievance Category</label>
              <select id="stu-grv-cat" class="form-select">
                <option>Hostel Facilities & Wi-Fi</option>
                <option>Campus Dining & Mess</option>
                <option>Academic & Library Resources</option>
                <option>University Transport / Bus</option>
              </select>
            </div>
            <div>
              <label class="form-label" style="font-size: 11.5px;">Subject</label>
              <input type="text" id="stu-grv-subj" class="form-control" placeholder="e.g. Wi-Fi speed in Room 418">
            </div>
          </div>
          <div style="margin-bottom: 16px;">
            <label class="form-label" style="font-size: 11.5px;">Detailed Explanation</label>
            <textarea id="stu-grv-desc" class="form-control" rows="3" placeholder="Provide specific room number, building, or description..."></textarea>
          </div>
          <button class="btn btn-primary" style="width: 100%;" onclick="StudentPortal.submitStudentGrievance()">
            ✓ Log Grievance Ticket with Administration
          </button>
        `;
        break;

      case 'gatepass-qr':
        titleEl.innerHTML = `📱 Gatekeeper Scan QR Pass (#${extraParam})`;
        bodyEl.innerHTML = `
          <div style="text-align: center; padding: 20px;">
            <svg width="180" height="180" viewBox="0 0 100 100" style="display: block; margin: 0 auto;">
              <rect width="100" height="100" fill="#FFFFFF"/>
              <path d="M10 10h30v30h-30z M60 10h30v30h-30z M10 60h30v30h-30z" fill="#800020"/>
              <path d="M15 15h20v20h-20z M65 15h20v20h-20z M15 65h20v20h-20z" fill="#FFFFFF"/>
              <path d="M20 20h10v10h-10z M70 20h10v10h-10z M20 70h10v10h-10z" fill="#800020"/>
              <rect x="45" y="10" width="8" height="20" fill="#111827"/>
              <rect x="45" y="40" width="10" height="10" fill="#10B981"/>
              <rect x="60" y="55" width="25" height="10" fill="#111827"/>
              <rect x="75" y="70" width="15" height="18" fill="#800020"/>
              <rect x="45" y="70" width="18" height="18" fill="#111827"/>
            </svg>
            <h4 style="margin: 14px 0 4px 0; color: var(--pu-maroon-primary); font-size: 16px;">Gatepass #${extraParam} Authorized</h4>
            <p style="font-size: 12.5px; color: var(--text-muted); margin: 0;">Present this barcode at Limda Campus Main Gate 1 or Gate 3.</p>
          </div>
        `;
        break;

      case 'edit-profile':
        titleEl.innerHTML = `✏️ Edit Permitted Profile Details (Superadmin Governed)`;
        bodyEl.innerHTML = `
          <form onsubmit="StudentPortal.saveProfileUpdates(event)">
            <div style="padding: 12px 16px; background: rgba(217, 119, 6, 0.08); border: 1px solid rgba(217, 119, 6, 0.3); border-radius: 8px; margin-bottom: 16px; font-size: 12.5px; line-height: 1.4;">
              <strong>🛡️ System Settings Compliance:</strong> Core identity (Name, DOB, Gender) and academic registration (Student ID, Admission Year, Class, Section) are locked by Superadmin. You are authorized to update contact details and residential address below.
            </div>

            <div class="form-group">
              <label class="form-label">
                <span>Permanent Home Address</span>
                <span class="status-badge-editable">✏️ Permitted</span>
              </label>
              <textarea id="edit-home-address" class="form-control" rows="2" required>${user.homeAddress || 'Plot 42, Sunrise Greens, Gotri Road, Vadodara, Gujarat - 390021'}</textarea>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
              <div class="form-group">
                <label class="form-label">
                  <span>Student Phone</span>
                  <span class="status-badge-editable">✏️ Permitted</span>
                </label>
                <input type="text" id="edit-student-phone" class="form-control" value="${user.phone || '+91 98251 12345'}" required>
              </div>
              <div class="form-group">
                <label class="form-label">
                  <span>Parent / Guardian Phone</span>
                  <span class="status-badge-editable">✏️ Permitted</span>
                </label>
                <input type="text" id="edit-parent-phone" class="form-control" value="${user.parentPhone || '+91 98251 67890'}" required>
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
              <div class="form-group">
                <label class="form-label">
                  <span>Parent / Alternate Email</span>
                  <span class="status-badge-editable">✏️ Permitted</span>
                </label>
                <input type="email" id="edit-parent-email" class="form-control" value="${user.parentEmail || 'suresh.mehta@gmail.com'}" required>
              </div>
              <div class="form-group">
                <label class="form-label">
                  <span>Blood Group</span>
                  <span class="status-badge-editable">✏️ Permitted</span>
                </label>
                <select id="edit-blood-group" class="form-control">
                  <option value="O+ Positive" ${user.bloodGroup === 'O+ Positive' ? 'selected' : ''}>O+ Positive</option>
                  <option value="A+ Positive" ${user.bloodGroup === 'A+ Positive' ? 'selected' : ''}>A+ Positive</option>
                  <option value="B+ Positive" ${user.bloodGroup === 'B+ Positive' ? 'selected' : ''}>B+ Positive</option>
                  <option value="AB+ Positive" ${user.bloodGroup === 'AB+ Positive' ? 'selected' : ''}>AB+ Positive</option>
                  <option value="O- Negative" ${user.bloodGroup === 'O- Negative' ? 'selected' : ''}>O- Negative</option>
                  <option value="A- Negative" ${user.bloodGroup === 'A- Negative' ? 'selected' : ''}>A- Negative</option>
                </select>
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
              <div class="form-group">
                <label class="form-label">
                  <span>Emergency Contact Name</span>
                  <span class="status-badge-editable">✏️ Permitted</span>
                </label>
                <input type="text" id="edit-emergency-name" class="form-control" value="${user.emergencyContactName || 'Mr. Sureshchandra Mehta (Father)'}" required>
              </div>
              <div class="form-group">
                <label class="form-label">
                  <span>Emergency Contact Phone</span>
                  <span class="status-badge-editable">✏️ Permitted</span>
                </label>
                <input type="text" id="edit-emergency-phone" class="form-control" value="${user.emergencyPhone || '+91 98251 67890'}" required>
              </div>
            </div>

            <div style="margin-top: 14px; padding-top: 14px; border-top: 1px solid var(--border-subtle); display: flex; justify-content: flex-end; gap: 10px;">
              <button type="button" class="btn btn-secondary" onclick="StudentPortal.closeStudentModal()">Cancel</button>
              <button type="submit" class="btn btn-primary">💾 Save Profile Updates</button>
            </div>
          </form>
        `;
        break;

      case 'upload-document':
        titleEl.innerHTML = `📤 Upload Supporting Document (Student Bio-Data)`;
        bodyEl.innerHTML = `
          <form onsubmit="StudentPortal.handleDocumentUpload(event)">
            <p style="font-size: 13px; color: var(--text-secondary); margin-bottom: 16px;">
              Upload digital copies of previous academic transcripts, municipal birth certificates, or institutional transfer certificates (TC). Uploaded files are immediately added to your records and queued for Registrar verification.
            </p>

            <div class="form-group">
              <label class="form-label">Document Title / Description</label>
              <input type="text" id="upload-doc-title" class="form-control" placeholder="e.g. 12th Board Official Marksheet or Birth Certificate" required>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
              <div class="form-group">
                <label class="form-label">Document Category / Type</label>
                <select id="upload-doc-type" class="form-control" required>
                  <option value="Previous Transcript">Previous Transcript (10th / 12th / Diploma / Degree)</option>
                  <option value="Birth Certificate">Birth Certificate (Municipal / Govt Authority)</option>
                  <option value="Transfer Certificate">Transfer Certificate (TC / Leaving Certificate)</option>
                  <option value="Identity Proof">National Identity Card (Aadhaar / Passport)</option>
                  <option value="Other Document">Other Institutional Certificate</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Issuing Board / Authority</label>
                <input type="text" id="upload-doc-authority" class="form-control" placeholder="e.g. GSEB / CBSE / Municipal Corp" value="Gujarat Secondary Board">
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Select Digital File (PDF, PNG, JPG - Max 15 MB)</label>
              <input type="file" id="upload-doc-file" class="form-control" accept=".pdf,.png,.jpg,.jpeg">
              <small style="color: var(--text-muted); font-size: 11.5px; margin-top: 4px; display: block;">
                * High-resolution scan recommended. Automatic OCR verification enabled.
              </small>
            </div>

            <div style="margin-top: 18px; display: flex; justify-content: flex-end; gap: 10px;">
              <button type="button" class="btn btn-secondary" onclick="StudentPortal.closeStudentModal()">Cancel</button>
              <button type="submit" class="btn btn-primary">✓ Upload & Submit for Verification</button>
            </div>
          </form>
        `;
        break;

      case 'request-correction':
        titleEl.innerHTML = `📑 Request Correction for Locked Institutional Field`;
        bodyEl.innerHTML = `
          <form onsubmit="StudentPortal.submitCorrectionRequest(event)">
            <div style="padding: 12px 16px; background: rgba(128, 0, 32, 0.06); border: 1px solid rgba(128, 0, 32, 0.2); border-radius: 8px; margin-bottom: 16px; font-size: 12.5px; line-height: 1.4;">
              <strong>Registrar Petitions Desk:</strong> Modifications to locked academic credentials (Full Name, Date of Birth, Gender, Unique Student ID, Admission Year, Class, Section) require administrative review and supporting legal proof.
            </div>

            <div class="form-group">
              <label class="form-label">Select Locked Field to Correct</label>
              <select id="corr-field-select" class="form-control" required>
                <option value="Full Legal Name">Full Legal Name (Currently: ${user.name})</option>
                <option value="Date of Birth">Date of Birth (Currently: ${user.dob || '2003-08-14'})</option>
                <option value="Gender">Gender (Currently: ${user.gender || 'Male'})</option>
                <option value="Student ID / Enrollment No">Student ID / Enrollment Number</option>
                <option value="Admission Year">Admission Year / Batch</option>
                <option value="Class & Section">Degree Class, Division or Section</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Requested Correct Value</label>
              <input type="text" id="corr-requested-val" class="form-control" placeholder="Enter corrected value" required>
            </div>

            <div class="form-group">
              <label class="form-label">Justification / Reason for Modification</label>
              <textarea id="corr-reason" class="form-control" rows="2" placeholder="e.g. Gazette notification, typographical error in 10th marksheet, or ACPC allotment revision" required></textarea>
            </div>

            <div class="form-group">
              <label class="form-label">Upload Proof Document (Govt ID / Gazette / Affidavit)</label>
              <input type="file" class="form-control" accept=".pdf,.png,.jpg">
            </div>

            <div style="margin-top: 18px; display: flex; justify-content: flex-end; gap: 10px;">
              <button type="button" class="btn btn-secondary" onclick="StudentPortal.closeStudentModal()">Cancel</button>
              <button type="submit" class="btn btn-primary">Submit Petition to Registrar</button>
            </div>
          </form>
        `;
        break;

      case 'change-password':
        titleEl.innerHTML = `🔑 Change Assigned Portal Password`;
        bodyEl.innerHTML = `
          <form onsubmit="event.preventDefault(); StudentPortal.closeStudentModal(); if (typeof RealtimeEngine !== 'undefined') RealtimeEngine.showToast('Password Updated', 'Your role-based portal password has been changed successfully.', 'success'); else alert('Password changed successfully!');">
            <div class="form-group">
              <label class="form-label">Assigned Username</label>
              <input type="text" class="form-control" value="${user.enrollmentNo}" disabled style="background: var(--bg-subtle);">
            </div>
            <div class="form-group">
              <label class="form-label">Current Password</label>
              <input type="password" class="form-control" value="${user.password || 'password123'}" required>
            </div>
            <div class="form-group">
              <label class="form-label">New Password</label>
              <input type="password" class="form-control" placeholder="Minimum 8 characters" required>
            </div>
            <div class="form-group">
              <label class="form-label">Confirm New Password</label>
              <input type="password" class="form-control" placeholder="Re-enter new password" required>
            </div>
            <div style="margin-top: 18px; display: flex; justify-content: flex-end; gap: 10px;">
              <button type="button" class="btn btn-secondary" onclick="StudentPortal.closeStudentModal()">Cancel</button>
              <button type="submit" class="btn btn-primary">Update Password</button>
            </div>
          </form>
        `;
        break;
    }

    modal.classList.add('active');
  }

  function closeStudentModal() {
    const modal = document.getElementById('student-service-modal-overlay');
    if (modal) modal.classList.remove('active');
  }

  function submitCourseFeedback(courseCode) {
    const item = (PU_DATA.studentFeedback || []).find(f => f.code === courseCode);
    if (item) {
      item.completed = true;
      item.rating = 5;
      item.remark = document.getElementById('feedback-comment')?.value || "Great course content!";
    }
    RealtimeEngine.showToast({
      title: "Feedback Submitted!",
      message: `Your evaluation for ${courseCode} has been recorded anonymously.`,
      type: "success"
    });
    closeStudentModal();
    render(document.getElementById('portal-view-container'));
  }

  function submitStudentGrievance() {
    const cat = document.getElementById('stu-grv-cat')?.value || "Hostel";
    const subj = document.getElementById('stu-grv-subj')?.value || "General request";
    const newId = `GRV-STU-2026-${Math.floor(100 + Math.random() * 900)}`;

    (PU_DATA.studentGrievances || []).unshift({
      id: newId,
      category: cat,
      subject: subj,
      date: new Date().toISOString().split('T')[0],
      status: "IN PROGRESS",
      resolution: "Assigned to Campus Helpdesk. Investigation underway."
    });

    RealtimeEngine.showToast({
      title: "Grievance Ticket Lodged!",
      message: `Ticket #${newId} submitted. SMS updates will be dispatched to your registered phone.`,
      type: "info"
    });

    closeStudentModal();
    render(document.getElementById('portal-view-container'));
  }

  function handleOutpassSubmit(e) {
    e.preventDefault();
    const user = AuthEngine.getCurrentUser();
    const outTimeVal = document.getElementById('outpass-out-time').value;
    const inTimeVal = document.getElementById('outpass-in-time').value;
    const dest = document.getElementById('outpass-dest').value;
    const reason = document.getElementById('outpass-reason').value;
    const phone = document.getElementById('outpass-phone').value;

    const newOutpass = {
      id: "OP-2026-" + Math.floor(1000 + Math.random() * 9000),
      studentId: user.id,
      studentName: user.name,
      enrollmentNo: user.enrollmentNo,
      hostel: user.hostel || "Sarojini Bhavan, Room 418",
      outDate: outTimeVal.split('T')[0],
      outTime: outTimeVal.split('T')[1],
      inDate: inTimeVal.split('T')[0],
      inTime: inTimeVal.split('T')[1],
      destination: dest,
      reason: reason,
      parentPhone: phone,
      status: "PENDING",
      approvedBy: null,
      approvedAt: null,
      qrToken: null
    };

    PU_DATA.outpasses.unshift(newOutpass);

    RealtimeEngine.broadcastEvent('NEW_OUTPASS_SUBMITTED', newOutpass);
    RealtimeEngine.logAuditEvent({
      actor: user.name,
      role: "STUDENT",
      action: "OUTPASS_APPLICATION",
      resource: `Gatepass #${newOutpass.id} submitted for faculty approval`,
      status: "PENDING"
    });

    RealtimeEngine.showToast({
      title: "Outpass Submitted!",
      message: `Your request #${newOutpass.id} has been transmitted to faculty proctor for approval.`,
      type: "info"
    });

    render(document.getElementById('portal-view-container'));
    switchTab('outpass');
  }

  function generateGradeCardPDF() {
    const user = AuthEngine.getCurrentUser();
    const modal = document.getElementById('grade-card-modal');
    if (!modal) return;

    const container = document.getElementById('grade-card-render-target');
    if (!container) return;

    const programTitle = user.program 
      ? `${user.program.toUpperCase()} - SEMESTER ${user.semester || 6} EXAMINATION`
      : "BACHELOR OF TECHNOLOGY (COMPUTER SCIENCE & ENGINEERING) - SEMESTER VI EXAMINATION";
    const instTitle = user.institute || "Faculty of Engineering & Technology";
    const userGrades = user.grades || PU_DATA.grades;

    container.innerHTML = `
      <div class="grade-card-container">
        <div class="report-header">
          <img src="assets/parul_logo.jpg" alt="Parul University Logo" class="report-crest">
          <div class="report-header-titles">
            <h2>PARUL UNIVERSITY</h2>
            <p>P.O. Limda, Ta. Waghodia, Dist. Vadodara - 391760, Gujarat, India</p>
            <div class="accreditation-tag">★ NAAC A++ ACCREDITED • NIRF TOP 50 • UGC RECOGNIZED ★</div>
          </div>
          <div class="report-barcode">
            <div class="barcode-stripes">||| | || |||| | | ||| ||||</div>
            <div class="barcode-text">ENR:${user.enrollmentNo}</div>
          </div>
        </div>

        <div class="report-doc-title">
          <h3>OFFICIAL STATEMENT OF GRADES</h3>
          <p style="font-size: 11px; color: #4B5563; margin-top: 2px;">${programTitle}</p>
        </div>

        <div class="report-student-meta">
          <div class="meta-row"><span class="meta-label">Candidate Name:</span><span class="meta-value">${user.name.toUpperCase()}</span></div>
          <div class="meta-row"><span class="meta-label">Enrollment Number:</span><span class="meta-value" style="font-family: monospace;">${user.enrollmentNo}</span></div>
          <div class="meta-row"><span class="meta-label">Roll Number:</span><span class="meta-value">${user.rollNo || '132'}</span></div>
          <div class="meta-row"><span class="meta-label">Examination Month:</span><span class="meta-value">MAY 2026 (REGULAR)</span></div>
          <div class="meta-row"><span class="meta-label">Institute:</span><span class="meta-value">${instTitle}</span></div>
          <div class="meta-row"><span class="meta-label">Document Serial:</span><span class="meta-value" style="font-family: monospace;">PU-DOC-2026-${user.enrollmentNo.substring(7)}</span></div>
        </div>

        <table class="report-table">
          <thead>
            <tr>
              <th style="width: 70px;">Course Code</th>
              <th class="text-left">Course Title</th>
              <th>Credits (C)</th>
              <th>Internal (40)</th>
              <th>Mid-Sem (20)</th>
              <th>End-Sem (40)</th>
              <th>Total (100)</th>
              <th>Grade Point (G)</th>
              <th>Letter Grade</th>
              <th>Credit Points (C×G)</th>
            </tr>
          </thead>
          <tbody>
            ${userGrades.items.map(c => `
              <tr>
                <td><code>${c.code}</code></td>
                <td class="text-left"><strong>${c.title}</strong></td>
                <td>${c.credits}</td>
                <td>${c.internal}</td>
                <td>${c.midSem}</td>
                <td>${c.endSem}</td>
                <td><strong>${c.total}</strong></td>
                <td>${c.gradePoint}</td>
                <td><strong>${c.grade}</strong></td>
                <td>${c.credits * c.gradePoint}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="report-summary-box">
          <div class="summary-col"><h5>Total Credits</h5><p>20</p></div>
          <div class="summary-col"><h5>Earned Credits</h5><p>20</p></div>
          <div class="summary-col"><h5>Semester SGPA</h5><p>${userGrades.summary.sgpa}</p></div>
          <div class="summary-col"><h5>Cumulative CGPA</h5><p>${userGrades.summary.cgpa}</p></div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: #4B5563; border-top: 1px solid #E5E7EB; padding-top: 10px;">
          <div><strong>Result Status:</strong> <span style="color: #059669; font-weight: 700;">PASSED - FIRST CLASS WITH DISTINCTION</span></div>
          <div style="font-family: monospace; font-size: 10px;">Digital Hash: SHA256(PU:${user.enrollmentNo}:SEM5:${userGrades.summary.sgpa})</div>
        </div>

        <div class="report-signatures">
          <div class="sign-box">
            <div class="digital-signature-img">Ketan Kotecha</div>
            <div class="sign-line"></div>
            <div class="sign-title">Controller of Examinations</div>
            <div>Parul University</div>
          </div>
          <div class="report-official-seal">★ PARUL ★<br>SEAL OF<br>REGISTRAR<br>OFFICE</div>
          <div class="sign-box">
            <div class="digital-signature-img">M. N. Patel</div>
            <div class="sign-line"></div>
            <div class="sign-title">Registrar / Provost</div>
            <div>Parul University</div>
          </div>
        </div>
      </div>
    `;

    modal.classList.add('active');
  }

  function downloadFeeReceipt() {
    const user = AuthEngine.getCurrentUser();
    window.alert(`Official Fee Receipt #${PU_DATA.fees.receiptNo}\nCandidate: ${user.name} (${user.enrollmentNo})\nAmount: ₹ 2,28,000 (PAID IN FULL)\nBank Reference: ${PU_DATA.fees.transactionId}\nStatus: Verified Digital Tax Receipt`);
  }

  function openEditProfileModal() {
    openStudentModal('edit-profile');
  }

  function saveProfileUpdates(event) {
    if (event) event.preventDefault();
    const user = AuthEngine.getCurrentUser();
    if (!user) return;

    const address = document.getElementById('edit-home-address')?.value;
    const phone = document.getElementById('edit-student-phone')?.value;
    const parentPhone = document.getElementById('edit-parent-phone')?.value;
    const parentEmail = document.getElementById('edit-parent-email')?.value;
    const bloodGroup = document.getElementById('edit-blood-group')?.value;
    const emergencyName = document.getElementById('edit-emergency-name')?.value;
    const emergencyPhone = document.getElementById('edit-emergency-phone')?.value;

    if (address) user.homeAddress = address;
    if (phone) user.phone = phone;
    if (parentPhone) user.parentPhone = parentPhone;
    if (parentEmail) user.parentEmail = parentEmail;
    if (bloodGroup) user.bloodGroup = bloodGroup;
    if (emergencyName) user.emergencyContactName = emergencyName;
    if (emergencyPhone) user.emergencyPhone = emergencyPhone;

    // Persist in PU_DATA.students
    const match = PU_DATA.students.find(s => s.id === user.id);
    if (match) {
      Object.assign(match, {
        homeAddress: user.homeAddress,
        phone: user.phone,
        parentPhone: user.parentPhone,
        parentEmail: user.parentEmail,
        bloodGroup: user.bloodGroup,
        emergencyContactName: user.emergencyContactName,
        emergencyPhone: user.emergencyPhone
      });
    }

    // Persist in localStorage
    localStorage.setItem('PU_ERP_USER', JSON.stringify(user));

    closeStudentModal();

    if (typeof RealtimeEngine !== 'undefined' && RealtimeEngine.showToast) {
      RealtimeEngine.showToast({
        title: "Profile Synchronized",
        message: "Your permitted contact & address details have been saved to the Student Information System.",
        type: "success"
      });
    } else {
      alert('Profile updated successfully!');
    }

    // Refresh view
    const container = document.getElementById('portal-view-container');
    if (container) {
      render(container);
      switchTab('profile');
    }
  }

  function openRequestCorrectionModal(field) {
    openStudentModal('request-correction', field);
  }

  function submitCorrectionRequest(event) {
    if (event) event.preventDefault();
    const field = document.getElementById('corr-field-select')?.value || "Personal Details";

    closeStudentModal();

    const ticketNo = `TKT-REG-${Math.floor(1000 + Math.random() * 9000)}`;
    if (typeof RealtimeEngine !== 'undefined' && RealtimeEngine.showToast) {
      RealtimeEngine.showToast({
        title: "Correction Ticket Logged",
        message: `Petition to modify "${field}" registered with Registrar Office (#${ticketNo}). Status: Under Formal Review.`,
        type: "info"
      });
    } else {
      alert(`Petition registered for "${field}" (#${ticketNo})!`);
    }
  }

  function openUploadDocumentModal() {
    openStudentModal('upload-document');
  }

  function handleDocumentUpload(event) {
    if (event) event.preventDefault();
    const user = AuthEngine.getCurrentUser();
    if (!user) return;

    const title = document.getElementById('upload-doc-title')?.value || "Supporting Document";
    const type = document.getElementById('upload-doc-type')?.value || "Previous Transcript";
    const fileInput = document.getElementById('upload-doc-file');
    const fileName = fileInput?.files?.[0]?.name || `${title.replace(/\s+/g, '_')}_Uploaded.pdf`;

    const newDoc = {
      id: `DOC-PU-${Date.now().toString().slice(-4)}`,
      title: title,
      type: type,
      fileName: fileName,
      fileSize: "1.9 MB",
      uploadDate: new Date().toISOString().split('T')[0],
      uploadedBy: "Student Uploaded",
      status: "Under Registrar Verification",
      statusBadge: "badge-warning",
      icon: type === "Birth Certificate" ? "🪪" : (type === "Transfer Certificate" ? "🎓" : "📑")
    };

    if (!user.documents) user.documents = [];
    user.documents.unshift(newDoc);

    const match = PU_DATA.students.find(s => s.id === user.id);
    if (match) {
      if (!match.documents) match.documents = [];
      match.documents.unshift(newDoc);
    }

    localStorage.setItem('PU_ERP_USER', JSON.stringify(user));

    closeStudentModal();

    if (typeof RealtimeEngine !== 'undefined' && RealtimeEngine.showToast) {
      RealtimeEngine.showToast({
        title: "Document Uploaded",
        message: `"${title}" has been submitted and queued for Admissions Registrar attestation.`,
        type: "success"
      });
    } else {
      alert(`Document "${title}" uploaded successfully!`);
    }

    // Refresh view
    const container = document.getElementById('portal-view-container');
    if (container) {
      render(container);
      switchTab('profile');
    }
  }

  function viewDocument(docId) {
    const user = AuthEngine.getCurrentUser();
    const match = (PU_DATA.students && PU_DATA.students.find(s => s.id === user.id)) || user;
    const docs = (user.documents && user.documents.length) ? user.documents : (match.documents || []);
    const doc = docs.find(d => d.id === docId) || docs[0];
    if (!doc) return;

    const modal = document.getElementById('student-service-modal-overlay');
    const titleEl = document.getElementById('student-modal-title');
    const bodyEl = document.getElementById('student-modal-body');
    if (!modal || !titleEl || !bodyEl) return;

    titleEl.innerHTML = `📜 Official Document Preview: ${doc.title}`;
    bodyEl.innerHTML = `
      <div style="border: 2px solid var(--pu-maroon-primary); border-radius: 14px; padding: 24px; background: var(--bg-card); position: relative; overflow: hidden;">
        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-30deg); font-size: 52px; font-weight: 900; color: rgba(128, 0, 32, 0.05); white-space: nowrap; pointer-events: none;">
          PARUL UNIVERSITY VERIFIED
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid var(--pu-maroon-primary); padding-bottom: 14px; margin-bottom: 18px;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <img src="assets/parul_logo.jpg" alt="PU Crest" style="width: 44px; height: 44px; border-radius: 8px; object-fit: contain;">
            <div>
              <h3 style="margin: 0; color: var(--pu-maroon-primary); font-size: 17px; font-weight: 800;">PARUL UNIVERSITY</h3>
              <p style="margin: 2px 0 0 0; font-size: 11.5px; color: var(--text-muted);">Office of Academic Affairs & Admissions Registrar</p>
            </div>
          </div>
          <span class="badge ${doc.statusBadge || 'badge-success'}" style="font-size: 11.5px; padding: 6px 12px;">
            ${doc.status}
          </span>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; font-size: 13px;">
          <div>
            <div style="color: var(--text-muted); font-size: 11.5px;">Document Title</div>
            <div style="font-weight: 700;">${doc.title}</div>
          </div>
          <div>
            <div style="color: var(--text-muted); font-size: 11.5px;">Document Classification</div>
            <div style="font-weight: 700;">${doc.type}</div>
          </div>
          <div>
            <div style="color: var(--text-muted); font-size: 11.5px;">Candidate Name & ID</div>
            <div style="font-weight: 700;">${user.name} (${user.enrollmentNo})</div>
          </div>
          <div>
            <div style="color: var(--text-muted); font-size: 11.5px;">Uploaded By & Date</div>
            <div style="font-weight: 700;">${doc.uploadedBy} on ${doc.uploadDate}</div>
          </div>
          <div>
            <div style="color: var(--text-muted); font-size: 11.5px;">Digital File Reference</div>
            <div style="font-family: var(--font-mono); font-size: 12px;">${doc.fileName} (${doc.fileSize})</div>
          </div>
          <div>
            <div style="color: var(--text-muted); font-size: 11.5px;">Cryptographic Seal</div>
            <div style="font-family: var(--font-mono); font-size: 11px; color: var(--text-muted);">SHA-256: 8f4b...3c9a (Legally Attested)</div>
          </div>
        </div>

        <div style="padding: 16px; background: rgba(16, 185, 129, 0.08); border: 1px dashed rgba(16, 185, 129, 0.3); border-radius: 10px; margin-bottom: 20px; display: flex; align-items: center; justify-content: space-between;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <span style="font-size: 28px;">🔏</span>
            <div>
              <div style="font-weight: 700; font-size: 13px; color: #065F46;">Registrar Verification Seal & Legal Attestation</div>
              <div style="font-size: 11.5px; color: var(--text-secondary);">Attested by Dr. Ketan Kotecha, Chief Academic Administrator & Registrar</div>
            </div>
          </div>
          <div style="text-align: center; border: 1px solid var(--border-subtle); padding: 6px 10px; border-radius: 6px; background: white;">
            <div style="font-size: 16px;">📱</div>
            <div style="font-size: 9px; font-family: var(--font-mono); font-weight: 700;">QR VERIFIED</div>
          </div>
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 10px;">
          <button class="btn btn-secondary" onclick="StudentPortal.closeStudentModal()">Close Preview</button>
          <button class="btn btn-primary" onclick="StudentPortal.downloadDocument('${doc.id}')">⬇️ Download PDF Copy</button>
        </div>
      </div>
    `;

    modal.classList.add('active');
  }

  function downloadDocument(docId) {
    const user = AuthEngine.getCurrentUser();
    const match = (PU_DATA.students && PU_DATA.students.find(s => s.id === user.id)) || user;
    const docs = (user.documents && user.documents.length) ? user.documents : (match.documents || []);
    const doc = docs.find(d => d.id === docId) || docs[0];
    if (!doc) return;

    if (typeof RealtimeEngine !== 'undefined' && RealtimeEngine.showToast) {
      RealtimeEngine.showToast({
        title: "Download Initiated",
        message: `Securing authorized digital PDF copy of ${doc.title}...`,
        type: "info"
      });
    }
    window.alert(`Official Institutional Document Download:\n\nDocument: ${doc.title}\nCategory: ${doc.type}\nFile Name: ${doc.fileName}\nSize: ${doc.fileSize}\nIssued To: ${user.name} (${user.enrollmentNo})\nAttestation: Verified by Parul University Admissions Office`);
  }

  function togglePasswordVisibility() {
    const textEl = document.getElementById('profile-pwd-text');
    const btnEl = document.getElementById('profile-pwd-btn');
    if (!textEl || !btnEl) return;
    const user = AuthEngine.getCurrentUser();
    const pwd = user.password || "password123";
    if (textEl.innerText === '••••••••') {
      textEl.innerText = pwd;
      btnEl.innerText = '🔒 Hide';
    } else {
      textEl.innerText = '••••••••';
      btnEl.innerText = '👁️ Show';
    }
  }

  return {
    render,
    switchTab,
    handleOutpassSubmit,
    generateGradeCardPDF,
    downloadFeeReceipt,
    openStudentModal,
    closeStudentModal,
    submitCourseFeedback,
    submitStudentGrievance,
    openEditProfileModal,
    saveProfileUpdates,
    openRequestCorrectionModal,
    submitCorrectionRequest,
    openUploadDocumentModal,
    handleDocumentUpload,
    viewDocument,
    downloadDocument,
    togglePasswordVisibility
  };
})();
