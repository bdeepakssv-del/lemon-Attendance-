/**
 * HotelLemon Attendance System — Staff Portal Logic
 */

const StaffPortal = {
  user: null,

  init() {
    this.user = App.requireAuth('staff');
    if (!this.user) return;

    this.renderProfile();
    this.updateAttendanceStatus();
    this.loadHistory();
    this.setupActions();
    this.updateClock();
  },

  renderProfile() {
    const nameEl = document.getElementById('staff-name');
    const idEl = document.getElementById('staff-id');
    const deptEl = document.getElementById('staff-dept');
    const posEl = document.getElementById('staff-position');
    const avatarEl = document.getElementById('staff-avatar');
    const greetEl = document.getElementById('greeting');

    if (nameEl) nameEl.textContent = this.user.name;
    if (idEl) idEl.textContent = this.user.id;
    if (deptEl) deptEl.textContent = this.user.department;
    if (posEl) posEl.textContent = this.user.position;
    if (avatarEl) {
      avatarEl.style.background = App.avatarColor(this.user.name);
      avatarEl.textContent = App.getInitials(this.user.name);
    }
    if (greetEl) {
      const hour = new Date().getHours();
      let key = 'goodEvening';
      if (hour < 12) key = 'goodMorning';
      else if (hour < 17) key = 'goodAfternoon';
      const greetingStr = window.I18n ? window.I18n.t(key) : (hour < 12 ? 'Good Morning!' : hour < 17 ? 'Good Afternoon!' : 'Good Evening!');
      greetEl.textContent = `${greetingStr} ${this.user.name.split(' ')[0]}! 🍋`;
    }
  },

  updateClock() {
    const clockEl = document.getElementById('live-clock');
    const dateEl = document.getElementById('current-date');
    if (dateEl) dateEl.textContent = new Date().toLocaleDateString('en-IN', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });

    const update = () => {
      if (clockEl) clockEl.textContent = new Date().toLocaleTimeString('en-IN', {
        hour: '2-digit', minute: '2-digit', second: '2-digit'
      });
    };
    update();
    setInterval(update, 1000);
  },

  updateAttendanceStatus() {
    const record = DB.getStaffTodayRecord(this.user.id);
    const statusEl = document.getElementById('attendance-status');
    const checkinBtn = document.getElementById('btn-checkin');
    const checkoutBtn = document.getElementById('btn-checkout');
    const statusCard = document.getElementById('today-status-card');

    if (!record) {
      if (statusEl) statusEl.innerHTML = `
        <div class="status-icon status-absent">⏳</div>
        <div class="status-text">
          <strong>Not Checked In</strong>
          <p>Tap the button below to check in with a live photo</p>
        </div>
      `;
      if (checkinBtn) { checkinBtn.style.display = 'flex'; checkinBtn.disabled = false; }
      if (checkoutBtn) { checkoutBtn.style.display = 'none'; }

    } else if (!record.checkOut) {
      if (statusEl) statusEl.innerHTML = `
        <div class="status-icon status-present">✅</div>
        <div class="status-text">
          <strong>Checked In</strong>
          <p>Check-in at <strong>${record.checkInTime}</strong> ${App.statusBadge(record.status)}</p>
          <div style="margin-top:4px;">${window.LocationService ? LocationService.formatLocationBadge(record.checkInLocation) : ''}</div>
        </div>
      `;
      if (checkinBtn) { checkinBtn.style.display = 'none'; }
      if (checkoutBtn) { checkoutBtn.style.display = 'flex'; checkoutBtn.disabled = false; }

      if (statusCard && record.checkInPhoto) {
        const photoEl = document.getElementById('checkin-photo-preview');
        if (photoEl) {
          photoEl.innerHTML = `
            <img src="${record.checkInPhoto}" alt="Check-in photo" class="status-photo" onclick="App.viewPhoto(this.src)" />
          `;
        }
      }

    } else {
      if (statusEl) statusEl.innerHTML = `
        <div class="status-icon status-done">🏁</div>
        <div class="status-text">
          <strong>Day Complete</strong>
          <p>In: <strong>${record.checkInTime}</strong> • Out: <strong>${record.checkOutTime}</strong> • Total: <strong>${record.totalHours}</strong></p>
          <div style="margin-top:4px;">${window.LocationService ? LocationService.formatLocationBadge(record.checkInLocation || record.checkOutLocation) : ''}</div>
        </div>
      `;
      if (checkinBtn) { checkinBtn.style.display = 'none'; }
      if (checkoutBtn) { checkoutBtn.style.display = 'none'; }

      if (statusCard) {
        const photoEl = document.getElementById('checkin-photo-preview');
        if (photoEl) {
          photoEl.innerHTML = `
            <div class="status-photos-row">
              ${record.checkInPhoto ? `<div class="status-photo-item"><small>Check In</small><img src="${record.checkInPhoto}" alt="Check-in" onclick="App.viewPhoto(this.src)" /></div>` : ''}
              ${record.checkOutPhoto ? `<div class="status-photo-item"><small>Check Out</small><img src="${record.checkOutPhoto}" alt="Check-out" onclick="App.viewPhoto(this.src)" /></div>` : ''}
            </div>
          `;
        }
      }
    }
  },

  setupActions() {
    const checkinBtn = document.getElementById('btn-checkin');
    const checkoutBtn = document.getElementById('btn-checkout');
    const logoutBtn = document.getElementById('btn-logout');

    if (checkinBtn) {
      checkinBtn.addEventListener('click', () => {
        Camera.open('checkin', (photoData, locationData) => {
          const result = DB.checkIn(this.user.id, photoData, locationData);
          if (result.error) {
            App.toast(result.error, 'error');
          } else {
            App.toast('✅ Checked in successfully!', 'success');
            this.updateAttendanceStatus();
            this.loadHistory();
          }
        });
      });
    }

    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        Camera.open('checkout', (photoData, locationData) => {
          const result = DB.checkOut(this.user.id, photoData, locationData);
          if (result.error) {
            App.toast(result.error, 'error');
          } else {
            App.toast('📤 Checked out! Total: ' + result.totalHours, 'success');
            this.updateAttendanceStatus();
            this.loadHistory();
          }
        });
      });
    }

    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => App.logout());
    }
  },

  loadHistory() {
    const tbody = document.getElementById('history-tbody');
    if (!tbody) return;

    const records = DB.getAttendanceByStaff(this.user.id).sort((a, b) => new Date(b.checkIn) - new Date(a.checkIn));

    if (records.length === 0) {
      tbody.innerHTML = `
        <tr><td colspan="6" class="empty-cell">
          <div class="empty-state-small">📭 No attendance history yet</div>
        </td></tr>
      `;
      return;
    }

    tbody.innerHTML = records.map(r => `
      <tr>
        <td>${App.formatDate(r.date)}</td>
        <td>
          <div class="time-with-photo">
            ${App.photoThumb(r.checkInPhoto, 'Check-in')}
            <span>${r.checkInTime || '-'}</span>
          </div>
        </td>
        <td>
          <div class="time-with-photo">
            ${App.photoThumb(r.checkOutPhoto, 'Check-out')}
            <span>${r.checkOutTime || '-'}</span>
          </div>
        </td>
        <td>${window.LocationService ? LocationService.formatLocationBadge(r.checkInLocation || r.checkOutLocation) : '-'}</td>
        <td>${r.totalHours || '-'}</td>
        <td>${App.statusBadge(r.status)}</td>
      </tr>
    `).join('');
  }
};

document.addEventListener('DOMContentLoaded', () => StaffPortal.init());

window.addEventListener('languageChanged', () => {
  if (typeof StaffPortal !== 'undefined' && StaffPortal.user) {
    StaffPortal.renderProfile();
    StaffPortal.updateAttendanceStatus();
    StaffPortal.loadHistory();
  }
});

