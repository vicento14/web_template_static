document.getElementById('login_form').addEventListener('submit', e => {
  e.preventDefault();
  login();
});

const login = () => {
  let loading = `<span class="spinner-border spinner-border-sm mr-1" role="status" aria-hidden="true" id="loading"></span>`;
  document.getElementById("login").insertAdjacentHTML('afterbegin', loading);
  document.getElementById("login").setAttribute('disabled', true);
  Swal.fire({
    icon: 'info',
    title: 'Signing In Please Wait...',
    text: 'Info',
    showConfirmButton: false,
    allowOutsideClick: false,
    allowEscapeKey: false,
    allowEnterKey: false
  });

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  $.ajax({
    url: 'http://127.0.0.1:91/Login/SignIn',
    type: 'POST',
    cache: false,
    crossDomain: true,
    data: {
      username: username,
      password: password
    },
    success: function (response) {
      if (response.message == 'success') {
        localStorage.setItem('wts_token', response.token);
        localStorage.setItem('wts_username', response.username);
        localStorage.setItem('wts_full_name', response.full_name);
        localStorage.setItem('wts_section', response.section);
        localStorage.setItem('wts_role', response.role);

        if (response.role == 'admin') {
          window.location.href = "page/admin/dashboard.html";
        } else if (response.role == 'user') {
          window.location.href = "page/user/pagination.html";
        }
      } else if (response.message == 'failed') {
        document.getElementById("loading").remove();
        document.getElementById("login").removeAttribute('disabled');
        swal.close();
        Swal.fire({
          icon: 'info',
          title: 'Account Sign In',
          text: 'Sign In Failed. Maybe an incorrect credential or account not found',
          showConfirmButton: false,
          timer: 2000
        });
      } else {
        document.getElementById("loading").remove();
        document.getElementById("login").removeAttribute('disabled');
        swal.close();
        Swal.fire({
          icon: 'error',
          title: 'Account Sign In Error',
          text: `Call IT Personnel Immediately!!! They will fix it right away. Error: ${response}`,
          showConfirmButton: false,
          timer: 2000
        });
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.error('Error:', textStatus, errorThrown);
    }
  });
}