const Manager = require('./lib/Manager');
const Employee = require('./lib/Employee');
const Engineer = require('./lib/Engineer');
const Intern = require('./lib/Intern');

const fs = require('fs');
const inquirer = require('inquirer');

let employees = [];
let promptInitial = [
  {
    type: 'input',
    name: 'name',
    message: 'Enter Manager Name: ',
    validate: async(input) => {
      return true;
    }
  },
  {
    type: 'input',
    name: 'email',
    message: 'Enter Manager Email: ',
    validate: async(input) => {
      return true;
    }
  },
  {
    type: 'input',
    name: 'officeNumber',
    message: 'Enter Manager Office Number: ',
    validate: async(input) => {
      return true;
    }
  },
  {
    type: 'list',
    name: 'hasEmployees',
    message: 'Do you have any team members?',
    choices: ['Yes', 'No']
  }
];

let promptEmployee = [
  {
    type: 'input',
    name: 'name',
    message: 'Enter Employee Name: ',
    validate: async(input) => {
      return true;
    }
  },
  {
    type: 'input',
    name: 'email',
    message: 'Enter Employee Email: ',
    validate: async(input) => {
      return true;
    }
  },
  {
    type: 'list',
    name: 'role',
    message: 'What is the role of this employee?',
    choices: ['Engineer', 'Intern']
  },
  {
    when: input => {
      return input.role == 'Engineer';
    },
    type: 'input',
    name: 'github',
    message: 'Enter Github Username: ',
    validate: async(input) => {
      return true;
    }
  },
  {
    when: input => {
      return input.role == 'Intern';
    },
    type: 'input',
    name: 'school',
    message: 'Enter School Name: ',
    validate: async(input) => {
      return true;
    }
  },
  {
    type: 'list',
    name: 'moreEmployees',
    message: 'Do you have any other team members?',
    choices: ['Yes', 'No']
  }
];

promptGenerate();

function promptGenerate() {
  inquirer.prompt(promptInitial).then(data => {
    let manager = new Manager(data.name, employees.length + 1, data.email, data.officeNumber);
    employees.push(manager);

    if(data.hasEmployees == 'Yes') {
      promptAddEmployee();
    } else {
      renderHTML();
    }
  });
}

function promptAddEmployee() {
  inquirer.prompt(promptEmployee).then(data => {
    let employee;
    if(data.role == 'Engineer') {
      employee = new Engineer(data.name, employees.length + 1, data.email, data.github);
    } else if (data.role == 'Intern') {
      employee = new Intern(data.name, employees.length + 1, data.email, data.school);
    } else {
      employee = new Employee(data.name, employees.length + 1, data.email);
    }
    employees.push(employee);

    if(data.moreEmployees == 'Yes') {
      promptAddEmployee();
    } else {
      renderHTML();
    }
  });
}

function renderHTML() {
  let file = fs.readFileSync('./templates/main.html');
  fs.writeFileSync('./output/index.html', file, () => {
    if(err) {
      throw err;
    }
  });

  for(employee of employees) {
    if(employee.getRole() == 'Manager') {
      renderEmployeeCard(employee.getName(), employee.getId(), employee.getEmail(), employee.getRole(), employee.getOfficeNumber());
    } else if(employee.getRole() == 'Engineer') {
      renderEmployeeCard(employee.getName(), employee.getId(), employee.getEmail(), employee.getRole(), employee.getGithub());
    } else if(employee.getRole() == 'Intern') {
      renderEmployeeCard(employee.getName(), employee.getId(), employee.getEmail(), employee.getRole(), employee.getSchool());
    } else {
      renderEmployeeCard(employee.getName(), employee.getId(), employee.getEmail(), employee.getRole());
    }
  }

  fs.appendFileSync('./output/index.html', '', (err) => {
    if(err) {
      throw err;
    }
  });
}

function renderEmployeeCard(name, id, email, role, property) {
  let data = fs.readFileSync(`./templates/${role}.html`, 'utf8');
  data = data.replace('<div id="name"></div>', name);
  data = data.replace('<div id="id"></div>', `ID: ${id}`);
  data = data.replace('<div id="email"></div>', `Email: <a href="mailto:${email}">${email}</a>`);
  data = data.replace('<div id="officeNumber"></div>', `Office Number: ${property}`);
  data = data.replace('<div id="github"></div>', `Github: <a href="https://github.com/${property}">${property}</a>`);
  data = data.replace('<div id="school"></div>', `School: ${property}`);

  fs.appendFileSync('./output/index.html', data, err => {
    if(err) {
      throw err;
    }
  });
}