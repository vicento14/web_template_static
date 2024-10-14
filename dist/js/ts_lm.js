$(document).ready(function () {
  load_t_t1();
});

// Table Responsive Scroll Event for Load More
document.getElementById("t_table_res").addEventListener("scroll", function () {
  const scrollTop = document.getElementById("t_table_res").scrollTop;
  const scrollHeight = document.getElementById("t_table_res").scrollHeight;
  const offsetHeight = document.getElementById("t_table_res").offsetHeight;

  //check if the scroll reached the bottom
  if ((offsetHeight + scrollTop + 1) >= scrollHeight) {
    get_next_page();
  }
});

const get_next_page = () => {
  const current_table = parseInt(sessionStorage.getItem('t_table_number'));
  const current_page = parseInt(sessionStorage.getItem('t_table_pagination'));
  let total = parseInt(sessionStorage.getItem('count_rows'));
  const last_page = parseInt(sessionStorage.getItem('last_page'));
  const next_page = current_page + 1;
  if (next_page <= last_page && total > 0) {
    switch (current_table) {
      case 1:
        load_t_t1_data(next_page);
        break;
      case 2:
        load_t_t2_data(next_page);
        break;
      default:
    }
  }
}

const load_t_t1_data_last_page = () => {
  const current_page = parseInt(sessionStorage.getItem('t_table_pagination'));
  $.ajax({
    url: 'http://127.0.0.1:91/TTSLM/LastPageTT1',
    type: 'GET',
    cache: false,
    crossDomain: true,
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

const count_t_t1_data = () => {
  $.ajax({
    url: 'http://127.0.0.1:91/TTSLM/CountTT1',
    type: 'GET',
    cache: false,
    crossDomain: true,
    success: function (response) {
      let total = parseInt(response.total);
      sessionStorage.setItem('count_rows', response.total);
      const count = `Total: ${response.total}`;
      $('#t_table_info').html(count);

      if (total > 0) {
        load_t_t1_data_last_page();
        /*document.getElementById("btnNextPage").style.display = "block";
        document.getElementById("btnNextPage").removeAttribute('disabled');*/
      } else {
        document.getElementById("btnNextPage").style.display = "none";
        document.getElementById("btnNextPage").setAttribute('disabled', true);
      }
    }
  });
}

const load_t_t1_table = () => {
  sessionStorage.setItem('t_table_number', '1');
  document.getElementById("t_table").innerHTML = `
        <thead style="text-align: center;">
            <tr>
                <th> # </th>
                <th> C1 </th>
                <th> C2 </th>
                <th> C3 </th>
                <th> C4 </th>
                <th> Date Updated </th>
            </tr>
        </thead>
        <tbody id="t_t1_data" style="text-align: center;"></tbody>
    `;
}

const load_t_t1_data = current_page => {
  $.ajax({
    url: 'http://127.0.0.1:91/TTSLM/LoadTT1',
    type: 'GET',
    cache: false,
    crossDomain: true,
    data: {
      current_page: current_page
    },
    beforeSend: () => {
      const loading = `<tr id="loading"><td colspan="6" style="text-align:center;"><div class="spinner-border text-dark" role="status"><span class="sr-only">Loading...</span></div></td></tr>`;
      if (current_page == 1) {
        document.getElementById("t_t1_data").innerHTML = loading;
        sessionStorage.setItem('t_table_page_first_result', '0');
      } else {
        $('#t_table tbody').append(loading);
      }
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
              console.log(`${response_array[key].id} | ${response_array[key].c1} | ${response_array[key].c2} | ${response_array[key].c3} | ${response_array[key].c4} | ${response_array[key].dateUpdated}`);
              let c = parseInt(sessionStorage.getItem('t_table_page_first_result'));
              table_row += `
                                  <tr style="cursor:pointer;" class="modal-trigger" 
                                  onclick="load_t_t2(&quot;${response_array[key].id}~!~${response_array[key].c1}&quot;)">
                                  <td>${++c}</td>
                                  <td>${response_array[key].c1}</td>
                                  <td>${response_array[key].c2}</td>
                                  <td>${response_array[key].c3}</td>
                                  <td>${response_array[key].c4}</td>
                                  <td>${response_array[key].dateUpdated}</td>
                                  </tr>
                              `;
              sessionStorage.setItem('t_table_page_first_result', c.toString());
            }
          });
        } else {
          console.log('No Results Found');
          table_row += `<tr><td colspan="6" style="text-align:center; color:red;">No Results Found</td></tr>`;
        }
      } catch (error) {
        console.error(error);
      }

      if (current_page == 1) {
        $('#t_table tbody').html(table_row);
      } else {
        $('#t_table tbody').append(table_row);
      }

      sessionStorage.setItem('t_table_pagination', current_page);
      $('#lbl_c1').html('');
      $('#t_t1_breadcrumb').hide();
      count_t_t1_data();
    }
  });
}

const load_t_t1 = () => {
  load_t_t1_table();
  setTimeout(() => {
    load_t_t1_data(1);
  }, 500);
}

const load_t_t2_data_last_page = () => {
  const c1 = sessionStorage.getItem('load_t_t2_c1');
  const current_page = parseInt(sessionStorage.getItem('t_table_pagination'));

  $.ajax({
    url: 'http://127.0.0.1:91/TTSLM/LastPageTT2',
    type: 'GET',
    cache: false,
    crossDomain: true,
    data: {
      c1: c1
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

const count_t_t2_data = () => {
  const c1 = sessionStorage.getItem('load_t_t2_c1');

  $.ajax({
    url: 'http://127.0.0.1:91/TTSLM/CountTT2',
    type: 'GET',
    cache: false,
    crossDomain: true,
    data: {
      c1: c1
    },
    success: function (response) {
      let total = parseInt(response.total);
      sessionStorage.setItem('count_rows', response.total);
      const count = `Total: ${response.total}`;
      $('#t_table_info').html(count);

      if (total > 0) {
        load_t_t2_data_last_page();
        /*document.getElementById("btnNextPage").style.display = "block";
        document.getElementById("btnNextPage").removeAttribute('disabled');*/
      } else {
        document.getElementById("btnNextPage").style.display = "none";
        document.getElementById("btnNextPage").setAttribute('disabled', true);
      }
    }
  });
}

const load_t_t2_table = () => {
  sessionStorage.setItem('t_table_number', '2');
  document.getElementById("t_table").innerHTML = `
        <thead style="text-align: center;">
            <tr>
                <th> # </th>
                <th> C1 </th>
                <th> D1 </th>
                <th> D2 </th>
                <th> D3 </th>
                <th> Date Updated </th>
            </tr>
        </thead>
        <tbody id="t_t2_data" style="text-align: center;"></tbody>`;
}

const load_t_t2_data = current_page => {
  const c1 = sessionStorage.getItem('load_t_t2_c1');

  $.ajax({
    url: 'http://127.0.0.1:91/TTSLM/LoadTT2',
    type: 'GET',
    cache: false,
    crossDomain: true,
    data: {
      c1: c1,
      current_page: current_page
    },
    beforeSend: () => {
      const loading = `<tr id="loading"><td colspan="6" style="text-align:center;"><div class="spinner-border text-dark" role="status"><span class="sr-only">Loading...</span></div></td></tr>`;
      if (current_page == 1) {
        document.getElementById("t_t2_data").innerHTML = loading;
        sessionStorage.setItem('t_table_page_first_result', '0');
      } else {
        $('#t_table tbody').append(loading);
      }
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
              console.log(`${response_array[key].id} | ${response_array[key].c1} | ${response_array[key].d1} | ${response_array[key].d2} | ${response_array[key].d3} | ${response_array[key].dateUpdated}`);
              let c = parseInt(sessionStorage.getItem('t_table_page_first_result'));
              table_row += `
                                  <tr>
                                  <td>${++c}</td>
                                  <td>${response_array[key].c1}</td>
                                  <td>${response_array[key].d1}</td>
                                  <td>${response_array[key].d2}</td>
                                  <td>${response_array[key].d3}</td>
                                  <td>${response_array[key].dateUpdated}</td>
                                  </tr>
                              `;
              sessionStorage.setItem('t_table_page_first_result', c.toString());
            }
          });
        } else {
          console.log('No Results Found');
          table_row += `<tr><td colspan="6" style="text-align:center; color:red;">No Results Found</td></tr>`;
        }
      } catch (error) {
        console.error(error);
      }

      if (current_page == 1) {
        $('#t_table tbody').html(table_row);
      } else {
        $('#t_table tbody').append(table_row);
      }

      sessionStorage.setItem('t_table_pagination', current_page);
      $('#lbl_c1').html(c1);
      $('#t_t1_breadcrumb').show();
      count_t_t2_data();
    }
  });
}

const load_t_t2 = param => {
  const string = param.split('~!~');
  const id = string[0];
  const c1 = string[1];

  sessionStorage.setItem('load_t_t2_c1', c1);

  load_t_t2_table();
  setTimeout(() => {
    load_t_t2_data(1);
  }, 500);
}