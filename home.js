// Truning the header background when
window.onscroll = function() {
    var header = document.getElementById("header");
    var links = document.getElementById("links");

    if (window.scrollY > 130) { // Scroll threshold
      header.classList.add("scrolled");
    } else if (window.innerWidth > 320 && window.scrollY > 20){
      header.classList.add("scrolled");
    }
    else if (window.innerWidth > 639 && window.scrollY > 80){
      header.classList.add("scrolled");
    }
    else {
      header.classList.remove("scrolled");
    }
  };
const backend_host = 'http://localhost:5000';

const frontend_host = 'http://127.0.0.1:5500';

const endpoints = {
    "createAccount": `${backend_host}/auth/register`,
    "login": `${backend_host}/auth/login`,
    "logout": `${backend_host}/auth/logout`,
    "getTasks": `${backend_host}/task/`,
    "orderBypriority": `${backend_host}/task/priority`,
    "orderBydate": `${backend_host}/task/date`,
    "filterByPriority": `${backend_host}/task/filter-by-priority`,
    "filterByDate": `${backend_host}/task/filter-by-date`,
    "searchTaskandDescription": `${backend_host}/task/search`,
    "createTask": `${backend_host}/task/`,
    "updateTask": `${backend_host}/task/`,
    "deleteTask": `${backend_host}/task/`,
};


function scrol() {
  document.getElementById("form_container").scrollIntoView({behavior:"smooth"});
};

function home() {
  window.location.href = `${frontend_host}/index.html`;
}

function goTo(route) {
  try {
    const path = route
    const main_route = `${frontend_host}${path}`
    console.log(main_route)

    const token = sessionStorage.getItem('token');

    if(token && main_route){
      window.location.href = main_route ;
    }else {
      console.log("Please log in to access page");
      window.location.href = `${frontend_host}/index.html`;
    }
  } catch (error) {
    console.log("An error occured: ", error)
  }
};

async function createAccount(){
  // Getting the user input from the form when signup is clicked
  var formData = document.getElementById("forms_Signup");

  // creating a new formData object
  var newData = new FormData(formData);

  // accessing the data
  let fname = newData.get('fname').toLowerCase();
  let lname = newData.get('lname').toLowerCase();
  let email = newData.get('email').toLowerCase();
  let password = newData.get('password');

  const userData = {
    "username": `${fname} ${lname}`,
    "email": email,
    "password": password
  };

  console.log(userData);

  const config = {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData),
      }

  try {
    const response = await fetch(endpoints.createAccount, config);
    if(!response.ok) {
        console.log('An error occured')
    }

    const result = await response.json();
    console.log('Account Created Successfully');
    console.log('Your details: ', result)
  } catch(error) {
    console.log('Unable to create account: ', error)
  };
};

async function login() {
  // Getting the user input from the form when signup is clicked
  var formData = document.getElementById("formsLogin");

  // creating a new formData object
  var newData = new FormData(formData);

  // accessing the data
  let email = newData.get('email').toLowerCase();
  let password = newData.get('password');

  const userData = {
    "email": email,
    "password": password
  };

  console.log(userData);
  
  const config = {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData),
  
  };

  try {
    const response = await fetch(endpoints.login, config);
    if(!response.ok) {
        console.log('An error occured')
    }else {
      const result = await response.json();
      console.log('Logged in Successfully');
      // setting local storage
      sessionStorage.setItem('token', result.token);
      sessionStorage.setItem('user_id', result.user_id);

      window.location.href = `${frontend_host}/create.html` // connect this much later

      // clearing the log in details after an hour
      setTimeout(() => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user_id');
      }, 3600000);
    }
  } catch(error) {
    console.log('Unable to login user: ', error)
  }
}

async function logout() {
  const token = sessionStorage.getItem('token');
  console.log(token)

  const config = {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${token}`,
    },
  };
  try {
    const response = await fetch(endpoints.logout, config);
    if(!response.ok) {
        console.log('An error occured')
    }else {
      const result = await response.json();
      console.log('Logged out Successfully');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user_id'); 
      window.location.href = `${frontend_host}/index.html`
    }
  } catch(error) {
    console.log('Unable to log out user: ', error)
  }
};

async function createTask(){
  const token = sessionStorage.getItem('token');

  // Getting the user input from the form when signup is clicked
  var formData = document.getElementById("forms_create_task");

  // creating a new formData object
  var newData = new FormData(formData);

  // accessing the data
  let task = newData.get('task').toLowerCase();
  let desc = newData.get('desc').toLowerCase();
  let priority = newData.get('priority').toLowerCase();
  let due_date = newData.get('datetime');

  let isoDate = new Date(due_date).toISOString()

  const userData = {
    "task": task,
    "description": desc,
    "priority": priority,
    "due_date": isoDate
  };

  console.log(userData);

  const config = {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(userData),
      }

  try {
    const response = await fetch(endpoints.createTask, config);
    if(!response.ok) {
        console.log('An error occured')
    }

    const result = await response.json();
    console.log('Task Created Successfully');
    console.log(result.created_at)
  } catch(error) {
    console.log('Unable to create task: ', error)
  };
};

async function getTasks() {

  try {
    const token = sessionStorage.getItem('token');

    const tabledata = document.getElementById("tbody");
  
    const config = {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
      },
      };

    const response = await fetch(endpoints.getTasks, config);

    if(!response.ok) {
        console.log('An error occured')
    }

    const result = await response.json();
    console.log(result);

    tabledata.innerHTML = "";
    Object.keys(result).forEach(id => {
      var sn = Number(id)
      sn++
      let info = `<tr class="td">
      <td>${sn}</td>
      <td>${result[id].id}</td>
      <td>${result[id].task}</td>
      <td>${result[id].description}</td>
      <td>${result[id].priority}</td>
      <td>${result[id].completed}</td>
      <td>${result[id].created_at}</td>
      <td>${result[id].due_date}</td>
      <td><button class="action-btn" data-id=${sn}>...</button></td>
      </tr>`;

      tabledata.innerHTML += info;

    });
  } catch(error) {
    console.log('Unable to get tasks: ', error)
  };
}

async function filterByPriority() {
  try {
    var formData = document.getElementById("filter_priority");
    var newData = new FormData(formData);

    let priority = newData.get('priority')

    userData = {
      "priority": priority
    };

    console.log(userData)

    const token = sessionStorage.getItem('token');

    const tabledata = document.getElementById("tbody");
  
    const config = {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(userData)
      };

    const response = await fetch(endpoints.filterByPriority, config);

    if(!response.ok) {
        console.log('An error occured')
    }

    const result = await response.json();
    console.log(result);

    tabledata.innerHTML = "";
    Object.keys(result).forEach(id => {
      var sn = Number(id)
      sn++
      let info = `<tr class="td">
      <td>${sn}</td>
      <td>${result[id].id}</td>
      <td>${result[id].task}</td>
      <td>${result[id].description}</td>
      <td>${result[id].priority}</td>
      <td>${result[id].completed}</td>
      <td>${result[id].created_at}</td>
      <td>${result[id].due_date}</td>
      <td><button class="action-btn" data-id=${sn}>...</button></td>
      </tr>`;

      tabledata.innerHTML += info;

    });
  } catch(error) {
    console.log('Unable to filter tasks: ', error)
  };
};

async function filterByDate() { // removed the param noce you implement how to get the data from the input element
  try {
    const token = sessionStorage.getItem('token');

    const tabledata = document.getElementById("tbody");

    var formData = document.getElementById("filter_date");
    var newData = new FormData(formData);

    let date = newData.get('datetime')

    let due_date = new Date(date).toISOString()
    console.log(due_date)

    const userData = {
      "due_date": due_date
    };
    console.log(userData)
  
    const config = {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(userData)
      };

    const response = await fetch(endpoints.filterByDate, config);

    if(!response.ok) {
        console.log('An error occured')
    }

    const result = await response.json();
    console.log(result);

    tabledata.innerHTML = "";
    Object.keys(result).forEach(id => {
      var sn = Number(id)
      sn++
      let info = `<tr class="td">
      <td>${sn}</td>
      <td>${result[id].id}</td>
      <td>${result[id].task}</td>
      <td>${result[id].description}</td>
      <td>${result[id].priority}</td>
      <td>${result[id].completed}</td>
      <td>${result[id].created_at}</td>
      <td>${result[id].due_date}</td>
      <td><button class="action-btn" data-id=${sn}>...</button></td>
      </tr>`;

      tabledata.innerHTML += info;

    });
  } catch(error) {
    console.log('Unable to filter tasks: ', error)
  };
};

async function orderByDate() {
  try {

    const token = sessionStorage.getItem('token');

    const tabledata = document.getElementById("tbody");
  
    const config = {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
      },
      };

    const response = await fetch(endpoints.orderBydate, config);

    if(!response.ok) {
        console.log('An error occured')
    }

    const result = await response.json();
    console.log(result);

    tabledata.innerHTML = "";

    Object.keys(result).forEach(id => {
      var sn = Number(id)
      sn++
      let info = `<tr class="td">
      <td>${sn}</td>
      <td>${result[id].id}</td>
      <td>${result[id].task}</td>
      <td>${result[id].description}</td>
      <td>${result[id].priority}</td>
      <td>${result[id].completed}</td>
      <td>${result[id].created_at}</td>
      <td>${result[id].due_date}</td>
      <td><button class="action-btn" data-id=${sn}>...</button></td>
      </tr>`;

      tabledata.innerHTML += info;

    });
  } catch(error) {
    console.log('Unable to filter tasks: ', error)
  };
};

async function orderByPriority() {
  try {

    const token = sessionStorage.getItem('token');

    const tabledata = document.getElementById("tbody");
  
    const config = {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
      },
      };

    const response = await fetch(endpoints.orderBypriority, config);

    if(!response.ok) {
        console.log('An error occured')
    }

    const result = await response.json();
    console.log(result);

    tabledata.innerHTML = "";

    Object.keys(result).forEach(id => {
      var sn = Number(id)
      sn++
      let info = `<tr class="td">
      <td>${sn}</td>
      <td>${result[id].id}</td>
      <td>${result[id].task}</td>
      <td>${result[id].description}</td>
      <td>${result[id].priority}</td>
      <td>${result[id].completed}</td>
      <td>${result[id].created_at}</td>
      <td>${result[id].due_date}</td>
      <td><button class="action-btn" data-id=${sn}>...</button></td>
      </tr>`;

      tabledata.innerHTML += info;

    });
  } catch(error) {
    console.log('Unable to filter tasks: ', error)
  };
};

async function updateTask() {
  try {
    const token = sessionStorage.getItem('token');

    // Getting the user input from the form when signup is clicked
    var formData = document.getElementById("forms_update_task");

    // creating a new formData object
    var newData = new FormData(formData);

    // accessing the data
    let task = newData.get('task').toLowerCase();
    let desc = newData.get('desc').toLowerCase();
    let priority = newData.get('priority').toLowerCase();
    let completed = newData.get('completed');
    let due_date = newData.get('datetime');

    const userData = {
      "task": task,
      "description": desc,
      "priority": priority,
      'completed': completed,
      "due_date": due_date
    };

    console.log(userData);

    const config = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userData),
        }

      const response = await fetch(endpoints.createTask, config);
      if(!response.ok) {
          console.log('An error occured')
      }

      const result = await response.json();
      console.log('Task updated Successfully');
  } catch(error) {
    console.log('Unable to create task: ', error)
  };
};

async function searchTask() {
  try {
    const token = sessionStorage.getItem('token');
    const tabledata = document.getElementById("tbody");

    // Getting the user input from the form when signup is clicked
    var formData = document.getElementById("search_task");

    // creating a new formData object
    var newData = new FormData(formData);

    // accessing the data
    let keyword = newData.get('keyword').toLowerCase();

    const userData = {
      "keyword": keyword,
    };

    console.log(userData);

    const config = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userData),
        }

      const response = await fetch(endpoints.searchTaskandDescription, config);
      if(!response.ok) {
          console.log('An error occured')
      }

      const result = await response.json();
      if(result) {
        console.log('Search Successfully');
        tabledata.innerHTML = "";

        Object.keys(result).forEach(id => {
          var sn = Number(id)
          sn++
          let info = `<tr class="td">
          <td>${sn}</td>
          <td>${result[id].id}</td>
          <td>${result[id].task}</td>
          <td>${result[id].description}</td>
          <td>${result[id].priority}</td>
          <td>${result[id].completed}</td>
          <td>${result[id].created_at}</td>
          <td>${result[id].due_date}</td>
          <td><button class="action-btn" data-id=${sn}>...</button></td>
          </tr>`;
    
          tabledata.innerHTML += info;
        });
    }else {
      console.log('No match found')
    }
  } catch(error) {
    console.log('Unable to create task: ', error)
  };
};

async function deleteTask() {
  try {
    const token = sessionStorage.getItem('token');
    // const tabledata = document.getElementById("tbody");

    // Getting the user input from the form when signup is clicked
    var formData = document.getElementById("delete_task");

    // creating a new formData object
    var newData = new FormData(formData);

    // accessing the data
    let id = newData.get('id');

    const userData = {
      "id": id,
    };

    const config = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        }

      const response = await fetch(`${endpoints.deleteTask}${userData.id}`, config);
      if(!response.ok) {
          console.log('An error occured')
      }
      const result = await response.json();
      console.log(result.message)
  } catch(error) {
    console.log('Unable to delete task: ', error)
  };
};

async function updateTask() {
  try {
    const token = sessionStorage.getItem('token');
    // const tabledata = document.getElementById("tbody");

    // Getting the user input from the form when signup is clicked
    var formData = document.getElementById("update_task");

    // creating a new formData object
    var newData = new FormData(formData);

    // accessing the data
    let id = newData.get('id');
    let task = newData.get('task').toLowerCase();
    let desc = newData.get('desc').toLowerCase();
    let priority = newData.get('priority').toLowerCase();
    let completed = newData.get('completed').toLowerCase();
    let due_date = newData.get('datetime');

    let isoDate = new Date(due_date).toISOString();

    const userData = {
      "task": task,
      "description": desc,
      "priority": priority,
      "completed": completed,
      "due_date":  isoDate,
    };

    console.log(userData)
    
    const config = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userData),
        }

      const response = await fetch(`${endpoints.updateTask}${id}`, config);
      if(!response.ok) {
          console.log('An error occured')
      }
      const result = await response.json();
      console.log(result.message)
      console.log('Task Updated Successfully')
  } catch(error) {
    console.log('Unable to update task: ', error)
  };
};

document.addEventListener('DOMContentLoaded', () => {
  const table = document.getElementById('table');
  const modal = document.getElementById('action_modal');
  const editModal = document.getElementById('pencil')

table.addEventListener('click', (event) => {
  if (event.target.classList.contains('action-btn')) {
    const button = event.target;
    const selectedRowId = button.getAttribute('data-id');

    //get button position
    const rect = button.getBoundingClientRect();

    // dynamically positioning the modal
    modal.style.left = `${rect.left + window.scrollX}px`;
    modal.style.top = `${rect.bottom + window.scrollY}px`;

    // display modal
    modal.style.display = 'block';
  }
});

// modal clicks
modal.addEventListener('click', async(event) => {
  if(event.target.id === 'pencil'){
    //show modal for editing
    editModal.style.display = 'block';
    populateE
  }
})
// close modal when clicking outside
document.addEventListener('click', (event) => {
  if(!modal.contains(event.target) && !event.target.classList.contains('action-btn')){
    modal.style.display = 'none';
  }
});
});

// close modal when function is called
function closeModal() {
  document.getElementById('action_modal').style.display = 'none';
}


// document.addEventListener('DOMContentLoaded', () => {
//   const table = document.getElementById('table');
//   const modal = document.getElementById('action_modal');

// table.addEventListener('click', (event) => {
//   if (event.target.classList.contains('action-btn')) {
//     console.log(`Oh snapp ypu clicked me: ${event.target.id}`)
//     const button = event.target;
//     const rowId = button.getAttribute('data-id');

//     //get button position
//     const rect = button.getBoundingClientRect();
//     // const modalWidth = 200

//     // dynamically positioning the modal
//     modal.style.left = `${rect.left + window.scrollX}px`;
//     modal.style.top = `${rect.bottom + window.scrollY}px`;
//     console.log("I'm here")

//     // display modal
//     modal.style.display = 'block';
//     console.log("See me oh")
//   }
// });

// // close modal when clicking outside
// document.addEventListener('click', (event) => {
//   if(!modal.contains(event.target) && !event.target.classList.contains('action-btn')){
//     modal.style.display = 'none';
//   }
// });
// });

function closeModal() {
  document.getElementById('action_modal').style.display = 'none';
}