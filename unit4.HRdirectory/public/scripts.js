document.addEventListener("DOMContentLoaded", () => {
    fetchEmployees();
    fetchDepartments();
  
    document
      .getElementById("employee-form")
      .addEventListener("submit", addEmployee);
    document
      .getElementById("update-form")
      .addEventListener("submit", updateEmployee);
  });
  
  async function fetchEmployees() {
    try {
      const response = await fetch("http://localhost:5434/api/employees");
      const employees = await response.json();
      const departmentColumns = document.getElementById("department-columns");
      departmentColumns.innerHTML = "";
  
      const departments = {};
      employees.forEach((employee) => {
        if (!departments[employee.department_name]) {
          departments[employee.department_name] = [];
        }
        departments[employee.department_name].push(employee);
      });
  
      for (const [departmentName, employees] of Object.entries(departments)) {
        const column = document.createElement("div");
        column.classList.add("department-column");
        column.innerHTML = `<h3>${departmentName}</h3><ul id="department-${departmentName}"></ul>`;
        departmentColumns.appendChild(column);
  
        const employeeList = document.getElementById(
          `department-${departmentName}`
        );
        employees.forEach((employee) => {
          const li = document.createElement("li");
          li.innerHTML = `${employee.name} 
            <button onclick="deleteEmployee(${employee.id})">Delete</button>
            <button class="update" onclick="populateUpdateForm(${employee.id}, '${employee.name}', ${employee.department_id})">Update</button>`;
          employeeList.appendChild(li);
        });
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  }
  
  async function fetchDepartments() {
    try {
      const response = await fetch("http://localhost:5434/api/departments");
      const departments = await response.json();
      const departmentList = document.getElementById("department-list");
      departmentList.innerHTML = "";
  
      departments.forEach((department) => {
        const li = document.createElement("li");
        li.textContent = `${department.name} (ID: ${department.id})`;
        departmentList.appendChild(li);
      });
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  }
  
  async function addEmployee(event) {
    event.preventDefault();
  
    const name = document.getElementById("name").value;
    const department_id = document.getElementById("department_id").value;
  
    try {
      const response = await fetch("http://localhost:5434/api/employees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, department_id }),
      });
  
      if (response.ok) {
        fetchEmployees();
        document.getElementById("employee-form").reset();
      } else {
        console.error("Error adding employee:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding employee:", error);
    }
  }
  
  async function deleteEmployee(id) {
    try {
      const response = await fetch(`http://localhost:5434/api/employees/${id}`, {
        method: "DELETE",
      });
  
      if (response.ok) {
        fetchEmployees();
      } else {
        console.error("Error deleting employee:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  }
  
  function populateUpdateForm(id, name, department_id) {
    document.getElementById("update-id").value = id;
    document.getElementById("update-name").value = name;
    document.getElementById("update-department_id").value = department_id;
  }
  
  async function updateEmployee(event) {
    event.preventDefault();
  
    const id = document.getElementById("update-id").value;
    const name = document.getElementById("update-name").value;
    const department_id = document.getElementById("update-department_id").value;
  
    try {
      const response = await fetch(`http://localhost:5434/api/employees/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, department_id }),
      });
  
      if (response.ok) {
        fetchEmployees();
        document.getElementById("update-form").reset();
      } else {
        console.error("Error updating employee:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating employee:", error);
    }
  }