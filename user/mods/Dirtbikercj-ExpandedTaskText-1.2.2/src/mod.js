"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LogTextColor_1 = require("C:/snapshot/project/obj/models/spt/logging/LogTextColor");
class DExpandedTaskText {
    constructor() {
        this.modConfig = require("../config/config.json");
        this.dbEN = require("../db/TasklocaleEN.json");
    }
    preAkiLoad(container) {
        this.logger = container.resolve("WinstonLogger");
        this.mod = require("../package.json");
    }
    postDBLoad(container) {
        // get database from server
        const database = container.resolve("DatabaseServer").getTables();
        this.getAllTasks(database);
        this.updateAllTasksText(database);
    }
    getAllTasks(database) {
        this.tasks = database.templates.quests;
        this.locale = database.locales.global;
        this.handBook = database.templates.handbook;
    }
    updateAllTasksText(database) {
        Object.keys(this.tasks).forEach(key => {
            for (const localeID in this.locale) {
                const originalDesc = this.locale[localeID][`${key} description`];
                let keyDesc;
                let collector;
                let lightKeeper;
                let durability;
                let requiredParts;
                let timeUntilNext;
                if (this.dbEN[key]?.IsKeyRequired == true && this.tasks[key]?._id == key) {
                    if (this.dbEN[key]?.OptionalKey == "") {
                        keyDesc = `Required key(s): ${this.dbEN[key].RequiredKey} \n`;
                    }
                    else if (this.dbEN[key]?.RequiredKey == "") {
                        keyDesc = `Optional key(s): ${this.dbEN[key].OptionalKey} \n`;
                    }
                    else {
                        keyDesc = `Required Key(s):  ${this.dbEN[key].RequiredKey} \n Optional Key(s): ${this.dbEN[key].OptionalKey} \n`;
                    }
                }
                if (this.dbEN[key]?.RequiredCollector || this.dbEN[key]?.RequiredLightkeeper) {
                    collector = `Required for Collector: ${this.dbEN[key].RequiredCollector} \n`;
                    lightKeeper = `Required for Lightkeeper: ${this.dbEN[key].RequiredLightkeeper} \n \n`;
                }
                if (this.dbEN[key]?.RequiredParts && this.dbEN[key]?.RequiredDurability) {
                    durability = `Required Durability: ${this.dbEN[key].RequiredDurability} \n`;
                    requiredParts = `Required Parts: \n ${this.dbEN[key].RequiredParts} \n`;
                }
                if (this.dbEN[key]?.TimeUntilNext) {
                    timeUntilNext = `Time until next task unlocks: ${this.dbEN[key].TimeUntilNext} \n`;
                }
                if (keyDesc == undefined) {
                    keyDesc = "";
                }
                if (collector == undefined) {
                    collector = "";
                }
                if (lightKeeper == undefined) {
                    lightKeeper = "";
                }
                if (requiredParts == undefined) {
                    requiredParts = "";
                }
                if (durability == undefined) {
                    durability = "";
                }
                if (timeUntilNext == undefined) {
                    timeUntilNext = "";
                }
                database.locales.global[localeID][`${key} description`] = timeUntilNext + durability + requiredParts + keyDesc + collector + lightKeeper + originalDesc;
            }
            if (this.dbEN[key]?.QuestName == undefined) {
                return;
            }
            this.logger.logWithColor(`${this.dbEN[key].QuestName} Information updated.`, LogTextColor_1.LogTextColor.GREEN);
        });
    }
}
module.exports = { mod: new DExpandedTaskText() };
