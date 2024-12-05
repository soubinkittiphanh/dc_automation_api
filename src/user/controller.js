const logger = require('../api/logger');
const { user } = require('../model'); // Adjust the path based on your project structure
const userService = require('./service')
// Controller to handle CRUD operations for users
const userController = {
  // Get all users
  getAllUsers: async (req, res) => {
    try {
      const users = await user.findAll();
      res.json(users);
    } catch (error) {
      logger.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  // Get a single user by ID
  getUserById: async (req, res) => {
    const { id } = req.params;
    try {
      const userInstance = await user.findByPk(id);
      if (userInstance) {
        res.json(userInstance);
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      logger.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  // Create a new user
  createUser: async (req, res) => {
    const { profileId, profileName, profileProvider, isActive } = req.body;
    try {
      const dbUser = await userService.getUserByProfileId(profileId);
      let registerStatus = 201;
      if (dbUser) {
        if (dbUser.company) {
          logger.info(`Customer already register completed`)
          logger.info(dbUser.company)
          registerStatus = 202
        } else {
          logger.warn(`Customer already register not yet 100% completed`)
          registerStatus = 201
        }
        return res.status(registerStatus).json(dbUser);

      }
      const newUser = await user.create({
        profileId,
        profileName,
        profileProvider,
        isActive,
      });
      res.status(201).json(newUser);
    } catch (error) {
      logger.error(error);
      res.status(500).json({ error: `Internal Server Error ${error}` });
    }
  },

  // Update an existing user by ID
  updateUserById: async (req, res) => {
    const { id } = req.params;
    const { profileId, profileName, profileProvider, isActive } = req.body;
    try {
      const userInstance = await user.findByPk(id);
      if (userInstance) {
        await userInstance.update({
          profileId,
          profileName,
          profileProvider,
          isActive,
        });
        res.json(userInstance);
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      logger.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  // Delete a user by ID
  deleteUserById: async (req, res) => {
    const { id } = req.params;
    try {
      const userInstance = await user.findByPk(id);
      if (userInstance) {
        await userInstance.destroy();
        res.json({ message: 'User deleted successfully' });
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      logger.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  // Register user
  registerUser: async (req, res) => {
    const { profileId, profileName, profileProvider, isActive } = req.body;
    logger.info(`User payload ${JSON.stringify(req.body)}`);
    // return res.status(200).send(req.body);
    const containsSpecialChars = (str) => /[^a-zA-Z0-9\s]/.test(str);


    if (containsSpecialChars(profileId)) {
      logger.error(`Input contains special characters ${profileId}`);
    } else {
      logger.info(`Input is clean ${profileId}`);
      return res.status(503).send(`Printer serial number cannot contain special char: ${profileId} `)
    }
    const dbUser = await userService.getUserByProfileId(profileId);
    if (dbUser) return res.status(503).send(`User already registered please login instead`)
    const userCreated = await userService.createUser(req.body);
    res.status(201).json(userCreated);
  },
  validatePrinterSerialNumber: async (req, res) => {

    const { printerSerialNo } = req.params;
    logger.info(`Validating data ${printerSerialNo}`)
    const dbUser = await userService.getUserByProfileId(printerSerialNo);
    logger.info(`Validating data finish ${dbUser}`)
    if (dbUser) return res.status(503).send(`User already registered please login instead`)
    // const userCreated = await userService.createUser();
    res.status(200).send('unregister device');
  }
};

module.exports = userController;
