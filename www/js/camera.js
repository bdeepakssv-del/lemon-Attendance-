/**
 * HotelLemon Attendance System — Camera Module
 * Hybrid Camera handler: Supports Capacitor Native Camera Plugin and Browser getUserMedia with Fallback
 */

const Camera = {
  stream: null,
  videoEl: null,
  canvasEl: null,
  isActive: false,

  /**
   * Open Camera — Automatically detects Capacitor Native Platform vs Browser
   */
  async open(mode, onCapture) {
    // 1. Native Capacitor App Platform check
    if (window.Capacitor && window.Capacitor.isNativePlatform() && window.Capacitor.Plugins?.Camera) {
      try {
        const photo = await window.Capacitor.Plugins.Camera.getPhoto({
          quality: 88,
          allowEditing: false,
          resultType: 'dataUrl',
          source: 'CAMERA'
        });

        if (photo && photo.dataUrl) {
          if (onCapture) onCapture(photo.dataUrl);
          return;
        }
      } catch (nativeErr) {
        console.warn('Capacitor Native Camera error/cancelled:', nativeErr);
        if (App?.toast) App.toast('Native camera cancelled or unavailable', 'warning');
        // Continue to fallback modal if user did not explicitly cancel
      }
    }

    // 2. Web Browser live camera modal
    const existing = document.getElementById('camera-overlay');
    if (existing) existing.remove();

    this.createModal(mode, onCapture);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      const isSecure = window.isSecureContext || location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1';
      this.showFallback(!isSecure ? 'https_required' : 'not_supported');
      return;
    }

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 }
        },
        audio: false
      });

      this.videoEl = document.getElementById('camera-preview');
      if (this.videoEl) {
        this.videoEl.srcObject = this.stream;
        try {
          await this.videoEl.play();
        } catch (pErr) {
          console.warn('Video play attempt:', pErr);
        }
      }
      this.isActive = true;
      this.startTimestamp();

    } catch (err) {
      console.error('Camera error:', err.name || err);
      let reason = 'blocked';
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        reason = 'permission_denied';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        reason = 'no_camera';
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        reason = 'in_use';
      }
      this.showFallback(reason);
    }
  },

  createModal(mode, onCapture) {
    const modeLabel = mode === 'checkin' ? 'Check In' : 'Check Out';
    const modeIcon = mode === 'checkin' ? '📥' : '📤';

    const overlay = document.createElement('div');
    overlay.id = 'camera-overlay';
    overlay.className = 'camera-overlay';
    overlay.innerHTML = `
      <div class="camera-modal">
        <div class="camera-modal-header">
          <h2>${modeIcon} Live Photo — ${modeLabel}</h2>
          <button class="camera-close-btn" id="camera-close" aria-label="Close camera">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="camera-body">
          <div class="camera-view-container" id="camera-view-container">
            <video id="camera-preview" autoplay playsinline></video>
            <canvas id="camera-canvas" style="display:none;"></canvas>
            <div class="camera-location-overlay">
              <div class="camera-location-pill" id="camera-location-pill">
                ${window.LocationService ? LocationService.getPinSvg('#F0C040', 14) : ''}
                <span class="pill-address-text">Fetching location...</span>
              </div>
            </div>
            <div class="camera-timestamp" id="camera-timestamp"></div>
            <div class="camera-crosshair"></div>
            <div class="camera-corner camera-corner-tl"></div>
            <div class="camera-corner camera-corner-tr"></div>
            <div class="camera-corner camera-corner-bl"></div>
            <div class="camera-corner camera-corner-br"></div>
          </div>
          <div class="camera-preview-captured" id="camera-captured" style="display:none;">
            <img id="captured-image" alt="Captured photo" />
          </div>
          <div class="camera-fallback" id="camera-fallback" style="display:none;">
            <div class="fallback-icon">📷</div>
            <p style="margin-bottom:14px; font-weight:600; color:var(--text-secondary);">Camera stream not detected or blocked</p>
            <div style="display:flex; gap:12px; flex-wrap:wrap; justify-content:center;">
              <button class="btn btn-primary btn-sm" id="btn-demo-photo" style="background:var(--gold-gradient); color:#0a0a0f; border:none; padding:10px 18px; font-weight:700; border-radius:var(--r-md); cursor:pointer;">
                ⚡ Quick Demo Photo
              </button>
              <label class="file-upload-btn" for="photo-upload" style="margin-top:0;">
                📁 Upload Photo
              </label>
            </div>
            <input type="file" id="photo-upload" accept="image/*" capture="user" style="display:none;" />
          </div>
        </div>
        <div class="camera-actions">
          <button class="btn-capture" id="btn-capture" title="Take Live Photo">
            <span class="capture-ring"></span>
            <span class="capture-dot"></span>
          </button>
          <button class="btn-retake btn btn-outline btn-sm" id="btn-retake" style="display:none; padding:10px 20px; font-weight:700;">
            🔄 Retake
          </button>
          <button class="btn-confirm btn btn-primary btn-sm" id="btn-confirm" style="display:none; background:var(--green); color:#fff; border:none; padding:10px 24px; font-weight:700; border-radius:var(--r-md);">
            ✅ Confirm ${modeLabel}
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add('active'));

    // Fetch live location in parallel
    this.locationData = null;
    this.locationPromise = window.LocationService ? LocationService.getCurrentLocation() : Promise.resolve(null);
    this.locationPromise.then(loc => {
      this.locationData = loc;
      const pill = document.getElementById('camera-location-pill');
      if (pill) {
        const cleanAddr = (loc?.cleanAddress || loc?.address || 'Hotel Premises, Puducherry').replace(/^📍\s*/, '');
        const pinColor = (loc?.status === 'success' && loc?.lat) ? '#34D399' : '#F0C040';
        const pinIcon = LocationService.getPinSvg(pinColor, 14);
        pill.innerHTML = `${pinIcon} <span class="pill-address-text">${cleanAddr}</span>`;
      }
    });

    document.getElementById('camera-close').addEventListener('click', () => this.close());
    document.getElementById('btn-capture').addEventListener('click', () => this.capture());
    document.getElementById('btn-retake').addEventListener('click', () => this.retake());
    document.getElementById('btn-confirm').addEventListener('click', async () => {
      const img = document.getElementById('captured-image');
      let finalLoc = this.locationData;
      if (!finalLoc && this.locationPromise) {
        finalLoc = await this.locationPromise;
      }
      if (!finalLoc || !finalLoc.address || finalLoc.address.includes('Location N/A')) {
        finalLoc = window.LocationService ? LocationService.getFallbackLocation() : null;
      }
      if (img.src && onCapture) {
        onCapture(img.src, finalLoc);
      }
      this.close();
    });

    const demoBtn = document.getElementById('btn-demo-photo');
    if (demoBtn) {
      demoBtn.addEventListener('click', () => {
        const demoData = this.generateDemoPhoto();
        this.showCapturedImage(demoData);
      });
    }

    const fileInput = document.getElementById('photo-upload');
    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (ev) => {
            this.showCapturedImage(ev.target.result);
          };
          reader.readAsDataURL(file);
        }
      });
    }

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) this.close();
    });
  },

  capture() {
    if (!this.videoEl || this.videoEl.videoWidth === 0) {
      const demoData = this.generateDemoPhoto();
      this.showCapturedImage(demoData);
      return;
    }

    this.canvasEl = document.getElementById('camera-canvas');
    const ctx = this.canvasEl.getContext('2d');

    const width = this.videoEl.videoWidth || 640;
    const height = this.videoEl.videoHeight || 480;
    this.canvasEl.width = width;
    this.canvasEl.height = height;

    ctx.save();
    ctx.translate(width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(this.videoEl, 0, 0, width, height);
    ctx.restore();

    const now = new Date();
    const timestamp = now.toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'medium'
    });

    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, height - 44, width, 44);

    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 15px Inter, sans-serif';
    ctx.fillText('🍋 HotelLemon — ' + timestamp, 14, height - 16);

    const photoData = this.canvasEl.toDataURL('image/jpeg', 0.88);
    this.showCapturedImage(photoData);

    this.flashEffect();
  },

  generateDemoPhoto() {
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createLinearGradient(0, 0, 640, 480);
    grad.addColorStop(0, '#0F172A');
    grad.addColorStop(1, '#1E293B');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 640, 480);

    ctx.fillStyle = 'rgba(240, 192, 64, 0.15)';
    ctx.beginPath();
    ctx.arc(320, 200, 110, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = '80px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('👤', 320, 220);

    ctx.font = 'bold 18px Inter, sans-serif';
    ctx.fillStyle = '#34D399';
    ctx.fillText('✓ LIVE VERIFIED PHOTO', 320, 275);

    ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
    ctx.fillRect(0, 436, 640, 44);

    const now = new Date();
    const timestamp = now.toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'medium'
    });

    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 15px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('🍋 HotelLemon — ' + timestamp, 16, 464);

    return canvas.toDataURL('image/jpeg', 0.88);
  },

  showCapturedImage(photoData) {
    const capturedDiv = document.getElementById('camera-captured');
    const viewContainer = document.getElementById('camera-view-container');
    const fallback = document.getElementById('camera-fallback');
    const img = document.getElementById('captured-image');
    const btnCapture = document.getElementById('btn-capture');
    const btnRetake = document.getElementById('btn-retake');
    const btnConfirm = document.getElementById('btn-confirm');

    img.src = photoData;
    capturedDiv.style.display = 'flex';
    if (viewContainer) viewContainer.style.display = 'none';
    if (fallback) fallback.style.display = 'none';
    if (btnCapture) btnCapture.style.display = 'none';
    if (btnRetake) btnRetake.style.display = 'inline-flex';
    if (btnConfirm) btnConfirm.style.display = 'inline-flex';
  },

  retake() {
    const capturedDiv = document.getElementById('camera-captured');
    const viewContainer = document.getElementById('camera-view-container');
    const fallback = document.getElementById('camera-fallback');
    const btnCapture = document.getElementById('btn-capture');
    const btnRetake = document.getElementById('btn-retake');
    const btnConfirm = document.getElementById('btn-confirm');

    capturedDiv.style.display = 'none';
    if (this.stream) {
      if (viewContainer) viewContainer.style.display = 'block';
      if (btnCapture) btnCapture.style.display = 'flex';
      if (fallback) fallback.style.display = 'none';
    } else {
      if (viewContainer) viewContainer.style.display = 'none';
      if (fallback) fallback.style.display = 'flex';
      if (btnCapture) btnCapture.style.display = 'none';
    }
    if (btnRetake) btnRetake.style.display = 'none';
    if (btnConfirm) btnConfirm.style.display = 'none';
  },

  flashEffect() {
    const flash = document.createElement('div');
    flash.className = 'camera-flash';
    const container = document.querySelector('.camera-view-container');
    if (container) {
      container.appendChild(flash);
      setTimeout(() => flash.remove(), 500);
    }
  },

  showFallback(reason = 'blocked') {
    const viewContainer = document.getElementById('camera-view-container');
    const fallback = document.getElementById('camera-fallback');
    const btnCapture = document.getElementById('btn-capture');

    if (viewContainer) viewContainer.style.display = 'none';
    if (fallback) {
      fallback.style.display = 'flex';
      const msgEl = fallback.querySelector('p');
      if (msgEl) {
        const messages = {
          https_required: '🔒 Secure Context (HTTPS) required for live mobile camera access. Use Upload Photo or Demo Photo below.',
          permission_denied: '🚫 Camera permission was denied in your browser settings. You can upload a photo or use Demo Photo.',
          no_camera: '📷 No camera hardware detected on this device. Upload a photo or use Demo Photo.',
          in_use: '⚠️ Camera is currently in use by another application. Close it and retry or upload a photo.',
          not_supported: '⚠️ Live camera preview is not supported in this environment. Upload a photo or use Demo Photo.',
          blocked: '📷 Camera stream not detected or blocked by browser.'
        };
        msgEl.textContent = messages[reason] || messages.blocked;
      }
    }
    if (btnCapture) btnCapture.style.display = 'none';
  },

  startTimestamp() {
    const el = document.getElementById('camera-timestamp');
    if (!el) return;

    const update = () => {
      const now = new Date();
      el.textContent = now.toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'medium'
      });
    };

    update();
    this._timestampInterval = setInterval(update, 1000);
  },

  close() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }

    if (this._timestampInterval) {
      clearInterval(this._timestampInterval);
      this._timestampInterval = null;
    }

    const overlay = document.getElementById('camera-overlay');
    if (overlay) {
      overlay.classList.remove('active');
      setTimeout(() => overlay.remove(), 300);
    }

    this.isActive = false;
    this.videoEl = null;
    this.canvasEl = null;
  }
};
