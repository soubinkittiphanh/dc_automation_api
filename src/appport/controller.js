const logger = require('../api/logger');
const AppPort = require('../model').appPort; // Adjust the path based on your project structure

const appPortController = {
  // Get all app ports
  getAllPorts: async (req, res) => {
    try {
      const ports = await AppPort.findAll();
      res.json(ports);
    } catch (error) {
      logger.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  // Get a single app port by ID
  getPortById: async (req, res) => {
    const { id } = req.params;
    try {
      const port = await AppPort.findByPk(id);
      if (port) {
        res.json(port);
      } else {
        res.status(404).json({ error: 'App port not found' });
      }
    } catch (error) {
      logger.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  // Create a new app port
  createPort: async (req, res) => {
    const { port, type, isActive } = req.body;
    try {
      const newPort = await AppPort.create({
        port,
        type,
        isActive,
      });
      res.json(newPort);
    } catch (error) {
      logger.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  // Update an existing app port by ID
  updatePortById: async (req, res) => {
    const { id } = req.params;
    const { port, type, isActive } = req.body;
    try {
      const appPort = await AppPort.findByPk(id);
      if (appPort) {
        await appPort.update({
          port,
          type,
          isActive,
        });
        res.json(appPort);
      } else {
        res.status(404).json({ error: 'App port not found' });
      }
    } catch (error) {
      logger.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  // Delete an app port by ID
  deletePortById: async (req, res) => {
    const { id } = req.params;
    try {
      const appPort = await AppPort.findByPk(id);
      if (appPort) {
        await appPort.destroy();
        res.json({ message: 'App port deleted successfully' });
      } else {
        res.status(404).json({ error: 'App port not found' });
      }
    } catch (error) {
      logger.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },


};

module.exports = appPortController;
