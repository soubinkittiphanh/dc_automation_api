const logger = require('../api/logger');
const { user } = require('../model'); // Adjust the path based on your project structure
const commonService = require('../common')
// Controller to handle CRUD operations for users
const registerApplication = {
  // Get all users
  register: async (req, res) => {
    const newUser = {
      profileId: 'TEST0012',
      profileName: 'DEV TEST',
      profileProvider: 'TEST',
      isActive: true,
      port: {
        appPort: 40000,
        apiPort: 40001
      }
    };

    const mti = {
      code: '200',
      message: 'Operation succeeded'
    };

    try {
      // Step 1: Create API directory
      await commonService.createApiDirectory(newUser);
      logger.info('API directory created successfully.');

      // Step 2: Create App directory
      await commonService.createAppDirectory(newUser);
      logger.info('App directory created successfully.');
    } catch (error) {
      // Log and set error response
      const errorContext = error.context || 'Unknown context';
      const errorMessage = `Operation failed during ${errorContext}: ${error.message}`;
      logger.error(errorMessage);

      mti.code = '503';
      mti.message = errorMessage;
    }
    // Send final response
    res.status(mti.code).send({ code: mti.code, message: mti.message });
  }

};

module.exports = registerApplication;
