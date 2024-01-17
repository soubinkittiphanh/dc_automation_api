const logger = require('../api/logger');
const { user } = require('../model'); // Adjust the path based on your project structure

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
      const newUser = await user.create({
        profileId,
        profileName,
        profileProvider,
        isActive,
      });
      res.json(newUser);
    } catch (error) {
      logger.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
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
};

module.exports = userController;
