const logger = require("../api/logger");
const AppPort = require('../model').appPort; // Adjust the path based on your project structure

const service = {
    // Get a single app port by ID
    getPortById: async (port, type) => {
        try {
            const portInstance = await AppPort.findOne({
                where: {
                    port, type
                }
            });
            if (portInstance) {
                return portInstance;
            } else {
                return null
            }
        } catch (error) {
            logger.error(error);
            return null
        }
    },

    // Create a new app port
    createPort: async (port, companyId, type, isActive, transaction) => {
        try {
            const newPort = await AppPort.create({
                port,
                companyId,
                type,
                isActive,
            }, { transaction });
            return newPort
        } catch (error) {
            logger.error(error);
            return null
        }
    },
    // Find Max Port
    findMaxPort: async (type) => {
        try {
            const result = await AppPort.max('port', {
                where: { type },
            });
            console.log('Max Port:', result);
            return result
        } catch (error) {
            logger.error(`Not able to get current port ${error}`);
            return null
        }
    },
    getMaxPort: async (req, res) => {
        try {
            // Use Sequelize's max method to get the maximum port value
            const maxPort = await AppPort.max('port', {
                where: { isActive: true } // Optional: Filter to include only active ports
            });

            if (maxPort === null) {
                return res.status(404).send({ message: 'No ports found.' });
            }

            res.status(200).send({ maxPort });
        } catch (error) {
            console.error(`Error fetching max port: ${error.message}`);
            res.status(500).send({ message: 'Failed to fetch max port.', error: error.message });
        }
    }
}

module.exports = service