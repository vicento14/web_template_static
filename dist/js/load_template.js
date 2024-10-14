function load_template(url, elementId) {
  fetch(url)
    .then(response => response.text())
    .then(data => {
      document.getElementById(elementId).innerHTML = data;

      if (elementId == 'sidebar') {
        const full_name = localStorage.getItem('wts_full_name');
        const section = localStorage.getItem('wts_section');

        document.getElementById('sidebar_title_role').innerHTML = `&ensp;WEB &ensp;|&ensp; ${section}`;
        document.getElementById('sidebar_name').innerHTML = full_name;

        let url_path = window.location.pathname;

        switch (url_path) {
          case "/web_template_static/page/admin/dashboard.html":
          case "/web_template_static/page/admin/dashboard.html#":
            document.getElementById('sidebar_menu_label_dashboard').classList.add('active');
            break;
          case "/web_template_static/page/admin/accounts.html":
          case "/web_template_static/page/admin/accounts.html#":
            document.getElementById('sidebar_menu_label_accounts').classList.add('active');
            break;
          case "/web_template_static/page/admin/sample1.html":
          case "/web_template_static/page/admin/sample1.html#":
            document.getElementById('sidebar_menu_label_sample1').classList.add('active');
            break;
          case "/web_template_static/page/user/pagination.html":
          case "/web_template_static/page/user/pagination.html#":
            document.getElementById('sidebar_menu_label_pagination').classList.add('active');
            break;
          case "/web_template_static/page/user/load_more.html":
          case "/web_template_static/page/user/load_more.html#":
            document.getElementById('sidebar_menu_label_load_more').classList.add('active');
            break;
          case "/web_template_static/page/user/table_switching.html":
          case "/web_template_static/page/user/table_switching.html#":
            document.getElementById('sidebar_menu_label_table_switching').classList.add('active');
            break;
          case "/web_template_static/page/user/ts_lm.html":
          case "/web_template_static/page/user/ts_lm.html#":
            document.getElementById('sidebar_menu_label_ts_lm').classList.add('active');
            break;
          case "/web_template_static/page/user/keyup_search.html":
          case "/web_template_static/page/user/keyup_search.html#":
            document.getElementById('sidebar_menu_label_keyup_search').classList.add('active');
            break;
          default:
        }

        // Logout Modal
        const logoutButton = document.getElementById('btnLogoutSidebar');
        if (logoutButton) {
          logoutButton.addEventListener('click', function () {
            fetch('../../modals/logout_modal.html')
              .then(response => response.text())
              .then(data => {
                // Create a temporary DOM element to hold the fetched HTML
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = data;

                // Get the template from the fetched HTML
                const template = tempDiv.querySelector('#logout_modal_template');
                const clone = document.importNode(template.content, true);

                // Append the cloned template to the body
                document.body.appendChild(clone);

                const logout_modal_form = document.getElementById('logout_modal_form');
                if (logout_modal_form) {
                  // Logout Function
                  logout_modal_form.addEventListener('submit', function (e) {
                    e.preventDefault();

                    localStorage.removeItem('wts_token');
                    localStorage.removeItem('wts_username');
                    localStorage.removeItem('wts_full_name');
                    localStorage.removeItem('wts_section');
                    localStorage.removeItem('wts_role');
                    
                    window.location.href = '../../';
                  });
                } else {
                  console.log('Element with ID logout_modal_form not found.');
                }

                // Show the modal using Bootstrap's modal method
                $('#logout_modal').modal('show');

                // Clean up the modal after it's closed
                $('#logout_modal').on('hidden.bs.modal', function () {
                  $(this).remove(); // Remove modal from DOM
                });
              })
              .catch(error => console.error('Error loading modal template:', error));
          });
        } else {
          console.log('Element with ID btnLogoutSidebar not found.');
        }
      } else if (elementId == 'content_header') {
        let url_path = window.location.pathname;

        switch (url_path) {
          case "/web_template_static/page/admin/dashboard.html":
          case "/web_template_static/page/admin/dashboard.html#":
            document.getElementById('content_header_page_title').innerHTML = 'Dashboard';
            document.getElementById('content_header_page_title_bc').innerHTML = 'Dashboard';
            break;
          case "/web_template_static/page/admin/accounts.html":
          case "/web_template_static/page/admin/accounts.html#":
            document.getElementById('content_header_page_title').innerHTML = 'Account Management';
            document.getElementById('content_header_page_title_bc').innerHTML = 'Account Management';
            break;
          case "/web_template_static/page/admin/sample1.html":
          case "/web_template_static/page/admin/sample1.html#":
            document.getElementById('content_header_page_title').innerHTML = 'Sample 1';
            document.getElementById('content_header_page_title_bc').innerHTML = 'Sample 1';
            break;
          case "/web_template_static/page/user/pagination.html":
          case "/web_template_static/page/user/pagination.html#":
            document.getElementById('content_header_page_title').innerHTML = 'Pagination';
            document.getElementById('content_header_page_title_bc').innerHTML = 'Pagination';
            break;
          case "/web_template_static/page/user/load_more.html":
          case "/web_template_static/page/user/load_more.html#":
            document.getElementById('content_header_page_title').innerHTML = 'Load More';
            document.getElementById('content_header_page_title_bc').innerHTML = 'Load More';
            break;
          case "/web_template_static/page/user/table_switching.html":
          case "/web_template_static/page/user/table_switching.html#":
            document.getElementById('content_header_page_title').innerHTML = 'Table Switching';
            document.getElementById('content_header_page_title_bc').innerHTML = 'Table Switching';
            break;
          case "/web_template_static/page/user/ts_lm.html":
          case "/web_template_static/page/user/ts_lm.html#":
            document.getElementById('content_header_page_title').innerHTML = 'Table Switch + Load More';
            document.getElementById('content_header_page_title_bc').innerHTML = 'Table Switch + Load More';
            break;
          case "/web_template_static/page/user/keyup_search.html":
          case "/web_template_static/page/user/keyup_search.html#":
            document.getElementById('content_header_page_title').innerHTML = 'Keyup Search';
            document.getElementById('content_header_page_title_bc').innerHTML = 'Keyup Search';
            break;
          default:
        }
      }
    })
    .catch(error => console.error('Error loading template:', error));
}