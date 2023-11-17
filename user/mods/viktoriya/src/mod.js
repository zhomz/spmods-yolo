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
const path = __importStar(require("path"));
const fs = require('fs');
const modPath = path.normalize(path.join(__dirname, '..'));
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
        this.logger.debug(`[" + this.mod + "] preAki Loading... `);
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
        this.logger.debug(`[" + this.mod + "] preAki Loaded`);
    }
    postAkiLoad(container) {
        this.doBlacklist(container);
    }
    /**
     * Majority of trader-related work occurs after the aki database has been loaded but prior to SPT code being run
     * @param container Dependency container
     */
    postDBLoad(container) {
        this.logger.debug(`[" + this.mod + "] postDb Loading... `);
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
        // add localization files
        this.importLocales(tables);
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
        // Add some singular items to trader (items without sub-items e.g. milk/bandage)
        this.traderHeper.addSingleItemsToTrader(tables, baseJson._id);
        this.traderHeper.addComplexItemsToTrader(tables, baseJson._id, jsonUtil);
        // Add trader to locale file, ensures trader text shows properly on screen
        // WARNING: adds the same text to ALL locales (e.g. chinese/french/english)
        this.traderHeper.addTraderToLocales(baseJson, tables, baseJson.name, "Viktoriya", baseJson.nickname, baseJson.location, "Come, take a seat");
        this.logger.debug(`[" + this.mod + "] postDb Loaded`);
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
                pmcData.Inventory.items.find(item => {
                    if (item._id == body.item) {
                        stackCount = item.upd.StackObjectsCount;
                    }
                });
                let roll;
                let money = 0;
                let loops = 0;
                while (stackCount > loops) {
                    roll = randomUtil.getInt(1, this.vikConfig.wr_five);
                    if (roll >= this.vikConfig.wr_one) {
                        if (roll <= this.vikConfig.wr_two) {
                            money += 100000;
                            if (this.vikConfig.Logging) {
                                console.log("[" + this.mod + "] 100k win");
                            }
                        }
                        else if (roll <= this.vikConfig.wr_three) {
                            money += 300000;
                            if (this.vikConfig.Logging) {
                                console.log("[" + this.mod + "] 300k win");
                            }
                        }
                        else if (roll <= this.vikConfig.wr_four) {
                            money += 500000;
                            if (this.vikConfig.Logging) {
                                console.log("[" + this.mod + "] 500k win");
                            }
                        }
                        else {
                            money += 2000000;
                            if (this.vikConfig.Logging) {
                                console.log("[" + this.mod + "] 2m win");
                            }
                        }
                    }
                    loops++;
                    if (this.vikConfig.Logging) {
                        console.log(money);
                    }
                    ;
                }
                if (this.vikConfig.Logging) {
                    console.log("[" + this.mod + "] You opened " + loops + " wallets and earned " + money + ". Spending a total of: " + stackCount * 100000);
                }
                if (money > 0) {
                    const id = "5449016a4bdc2d6f028b456f"; // Roubles
                    newItemRequest.items.push(this.addToNewItemArray(id, false, money));
                    foundInRaid = true;
                }
            }
            else if (whichGamblingContainer._name.includes("50/50")) {
                let roll = randomUtil.getInt(1, 1000);
                let id;
                if (roll <= 500) {
                    id = "57347d7224597744596b4e72"; // Can of beef stew (Small)
                    newItemRequest.items.push(this.addToNewItemArray(id, false, 1));
                    if (this.vikConfig.Logging) {
                        console.log("[" + this.mod + "] 50/50 loose, Can of beef stew (Small) added (you roll " + roll + " of " + this.vikConfig.kcr_eight + ")");
                    }
                    foundInRaid = true;
                }
                else {
                    const id = "5449016a4bdc2d6f028b456f"; // Roubles
                    newItemRequest.items.push(this.addToNewItemArray(id, false, 10000000));
                    if (this.vikConfig.Logging) {
                        console.log("[" + this.mod + "] 50/50 win!, 10m added (you roll " + roll + " of " + this.vikConfig.kcr_eight + ")");
                    }
                    foundInRaid = true;
                }
            }
            // This is the keycard gambling logic
            else if (whichGamblingContainer._name.includes("keycard")) {
                let roll = randomUtil.getInt(1, this.vikConfig.kcr_eight);
                let id;
                if (roll <= this.vikConfig.kcr_one) {
                    id = "5c94bbff86f7747ee735c08f"; // TerraGroup Labs access keycard
                    if (this.vikConfig.Logging) {
                        console.log("[" + this.mod + "] TerraGroup Labs access keycard win (you roll " + roll + " of " + this.vikConfig.kcr_eight + ")");
                    }
                }
                else if (roll <= this.vikConfig.kcr_two) {
                    id = "5efde6b4f5448336730dbd61"; // Keycard with a blue marking
                    if (this.vikConfig.Logging) {
                        console.log("[" + this.mod + "] Keycard with a blue marking win (you roll " + roll + " of " + this.vikConfig.kcr_eight + ")");
                    }
                }
                else if (roll <= this.vikConfig.kcr_three) {
                    id = "5c1d0d6d86f7744bb2683e1f"; // TerraGroup Labs keycard (Yellow)
                    if (this.vikConfig.Logging) {
                        console.log("[" + this.mod + "] TerraGroup Labs keycard (Yellow) win (you roll " + roll + " of " + this.vikConfig.kcr_eight + ")");
                    }
                }
                else if (roll <= this.vikConfig.kcr_four) {
                    id = "5c1d0f4986f7744bb01837fa"; // TerraGroup Labs keycard (Black)
                    if (this.vikConfig.Logging) {
                        console.log("[" + this.mod + "] TerraGroup Labs keycard (Black) win (you roll " + roll + " of " + this.vikConfig.kcr_eight + ")");
                    }
                }
                else if (roll <= this.vikConfig.kcr_five) {
                    id = "5c1e495a86f7743109743dfb"; // TerraGroup Labs keycard (Violet)
                    if (this.vikConfig.Logging) {
                        console.log("[" + this.mod + "] TerraGroup Labs keycard (Violet) win (you roll " + roll + " of " + this.vikConfig.kcr_eight + ")");
                    }
                }
                else if (roll <= this.vikConfig.kcr_six) {
                    id = "5c1d0c5f86f7744bb2683cf0"; // TerraGroup Labs keycard (Blue)
                    if (this.vikConfig.Logging) {
                        console.log("[" + this.mod + "] TerraGroup Labs keycard (Blue) win (you roll " + roll + " of " + this.vikConfig.kcr_eight + ")");
                    }
                }
                else if (roll <= this.vikConfig.kcr_seven) {
                    id = "5c1d0dc586f7744baf2e7b79"; // TerraGroup Labs keycard (Green)
                    if (this.vikConfig.Logging) {
                        console.log("[" + this.mod + "] TerraGroup Labs keycard (Green) win (you roll " + roll + " of " + this.vikConfig.kcr_eight + ")");
                    }
                }
                else {
                    id = "5c1d0efb86f7744baf2e7b7b"; // TerraGroup Labs keycard (Red)
                    if (this.vikConfig.Logging) {
                        console.log("[" + this.mod + "] TerraGroup Labs keycard (Red) win (you roll " + roll + " of " + this.vikConfig.kcr_eight + ")");
                    }
                }
                roll = randomUtil.getInt(1, 100);
                if (roll <= this.vikConfig.kcr_ornament_chance) {
                    newItemRequest.items.push(this.addToNewItemArray("viktoriyas_voucher", false, 1));
                    if (this.vikConfig.Logging) {
                        console.log("[" + this.mod + "] Viktoriyas Voucher win (you roll " + roll + " of 100)");
                    }
                }
                else {
                    if (this.vikConfig.Logging) {
                        console.log("[" + this.mod + "] Viktoriyas Voucher loose (you roll " + roll + " of 100)");
                    }
                }
                newItemRequest.items.push(this.addToNewItemArray(id, false, 1));
                foundInRaid = this.vikConfig.FIR_kcr;
            }
            else if (whichGamblingContainer._name.includes("kc_prm")) {
                let roll = randomUtil.getInt(1, this.vikConfig.kcpr_seven);
                let id;
                if (roll <= this.vikConfig.kcpr_one) {
                    id = "5c94bbff86f7747ee735c08f"; // TerraGroup Labs access keycard
                    if (this.vikConfig.Logging) {
                        console.log("[" + this.mod + "] TerraGroup Labs access keycard win (you roll " + roll + " of " + this.vikConfig.kcpr_seven + ")");
                    }
                }
                else if (roll <= this.vikConfig.kcpr_two) {
                    id = "5c1d0d6d86f7744bb2683e1f"; // TerraGroup Labs keycard (Yellow)
                    if (this.vikConfig.Logging) {
                        console.log("[" + this.mod + "] TerraGroup Labs keycard (Yellow) win (you roll " + roll + " of " + this.vikConfig.kcpr_seven + ")");
                    }
                }
                else if (roll <= this.vikConfig.kcpr_three) {
                    id = "5c1d0f4986f7744bb01837fa"; // TerraGroup Labs keycard (Black)
                    if (this.vikConfig.Logging) {
                        console.log("[" + this.mod + "] TerraGroup Labs keycard (Black) win (you roll " + roll + " of " + this.vikConfig.kcpr_seven + ")");
                    }
                }
                else if (roll <= this.vikConfig.kcpr_four) {
                    id = "5c1e495a86f7743109743dfb"; // TerraGroup Labs keycard (Violet)
                    if (this.vikConfig.Logging) {
                        console.log("[" + this.mod + "] TerraGroup Labs keycard (Violet) win (you roll " + roll + " of " + this.vikConfig.kcpr_seven + ")");
                    }
                }
                else if (roll <= this.vikConfig.kcpr_five) {
                    id = "5c1d0c5f86f7744bb2683cf0"; // TerraGroup Labs keycard (Blue)
                    if (this.vikConfig.Logging) {
                        console.log("[" + this.mod + "] TerraGroup Labs keycard (Blue) win (you roll " + roll + " of " + this.vikConfig.kcpr_seven + ")");
                    }
                }
                else if (roll <= this.vikConfig.kcpr_six) {
                    id = "5c1d0dc586f7744baf2e7b79"; // TerraGroup Labs keycard (Green)
                    if (this.vikConfig.Logging) {
                        console.log("[" + this.mod + "] TerraGroup Labs keycard (Green) win (you roll " + roll + " of " + this.vikConfig.kcpr_seven + ")");
                    }
                }
                else {
                    id = "5c1d0efb86f7744baf2e7b7b"; // TerraGroup Labs keycard (Red)
                    if (this.vikConfig.Logging) {
                        console.log("[" + this.mod + "] TerraGroup Labs keycard (Red) win (you roll " + roll + " of " + this.vikConfig.kcpr_seven + ")");
                    }
                }
                roll = randomUtil.getInt(1, 100);
                if (roll <= this.vikConfig.kcpr_ornament_chance) {
                    newItemRequest.items.push(this.addToNewItemArray("viktoriyas_voucher", false, 1));
                    if (this.vikConfig.Logging) {
                        console.log("[" + this.mod + "] Viktoriyas Voucher win (you roll " + roll + " of 100)");
                    }
                }
                else {
                    if (this.vikConfig.Logging) {
                        console.log("[" + this.mod + "] Viktoriyas Voucher loose (you roll " + roll + " of 100)");
                    }
                }
                newItemRequest.items.push(this.addToNewItemArray(id, false, 1));
                foundInRaid = this.vikConfig.FIR_kcpr;
            }
            // This is the Viktoriya's Secret gambling logic
            else if (whichGamblingContainer._name.includes("viktoriyas")) {
                const roll = randomUtil.getInt(1, this.vikConfig.vsc_thirteen);
                let id;
                let isPreset = false;
                let count;
                if (roll <= this.vikConfig.vsc_one) {
                    id = "exfilb"; // Exfil B For Viktoriya's Secret
                    count = 1;
                    isPreset = true;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    if (this.vikConfig.Logging) {
                        console.log("[" + this.mod + "] Exfil B For Viktoriya's Secret Preset win (you roll " + roll + " of " + this.vikConfig.vsc_thirteen + ")");
                    }
                }
                else if (roll <= this.vikConfig.vsc_two) {
                    id = "5e4abb5086f77406975c9342"; // LBT-6094A Slick Plate Carrier
                    count = 1;
                    isPreset = false;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    if (this.vikConfig.Logging) {
                        console.log("[" + this.mod + "] LBT-6094A Slick Plate Carrier win (you roll " + roll + " of " + this.vikConfig.vsc_thirteen + ")");
                    }
                }
                else if (roll <= this.vikConfig.vsc_three) {
                    id = "exfilcoyote"; // Exfil Coyote For Viktoriya's Secret
                    count = 1;
                    isPreset = true;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    if (this.vikConfig.Logging) {
                        console.log("[" + this.mod + "] Exfil Coyote For Viktoriya's Secret Preset win (you roll " + roll + " of " + this.vikConfig.vsc_thirteen + ")");
                    }
                }
                else if (roll <= this.vikConfig.vsc_four) {
                    id = "rd704_vik"; // RD704 For Viktoriya's Secret
                    count = 1;
                    isPreset = true;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    id = "59d6272486f77466146386ff"; // AK 7.62x39 Magpul PMAG 30 GEN M3 30-round magazine
                    count = 5;
                    isPreset = false;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    id = "64acea16c4eda9354b0226b0"; // 7.62x39mm BP gzh ammo pack (20 pcs)
                    count = 10;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    if (this.vikConfig.Logging) {
                        console.log("[" + this.mod + "] RD704 For Viktoriya's Secret Preset win (you roll " + roll + " of " + this.vikConfig.vsc_thirteen + ")");
                    }
                }
                else if (roll <= this.vikConfig.vsc_five) {
                    id = "5b44cf1486f77431723e3d05"; // IOTV Gen4 body armor (Assault Kit)
                    count = 1;
                    isPreset = false;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    if (this.vikConfig.Logging) {
                        console.log("[" + this.mod + "] IOTV Gen4 body armor (Assault Kit) win (you roll " + roll + " of " + this.vikConfig.vsc_thirteen + ")");
                    }
                }
                else if (roll <= this.vikConfig.vsc_six) {
                    id = "5b44cd8b86f774503d30cba2"; // IOTV Gen4 body armor (Full Protection Kit)
                    count = 1;
                    isPreset = false;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    if (this.vikConfig.Logging) {
                        console.log("[" + this.mod + "] IOTV Gen4 body armor (Full Protection Kit) win (you roll " + roll + " of " + this.vikConfig.vsc_thirteen + ")");
                    }
                }
                else if (roll <= this.vikConfig.vsc_seven) {
                    id = "5b44d0de86f774503d30cba8"; // IOTV Gen4 body armor (High Mobility Kit)
                    count = 1;
                    isPreset = false;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    if (this.vikConfig.Logging) {
                        console.log("[" + this.mod + "] IOTV Gen4 body armor (High Mobility Kit) win (you roll " + roll + " of " + this.vikConfig.vsc_thirteen + ")");
                    }
                }
                else if (roll <= this.vikConfig.vsc_eight) {
                    id = "5fd4c474dd870108a754b241"; // 5.11 Tactical Hexgrid plate carrier
                    count = 1;
                    isPreset = false;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    if (this.vikConfig.Logging) {
                        console.log("[" + this.mod + "] 5.11 Tactical Hexgrid plate carrier win (you roll " + roll + " of " + this.vikConfig.vsc_thirteen + ")");
                    }
                }
                else if (roll <= this.vikConfig.vsc_nine) {
                    id = "ak74n_vik"; // Ak74N For Viktoriya's Secret
                    count = 1;
                    isPreset = true;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    id = "55d482194bdc2d1d4e8b456b"; // AK-74 5.45x39 6L31 60-round magazine
                    count = 3;
                    isPreset = false;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    id = "5c1262a286f7743f8a69aab2"; // 5.45x39mm PPBS gs "Igolnik" ammo pack (30 pcs)
                    count = 2;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    id = "5737292724597765e5728562"; // 5.45x39mm BP gs ammo pack (120 pcs)
                    count = 1;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    if (this.vikConfig.Logging) {
                        console.log("[" + this.mod + "] Ak74N For Viktoriya's Secret Preset win (you roll " + roll + " of " + this.vikConfig.vsc_thirteen + ")");
                    }
                }
                else if (roll <= this.vikConfig.vsc_ten) {
                    id = "vss_vik"; // VSS For Viktoriya's Secret
                    count = 1;
                    isPreset = true;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    id = "5a9e81fba2750c00164f6b11"; // 9x39 SR3M.130 30-round magazine
                    count = 3;
                    isPreset = false;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    id = "6489854673c462723909a14e"; // 9x39mm BP ammo pack (20 pcs)
                    count = 6;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    if (this.vikConfig.Logging) {
                        console.log("[" + this.mod + "] VSS For Viktoriya's Secret Preset win (you roll " + roll + " of " + this.vikConfig.vsc_thirteen + ")");
                    }
                }
                else if (roll <= this.vikConfig.vsc_eleven) {
                    id = "t5000_vik"; // T5000 For Viktoriya's Secret
                    count = 1;
                    isPreset = true;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    id = "5df25b6c0b92095fd441e4cf"; // ORSIS T-5000M 7.62x51 5-round magazine
                    count = 3;
                    isPreset = false;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    id = "648984e3f09d032aa9399d53"; // 7.62x51mm M993 ammo pack (20 pcs)
                    count = 2;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    if (this.vikConfig.Logging) {
                        console.log("[" + this.mod + "] T5000 For Viktoriya's Secret Preset win (you roll " + roll + " of " + this.vikConfig.vsc_thirteen + ")");
                    }
                }
                else if (roll <= this.vikConfig.vsc_twelve) {
                    id = "rsh12_vik"; // Rsh12 For Viktoriya's Secret
                    count = 1;
                    isPreset = true;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    id = "648983d6b5a2df1c815a04ec"; // 12.7x55mm PS12B (10 pcs)
                    count = 3;
                    isPreset = false;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    id = "5aa2b9ede5b5b000137b758b"; // Kinda cowboy hat
                    count = 1;
                    isPreset = false;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    if (this.vikConfig.Logging) {
                        console.log("[" + this.mod + "] Rsh12 For Viktoriya's Secret Preset win (you roll " + roll + " of " + this.vikConfig.vsc_thirteen + ")");
                    }
                }
                else {
                    id = "altyns"; // Altyn For Viktoriya's Secret
                    count = 1;
                    isPreset = true;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    if (this.vikConfig.Logging) {
                        console.log("[" + this.mod + "] Altyn For Viktoriya's Secret Preset win (you roll " + roll + " of " + this.vikConfig.vsc_thirteen + ")");
                    }
                }
                foundInRaid = this.vikConfig.FIR_vsc;
            }
            // This is the Armor cases gambling logic
            else if (whichGamblingContainer._name.includes("armor")) {
                const roll = randomUtil.getInt(1, this.vikConfig.bac_twenty);
                let id;
                if (roll <= this.vikConfig.bac_one) {
                    id = "59e7635f86f7742cbf2c1095"; // BNTI Module-3M body armor
                    if (this.vikConfig.Logging) {
                        console.log("[" + this.mod + "] BNTI Module-3M body armor win (you roll " + roll + " of " + this.vikConfig.bac_twenty + ")");
                    }
                }
                else if (roll <= this.vikConfig.bac_two) {
                    id = "5648a7494bdc2d9d488b4583"; // PACA Soft Armor
                    if (this.vikConfig.Logging) {
                        console.log("[" + this.mod + "] PACA Soft Armor win (you roll " + roll + " of " + this.vikConfig.bac_twenty + ")");
                    }
                }
                else if (roll <= this.vikConfig.bac_three) {
                    id = "5df8a2ca86f7740bfe6df777"; // 6B2 body armor (Flora)
                    if (this.vikConfig.Logging) {
                        console.log("[" + this.mod + "] 6B2 body armor (Flora) win (you roll " + roll + " of " + this.vikConfig.bac_twenty + ")");
                    }
                }
                else if (roll <= this.vikConfig.bac_four) {
                    id = "5ab8e4ed86f7742d8e50c7fa"; // MF-UNTAR body armor
                    if (this.vikConfig.Logging) {
                        console.log("[" + this.mod + "] MF-UNTAR body armor win (you roll " + roll + " of " + this.vikConfig.bac_twenty + ")");
                    }
                }
                else if (roll <= this.vikConfig.bac_five) {
                    id = "5c0e5edb86f77461f55ed1f7"; // BNTI Zhuk-3 body armor (Press)
                    if (this.vikConfig.Logging) {
                        console.log("[" + this.mod + "] BNTI Zhuk-3 body armor (Press) win (you roll " + roll + " of " + this.vikConfig.bac_twenty + ")");
                    }
                }
                else if (roll <= this.vikConfig.bac_six) {
                    id = "5c0e5bab86f77461f55ed1f3"; // 6B23-1 body armor (Digital Flora)
                    if (this.vikConfig.Logging) {
                        console.log("[" + this.mod + "] 6B23-1 body armor (Digital Flora) win (you roll " + roll + " of " + this.vikConfig.bac_twenty + ")");
                    }
                }
                else if (roll <= this.vikConfig.bac_seven) {
                    id = "5b44d22286f774172b0c9de8"; // BNTI Kirasa-N body armor
                    if (this.vikConfig.Logging) {
                        console.log("[" + this.mod + "] BNTI Kirasa-N body armor win (you roll " + roll + " of " + this.vikConfig.bac_twenty + ")");
                    }
                }
                else if (roll <= this.vikConfig.bac_eight) {
                    id = "5c0e655586f774045612eeb2"; // HighCom Trooper TFO body armor (Multicam)
                    if (this.vikConfig.Logging) {
                        console.log("[" + this.mod + "] HighCom Trooper TFO body armor (Multicam) win (you roll " + roll + " of " + this.vikConfig.bac_twenty + ")");
                    }
                }
                else if (roll <= this.vikConfig.bac_nine) {
                    id = "609e8540d5c319764c2bc2e9"; // NFM THOR Concealable Reinforced Vest body armor
                    if (this.vikConfig.Logging) {
                        console.log("[" + this.mod + "] NFM THOR Concealable Reinforced Vest body armor win (you roll " + roll + " of " + this.vikConfig.bac_twenty + ")");
                    }
                }
                else if (roll <= this.vikConfig.bac_ten) {
                    id = "5c0e53c886f7747fa54205c7"; // 6B13 assault armor (Digital Flora)
                    if (this.vikConfig.Logging) {
                        console.log("[" + this.mod + "] 6B13 assault armor (Digital Flora) win (you roll " + roll + " of " + this.vikConfig.bac_twenty + ")");
                    }
                }
                else if (roll <= this.vikConfig.bac_eleven) {
                    id = "5c0e57ba86f7747fa141986d"; // 6B23-2 body armor (Mountain Flora)
                    if (this.vikConfig.Logging) {
                        console.log("[" + this.mod + "] 6B23-2 body armor (Mountain Flora) win (you roll " + roll + " of " + this.vikConfig.bac_twenty + ")");
                    }
                }
                else if (roll <= this.vikConfig.bac_twelve) {
                    id = "63737f448b28897f2802b874"; // Hexatac HPC Plate Carrier (Multicam Black)
                    if (this.vikConfig.Logging) {
                        console.log("[" + this.mod + "] Hexatac HPC Plate Carrier (Multicam Black) win (you roll " + roll + " of " + this.vikConfig.bac_twenty + ")");
                    }
                }
                else if (roll <= this.vikConfig.bac_thirteen) {
                    id = "5f5f41476bdad616ad46d631"; // NPP KlASS Korund-VM body armor
                    if (this.vikConfig.Logging) {
                        console.log("[" + this.mod + "] NPP KlASS Korund-VM body armor win (you roll " + roll + " of " + this.vikConfig.bac_twenty + ")");
                    }
                }
                else if (roll <= this.vikConfig.bac_fourteen) {
                    id = "5ca2151486f774244a3b8d30"; // FORT Redut-M body armor
                    if (this.vikConfig.Logging) {
                        console.log("[" + this.mod + "] FORT Redut-M body armor win (you roll " + roll + " of " + this.vikConfig.bac_twenty + ")");
                    }
                }
                else if (roll <= this.vikConfig.bac_fifteen) {
                    id = "5b44d0de86f774503d30cba8"; // IOTV Gen4 body armor (High Mobility Kit)
                    if (this.vikConfig.Logging) {
                        console.log("[" + this.mod + "] IOTV Gen4 body armor (High Mobility Kit) win (you roll " + roll + " of " + this.vikConfig.bac_twenty + ")");
                    }
                }
                else if (roll <= this.vikConfig.bac_sixteen) {
                    id = "5e9dacf986f774054d6b89f4"; // FORT Defender-2 body armor
                    if (this.vikConfig.Logging) {
                        console.log("[" + this.mod + "] FORT Defender-2 body armor win (you roll " + roll + " of " + this.vikConfig.bac_twenty + ")");
                    }
                }
                else if (roll <= this.vikConfig.bac_seventeen) {
                    id = "5b44cf1486f77431723e3d05"; // IOTV Gen4 body armor (Assault Kit)
                    if (this.vikConfig.Logging) {
                        console.log("[" + this.mod + "] IOTV Gen4 body armor (Assault Kit) win (you roll " + roll + " of " + this.vikConfig.bac_twenty + ")");
                    }
                }
                else if (roll <= this.vikConfig.bac_eighteen) {
                    id = "5b44cd8b86f774503d30cba2"; // IOTV Gen4 body armor (Full Protection Kit)
                    if (this.vikConfig.Logging) {
                        console.log("[" + this.mod + "] IOTV Gen4 body armor (Full Protection Kit) win (you roll " + roll + " of " + this.vikConfig.bac_twenty + ")");
                    }
                }
                else if (roll <= this.vikConfig.bac_nineteen) {
                    id = "5ca21c6986f77479963115a7"; // FORT Redut-T5 body armor
                    if (this.vikConfig.Logging) {
                        console.log("[" + this.mod + "] FORT Redut-T5 body armor win (you roll " + roll + " of " + this.vikConfig.bac_twenty + ")");
                    }
                }
                else {
                    id = "5ab8e79e86f7742d8b372e78"; // BNTI Gzhel-K body armor
                    if (this.vikConfig.Logging) {
                        console.log("[" + this.mod + "] BNTI Gzhel-K body armor win (you roll " + roll + " of " + this.vikConfig.bac_twenty + ")");
                    }
                }
                newItemRequest.items.push(this.addToNewItemArray(id, false, 1));
                foundInRaid = this.vikConfig.FIR_bac;
            }
            else if (whichGamblingContainer._name.includes("premium")) {
                const roll = randomUtil.getInt(1, this.vikConfig.pac_twenty);
                let id;
                if (roll <= this.vikConfig.pac_one) {
                    id = "5c0e655586f774045612eeb2"; // HighCom Trooper TFO body armor (Multicam)
                    if (this.vikConfig.Logging) {
                        console.log("[" + this.mod + "] HighCom Trooper TFO body armor (Multicam) win (you roll " + roll + " of " + this.vikConfig.pac_twenty + ")");
                    }
                }
                else if (roll <= this.vikConfig.pac_two) {
                    id = "609e8540d5c319764c2bc2e9"; // NFM THOR Concealable Reinforced Vest body armor
                    if (this.vikConfig.Logging) {
                        console.log("[" + this.mod + "] NFM THOR Concealable Reinforced Vest body armor win (you roll " + roll + " of " + this.vikConfig.pac_twenty + ")");
                    }
                }
                else if (roll <= this.vikConfig.pac_three) {
                    id = "5c0e53c886f7747fa54205c7"; // 6B13 assault armor (Digital Flora)
                    if (this.vikConfig.Logging) {
                        console.log("[" + this.mod + "] 6B13 assault armor (Digital Flora) win (you roll " + roll + " of " + this.vikConfig.pac_twenty + ")");
                    }
                }
                else if (roll <= this.vikConfig.pac_four) {
                    id = "5c0e57ba86f7747fa141986d"; // 6B23-2 body armor (Mountain Flora)
                    if (this.vikConfig.Logging) {
                        console.log("[" + this.mod + "] 6B23-2 body armor (Mountain Flora) win (you roll " + roll + " of " + this.vikConfig.pac_twenty + ")");
                    }
                }
                else if (roll <= this.vikConfig.pac_five) {
                    id = "63737f448b28897f2802b874"; // Hexatac HPC Plate Carrier (Multicam Black)
                    if (this.vikConfig.Logging) {
                        console.log("[" + this.mod + "] Hexatac HPC Plate Carrier (Multicam Black) win (you roll " + roll + " of " + this.vikConfig.pac_twenty + ")");
                    }
                }
                else if (roll <= this.vikConfig.pac_six) {
                    id = "5f5f41476bdad616ad46d631"; // NPP KlASS Korund-VM body armor
                    if (this.vikConfig.Logging) {
                        console.log("[" + this.mod + "] NPP KlASS Korund-VM body armor win (you roll " + roll + " of " + this.vikConfig.pac_twenty + ")");
                    }
                }
                else if (roll <= this.vikConfig.pac_seven) {
                    id = "5ca2151486f774244a3b8d30"; // FORT Redut-M body armor
                    if (this.vikConfig.Logging) {
                        console.log("[" + this.mod + "] FORT Redut-M body armor win (you roll " + roll + " of " + this.vikConfig.pac_twenty + ")");
                    }
                }
                else if (roll <= this.vikConfig.pac_eight) {
                    id = "5b44d0de86f774503d30cba8"; // IOTV Gen4 body armor (High Mobility Kit)
                    if (this.vikConfig.Logging) {
                        console.log("[" + this.mod + "] IOTV Gen4 body armor (High Mobility Kit) win (you roll " + roll + " of " + this.vikConfig.pac_twenty + ")");
                    }
                }
                else if (roll <= this.vikConfig.pac_nine) {
                    id = "5e9dacf986f774054d6b89f4"; // FORT Defender-2 body armor
                    if (this.vikConfig.Logging) {
                        console.log("[" + this.mod + "] FORT Defender-2 body armor win (you roll " + roll + " of " + this.vikConfig.pac_twenty + ")");
                    }
                }
                else if (roll <= this.vikConfig.pac_ten) {
                    id = "5b44cf1486f77431723e3d05"; // IOTV Gen4 body armor (Assault Kit)
                    if (this.vikConfig.Logging) {
                        console.log("[" + this.mod + "] IOTV Gen4 body armor (Assault Kit) win (you roll " + roll + " of " + this.vikConfig.pac_twenty + ")");
                    }
                }
                else if (roll <= this.vikConfig.pac_eleven) {
                    id = "5b44cd8b86f774503d30cba2"; // IOTV Gen4 body armor (Full Protection Kit)
                    if (this.vikConfig.Logging) {
                        console.log("[" + this.mod + "] IOTV Gen4 body armor (Full Protection Kit) win (you roll " + roll + " of " + this.vikConfig.pac_twenty + ")");
                    }
                }
                else if (roll <= this.vikConfig.pac_twelve) {
                    id = "5ca21c6986f77479963115a7"; // FORT Redut-T5 body armor
                    if (this.vikConfig.Logging) {
                        console.log("[" + this.mod + "] FORT Redut-T5 body armor win (you roll " + roll + " of " + this.vikConfig.pac_twenty + ")");
                    }
                }
                else if (roll <= this.vikConfig.pac_thirteen) {
                    id = "5ab8e79e86f7742d8b372e78"; // BNTI Gzhel-K body armor
                    if (this.vikConfig.Logging) {
                        console.log("[" + this.mod + "] BNTI Gzhel-K body armor win (you roll " + roll + " of " + this.vikConfig.pac_twenty + ")");
                    }
                }
                else if (roll <= this.vikConfig.pac_fourteen) {
                    id = "5fd4c474dd870108a754b241"; // 5.11 Tactical Hexgrid plate carrier
                    if (this.vikConfig.Logging) {
                        console.log("[" + this.mod + "] 5.11 Tactical Hexgrid plate carrier win (you roll " + roll + " of " + this.vikConfig.pac_twenty + ")");
                    }
                }
                else if (roll <= this.vikConfig.pac_fifteen) {
                    id = "5c0e625a86f7742d77340f62"; // BNTI Zhuk-6a body armor
                    if (this.vikConfig.Logging) {
                        console.log("[" + this.mod + "] BNTI Zhuk-6a body armor win (you roll " + roll + " of " + this.vikConfig.pac_twenty + ")");
                    }
                }
                else if (roll <= this.vikConfig.pac_sixteen) {
                    id = "60a283193cb70855c43a381d"; // NFM THOR Integrated Carrier body armor
                    if (this.vikConfig.Logging) {
                        console.log("[" + this.mod + "] NFM THOR Integrated Carrier body armor win (you roll " + roll + " of " + this.vikConfig.pac_twenty + ")");
                    }
                }
                else if (roll <= this.vikConfig.pac_seventeen) {
                    id = "545cdb794bdc2d3a198b456a"; // 6B43 6A Zabralo-Sh body armor
                    if (this.vikConfig.Logging) {
                        console.log("[" + this.mod + "] 6B43 6A Zabralo-Sh body armor win (you roll " + roll + " of " + this.vikConfig.pac_twenty + ")");
                    }
                }
                else if (roll <= this.vikConfig.pac_eighteen) {
                    id = "6038b4ca92ec1c3103795a0d"; // LBT-6094A Slick Plate Carrier (Olive Drab)
                    if (this.vikConfig.Logging) {
                        console.log("[" + this.mod + "] LBT-6094A Slick Plate Carrier (Olive Drab) win (you roll " + roll + " of " + this.vikConfig.pac_twenty + ")");
                    }
                }
                else if (roll <= this.vikConfig.pac_nineteen) {
                    id = "6038b4b292ec1c3103795a0b"; // LBT-6094A Slick Plate Carrier (Tan)
                    if (this.vikConfig.Logging) {
                        console.log("[" + this.mod + "] LBT-6094A Slick Plate Carrier (Tan) win (you roll " + roll + " of " + this.vikConfig.pac_twenty + ")");
                    }
                }
                else {
                    id = "5e4abb5086f77406975c9342"; // LBT-6094A Slick Plate Carrier
                    if (this.vikConfig.Logging) {
                        console.log("[" + this.mod + "] LBT-6094A Slick Plate Carrier win (you roll " + roll + " of " + this.vikConfig.pac_twenty + ")");
                    }
                }
                // Push the armor to item array for insert
                newItemRequest.items.push(this.addToNewItemArray(id, false, 1));
                foundInRaid = this.vikConfig.FIR_pac;
            }
            // This is the Weapon cases gambling logic
            else if (whichGamblingContainer._name.includes("762")) {
                const roll = randomUtil.getInt(1, this.vikConfig.sstc_twelve);
                let id;
                let isPreset = false;
                let count;
                console.log(roll);
                if (roll <= this.vikConfig.sstc_one) {
                    id = "rd704_vik"; // RD704 For Viktoriya's Secret
                    count = 1;
                    isPreset = true;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    id = "59d6272486f77466146386ff"; // AK 7.62x39 Magpul PMAG 30 GEN M3 30-round magazine
                    count = 3;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    if (this.vikConfig.Logging) {
                        console.log("[" + this.mod + "] RD704 For Viktoriya's Secret Preset win (you roll " + roll + " of " + this.vikConfig.sstc_twelve + ")");
                    }
                }
                else if (roll <= this.vikConfig.sstc_two) {
                    id = "vpo_vik"; // VPO Vik For 762 case
                    count = 1;
                    isPreset = true;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    id = "59d6272486f77466146386ff"; // AK 7.62x39 Magpul PMAG 30 GEN M3 30-round magazine
                    count = 3;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    if (this.vikConfig.Logging) {
                        console.log("[" + this.mod + "] VPO Vik For 762 case Preset win (you roll " + roll + " of " + this.vikConfig.sstc_twelve + ")");
                    }
                }
                else if (roll <= this.vikConfig.sstc_three) {
                    id = "5acf7e2b86f7740874790e20"; // AK-103 default
                    count = 1;
                    isPreset = true;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    id = "6272874a6c47bd74f92e2087"; // AK 7.62x39 FAB Defense Ultimag 30R 30-round magazine
                    count = 3;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    if (this.vikConfig.Logging) {
                        console.log("[" + this.mod + "] AK-103 default Preset win (you roll " + roll + " of " + this.vikConfig.sstc_twelve + ")");
                    }
                }
                else if (roll <= this.vikConfig.sstc_four) {
                    id = "62972a7d91492d1a34152fbe"; // RD704 Default
                    count = 1;
                    isPreset = true;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    id = "59d6272486f77466146386ff"; // AK 7.62x39 Magpul PMAG 30 GEN M3 30-round magazine
                    count = 3;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    if (this.vikConfig.Logging) {
                        console.log("[" + this.mod + "] RD704 Default win (you roll " + roll + " of " + this.vikConfig.sstc_twelve + ")");
                    }
                }
                else if (roll <= this.vikConfig.sstc_five) {
                    id = "60b7d76e2a3c79100f1979de"; // Mk47 default
                    count = 1;
                    isPreset = true;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    id = "59d6272486f77466146386ff"; // AK 7.62x39 Magpul PMAG 30 GEN M3 30-round magazine
                    count = 3;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    if (this.vikConfig.Logging) {
                        console.log("[" + this.mod + "] Mk47 default win (you roll " + roll + " of " + this.vikConfig.sstc_twelve + ")");
                    }
                }
                else if (roll <= this.vikConfig.sstc_six) {
                    id = "5acf7e4c86f774499a3f3bdd"; // AK-104 default
                    count = 1;
                    isPreset = true;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    id = "6272874a6c47bd74f92e2087"; // AK 7.62x39 FAB Defense Ultimag 30R 30-round magazine
                    count = 3;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    if (this.vikConfig.Logging) {
                        console.log("[" + this.mod + "] AK-104 default win (you roll " + roll + " of " + this.vikConfig.sstc_twelve + ")");
                    }
                }
                else if (roll <= this.vikConfig.sstc_seven) {
                    id = "59e8d2ab86f77407f03fc9c2"; // AKM default
                    count = 1;
                    isPreset = true;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    id = "59d625f086f774661516605d"; // AK 7.62x39 30-round magazine (issued '55 or later)
                    count = 3;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    if (this.vikConfig.Logging) {
                        console.log("[" + this.mod + "] AKM default win (you roll " + roll + " of " + this.vikConfig.sstc_twelve + ")");
                    }
                }
                else if (roll <= this.vikConfig.sstc_eight) {
                    id = "5a325c3686f7744273716c5b"; // AKMN default
                    count = 1;
                    isPreset = true;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    id = "59d625f086f774661516605d"; // AK 7.62x39 30-round magazine (issued '55 or later)
                    count = 3;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    if (this.vikConfig.Logging) {
                        console.log("[" + this.mod + "] AKMN default win (you roll " + roll + " of " + this.vikConfig.sstc_twelve + ")");
                    }
                }
                else if (roll <= this.vikConfig.sstc_nine) {
                    id = "5a327f4a86f774766866140b"; // AKMS default
                    count = 1;
                    isPreset = true;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    id = "5a0060fc86f7745793204432"; // AKMS 7.62x39 aluminium 30-round magazine
                    count = 3;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    if (this.vikConfig.Logging) {
                        console.log("[" + this.mod + "] AKMS default win (you roll " + roll + " of " + this.vikConfig.sstc_twelve + ")");
                    }
                }
                else if (roll <= this.vikConfig.sstc_ten) {
                    id = "5ac4ab8886f7747d0f66429a"; // AKMSN default
                    count = 1;
                    isPreset = true;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    id = "5a0060fc86f7745793204432"; // AKMS 7.62x39 aluminium 30-round magazine
                    count = 3;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    if (this.vikConfig.Logging) {
                        console.log("[" + this.mod + "] AKMSN default win (you roll " + roll + " of " + this.vikConfig.sstc_twelve + ")");
                    }
                }
                else if (roll <= this.vikConfig.sstc_eleven) {
                    id = "59ef24b986f77439987b8762"; // VPO-136 Vepr-KM default
                    count = 1;
                    isPreset = true;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    id = "5a0060fc86f7745793204432"; // AKMS 7.62x39 aluminium 30-round magazine
                    count = 3;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    if (this.vikConfig.Logging) {
                        console.log("[" + this.mod + "] VPO-136 Vepr-KM default win (you roll " + roll + " of " + this.vikConfig.sstc_twelve + ")");
                    }
                }
                else {
                    id = "ak103_vik"; // AK103 Vik For 762 case
                    count = 1;
                    isPreset = true;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    id = "6272874a6c47bd74f92e2087"; // AK 7.62x39 FAB Defense Ultimag 30R 30-round magazine
                    count = 3;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    if (this.vikConfig.Logging) {
                        console.log("[" + this.mod + "] AK103 Vik For 762 case win (you roll " + roll + " of " + this.vikConfig.sstc_twelve + ")");
                    }
                }
                foundInRaid = this.vikConfig.FIR_sstc;
            }
            else if (whichGamblingContainer._name.includes("545")) {
                const roll = randomUtil.getInt(1, this.vikConfig.fff_twelve);
                let id;
                let isPreset = false;
                let count;
                console.log(roll);
                if (roll <= this.vikConfig.fff_one) {
                    id = "62971cf67af74c3ff577954b"; // SAG-545 default
                    count = 1;
                    isPreset = true;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    id = "5aaa4194e5b5b055d06310a5"; // AK-74 5.45x39 Magpul PMAG 30 GEN M3 30-round magazine
                    count = 3;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    if (this.vikConfig.Logging) {
                        console.log("[" + this.mod + "] SAG-545 default win (you roll " + roll + " of " + this.vikConfig.fff_twelve + ")");
                    }
                }
                else if (roll <= this.vikConfig.fff_two) {
                    id = "sag545_vik"; // SAG 545 Vik For 545 case
                    count = 1;
                    isPreset = true;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    id = "5aaa4194e5b5b055d06310a5"; // AK-74 5.45x39 Magpul PMAG 30 GEN M3 30-round magazine
                    count = 3;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    if (this.vikConfig.Logging) {
                        console.log("[" + this.mod + "] SAG 545 Vik For 545 case win (you roll " + roll + " of " + this.vikConfig.fff_twelve + ")");
                    }
                }
                else if (roll <= this.vikConfig.fff_three) {
                    id = "5acf7e7986f774401e19c3a0"; // AK-105 default
                    count = 1;
                    isPreset = true;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    id = "5bed625c0db834001c062946"; // RPK-16 5.45x39 95-round drum magazine
                    count = 3;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    if (this.vikConfig.Logging) {
                        console.log("[" + this.mod + "] AK-105 default win (you roll " + roll + " of " + this.vikConfig.fff_twelve + ")");
                    }
                }
                else if (roll <= this.vikConfig.fff_four) {
                    id = "ak105_vik"; // AK 105 Vik For 545 case
                    count = 1;
                    isPreset = true;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    id = "5aaa4194e5b5b055d06310a5"; // AK-74 5.45x39 Magpul PMAG 30 GEN M3 30-round magazine
                    count = 3;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    if (this.vikConfig.Logging) {
                        console.log("[" + this.mod + "] AK 105 Vik For 545 case win (you roll " + roll + " of " + this.vikConfig.fff_twelve + ")");
                    }
                }
                else if (roll <= this.vikConfig.fff_five) {
                    id = "5acf7db286f7743a9c7092e3"; // AK-74M
                    count = 1;
                    isPreset = true;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    id = "5aaa4194e5b5b055d06310a5"; // AK-74 5.45x39 Magpul PMAG 30 GEN M3 30-round magazine
                    count = 3;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    if (this.vikConfig.Logging) {
                        console.log("[" + this.mod + "] AK-74M win (you roll " + roll + " of " + this.vikConfig.fff_twelve + ")");
                    }
                }
                else if (roll <= this.vikConfig.fff_six) {
                    id = "ak74m_vik"; // AK 74m Vik For 545 case
                    count = 1;
                    isPreset = true;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    id = "55d482194bdc2d1d4e8b456b"; // AK-74 5.45x39 6L31 60-round magazine
                    count = 3;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    if (this.vikConfig.Logging) {
                        console.log("[" + this.mod + "] AK 74m Vik For 545 case win (you roll " + roll + " of " + this.vikConfig.fff_twelve + ")");
                    }
                }
                else if (roll <= this.vikConfig.fff_seven) {
                    id = "5841474424597759ba49be91"; // AK-74N
                    count = 1;
                    isPreset = true;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    id = "564ca99c4bdc2d16268b4589"; // AK-74 5.45x39 6L20 30-round magazine
                    count = 3;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    if (this.vikConfig.Logging) {
                        console.log("[" + this.mod + "] AK-74N win (you roll " + roll + " of " + this.vikConfig.fff_twelve + ")");
                    }
                }
                else if (roll <= this.vikConfig.fff_eight) {
                    id = "5ac4abf986f7747d117c67aa"; // AKS-74N
                    count = 1;
                    isPreset = true;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    id = "564ca99c4bdc2d16268b4589"; // AK-74 5.45x39 6L20 30-round magazine
                    count = 3;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    if (this.vikConfig.Logging) {
                        console.log("[" + this.mod + "] AKS-74N win (you roll " + roll + " of " + this.vikConfig.fff_twelve + ")");
                    }
                }
                else if (roll <= this.vikConfig.fff_nine) {
                    id = "584147732459775a2b6d9f12"; // AKS-74U
                    count = 1;
                    isPreset = true;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    id = "5cbdaf89ae9215000e5b9c94"; // AK-74 5.45x39 6L23 "Plum" 30-round magazine
                    count = 3;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    if (this.vikConfig.Logging) {
                        console.log("[" + this.mod + "] AKS-74U win (you roll " + roll + " of " + this.vikConfig.fff_twelve + ")");
                    }
                }
                else if (roll <= this.vikConfig.fff_ten) {
                    id = "584147982459775a6c55e931"; // AKS-74UB
                    count = 1;
                    isPreset = true;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    id = "5cbdaf89ae9215000e5b9c94"; // AK-74 5.45x39 6L23 "Plum" 30-round magazine
                    count = 3;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    if (this.vikConfig.Logging) {
                        console.log("[" + this.mod + "] AKS-74UB win (you roll " + roll + " of " + this.vikConfig.fff_twelve + ")");
                    }
                }
                else if (roll <= this.vikConfig.fff_eleven) {
                    id = "584147ed2459775a77263501"; // AKS-74UN
                    count = 1;
                    isPreset = true;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    id = "5cbdaf89ae9215000e5b9c94"; // AK-74 5.45x39 6L23 "Plum" 30-round magazine
                    count = 3;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    if (this.vikConfig.Logging) {
                        console.log("[" + this.mod + "] AKS-74UN win (you roll " + roll + " of " + this.vikConfig.fff_twelve + ")");
                    }
                }
                else {
                    id = "5c0d1ec986f77439512a1a72"; // RPK-16
                    count = 1;
                    isPreset = true;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    id = "5bed625c0db834001c062946"; // RPK-16 5.45x39 95-round drum magazine
                    count = 3;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    if (this.vikConfig.Logging) {
                        console.log("[" + this.mod + "] RPK-16 win (you roll " + roll + " of " + this.vikConfig.fff_twelve + ")");
                    }
                }
                foundInRaid = this.vikConfig.FIR_fff;
            }
            else if (whichGamblingContainer._name.includes("556")) {
                // This if block controls the chances of getting the item, in order
                const roll = randomUtil.getInt(1, this.vikConfig.ffs_fourteen);
                let id;
                let isPreset = false;
                let count;
                if (roll <= this.vikConfig.ffs_once) {
                    id = "ak101_vik"; // AK101 Vik For 556 case
                    count = 1;
                    isPreset = true;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    id = "5c0548ae0db834001966a3c2"; // SLR-106/AK 5.56x45 Circle 10 30-round magazine
                    count = 3;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    if (this.vikConfig.Logging) {
                        console.log("[" + this.mod + "] AK101 Vik For 556 case win (you roll " + roll + " of " + this.vikConfig.ffs_fourteen + ")");
                    }
                }
                else if (roll <= this.vikConfig.ffs_tow) {
                    id = "adar_vik"; // ADAR Vik For 556 case
                    count = 1;
                    isPreset = true;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    id = "5aaa5dfee5b5b000140293d3"; // 5.56x45 Magpul PMAG 30 GEN M3 STANAG 30-round magazine
                    count = 3;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    if (this.vikConfig.Logging) {
                        console.log("[" + this.mod + "] ADAR Vik For 556 case win (you roll " + roll + " of " + this.vikConfig.ffs_fourteen + ")");
                    }
                }
                else if (roll <= this.vikConfig.ffs_three) {
                    id = "m4a1_vik"; // M4a1 Vik For 556 case
                    count = 1;
                    isPreset = true;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    id = "5aaa5dfee5b5b000140293d3"; // 5.56x45 Magpul PMAG 30 GEN M3 STANAG 30-round magazine
                    count = 3;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    if (this.vikConfig.Logging) {
                        console.log("[" + this.mod + "] M4a1 Vik For 556 case win (you roll " + roll + " of " + this.vikConfig.ffs_fourteen + ")");
                    }
                }
                else if (roll <= this.vikConfig.ffs_four) {
                    id = "mdr_vik"; // MDR Vik For 556 case
                    count = 1;
                    isPreset = true;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    id = "5aaa5dfee5b5b000140293d3"; // 5.56x45 Magpul PMAG 30 GEN M3 STANAG 30-round magazine
                    count = 3;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    if (this.vikConfig.Logging) {
                        console.log("[" + this.mod + "] MDR Vik For 556 case win (you roll " + roll + " of " + this.vikConfig.ffs_fourteen + ")");
                    }
                }
                else if (roll <= this.vikConfig.ffs_five) {
                    id = "5acf7dd986f774486e1281bf"; // AK-101
                    count = 1;
                    isPreset = true;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    id = "5ac66c5d5acfc4001718d314"; // AK-101 5.56x45 6L29 30-round magazine
                    count = 3;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    if (this.vikConfig.Logging) {
                        console.log("[" + this.mod + "] AK-101 win (you roll " + roll + " of " + this.vikConfig.ffs_fourteen + ")");
                    }
                }
                else if (roll <= this.vikConfig.ffs_six) {
                    id = "5acf7dfc86f774401e19c390"; // AK-102
                    count = 1;
                    isPreset = true;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    id = "5ac66c5d5acfc4001718d314"; // AK-101 5.56x45 6L29 30-round magazine
                    count = 3;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    if (this.vikConfig.Logging) {
                        console.log("[" + this.mod + "] AK-102 win (you roll " + roll + " of " + this.vikConfig.ffs_fourteen + ")");
                    }
                }
                else if (roll <= this.vikConfig.ffs_seven) {
                    id = "63986752a28b76105a33c095"; // AUG A3
                    count = 1;
                    isPreset = true;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    id = "62e7c98b550c8218d602cbb4"; // Steyr AUG 5.56x45 30-round magazine
                    count = 3;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    if (this.vikConfig.Logging) {
                        console.log("[" + this.mod + "] AUG A3 win (you roll " + roll + " of " + this.vikConfig.ffs_fourteen + ")");
                    }
                }
                else if (roll <= this.vikConfig.ffs_eight) {
                    id = "5c98bd7386f7740cfb15654e"; // MDR
                    count = 1;
                    isPreset = true;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    id = "62e7c98b550c8218d602cbb4"; // Steyr AUG 5.56x45 30-round magazine
                    count = 3;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    if (this.vikConfig.Logging) {
                        console.log("[" + this.mod + "] MDR win (you roll " + roll + " of " + this.vikConfig.ffs_fourteen + ")");
                    }
                }
                else if (roll <= this.vikConfig.ffs_nine) {
                    id = "5c0d1e9386f77440120288b7"; // HK 416A5
                    count = 1;
                    isPreset = true;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    id = "5c05413a0db834001c390617"; // 5.56x45 HK Steel Maritime STANAG 30-round magazine
                    count = 3;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    if (this.vikConfig.Logging) {
                        console.log("[" + this.mod + "] HK 416A5 win (you roll " + roll + " of " + this.vikConfig.ffs_fourteen + ")");
                    }
                }
                else if (roll <= this.vikConfig.ffs_ten) {
                    id = "6297738b9f1b474e440c45b5"; // G36
                    count = 1;
                    isPreset = true;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    id = "62307b7b10d2321fa8741921"; // HK G36 5.56x45 30-round magazine
                    count = 3;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    if (this.vikConfig.Logging) {
                        console.log("[" + this.mod + "] G36 win (you roll " + roll + " of " + this.vikConfig.ffs_fourteen + ")");
                    }
                }
                else if (roll <= this.vikConfig.ffs_eleven) {
                    id = "5af08cf886f774223c269184"; // M4A1
                    count = 1;
                    isPreset = true;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    id = "55d4887d4bdc2d962f8b4570"; // 5.56x45 Colt AR-15 STANAG 30-round magazine
                    count = 3;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    if (this.vikConfig.Logging) {
                        console.log("[" + this.mod + "] M4A1 win (you roll " + roll + " of " + this.vikConfig.ffs_fourteen + ")");
                    }
                }
                else if (roll <= this.vikConfig.ffs_twelve) {
                    id = "6193e226449ec003d9127fa6"; // Mk 16
                    count = 1;
                    isPreset = true;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    id = "61840d85568c120fdd2962a5"; // FN SCAR-L 5.56x45 30-round magazine (FDE)
                    count = 3;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    if (this.vikConfig.Logging) {
                        console.log("[" + this.mod + "] Mk 16 win (you roll " + roll + " of " + this.vikConfig.ffs_fourteen + ")");
                    }
                }
                else if (roll <= this.vikConfig.ffs_thirteen) {
                    id = "5c10fcb186f774533e5529ab"; // ADAR 2-15
                    count = 1;
                    isPreset = true;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    id = "5aaa5e60e5b5b000140293d6"; // 5.56x45 Magpul PMAG 10 GEN M3 STANAG 10-round magazine
                    count = 7;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    if (this.vikConfig.Logging) {
                        console.log("[" + this.mod + "] ADAR 2-15 win (you roll " + roll + " of " + this.vikConfig.ffs_fourteen + ")");
                    }
                }
                else {
                    id = "5d4d617f86f77449c463d107"; // TX-15 DML
                    count = 1;
                    isPreset = true;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    id = "5aaa5dfee5b5b000140293d3"; // 5.56x45 Magpul PMAG 30 GEN M3 STANAG 30-round magazine
                    count = 3;
                    newItemRequest.items.push(this.addToNewItemArray(id, isPreset, count));
                    if (this.vikConfig.Logging) {
                        console.log("[" + this.mod + "] TX-15 DML win (you roll " + roll + " of " + this.vikConfig.ffs_fourteen + ")");
                    }
                }
                foundInRaid = this.vikConfig.FIR_ffs;
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
                y: "5.6174",
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
                z: "10"
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
    importLocales(database) {
        const serverLocales = ['ch', 'cz', 'en', 'es', 'es-mx', 'fr', 'ge', 'hu', 'it', 'jp', 'pl', 'po', 'ru', 'sk', 'tu'];
        const addedLocales = {};
        for (const locale of serverLocales) {
            this.loadFiles(`${modPath}/db/locales/${locale}`, [".json"], function (filePath) {
                const localeFile = require(filePath);
                if (Object.keys(localeFile).length < 1)
                    return;
                for (const currentItem in localeFile) {
                    database.locales.global[locale][currentItem] = localeFile[currentItem];
                    if (!Object.keys(addedLocales).includes(locale))
                        addedLocales[locale] = {};
                    addedLocales[locale][currentItem] = localeFile[currentItem];
                }
            });
        }
        // placeholders
        for (const locale of serverLocales) {
            if (locale == "en")
                continue;
            for (const englishItem in addedLocales["en"]) {
                if (locale in addedLocales) {
                    if (englishItem in addedLocales[locale])
                        continue;
                }
                if (database.locales.global[locale] != undefined)
                    database.locales.global[locale][englishItem] = addedLocales["en"][englishItem];
            }
        }
    }
    loadFiles(dirPath, extName, cb) {
        if (!fs.existsSync(dirPath))
            return;
        const dir = fs.readdirSync(dirPath, { withFileTypes: true });
        dir.forEach(item => {
            const itemPath = path.normalize(`${dirPath}/${item.name}`);
            if (item.isDirectory())
                this.loadFiles(itemPath, extName, cb);
            else if (extName.includes(path.extname(item.name)))
                cb(itemPath);
        });
    }
}
module.exports = { mod: new Vicktoriya() };
//# sourceMappingURL=mod.js.map