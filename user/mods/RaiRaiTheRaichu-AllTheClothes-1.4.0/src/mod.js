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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const scavSuitLocale = __importStar(require("../db/locale.json"));
const path_1 = __importDefault(require("path"));
const jsonc_1 = require("C:/snapshot/project/node_modules/jsonc");
class AllTheClothes {
    postDBLoad(container) {
        const vfs = container.resolve("VFS");
        const config = jsonc_1.jsonc.parse(vfs.readFile(path_1.default.resolve(__dirname, "../config/config.jsonc")));
        const databaseServer = container.resolve("DatabaseServer");
        const logger = container.resolve("WinstonLogger");
        var clothingToAdd = [];
        var topList = [];
        var handsList = [];
        var kitList = [];
        var headList = [];
        var clothingBlacklist = ["DefaultUsecBody",
            "usec_upper_acu",
            "usec_upper_commando",
            "usec_upper_aggressor",
            "usec_upper_hoody",
            "usec_upper_pcuironsight",
            "usec_top_beltstaff",
            "usec_upper_flexion",
            "usec_upper_tier3",
            "usec_upper_pcsmulticam",
            "usec_upper_tier_2",
            "usec_upper_infiltrator",
            "user_upper_NightPatrol",
            "wild_Killa_body",
            "wild_Shturman_body",
            "top_boss_tagilla"];
        var handBundles = { "hands_boss_big_pipe": "assets/hands_boss_big_pipe.skin.bundle",
            "hands_boss_birdeye": "assets/hands_boss_birdeye.skin.bundle",
            "hands_boss_blackknight": "assets/hands_boss_blackknight.skin.bundle",
            "hands_boss_glukhar": "assets/hands_boss_glukhar.skin.bundle",
            "hands_boss_kaban": "assets/hands_boss_kaban.skin.bundle",
            "hands_boss_killa": "assets/hands_boss_killa.skin.bundle",
            "hands_boss_reshala": "assets/hands_boss_reshala.skin.bundle",
            "hands_boss_sanitar": "assets/hands_boss_sanitar.skin.bundle",
            "hands_boss_shturman": "assets/hands_boss_shturman.skin.bundle",
            "hands_boss_tagilla": "assets/hands_boss_tagilla.skin.bundle",
            "hands_boss_zryachiy": "assets/hands_boss_zryachiy.skin.bundle",
            "hands_scav_cultist1": "assets/hands_scav_cultist1.skin.bundle",
            "hands_scav_cultist2": "assets/hands_scav_cultist2.skin.bundle",
            "hands_scav_gorka4": "assets/hands_scav_gorka4.skin.bundle",
            "hands_scav_husky": "assets/hands_scav_husky.skin.bundle",
            "hands_scav_scavelite": "assets/hands_scav_scavelite.skin.bundle",
            "hands_scav_security1": "assets/hands_scav_security1.skin.bundle",
            "hands_scav_security2": "assets/hands_scav_security2.skin.bundle",
            "hands_scav_tatu1": "assets/hands_scav_tatu1.skin.bundle",
            "hands_scav_tatu2": "assets/hands_scav_tatu2.skin.bundle",
            "hands_scav_wildbody": "assets/content/hands/wild/wild_body_firsthands.bundle",
            "hands_scav_wildbody2": "assets/hands_scav_wildbody2.skin.bundle",
            "hands_scav_wildbody3": "assets/hands_scav_wildbody3.skin.bundle" };
        for (let bundleKey in handBundles) {
            let newHand = {
                "_id": bundleKey,
                "_name": bundleKey,
                "_parent": "5cc086a314c02e000c6bea69",
                "_type": "Item",
                "_props": {
                    "Name": "DefaultBearHands",
                    "ShortName": "DefaultBearHands",
                    "Description": "DefaultBearHands",
                    "Side": [
                        "Bear",
                        "Usec",
                        "Savage"
                    ],
                    "BodyPart": "Hands",
                    "Prefab": {
                        "path": handBundles[bundleKey],
                        "rcid": ""
                    },
                    "WatchPrefab": {
                        "path": "",
                        "rcid": ""
                    },
                    "IntegratedArmorVest": false,
                    "WatchPosition": {
                        "x": 0,
                        "y": 0,
                        "z": 0
                    },
                    "WatchRotation": {
                        "x": 0,
                        "y": 0,
                        "z": 0
                    }
                }
            };
            handsList.push(newHand);
        }
        // Add hand entries to the customization.json.
        for (let hand in handsList) {
            const customization = databaseServer.getTables().templates.customization;
            customization[handsList[hand]._id] = handsList[hand];
        }
        // Iterate through upper body clothing, check it's not in the blacklist, push it to our array.
        for (var upperClothing in databaseServer.getTables().globals.config.Customization.SavageBody) {
            if (clothingBlacklist.includes(upperClothing)) {
                continue;
            }
            // Create a kit entry.
            let kitname = upperClothing + "_kit";
            let newKit = {
                _id: kitname,
                _name: kitname,
                _parent: "5cd944ca1388ce03a44dc2a4",
                _type: "Item",
                _props: {
                    Name: upperClothing,
                    ShortName: upperClothing,
                    Description: upperClothing,
                    Side: ["Usec", "Bear", "Savage"],
                    AvailableAsDefault: false,
                    Body: databaseServer.getTables().globals.config.Customization.SavageBody[upperClothing].body,
                    Hands: config[upperClothing]?.handsOverride ?? "5cc2e68f14c02e28b47de290"
                },
                _proto: "5cde9ec17d6c8b04723cf479"
            };
            kitList.push(newKit);
            clothingToAdd.push(newKit);
        }
        for (let head in config.heads) {
            headList.push(config.heads[head]);
        }
        for (let top in config.tops) {
            topList.push(config.tops[top]);
        }
        for (let top in topList) {
            const customization = databaseServer.getTables().templates.customization;
            customization[topList[top]._id] = topList[top];
        }
        for (let kit in config.kits) {
            kitList.push(config.kits[kit]);
            clothingToAdd.push(config.kits[kit]);
        }
        // Push our kits to the customization.json.
        for (let kit in kitList) {
            const customization = databaseServer.getTables().templates.customization;
            customization[kitList[kit]._id] = kitList[kit];
        }
        // Iterate through lower body clothing, check it's not in the blacklist, push it to our array.
        for (var lowerClothing in databaseServer.getTables().globals.config.Customization.SavageFeet) {
            if (clothingBlacklist.includes(lowerClothing)) {
                continue;
            }
            let newSuite = {
                _id: lowerClothing + "_suite",
                _name: lowerClothing,
                _parent: "5cd944d01388ce000a659df9",
                _type: "Item",
                _props: {
                    Name: lowerClothing,
                    ShortName: lowerClothing,
                    Description: lowerClothing,
                    Side: ["Usec", "Bear", "Savage"],
                    AvailableAsDefault: false,
                    Feet: databaseServer.getTables().globals.config.Customization.SavageFeet[lowerClothing].feet
                }
            };
            clothingToAdd.push(newSuite);
        }
        // Making all Ragman's clothing free if the config option is true.
        if (config.AllPMCClothesFree) {
            for (let suitOffer in databaseServer.getTables().traders["5ac3b934156ae10c4430e83c"].suits) {
                databaseServer.getTables().traders["5ac3b934156ae10c4430e83c"].suits[suitOffer].requirements =
                    {
                        loyaltyLevel: 0,
                        profileLevel: 0,
                        standing: 0,
                        skillRequirements: [],
                        questRequirements: [],
                        itemRequirements: []
                    };
            }
        }
        // Push all the new clothing we've added to our array to the Traders as new clothing.
        let fenceOffers = [];
        let ragmanOffers = [];
        for (var clothing in clothingToAdd) {
            let configName = clothingToAdd[clothing]._props.Name;
            let newTraderOffer = {
                _id: clothingToAdd[clothing]._name + "_Offer",
                tid: config.UseRagmanInsteadOfFence ? "5ac3b934156ae10c4430e83c" : config[configName]?.ragman ? "5ac3b934156ae10c4430e83c" : "579dc571d53a0658a154fbec",
                suiteId: clothingToAdd[clothing]._id,
                isActive: true,
                requirements: {
                    loyaltyLevel: config.AllScavClothesFree ? 0 : config[configName].loyaltyLevel,
                    profileLevel: config.AllScavClothesFree ? 0 : config[configName].profileLevel,
                    standing: config.AllScavClothesFree ? 0 : config[configName].standing,
                    skillRequirements: config.AllScavClothesFree ? [] : config[configName].skillRequirements,
                    questRequirements: config.AllScavClothesFree ? [] : config[configName].questRequirements,
                    itemRequirements: config.AllScavClothesFree ? [] : config[configName].itemRequirements
                }
            };
            // Push it to the correct trader.
            if (!config.UseRagmanInsteadOfFence) {
                config[configName]?.ragman ? ragmanOffers.push(newTraderOffer) : fenceOffers.push(newTraderOffer);
            }
            else {
                ragmanOffers.push(newTraderOffer);
            }
            databaseServer.getTables().templates.customization[clothingToAdd[clothing]._id] = clothingToAdd[clothing];
        }
        // Make sure Fence can sell clothes.
        if (databaseServer.getTables().traders["579dc571d53a0658a154fbec"].suits) {
            let fenceSuits = databaseServer.getTables().traders["579dc571d53a0658a154fbec"].suits;
            fenceSuits.push(...fenceOffers);
            databaseServer.getTables().traders["579dc571d53a0658a154fbec"].suits = fenceSuits;
        }
        else {
            databaseServer.getTables().traders["579dc571d53a0658a154fbec"].base.customization_seller = true;
            databaseServer.getTables().traders["579dc571d53a0658a154fbec"].suits = fenceOffers;
        }
        if (ragmanOffers[0] !== null) {
            let ragmanSuits = databaseServer.getTables().traders["5ac3b934156ae10c4430e83c"].suits;
            ragmanSuits.push(...ragmanOffers);
            databaseServer.getTables().traders["5ac3b934156ae10c4430e83c"].suits = ragmanSuits;
        }
        // Add faction heads to the opposite sides.
        for (const customizationItem in databaseServer.getTables().templates.customization) {
            if (databaseServer.getTables().templates.customization[customizationItem]._parent === "5cc085e214c02e000c6bea67"
                && databaseServer.getTables().templates.customization[customizationItem]._props.Side.includes("Usec")
                && !databaseServer.getTables().templates.customization[customizationItem]._props.Side.includes("Bear")
                && config.UnlockHeadsForBothFactions === true) {
                databaseServer.getTables().templates.customization[customizationItem]._props.Side.push("Bear");
                continue;
            }
            if (databaseServer.getTables().templates.customization[customizationItem]._parent === "5cc085e214c02e000c6bea67"
                && databaseServer.getTables().templates.customization[customizationItem]._props.Side.includes("Bear")
                && !databaseServer.getTables().templates.customization[customizationItem]._props.Side.includes("Usec")
                && config.UnlockHeadsForBothFactions === true) {
                databaseServer.getTables().templates.customization[customizationItem]._props.Side.push("Usec");
                continue;
            }
        }
        // Add faction heads and voices to the opposite sides.
        for (const customizationItem in databaseServer.getTables().templates.customization) {
            if (databaseServer.getTables().templates.customization[customizationItem]._parent === "5cc085e214c02e000c6bea67"
                && config.UnlockAllHeads === true) {
                databaseServer.getTables().templates.customization[customizationItem]._props.Side = ["Usec", "Bear", "Savage"];
                if (!databaseServer.getTables().templates.character.includes(customizationItem)) {
                    databaseServer.getTables().templates.character.push(customizationItem);
                }
                continue;
            }
            if (databaseServer.getTables().templates.customization[customizationItem]._parent === "5fc100cf95572123ae738483"
                && config.UnlockAllVoices === true) {
                if (customizationItem == "5fc100cf95572123ae738483") {
                    continue;
                }
                databaseServer.getTables().templates.customization[customizationItem]._props.Side = ["Usec", "Bear", "Savage"];
                if (!databaseServer.getTables().templates.character.includes(customizationItem)) {
                    databaseServer.getTables().templates.character.push(customizationItem);
                }
                continue;
            }
        }
        // Add heads (currently only Tagilla).
        if (config.UnlockAllHeads === true) {
            for (let head in headList) {
                databaseServer.getTables().templates.customization[headList[head]._id] = headList[head];
                databaseServer.getTables().templates.character.push(headList[head]._id);
            }
        }
        // BRING BACK THE CIG SCAV
        // <3
        databaseServer.getTables().templates.customization["5d28afe786f774292668618d"]._props.Prefab.path = "assets/content/characters/character/prefabs/wild_head_3.bundle";
        // Add the localization strings for each clothing item.
        for (const localeID in databaseServer.getTables().locales.global) {
            if (localeID in scavSuitLocale) {
                var modLocale = scavSuitLocale[localeID];
            }
            else {
                var modLocale = scavSuitLocale["en"]; // Defalt back to en for nonexistent lang keys.
            }
            // Delete existing undefined keys for head models (new rogue bosses, sanitar).
            const localeEntryTypes = ["Name", "ShortName", "Description"];
            for (let entryType in localeEntryTypes) {
                delete databaseServer.getTables().locales.global[localeID][`6287b0d239d8207cb27d66c7 ${localeEntryTypes[entryType]}`];
                delete databaseServer.getTables().locales.global[localeID][`628b57d800f171376e7b2634 ${localeEntryTypes[entryType]}`];
                delete databaseServer.getTables().locales.global[localeID][`628b57d800f171376e7b2634 ${localeEntryTypes[entryType]}`];
                delete databaseServer.getTables().locales.global[localeID][`5fc615710b735e7b024c76ed ${localeEntryTypes[entryType]}`];
                delete databaseServer.getTables().locales.global[localeID][`62875ad50828252c7a28b95c ${localeEntryTypes[entryType]}`];
            }
            for (let template in modLocale) {
                databaseServer.getTables().locales.global[localeID][`${template} Name`] = modLocale[template].Name;
                databaseServer.getTables().locales.global[localeID][`${template} ShortName`] = modLocale[template].ShortName;
                databaseServer.getTables().locales.global[localeID][`${template} Description`] = modLocale[template].Description;
            }
        }
        // Allowing the unlocking/equipping of the opposite faction's clothing.
        if (config.UnlockFactionalClothing === true) {
            for (let clothing in databaseServer.getTables().templates.customization) {
                let parent = databaseServer.getTables().templates.customization[clothing]._parent;
                if (parent === "5cd944ca1388ce03a44dc2a4"
                    || parent === "5cd944d01388ce000a659df9") {
                    databaseServer.getTables().templates.customization[clothing]._props.Side = ["Usec", "Bear", "Savage"];
                }
            }
        }
        /*
        const fs = require('fs')
        fs.writeFileSync(`EN Locale.json`, JSON.stringify(databaseServer.getTables().locales.global["en"]));
        */
    }
}
module.exports = { mod: new AllTheClothes() };
