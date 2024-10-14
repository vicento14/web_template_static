// DOMContentLoaded function
document.addEventListener("DOMContentLoaded", () => {
  load_t_t1();
});

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

const load_t_t1_data = () => {
  $.ajax({
    url: 'http://127.0.0.1:91/TT/LoadTT1',
    type: 'GET',
    cache: false,
    crossDomain: true,
    beforeSend: () => {
      const loading = `<tr id="loading"><td colspan="6" style="text-align:center;"><div class="spinner-border text-dark" role="status"><span class="sr-only">Loading...</span></div></td></tr>`;
      document.getElementById("t_t1_data").innerHTML = loading;
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
              let c = key;
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
            }
          });
        } else {
          console.log('No Results Found');
          table_row += `<tr><td colspan="6" style="text-align:center; color:red;">No Results Found</td></tr>`;
        }
      } catch (error) {
        console.error(error);
      }

      document.getElementById("t_t1_data").innerHTML = table_row;
      document.getElementById("lbl_c1").innerHTML = '';
      $('#t_t1_breadcrumb').hide();
    }
  });
}

const load_t_t1 = () => {
  load_t_t1_table();
  setTimeout(() => {
    load_t_t1_data();
  }, 500);
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

const load_t_t2_data = () => {
  const c1 = sessionStorage.getItem('load_t_t2_c1');

  $.ajax({
    url: 'http://127.0.0.1:91/TT/LoadTT2',
    type: 'GET',
    cache: false,
    crossDomain: true,
    data: {
      c1: c1
    },
    beforeSend: () => {
      const loading = `<tr id="loading"><td colspan="6" style="text-align:center;"><div class="spinner-border text-dark" role="status"><span class="sr-only">Loading...</span></div></td></tr>`;
      document.getElementById("t_t2_data").innerHTML = loading;
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
              let c = key;
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
            }
          });
        } else {
          console.log('No Results Found');
          table_row += `<tr><td colspan="6" style="text-align:center; color:red;">No Results Found</td></tr>`;
        }
      } catch (error) {
        console.error(error);
      }

      document.getElementById("t_t2_data").innerHTML = table_row;
      document.getElementById("lbl_c1").innerHTML = c1;
      $('#t_t1_breadcrumb').show();
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
    load_t_t2_data();
  }, 500);
}