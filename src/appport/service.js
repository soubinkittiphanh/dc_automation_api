const logger = require("../api/logger");
const AppPort= require('../model').appPort; // Adjust the path based on your project structure

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
    createPort: async (port,companyId, type, isActive, transaction) => {
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
}

module.exports = service