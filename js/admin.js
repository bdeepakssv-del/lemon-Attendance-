/**
 * HotelLemon Attendance System — Admin Dashboard Logic
 */

const AdminPanel = {
  currentSection: 'dashboard',
  user: null,

  init() {
    this.user = App.requireAuth('admin');
    if (!this.user) return;

    this.renderHeader();
    this.setupNavigation();
    this.showSection('dashboard');
    this.updateClock();
  },

  renderHeader() {
    const nameEl = document.getElementById('admin-name');
    const dateEl = document.getElementById('current-date');
    if (nameEl) nameEl.textContent = this.user.name || 'Hotel Manager';
    if (dateEl) dateEl.textContent = new Date().toLocaleDateString('en-IN', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });
  },

  updateClock() {
    const clockEl = document.getElementById('live-clock');
    if (!clockEl) return;
    const update = () => {
      clockEl.textContent = new Date().toLocaleTimeString('en-IN', {
        hour: '2-digit', minute: '2-digit', second: '2-digit'
      });
    };
    update();
    setInterval(update, 1000);
  },

  setupNavigation() {
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const section = item.dataset.section;
        if (section) this.showSection(section);

        // Auto-close sidebar on mobile after clicking item
        const sidebar = document.getElementById('sidebar');
        const sidebarOverlay = document.getElementById('sidebar-overlay');
        if (sidebar) sidebar.classList.remove('open');
        if (sidebarOverlay) sidebarOverlay.classList.remove('active');
      });
    });

    // Logout
    const logoutBtn = document.getElementById('btn-logout');
    if (logoutBtn) logoutBtn.addEventListener('click', () => App.logout());
  },

  showSection(section) {
    this.currentSection = section;

    // Update nav active state
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    const active = document.querySelector(`.nav-item[data-section="${section}"]`);
    if (active) active.classList.add('active');

    // Update section title
    const titleEl = document.getElementById('section-title');
    const titles = {
      dashboard: window.I18n ? window.I18n.t('dashboardOverview') : 'Dashboard Overview',
      attendance: window.I18n ? window.I18n.t('attendance') : 'Attendance Records',
      staff: window.I18n ? window.I18n.t('staffManagement') : 'Staff Management',
      settings: window.I18n ? window.I18n.t('settings') : 'Settings'
    };
    if (titleEl) titleEl.textContent = titles[section] || section;

    // Hide all sections, show target
    document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
    const sectionEl = document.getElementById(`section-${section}`);
    if (sectionEl) sectionEl.classList.add('active');

    // Load section data
    switch (section) {
      case 'dashboard': this.loadDashboard(); break;
      case 'attendance': this.loadAttendance(); break;
      case 'staff': this.loadStaffList(); break;
      case 'settings': this.loadSettings(); break;
    }
  },

  // ── Dashboard ─────────────────────────────────────────────
  loadDashboard() {
    const stats = DB.getStats();

    // Animate stat cards
    const cards = {
      'stat-total': stats.totalStaff,
      'stat-present': stats.presentToday,
      'stat-absent': stats.absent,
      'stat-late': stats.late
    };

    Object.entries(cards).forEach(([id, value]) => {
      const el = document.getElementById(id);
      if (el) App.animateCounter(el, value);
    });

    // Render today's activity
    this.renderTodayActivity();
  },

  renderTodayActivity() {
    const container = document.getElementById('today-activity');
    if (!container) return;

    const records = DB.getTodayAttendance();
    if (records.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">📭</div>
          <p>No attendance records for today yet</p>
        </div>
      `;
      return;
    }

    container.innerHTML = records.map(r => `
      <div class="activity-item">
        <div class="activity-avatar" style="background: ${App.avatarColor(r.staffName)}">
          ${App.getInitials(r.staffName)}
        </div>
        <div class="activity-info">
          <strong>${r.staffName}</strong>
          <span class="activity-dept">${r.department}</span>
          <div style="margin-top:2px;">${window.LocationService ? LocationService.formatLocationBadge(r.checkInLocation || r.checkOutLocation) : ''}</div>
        </div>
        <div class="activity-times">
          <span class="time-in">📥 ${r.checkInTime || '-'}</span>
          <span class="time-out">📤 ${r.checkOutTime || '-'}</span>
        </div>
        ${App.statusBadge(r.status)}
      </div>
    `).join('');
  },

  // ── Attendance Records ────────────────────────────────────
  loadAttendance() {
    this.renderAttendanceTable();

    // Setup filters
    const dateFilter = document.getElementById('filter-date');
    const deptFilter = document.getElementById('filter-department');
    const searchFilter = document.getElementById('filter-search');
    const exportBtn = document.getElementById('btn-export');

    if (dateFilter) dateFilter.addEventListener('change', () => this.renderAttendanceTable());
    if (deptFilter) deptFilter.addEventListener('change', () => this.renderAttendanceTable());
    if (searchFilter) searchFilter.addEventListener('input', () => this.renderAttendanceTable());
    if (exportBtn) exportBtn.addEventListener('click', () => this.exportCSV());
  },

  renderAttendanceTable() {
    const tbody = document.getElementById('attendance-tbody');
    if (!tbody) return;

    let records = DB.getAttendance().sort((a, b) => new Date(b.checkIn) - new Date(a.checkIn));

    // Apply filters
    const dateVal = document.getElementById('filter-date')?.value;
    const deptVal = document.getElementById('filter-department')?.value;
    const searchVal = document.getElementById('filter-search')?.value?.toLowerCase();

    if (dateVal) records = records.filter(r => r.date === dateVal);
    if (deptVal) records = records.filter(r => r.department === deptVal);
    if (searchVal) records = records.filter(r =>
      r.staffName.toLowerCase().includes(searchVal) ||
      r.staffId.toLowerCase().includes(searchVal)
    );

    if (records.length === 0) {
      tbody.innerHTML = `
        <tr><td colspan="9" class="empty-cell">
          <div class="empty-state-small">📭 No records found</div>
        </td></tr>
      `;
      return;
    }

    tbody.innerHTML = records.map(r => `
      <tr>
        <td>${App.formatDate(r.date)}</td>
        <td><strong>${r.staffId}</strong></td>
        <td>
          <div class="staff-cell">
            <span class="mini-avatar" style="background: ${App.avatarColor(r.staffName)}">${App.getInitials(r.staffName)}</span>
            ${r.staffName}
          </div>
        </td>
        <td>${r.department}</td>
        <td>
          <div class="time-with-photo">
            ${App.photoThumb(r.checkInPhoto, 'Check-in photo')}
            <span>${r.checkInTime || '-'}</span>
          </div>
        </td>
        <td>
          <div class="time-with-photo">
            ${App.photoThumb(r.checkOutPhoto, 'Check-out photo')}
            <span>${r.checkOutTime || '-'}</span>
          </div>
        </td>
        <td>${window.LocationService ? LocationService.formatLocationBadge(r.checkInLocation || r.checkOutLocation) : '-'}</td>
        <td>${r.totalHours || '-'}</td>
        <td>${App.statusBadge(r.status)}</td>
      </tr>
    `).join('');
  },

  exportCSV() {
    const dateVal = document.getElementById('filter-date')?.value;
    const deptVal = document.getElementById('filter-department')?.value;

    DB.exportAttendanceCSV({
      startDate: dateVal || undefined,
      endDate: dateVal || undefined,
      department: deptVal || undefined
    });

    App.toast('Attendance data exported as CSV', 'success');
  },

  // ── Staff Management ──────────────────────────────────────
  loadStaffList() {
    this.renderStaffGrid();

    const addBtn = document.getElementById('btn-add-staff');
    if (addBtn) addBtn.addEventListener('click', () => this.showStaffForm());
  },

  renderStaffGrid() {
    const container = document.getElementById('staff-grid');
    if (!container) return;

    const staff = DB.getStaff().filter(s => s.status === 'active');
    const settings = DB.getSettings();

    container.innerHTML = staff.map(s => {
      const todayRecord = DB.getStaffTodayRecord(s.id);
      const statusClass = todayRecord ? (todayRecord.checkOut ? 'checked-out' : 'checked-in') : 'absent';
      const statusLabel = todayRecord ? (todayRecord.checkOut ? 'Checked Out' : 'Checked In') : 'Not Present';
      const shiftStart = s.shiftStart || settings.shiftStart || '09:00';
      const shiftEnd = s.shiftEnd || settings.shiftEnd || '17:00';

      return `
        <div class="staff-card">
          <div class="staff-card-header">
            <div class="staff-avatar" style="background: ${App.avatarColor(s.name)}">
              ${App.getInitials(s.name)}
            </div>
            <div class="staff-presence ${statusClass}"></div>
          </div>
          <div class="staff-card-body">
            <h3>${s.name}</h3>
            <p class="staff-id">🪪 ID: <strong>${s.id}</strong></p>
            <p class="staff-dept">${s.department} — ${s.position}</p>

            <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border-light); padding:8px 12px; border-radius:var(--r-md); margin:8px 0; font-size:0.78rem;">
              <div style="color:var(--text-muted); font-size:0.7rem; text-transform:uppercase; font-weight:700;">🔐 Login Credentials</div>
              <div>User ID: <strong style="color:var(--gold); font-family:var(--font-mono);">${s.id}</strong></div>
              <div>Password: <strong style="color:var(--green); font-family:var(--font-mono);">${s.password || 'lemon123'}</strong></div>
            </div>

            <div style="margin: 8px 0;">
              <span class="shift-badge">⏰ ${shiftStart} – ${shiftEnd}</span>
            </div>
            <span class="presence-label ${statusClass}">${statusLabel}</span>
          </div>
          <div class="staff-card-footer">
            <button class="btn btn-sm btn-outline" onclick="AdminPanel.editStaff('${s.id}')">✏️ Edit Credentials</button>
            <button class="btn btn-sm btn-danger-outline" onclick="AdminPanel.removeStaff('${s.id}', '${s.name}')">🗑️ Remove</button>
          </div>
        </div>
      `;
    }).join('');
  },

  showStaffForm(staffData = null) {
    const isEdit = !!staffData;
    const settings = DB.getSettings();

    const overlay = document.createElement('div');
    overlay.className = 'confirm-overlay';
    overlay.innerHTML = `
      <div class="staff-form-modal">
        <h2>${isEdit ? '✏️ Edit Staff & Credentials' : '➕ Add New Staff'}</h2>
        <form id="staff-form">
          <div class="form-group">
            <label>Full Name</label>
            <input type="text" id="sf-name" placeholder="e.g. Rahul Sharma" value="${staffData?.name || ''}" required />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Department</label>
              <select id="sf-department" required>
                <option value="">Select</option>
                <option value="Front Desk" ${staffData?.department === 'Front Desk' ? 'selected' : ''}>Front Desk</option>
                <option value="Housekeeping" ${staffData?.department === 'Housekeeping' ? 'selected' : ''}>Housekeeping</option>
                <option value="Kitchen" ${staffData?.department === 'Kitchen' ? 'selected' : ''}>Kitchen</option>
                <option value="Security" ${staffData?.department === 'Security' ? 'selected' : ''}>Security</option>
                <option value="Maintenance" ${staffData?.department === 'Maintenance' ? 'selected' : ''}>Maintenance</option>
                <option value="Management" ${staffData?.department === 'Management' ? 'selected' : ''}>Management</option>
              </select>
            </div>
            <div class="form-group">
              <label>Position</label>
              <input type="text" id="sf-position" placeholder="e.g. Receptionist" value="${staffData?.position || ''}" required />
            </div>
          </div>

          <!-- Staff Login Credentials Block -->
          <div class="form-row" style="background:rgba(52,211,153,0.04); padding:12px; border-radius:var(--r-md); border:1px solid rgba(52,211,153,0.2); margin-bottom:14px;">
            <div class="form-group" style="margin-bottom:0;">
              <label>Login Username (Employee ID)</label>
              <input type="text" id="sf-empid" value="${staffData?.id || ''}" placeholder="Auto-generated if empty" ${isEdit ? 'readonly style="opacity:0.75; cursor:not-allowed;"' : ''} />
            </div>
            <div class="form-group" style="margin-bottom:0;">
              <label>Login Password</label>
              <input type="text" id="sf-password" value="${staffData?.password || 'lemon123'}" placeholder="Set login password" required />
            </div>
          </div>

          <!-- Shift Configuration -->
          <div class="form-row" style="background:rgba(240,192,64,0.04); padding:12px; border-radius:var(--r-md); border:1px solid rgba(240,192,64,0.15); margin-bottom:14px;">
            <div class="form-group" style="margin-bottom:0;">
              <label>Shift Start Time</label>
              <input type="time" id="sf-shift-start" value="${staffData?.shiftStart || settings.shiftStart || '09:00'}" required />
            </div>
            <div class="form-group" style="margin-bottom:0;">
              <label>Shift End Time</label>
              <input type="time" id="sf-shift-end" value="${staffData?.shiftEnd || settings.shiftEnd || '17:00'}" required />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Phone</label>
              <input type="tel" id="sf-phone" placeholder="+91 98765 43210" value="${staffData?.phone || ''}" />
            </div>
            <div class="form-group">
              <label>Email</label>
              <input type="email" id="sf-email" placeholder="name@hotellemon.com" value="${staffData?.email || ''}" />
            </div>
          </div>

          <div class="form-actions">
            <button type="button" class="btn btn-outline" id="sf-cancel">Cancel</button>
            <button type="submit" class="btn btn-primary">${isEdit ? 'Save Changes' : 'Add Staff'}</button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add('active'));

    document.getElementById('sf-cancel').addEventListener('click', () => {
      overlay.classList.remove('active');
      setTimeout(() => overlay.remove(), 300);
    });

    document.getElementById('staff-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const data = {
        name: document.getElementById('sf-name').value,
        department: document.getElementById('sf-department').value,
        position: document.getElementById('sf-position').value,
        phone: document.getElementById('sf-phone').value,
        email: document.getElementById('sf-email').value,
        shiftStart: document.getElementById('sf-shift-start').value,
        shiftEnd: document.getElementById('sf-shift-end').value,
        password: document.getElementById('sf-password').value.trim() || 'lemon123'
      };

      if (isEdit) {
        DB.updateStaff(staffData.id, data);
        App.toast(`${data.name} updated successfully`, 'success');
      } else {
        const customId = document.getElementById('sf-empid')?.value?.trim();
        if (customId) data.id = customId.toUpperCase();
        const newStaff = DB.addStaff(data);
        App.toast(`${data.name} added as ${newStaff.id} (Password: ${newStaff.password})`, 'success');
      }

      overlay.classList.remove('active');
      setTimeout(() => overlay.remove(), 300);
      this.renderStaffGrid();
    });
  },

  editStaff(id) {
    const staff = DB.getStaffById(id);
    if (staff) this.showStaffForm(staff);
  },

  removeStaff(id, name) {
    App.confirm(`Remove <strong>${name}</strong> from staff?<br>This action cannot be undone.`, () => {
      DB.deleteStaff(id);
      App.toast(`${name} has been removed`, 'warning');
      this.renderStaffGrid();
    });
  },

  // ── Settings & Shift Management ──────────────────────────
  loadSettings() {
    const settings = DB.getSettings();

    // Populate policy inputs
    const startInput = document.getElementById('setting-shift-start');
    const endInput = document.getElementById('setting-shift-end');
    const graceInput = document.getElementById('setting-grace-period');
    const nameInput = document.getElementById('setting-hotel-name');

    if (startInput) startInput.value = settings.shiftStart || '09:00';
    if (endInput) endInput.value = settings.shiftEnd || '17:00';
    if (graceInput) graceInput.value = settings.gracePeriod || 15;
    if (nameInput) nameInput.value = settings.hotelName || 'HotelLemon';

    this.updatePolicySummaryText();

    // Admin credentials form listener
    const credsForm = document.getElementById('admin-credentials-form');
    if (credsForm) {
      const uInput = document.getElementById('setting-admin-username');
      const pInput = document.getElementById('setting-admin-password');
      const admin = DB.getCurrentUser() || DB.defaults.admin;
      if (uInput) uInput.value = admin.username || 'manager';

      credsForm.onsubmit = (e) => {
        e.preventDefault();
        const newU = uInput ? uInput.value.trim() : 'manager';
        const newP = pInput ? pInput.value.trim() : '';
        if (newU && newP) {
          DB.updateAdminCredentials(newU, newP);
          App.toast('🔑 Admin username and password updated!', 'success');
          pInput.value = '';
        } else {
          App.toast('Please provide a valid username and password', 'error');
        }
      };
    }

    // Policy form submit listener
    const policyForm = document.getElementById('shift-policy-form');
    if (policyForm) {
      policyForm.onsubmit = (e) => {
        e.preventDefault();
        const updated = DB.saveSettings({
          shiftStart: startInput.value,
          shiftEnd: endInput.value,
          gracePeriod: parseInt(graceInput.value) || 15,
          hotelName: nameInput ? nameInput.value : 'HotelLemon'
        });
        this.updatePolicySummaryText();
        App.toast('⏰ Global shift policy saved successfully!', 'success');
      };
    }

    // Render individual staff shift table
    this.renderStaffShiftTable();

    // Reset Data Handler
    const resetBtn = document.getElementById('btn-reset-data');
    if (resetBtn) {
      resetBtn.onclick = () => {
        App.confirm('Reset all data to defaults?<br>All attendance records and staff changes will be lost.', () => {
          DB.resetAll();
          App.toast('All data has been reset', 'warning');
          this.showSection('dashboard');
        });
      };
    }
  },

  updatePolicySummaryText() {
    const settings = DB.getSettings();
    const startInput = settings.shiftStart || '09:00';
    const graceMinutes = parseInt(settings.gracePeriod || 15);

    const [sH, sM] = startInput.split(':').map(Number);
    const startMins = sH * 60 + sM;
    const graceMins = startMins + graceMinutes;

    const formatMins = (mins) => {
      const h = Math.floor(mins / 60) % 24;
      const m = mins % 60;
      const ampm = h >= 12 ? 'PM' : 'AM';
      const h12 = h % 12 || 12;
      return `${String(h12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${ampm}`;
    };

    const startTimeFormatted = formatMins(startMins);
    const graceTimeFormatted = formatMins(graceMins);

    const sStart = document.getElementById('summary-start');
    const sGrace = document.getElementById('summary-grace');
    const sLate = document.getElementById('summary-late');

    if (sStart) sStart.textContent = startTimeFormatted;
    if (sGrace) sGrace.textContent = `${startTimeFormatted}–${graceTimeFormatted}`;
    if (sLate) sLate.textContent = graceTimeFormatted;
  },

  renderStaffShiftTable() {
    const tbody = document.getElementById('staff-shift-tbody');
    if (!tbody) return;

    const staffList = DB.getStaff().filter(s => s.status === 'active');
    const settings = DB.getSettings();

    if (staffList.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="empty-cell">No staff members found</td></tr>`;
      return;
    }

    tbody.innerHTML = staffList.map(s => {
      const sStart = s.shiftStart || settings.shiftStart || '09:00';
      const sEnd = s.shiftEnd || settings.shiftEnd || '17:00';
      const sType = s.shiftType || 'general';

      return `
        <tr>
          <td>
            <div class="staff-cell">
              <span class="mini-avatar" style="background: ${App.avatarColor(s.name)}">${App.getInitials(s.name)}</span>
              <div>
                <strong>${s.name}</strong>
                <div style="font-size:0.75rem; color:var(--gold); font-family:var(--font-mono);">${s.id}</div>
              </div>
            </div>
          </td>
          <td>${s.department}</td>
          <td>
            <select onchange="AdminPanel.onShiftPresetChange('${s.id}', this.value)">
              <option value="general" ${sType === 'general' ? 'selected' : ''}>☀️ General (09:00 - 17:00)</option>
              <option value="morning" ${sType === 'morning' ? 'selected' : ''}>🌅 Morning (07:00 - 15:00)</option>
              <option value="evening" ${sType === 'evening' ? 'selected' : ''}>🌇 Evening (14:00 - 22:00)</option>
              <option value="night" ${sType === 'night' ? 'selected' : ''}>🌙 Night (22:00 - 06:00)</option>
              <option value="custom" ${sType === 'custom' ? 'selected' : ''}>⚙️ Custom Timing</option>
            </select>
          </td>
          <td>
            <input type="time" id="shift-start-${s.id}" value="${sStart}" style="padding:4px 8px; border-radius:4px; border:1px solid var(--border);" onchange="AdminPanel.updateStaffShiftTimes('${s.id}')">
          </td>
          <td>
            <input type="time" id="shift-end-${s.id}" value="${sEnd}" style="padding:4px 8px; border-radius:4px; border:1px solid var(--border);" onchange="AdminPanel.updateStaffShiftTimes('${s.id}')">
          </td>
          <td>
            <button class="btn btn-sm btn-primary" onclick="AdminPanel.updateStaffShiftTimes('${s.id}', true)">💾 Save</button>
          </td>
        </tr>
      `;
    }).join('');
  },

  onShiftPresetChange(staffId, preset) {
    const startEl = document.getElementById(`shift-start-${staffId}`);
    const endEl = document.getElementById(`shift-end-${staffId}`);

    const presets = {
      general: { start: '09:00', end: '17:00' },
      morning: { start: '07:00', end: '15:00' },
      evening: { start: '14:00', end: '22:00' },
      night: { start: '22:00', end: '06:00' }
    };

    if (presets[preset]) {
      if (startEl) startEl.value = presets[preset].start;
      if (endEl) endEl.value = presets[preset].end;
      DB.updateStaff(staffId, {
        shiftType: preset,
        shiftStart: presets[preset].start,
        shiftEnd: presets[preset].end
      });
      App.toast(`Shift updated to ${preset.toUpperCase()} for ${staffId}`, 'success');
      this.renderStaffGrid();
    }
  },

  updateStaffShiftTimes(staffId, showToast = false) {
    const startEl = document.getElementById(`shift-start-${staffId}`);
    const endEl = document.getElementById(`shift-end-${staffId}`);

    if (startEl && endEl) {
      DB.updateStaff(staffId, {
        shiftType: 'custom',
        shiftStart: startEl.value,
        shiftEnd: endEl.value
      });
      if (showToast) {
        App.toast(`Shift timing saved (${startEl.value} – ${endEl.value}) for ${staffId}`, 'success');
      }
      this.renderStaffGrid();
    }
  }
};

// Initialize on load
document.addEventListener('DOMContentLoaded', () => AdminPanel.init());

window.addEventListener('languageChanged', () => {
  if (typeof AdminPanel !== 'undefined' && AdminPanel.user) {
    AdminPanel.showSection(AdminPanel.currentSection);
  }
});

