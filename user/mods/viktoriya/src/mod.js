"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const ConfigTypes_1 = require("C:/snapshot/project/obj/models/enums/ConfigTypes");
const Traders_1 = require("C:/snapshot/project/obj/models/enums/Traders");
// New trader settings
const baseJson = __importStar(require("../db/base.json"));
const traderHelpers_1 = require("./helpers/traderHelpers");
// New quests
const questJson = __importStar(require("../db/quests.json"));
//load configgy
const configLoader_1 = require("./configLoader");
// more helpers
const itemCreateHelper_1 = require("./helpers/itemCreateHelper");
const presetCreateHelper_1 = require("./helpers/presetCreateHelper");
class Vicktoriya {
    mod;
    logger;
    traderHeper;
    configLoader;
    constructor() {
        this.mod = "viktoriya"; // Set name of mod so we can log it to console later
    }
    static container;
    vikConfig;
    /**
     * Some work needs to be done prior to SPT code being loaded, registering the profile image + setting trader update time inside the trader config json
     * @param container Dependency container
     */
    preAkiLoad(container) {
        //Set up vik configgy
        this.configLoader = new configLoader_1.ConfigLoader();
        this.vikConfig = this.configLoader.configgy;
        // Attach container
        Vicktoriya.container = container;
        // Get a logger
        this.logger = container.resolve("WinstonLogger");
        this.logger.debug(`[${this.mod}] preAki Loading... `);
        // Get SPT code/data we need later
        const preAkiModLoader = container.resolve("PreAkiModLoader");
        const imageRouter = container.resolve("ImageRouter");
        const configServer = container.resolve("ConfigServer");
        const traderConfig = configServer.getConfig(ConfigTypes_1.ConfigTypes.TRADER);
        // This overrides openRandomLootContainer method in InventoryController this will not need to change. Ever.
        container.afterResolution("InventoryController", (_t, result) => {
            result.openRandomLootContainer = (pmcData, body, sessionID) => {
                return this.newOpenRandomLoot(container, pmcData, body, sessionID);
            };
        });
        // Create helper class and use it to register our traders image/icon + set its stock refresh time
        this.traderHeper = new traderHelpers_1.TraderHelper();
        const traderImage = this.vikConfig.useRealistic ? "viktoriya_alt.jpg" : "viktoriya.jpg";
        this.traderHeper.registerProfileImage(baseJson, this.mod, preAkiModLoader, imageRouter, traderImage);
        this.traderHeper.setTraderUpdateTime(traderConfig, baseJson, 3600);
        // Add ourselves to the Traders enum
        Traders_1.Traders["viktoriya"] = "viktoriya";
        this.logger.debug(`[${this.mod}] preAki Loaded`);
    }
    postAkiLoad(container) {
        this.doBlacklist(container);
    }
    /**
     * Majority of trader-related work occurs after the aki database has been loaded but prior to SPT code being run
     * @param container Dependency container
     */
    postDBLoad(container) {
        this.logger.debug(`[${this.mod}] postDb Loading... `);
        // Resolve SPT classes we'll use
        const databaseServer = container.resolve("DatabaseServer");
        //const configServer: ConfigServer = container.resolve<ConfigServer>("ConfigServer");
        const jsonUtil = container.resolve("JsonUtil");
        //item create helper
        const itemCreate = new itemCreateHelper_1.ItemCreateHelper();
        // preset create helper
        const presetCreate = new presetCreateHelper_1.PresetCreateHelper();
        // add quest zones
        this.addQuestZones(container);
        // Create our items
        itemCreate.createItems(container);
        // Get a reference to the database tables
        const tables = databaseServer.getTables();
        // Adding presets into DB
        //Also creating the preset
        presetCreate.createItemPresets(tables);
        // Add new trader to the trader dictionary in DatabaseServer - has no assorts (items) yet
        this.traderHeper.addTraderToDb(baseJson, tables, jsonUtil);
        //Add quests to DB
        for (const quest in questJson) {
            if (quest != "default") {
                const questToAdd = questJson[quest];
                tables.templates.quests[quest] = questToAdd;
            }
        }
        // for (const zone in tables.globals["QuestZones"]) {
        //     console.log(zone);
        // }
        // Add some singular items to trader (items without sub-items e.g. milk/bandage)
        this.traderHeper.addSingleItemsToTrader(tables, baseJson._id);
        this.traderHeper.addComplexItemsToTrader(tables, baseJson._id, jsonUtil);
        // Add trader to locale file, ensures trader text shows properly on screen
        // WARNING: adds the same text to ALL locales (e.g. chinese/french/english)
        this.traderHeper.addTraderToLocales(baseJson, tables, baseJson.name, "Viktoriya", baseJson.nickname, baseJson.location, "Come, take a seat");
        this.logger.debug(`[${this.mod}] postDb Loaded`);
    }
    // This is the replacement for the base openRandomLootContainer method
    // This is where all the yummy gambling happens!
    newOpenRandomLoot(container, pmcData, body, sessionID) {
        // All of this is required to reference the methods.
        const lootGenerator = container.resolve("LootGenerator");
        const itemHelper = container.resolve("ItemHelper");
        const inventoryHelper = container.resolve("InventoryHelper");
        const eventOutputHolder = container.resolve("EventOutputHolder");
        const randomUtil = container.resolve("RandomUtil");
        const openedItem = pmcData.Inventory.items.find(x => x._id === body.item);
        const containerDetails = itemHelper.getItem(openedItem._tpl);
        const isSealedWeaponBox = containerDetails[1]._name.includes("event_container_airdrop");
        const isGamblingContainer = containerDetails[1]._name.includes("gambling_container");
        this.vikConfig = this.configLoader.configgy;
        const newItemRequest = {
            tid: "RandomLootContainer",
            items: []
        };
        let foundInRaid = false;
        // Start the logic for opening a container, most of is this is copied from the base method, but added gambling containers to the mix
        if (isSealedWeaponBox) {
            const containerSettings = inventoryHelper.getInventoryConfig().sealedAirdropContainer;
            newItemRequest.items.push(...lootGenerator.getSealedWeaponCaseLoot(containerSettings));
            foundInRaid = containerSettings.foundInRaid;
        }
        // This is our bit here. If the container is a gambling container, we take over the logic and our own thing.
        else if (isGamblingContainer) {
            // Just to reference the item
            const whichGamblingContainer = containerDetails[1];
            // Gambling wallet logic start
            if (whichGamblingContainer._name.includes("wallet")) {
                let stackCount;
                // This is to find the item you are unpacking for stack handling.
                pmcData.Inventory.items.find(item => {
                    if (item._id == body.item) {
                        stackCount = item.upd.StackObjectsCount;
                    }
                });
                let roll;
                let money = 0;
                let loops = 0;
                // This loops how many items you are unpacking in the stack
                while (stackCount > loops) {
                    roll = randomUtil.getInt(1, this.vikConfig.wr_five);
                    if (roll >= this.vikConfig.wr_one) {
                        if (roll <= this.vikConfig.wr_two) {
                            money += 100000;
                            console.log("100k");
                        }
                        else if (roll <= this.vikConfig.wr_three) {
                            console.log("300k");
                            money += 300000;
                        }
                        else if (roll <= this.vikConfig.wr_four) {
                            money += 500000;
                            console.log("500k");
                        }
                        else {
                            money += 2000000;
                            console.log("2m");
                        }
                    }
                    loops++;
                    console.log(money);
                }
                // for (let i = 0; i++; i < stackCount)
                // {
                // }
                console.log("You opened " + loops + " wallets and earned " + money +
                    ". Spending a total of: " + stackCount * 100000);
                // If you win push money item into inventory
                if (money > 0) {
                    const id = "5449016a4bdc2d6f028b456f";
                    newItemRequest.items.push(this.addToNewItemArray(id, false, money));
                    foundInRaid = true;
                }
            }
            // This is the keycard gambling logic
            else if (whichGamblingContainer._name.includes("keycard")) {
                // Card value in order
                // Access > Marked > Yellow > Black > Violet > Blue > Green > Red
                // This if block controls the chances of getting the item, in order
                let roll = randomUtil.getInt(1, this.vikConfig.kcr_eight);
                let id;
                if (roll <= this.vikConfig.kcr_one) {
                    id = "5c94bbff86f7747ee735c08f";
                }
                else if (roll <= this.vikConfig.kcr_two) {
                    id = "5efde6b4f5448336730dbd61";
                }
                else if (roll <= this.vikConfig.kcr_three) {
                    id = "5c1d0d6d86f7744bb2683e1f";
                }
                else if (roll <= this.vikConfig.kcr_four) {
                    id = "5c1d0f4986f7744bb01837fa";
                }
                else if (roll <= this.vikConfig.kcr_five) {
                    id = "5c1e495a86f7743109743dfb";
                }
                else if (roll <= this.vikConfig.kcr_six) {
                    id = "5c1d0c5f86f7744bb2683cf0";
                }
                else if (roll <= this.vikConfig.kcr_seven) {
                    id = "5c1d0dc586f7744baf2e7b79";
                }
                else {
                    id = "5c1d0efb86f7744baf2e7b7b";
                }
                roll = randomUtil.getInt(1, 100);
                if (roll >= (this.vikConfig.oranment_chance - 100)) {
                    //win ornament
                    newItemRequest.items.push(this.addToNewItemArray("viktoriyas_voucher", false, 1));
                }
                // Push the keycard to item array for insert
                newItemRequest.items.push(this.addToNewItemArray(id, false, 1));
                foundInRaid = true;
            }
            // This is the keycard gambling logic
            else if (whichGamblingContainer._name.includes("viktoriyas")) {
                // Card value in order
                // Access > Marked > Yellow > Black > Violet > Blue > Green > Red
                // This if block controls the chances of getting the item, in order
                const roll = randomUtil.getInt(1, this.vikConfig.vsc_thirteen);
                let id;
                let isPreset = false;
                let count;
                const isFIR = false;
                if (roll <= this.vikConfig.vsc_one) {
                    // For preset items make it the id you set for the preset
                    // Make sure isPreset is true
                    id = "exfilb";
                    count = 1;
                    isPreset = true;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                }
                else if (roll <= this.vikConfig.vsc_two) {
                    id = "5e4abb5086f77406975c9342";
                    count = 1;
                    isPreset = false;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                }
                else if (roll <= this.vikConfig.vsc_three) {
                    id = "exfilcoyote";
                    count = 1;
                    isPreset = true;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                }
                else if (roll <= this.vikConfig.vsc_four) {
                    // RD704 Gun preset
                    id = "rd704_vik";
                    count = 1;
                    isPreset = true;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    // BP AMMO
                    id = "59e0d99486f7744a32234762";
                    count = 150;
                    isPreset = false;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    // Mags
                    id = "59d6272486f77466146386ff";
                    count = 3;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                }
                else if (roll <= this.vikConfig.vsc_five) {
                    id = "5b44cf1486f77431723e3d05";
                    count = 1;
                    isPreset = false;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                }
                else if (roll <= this.vikConfig.vsc_six) {
                    id = "5b44cd8b86f774503d30cba2";
                    count = 1;
                    isPreset = false;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                }
                else if (roll <= this.vikConfig.vsc_seven) {
                    // Gen 4 High Mobility
                    id = "5b44d0de86f774503d30cba8";
                    count = 1;
                    isPreset = false;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                }
                else if (roll <= this.vikConfig.vsc_eight) {
                    // Hexgrid
                    id = "5fd4c474dd870108a754b241";
                    count = 1;
                    isPreset = false;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                }
                else if (roll <= this.vikConfig.vsc_nine) {
                    id = "ak74n_vik"; // Need maybe two? 60 rounders + 60 IGOLNIK + 120 BP <5.45>
                    count = 1;
                    isPreset = true;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    // MAGS
                    id = "55d482194bdc2d1d4e8b456b";
                    count = 2;
                    isPreset = false;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    // AMMO IGOLNIK
                    id = "5c0d5e4486f77478390952fe";
                    count = 60;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    // AMMO BP
                    id = "56dfef82d2720bbd668b4567";
                    count = 120;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                }
                else if (roll <= this.vikConfig.vsc_ten) {
                    id = "vss_vik"; // Need three or four 6L25 (20 ammo) + 120 SP-6 
                    count = 1;
                    isPreset = true;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    // MAGS
                    id = "57838f9f2459774a150289a0";
                    count = 3;
                    isPreset = false;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    // AMMO
                    id = "57a0e5022459774d1673f889";
                    count = 120;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                }
                else if (roll <= this.vikConfig.vsc_eleven) {
                    id = "t5000_vik"; // Need mags + ammo
                    count = 1;
                    isPreset = true;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    // MAGS x
                    id = "5df25b6c0b92095fd441e4cf";
                    count = 3;
                    isPreset = false;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    // AMMOx 
                    id = "58dd3ad986f77403051cba8f";
                    count = 40;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                }
                else if (roll <= this.vikConfig.vsc_twelve) {
                    id = "rsh12_vik"; // Add cowboy hat and 30 rounds of PS12B 
                    count = 1;
                    isPreset = true;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    // PS12B
                    id = "5cadf6eeae921500134b2799";
                    count = 30;
                    isPreset = false;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    //hat
                    id = "5aa2b9ede5b5b000137b758b";
                    count = 1;
                    isPreset = false;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                }
                else {
                    id = "altyns"; // Add cowboy hat and 30 rounds of PS12B 
                    count = 1;
                    isPreset = true;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                }
                foundInRaid = isFIR;
            }
            else if (whichGamblingContainer._name.includes("armor")) {
                // This if block controls the chances of getting the item, in order
                const roll = randomUtil.getInt(1, this.vikConfig.bac_twenty);
                let id;
                if (roll <= this.vikConfig.bac_one) {
                    id = "59e7635f86f7742cbf2c1095"; //module 3
                }
                else if (roll <= this.vikConfig.bac_two) {
                    id = "5648a7494bdc2d9d488b4583"; //paca
                }
                else if (roll <= this.vikConfig.bac_three) {
                    id = "5df8a2ca86f7740bfe6df777"; //6b2
                }
                else if (roll <= this.vikConfig.bac_four) {
                    id = "5ab8e4ed86f7742d8e50c7fa"; //blue thing aka untar
                }
                else if (roll <= this.vikConfig.bac_five) {
                    id = "5c0e5edb86f77461f55ed1f7"; //press
                }
                else if (roll <= this.vikConfig.bac_six) {
                    id = "5c0e5bab86f77461f55ed1f3"; //digital flora 6b23-1
                }
                else if (roll <= this.vikConfig.bac_seven) {
                    id = "5b44d22286f774172b0c9de8"; //kirasa
                }
                else if (roll <= this.vikConfig.bac_eight) {
                    id = "5c0e655586f774045612eeb2"; //trooper 
                }
                else if (roll <= this.vikConfig.bac_nine) {
                    id = "609e8540d5c319764c2bc2e9"; //thor
                }
                else if (roll <= this.vikConfig.bac_ten) {
                    id = "5c0e53c886f7747fa54205c7"; //6b13 digital flora
                }
                else if (roll <= this.vikConfig.bac_eleven) {
                    id = "5c0e57ba86f7747fa141986d"; //6b23-2 mountain flora
                }
                else if (roll <= this.vikConfig.bac_twelve) {
                    id = "63737f448b28897f2802b874"; //hexatac 
                }
                else if (roll <= this.vikConfig.bac_thirteen) {
                    id = "5f5f41476bdad616ad46d631"; //korund
                }
                else if (roll <= this.vikConfig.bac_fourteen) {
                    id = "5ca2151486f774244a3b8d30"; //redut
                }
                else if (roll <= this.vikConfig.bac_fifteen) {
                    id = "5b44d0de86f774503d30cba8"; //iotv gen4 high mobility
                }
                else if (roll <= this.vikConfig.bac_sixteen) {
                    id = "5e9dacf986f774054d6b89f4"; //FORT defender-2
                }
                else if (roll <= this.vikConfig.bac_seventeen) {
                    id = "5b44cf1486f77431723e3d05"; //iotv gen4 assault
                }
                else if (roll <= this.vikConfig.bac_eighteen) {
                    id = "5b44cd8b86f774503d30cba2"; //iotv gen 4 full prot
                }
                else if (roll <= this.vikConfig.bac_nineteen) {
                    id = "5ca21c6986f77479963115a7"; // redut t
                }
                else {
                    id = "5ab8e79e86f7742d8b372e78"; //gzhele
                }
                // Push the keycard to item array for insert
                newItemRequest.items.push(this.addToNewItemArray(id, false, 1));
                foundInRaid = false;
            }
            else if (whichGamblingContainer._name.includes("premium")) {
                // Card value in order
                // Access > Marked > Yellow > Black > Violet > Blue > Green > Red
                // This if block controls the chances of getting the item, in order
                const roll = randomUtil.getInt(1, this.vikConfig.pac_twenty);
                let id;
                if (roll <= this.vikConfig.pac_one) {
                    id = "5c0e655586f774045612eeb2"; //trooper 
                }
                else if (roll <= this.vikConfig.pac_two) {
                    id = "609e8540d5c319764c2bc2e9"; //thor
                }
                else if (roll <= this.vikConfig.pac_three) {
                    id = "5c0e53c886f7747fa54205c7"; //6b13 digital flora
                }
                else if (roll <= this.vikConfig.pac_four) {
                    id = "5c0e57ba86f7747fa141986d"; //6b23-2 mountain flora
                }
                else if (roll <= this.vikConfig.pac_five) {
                    id = "63737f448b28897f2802b874"; //hexatac 5.5
                }
                else if (roll <= this.vikConfig.pac_six) {
                    id = "5f5f41476bdad616ad46d631"; //korund 5.5
                }
                else if (roll <= this.vikConfig.pac_seven) {
                    id = "5ca2151486f774244a3b8d30"; //redut 5.5
                }
                else if (roll <= this.vikConfig.pac_eight) {
                    id = "5b44d0de86f774503d30cba8"; //iotv gen4 high mobility 5.5
                }
                else if (roll <= this.vikConfig.pac_nine) {
                    id = "5e9dacf986f774054d6b89f4"; //FORT defender-2 5.5
                }
                else if (roll <= this.vikConfig.pac_ten) {
                    id = "5b44cf1486f77431723e3d05"; //iotv gen4 assault 5.5
                }
                else if (roll <= this.vikConfig.pac_eleven) {
                    id = "5b44cd8b86f774503d30cba2"; //iotv gen 4 full prot 5.5
                }
                else if (roll <= this.vikConfig.pac_twelve) {
                    id = "5ca21c6986f77479963115a7"; // redut t 5.5
                }
                else if (roll <= this.vikConfig.pac_thirteen) {
                    id = "5ab8e79e86f7742d8b372e78"; //gzhele 6%
                }
                else if (roll <= this.vikConfig.pac_fourteen) {
                    id = "5fd4c474dd870108a754b241"; //hexgrid 4
                }
                else if (roll <= this.vikConfig.pac_fifteen) {
                    id = "5c0e625a86f7742d77340f62"; // btni zhuk 4
                }
                else if (roll <= this.vikConfig.pac_sixteen) {
                    id = "60a283193cb70855c43a381d"; //thor 4
                }
                else if (roll <= this.vikConfig.pac_seventeen) {
                    id = "545cdb794bdc2d3a198b456a"; //zabralo 4 
                }
                else if (roll <= this.vikConfig.pac_eighteen) {
                    id = "6038b4ca92ec1c3103795a0d"; // olive slick 1.2
                }
                else if (roll <= this.vikConfig.pac_nineteen) {
                    id = "6038b4b292ec1c3103795a0b"; // tan slick 1.2
                }
                else {
                    id = "5e4abb5086f77406975c9342"; // black slick 1.6
                }
                // Push the armor to item array for insert
                newItemRequest.items.push(this.addToNewItemArray(id, false, 1));
                foundInRaid = true;
            }
            else if (whichGamblingContainer._name.includes("762")) {
                const roll = randomUtil.getInt(1, this.vikConfig.sstc_twelve);
                let id;
                let isPreset = false;
                let count;
                const isFIR = false;
                console.log(roll);
                if (roll <= this.vikConfig.sstc_one) {
                    // RD704 Gun preset
                    id = "rd704_vik";
                    count = 1;
                    isPreset = true;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    // Mags
                    id = "59d6272486f77466146386ff";
                    count = 3;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                }
                else if (roll <= this.vikConfig.sstc_two) {
                    //AK103 Preset
                    id = "vpo_vik";
                    count = 1;
                    isPreset = true;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    // Mags
                    id = "59d6272486f77466146386ff";
                    count = 3;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                }
                else if (roll <= this.vikConfig.sstc_three) {
                    //AK103 default
                    id = "5acf7e2b86f7740874790e20";
                    count = 1;
                    isPreset = true;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    // Mags
                    id = "6272874a6c47bd74f92e2087";
                    count = 3;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                }
                else if (roll <= this.vikConfig.sstc_four) {
                    //RD704 Default
                    id = "62972a7d91492d1a34152fbe";
                    count = 1;
                    isPreset = true;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    // Mags
                    id = "59d6272486f77466146386ff";
                    count = 3;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                }
                else if (roll <= this.vikConfig.sstc_five) {
                    //Mutant
                    id = "60b7d76e2a3c79100f1979de";
                    count = 1;
                    isPreset = true;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    // Mags
                    id = "59d6272486f77466146386ff";
                    count = 3;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                }
                else if (roll <= this.vikConfig.sstc_six) {
                    //AK-104 Default
                    id = "5acf7e4c86f774499a3f3bdd";
                    count = 1;
                    isPreset = true;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    // Mags
                    id = "5ac66bea5acfc43b321d4aec";
                    count = 3;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                }
                else if (roll <= this.vikConfig.sstc_seven) {
                    //AKM
                    id = "59e8d2ab86f77407f03fc9c2";
                    count = 1;
                    isPreset = true;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    // Mags
                    id = "59d625f086f774661516605d";
                    count = 3;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                }
                else if (roll <= this.vikConfig.sstc_eight) {
                    //AKMN
                    id = "5a325c3686f7744273716c5b";
                    count = 1;
                    isPreset = true;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    // Mags
                    id = "59d625f086f774661516605d";
                    count = 3;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                }
                else if (roll <= this.vikConfig.sstc_nine) {
                    //AKMS
                    id = "5a327f4a86f774766866140b";
                    count = 1;
                    isPreset = true;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    // Mags
                    id = "5a0060fc86f7745793204432";
                    count = 3;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                }
                else if (roll <= this.vikConfig.sstc_ten) {
                    //AKMSN Default
                    id = "5ac4ab8886f7747d0f66429a";
                    count = 1;
                    isPreset = true;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    // Mags
                    id = "5a0060fc86f7745793204432";
                    count = 3;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                }
                else if (roll <= this.vikConfig.sstc_eleven) {
                    //VPO136
                    id = "59ef24b986f77439987b8762";
                    count = 1;
                    isPreset = true;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    // Mags
                    id = "5a0060fc86f7745793204432";
                    count = 3;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                }
                else {
                    //AK103 Preset
                    id = "ak103_vik";
                    count = 1;
                    isPreset = true;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    // Mags
                    id = "6272874a6c47bd74f92e2087";
                    count = 3;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                }
                foundInRaid = isFIR;
            }
            else if (whichGamblingContainer._name.includes("545")) {
                const roll = randomUtil.getInt(1, this.vikConfig.fff_twelve);
                let id;
                let isPreset = false;
                let count;
                const isFIR = false;
                console.log(roll);
                if (roll <= this.vikConfig.fff_one) {
                    // SAG545 default
                    id = "62971cf67af74c3ff577954b";
                    count = 1;
                    isPreset = true;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    // Mags
                    id = "59d6272486f77466146386ff";
                    count = 3;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                }
                else if (roll <= this.vikConfig.fff_two) {
                    //sag545 preset
                    id = "sag545_vik";
                    count = 1;
                    isPreset = true;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    // Mags
                    id = "59d6272486f77466146386ff";
                    count = 3;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                }
                else if (roll <= this.vikConfig.fff_three) {
                    //AK105 default
                    id = "5acf7e7986f774401e19c3a0";
                    count = 1;
                    isPreset = true;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    // Mags
                    id = "6272874a6c47bd74f92e2087";
                    count = 3;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                }
                else if (roll <= this.vikConfig.fff_four) {
                    //ak 105 modded
                    id = "ak105_vik";
                    count = 1;
                    isPreset = true;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    // Mags
                    id = "59d6272486f77466146386ff";
                    count = 3;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                }
                else if (roll <= this.vikConfig.fff_five) {
                    // ak 74m default
                    id = "5acf7db286f7743a9c7092e3";
                    count = 1;
                    isPreset = true;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    // Mags
                    id = "59d6272486f77466146386ff";
                    count = 3;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                }
                else if (roll <= this.vikConfig.fff_six) {
                    //AK-74m modded
                    id = "ak74m_vik";
                    count = 1;
                    isPreset = true;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    // Mags
                    id = "5ac66bea5acfc43b321d4aec";
                    count = 3;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                }
                else if (roll <= this.vikConfig.fff_seven) {
                    //ak 74n default
                    id = "5841474424597759ba49be91";
                    count = 1;
                    isPreset = true;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    // Mags
                    id = "59d625f086f774661516605d";
                    count = 3;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                }
                else if (roll <= this.vikConfig.fff_eight) {
                    //aks-74
                    id = "5ac4abf986f7747d117c67aa";
                    count = 1;
                    isPreset = true;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    // Mags
                    id = "59d625f086f774661516605d";
                    count = 3;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                }
                else if (roll <= this.vikConfig.fff_nine) {
                    //Aks-74u
                    id = "584147732459775a2b6d9f12";
                    count = 1;
                    isPreset = true;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    // Mags
                    id = "5a0060fc86f7745793204432";
                    count = 3;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                }
                else if (roll <= this.vikConfig.fff_ten) {
                    //AKs-74ub
                    id = "584147982459775a6c55e931";
                    count = 1;
                    isPreset = true;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    // Mags
                    id = "5a0060fc86f7745793204432";
                    count = 3;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                }
                else if (roll <= this.vikConfig.fff_eleven) {
                    //aks-74un
                    id = "584147ed2459775a77263501";
                    count = 1;
                    isPreset = true;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    // Mags
                    id = "5a0060fc86f7745793204432";
                    count = 3;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                }
                else {
                    //rpk-16
                    id = "5c0d1ec986f77439512a1a72";
                    count = 1;
                    isPreset = true;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    // Mags
                    id = "6272874a6c47bd74f92e2087";
                    count = 3;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                }
                foundInRaid = isFIR;
            }
            else if (whichGamblingContainer._name.includes("556")) {
                // Card value in order
                // Access > Marked > Yellow > Black > Violet > Blue > Green > Red
                // This if block controls the chances of getting the item, in order
                const roll = randomUtil.getInt(1, this.vikConfig.fourteen);
                let id;
                let isPreset = false;
                let count;
                const isFIR = false;
                if (roll <= this.vikConfig.ffs_once) {
                    // For preset items make it the id you set for the preset
                    // Make sure isPreset is true
                    id = "ak101_vik";
                    count = 1;
                    isPreset = true;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    // Mags
                    id = "5c0548ae0db834001966a3c2";
                    count = 3;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                }
                else if (roll <= this.vikConfig.tow) {
                    // ADAR Gun preset
                    id = "adar_vik";
                    count = 1;
                    isPreset = true;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    // Mags zmień
                    id = "5aaa5dfee5b5b000140293d3";
                    count = 3;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                }
                else if (roll <= this.vikConfig.three) {
                    id = "m4a1_vik";
                    count = 1;
                    isPreset = true;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    // Mags
                    id = "5aaa5dfee5b5b000140293d3";
                    count = 3;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                }
                else if (roll <= this.vikConfig.four) {
                    id = "mdr_vik";
                    count = 1;
                    isPreset = true;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    // Mags
                    id = "5aaa5dfee5b5b000140293d3";
                    count = 3;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                }
                else if (roll <= this.vikConfig.five) {
                    id = "5acf7dd986f774486e1281bf"; // AK 101
                    count = 1;
                    isPreset = true;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    // Mags
                    id = "5ac66c5d5acfc4001718d314";
                    count = 3;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                }
                else if (roll <= this.vikConfig.six) {
                    id = "5acf7dfc86f774401e19c390"; // ak102
                    count = 1;
                    isPreset = true;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    // Mags
                    id = "5ac66c5d5acfc4001718d314";
                    count = 3;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                }
                else if (roll <= this.vikConfig.seven) {
                    id = "63986752a28b76105a33c095"; // AUG A3
                    count = 1;
                    isPreset = true;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    // Mags
                    id = "62e7c98b550c8218d602cbb4";
                    count = 3;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                }
                else if (roll <= this.vikConfig.eight) {
                    id = "5c98bd7386f7740cfb15654e"; // MDR????
                    count = 1;
                    isPreset = true;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    // Mags
                    id = "62e7c98b550c8218d602cbb4";
                    count = 3;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                }
                else if (roll <= this.vikConfig.nine) {
                    id = "5c0d1e9386f77440120288b7"; // hk416
                    count = 1;
                    isPreset = true;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    // Mags
                    id = "5c05413a0db834001c390617";
                    count = 3;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                }
                else if (roll <= this.vikConfig.ten) {
                    id = "6297738b9f1b474e440c45b5"; // G36
                    count = 1;
                    isPreset = true;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    // Mags
                    id = "62307b7b10d2321fa8741921";
                    count = 3;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                }
                else if (roll <= this.vikConfig.eleven) {
                    id = "5af08cf886f774223c269184"; // m4a1
                    count = 1;
                    isPreset = true;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    // Mags
                    id = "55d4887d4bdc2d962f8b4570";
                    count = 3;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                }
                else if (roll <= this.vikConfig.twelve) {
                    id = "6193e226449ec003d9127fa6"; // Mk16
                    count = 1;
                    isPreset = true;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    // Mags
                    id = "61840d85568c120fdd2962a5";
                    count = 3;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                }
                else if (roll <= this.vikConfig.thirteen) {
                    id = "5c10fcb186f774533e5529ab"; // adar
                    count = 1;
                    isPreset = true;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    // Mags
                    id = "5aaa5e60e5b5b000140293d6";
                    count = 3;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                }
                else {
                    id = "5d4d617f86f77449c463d107"; //TX-15
                    count = 1;
                    isPreset = true;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    // Mags
                    id = "5aaa5dfee5b5b000140293d3";
                    count = 3;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                }
                foundInRaid = isFIR;
            }
            else if (whichGamblingContainer._name.includes("kc_prm")) {
                let roll = randomUtil.getInt(1, 1000);
                let id;
                if (roll <= 600) {
                    id = "57347d7224597744596b4e72"; //tushonka
                }
                else if (roll <= 750) {
                    id = "5c1d0d6d86f7744bb2683e1f"; // yellow kc
                }
                else if (roll <= 870) {
                    id = "5c1d0f4986f7744bb01837fa"; // black kc
                }
                else if (roll <= 945) {
                    id = "5c1e495a86f7743109743dfb"; // violet kc
                }
                else if (roll <= 985) {
                    id = "5c1d0c5f86f7744bb2683cf0"; // blue kc
                }
                else if (roll <= 995) {
                    id = "5c1d0dc586f7744baf2e7b79"; // green kc
                }
                else {
                    id = "5c1d0efb86f7744baf2e7b7b"; // red kc
                }
                roll = randomUtil.getInt(1, 100);
                if (roll >= (70)) {
                    //win ornament
                    newItemRequest.items.push(this.addToNewItemArray("viktoriyas_voucher", false, 1));
                }
                // Push the keycard to item array for insert
                newItemRequest.items.push(this.addToNewItemArray(id, false, 1));
                foundInRaid = true;
            }
            else if (whichGamblingContainer._name.includes("50/50")) {
                const roll = randomUtil.getInt(1, 1000);
                let id;
                if (roll <= 500) {
                    id = "57347d7224597744596b4e72";
                    newItemRequest.items.push(this.addToNewItemArray(id, false, 1));
                    foundInRaid = true;
                }
                else {
                    const id = "5449016a4bdc2d6f028b456f";
                    newItemRequest.items.push(this.addToNewItemArray(id, false, 10000000));
                    foundInRaid = true;
                }
            }
        }
        else {
            // Other random containers
            // Get summary of loot from config
            const rewardContainerDetails = inventoryHelper.getRandomLootContainerRewardDetails(openedItem._tpl);
            newItemRequest.items.push(...lootGenerator.getRandomLootContainerLoot(rewardContainerDetails));
            foundInRaid = rewardContainerDetails.foundInRaid;
        }
        const output = eventOutputHolder.getOutput(sessionID);
        // Find and delete opened item from player inventory
        inventoryHelper.removeItem(pmcData, body.item, sessionID, output);
        if (newItemRequest.items.length != 0) {
            // Add reward items to player inventory
            inventoryHelper.addItem(pmcData, newItemRequest, output, sessionID, null, foundInRaid, null);
        }
        return output;
    }
    addQuestZones(container) {
        const databaseServer = container.resolve("DatabaseServer");
        const databaseTables = databaseServer.getTables();
        databaseTables.globals["QuestZones"].push(
        //Visit
        {
            zoneId: "labCafe",
            zoneName: "labCafe",
            zoneType: "Visit",
            zoneLocation: "laboratory",
            position: {
                x: "-230.5848",
                y: "5.6174",
                z: "-306.0927"
            },
            rotation: {
                x: "0",
                y: "0",
                z: "0"
            },
            scale: {
                x: "18",
                y: "2",
                z: "13"
            }
        }, {
            zoneId: "redBlueZone",
            zoneName: "redBlueZone",
            zoneType: "PlaceItem",
            zoneLocation: "laboratory",
            position: {
                x: "-259.623",
                y: "5.3484",
                z: "-321.9637"
            },
            rotation: {
                x: "0",
                y: "0",
                z: "0"
            },
            scale: {
                x: "4.5",
                y: "2",
                z: "10"
            }
        }, {
            zoneId: "sanitarLabZone",
            zoneName: "sanitarLabZone",
            zoneType: "PlaceItem",
            zoneLocation: "laboratory",
            position: {
                x: "-133.6525",
                y: "5.4105",
                z: "-343.2543"
            },
            rotation: {
                x: "0",
                y: "0",
                z: "0"
            },
            scale: {
                x: "4.5",
                y: "2",
                z: "5.5"
            }
        }, {
            zoneId: "markedRoom314",
            zoneName: "markedRoom314",
            zoneType: "PlaceItem",
            zoneLocation: "bigmap",
            position: {
                x: "-133.6525",
                y: "5.4105",
                z: "-343.2543"
            },
            rotation: {
                x: "0",
                y: "0",
                z: "0"
            },
            scale: {
                x: "4.5",
                y: "2",
                z: "5.5"
            }
        }, {
            zoneId: "markedRoomRBBK",
            zoneName: "markRoomRBBK",
            zoneType: "PlaceItem",
            zoneLocation: "rezervbase",
            position: {
                x: "-133.6525",
                y: "5.4105",
                z: "-343.2543"
            },
            rotation: {
                x: "0",
                y: "0",
                z: "0"
            },
            scale: {
                x: "4.5",
                y: "2",
                z: "5.5"
            }
        }, {
            zoneId: "markedShorelineRoom",
            zoneName: "markedShorelineRoom",
            zoneType: "PlaceItem",
            zoneLocation: "laboratory",
            position: {
                x: "-133.6525",
                y: "5.4105",
                z: "-343.2543"
            },
            rotation: {
                x: "0",
                y: "0",
                z: "0"
            },
            scale: {
                x: "4.5",
                y: "2",
                z: "5.5"
            }
        });
    }
    doBlacklist(container) {
        const configServer = container.resolve("ConfigServer");
        const ragfairConfig = configServer.getConfig(ConfigTypes_1.ConfigTypes.RAGFAIR);
        ragfairConfig.dynamic.blacklist.custom.push("wallet_roll", "keycard_roll", "viktoriyas_secret", "armor_crate", "premium_crate", "sevensixtwo_crate", "viktoriyas_voucher", "fivefivesix_crate", "kc_prm", "50/50", "fivefourfive_crate");
    }
    addToNewItemArray(id, preset, count) {
        const item = {
            item_id: id,
            isPreset: preset,
            count: count
        };
        return item;
    }
}
module.exports = { mod: new Vicktoriya() };
