describe('Login Page UI Testing', function () {
  let counter = 0;

  beforeEach(() => {
    cy.visit('http://localhost:' + Cypress.env('port') + '/instrumented/index.html');
  });

  afterEach(() => {
    cy.window().then((win) => {
      const coverageData = win.__coverage__;
      if (coverageData) {
        const coverageFilePath = 'cypress-coverage/coverageLogin' + counter++ + '.json';
        cy.task('writeCoverageFile', { filePath: coverageFilePath, data: coverageData })
          .then(() => {
            console.log('Coverage data written to ' + coverageFilePath);
          }, (err) => { // Add this line
            console.error('Error writing coverage data:', err);
          });
      }
    });
  });

  Cypress.on('uncaught:exception', (err, runnable) => {
    // Returning false here prevents Cypress from failing the test
    return false;
  });

  it('should navigate to courses.html if user role is student', () => {
    cy.get('#username').type('jennieeain2');
    cy.get('#password').type('Ilovefood123@');
    cy.get('#loginForm').submit();
    cy.url().should('include', '/courses.html');
  });

  it('should navigate to viewAllQuizzes.html if user role is enterprise', () => {
    cy.get('#username').type('enterprise');
    cy.get('#password').type('Ilovefood123@');
    cy.get('#loginForm').submit();
    cy.url().should('include', '/viewAllQuizzes.html');
  });

  it('should display an error message if username and password are not provided', () => {
    cy.get('#loginForm').submit();
    cy.on('window:alert', (alertText) => {
      expect(alertText).to.equal('Username and password are required');
    });
  });

  it('stores username and userId in local storage on successful login', () => {
    cy.get('#username').type('enterprise');
    cy.get('#password').type('Ilovefood123@');
    cy.get('#loginForm').submit();
    cy.url().should('include', '/viewAllQuizzes.html');

    cy.window().then((window) => {
      expect(window.localStorage.getItem('username')).to.equal('enterprise');
      expect(window.localStorage.getItem('userId')).to.equal('oUu9UYMZ4mTQGIFo5688');
    });
  });

  it('should show error when username is missing', () => {
    cy.get('#password').type('password');
    cy.get('#loginForm').submit();
    cy.on('window:alert', (alertText) => {
      expect(alertText).to.equal('Username and password are required');
    });
  });

  it('should show error when password is missing', () => {
    cy.get('#username').type('newuser');
    cy.get('#loginForm').submit();
    cy.on('window:alert', (alertText) => {
      expect(alertText).to.equal('Username and password are required');
    });
  });

  it('should show error when username does not exist', () => {
    cy.get('#username').type('nonexistentuser');
    cy.get('#password').type('password');
    cy.get('#loginForm').submit();
    cy.get('#error').should('have.text', 'Invalid username');
  });

  it('should show error when password is incorrect', () => {
    cy.get('#username').type('jennieeain2');
    cy.get('#password').type('wrongpassword');
    cy.get('#loginForm').submit();
    cy.get('#error').should('have.text', 'Invalid password');
  });

  it('should load the login page', () => {
    cy.title().should('equal', 'Login');
  });

  it('should get the correct username value', () => {
    cy.get('#username').type('testuser');
    cy.get('#username').should('have.value', 'testuser');
  });

  it('should get the correct password value', () => {
    cy.get('#password').type('testpassword');
    cy.get('#password').should('have.value', 'testpassword');
  });

  it('should display the login form', () => {
    cy.get('#loginForm').should('be.visible');
  });

  it('should allow entering a username', () => {
    cy.get('#username').type('testuser');
    cy.get('#username').should('have.value', 'testuser');
  });

  it('should allow entering a password', () => {
    cy.get('#password').type('testpassword');
    cy.get('#password').should('have.value', 'testpassword');
  });

  it('should redirect to the correct page based on user role', () => {
    cy.window().then((window) => {
      window.redirectToUserRolePage('student');
      cy.url().should('include', '/courses.html');
    });
  });

  it('should redirect to the correct page based on user role 2', () => {
    cy.window().then((window) => {
      window.redirectToUserRolePage('student');
      cy.url().should('include', '/courses.html');
    });
  });

  it('should redirect to the correct page based on user role 3', () => {
    cy.window().then((window) => {
      window.redirectToUserRolePage('enterprise');
      cy.url().should('include', '/viewAllQuizzes.html');
    });
  });

  it('should redirect to the correct page based on user role 4', () => {
    cy.window().then((window) => {
      window.redirectToUserRolePage('enterprise');
      cy.url().should('include', '/viewAllQuizzes.html');
    });
  });

  it('should store username and userId in local storage on successful login', () => {
    cy.window().then((window) => {
      window.handleLoginResponse({
        message: 'Login successful!',
        user: {
          username: 'testUser',
          id: 'testId',
          role: 'student'
        }
      });
    });
    cy.window().then((window) => {
      expect(window.localStorage.getItem('username')).to.equal('testUser');
      expect(window.localStorage.getItem('userId')).to.equal('testId');
    });
  });
});