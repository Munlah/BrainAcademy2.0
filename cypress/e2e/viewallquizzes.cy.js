describe('viewAllquizzes Page UI Testing', function () {
    let counter = 0;

    beforeEach(() => {
        cy.visit('http://localhost:' + Cypress.env('port') + '/instrumented/viewAllQuizzes.html');
    });

    afterEach(() => {
        cy.window().then((win) => {
            const coverageData = win.__coverage__;
            if (coverageData) {
                const coverageFilePath = 'cypress-coverage/coverageViewAllQuizzes' + counter++ + '.json';
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

    it('Should have the correct title', () => {
        cy.title().should('eq', 'View All Quizzes Admin');
    });

    it('Should have a logout link', () => {
        cy.get('#logoutLink').should('be.visible');
    });

    it('Should have an Add Quiz button', () => {
        cy.get('#redirectAddQuiz').should('be.visible');
    });

    it('Should display quizzes after fetching', () => {
        cy.get('.quiz').should('have.length.gt', 0);
    });

    it('Should open a modal when a delete button is clicked', () => {
        cy.get('.delete-button').first().click();
        cy.get('#myModal').should('be.visible');
    });

    it('Should close the modal when the No button is clicked', () => {
        cy.get('.delete-button').eq(0).click();
        cy.get('#myModal').should('be.visible');
        cy.get('#cancel-delete').click();
        cy.get('#myModal').should('not.be.visible');
    });

    it('Should fetch and display quizzes for a course', () => {
        cy.get('.course-button').eq(1).click();
        cy.get('.quiz').should('have.length.gt', 0);
    });

    it('Should not display any quizzes for a course with no quizzes', () => {
        cy.get('.course-button').eq(4).click();
        cy.get('.quiz').should('not.exist');
        cy.get('.no-quizzes-message').should('have.text', 'No quizzes found for this course');
    });

    it('Should delete a quiz when the delete button is clicked and the deletion is confirmed', () => {
        cy.wait(1000);

        cy.window().then((win) => {
            win.fetchAndDisplayQuizzesByCourse("Calculas");
        });

        cy.wait(1000);

        cy.get('.delete-button').then(($deleteButtons) => {
            const initialCount = $deleteButtons.length;

            cy.get('.delete-button').first().click();
            cy.get('#confirm-delete').click();

            cy.wait(1000);

            cy.get('.quiz').should('have.length', initialCount - 1);
        });
    });

    it('Add Quiz button should redirect to addQuiz.html', () => {
        cy.get('#redirectAddQuiz').click().then(() => {
            cy.url().should('include', 'addQuiz.html');
        });
    });

});