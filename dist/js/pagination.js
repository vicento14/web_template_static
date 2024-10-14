// AJAX IN PROGRESS GLOBAL VARS
let search_accounts_ajax_in_progress = false;

// DOMContentLoaded function
document.addEventListener("DOMContentLoaded", () => {
  search_accounts(1, 0);
});

const th_order_by = order_by_code => {
  const current_page = parseInt(document.getElementById("accounts_table_pagination").value.trim());

  // Table Header Sort Behavior
  switch (order_by_code) {
    case 0:
    case 1:
      document.getElementById("employee_no_th").setAttribute('onclick', 'th_order_by(2)');
      document.getElementById("username_th").setAttribute('onclick', 'th_order_by(4)');
      document.getElementById("fullname_th").setAttribute('onclick', 'th_order_by(6)');
      document.getElementById("section_th").setAttribute('onclick', 'th_order_by(8)');
      document.getElementById("role_th").setAttribute('onclick', 'th_order_by(10)');
      break;
    case 2:
    case 3:
      document.getElementById("c_th").setAttribute('onclick', 'th_order_by(0)');
      document.getElementById("username_th").setAttribute('onclick', 'th_order_by(4)');
      document.getElementById("fullname_th").setAttribute('onclick', 'th_order_by(6)');
      document.getElementById("section_th").setAttribute('onclick', 'th_order_by(8)');
      document.getElementById("role_th").setAttribute('onclick', 'th_order_by(10)');
      break;
    case 4:
    case 5:
      document.getElementById("c_th").setAttribute('onclick', 'th_order_by(0)');
      document.getElementById("employee_no_th").setAttribute('onclick', 'th_order_by(2)');
      document.getElementById("fullname_th").setAttribute('onclick', 'th_order_by(6)');
      document.getElementById("section_th").setAttribute('onclick', 'th_order_by(8)');
      document.getElementById("role_th").setAttribute('onclick', 'th_order_by(10)');
      break;
    case 6:
    case 7:
      document.getElementById("c_th").setAttribute('onclick', 'th_order_by(0)');
      document.getElementById("employee_no_th").setAttribute('onclick', 'th_order_by(2)');
      document.getElementById("username_th").setAttribute('onclick', 'th_order_by(4)');
      document.getElementById("section_th").setAttribute('onclick', 'th_order_by(8)');
      document.getElementById("role_th").setAttribute('onclick', 'th_order_by(10)');
      break;
    case 8:
    case 9:
      document.getElementById("c_th").setAttribute('onclick', 'th_order_by(0)');
      document.getElementById("employee_no_th").setAttribute('onclick', 'th_order_by(2)');
      document.getElementById("username_th").setAttribute('onclick', 'th_order_by(4)');
      document.getElementById("fullname_th").setAttribute('onclick', 'th_order_by(6)');
      document.getElementById("role_th").setAttribute('onclick', 'th_order_by(10)');
      break;
    case 10:
    case 11:
      document.getElementById("c_th").setAttribute('onclick', 'th_order_by(0)');
      document.getElementById("employee_no_th").setAttribute('onclick', 'th_order_by(2)');
      document.getElementById("username_th").setAttribute('onclick', 'th_order_by(4)');
      document.getElementById("fullname_th").setAttribute('onclick', 'th_order_by(6)');
      document.getElementById("section_th").setAttribute('onclick', 'th_order_by(8)');
      break;
    default:
  }

  search_accounts(current_page, order_by_code);
}

document.getElementById("accounts_table_pagination").addEventListener("keyup", e => {
  const current_page = parseInt(document.getElementById("accounts_table_pagination").value.trim());
  const order_by_code = parseInt(sessionStorage.getItem('order_by_code'));
  //const total = document.getElementById("count_rows").value;
  let total = parseInt(sessionStorage.getItem('count_rows'));
  const last_page = parseInt(sessionStorage.getItem('last_page'));
  if (e.which === 13) {
    e.preventDefault();
    console.log(total);
    if (current_page != 0 && current_page <= last_page && total > 0) {
      search_accounts(current_page, order_by_code);
    }
  }
});

const get_prev_page = () => {
  const current_page = parseInt(sessionStorage.getItem('accounts_table_pagination'));
  const order_by_code = parseInt(sessionStorage.getItem('order_by_code'));
  //const total = parseInt(document.getElementById("count_rows").value);
  let total = parseInt(sessionStorage.getItem('count_rows'));
  const prev_page = current_page - 1;
  if (prev_page > 0 && total > 0) {
    search_accounts(prev_page, order_by_code);
  }
}

const get_next_page = () => {
  const current_page = parseInt(sessionStorage.getItem('accounts_table_pagination'));
  const order_by_code = parseInt(sessionStorage.getItem('order_by_code'));
  //const total = parseInt(document.getElementById("count_rows").value);
  let total = parseInt(sessionStorage.getItem('count_rows'));
  const last_page = parseInt(sessionStorage.getItem('last_page'));
  const next_page = current_page + 1;
  if (next_page <= last_page && total > 0) {
    search_accounts(next_page, order_by_code);
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
      //document.getElementById("count_rows").value = response;
      sessionStorage.setItem('count_rows', response.total);
      const count = `Total: ${response.total}`;
      document.getElementById("accounts_table_info").innerHTML = count;

      if (total > 0) {
        load_accounts_pagination();
        document.getElementById("btnPrevPage").removeAttribute('disabled');
        document.getElementById("btnNextPage").removeAttribute('disabled');
        document.getElementById("accounts_table_pagination").removeAttribute('disabled');
      } else {
        document.getElementById("btnPrevPage").setAttribute('disabled', true);
        document.getElementById("btnNextPage").setAttribute('disabled', true);
        document.getElementById("accounts_table_pagination").setAttribute('disabled', true);
      }
    }
  });
}

const load_accounts_pagination = () => {
  const employee_no = sessionStorage.getItem('employee_no_search');
  const full_name = sessionStorage.getItem('full_name_search');
  const user_type = sessionStorage.getItem('user_type_search');
  const current_page = parseInt(sessionStorage.getItem('accounts_table_pagination'));
  $.ajax({
    url: 'http://127.0.0.1:91/UserAccounts/SearchPaginationP',
    type: 'GET',
    cache: false,
    crossDomain: true,
    data: {
      employee_no: employee_no,
      full_name: full_name,
      user_type: user_type
    },
    success: function (response) {
      let page_options = "";
      try {
        let response_array = response;
        console.log(response_array);
        if (response_array.length) {
          Object.keys(response_array).forEach(key => {
            if (typeof response_array[key].message != "undefined") {
              console.log(response_array[key].message);
              page_options += `<option>${response_array[key].message}</option>`;
            } else {
              console.log(`${response_array[key]}`);
              page_options += `<option value="${response_array[key]}">${response_array[key]}</option>`;
            }
          });
        } else {
          console.log('No Pages Found');
        }
      } catch (error) {
        console.error(error);
      }

      $('#accounts_table_paginations').html(page_options);
      $('#accounts_table_pagination').val(current_page);
      let last_page_check = document.getElementById("accounts_table_paginations").innerHTML;
      if (last_page_check != '') {
        let last_page = document.getElementById("accounts_table_paginations").lastChild.text;
        sessionStorage.setItem('last_page', last_page);
      }
    }
  });
}

const search_accounts = (current_page, order_by_code) => {
  // If an AJAX call is already in progress, return immediately
  if (search_accounts_ajax_in_progress) {
    return;
  }

  //let order_by_code = 0;

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
    url: 'http://127.0.0.1:91/UserAccounts/SearchPageP',
    type: 'GET',
    cache: false,
    crossDomain: true,
    data: {
      employee_no: employee_no,
      full_name: full_name,
      user_type: user_type,
      current_page: current_page,
      order_by_code: order_by_code
    },
    beforeSend: (jqXHR, settings) => {
      document.getElementById("btnPrevPage").setAttribute('disabled', true);
      document.getElementById("accounts_table_pagination").setAttribute('disabled', true);
      document.getElementById("btnNextPage").setAttribute('disabled', true);
      const loading = `<tr><td colspan="6" style="text-align:center;"><div class="spinner-border text-dark" role="status"><span class="sr-only">Loading...</span></div></td></tr>`;
      document.getElementById("list_of_accounts").innerHTML = loading;
      jqXHR.url = settings.url;
      jqXHR.type = settings.type;
    },
    success: function (response) {
      document.getElementById("btnPrevPage").removeAttribute('disabled');
      document.getElementById("accounts_table_pagination").removeAttribute('disabled');
      document.getElementById("btnNextPage").removeAttribute('disabled');

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

              let c = 0;

              // Table Header Sort Behavior
              switch (order_by_code) {
                case 0:
                case 2:
                case 4:
                case 6:
                case 8:
                case 10:
                  c = key;
                  ++c;
                  break;
                case 1:
                case 3:
                case 5:
                case 7:
                case 9:
                case 11:
                  c = (response_array.length - key) + 1;
                  --c;
                  break;
                default:
              }

              table_row += `
                                <tr>
                                <td>${c}</td>
                                <td>${response_array[key].idNumber}</td>
                                <td>${response_array[key].username}</td>
                                <td>${response_array[key].fullName}</td>
                                <td>${response_array[key].section}</td>
                                <td>${response_array[key].role}</td>
                                </tr>
                            `;
            }
          });
        } else {
          console.log('No Results Found');
          table_row += `<tr><td colspan="6" style="text-align:center; color:red;">No Results Found</td></tr>`;
        }
      } catch (error) {
        console.error(error);
      }

      $('#list_of_accounts').html(table_row);
      sessionStorage.setItem('accounts_table_pagination', current_page);

      // Table Header Sort Behavior
      switch (order_by_code) {
        case 0:
          sessionStorage.setItem('order_by_code', '0');
          document.getElementById("c_th").setAttribute('onclick', 'th_order_by(1)');
          document.getElementById("c_th").innerHTML = ' # <i class="fas fa-sort-numeric-up ml-2">';
          document.getElementById("employee_no_th").innerHTML = ' Employee No. ';
          document.getElementById("username_th").innerHTML = ' Username ';
          document.getElementById("fullname_th").innerHTML = ' Full Name ';
          document.getElementById("section_th").innerHTML = ' Section ';
          document.getElementById("role_th").innerHTML = ' User Type ';
          break;
        case 1:
          sessionStorage.setItem('order_by_code', '1');
          document.getElementById("c_th").setAttribute('onclick', 'th_order_by(0)');
          document.getElementById("c_th").innerHTML = ' # <i class="fas fa-sort-numeric-down-alt ml-2">';
          document.getElementById("employee_no_th").innerHTML = ' Employee No. ';
          document.getElementById("username_th").innerHTML = ' Username ';
          document.getElementById("fullname_th").innerHTML = ' Full Name ';
          document.getElementById("section_th").innerHTML = ' Section ';
          document.getElementById("role_th").innerHTML = ' User Type ';
          break;
        case 2:
          sessionStorage.setItem('order_by_code', '2');
          document.getElementById("employee_no_th").setAttribute('onclick', 'th_order_by(3)');
          document.getElementById("c_th").innerHTML = ' # ';
          document.getElementById("employee_no_th").innerHTML = ' Employee No. <i class="fas fa-sort-alpha-up ml-2">';
          document.getElementById("username_th").innerHTML = ' Username ';
          document.getElementById("fullname_th").innerHTML = ' Full Name ';
          document.getElementById("section_th").innerHTML = ' Section ';
          document.getElementById("role_th").innerHTML = ' User Type ';
          break;
        case 3:
          sessionStorage.setItem('order_by_code', '3');
          document.getElementById("employee_no_th").setAttribute('onclick', 'th_order_by(2)');
          document.getElementById("c_th").innerHTML = ' # ';
          document.getElementById("employee_no_th").innerHTML = ' Employee No. <i class="fas fa-sort-alpha-down-alt ml-2">';
          document.getElementById("username_th").innerHTML = ' Username ';
          document.getElementById("fullname_th").innerHTML = ' Full Name ';
          document.getElementById("section_th").innerHTML = ' Section ';
          document.getElementById("role_th").innerHTML = ' User Type ';
          break;
        case 4:
          sessionStorage.setItem('order_by_code', '4');
          document.getElementById("username_th").setAttribute('onclick', 'th_order_by(5)');
          document.getElementById("c_th").innerHTML = ' # ';
          document.getElementById("employee_no_th").innerHTML = ' Employee No. ';
          document.getElementById("username_th").innerHTML = ' Username <i class="fas fa-sort-alpha-up ml-2">';
          document.getElementById("fullname_th").innerHTML = ' Full Name ';
          document.getElementById("section_th").innerHTML = ' Section ';
          document.getElementById("role_th").innerHTML = ' User Type ';
          break;
        case 5:
          sessionStorage.setItem('order_by_code', '5');
          document.getElementById("username_th").setAttribute('onclick', 'th_order_by(4)');
          document.getElementById("c_th").innerHTML = ' # ';
          document.getElementById("employee_no_th").innerHTML = ' Employee No. ';
          document.getElementById("username_th").innerHTML = ' Username <i class="fas fa-sort-alpha-down-alt ml-2">';
          document.getElementById("fullname_th").innerHTML = ' Full Name ';
          document.getElementById("section_th").innerHTML = ' Section ';
          document.getElementById("role_th").innerHTML = ' User Type ';
          break;
        case 6:
          sessionStorage.setItem('order_by_code', '6');
          document.getElementById("fullname_th").setAttribute('onclick', 'th_order_by(7)');
          document.getElementById("c_th").innerHTML = ' # ';
          document.getElementById("employee_no_th").innerHTML = ' Employee No. ';
          document.getElementById("username_th").innerHTML = ' Username ';
          document.getElementById("fullname_th").innerHTML = ' Full Name <i class="fas fa-sort-alpha-up ml-2">';
          document.getElementById("section_th").innerHTML = ' Section ';
          document.getElementById("role_th").innerHTML = ' User Type ';
          break;
        case 7:
          sessionStorage.setItem('order_by_code', '7');
          document.getElementById("fullname_th").setAttribute('onclick', 'th_order_by(6)');
          document.getElementById("c_th").innerHTML = ' # ';
          document.getElementById("employee_no_th").innerHTML = ' Employee No. ';
          document.getElementById("username_th").innerHTML = ' Username ';
          document.getElementById("fullname_th").innerHTML = ' Full Name <i class="fas fa-sort-alpha-down-alt ml-2">';
          document.getElementById("section_th").innerHTML = ' Section ';
          document.getElementById("role_th").innerHTML = ' User Type ';
          break;
        case 8:
          sessionStorage.setItem('order_by_code', '8');
          document.getElementById("section_th").setAttribute('onclick', 'th_order_by(9)');
          document.getElementById("c_th").innerHTML = ' # ';
          document.getElementById("employee_no_th").innerHTML = ' Employee No. ';
          document.getElementById("username_th").innerHTML = ' Username ';
          document.getElementById("fullname_th").innerHTML = ' Full Name ';
          document.getElementById("section_th").innerHTML = ' Section <i class="fas fa-sort-alpha-up ml-2">';
          document.getElementById("role_th").innerHTML = ' User Type ';
          break;
        case 9:
          sessionStorage.setItem('order_by_code', '9');
          document.getElementById("section_th").setAttribute('onclick', 'th_order_by(8)');
          document.getElementById("c_th").innerHTML = ' # ';
          document.getElementById("employee_no_th").innerHTML = ' Employee No. ';
          document.getElementById("username_th").innerHTML = ' Username ';
          document.getElementById("fullname_th").innerHTML = ' Full Name ';
          document.getElementById("section_th").innerHTML = ' Section <i class="fas fa-sort-alpha-down-alt ml-2">';
          document.getElementById("role_th").innerHTML = ' User Type ';
          break;
        case 10:
          sessionStorage.setItem('order_by_code', '10');
          document.getElementById("role_th").setAttribute('onclick', 'th_order_by(11)');
          document.getElementById("c_th").innerHTML = ' # ';
          document.getElementById("employee_no_th").innerHTML = ' Employee No. ';
          document.getElementById("username_th").innerHTML = ' Username ';
          document.getElementById("fullname_th").innerHTML = ' Full Name ';
          document.getElementById("section_th").innerHTML = ' Section ';
          document.getElementById("role_th").innerHTML = ' User Type <i class="fas fa-sort-alpha-up ml-2">';
          break;
        case 11:
          sessionStorage.setItem('order_by_code', '11');
          document.getElementById("role_th").setAttribute('onclick', 'th_order_by(10)');
          document.getElementById("c_th").innerHTML = ' # ';
          document.getElementById("employee_no_th").innerHTML = ' Employee No. ';
          document.getElementById("username_th").innerHTML = ' Username ';
          document.getElementById("fullname_th").innerHTML = ' Full Name ';
          document.getElementById("section_th").innerHTML = ' Section ';
          document.getElementById("role_th").innerHTML = ' User Type <i class="fas fa-sort-alpha-down-alt ml-2">';
          break;
        default:
      }

      count_accounts();
      // Set the flag back to false as the AJAX call has completed
      search_accounts_ajax_in_progress = false;
    }
  }).fail((jqXHR, textStatus, errorThrown) => {
    console.error(`System Error : Call IT Personnel Immediately!!! They will fix it right away. Error: url: ${jqXHR.url}, method: ${jqXHR.type} ( HTTP ${jqXHR.status} - ${jqXHR.statusText} ) Press F12 to see Console Log for more info.`);
    document.getElementById("btnPrevPage").removeAttribute('disabled');
    document.getElementById("accounts_table_pagination").removeAttribute('disabled');
    document.getElementById("btnNextPage").removeAttribute('disabled');
    // Set the flag back to false as the AJAX call has completed
    search_accounts_ajax_in_progress = false;
  });
}