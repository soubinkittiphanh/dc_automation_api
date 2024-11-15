const logger = require('../api/logger');
const { user } = require('../model'); // Adjust the path based on your project structure
const commonService = require('../common')
// Controller to handle CRUD operations for users
const registerApplication = {
  // Get all users
  register: async (req, res) => {
    const newUser = {
      profileId: 'TEST0011',
      profileName: 'DEV TEST',
      profileProvider: 'TEST',
      isActive: true,
      port: {
        appPort: 778899,
        apiPort: 998877
      }
    }
    commonService.createApiDirectory(newUser)
    commonService.createAppDirectory(newUser)
  },
};

module.exports = registerApplication;
