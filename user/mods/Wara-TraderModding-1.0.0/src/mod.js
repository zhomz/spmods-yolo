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
const modConfig = __importStar(require("../config/config.json"));
const BaseClasses_1 = require("C:/snapshot/project/obj/models/enums/BaseClasses");
class TraderModding {
    preAkiLoad(container) {
        const staticRouterModService = container.resolve("StaticRouterModService");
        staticRouterModService.registerStaticRouter("TraderModdingRouter", [
            {
                url: "/trader-modding/json",
                action: (url, info, sessionId, output) => {
                    const json = this.getTraderMods(container, sessionId);
                    return json;
                }
            }
        ], "trader-modding");
    }
    getTraderMods(container, sessionId) {
        const allTraderIds = [
            "54cb50c76803fa8b248b4571",
            "54cb57776803fa99248b456e",
            "58330581ace78e27b8b10cee",
            "5935c25fb3acc3127c3d8cd9",
            "5a7c2eca46aef81a7ca2145d",
            "5ac3b934156ae10c4430e83c",
            "5c0647fdd443bc2504c2d371"
        ];
        const money = ["5449016a4bdc2d6f028b456f", "5696686a4bdc2da3298b456a", "569668774bdc2da2298b4568"];
        // add custom traders defined in the config file
        for (const trader of modConfig.customTraderIds) {
            allTraderIds.push(trader);
        }
        const traderAssortHelper = container.resolve("TraderAssortHelper");
        const itemHelper = container.resolve("ItemHelper");
        const profileHelper = container.resolve("ProfileHelper");
        let addedByUnlimitedCount = false;
        const allModAssorts = [];
        for (const trader of allTraderIds) {
            const traderAssort = traderAssortHelper.getAssort(sessionId, trader, false);
            const jsontest = JSON.stringify(traderAssort);
            for (const item of traderAssort.items) {
                addedByUnlimitedCount = false;
                if (itemHelper.isOfBaseclass(item._tpl, BaseClasses_1.BaseClasses.MOD)) {
                    if (traderAssort.barter_scheme[item._id] !== undefined) {
                        // for now no barter offers. Eventually might add the option to toggle it on in the config but I don't feel like it rn
                        if (!this.isBarterOffer(traderAssort.barter_scheme[item._id][0][0], money)) {
                            if (item.upd !== undefined) {
                                if (item.upd.UnlimitedCount !== undefined) {
                                    // probably unnecessary but to be safe.
                                    if (item.upd.UnlimitedCount == true) {
                                        allModAssorts.push(item._tpl);
                                        addedByUnlimitedCount = true;
                                    }
                                }
                                if (item.upd.StackObjectsCount !== undefined && !addedByUnlimitedCount) {
                                    if (item.upd.StackObjectsCount > 0) {
                                        allModAssorts.push(item._tpl);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        // add inventory mods in the list. Have to do this because... spaghetti!
        const inventoryModsList = this.getPlayerInventory(profileHelper.getPmcProfile(sessionId), itemHelper);
        for (const s of inventoryModsList) {
            allModAssorts.push(s);
        }
        const json = JSON.stringify(allModAssorts);
        return json;
    }
    isBarterOffer(barter_scheme, money) {
        if (money.includes(barter_scheme._tpl)) {
            return false;
        }
        return true;
    }
    getPlayerInventory(profile, itemHelper) {
        const invy = profile.Inventory;
        const invyModsList = [];
        for (const item of invy.items) {
            if (itemHelper.isOfBaseclass(item._tpl, BaseClasses_1.BaseClasses.MOD)) {
                if (item.slotId !== undefined) {
                    if (item.slotId == "hideout") {
                        if (!invyModsList.includes(item._tpl)) {
                            invyModsList.push(item._tpl);
                        }
                    }
                }
            }
        }
        return invyModsList;
    }
}
module.exports = { mod: new TraderModding() };
