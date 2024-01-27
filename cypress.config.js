const { defineConfig } = require("cypress");
const fs = require('fs');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5050/instrumented/',
    setupNodeEvents(on, config) {
      on('task', {
        myCustomTask: (data) => {
          console.log('Executing custom task:', data);
          return null;
        },
        writeCoverageFile: ({ filePath, data }) => {
          fs.writeFileSync(filePath, JSON.stringify(data));
          return null;
        },
      });
    },
  },
  coverageFolder: "coverage",
  reporter: "mochawesome",
  reporterOptions: {
    reportDir: "cypress/reports/mochawesome-report",
    quiet: true,
    overwrite: true,
    html: true,
    json: true
  },
  env: {
    coverage: true,
    port: 5050
  },
  viewportWidth: 1280,
  viewportHeight: 720
});