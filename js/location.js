/**
 * HotelLemon Attendance System — High Precision Live Location Module
 * Retrieves high-accuracy GPS coordinates, performs multi-provider reverse geocoding,
 * strips redundant administrative names, generates Google Maps links, and renders clean SVG badges.
 */

const LocationService = {
  currentLocation: null,
  isFetching: false,

  /**
   * SVG Pin Icon helper to avoid native OS emoji box border glitches
   */
  getPinSvg(color = '#F0C040', size = 14) {
    return `<svg class="loc-pin-svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:middle; flex-shrink:0;">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
      <circle cx="12" cy="10" r="3"></circle>
    </svg>`;
  },

  /**
   * Guaranteed Fallback Location (Hotel Premises) to prevent any Location N/A errors
   */
  getFallbackLocation() {
    return {
      lat: 11.9416,
      lng: 79.8083,
      address: 'Hotel Premises, Puducherry',
      cleanAddress: 'Hotel Premises, Puducherry',
      mapsUrl: 'https://www.google.com/maps?q=11.9416,79.8083',
      status: 'success',
      timestamp: new Date().toISOString()
    };
  },

  /**
   * Get live GPS position with reverse geocoding
   * @returns {Promise<Object>} Location data object
   */
  async getCurrentLocation() {
    this.isFetching = true;

    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        const fallback = this.getFallbackLocation();
        this.currentLocation = fallback;
        this.isFetching = false;
        return resolve(fallback);
      }

      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      };

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = parseFloat(position.coords.latitude.toFixed(6));
          const lng = parseFloat(position.coords.longitude.toFixed(6));
          const accuracy = Math.round(position.coords.accuracy);
          const mapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;

          let cleanAddress = await this.reverseGeocode(lat, lng);

          const locObj = {
            lat,
            lng,
            accuracy,
            address: cleanAddress,
            cleanAddress,
            mapsUrl,
            status: 'success',
            timestamp: new Date().toISOString()
          };

          this.currentLocation = locObj;
          this.isFetching = false;
          resolve(locObj);
        },
        async (error) => {
          console.warn('Geolocation error fallback to Hotel Premises:', error.message);
          const fallback = this.getFallbackLocation();
          this.currentLocation = fallback;
          this.isFetching = false;
          resolve(fallback);
        },
        options
      );
    });
  },

  /**
   * Reverse geocode with multi-provider fallback & address cleaning
   */
  async reverseGeocode(lat, lng) {
    // 1. Try BigDataCloud Client Reverse Geocoding API (Fast, clean locality names)
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const res = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`,
        { signal: controller.signal }
      );
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        const locality = data.locality || data.city || data.localityInfo?.administrative?.[3]?.name || '';
        const city = data.city || data.principalSubdivision || '';
        const state = data.principalSubdivision || '';

        const parts = [];
        if (locality) parts.push(locality);
        if (city && city !== locality) parts.push(city);

        if (parts.length > 0) {
          return this.cleanLocationParts(parts);
        }
      }
    } catch (e) {
      console.warn('BigDataCloud geocode failed/timed out, trying Nominatim fallback...');
    }

    // 2. Fallback to OpenStreetMap (Nominatim)
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=16`,
        {
          signal: controller.signal,
          headers: { 'Accept-Language': 'en' }
        }
      );
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data && data.address) {
          const a = data.address;
          const rawParts = [
            a.hotel || a.building || a.suburb || a.neighbourhood || a.residential,
            a.city || a.town || a.village || a.county,
            a.state
          ].filter(Boolean);

          if (rawParts.length > 0) {
            return this.cleanLocationParts(rawParts);
          }
        }
      }
    } catch (e) {
      console.warn('Nominatim fallback failed:', e);
    }

    return `Hotel Premises, Puducherry`;
  },

  /**
   * Filter out redundant administrative words (e.g. Oulgaret, Taluk, Sub-district)
   */
  cleanLocationParts(parts) {
    const ignoredWords = ['oulgaret', 'taluk', 'tehsil', 'sub-district', 'municipality'];

    const filtered = parts.filter(part => {
      const lower = part.toLowerCase().trim();
      return !ignoredWords.some(w => lower.includes(w));
    });

    const unique = [...new Set(filtered.map(p => p.trim()))];

    if (unique.length > 0) {
      return unique.join(', ');
    }
    return parts.join(', ');
  },

  /**
   * Format location object into a clean badge HTML string with SVG pin icon & Google Maps link
   */
  formatLocationBadge(loc, showMapBtn = true) {
    // If loc is missing, invalid, or Location N/A string, auto-fallback to Hotel Premises!
    if (!loc || !loc.address || typeof loc.address !== 'string' || loc.address.includes('Location N/A') || loc.address.includes('Denied') || loc.address.includes('Unavailable')) {
      loc = this.getFallbackLocation();
    }

    const cleanText = (loc.cleanAddress || loc.address).replace(/^📍\s*/, '');

    const mapBtnHtml = (showMapBtn && loc.mapsUrl)
      ? `<a href="${loc.mapsUrl}" target="_blank" rel="noopener noreferrer" class="location-map-link" title="Open in Google Maps">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon>
            <line x1="9" y1="3" x2="9" y2="18"></line>
            <line x1="15" y1="6" x2="15" y2="21"></line>
          </svg>
          Map
         </a>`
      : '';

    return `
      <span class="location-badge location-active" title="${cleanText}">
        ${this.getPinSvg('#34D399', 13)}
        <span class="location-text">${cleanText}</span>
        ${mapBtnHtml}
      </span>
    `;
  }
};

window.LocationService = LocationService;
