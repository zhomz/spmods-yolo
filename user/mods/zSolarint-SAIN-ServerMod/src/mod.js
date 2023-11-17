"use strict";
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/brace-style */
Object.defineProperty(exports, "__esModule", { value: true });
const ConfigTypes_1 = require("C:/snapshot/project/obj/models/enums/ConfigTypes");
let botConfig;
let pmcConfig;
let configServer;
let logger;
class SAIN {
    postDBLoad(container) {
        logger = container.resolve("WinstonLogger");
        configServer = container.resolve("ConfigServer");
        pmcConfig = configServer.getConfig(ConfigTypes_1.ConfigTypes.PMC);
        botConfig = configServer.getConfig(ConfigTypes_1.ConfigTypes.BOT);
        const databaseServer = container.resolve("DatabaseServer");
        const tables = databaseServer.getTables();
        // Get all PMCTypes dynamically
        const pmcTypes = Object.keys(pmcConfig.pmcType);
        // Loop through each PMCTypes
        for (const pmcType of pmcTypes) {
            const maps = Object.keys(pmcConfig.pmcType[pmcType]);
            // Loop through each map
            for (const map of maps) {
                const brain = pmcConfig.pmcType[pmcType][map];
                for (const prop in brain) {
                    if (prop === 'pmcBot') {
                        brain[prop] = 1; // Set pmcBot property to 1
                    }
                    else {
                        brain[prop] = 0; // Set all other properties to 0
                    }
                }
            }
        }
        const maps = Object.keys((botConfig.assaultBrainType));
        // Loop through each map
        for (const map of maps) {
            const brain = botConfig.assaultBrainType[map];
            for (const prop in brain) {
                if (prop === 'assault') {
                    brain[prop] = 1; // Set assault property to 1
                }
                else {
                    brain[prop] = 0; // Set all other properties to 0
                }
            }
        }
        for (const locationName in tables.locations) {
            const location = tables.locations[locationName].base;
            if (location && location.BotLocationModifier) {
                location.BotLocationModifier.AccuracySpeed = 1;
                location.BotLocationModifier.GainSight = 1;
                location.BotLocationModifier.Scattering = 1;
                location.BotLocationModifier.VisibleDistance = 1;
            }
        }
    }
}
module.exports = { mod: new SAIN() };
//# sourceMappingURL=mod.js.map