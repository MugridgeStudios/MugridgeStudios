// Set your backend URL
const API_URL = 'https://mugridgestudios.onrender.com';

let currentUserId = null;
let currentCourse = '';

// Navigation between sections
function navigate(sectionId){
  document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
  document.getElementById(sectionId).classList.add('active');
}

// Signup function
async function signup(){
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  try {
    const res = await fetch(`${API_URL}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    document.getElementById('auth-msg').textContent = data.success ? 'Signed up!' : data.error;
    if(data.success) currentUserId = data.userId;
  } catch(e) {
    document.getElementById('auth-msg').textContent = 'Error connecting to backend';
  }
}

// Login function
async function login(){
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  try {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    document.getElementById('auth-msg').textContent = data.success ? 'Logged in!' : data.error;
    if(data.success) {
      currentUserId = data.userId;
      loadProgress();
    }
  } catch(e) {
    document.getElementById('auth-msg').textContent = 'Error connecting to backend';
  }
}

// Select a course
function selectCourse(course){
  if(!currentUserId) { alert('Please login first'); return; }
  currentCourse = course;
  navigate('editor');
  document.getElementById('code').value = `// Start coding for ${course}`;
}

// Run code and save progress
async function runCode(){
  const code = document.getElementById('code').value;
  try {
    const result = eval(code);
    document.getElementById('output').textContent = result!==undefined ? result : '';

    // Save progress
    await fetch(`${API_URL}/api/auth/progress`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: currentUserId, course: currentCourse, completed: 1 })
    });
  } catch(e){
    document.getElementById('output').textContent = 'Error: '+e;
  }
}

// Load user progress
async function loadProgress(){
  try {
    const res = await fetch(`${API_URL}/api/auth/progress/${currentUserId}`);
    const data = await res.json();
    console.log('Progress loaded:', data); // optional: display in UI later
  } catch(e){
    console.log('Error fetching progress:', e);
  }
}
