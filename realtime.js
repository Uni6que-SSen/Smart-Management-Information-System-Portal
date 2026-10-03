/**
 * PARUL UNIVERSITY ERP - DYNAMIC REAL-TIME DATA SYNC ENGINE
 * Dual-Channel Sync: WebSockets + BroadcastChannel for seamless multi-tab & multi-client sync.
 * Includes Web Audio API chime synthesis and reactive event dispatchers.
 */

const RealtimeEngine = (function() {
  const CHANNEL_NAME = 'PU_ERP_REALTIME_BUS';
  let broadcastChannel = null;
  let webSocket = null;
  let audioCtx = null;

  /**
   * Initializes the real-time synchronization channels
   */
  function init() {
    // 1. Initialize BroadcastChannel for cross-tab instant messaging
    if ('BroadcastChannel' in window) {
      broadcastChannel = new BroadcastChannel(CHANNEL_NAME);
      broadcastChannel.onmessage = handleIncomingMessage;
    }

    // 2. Fallback / supplementary storage event for older browsers
    window.addEventListener('storage', (e) => {
      if (e.key === 'PU_ERP_EVENT_TRIGGER' && e.newValue) {
        try {
          const payload = JSON.parse(e.newValue);
          handleEvent(payload);
        } catch (err) {
          console.error('Error handling storage event:', err);
        }
      }
    });

    // 3. Connect to backend WebSocket if available
    connectWebSocket();
  }

  /**
   * Connect to WebSocket server on current host
   */
  function connectWebSocket() {
    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host || 'localhost:3000'}`;
      webSocket = new WebSocket(wsUrl);

      webSocket.onopen = () => {
        console.log('[RealtimeEngine] WebSocket connected to Parul University ERP Gateway');
        updateSyncStatusUI(true);
      };

      webSocket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          handleEvent(data);
        } catch (e) {
          console.warn('Non-JSON WebSocket message received:', event.data);
        }
      };

      webSocket.onclose = () => {
        updateSyncStatusUI(false);
        // Retry connection after 5 seconds
        setTimeout(connectWebSocket, 5000);
      };

      webSocket.onerror = () => {
        updateSyncStatusUI(false);
      };
    } catch (e) {
      console.warn('[RealtimeEngine] WebSocket initialization skipped, using BroadcastChannel bus.');
      updateSyncStatusUI(true); // BroadcastChannel remains active
    }
  }

  /**
   * Updates the sync status dot in the header
   */
  function updateSyncStatusUI(isConnected) {
    const dot = document.querySelector('.sync-status-indicator');
    if (dot) {
      dot.innerHTML = isConnected 
        ? `<span class="sync-dot"></span> <span>Live Sync Connected</span>`
        : `<span class="sync-dot" style="background: #F59E0B; animation: none;"></span> <span>Local Sync Active</span>`;
    }
  }

  /**
   * Handles messages received from BroadcastChannel
   */
  function handleIncomingMessage(event) {
    if (event && event.data) {
      handleEvent(event.data);
    }
  }

  /**
   * Plays a pleasant synthesized educational chime using Web Audio API
   */
  function playAlertChime() {
    try {
      if (!audioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) audioCtx = new AudioContextClass();
      }
      if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      if (!audioCtx) return;

      const now = audioCtx.currentTime;
      // Arpeggio chime: C5 (523Hz) -> E5 (659Hz) -> G5 (784Hz)
      [523.25, 659.25, 783.99].forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.15, now + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.35);
      });
    } catch (e) {
      // Audio context may be restricted before user interaction
    }
  }

  /**
   * Broadcasts an event to all portals/tabs & server
   */
  function broadcastEvent(type, payload) {
    const eventObject = {
      type,
      payload,
      timestamp: new Date().toISOString(),
      senderRole: AuthEngine.getCurrentUser() ? AuthEngine.getCurrentUser().role : 'SYSTEM',
      senderName: AuthEngine.getCurrentUser() ? AuthEngine.getCurrentUser().name : 'System Gateway'
    };

    // Broadcast across tabs
    if (broadcastChannel) {
      broadcastChannel.postMessage(eventObject);
    }

    // Trigger storage event fallback
    localStorage.setItem('PU_ERP_EVENT_TRIGGER', JSON.stringify({ ...eventObject, _rand: Math.random() }));

    // Send over WebSocket if open
    if (webSocket && webSocket.readyState === WebSocket.OPEN) {
      webSocket.send(JSON.stringify(eventObject));
    }

    // Process locally in current tab as well
    handleEvent(eventObject, true);
  }

  /**
   * Central Event Router for Real-time Actions
   */
  function handleEvent(eventData, isLocalBroadcast = false) {
    if (!eventData || !eventData.type) return;

    const currentUser = AuthEngine.getCurrentUser();
    const { type, payload, senderRole, senderName } = eventData;

    switch (type) {
      case 'ATTENDANCE_UPDATED':
        // Update data store
        if (payload.courseCode && PU_DATA.attendanceStats[payload.courseCode]) {
          PU_DATA.attendanceStats[payload.courseCode].held += 1;
          if (payload.isPresent) {
            PU_DATA.attendanceStats[payload.courseCode].attended += 1;
          }
        }

        // Notify student if logged in
        if (currentUser && currentUser.role === 'STUDENT' && !isLocalBroadcast) {
          playAlertChime();
          showToast({
            title: `Attendance Updated`,
            message: `${senderName} marked you ${payload.isPresent ? 'PRESENT' : 'ABSENT'} for ${payload.courseCode} (${payload.slot || 'Current Slot'}).`,
            type: payload.isPresent ? 'success' : 'warning'
          });
          // Re-render student attendance view dynamically
          if (window.StudentPortal) StudentPortal.refreshAttendance();
        }
        break;

      case 'OUTPASS_STATUS_CHANGED':
        // Update outpass object
        const outpass = PU_DATA.outpasses.find(o => o.id === payload.outpassId);
        if (outpass) {
          outpass.status = payload.newStatus;
          outpass.approvedBy = senderName;
          outpass.approvedAt = new Date().toLocaleString();
          if (payload.newStatus === 'APPROVED') {
            outpass.qrToken = `PU-GP-VERIFIED-${outpass.id.slice(-4)}-VALID`;
          }
        }

        // Notify student
        if (currentUser && currentUser.role === 'STUDENT') {
          playAlertChime();
          showToast({
            title: `Outpass Request ${payload.newStatus}`,
            message: `Your Outpass (${payload.outpassId}) has been ${payload.newStatus.toLowerCase()} by ${senderName}.`,
            type: payload.newStatus === 'APPROVED' ? 'success' : 'danger'
          });
          if (window.StudentPortal) StudentPortal.refreshOutpassView();
        }
        break;

      case 'EXAM_RESULTS_PUBLISHED':
        PU_DATA.grades.isPublished = true;
        PU_DATA.grades.publishedAt = new Date().toISOString();

        if (currentUser && currentUser.role === 'STUDENT') {
          playAlertChime();
          showToast({
            title: `Official Grade Card Published!`,
            message: `The Registrar's Office has published the official Semester 6 Examination Results. Your SGPA is ${PU_DATA.grades.summary.sgpa}.`,
            type: 'info'
          });
          if (window.StudentPortal) StudentPortal.refreshGradesView();
        }
        break;

      case 'AUDIT_LOG_ADDED':
        PU_DATA.auditLogs.unshift(payload);
        if (window.AdminPortal) AdminPortal.prependAuditLogRow(payload);
        break;
    }
  }

  /**
   * Log an event into the System Audit Trail and broadcast it
   */
  function logAuditEvent({ actor, role, action, resource, status = 'SUCCESS' }) {
    const newLog = {
      id: "LOG-" + (1100 + PU_DATA.auditLogs.length),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actor: actor || 'System Gateway',
      role: role || 'SYSTEM',
      action: action,
      resource: resource,
      ip: '192.168.' + Math.floor(Math.random() * 20 + 1) + '.' + Math.floor(Math.random() * 200 + 1),
      status: status
    };

    broadcastEvent('AUDIT_LOG_ADDED', newLog);
  }

  /**
   * Shows a sleek toast notification on the bottom-right corner
   */
  function showToast({ title, message, type = 'info', duration = 5000 }) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let icon = '🔔';
    if (type === 'success') icon = '✅';
    if (type === 'warning') icon = '⚠️';
    if (type === 'danger') icon = '❌';

    toast.innerHTML = `
      <div style="font-size: 20px;">${icon}</div>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        <div class="toast-message">${message}</div>
      </div>
      <button class="toast-close">&times;</button>
    `;

    toast.querySelector('.toast-close').onclick = () => {
      toast.remove();
    };

    container.appendChild(toast);

    setTimeout(() => {
      if (toast.parentElement) {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        toast.style.transition = 'all 300ms ease';
        setTimeout(() => toast.remove(), 300);
      }
    }, duration);
  }

  return {
    init,
    broadcastEvent,
    logAuditEvent,
    showToast,
    playAlertChime
  };
})();
