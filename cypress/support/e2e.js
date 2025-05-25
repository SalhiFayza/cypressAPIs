import './commands'
import 'cypress-mochawesome-reporter/register';
import 'cypress-plugin-api';

Cypress.on('uncaught:exception', (err, runnable) => {
    return false
  });