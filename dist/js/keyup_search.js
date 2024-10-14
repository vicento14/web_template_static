// AJAX IN PROGRESS GLOBAL VARS
let search_accounts_ajax_in_progress = false;

// DOMContentLoaded function
document.addEventListener("DOMContentLoaded", () => {
  search_accounts(1);
});

var typingTimerEmployeeNoSearch; // Timer identifier Employee No Search
var doneTypingInterval = 250; // Time in ms

// On keyup, start the countdown
document.getElementById("employee_no_search").addEventListener('keyup', e => {
  clearTimeout(typingTimerEmployeeNoSearch);
  typingTimerEmployeeNoSearch = setTimeout(doneTypingSearchAccounts, doneTypingInterval);
});

// On keydown, clear the countdown
document.getElementById("employee_no_search").addEventListener('keydown', e => {
  clearTimeout(typingTimerEmployeeNoSearch);
});

// User is "finished typing," do something
function doneTypingSearchAccounts() {
  search_accounts(1);
}

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
  $.ajax({
    url: 'http://127.0.0.1:91/UserAccounts/Count',
    type: 'GET',
    cache: false,
    crossDomain: true,
    data: {
      employee_no: employee_no
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
  const current_page = parseInt(sessionStorage.getItem('accounts_table_pagination'));
  $.ajax({
    url: 'http://127.0.0.1:91/UserAccounts/SearchLastPageK',
    type: 'GET',
    cache: false,
    crossDomain: true,
    data: {
      employee_no: employee_no
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

  const employee_no_1 = sessionStorage.getItem('employee_no_search');

  if (current_page > 1) {
    switch (true) {
      case employee_no !== employee_no_1:
        employee_no = employee_no_1;
        break;
      default:
    }
    /*if (employee_no !== employee_no_1) {
        employee_no = employee_no_1;
    }*/
  } else {
    sessionStorage.setItem('employee_no_search', employee_no);
  }

  // Set the flag to true as we're starting an AJAX call
  search_accounts_ajax_in_progress = true;

  $.ajax({
    url: 'http://127.0.0.1:91/UserAccounts/SearchPageK',
    type: 'GET',
    cache: false,
    crossDomain: true,
    data: {
      employee_no: employee_no,
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