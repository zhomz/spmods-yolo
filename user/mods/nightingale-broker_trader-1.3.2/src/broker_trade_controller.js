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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrokerTradeController = void 0;
const TradeController_1 = require("C:/snapshot/project/obj/controllers/TradeController");
const ItemHelper_1 = require("C:/snapshot/project/obj/helpers/ItemHelper");
const ProfileHelper_1 = require("C:/snapshot/project/obj/helpers/ProfileHelper");
const TradeHelper_1 = require("C:/snapshot/project/obj/helpers/TradeHelper");
const LogTextColor_1 = require("C:/snapshot/project/obj/models/spt/logging/LogTextColor");
const ILogger_1 = require("C:/snapshot/project/obj/models/spt/utils/ILogger");
const EventOutputHolder_1 = require("C:/snapshot/project/obj/routers/EventOutputHolder");
const ConfigServer_1 = require("C:/snapshot/project/obj/servers/ConfigServer");
const RagfairServer_1 = require("C:/snapshot/project/obj/servers/RagfairServer");
const LocalisationService_1 = require("C:/snapshot/project/obj/services/LocalisationService");
const HttpResponseUtil_1 = require("C:/snapshot/project/obj/utils/HttpResponseUtil");
const tsyringe_1 = require("C:/snapshot/project/node_modules/tsyringe");
const baseJson = __importStar(require("../db/base.json"));
const package_json_1 = __importDefault(require("../package.json"));
const config_json_1 = __importDefault(require("../config/config.json"));
const broker_price_manager_1 = require("./broker_price_manager");
const verbose_logger_1 = require("./verbose_logger");
const Money_1 = require("C:/snapshot/project/obj/models/enums/Money");
const Traders_1 = require("C:/snapshot/project/obj/models/enums/Traders");
const TraderHelper_1 = require("C:/snapshot/project/obj/helpers/TraderHelper");
const RagfairPriceService_1 = require("C:/snapshot/project/obj/services/RagfairPriceService");
const JsonUtil_1 = require("C:/snapshot/project/obj/utils/JsonUtil");
let BrokerTradeController = class BrokerTradeController extends TradeController_1.TradeController {
    constructor(logger, eventOutputHolder, tradeHelper, itemHelper, profileHelper, traderHelper, jsonUtil, ragfairServer, httpResponse, localisationService, ragfairPriceService, configServer
    // @inject("IRagfairConfig") ragfairConfig: IRagfairConfig, - not used
    // @inject("ITraderConfig") traderConfig: ITraderConfig - not used
    ) {
        super(logger, eventOutputHolder, tradeHelper, itemHelper, profileHelper, traderHelper, jsonUtil, ragfairServer, httpResponse, localisationService, ragfairPriceService, configServer);
    }
    // public override confirmTrading(pmcData: IPmcData, body: IProcessBaseTradeRequestData, sessionID: string, foundInRaid?: boolean, upd?: Upd): IItemEventRouterResponse - old from SPT 3.5.5
    confirmTrading(pmcData, body, sessionID) {
        // Exceptions seem to be handled somewhere where this method is used.
        // And due to the way they are handled - only "error" is displayed instead of the actual error msg.
        // This sort of fixes it sometimes.     
        try {
            if (body.tid === baseJson._id) {
                const logPrefix = `[${package_json_1.default.name} ${package_json_1.default.version}]`;
                if (body.type === "buy_from_trader") {
                    // Redirect currency purchases to corresponding traders
                    const buyRequestData = body;
                    const traderHelper = broker_price_manager_1.BrokerPriceManager.instance.container.resolve(TraderHelper_1.TraderHelper.name);
                    const brokerAssort = traderHelper.getTraderAssortsByTraderId(broker_price_manager_1.BrokerPriceManager.brokerTraderId);
                    const brokerUsdItem = brokerAssort.items.find(item => item._tpl === Money_1.Money.DOLLARS)._id;
                    const brokerEurItem = brokerAssort.items.find(item => item._tpl === Money_1.Money.EUROS)._id;
                    if (buyRequestData.item_id === brokerUsdItem) {
                        buyRequestData.tid = Traders_1.Traders.PEACEKEEPER;
                        buyRequestData.item_id = traderHelper.getTraderAssortsByTraderId(Traders_1.Traders.PEACEKEEPER).items.find(item => item._tpl === Money_1.Money.DOLLARS)._id;
                    }
                    if (buyRequestData.item_id === brokerEurItem) {
                        buyRequestData.tid = Traders_1.Traders.SKIER;
                        buyRequestData.item_id = traderHelper.getTraderAssortsByTraderId(Traders_1.Traders.SKIER).items.find(item => item._tpl === Money_1.Money.EUROS)._id;
                    }
                    // Let it skip to the super.confirmTrading call at the bottom.
                }
                if (body.type === "sell_to_trader") {
                    const priceManager = broker_price_manager_1.BrokerPriceManager.instance;
                    // Kind of an interesting way to pass DependencyContainer instance from mod.ts but will do.
                    // Not sure if simply importing container from "tsyringe" is good.
                    const container = priceManager.container;
                    const verboseLogger = new verbose_logger_1.VerboseLogger(container);
                    const sellRequestBody = body;
                    // const traderHelper = container.resolve<TraderHelper>(TraderHelper.name); - not used
                    // const handbookHelper = container.resolve<HandbookHelper>(HandbookHelper.name); - not used
                    // Logging. Shouldn't be executed during normal use, since it additionally searches for items in player inventory by id.
                    if (verboseLogger.isVerboseEnabled) {
                        verboseLogger.log(`${logPrefix} SELL REQUEST BODY DUMP: ${JSON.stringify(sellRequestBody)}`, LogTextColor_1.LogTextColor.RED);
                        const requestInventoryItems = sellRequestBody.items.map(reqItem => priceManager.getItemFromInventoryById(reqItem.id, pmcData));
                        verboseLogger.log(`${logPrefix} REQUEST INVENTORY ITEMS DUMP: ${JSON.stringify(requestInventoryItems)}`, LogTextColor_1.LogTextColor.YELLOW);
                    }
                    const responses = [];
                    const sellReqDataPerTrader = priceManager.processSellRequestDataForMostProfit(pmcData, sellRequestBody);
                    // traderId used for grouping, so may contain brokerTraderId(valid trader id) and brokerCurrencyExchangeId(not a valid trader id)
                    // prefer tReqData.requestBody.tid for actual valid trader id.
                    for (const traderId in sellReqDataPerTrader) {
                        const tReqData = sellReqDataPerTrader[traderId];
                        // const tradeResponse = super.confirmTrading(pmcData, tReqData.requestBody, sessionID, foundInRaid, upd); - old from SPT 3.5.5
                        const tradeResponse = super.confirmTrading(pmcData, tReqData.requestBody, sessionID);
                        // Make sales sum increase unaffected by commission.
                        // commission is converted to trader currency(don't use commissionInRoubles)
                        if (!broker_price_manager_1.BrokerPriceManager.isBroker(traderId)) {
                            pmcData.TradersInfo[tReqData.requestBody.tid].salesSum += tReqData.commission;
                        }
                        // Logging section
                        if (tReqData.isFleaMarket) {
                            let profitMsg = `${logPrefix} ${tReqData.traderName}: Sold ${tReqData.fullItemCount} items. ` +
                                `Profit: ${broker_price_manager_1.BrokerPriceManager.getNumberWithSpaces(tReqData.totalProfit)} RUB (` +
                                `Price: ${broker_price_manager_1.BrokerPriceManager.getNumberWithSpaces(tReqData.totalPrice)} RUB | ` +
                                `Tax: ${broker_price_manager_1.BrokerPriceManager.getNumberWithSpaces(tReqData.totalTax)} RUB).`;
                            if (config_json_1.default.profitCommissionPercentage > 0) {
                                profitMsg += ` Commission: ${tReqData.commissionInRoubles} RUB.`;
                            }
                            verboseLogger.explicitSuccess(profitMsg);
                        }
                        else {
                            const tCurrency = broker_price_manager_1.BrokerPriceManager.instance.tradersMetaData[traderId].currency;
                            let profitMsg = `${logPrefix} ${tReqData.traderName}: Sold ${tReqData.fullItemCount} items. Profit ${broker_price_manager_1.BrokerPriceManager.getNumberWithSpaces(tReqData.totalProfitInRoubles)} RUB`;
                            if (tCurrency !== "RUB") {
                                profitMsg += ` (In ${tCurrency}: ${broker_price_manager_1.BrokerPriceManager.getNumberWithSpaces(tReqData.totalProfit)})`;
                            }
                            profitMsg += ".";
                            if (config_json_1.default.profitCommissionPercentage > 0 && tReqData.commissionInRoubles > 0) // no need for commission log when it's 0 (e.g. currency exhange)
                             {
                                profitMsg += ` Commission: ${tReqData.commissionInRoubles} RUB`;
                                if (tCurrency !== "RUB") {
                                    profitMsg += ` (In ${tCurrency}: ${broker_price_manager_1.BrokerPriceManager.getNumberWithSpaces(tReqData.commission)})`;
                                }
                                profitMsg += ".";
                            }
                            verboseLogger.explicitSuccess(profitMsg);
                        }
                        // Items sold to Broker are sold with Flea Prices, here simulate other flea market things
                        if (tReqData.isFleaMarket) {
                            // Use total price, since the tax doesn't count towards flea rep.
                            // By default - you get 0.01 rep per 50 000 RUB sold. 
                            const repGain = this.ragfairConfig.sell.reputation.gain;
                            const ratingIncrease = tReqData.totalPrice * repGain;
                            pmcData.RagfairInfo.isRatingGrowing = true;
                            pmcData.RagfairInfo.rating += ratingIncrease;
                            verboseLogger.explicitSuccess(`${logPrefix} ${tReqData.traderName}: Flea rep increased to ${pmcData.RagfairInfo.rating} (+${ratingIncrease})`);
                            // Usually flea operations increase the salesSum of a hidden "ragfair" trader, it's simulated here
                            // I think it's probably unnecessary to show it in the logs since salesSum also includes your purchases from flea (tested).
                            pmcData.TradersInfo["ragfair"].salesSum += tReqData.totalPrice; // add to the sales sum for consistency
                            // - Changing "profileChanges" doesn't seem to work.
                            //
                            // const profileChange = tradeResponse?.profileChanges[sessionID] as ProfileChange;
                            // if (profileChange == undefined) throw ("Either trade response is undefined, or profile changes user id doesnt match with current user. This probably shouldn't happen.");
                            // const currFleaRelations = pmcData.TradersInfo["ragfair"];
                            // if (currFleaRelations == undefined) throw ("Couldn't get current Flea Market relations from user profile. Maybe you haven't traded on flea yet? Notify the developer about this.")
                            // profileChange.traderRelations["ragfair"] = {
                            //     disabled: currFleaRelations.disabled,
                            //     loyaltyLevel: currFleaRelations.loyaltyLevel,
                            //     salesSum: currFleaRelations.salesSum + tReqData.totalPrice,
                            //     standing: currFleaRelations.standing,
                            //     nextResupply: currFleaRelations.nextResupply,
                            //     unlocked: currFleaRelations.unlocked
                            // }
                        }
                        verboseLogger.log(`${logPrefix} ${tReqData.traderName} RESPONSE DUMP: ${JSON.stringify(tradeResponse)}`, LogTextColor_1.LogTextColor.CYAN);
                        responses.push(tradeResponse);
                    }
                    // verboseLogger.log(`${logPrefix} ALL RESPONSES ARRAY DUMP: ${JSON.stringify(responses)}`, LogTextColor.CYAN);
                    // const mergedResponse = this.mergeResponses(sessionID, responses);
                    // Apparently every single of these responses point to the same object
                    // which is updated with every transaction, so no manual merging is needed.
                    // Just take the last respons. For now I'll leave the array here, but will probably remove later.
                    const mergedResponse = responses[responses.length - 1];
                    verboseLogger.log(`${logPrefix} LAST RESPONSE DUMP: ${JSON.stringify(responses)}`, LogTextColor_1.LogTextColor.YELLOW);
                    return mergedResponse;
                }
            }
            //console.log(`TRADING TYPE: ${body.Action}`);
            //console.log(`BUYREQ DUMP: ${JSON.stringify(body)}`)
            // return super.confirmTrading(pmcData, body, sessionID, foundInRaid, upd); - old from SPT 3.5.5
            return super.confirmTrading(pmcData, body, sessionID);
        }
        catch (error) {
            this.logger.error(error);
            throw "error";
        }
    }
    /**
     * @deprecated
     * @param itemId
     * @param pmcData
     * @returns
     */
    // Find item by it's id in inventory. If not found return undefined.
    getItemFromInventoryById(itemId, pmcData) {
        return pmcData.Inventory.items.find(item => item._id === itemId);
    }
};
exports.BrokerTradeController = BrokerTradeController;
exports.BrokerTradeController = BrokerTradeController = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("WinstonLogger")),
    __param(1, (0, tsyringe_1.inject)("EventOutputHolder")),
    __param(2, (0, tsyringe_1.inject)("TradeHelper")),
    __param(3, (0, tsyringe_1.inject)("ItemHelper")),
    __param(4, (0, tsyringe_1.inject)("ProfileHelper")),
    __param(5, (0, tsyringe_1.inject)("TraderHelper")),
    __param(6, (0, tsyringe_1.inject)("JsonUtil")),
    __param(7, (0, tsyringe_1.inject)("RagfairServer")),
    __param(8, (0, tsyringe_1.inject)("HttpResponseUtil")),
    __param(9, (0, tsyringe_1.inject)("LocalisationService")),
    __param(10, (0, tsyringe_1.inject)("RagfairPriceService")),
    __param(11, (0, tsyringe_1.inject)("ConfigServer")),
    __metadata("design:paramtypes", [typeof (_a = typeof ILogger_1.ILogger !== "undefined" && ILogger_1.ILogger) === "function" ? _a : Object, typeof (_b = typeof EventOutputHolder_1.EventOutputHolder !== "undefined" && EventOutputHolder_1.EventOutputHolder) === "function" ? _b : Object, typeof (_c = typeof TradeHelper_1.TradeHelper !== "undefined" && TradeHelper_1.TradeHelper) === "function" ? _c : Object, typeof (_d = typeof ItemHelper_1.ItemHelper !== "undefined" && ItemHelper_1.ItemHelper) === "function" ? _d : Object, typeof (_e = typeof ProfileHelper_1.ProfileHelper !== "undefined" && ProfileHelper_1.ProfileHelper) === "function" ? _e : Object, typeof (_f = typeof TraderHelper_1.TraderHelper !== "undefined" && TraderHelper_1.TraderHelper) === "function" ? _f : Object, typeof (_g = typeof JsonUtil_1.JsonUtil !== "undefined" && JsonUtil_1.JsonUtil) === "function" ? _g : Object, typeof (_h = typeof RagfairServer_1.RagfairServer !== "undefined" && RagfairServer_1.RagfairServer) === "function" ? _h : Object, typeof (_j = typeof HttpResponseUtil_1.HttpResponseUtil !== "undefined" && HttpResponseUtil_1.HttpResponseUtil) === "function" ? _j : Object, typeof (_k = typeof LocalisationService_1.LocalisationService !== "undefined" && LocalisationService_1.LocalisationService) === "function" ? _k : Object, typeof (_l = typeof RagfairPriceService_1.RagfairPriceService !== "undefined" && RagfairPriceService_1.RagfairPriceService) === "function" ? _l : Object, typeof (_m = typeof ConfigServer_1.ConfigServer !== "undefined" && ConfigServer_1.ConfigServer) === "function" ? _m : Object])
], BrokerTradeController);
//# sourceMappingURL=broker_trade_controller.js.map