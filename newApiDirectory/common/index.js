const { exec } = require('child_process');
const logger = require('../api/logger');
const fs = require('fs');
const path = require('path');

// Example: Create a new directory using 'mkdir' command
// exec('mkdir newDirectory', (error, stdout, stderr) => {
//     if (error) {
//         logger.error(`Error: ${error.message}`);
//         return;
//     }
//     if (stderr) {
//         logger.error(`stderr: ${stderr}`);
//         return;
//     }
//     logger.warn(`Directory created successfully: ${stdout}`);
// });
const createApiDirectory = () => {
    const { exec } = require('child_process');

    // Example: Create a new directory using 'mkdir' command
    const path_local = `/Users/soubinkittiphanh/Desktop/Pro/dcommerce/dc_api_reg`
    exec(`mkdir -p ${path_local}/newApiDirectory`, (error, stdout, stderr) => {
        if (error) {
            logger.error(`Error: ${error.message}`);
            return;
        }
        if (stderr) {
            logger.error(`stderr: ${stderr}`);
            return;
        }
        logger.warn(`Directory created successfully: ${stdout}`);
    });
    // Example: Copy file directory using 'cp -r ' command
    exec(`cp -r ${path_local}/src/* ${path_local}/newApiDirectory`, (error, stdout, stderr) => {
        if (error) {
            logger.error(`Error: ${error.message}`);
            return;
        }
        if (stderr) {
            logger.error(`stderr: ${stderr}`);
            return;
        }
        logger.warn(`Directory created successfully: ${stdout}`);
    });


}
const createAppDirectory = () => {
    const { exec } = require('child_process');

    // Example: Create a new directory using 'mkdir' command
    const path_local = `/Users/soubinkittiphanh/Desktop/Pro/dcommerce/dc_api_reg`
    exec(`mkdir -p ${path_local}/newAppDirectory`, (error, stdout, stderr) => {
        if (error) {
            logger.error(`Error: ${error.message}`);
            return;
        }
        if (stderr) {
            logger.error(`stderr: ${stderr}`);
            return;
        }
        logger.warn(`Directory created successfully: ${stdout}`);
    });

}

const createSupervisorcltConfigFile = (companyInfo) => {
    const {
        companyName,
        apiDirectory,
        apiPort,

    } = companyInfo
    const path_local = `/Users/soubinkittiphanh/Desktop/Pro/dcommerce/dc_api_reg`
    const filePath = path.join(path_local, 'api.conf');
    const fileContent = `[program:api_${apiPort}]
    command=/root/.nvm/versions/node/v16.20.2/bin/node /root/api/dc_little_boutique_2024/src/index.js
    environment=PORT=${apiPort}
    autostart=true
    startsecs=10
    autorestart=true
    startretries=3
    redirect_stderr=true
    stdout_logfile = /var/log/supervisor/api_${apiPort}.log
    directory =/root/api/dc_little_boutique_2024
    logfile_maxbytes=50MB
    logfile_backups=5`;

    // Create the file with content using fs.writeFile
    fs.writeFile(filePath, fileContent, 'utf8', (err) => {
        if (err) {
            logger.error(`Error creating file: ${err.message}`);
        } else {
            logger.info(`File '${filePath}' created with content.`);

            // If you want to read the file after creation, you can use fs.readFile
            fs.readFile(filePath, 'utf8', (readErr, data) => {
                if (readErr) {
                    logger.error(`Error reading file: ${readErr.message}`);
                } else {
                    logger.warn(`File content: ${data}`);
                }
            });
        }
    });

}


module.exports = {
    createApiDirectory,
    createAppDirectory,
    createSupervisorcltConfigFile
}