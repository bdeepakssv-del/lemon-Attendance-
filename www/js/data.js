/**
 * HotelLemon Attendance System — Data Layer
 * Manages all data persistence via localStorage
 */

const DB = {
  KEYS: {
    ADMIN: 'hotellemon_admin',
    STAFF: 'hotellemon_staff',
    ATTENDANCE: 'hotellemon_attendance',
    CURRENT_USER: 'hotellemon_current_user',
    SETTINGS: 'hotellemon_settings'
  },

  // ── Default Data ───────────────────────────────────────────
  defaults: {
    admin: {
      username: 'manager',
      password: 'lemon2026',
      name: 'Hotel Manager',
      role: 'admin'
    },

    staff: [
      {
        id: 'EMP001',
        name: 'Rahul Sharma',
        password: 'lemon123',
        department: 'Front Desk',
        position: 'Receptionist',
        phone: '+91 98765 43210',
        email: 'rahul@hotellemon.com',
        joinDate: '2025-01-15',
        avatar: null,
        status: 'active'
      },
      {
        id: 'EMP002',
        name: 'Priya Patel',
        password: 'lemon123',
        department: 'Housekeeping',
        position: 'Supervisor',
        phone: '+91 98765 43211',
        email: 'priya@hotellemon.com',
        joinDate: '2025-03-20',
        avatar: null,
        status: 'active'
      },
      {
        id: 'EMP003',
        name: 'Amit Kumar',
        password: 'lemon123',
        department: 'Kitchen',
        position: 'Head Chef',
        phone: '+91 98765 43212',
        email: 'amit@hotellemon.com',
        joinDate: '2024-11-10',
        avatar: null,
        status: 'active'
      },
      {
        id: 'EMP004',
        name: 'Sneha Reddy',
        password: 'lemon123',
        department: 'Front Desk',
        position: 'Concierge',
        phone: '+91 98765 43213',
        email: 'sneha@hotellemon.com',
        joinDate: '2025-06-01',
        avatar: null,
        status: 'active'
      },
      {
        id: 'EMP005',
        name: 'Vikram Singh',
        password: 'lemon123',
        department: 'Security',
        position: 'Security Head',
        phone: '+91 98765 43214',
        email: 'vikram@hotellemon.com',
        joinDate: '2024-08-15',
        avatar: null,
        status: 'active'
      }
    ],

    attendance: []
  },

  // ── Initialization ─────────────────────────────────────────
  init() {
    let savedAdmin = localStorage.getItem(this.KEYS.ADMIN);
    if (!savedAdmin || JSON.parse(savedAdmin).username === 'admin') {
      localStorage.setItem(this.KEYS.ADMIN, JSON.stringify(this.defaults.admin));
    }
    let savedStaff = localStorage.getItem(this.KEYS.STAFF);
    if (!savedStaff) {
      localStorage.setItem(this.KEYS.STAFF, JSON.stringify(this.defaults.staff));
    } else {
      try {
        const staffList = JSON.parse(savedStaff);
        let updated = false;
        staffList.forEach(s => {
          if (s.password === 'staff123') {
            s.password = 'lemon123';
            updated = true;
          }
        });
        if (updated) {
          localStorage.setItem(this.KEYS.STAFF, JSON.stringify(staffList));
        }
      } catch (e) {}
    }
    if (!localStorage.getItem(this.KEYS.ATTENDANCE)) {
      localStorage.setItem(this.KEYS.ATTENDANCE, JSON.stringify(this.defaults.attendance));
    }
  },

  updateAdminCredentials(newUsername, newPassword) {
    const admin = JSON.parse(localStorage.getItem(this.KEYS.ADMIN)) || this.defaults.admin;
    if (newUsername) admin.username = newUsername.trim();
    if (newPassword) admin.password = newPassword;
    localStorage.setItem(this.KEYS.ADMIN, JSON.stringify(admin));

    const current = this.getCurrentUser();
    if (current && current.role === 'admin') {
      current.username = admin.username;
      current.password = admin.password;
      localStorage.setItem(this.KEYS.CURRENT_USER, JSON.stringify(current));
    }
    return admin;
  },

  // ── Auth ────────────────────────────────────────────────────
  loginAdmin(username, password) {
    const admin = JSON.parse(localStorage.getItem(this.KEYS.ADMIN));
    if (admin.username === username && admin.password === password) {
      const session = { ...admin, role: 'admin', loggedInAt: new Date().toISOString() };
      localStorage.setItem(this.KEYS.CURRENT_USER, JSON.stringify(session));
      return session;
    }
    return null;
  },

  loginStaff(empId, password) {
    const staffList = this.getStaff();
    const staff = staffList.find(s => s.id === empId.toUpperCase() && s.password === password && s.status === 'active');
    if (staff) {
      const session = { ...staff, role: 'staff', loggedInAt: new Date().toISOString() };
      localStorage.setItem(this.KEYS.CURRENT_USER, JSON.stringify(session));
      return session;
    }
    return null;
  },

  getCurrentUser() {
    const user = localStorage.getItem(this.KEYS.CURRENT_USER);
    return user ? JSON.parse(user) : null;
  },

  logout() {
    localStorage.removeItem(this.KEYS.CURRENT_USER);
  },

  // ── Staff CRUD ──────────────────────────────────────────────
  getStaff() {
    return JSON.parse(localStorage.getItem(this.KEYS.STAFF)) || [];
  },

  getStaffById(id) {
    return this.getStaff().find(s => s.id === id);
  },

  addStaff(staffData) {
    const staff = this.getStaff();
    const newId = 'EMP' + String(staff.length + 1).padStart(3, '0');
    let id = newId;
    let counter = staff.length + 1;
    while (staff.some(s => s.id === id)) {
      counter++;
      id = 'EMP' + String(counter).padStart(3, '0');
    }
    const newStaff = {
      id,
      name: staffData.name,
      password: staffData.password || 'staff123',
      department: staffData.department,
      position: staffData.position,
      phone: staffData.phone || '',
      email: staffData.email || '',
      joinDate: new Date().toISOString().split('T')[0],
      avatar: null,
      status: 'active'
    };
    staff.push(newStaff);
    localStorage.setItem(this.KEYS.STAFF, JSON.stringify(staff));
    return newStaff;
  },

  updateStaff(id, updates) {
    const staff = this.getStaff();
    const index = staff.findIndex(s => s.id === id);
    if (index !== -1) {
      staff[index] = { ...staff[index], ...updates };
      localStorage.setItem(this.KEYS.STAFF, JSON.stringify(staff));
      return staff[index];
    }
    return null;
  },

  deleteStaff(id) {
    const staff = this.getStaff();
    const updated = staff.filter(s => s.id !== id);
    localStorage.setItem(this.KEYS.STAFF, JSON.stringify(updated));
  },

  // ── Attendance ──────────────────────────────────────────────
  getAttendance() {
    return JSON.parse(localStorage.getItem(this.KEYS.ATTENDANCE)) || [];
  },

  getAttendanceByStaff(staffId) {
    return this.getAttendance().filter(a => a.staffId === staffId);
  },

  getAttendanceByDate(date) {
    return this.getAttendance().filter(a => a.date === date);
  },

  getTodayAttendance() {
    const today = new Date().toISOString().split('T')[0];
    return this.getAttendanceByDate(today);
  },

  getStaffTodayRecord(staffId) {
    const today = new Date().toISOString().split('T')[0];
    return this.getAttendance().find(a => a.staffId === staffId && a.date === today);
  },

  checkIn(staffId, photoData, locationData = null) {
    const attendance = this.getAttendance();
    const today = new Date().toISOString().split('T')[0];
    const now = new Date();

    const existing = attendance.find(a => a.staffId === staffId && a.date === today);
    if (existing && existing.checkIn) {
      return { error: 'Already checked in today' };
    }

    const staff = this.getStaffById(staffId);
    const record = {
      id: 'ATT' + Date.now(),
      staffId,
      staffName: staff ? staff.name : 'Unknown',
      department: staff ? staff.department : '',
      date: today,
      checkIn: now.toISOString(),
      checkInTime: now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      checkInPhoto: photoData,
      checkInLocation: locationData || null,
      checkOut: null,
      checkOutTime: null,
      checkOutPhoto: null,
      checkOutLocation: null,
      totalHours: null,
      status: this.getCheckInStatus(now, staffId)
    };

    attendance.push(record);
    localStorage.setItem(this.KEYS.ATTENDANCE, JSON.stringify(attendance));
    return record;
  },

  checkOut(staffId, photoData, locationData = null) {
    const attendance = this.getAttendance();
    const today = new Date().toISOString().split('T')[0];
    const now = new Date();

    const index = attendance.findIndex(a => a.staffId === staffId && a.date === today && a.checkIn && !a.checkOut);
    if (index === -1) {
      return { error: 'No active check-in found for today' };
    }

    const checkInTime = new Date(attendance[index].checkIn);
    const diffMs = now - checkInTime;
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    attendance[index].checkOut = now.toISOString();
    attendance[index].checkOutTime = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    attendance[index].checkOutPhoto = photoData;
    attendance[index].checkOutLocation = locationData || null;
    attendance[index].totalHours = `${hours}h ${minutes}m`;

    localStorage.setItem(this.KEYS.ATTENDANCE, JSON.stringify(attendance));
    return attendance[index];
  },

  getCheckInStatus(dateObj, staffId) {
    const staff = staffId ? this.getStaffById(staffId) : null;
    const settings = this.getSettings();

    const shiftStart = (staff && staff.shiftStart) ? staff.shiftStart : (settings.shiftStart || '09:00');
    const gracePeriod = (staff && staff.gracePeriod !== undefined && staff.gracePeriod !== null)
      ? parseInt(staff.gracePeriod)
      : parseInt(settings.gracePeriod || 15);

    const [sHour, sMin] = shiftStart.split(':').map(Number);
    const shiftStartMins = (sHour || 9) * 60 + (sMin || 0);
    const graceEndMins = shiftStartMins + gracePeriod;

    const checkInMins = dateObj.getHours() * 60 + dateObj.getMinutes();

    if (checkInMins < shiftStartMins) return 'early';
    if (checkInMins <= graceEndMins) return 'on-time';
    return 'late';
  },

  getSettings() {
    const saved = localStorage.getItem(this.KEYS.SETTINGS);
    return saved ? JSON.parse(saved) : {
      hotelName: 'HotelLemon',
      shiftStart: '09:00',
      shiftEnd: '17:00',
      gracePeriod: 15
    };
  },

  saveSettings(settings) {
    const current = this.getSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(this.KEYS.SETTINGS, JSON.stringify(updated));
    return updated;
  },

  getStats() {
    const staff = this.getStaff().filter(s => s.status === 'active');
    const todayRecords = this.getTodayAttendance();
    const checkedIn = todayRecords.filter(r => r.checkIn && !r.checkOut);
    const checkedOut = todayRecords.filter(r => r.checkOut);
    const late = todayRecords.filter(r => r.status === 'late');

    return {
      totalStaff: staff.length,
      presentToday: todayRecords.length,
      checkedIn: checkedIn.length,
      checkedOut: checkedOut.length,
      absent: staff.length - todayRecords.length,
      late: late.length,
      onTime: todayRecords.filter(r => r.status === 'on-time').length,
      early: todayRecords.filter(r => r.status === 'early').length
    };
  },

  exportAttendanceCSV(filters = {}) {
    let records = this.getAttendance();

    if (filters.startDate) {
      records = records.filter(r => r.date >= filters.startDate);
    }
    if (filters.endDate) {
      records = records.filter(r => r.date <= filters.endDate);
    }
    if (filters.staffId) {
      records = records.filter(r => r.staffId === filters.staffId);
    }
    if (filters.department) {
      records = records.filter(r => r.department === filters.department);
    }

    const headers = ['Date', 'Employee ID', 'Name', 'Department', 'Check In', 'Check Out', 'Total Hours', 'Status'];
    const rows = records.map(r => [
      r.date,
      r.staffId,
      r.staffName,
      r.department,
      r.checkInTime || '-',
      r.checkOutTime || '-',
      r.totalHours || '-',
      r.status
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hotellemon_attendance_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  },

  resetAll() {
    Object.values(this.KEYS).forEach(key => localStorage.removeItem(key));
    this.init();
  }
};

DB.init();
