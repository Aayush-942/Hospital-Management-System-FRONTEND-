// ============ AUTH DATA ============
const USERS = {
  admin: { password: 'admin123', role: 'admin', name: 'Admin User', initials: 'AD' },
  patient1: { password: 'pass1234', role: 'patient', patientId: 'P001', name: 'Ananya Sharma', initials: 'AS' },
  patient2: { password: 'pass1234', role: 'patient', patientId: 'P002', name: 'Vikram Singh', initials: 'VS' },
  patient3: { password: 'pass1234', role: 'patient', patientId: 'P003', name: 'Meera Joshi', initials: 'MJ' },
  patient4: { password: 'pass1234', role: 'patient', patientId: 'P004', name: 'Rohit Patel', initials: 'RP' },
  patient5: { password: 'pass1234', role: 'patient', patientId: 'P005', name: 'Sunita Rao', initials: 'SR' },
};

let currentUser = null;
let currentRole = 'admin'; // tab selection

// ============ LOGIN LOGIC ============
function switchRole(role) {
  currentRole = role;
  document.querySelectorAll('.role-tab').forEach((t,i) => t.classList.toggle('active', i === (role==='admin'?0:1)));
  document.getElementById('login-error').style.display = 'none';
  if (role === 'admin') {
    document.getElementById('login-hint').innerHTML = '<strong>Admin demo:</strong> Username — <code>admin</code> &nbsp;|&nbsp; Password — <code>admin123</code>';
    document.getElementById('username-label').textContent = 'Username';
    document.getElementById('login-username').placeholder = 'Enter username';
  } else {
    document.getElementById('login-hint').innerHTML = '<strong>Patient demo:</strong> Username — <code>patient1</code> to <code>patient5</code> &nbsp;|&nbsp; Password — <code>pass1234</code>';
    document.getElementById('username-label').textContent = 'Patient Username';
    document.getElementById('login-username').placeholder = 'e.g. patient1';
  }
  document.getElementById('login-username').value = '';
  document.getElementById('login-password').value = '';
}

function togglePwd() {
  const inp = document.getElementById('login-password');
  inp.type = inp.type === 'password' ? 'text' : 'password';
}

function doLogin() {
  const username = document.getElementById('login-username').value.trim().toLowerCase();
  const password = document.getElementById('login-password').value;
  const errEl = document.getElementById('login-error');

  const user = USERS[username];
  if (!user || user.password !== password || user.role !== currentRole) {
    errEl.style.display = 'block';
    document.getElementById('login-password').value = '';
    setTimeout(() => errEl.style.display = 'none', 3000);
    return;
  }

  currentUser = { ...user, username };
  errEl.style.display = 'none';

  // Update sidebar UI
  document.getElementById('sidebar-avatar').textContent = user.initials;
  document.getElementById('sidebar-name').textContent = user.name;

  if (user.role === 'admin') {
    document.getElementById('sidebar-role').textContent = 'System Administrator';
    document.getElementById('topbar-role-pill').textContent = 'Admin';
    document.getElementById('topbar-role-pill').className = 'role-pill admin';
    document.getElementById('admin-nav').style.display = 'block';
    document.getElementById('patient-nav').style.display = 'none';
    document.getElementById('add-btn').style.display = '';
    document.getElementById('add-doctor-btn').style.display = '';
    document.getElementById('add-medicine-btn').style.display = '';
  } else {
    document.getElementById('sidebar-role').textContent = 'Patient · ' + user.patientId;
    document.getElementById('topbar-role-pill').textContent = 'Patient';
    document.getElementById('topbar-role-pill').className = 'role-pill patient';
    document.getElementById('admin-nav').style.display = 'none';
    document.getElementById('patient-nav').style.display = 'block';
    document.getElementById('add-btn').style.display = 'none';
    document.getElementById('add-doctor-btn').style.display = 'none';
    document.getElementById('add-medicine-btn').style.display = 'none';
  }

  // Show app, hide login
  document.getElementById('login-screen').style.display = 'none';
  document.getElementById('app').style.display = 'flex';

  // Reset and render default page
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  if (user.role === 'admin') {
    document.getElementById('page-dashboard').classList.add('active');
    document.getElementById('page-title').textContent = 'Dashboard';
    renderDashboard();
  } else {
    document.getElementById('page-portal').classList.add('active');
    document.getElementById('page-title').textContent = 'My Dashboard';
    renderPatientPortal();
  }
}

function doLogout() {
  currentUser = null;
  document.getElementById('app').style.display = 'none';
  document.getElementById('login-screen').style.display = 'flex';
  document.getElementById('login-username').value = '';
  document.getElementById('login-password').value = '';
  switchRole('admin');
  showToast('Signed out successfully');
}

// ============ DATA ============
const colors = ['#1e5cbe','#00c48c','#e84b4b','#f7a93b','#8b5cf6','#0ea5e9'];

let patients = [
  { id:'P001', name:'Ananya Sharma', age:34, blood:'B+', contact:'9876543210', doctor:'Dr. Rajan Mehta', ward:'General', status:'Admitted' },
  { id:'P002', name:'Vikram Singh', age:52, blood:'O+', contact:'9845123456', doctor:'Dr. Priya Nair', ward:'ICU', status:'Critical' },
  { id:'P003', name:'Meera Joshi', age:27, blood:'A-', contact:'9912345678', doctor:'Dr. Rajan Mehta', ward:'OPD', status:'Outpatient' },
  { id:'P004', name:'Rohit Patel', age:45, blood:'AB+', contact:'9823456789', doctor:'Dr. Suresh Kumar', ward:'Surgical', status:'Post-Op' },
  { id:'P005', name:'Sunita Rao', age:61, blood:'O-', contact:'9798765432', doctor:'Dr. Priya Nair', ward:'Cardiology', status:'Admitted' },
];

let doctors = [
  { id:'D001', name:'Dr. Rajan Mehta', dept:'Cardiology', exp:'12 yrs', patients:28, rating:4.8, available:true, emoji:'👨‍⚕️' },
  { id:'D002', name:'Dr. Priya Nair', dept:'Neurology', exp:'9 yrs', patients:22, rating:4.9, available:true, emoji:'👩‍⚕️' },
  { id:'D003', name:'Dr. Suresh Kumar', dept:'Orthopedics', exp:'15 yrs', patients:31, rating:4.7, available:false, emoji:'👨‍⚕️' },
  { id:'D004', name:'Dr. Kavita Reddy', dept:'Pediatrics', exp:'8 yrs', patients:19, rating:4.9, available:true, emoji:'👩‍⚕️' },
  { id:'D005', name:'Dr. Arvind Jha', dept:'Surgery', exp:'20 yrs', patients:14, rating:4.6, available:true, emoji:'👨‍⚕️' },
  { id:'D006', name:'Dr. Smita Desai', dept:'Radiology', exp:'11 yrs', patients:40, rating:4.8, available:false, emoji:'👩‍⚕️' },
];

let appointments = [
  { id:'A001', patient:'Ananya Sharma', doctor:'Dr. Rajan Mehta', dept:'Cardiology', date:'2026-04-15', time:'09:00 AM', type:'Check-up', status:'Confirmed' },
  { id:'A002', patient:'Vikram Singh', doctor:'Dr. Priya Nair', dept:'Neurology', date:'2026-04-15', time:'10:30 AM', type:'Follow-up', status:'In Progress' },
  { id:'A003', patient:'Meera Joshi', doctor:'Dr. Rajan Mehta', dept:'Cardiology', date:'2026-04-15', time:'11:00 AM', type:'Consultation', status:'Waiting' },
  { id:'A004', patient:'Rohit Patel', doctor:'Dr. Suresh Kumar', dept:'Orthopedics', date:'2026-04-16', time:'02:00 PM', type:'Surgery', status:'Scheduled' },
  { id:'A005', patient:'Sunita Rao', doctor:'Dr. Kavita Reddy', dept:'Pediatrics', date:'2026-04-16', time:'03:30 PM', type:'Check-up', status:'Scheduled' },
];

let medicines = [
  { name:'Paracetamol 500mg', category:'Analgesic', stock:1200, price:2.5, expiry:'2027-06', status:'In Stock' },
  { name:'Amoxicillin 250mg', category:'Antibiotic', stock:340, price:8.0, expiry:'2026-11', status:'In Stock' },
  { name:'Metformin 500mg', category:'Antidiabetic', stock:80, price:4.5, expiry:'2026-08', status:'Low Stock' },
  { name:'Atorvastatin 10mg', category:'Cardiac', stock:0, price:12.0, expiry:'2027-03', status:'Out of Stock' },
  { name:'Omeprazole 20mg', category:'Gastric', stock:560, price:6.5, expiry:'2027-01', status:'In Stock' },
  { name:'Amlodipine 5mg', category:'Antihypertensive', stock:210, price:9.0, expiry:'2026-12', status:'In Stock' },
];

let bills = [
  { id:'B001', patient:'Ananya Sharma', services:'Consultation, ECG, Blood Test', amount:3200, date:'2026-04-14', payment:'UPI', status:'Paid' },
  { id:'B002', patient:'Vikram Singh', services:'MRI, Consultation', amount:8500, date:'2026-04-14', payment:'Cash', status:'Pending' },
  { id:'B003', patient:'Rohit Patel', services:'Surgery, ICU (2 days), Medicines', amount:48000, date:'2026-04-13', payment:'Insurance', status:'Paid' },
  { id:'B004', patient:'Meera Joshi', services:'OPD Consultation, X-Ray', amount:1400, date:'2026-04-15', payment:'Card', status:'Paid' },
  { id:'B005', patient:'Sunita Rao', services:'Cardiology Consult, Echo', amount:5600, date:'2026-04-15', payment:'-', status:'Pending' },
];

let wards = [
  { name:'General Ward A', type:'General', total:40, occupied:34 },
  { name:'ICU', type:'Intensive', total:20, occupied:18 },
  { name:'Surgical Ward', type:'Surgery', total:30, occupied:22 },
  { name:'Cardiology Ward', type:'Speciality', total:25, occupied:21 },
  { name:'Pediatric Ward', type:'Pediatric', total:20, occupied:12 },
  { name:'Maternity Ward', type:'Maternity', total:25, occupied:19 },
  { name:'Neurology Ward', type:'Speciality', total:20, occupied:17 },
  { name:'Oncology Ward', type:'Speciality', total:20, occupied:18 },
];

// ============ NAV ============
function navigate(page, el) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const pageEl = document.getElementById('page-' + page);
  if (pageEl) pageEl.classList.add('active');
  if (el) el.classList.add('active');
  const titles = {
    dashboard:'Dashboard', patients:'Patients', doctors:'Find Doctors', appointments:'Appointments',
    wards:'Wards & Beds', pharmacy:'Pharmacy', billing:'Billing', reports:'Reports',
    portal:'My Dashboard', 'my-appointments':'My Appointments', 'my-bills':'My Bills'
  };
  document.getElementById('page-title').textContent = titles[page] || page;
  renderPage(page);
}

function handleAdd() {
  const active = document.querySelector('.page.active')?.id.replace('page-','');
  const map = { patients:'patient', doctors:'doctor', appointments:'appointment', pharmacy:'medicine', billing:'bill' };
  if (map[active]) openModal(map[active]);
}

function renderPage(page) {
  if (page === 'dashboard') renderDashboard();
  else if (page === 'portal') renderPatientPortal();
  else if (page === 'patients') renderPatients();
  else if (page === 'doctors') renderDoctors();
  else if (page === 'appointments') renderAppointments();
  else if (page === 'my-appointments') renderMyAppointments();
  else if (page === 'my-bills') renderMyBills();
  else if (page === 'wards') renderWards();
  else if (page === 'pharmacy') renderPharmacy();
  else if (page === 'billing') renderBilling();
  else if (page === 'reports') renderReports();
}

// ============ HELPERS ============
function statusBadge(s) {
  const map = {
    'Admitted':'badge-blue','Critical':'badge-red','Outpatient':'badge-green','Post-Op':'badge-orange',
    'Confirmed':'badge-green','In Progress':'badge-blue','Waiting':'badge-orange','Scheduled':'badge-gray','Cancelled':'badge-red',
    'In Stock':'badge-green','Low Stock':'badge-orange','Out of Stock':'badge-red',
    'Paid':'badge-green','Pending':'badge-orange','Overdue':'badge-red',
    'Available':'badge-green','Occupied':'badge-red','Critical':'badge-red',
  };
  return `<span class="badge ${map[s]||'badge-gray'}">${s}</span>`;
}

function avatarHtml(name, size=30) {
  const initials = name.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2);
  const c = colors[name.charCodeAt(0)%colors.length];
  return `<div class="avatar" style="width:${size}px;height:${size}px;background:${c}22;color:${c};">${initials}</div>`;
}

// ============ PATIENT PORTAL RENDER ============
function renderPatientPortal() {
  if (!currentUser || currentUser.role !== 'patient') return;
  const pid = currentUser.patientId;
  const p = patients.find(x => x.id === pid);
  if (!p) return;

  const hr = new Date().getHours();
  const greet = hr < 12 ? 'Good morning' : hr < 17 ? 'Good afternoon' : 'Good evening';
  document.getElementById('portal-greeting').textContent = `${greet}, ${p.name.split(' ')[0]}`;
  document.getElementById('portal-pid').textContent = `Patient ID: ${pid}`;
  document.getElementById('pt-doctor').textContent = p.doctor.replace('Dr. ','Dr. ');
  document.getElementById('pt-ward').textContent = p.ward;

  const myAppts = appointments.filter(a => a.patient === p.name);
  document.getElementById('pt-appt-count').textContent = myAppts.length;

  const myBills = bills.filter(b => b.patient === p.name && b.status === 'Pending');
  document.getElementById('pt-bill-count').textContent = myBills.length;

  document.getElementById('portal-appt-tbody').innerHTML = myAppts.length
    ? myAppts.map(a => `<tr><td>${a.doctor}</td><td><span class="badge badge-blue">${a.dept}</span></td><td>${a.date}</td><td>${a.time}</td><td>${statusBadge(a.status)}</td></tr>`).join('')
    : `<tr><td colspan="5" style="text-align:center;color:var(--muted);padding:24px;">No upcoming appointments</td></tr>`;

  document.getElementById('portal-profile').innerHTML = `
    <div class="info-row"><span class="lbl">Full Name</span><span class="val">${p.name}</span></div>
    <div class="info-row"><span class="lbl">Patient ID</span><span class="val" style="color:var(--primary);font-weight:600;">${p.id}</span></div>
    <div class="info-row"><span class="lbl">Age</span><span class="val">${p.age} years</span></div>
    <div class="info-row"><span class="lbl">Blood Group</span><span class="val"><span class="badge badge-red">${p.blood}</span></span></div>
    <div class="info-row"><span class="lbl">Contact</span><span class="val">${p.contact}</span></div>
    <div class="info-row"><span class="lbl">Assigned Doctor</span><span class="val">${p.doctor}</span></div>
    <div class="info-row"><span class="lbl">Current Status</span><span class="val">${statusBadge(p.status)}</span></div>
  `;
}

function renderMyAppointments() {
  if (!currentUser || currentUser.role !== 'patient') return;
  const p = patients.find(x => x.id === currentUser.patientId);
  const myAppts = appointments.filter(a => a.patient === p.name);
  document.getElementById('my-appointments-tbody').innerHTML = myAppts.length
    ? myAppts.map(a => `<tr><td>${a.doctor}</td><td><span class="badge badge-blue">${a.dept}</span></td><td>${a.date}</td><td>${a.time}</td><td>${a.type}</td><td>${statusBadge(a.status)}</td></tr>`).join('')
    : `<tr><td colspan="6" style="text-align:center;color:var(--muted);padding:24px;">No appointments found. <a href="#" onclick="openModal('appointment')" style="color:var(--primary);">Book one now</a></td></tr>`;
}

function renderMyBills() {
  if (!currentUser || currentUser.role !== 'patient') return;
  const p = patients.find(x => x.id === currentUser.patientId);
  const myBills = bills.filter(b => b.patient === p.name);
  document.getElementById('my-bills-tbody').innerHTML = myBills.length
    ? myBills.map(b => `<tr><td style="font-weight:600;color:var(--primary);">${b.id}</td><td style="font-size:12px;color:var(--muted);">${b.services}</td><td style="font-weight:600;">₹${b.amount.toLocaleString()}</td><td>${b.date}</td><td>${b.payment !== '-' ? `<span class="badge badge-gray">${b.payment}</span>` : '—'}</td><td>${statusBadge(b.status)}</td></tr>`).join('')
    : `<tr><td colspan="6" style="text-align:center;color:var(--muted);padding:24px;">No billing records found</td></tr>`;
}

// ============ ADMIN RENDERS ============
function renderDashboard() {
  let rows = appointments.slice(0,5).map(a => `
    <tr>
      <td class="flex gap-8">${avatarHtml(a.patient)} ${a.patient}</td>
      <td>${a.doctor}</td>
      <td><span class="badge badge-blue">${a.dept}</span></td>
      <td>${a.time}</td>
      <td>${statusBadge(a.status)}</td>
    </tr>`).join('');
  document.getElementById('dash-appt-table').innerHTML = rows;

  const depts = [{name:'Cardiology',load:85},{name:'Neurology',load:72},{name:'Orthopedics',load:60},{name:'ICU',load:92},{name:'Pediatrics',load:55}];
  document.getElementById('dept-load').innerHTML = depts.map(d=>`
    <div style="margin-bottom:14px;">
      <div class="flex gap-8" style="justify-content:space-between;margin-bottom:4px;">
        <span style="font-size:13px;">${d.name}</span>
        <span style="font-size:12px;font-weight:600;color:${d.load>80?'#e84b4b':'#1e5cbe'};">${d.load}%</span>
      </div>
      <div class="progress"><div class="progress-fill" style="width:${d.load}%;background:${d.load>80?'#e84b4b':'#1e5cbe'};"></div></div>
    </div>`).join('');

  const alerts = [
    {icon:'🔴',msg:'ICU at 92% capacity',sub:'Critical threshold'},
    {icon:'🟡',msg:'Metformin stock low (80 units)',sub:'Reorder needed'},
    {icon:'🟡',msg:'5 pending bill payments',sub:'Follow up required'},
    {icon:'🟢',msg:'3 patients discharged today',sub:'Beds available'},
  ];
  document.getElementById('alerts-list').innerHTML = alerts.map(a=>`
    <div class="flex gap-8" style="padding:8px 0;border-bottom:1px solid #f0f4fb;">
      <span style="font-size:14px;">${a.icon}</span>
      <div><div style="font-size:13px;font-weight:500;">${a.msg}</div><div style="font-size:11px;color:#6b7a9e;">${a.sub}</div></div>
    </div>`).join('');
}

function renderPatients() {
  document.getElementById('patients-tbody').innerHTML = patients.map((p,i) => `
    <tr>
      <td style="font-weight:600;color:#1e5cbe;">${p.id}</td>
      <td class="flex gap-8">${avatarHtml(p.name)} ${p.name}</td>
      <td>${p.age}</td>
      <td><span class="badge badge-gray">${p.blood}</span></td>
      <td style="color:#6b7a9e;">${p.contact}</td>
      <td>${p.doctor}</td>
      <td>${statusBadge(p.status)}</td>
      <td class="flex gap-8">
        <button class="btn btn-ghost" style="padding:4px 10px;font-size:12px;" onclick="viewPatient(${i})">View</button>
        <button class="btn btn-danger" style="padding:4px 10px;font-size:12px;" onclick="deleteItem('patients',${i})">✕</button>
      </td>
    </tr>`).join('');
}

function renderDoctors() {
  const isAdmin = currentUser && currentUser.role === 'admin';
  document.getElementById('doctors-grid').innerHTML = doctors.map((d,i) => `
    <div class="doctor-card">
      <div class="doctor-avatar">${d.emoji}</div>
      <h4>${d.name}</h4>
      <p>${d.dept} • ${d.exp} experience</p>
      <div class="rating">${'★'.repeat(Math.floor(d.rating))}${'☆'.repeat(5-Math.floor(d.rating))} ${d.rating}</div>
      <div class="avail">${statusBadge(d.available?'Available':'Occupied')} &nbsp;<span style="font-size:12px;color:#6b7a9e;">${d.patients} active patients</span></div>
      <div style="margin-top:14px;display:flex;gap:8px;">
        <button class="btn btn-ghost" style="flex:1;font-size:12px;" onclick="viewDoctor(${i})">Profile</button>
        <button class="btn btn-primary" style="flex:1;font-size:12px;" onclick="bookApptForDoctor('${d.name}')">Book</button>
      </div>
    </div>`).join('');
  document.getElementById('add-doctor-btn').style.display = isAdmin ? '' : 'none';
}

function renderAppointments() {
  const filter = document.getElementById('appt-date-filter')?.value;
  const list = filter ? appointments.filter(a => a.date === filter) : appointments;
  document.getElementById('appointments-tbody').innerHTML = list.map((a,i) => `
    <tr>
      <td class="flex gap-8">${avatarHtml(a.patient)} ${a.patient}</td>
      <td>${a.doctor}</td>
      <td><span class="badge badge-blue">${a.dept}</span></td>
      <td>${a.date}</td>
      <td>${a.time}</td>
      <td>${a.type}</td>
      <td>${statusBadge(a.status)}</td>
      <td class="flex gap-8">
        <button class="btn btn-success" style="padding:4px 10px;font-size:12px;" onclick="changeApptStatus(${i})">Update</button>
        <button class="btn btn-danger" style="padding:4px 10px;font-size:12px;" onclick="deleteItem('appointments',${i})">✕</button>
      </td>
    </tr>`).join('');
}

function renderWards() {
  document.getElementById('wards-tbody').innerHTML = wards.map(w => {
    const avail = w.total - w.occupied;
    return `<tr>
      <td style="font-weight:500;">${w.name}</td><td>${w.type}</td><td>${w.total}</td><td>${w.occupied}</td>
      <td style="font-weight:600;color:${avail<5?'#e84b4b':'#00c48c'};">${avail}</td>
      <td>${statusBadge(avail===0?'Occupied':avail<5?'Critical':'Available')}</td>
    </tr>`;
  }).join('');
  const admissions = [
    {patient:'Vikram Singh',ward:'ICU',bed:'B-04',admitted:'Apr 12'},
    {patient:'Ananya Sharma',ward:'Cardiology',bed:'C-11',admitted:'Apr 14'},
    {patient:'Sunita Rao',ward:'Cardiology',bed:'C-14',admitted:'Apr 15'},
    {patient:'Rohit Patel',ward:'Surgical',bed:'S-07',admitted:'Apr 13'},
  ];
  document.getElementById('admissions-tbody').innerHTML = admissions.map(a=>`
    <tr>
      <td class="flex gap-8">${avatarHtml(a.patient)} ${a.patient}</td>
      <td>${a.ward}</td><td style="font-weight:600;">${a.bed}</td>
      <td style="color:#6b7a9e;">${a.admitted}</td>
      <td><button class="btn btn-success" style="padding:3px 10px;font-size:12px;" onclick="showToast('${a.patient} discharged!')">Discharge</button></td>
    </tr>`).join('');
}

function renderPharmacy() {
  document.getElementById('pharmacy-tbody').innerHTML = medicines.map((m,i)=>`
    <tr>
      <td style="font-weight:500;">${m.name}</td>
      <td><span class="badge badge-blue">${m.category}</span></td>
      <td style="font-weight:600;color:${m.stock===0?'#e84b4b':m.stock<100?'#f7a93b':'#00c48c'};">${m.stock}</td>
      <td>₹${m.price}</td><td style="color:#6b7a9e;">${m.expiry}</td>
      <td>${statusBadge(m.status)}</td>
    </tr>`).join('');
}

function renderBilling() {
  document.getElementById('billing-tbody').innerHTML = bills.map((b,i)=>`
    <tr>
      <td style="font-weight:600;color:#1e5cbe;">${b.id}</td>
      <td class="flex gap-8">${avatarHtml(b.patient)} ${b.patient}</td>
      <td style="font-size:12px;color:#6b7a9e;max-width:180px;">${b.services}</td>
      <td style="font-weight:600;">₹${b.amount.toLocaleString()}</td>
      <td>${b.date}</td>
      <td>${b.payment!=='-'?`<span class="badge badge-gray">${b.payment}</span>`:'-'}</td>
      <td>${statusBadge(b.status)}</td>
      <td><button class="btn btn-ghost" style="padding:4px 10px;font-size:12px;" onclick="printBill('${b.id}')">🖨 Print</button></td>
    </tr>`).join('');
}

function renderReports() {
  const months = ['Oct','Nov','Dec','Jan','Feb','Mar','Apr'];
  const values = [420,480,390,510,560,490,620];
  document.getElementById('monthly-stats').innerHTML = months.map((m,i)=>`
    <div class="flex gap-8" style="margin-bottom:12px;align-items:center;">
      <div style="width:36px;font-size:12px;color:#6b7a9e;">${m}</div>
      <div style="flex:1;height:22px;background:#f0f4fb;border-radius:6px;overflow:hidden;">
        <div style="height:100%;width:${(values[i]/700*100).toFixed(0)}%;background:#1e5cbe;border-radius:6px;display:flex;align-items:center;padding:0 8px;">
          <span style="font-size:11px;color:#fff;font-weight:600;">${values[i]}</span>
        </div>
      </div>
    </div>`).join('');

  const revenues = [{label:'OPD',pct:32,color:'#1e5cbe'},{label:'Pharmacy',pct:24,color:'#00c48c'},{label:'Surgery',pct:20,color:'#8b5cf6'},{label:'Labs',pct:14,color:'#f7a93b'},{label:'Other',pct:10,color:'#e84b4b'}];
  document.getElementById('revenue-breakdown').innerHTML = revenues.map(r=>`
    <div style="margin-bottom:14px;">
      <div class="flex gap-8" style="justify-content:space-between;margin-bottom:5px;">
        <span style="font-size:13px;">${r.label}</span><span style="font-size:12px;font-weight:600;">${r.pct}%</span>
      </div>
      <div class="progress"><div class="progress-fill" style="width:${r.pct}%;background:${r.color};"></div></div>
    </div>`).join('');

  const perfs = [
    {label:'Patient Satisfaction',value:'94%',icon:'😊'},{label:'Avg. Wait Time',value:'18 min',icon:'⏱'},
    {label:'Bed Turnover Rate',value:'3.2x',icon:'🔄'},{label:'Surgery Success',value:'98.4%',icon:'✅'},
    {label:'Readmission Rate',value:'4.1%',icon:'🔁'},{label:'Staff Efficiency',value:'87%',icon:'👩‍⚕️'},
  ];
  document.getElementById('perf-summary').innerHTML = perfs.map(p=>`
    <div class="stat-card">
      <div style="font-size:28px;margin-bottom:8px;">${p.icon}</div>
      <div style="font-size:22px;font-weight:700;color:#1e5cbe;">${p.value}</div>
      <div style="font-size:12px;color:#6b7a9e;margin-top:3px;">${p.label}</div>
    </div>`).join('');
}

// ============ MODALS ============
let currentModalType = '';
const modalForms = {
  patient: {
    title:'Register New Patient',
    fields:`<div class="grid-2">
      <div class="form-group"><label class="form-label">Full Name</label><input class="form-control-inner" id="f-name" placeholder="Patient name"></div>
      <div class="form-group"><label class="form-label">Age</label><input class="form-control-inner" id="f-age" type="number" placeholder="Age"></div>
      <div class="form-group"><label class="form-label">Blood Group</label><select class="form-control-inner" id="f-blood"><option>A+</option><option>A-</option><option>B+</option><option>B-</option><option>O+</option><option>O-</option><option>AB+</option><option>AB-</option></select></div>
      <div class="form-group"><label class="form-label">Contact</label><input class="form-control-inner" id="f-contact" placeholder="Phone number"></div>
      <div class="form-group"><label class="form-label">Assign Doctor</label><select class="form-control-inner" id="f-doctor">${doctors.map(d=>`<option>${d.name}</option>`).join('')}</select></div>
      <div class="form-group"><label class="form-label">Status</label><select class="form-control-inner" id="f-status"><option>Outpatient</option><option>Admitted</option><option>Critical</option><option>Post-Op</option></select></div>
    </div>`,
    save: () => {
      const name = document.getElementById('f-name').value;
      if (!name) { showToast('Please enter patient name'); return; }
      const newId = 'P' + String(patients.length+1).padStart(3,'0');
      patients.push({ id:newId, name, age:+document.getElementById('f-age').value, blood:document.getElementById('f-blood').value, contact:document.getElementById('f-contact').value, doctor:document.getElementById('f-doctor').value, ward:'OPD', status:document.getElementById('f-status').value });
      renderPatients(); closeModal(); showToast('Patient registered!');
    }
  },
  doctor: {
    title:'Add New Doctor',
    fields:`<div class="grid-2">
      <div class="form-group"><label class="form-label">Full Name</label><input class="form-control-inner" id="f-dname" placeholder="Dr. Name"></div>
      <div class="form-group"><label class="form-label">Department</label><select class="form-control-inner" id="f-dept"><option>Cardiology</option><option>Neurology</option><option>Orthopedics</option><option>Pediatrics</option><option>Surgery</option><option>Radiology</option><option>General Medicine</option></select></div>
      <div class="form-group"><label class="form-label">Experience</label><input class="form-control-inner" id="f-exp" placeholder="e.g. 5 yrs"></div>
      <div class="form-group"><label class="form-label">Availability</label><select class="form-control-inner" id="f-avail"><option value="1">Available</option><option value="0">On Leave</option></select></div>
    </div>`,
    save: () => {
      const name = document.getElementById('f-dname').value;
      if (!name) { showToast('Please enter doctor name'); return; }
      doctors.push({ id:'D00'+(doctors.length+1), name, dept:document.getElementById('f-dept').value, exp:document.getElementById('f-exp').value||'1 yr', patients:0, rating:4.5, available:!!+document.getElementById('f-avail').value, emoji:'👨‍⚕️' });
      renderDoctors(); closeModal(); showToast('Doctor added!');
    }
  },
  appointment: {
    title:'Book Appointment',
    fields:`<div class="grid-2">
      <div class="form-group"><label class="form-label">Patient Name</label><input class="form-control-inner" id="f-pname" placeholder="Patient name"></div>
      <div class="form-group"><label class="form-label">Doctor</label><select class="form-control-inner" id="f-adoc">${doctors.map(d=>`<option>${d.name}</option>`).join('')}</select></div>
      <div class="form-group"><label class="form-label">Date</label><input class="form-control-inner" id="f-adate" type="date"></div>
      <div class="form-group"><label class="form-label">Type</label><select class="form-control-inner" id="f-atype"><option>Check-up</option><option>Consultation</option><option>Follow-up</option><option>Surgery</option><option>Emergency</option></select></div>
    </div>
    <div class="form-group mt-12"><label class="form-label">Select Time Slot</label>
      <div class="time-slots" id="time-slots">${['09:00 AM','09:30 AM','10:00 AM','10:30 AM','11:00 AM','11:30 AM','02:00 PM','02:30 PM','03:00 PM','03:30 PM','04:00 PM','04:30 PM'].map((t,i)=>`<div class="slot ${i%5===2?'booked':'available'}" onclick="selectSlot(this,'${t}')">${t}</div>`).join('')}</div>
    </div>`,
    save: () => {
      let patient = document.getElementById('f-pname').value;
      const selected = document.querySelector('.slot.selected');
      // Auto-fill patient name for patient role
      if (!patient && currentUser?.role === 'patient') {
        const p = patients.find(x => x.id === currentUser.patientId);
        if (p) { patient = p.name; document.getElementById('f-pname').value = patient; }
      }
      if (!patient || !selected) { showToast('Please fill all fields and select a time slot'); return; }
      const doc = document.getElementById('f-adoc');
      const dept = doctors.find(d=>d.name===doc.value)?.dept||'General';
      appointments.push({ id:'A00'+(appointments.length+1), patient, doctor:doc.value, dept, date:document.getElementById('f-adate').value||'2026-04-15', time:selected.textContent, type:document.getElementById('f-atype').value, status:'Scheduled' });
      renderAppointments && renderAppointments();
      if (currentUser?.role === 'patient') { renderPatientPortal(); }
      closeModal(); showToast('Appointment booked!');
    }
  },
  medicine: {
    title:'Add Medicine',
    fields:`<div class="grid-2">
      <div class="form-group"><label class="form-label">Medicine Name</label><input class="form-control-inner" id="f-mname" placeholder="Name & dosage"></div>
      <div class="form-group"><label class="form-label">Category</label><select class="form-control-inner" id="f-mcat"><option>Analgesic</option><option>Antibiotic</option><option>Antidiabetic</option><option>Cardiac</option><option>Gastric</option><option>Antihypertensive</option><option>Vitamin</option></select></div>
      <div class="form-group"><label class="form-label">Stock Quantity</label><input class="form-control-inner" id="f-mstock" type="number" placeholder="Units"></div>
      <div class="form-group"><label class="form-label">Unit Price (₹)</label><input class="form-control-inner" id="f-mprice" type="number" placeholder="Price"></div>
      <div class="form-group"><label class="form-label">Expiry Date</label><input class="form-control-inner" id="f-mexpiry" placeholder="YYYY-MM"></div>
    </div>`,
    save: () => {
      const name = document.getElementById('f-mname').value;
      if (!name) { showToast('Please enter medicine name'); return; }
      const stock = +document.getElementById('f-mstock').value;
      medicines.push({ name, category:document.getElementById('f-mcat').value, stock, price:+document.getElementById('f-mprice').value, expiry:document.getElementById('f-mexpiry').value||'2027-01', status:stock===0?'Out of Stock':stock<100?'Low Stock':'In Stock' });
      renderPharmacy(); closeModal(); showToast('Medicine added!');
    }
  },
  bill: {
    title:'Generate Bill',
    fields:`<div class="grid-2">
      <div class="form-group"><label class="form-label">Patient Name</label><input class="form-control-inner" id="f-bpatient" placeholder="Patient name"></div>
      <div class="form-group"><label class="form-label">Payment Method</label><select class="form-control-inner" id="f-bpay"><option>Cash</option><option>Card</option><option>UPI</option><option>Insurance</option></select></div>
    </div>
    <div class="form-group"><label class="form-label">Services Provided</label><input class="form-control-inner" id="f-bservices" placeholder="e.g. Consultation, X-Ray, Blood Test"></div>
    <div class="form-group"><label class="form-label">Total Amount (₹)</label><input class="form-control-inner" id="f-bamount" type="number" placeholder="Amount"></div>`,
    save: () => {
      const patient = document.getElementById('f-bpatient').value;
      if (!patient) { showToast('Please enter patient name'); return; }
      const newId = 'B' + String(bills.length+1).padStart(3,'0');
      bills.push({ id:newId, patient, services:document.getElementById('f-bservices').value||'General Services', amount:+document.getElementById('f-bamount').value||0, date:new Date().toISOString().slice(0,10), payment:document.getElementById('f-bpay').value, status:'Pending' });
      renderBilling(); closeModal(); showToast('Bill generated!');
    }
  }
};

function openModal(type, prefill) {
  currentModalType = type;
  const cfg = modalForms[type];
  if (!cfg) return;
  document.getElementById('modal-title').textContent = cfg.title;
  document.getElementById('modal-body').innerHTML = cfg.fields;
  document.getElementById('modal-save-btn').onclick = cfg.save;
  document.getElementById('modal-overlay').classList.add('open');
  if (prefill && type === 'appointment') setTimeout(() => { const el = document.getElementById('f-adoc'); if(el) el.value = prefill; }, 50);
  if (type === 'appointment' && currentUser?.role === 'patient') {
    setTimeout(() => {
      const el = document.getElementById('f-pname');
      const p = patients.find(x => x.id === currentUser.patientId);
      if (el && p) { el.value = p.name; el.readOnly = true; el.style.background = '#f8fafc'; }
    }, 50);
  }
}

function closeModal() { document.getElementById('modal-overlay').classList.remove('open'); }
function closeModalOnOverlay(e) { if (e.target.id === 'modal-overlay') closeModal(); }

function selectSlot(el) {
  document.querySelectorAll('.slot.selected').forEach(s => { s.classList.remove('selected'); s.classList.add('available'); });
  if (!el.classList.contains('booked')) { el.classList.add('selected'); el.classList.remove('available'); }
}

function deleteItem(type, idx) {
  if (type === 'patients') { patients.splice(idx,1); renderPatients(); }
  if (type === 'appointments') { appointments.splice(idx,1); renderAppointments(); }
  showToast('Record deleted');
}

function changeApptStatus(idx) {
  const statuses = ['Scheduled','Confirmed','Waiting','In Progress','Completed','Cancelled'];
  const cur = appointments[idx].status;
  appointments[idx].status = statuses[(statuses.indexOf(cur)+1)%statuses.length];
  renderAppointments();
  showToast(`Status → ${appointments[idx].status}`);
}

function filterTable(tableId, query) {
  const q = query.toLowerCase();
  document.querySelectorAll(`#${tableId} tbody tr`).forEach(tr => {
    tr.style.display = tr.textContent.toLowerCase().includes(q) ? '' : 'none';
  });
}

function viewPatient(idx) { const p=patients[idx]; showToast(`${p.name} · ${p.id} · ${p.status}`); }
function viewDoctor(idx) { const d=doctors[idx]; showToast(`${d.name} — ${d.dept} | ${d.patients} patients`); }
function bookApptForDoctor(docName) {
  if (currentUser?.role === 'patient') {
    navigate('my-appointments', document.querySelector('#patient-nav [onclick*=my-appointments]'));
  } else {
    navigate('appointments', document.querySelector('#admin-nav [onclick*=appointments]'));
  }
  setTimeout(() => openModal('appointment', docName), 100);
}
function printBill(id) { showToast(`Printing bill ${id}...`); }

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.style.display = 'block';
  setTimeout(() => t.style.display = 'none', 3000);
}
