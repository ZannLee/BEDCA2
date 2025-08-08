document.getElementById('logoutButton').addEventListener('click', (e) => {
  e.preventDefault(); // prevent the default anchor action
  localStorage.removeItem('token');
  localStorage.removeItem('userId'); // if you store userId too
  window.location.href = '/index.html'; // redirect to login page
});
