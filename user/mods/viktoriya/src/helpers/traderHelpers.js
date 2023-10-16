"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TraderHelper = void 0;
const Money_1 = require("C:/snapshot/project/obj/models/enums/Money");
const configLoader_1 = require("../configLoader");
const weaponCreateHelper_1 = require("./weaponCreateHelper");
class TraderHelper {
    /**
     * Add profile picture to our trader
     * @param baseJson json file for trader (db/base.json)
     * @param preAkiModLoader mod loader class - used to get the mods file path
     * @param imageRouter image router class - used to register the trader image path so we see their image on trader page
     * @param traderImageName Filename of the trader icon to use
     */
    registerProfileImage(baseJson, modName, preAkiModLoader, imageRouter, traderImageName) {
        // Reference the mod "res" folder
        const imageFilepath = `./${preAkiModLoader.getModPath(modName)}res`;
        // Register a route to point to the profile picture - remember to remove the .jpg from it
        imageRouter.addRoute(baseJson.avatar.replace(".jpg", ""), `${imageFilepath}/${traderImageName}`);
    }
    /**
     * Add record to trader config to set the refresh time of trader in seconds (default is 60 minutes)
     * @param traderConfig trader config to add our trader to
     * @param baseJson json file for trader (db/base.json)
     * @param refreshTimeSeconds How many sections between trader stock refresh
     */
    setTraderUpdateTime(traderConfig, baseJson, refreshTimeSeconds) {
        // Add refresh time in seconds to config
        const traderRefreshRecord = {
            traderId: baseJson._id,
            seconds: refreshTimeSeconds
        };
        traderConfig.updateTime.push(traderRefreshRecord);
    }
    /**
     * Add our new trader to the database
     * @param traderDetailsToAdd trader details
     * @param tables database
     * @param jsonUtil json utility class
     */
    // rome-ignore lint/suspicious/noExplicitAny: traderDetailsToAdd comes from base.json, so no type
    addTraderToDb(traderDetailsToAdd, tables, jsonUtil) {
        // Add trader to trader table, key is the traders id
        tables.traders[traderDetailsToAdd._id] = {
            assort: this.createAssortTable(),
            base: jsonUtil.deserialize(jsonUtil.serialize(traderDetailsToAdd)),
            questassort: {
                started: {},
                success: {},
                fail: {}
            } // questassort is empty as trader has no assorts unlocked by quests
        };
    }
    /**
     * Create basic data for trader + add empty assorts table for trader
     * @param tables SPT db
     * @param jsonUtil SPT JSON utility class
     * @returns ITraderAssort
     */
    createAssortTable() {
        // Create a blank assort object, ready to have items added
        const assortTable = {
            nextResupply: 0,
            items: [],
            barter_scheme: {},
            loyal_level_items: {}
        };
        return assortTable;
    }
    /**
     * Add basic items to trader
     * @param tables SPT db
     * @param traderId Traders id (basejson/_id value)
     */
    addSingleItemsToTrader(tables, traderId) {
        // Get config and set up the trade limits
        const cfg = new configLoader_1.ConfigLoader();
        const walletRollAmount = cfg.configgy.buy_limits ? 20 : 99999;
        const keycardRollAmount = cfg.configgy.buy_limits ? 10 : 99999;
        const vsecretAmount = cfg.configgy.buy_limits ? 10 : 99999;
        const armorAAmount = cfg.configgy.buy_limits ? 12 : 99999;
        const armorBAmount = cfg.configgy.buy_limits ? 10 : 99999;
        const sevenSixTwoAmount = cfg.configgy.buy_limits ? 10 : 99999;
        const fivefourfive = cfg.configgy.buy_limits ? 10 : 99999;
        const fivefivesix = cfg.configgy.buy_limits ? 10 : 99999;
        const rprm = cfg.configgy.buy_limits ? 10 : 99999;
        const kcprm = cfg.configgy.buy_limits ? 10 : 99999;
        // Get the table that can hold our new items
        const traderAssortTable = tables.traders[traderId].assort;
        const WALLETROLL_ID = "wallet_roll";
        this.addSingleItemToAssort(traderAssortTable, WALLETROLL_ID, true, walletRollAmount, 1, Money_1.Money.ROUBLES, cfg.configgy.wallet_roll, false, 0);
        const KEYCARDROLL_ID = "keycard_roll";
        this.addSingleItemToAssort(traderAssortTable, KEYCARDROLL_ID, true, keycardRollAmount, 1, Money_1.Money.ROUBLES, cfg.configgy.keycard_roll, false, 0);
        const VIKSECRET_ID2 = "viktoriyas_secret";
        this.addSingleItemToAssort(traderAssortTable, VIKSECRET_ID2, true, vsecretAmount, 2, Money_1.Money.ROUBLES, cfg.configgy.viktoriyas_secret_roubles, false, 0);
        const VIKSECRET_ID = "viktoriyas_secret";
        this.addSingleItemToAssortBarter(traderAssortTable, VIKSECRET_ID, true, vsecretAmount, 1, [
            { count: cfg.configgy.viktoriyas_secret, _tpl: "viktoriyas_voucher" }
        ]);
        const ARMOR_CRATE_ID = "armor_crate";
        this.addSingleItemToAssort(traderAssortTable, ARMOR_CRATE_ID, true, armorAAmount, 1, Money_1.Money.ROUBLES, cfg.configgy.basic_armor, false, 0);
        const PREMIUM_ARMOR_CRATE_ID = "premium_crate";
        this.addSingleItemToAssort(traderAssortTable, PREMIUM_ARMOR_CRATE_ID, true, armorBAmount, 2, Money_1.Money.ROUBLES, cfg.configgy.premium_armor, false, 0);
        const SEVENSIXTWO_ID = "sevensixtwo_crate";
        this.addSingleItemToAssort(traderAssortTable, SEVENSIXTWO_ID, true, sevenSixTwoAmount, 2, Money_1.Money.ROUBLES, cfg.configgy.weapon_case_762, false, 0);
        const FIVEFIVESIX_ID = "fivefivesix_crate";
        this.addSingleItemToAssort(traderAssortTable, FIVEFIVESIX_ID, true, fivefivesix, 2, Money_1.Money.ROUBLES, cfg.configgy.five_five_six, false, 0);
        const KC_PRM_ID = "kc_prm";
        this.addSingleItemToAssort(traderAssortTable, KC_PRM_ID, true, kcprm, 3, Money_1.Money.ROUBLES, 2000000, false, 0);
        const fiftyfifty_ID = "50/50";
        this.addSingleItemToAssort(traderAssortTable, fiftyfifty_ID, true, rprm, 3, Money_1.Money.ROUBLES, 5000000, false, 0);
        const FIVEFOURFIVE_ID = "fivefourfive_crate";
        this.addSingleItemToAssort(traderAssortTable, FIVEFOURFIVE_ID, true, fivefourfive, 2, Money_1.Money.ROUBLES, cfg.configgy.five_four_five, false, 0);
    }
    addComplexItemsToTrader(tables, traderId, jsonUtil) {
        const traderAssortTable = tables.traders[traderId].assort;
        //Set up vik configgy
        const configLoader = new configLoader_1.ConfigLoader();
        const vikConfig = configLoader.configgy;
        const wepCreate = new weaponCreateHelper_1.WeaponCreateHelper();
        if (vikConfig.allowWeapons) {
            const RD704_ID = wepCreate.createRd704_vik();
            this.addItemWithSubItemsToAssort(jsonUtil, traderAssortTable, RD704_ID, true, 69420, 3, Money_1.Money.ROUBLES, 400000, false, 0);
            const T5000_ID = wepCreate.CreateT5000();
            this.addItemWithSubItemsToAssort(jsonUtil, traderAssortTable, T5000_ID, true, 69420, 3, Money_1.Money.ROUBLES, 450000, false, 0);
            const VSS_VIK_ID = wepCreate.createVSS();
            this.addItemWithSubItemsToAssort(jsonUtil, traderAssortTable, VSS_VIK_ID, true, 69420, 3, Money_1.Money.ROUBLES, 300000, false, 0);
            const AK_VIK_ID = wepCreate.createAk74N();
            this.addItemWithSubItemsToAssort(jsonUtil, traderAssortTable, AK_VIK_ID, true, 69420, 3, Money_1.Money.ROUBLES, 400000, false, 0);
            const rsh_ID = wepCreate.createRsh12();
            this.addItemWithSubItemsToAssort(jsonUtil, traderAssortTable, rsh_ID, true, 69420, 3, Money_1.Money.ROUBLES, 420000, false, 0);
            const VPO_ID = wepCreate.createvpo();
            this.addItemWithSubItemsToAssort(jsonUtil, traderAssortTable, VPO_ID, true, 69420, 3, Money_1.Money.ROUBLES, 300000, false, 0);
            const ak103_ID = wepCreate.createak103();
            this.addItemWithSubItemsToAssort(jsonUtil, traderAssortTable, ak103_ID, true, 69420, 3, Money_1.Money.ROUBLES, 350000, false, 0);
            const ak101_ID = wepCreate.createAK101();
            this.addItemWithSubItemsToAssort(jsonUtil, traderAssortTable, ak101_ID, true, 69420, 3, Money_1.Money.ROUBLES, 400000, false, 0);
            const m4a1_ID = wepCreate.createm4a1();
            this.addItemWithSubItemsToAssort(jsonUtil, traderAssortTable, m4a1_ID, true, 69420, 3, Money_1.Money.ROUBLES, 650000, false, 0);
            const adar_ID = wepCreate.createADAR();
            this.addItemWithSubItemsToAssort(jsonUtil, traderAssortTable, adar_ID, true, 69420, 3, Money_1.Money.ROUBLES, 400000, false, 0);
            const mdr_ID = wepCreate.createmdr();
            this.addItemWithSubItemsToAssort(jsonUtil, traderAssortTable, mdr_ID, true, 69420, 3, Money_1.Money.ROUBLES, 300000, false, 0);
        }
    }
    /**
     * Add item to assortTable + barter scheme + loyalty level objects
     * @param assortTable Trader assorts to add item to
     * @param itemTpl Items tpl to add to traders assort
     * @param unlimitedCount Can an unlimited number of this item be purchased from trader
     * @param stackCount Total size of item stack trader sells
     * @param loyaltyLevel Loyalty level item can be purchased at
     * @param currencyType What currency does item sell for
     * @param currencyValue Amount of currency item can be purchased for
     * @param hasBuyRestriction Does the item have a max purchase amount
     * @param buyRestrictionMax How many times can item be purchased per trader refresh
     */
    addSingleItemToAssort(assortTable, itemTpl, unlimitedCount, stackCount, loyaltyLevel, currencyType, currencyValue, hasBuyRestriction, buyRestrictionMax) {
        // Create item ready for insertion into assort table
        const newItemToAdd = {
            _id: itemTpl + "single",
            _tpl: itemTpl,
            parentId: "hideout",
            slotId: "hideout",
            upd: {
                UnlimitedCount: unlimitedCount,
                StackObjectsCount: stackCount
            }
        };
        // Items can have a buy restriction per trader refresh cycle, optional
        if (hasBuyRestriction) {
            newItemToAdd.upd.BuyRestrictionMax = buyRestrictionMax;
            newItemToAdd.upd.BuyRestrictionCurrent = 0;
        }
        assortTable.items.push(newItemToAdd);
        // Barter scheme holds the cost of the item + the currency needed (doesnt need to be currency, can be any item, this is how barter traders are made)
        assortTable.barter_scheme[itemTpl + "single"] = [
            [
                {
                    count: currencyValue,
                    _tpl: currencyType
                }
            ]
        ];
        // Set loyalty level needed to unlock item
        assortTable.loyal_level_items[itemTpl + "single"] = loyaltyLevel;
    }
    /**
         * Add a complex item to trader assort (item with child items)
         * @param assortTable trader assorts to add items to
         * @param jsonUtil JSON utility class
         * @param items Items array to add to assort
         * @param unlimitedCount Can an unlimited number of this item be purchased from trader
         * @param stackCount Total size of item stack trader sells
         * @param loyaltyLevel Loyalty level item can be purchased at
         * @param currencyType What currency does item sell for
         * @param currencyValue Amount of currency item can be purchased for
         * @param hasBuyRestriction Does the item have a max purchase amount
         * @param buyRestrictionMax How many times can item be purchased per trader refresh
         */
    addItemWithSubItemsToAssort(jsonUtil, assortTable, items, unlimitedCount, stackCount, loyaltyLevel, currencyType, currencyValue, hasBuyRestriction, buyRestrictionMax) {
        // Deserialize and serialize to ensure we dont alter the original data (clone it)
        const collectionToAdd = jsonUtil.deserialize(jsonUtil.serialize(items));
        // Create upd object if its missing
        if (!collectionToAdd[0].upd) {
            collectionToAdd[0].upd = {};
        }
        // Update item base with values needed to make item sellable by trader
        collectionToAdd[0].upd = {
            UnlimitedCount: unlimitedCount,
            StackObjectsCount: stackCount
        };
        // Items can have a buy restriction per trader refresh cycle, optional
        if (hasBuyRestriction) {
            collectionToAdd[0].upd.BuyRestrictionMax = buyRestrictionMax;
            collectionToAdd[0].upd.BuyRestrictionCurrent = 0;
        }
        // First item should always have both properties set to 'hideout'
        collectionToAdd[0].parentId = "hideout";
        collectionToAdd[0].slotId = "hideout";
        // Push all the items into the traders assort table
        assortTable.items.push(...collectionToAdd);
        // Barter scheme holds the cost of the item + the currency needed (doesnt need to be currency, can be any item, this is how barter traders are made)
        assortTable.barter_scheme[collectionToAdd[0]._id] = [
            [
                {
                    count: currencyValue,
                    _tpl: currencyType
                }
            ]
        ];
        // Set loyalty level needed to unlock item
        assortTable.loyal_level_items[collectionToAdd[0]._id] = loyaltyLevel;
    }
    addSingleItemToAssortBarter(assortTable, itemTpl, unlimitedCount, stackCount, loyaltyLevel, barter) {
        // Define item in the table
        const newItem = {
            _id: itemTpl + "barter",
            _tpl: itemTpl,
            parentId: "hideout",
            slotId: "hideout",
            upd: {
                UnlimitedCount: unlimitedCount,
                StackObjectsCount: stackCount
            }
        };
        assortTable.items.push(newItem);
        // Barter scheme holds the cost of the item + the currency needed (doesnt need to be currency, can be any item, this is how barter traders are made)
        assortTable.barter_scheme[itemTpl + "barter"] = [
            barter
        ];
        // Set loyalty level needed to unlock item
        assortTable.loyal_level_items[itemTpl + "barter"] = loyaltyLevel;
    }
    /**
     * Add traders name/location/description to the locale table
     * @param baseJson json file for trader (db/base.json)
     * @param tables database tables
     * @param fullName Complete name of trader
     * @param firstName First name of trader
     * @param nickName Nickname of trader
     * @param location Location of trader (e.g. "Here in the cat shop")
     * @param description Description of trader
     */
    addTraderToLocales(baseJson, tables, fullName, firstName, nickName, location, description) {
        // For each language, add locale for the new trader
        const locales = Object.values(tables.locales.global);
        for (const locale of locales) {
            locale[`${baseJson._id} FullName`] = fullName;
            locale[`${baseJson._id} FirstName`] = firstName;
            locale[`${baseJson._id} Nickname`] = nickName;
            locale[`${baseJson._id} Location`] = location;
            locale[`${baseJson._id} Description`] = description;
        }
    }
}
exports.TraderHelper = TraderHelper;
