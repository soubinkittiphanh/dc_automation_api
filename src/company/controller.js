const logger = require('../api/logger');
const company_profile = require('../model').company; // Adjust the path based on your project structure

const companyProfileController = {
  // Get all company profiles
  getAllProfiles: async (req, res) => {
    try {
      const profiles = await company_profile.findAll();
      res.json(profiles);
    } catch (error) {
      logger.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  // Get a single company profile by ID
  getProfileById: async (req, res) => {
    const { id } = req.params;
    try {
      const profile = await company_profile.findByPk(id);
      if (profile) {
        res.json(profile);
      } else {
        res.status(404).json({ error: 'Profile not found' });
      }
    } catch (error) {
      logger.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  // Get a single company profile by ID
  getProfileByUserId: async (req, res) => {
    const { userId } = req.params;
    try {
      const profile = await company_profile.findOne({userId});
      if (profile) {
        res.json(profile);
      } else {
        res.status(404).json({ error: 'Profile not found' });
      }
    } catch (error) {
      logger.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  // Create a new company profile
  createProfile: async (req, res) => {
    const {
      companyName,
      companyEmail,
      companyTelephone,
      systemPackage,
      apiLink,
      appLink,
      appPort,
      apiPort,
      db,
      isActive,
    } = req.body;
    try {
      const newProfile = await company_profile.create({
        companyName,
        companyEmail,
        companyTelephone,
        systemPackage,
        apiLink,
        appLink,
        appPort,
        apiPort,
        db,
        isActive,
      });
      res.json(newProfile);
    } catch (error) {
      logger.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  // Update an existing company profile by ID
  updateProfileById: async (req, res) => {
    const { id } = req.params;
    const {
      companyName,
      companyEmail,
      companyTelephone,
      systemPackage,
      apiLink,
      appLink,
      appPort,
      apiPort,
      db,
      isActive,
    } = req.body;
    try {
      const profile = await company_profile.findByPk(id);
      if (profile) {
        await profile.update({
          companyName,
          companyEmail,
          companyTelephone,
          systemPackage,
          apiLink,
          appLink,
          appPort,
          apiPort,
          db,
          isActive,
        });
        res.json(profile);
      } else {
        res.status(404).json({ error: 'Profile not found' });
      }
    } catch (error) {
      logger.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  // Delete a company profile by ID
  deleteProfileById: async (req, res) => {
    const { id } = req.params;
    try {
      const profile = await company_profile.findByPk(id);
      if (profile) {
        await profile.destroy();
        res.json({ message: 'Profile deleted successfully' });
      } else {
        res.status(404).json({ error: 'Profile not found' });
      }
    } catch (error) {
      logger.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};

module.exports = companyProfileController;
