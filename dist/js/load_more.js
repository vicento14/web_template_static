// AJAX IN PROGRESS GLOBAL VARS
let search_accounts_ajax_in_progress = false;

// DOMContentLoaded function
document.addEventListener("DOMContentLoaded", () => {
  search_accounts(1);
});

// Reference: Table Responsive Scroll Event (Body)
/*window.onscroll = function(ev){
if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
   get_next_page();
}*/

// Table Responsive Scroll Event for Load More
document.getElementById("accounts_table_res").addEventListener("scroll", () => {
  const scrollTop = document.getElementById("accounts_table_res").scrollTop;
  const scrollHeight = document.getElementById("accounts_table_res").scrollHeight;
  const offsetHeight = document.getElementById("accounts_table_res").offsetHeight;

  if (search_accounts_ajax_in_progress == false) {
    //check if the scroll reached the bottom
    if ((offsetHeight + scrollTop + 1) >= scrollHeight) {
      get_next_page();
    }
  }
});

const get_next_page = () => {
  const current_page = parseInt(sessionStorage.getItem('accounts_table_pagination'));
  let total = parseInt(sessionStorage.getItem('count_rows'));
  const last_page = parseInt(sessionStorage.getItem('last_page'));
  const next_page = current_page + 1;
  if (next_page <= last_page && total > 0) {
    search_accounts(next_page);
  }
}

const count_accounts = () => {
  const employee_no = sessionStorage.getItem('employee_no_search');
  const full_name = sessionStorage.getItem('full_name_search');
  const user_type = sessionStorage.getItem('user_type_search');
  $.ajax({
    url: 'http://127.0.0.1:91/UserAccounts/Count',
    type: 'GET',
    cache: false,
    crossDomain: true,
    data: {
      employee_no: employee_no,
      full_name: full_name,
      user_type: user_type
    },
    success: function (response) {
      let total = parseInt(response.total);
      sessionStorage.setItem('count_rows', response.total);
      const count = `Total: ${response.total}`;
      document.getElementById("accounts_table_info").innerHTML = count;

      if (total > 0) {
        load_accounts_last_page();
        /*document.getElementById("btnNextPage").style.display = "block";
        document.getElementById("btnNextPage").removeAttribute('disabled');*/
      } else {
        document.getElementById("btnNextPage").style.display = "none";
        document.getElementById("btnNextPage").setAttribute('disabled', true);
      }
    }
  });
}

const load_accounts_last_page = () => {
  const employee_no = sessionStorage.getItem('employee_no_search');
  const full_name = sessionStorage.getItem('full_name_search');
  const user_type = sessionStorage.getItem('user_type_search');
  const current_page = parseInt(sessionStorage.getItem('accounts_table_pagination'));
  $.ajax({
    url: 'http://127.0.0.1:91/UserAccounts/SearchLastPageL',
    type: 'GET',
    cache: false,
    crossDomain: true,
    data: {
      employee_no: employee_no,
      full_name: full_name,
      user_type: user_type
    },
    success: function (response) {
      let number_of_page = parseInt(response.number_of_page);
      sessionStorage.setItem('last_page', response.number_of_page);
      let total = parseInt(sessionStorage.getItem('count_rows'));
      const next_page = current_page + 1;
      if (next_page > number_of_page || total < 1) {
        document.getElementById("btnNextPage").style.display = "none";
        document.getElementById("btnNextPage").setAttribute('disabled', true);
      } else {
        document.getElementById("btnNextPage").style.display = "block";
        document.getElementById("btnNextPage").removeAttribute('disabled');
      }
    }
  });
}

const search_accounts = current_page => {
  // If an AJAX call is already in progress, return immediately
  if (search_accounts_ajax_in_progress) {
    return;
  }

  const employee_no = document.getElementById('employee_no_search').value;
  const full_name = document.getElementById('full_name_search').value;
  const user_type = document.getElementById('user_type_search').value;

  const employee_no_1 = sessionStorage.getItem('employee_no_search');
  const full_name_1 = sessionStorage.getItem('full_name_search');
  const user_type_1 = sessionStorage.getItem('user_type_search');
  if (current_page > 1) {
    switch (true) {
      case employee_no !== employee_no_1:
      case full_name !== full_name_1:
      case user_type !== user_type_1:
        employee_no = employee_no_1;
        full_name = full_name_1;
        user_type = user_type_1;
        break;
      default:
    }
    /*if (employee_no !== employee_no_1 || full_name !== full_name_1 || user_type !== user_type_1) {
        employee_no = employee_no_1;
        full_name = full_name_1;
        user_type = user_type_1;
    }*/
  } else {
    sessionStorage.setItem('employee_no_search', employee_no);
    sessionStorage.setItem('full_name_search', full_name);
    sessionStorage.setItem('user_type_search', user_type);
  }

  // Set the flag to true as we're starting an AJAX call
  search_accounts_ajax_in_progress = true;

  $.ajax({
    url: 'http://127.0.0.1:91/UserAccounts/SearchPageL',
    type: 'GET',
    cache: false,
    crossDomain: true,
    data: {
      employee_no: employee_no,
      full_name: full_name,
      user_type: user_type,
      current_page: current_page
    },
    beforeSend: (jqXHR, settings) => {
      document.getElementById("btnNextPage").setAttribute('disabled', true);
      const loading = `<tr id="loading"><td colspan="6" style="text-align:center;"><div class="spinner-border text-dark" role="status"><span class="sr-only">Loading...</span></div></td></tr>`;
      if (current_page == 1) {
        document.getElementById("list_of_accounts").innerHTML = loading;
        sessionStorage.setItem('accounts_table_page_first_result', '0');
      } else {
        $('#accounts_table tbody').append(loading);
      }
      jqXHR.url = settings.url;
      jqXHR.type = settings.type;
    },
    success: function (response) {
      $('#loading').remove();

      let table_row = "";
      try {
        let response_array = response;
        console.log(response_array);
        if (response_array.length) {
          Object.keys(response_array).forEach(key => {
            if (typeof response_array[key].message != "undefined") {
              console.log(response_array[key].message);
              table_row += `<tr><td colspan="6" style="text-align:center; color:red;">${response_array[key].message}</td></tr>`;
            } else {
              console.log(`${response_array[key].id} | ${response_array[key].idNumber} | ${response_array[key].username} | ${response_array[key].fullName} | ${response_array[key].section} | ${response_array[key].role}`);
              let c = parseInt(sessionStorage.getItem('accounts_table_page_first_result'));
              table_row += `
                                <tr>
                                <td>${++c}</td>
                                <td>${response_array[key].idNumber}</td>
                                <td>${response_array[key].username}</td>
                                <td>${response_array[key].fullName}</td>
                                <td>${response_array[key].section}</td>
                                <td>${response_array[key].role}</td>
                                </tr>
                            `;
              sessionStorage.setItem('accounts_table_page_first_result', c.toString());
            }
          });
        } else {
          console.log('No Results Found');
          table_row += `<tr><td colspan="6" style="text-align:center; color:red;">No Results Found</td></tr>`;
        }
      } catch (error) {
        console.error(error);
      }

      document.getElementById("btnNextPage").removeAttribute('disabled');
      if (current_page == 1) {
        $('#accounts_table tbody').html(table_row);
      } else {
        $('#accounts_table tbody').append(table_row);
      }
      sessionStorage.setItem('accounts_table_pagination', current_page);
      count_accounts();
      // Set the flag back to false as the AJAX call has completed
      search_accounts_ajax_in_progress = false;
    }
  }).fail((jqXHR, textStatus, errorThrown) => {
    console.error(`System Error : Call IT Personnel Immediately!!! They will fix it right away. Error: url: ${jqXHR.url}, method: ${jqXHR.type} ( HTTP ${jqXHR.status} - ${jqXHR.statusText} ) Press F12 to see Console Log for more info.`);
    $('#loading').remove();
    document.getElementById("btnNextPage").removeAttribute('disabled');
    // Set the flag back to false as the AJAX call has completed
    search_accounts_ajax_in_progress = false;
  });
}