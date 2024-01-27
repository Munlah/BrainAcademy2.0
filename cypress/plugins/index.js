const fs = require('fs');

module.exports = (on, config) => {
  on('task', {
    writeCoverageFile({ filePath, data }) {
      return new Promise((resolve, reject) => {
        fs.writeFile(filePath, JSON.stringify(data), (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    }
  });
};
