let currentUserId = null;
let currentCourse = '';

function navigate(sectionId){
  document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
  document.getElementById(sectionId).classList.add('active');
}

async function signup(){
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const res = await fetch('https://mugridgestudios.onrender.com/api/auth/signup', {
    method:'POST', headers:{'Content-Type':'application/json'},
    body:JSON.stringify({username,password})
  });
  const data = await res.json();
  document.getElementById('auth-msg').textContent = data.success ? 'Signed up!' : data.error;
  if(data.success) currentUserId = data.userId;
}

async function login(){
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const res = await fetch('http://localhost:3000/api/auth/login', {
    method:'POST', headers:{'Content-Type':'application/json'},
    body:JSON.stringify({username,password})
  });
  const data = await res.json();
  document.getElementById('auth-msg').textContent = data.success ? 'Logged in!' : data.error;
  if(data.success) currentUserId = data.userId;
}

function selectCourse(course){
  if(!currentUserId) { alert('Please login first'); return; }
  currentCourse = course;
  navigate('editor');
  document.getElementById('code').value = `// Start coding for ${course}`;
}

function runCode(){
  const code = document.getElementById('code').value;
  try {
    const result = eval(code);
    document.getElementById('output').textContent = result!==undefined?result:'';
    // Save progress
    fetch('http://localhost:3000/api/auth/progress',{
      method:'POST', headers:{'Content-Type':'application/json'},
      body:JSON.stringify({userId:currentUserId, course:currentCourse, completed:1})
    });
  } catch(e){ document.getElementById('output').textContent = 'Error: '+e; }
}
