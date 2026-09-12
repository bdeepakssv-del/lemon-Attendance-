/**
 * HotelLemon Attendance System — App Core
 * Authentication helpers, toast notifications, routing
 */

const App = {
  /**
   * Show a toast notification
   */
  toast(message, type = 'success', duration = 3000) {
    const existing = document.querySelector('.toast-container');
    const container = existing || document.createElement('div');
    if (!existing) {
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
    toast.innerHTML = `
      <span class="toast-icon">${icons[type] || '🍋'}</span>
      <span class="toast-message">${message}</span>
    `;

    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        toast.remove();
        if (container.children.length === 0) container.remove();
      }, 300);
    }, duration);
  },

  /**
   * Check if user is authenticated and redirect if not
   */
  requireAuth(role) {
    const user = DB.getCurrentUser();
    if (!user) {
      window.location.href = 'index.html';
      return null;
    }
    if (role && user.role !== role) {
      window.location.href = user.role === 'admin' ? 'admin.html' : 'staff.html';
      return null;
    }
    return user;
  },

  /**
   * Logout current user
   */
  logout() {
    DB.logout();
    window.location.href = 'index.html';
  },

  /**
   * Format date for display
   */
  formatDate(dateStr) {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  },

  /**
   * Format time for display
   */
  formatTime(isoStr) {
    if (!isoStr) return '-';
    return new Date(isoStr).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  },

  /**
   * Get status badge HTML
   */
  statusBadge(status) {
    const labels = {
      'on-time': 'On Time',
      'early': 'Early',
      'late': 'Late',
      'absent': 'Absent'
    };
    return `<span class="badge badge-${status}">${labels[status] || status}</span>`;
  },

  /**
   * Create confirmation modal
   */
  confirm(message, onConfirm) {
    const overlay = document.createElement('div');
    overlay.className = 'confirm-overlay';
    overlay.innerHTML = `
      <div class="confirm-modal">
        <div class="confirm-icon">⚠️</div>
        <p class="confirm-message">${message}</p>
        <div class="confirm-actions">
          <button class="btn btn-outline" id="confirm-cancel">Cancel</button>
          <button class="btn btn-danger" id="confirm-ok">Confirm</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add('active'));

    document.getElementById('confirm-cancel').addEventListener('click', () => {
      overlay.classList.remove('active');
      setTimeout(() => overlay.remove(), 300);
    });

    document.getElementById('confirm-ok').addEventListener('click', () => {
      overlay.classList.remove('active');
      setTimeout(() => overlay.remove(), 300);
      if (onConfirm) onConfirm();
    });
  },

  /**
   * Get initials from a name
   */
  getInitials(name) {
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  },

  /**
   * Generate a random pastel color for avatar
   */
  avatarColor(name) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const h = hash % 360;
    return `hsl(${h}, 60%, 45%)`;
  },

  /**
   * Create photo thumbnail that expands on click
   */
  photoThumb(photoData, alt = 'Photo') {
    if (!photoData) return '<span class="no-photo">—</span>';
    return `<img src="${photoData}" alt="${alt}" class="photo-thumb" onclick="App.viewPhoto(this.src)" />`;
  },

  /**
   * View full size photo in overlay
   */
  viewPhoto(src) {
    const overlay = document.createElement('div');
    overlay.className = 'photo-overlay';
    overlay.innerHTML = `
      <div class="photo-viewer">
        <img src="${src}" alt="Full size photo" />
        <button class="photo-close" onclick="this.closest('.photo-overlay').remove()">✕</button>
      </div>
    `;
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.remove();
    });
    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add('active'));
  },

  /**
   * Animate counter from 0 to target
   */
  animateCounter(el, target, duration = 800) {
    let start = 0;
    const startTime = performance.now();

    function step(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
};
