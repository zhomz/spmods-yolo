"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemCreateHelper = void 0;
class ItemCreateHelper {
    // Creating the items
    createItems(container) {
        // Resolve the CustomItemService container
        const customItem = container.resolve("CustomItemService");
        //This is where we create the gambling wallet item
        const walletRoller = {
            newItem: {
                _id: "wallet_roll",
                _name: "gambling_container_wallet",
                _parent: "62f109593b54472778797866",
                _props: {
                    "AnimationVariantsNumber": 0,
                    "BackgroundColor": "orange",
                    "BlocksArmorVest": false,
                    "CanPutIntoDuringTheRaid": true,
                    "CanRequireOnRagfair": false,
                    "CanSellOnRagfair": false,
                    "CantRemoveFromSlotsDuringRaid": [],
                    "ConflictingItems": [],
                    "Description": "Gambling Wallet",
                    "DiscardLimit": -1,
                    "DiscardingBlock": false,
                    "DropSoundType": "None",
                    "ExamineExperience": 100,
                    "ExamineTime": 1,
                    "ExaminedByDefault": true,
                    "ExtraSizeDown": 0,
                    "ExtraSizeForceAdd": false,
                    "ExtraSizeLeft": 0,
                    "ExtraSizeRight": 0,
                    "ExtraSizeUp": 0,
                    "Grids": [
                        {
                            "_id": "6489c03c8bc5233fdc78e789",
                            "_name": "main",
                            "_parent": "6489c03c8bc5233fdc78e788",
                            "_props": {
                                "cellsH": 1,
                                "cellsV": 1,
                                "filters": [
                                    {
                                        "ExcludedFilter": [
                                            "54009119af1c881c07000029"
                                        ],
                                        "Filter": []
                                    }
                                ],
                                "isSortingTable": false,
                                "maxCount": 99,
                                "maxWeight": 0,
                                "minCount": 1
                            },
                            "_proto": "55d329c24bdc2d892f8b4567"
                        }
                    ],
                    "Height": 1,
                    "HideEntrails": true,
                    "InsuranceDisabled": false,
                    "IsAlwaysAvailableForInsurance": false,
                    "IsLockedafterEquip": false,
                    "IsSpecialSlotOnly": false,
                    "IsUnbuyable": false,
                    "IsUndiscardable": false,
                    "IsUngivable": false,
                    "IsUnremovable": false,
                    "IsUnsaleable": false,
                    "ItemSound": "container_plastic",
                    "LootExperience": 20,
                    "MergesWithChildren": false,
                    "Name": "Gambling Wallet",
                    "NotShownInSlot": false,
                    "Prefab": {
                        "path": "assets/content/items/barter/item_barter_walletwz/item_barter_walletwz.bundle",
                        "rcid": ""
                    },
                    "QuestItem": false,
                    "QuestStashMaxCount": 0,
                    "RagFairCommissionModifier": 1,
                    "RepairCost": 0,
                    "RepairSpeed": 0,
                    "SearchSound": "drawer_metal_looting",
                    "ShortName": "Gambling Wallet",
                    "Slots": [],
                    "StackMaxSize": 10,
                    "StackObjectsCount": 1,
                    "Unlootable": false,
                    "UnlootableFromSide": [],
                    "UnlootableFromSlot": "FirstPrimaryWeapon",
                    "UsePrefab": {
                        "path": "",
                        "rcid": ""
                    },
                    "Weight": 2,
                    "Width": 1,
                    "ReverbVolume": 0
                },
                _proto: "",
                _type: "Item"
            },
            fleaPriceRoubles: 110000,
            handbookPriceRoubles: 110000,
            handbookParentId: "",
            locales: {
                "en": {
                    name: "Wallet Roll",
                    shortName: "Waller Roll",
                    description: "Wager your Roubles to win more, or lose it all!\n==============================\n0 Roubles - 60.0%\n100k Roubles - 15.0%\n300k Roubles - 18.0%\n500k Roubles - 6.0%\n2 Million Roubles - 1.0%"
                }
            }
        };
        // This the keycard gambling item
        const keycardRoller = {
            newItem: {
                _id: "keycard_roll",
                _name: "gambling_container_keycard",
                _parent: "62f109593b54472778797866",
                _props: {
                    "AnimationVariantsNumber": 0,
                    "BackgroundColor": "orange",
                    "BlocksArmorVest": false,
                    "CanPutIntoDuringTheRaid": true,
                    "CanRequireOnRagfair": false,
                    "CanSellOnRagfair": false,
                    "CantRemoveFromSlotsDuringRaid": [],
                    "ConflictingItems": [],
                    "Description": "Gambling Keycard",
                    "DiscardLimit": -1,
                    "DiscardingBlock": false,
                    "DropSoundType": "None",
                    "ExamineExperience": 100,
                    "ExamineTime": 1,
                    "ExaminedByDefault": true,
                    "ExtraSizeDown": 0,
                    "ExtraSizeForceAdd": false,
                    "ExtraSizeLeft": 0,
                    "ExtraSizeRight": 0,
                    "ExtraSizeUp": 0,
                    "Grids": [
                        {
                            "_id": "6489c03c8bc5233fdc78e789",
                            "_name": "main",
                            "_parent": "6489c03c8bc5233fdc78e788",
                            "_props": {
                                "cellsH": 1,
                                "cellsV": 1,
                                "filters": [
                                    {
                                        "ExcludedFilter": [
                                            "54009119af1c881c07000029"
                                        ],
                                        "Filter": []
                                    }
                                ],
                                "isSortingTable": false,
                                "maxCount": 99,
                                "maxWeight": 0,
                                "minCount": 1
                            },
                            "_proto": "55d329c24bdc2d892f8b4567"
                        }
                    ],
                    "Height": 1,
                    "HideEntrails": true,
                    "InsuranceDisabled": false,
                    "IsAlwaysAvailableForInsurance": false,
                    "IsLockedafterEquip": false,
                    "IsSpecialSlotOnly": false,
                    "IsUnbuyable": false,
                    "IsUndiscardable": false,
                    "IsUngivable": false,
                    "IsUnremovable": false,
                    "IsUnsaleable": false,
                    "ItemSound": "container_plastic",
                    "LootExperience": 20,
                    "MergesWithChildren": false,
                    "Name": "Gambling Wallet",
                    "NotShownInSlot": false,
                    "Prefab": {
                        "path": "assets/content/items/barter/item_container_cardholder/item_container_cardholder.bundle",
                        "rcid": ""
                    },
                    "QuestItem": false,
                    "QuestStashMaxCount": 0,
                    "RagFairCommissionModifier": 1,
                    "RepairCost": 0,
                    "RepairSpeed": 0,
                    "SearchSound": "drawer_metal_looting",
                    "ShortName": "Gambling Keycard",
                    "Slots": [],
                    "StackMaxSize": 1,
                    "StackObjectsCount": 1,
                    "Unlootable": false,
                    "UnlootableFromSide": [],
                    "UnlootableFromSlot": "FirstPrimaryWeapon",
                    "UsePrefab": {
                        "path": "",
                        "rcid": ""
                    },
                    "Weight": 2,
                    "Width": 1,
                    "ReverbVolume": 0
                },
                _proto: "",
                _type: "Item"
            },
            fleaPriceRoubles: 550000,
            handbookPriceRoubles: 550000,
            handbookParentId: "",
            locales: {
                "en": {
                    name: "Keycard Roll",
                    shortName: "Keycard Roll",
                    description: "So you want to get into labs? Try your luck. Maybe you get, maybe you don't!\n==============================\nAccess Keycard - 65.0%\nKeycard with a blue marking - 25.0%\nYellow Keycard - 6.5%\nBlack Keycard - 2.0%\nViolet Keycard - 0.8%\nBlue Keycard - 0.4%\nGreen Keycard - 0.2%\nRed Keycard - 0.1%\nAdditionaly there is 10% for Viktoriyas Secret Voucher!"
                }
            }
        };
        const viktoriyassecret = {
            newItem: {
                _id: "viktoriyas_secret",
                _name: "gambling_container_viktoriyas",
                _parent: "62f109593b54472778797866",
                _props: {
                    "AnimationVariantsNumber": 0,
                    "BackgroundColor": "orange",
                    "BlocksArmorVest": false,
                    "CanPutIntoDuringTheRaid": true,
                    "CanRequireOnRagfair": false,
                    "CanSellOnRagfair": false,
                    "CantRemoveFromSlotsDuringRaid": [],
                    "ConflictingItems": [],
                    "Description": "Viktoriya's Secret",
                    "DiscardLimit": -1,
                    "DiscardingBlock": false,
                    "DropSoundType": "None",
                    "ExamineExperience": 100,
                    "ExamineTime": 1,
                    "ExaminedByDefault": true,
                    "ExtraSizeDown": 0,
                    "ExtraSizeForceAdd": false,
                    "ExtraSizeLeft": 0,
                    "ExtraSizeRight": 0,
                    "ExtraSizeUp": 0,
                    "Grids": [
                        {
                            "_id": "6489c03c8bc5233fdc78e789",
                            "_name": "main",
                            "_parent": "6489c03c8bc5233fdc78e788",
                            "_props": {
                                "cellsH": 1,
                                "cellsV": 1,
                                "filters": [
                                    {
                                        "ExcludedFilter": [
                                            "54009119af1c881c07000029"
                                        ],
                                        "Filter": []
                                    }
                                ],
                                "isSortingTable": false,
                                "maxCount": 99,
                                "maxWeight": 0,
                                "minCount": 1
                            },
                            "_proto": "55d329c24bdc2d892f8b4567"
                        }
                    ],
                    "Height": 4,
                    "HideEntrails": true,
                    "InsuranceDisabled": false,
                    "IsAlwaysAvailableForInsurance": false,
                    "IsLockedafterEquip": false,
                    "IsSpecialSlotOnly": false,
                    "IsUnbuyable": false,
                    "IsUndiscardable": false,
                    "IsUngivable": false,
                    "IsUnremovable": false,
                    "IsUnsaleable": false,
                    "ItemSound": "container_plastic",
                    "LootExperience": 20,
                    "MergesWithChildren": false,
                    "Name": "Viktoriya's Secret",
                    "NotShownInSlot": false,
                    "Prefab": {
                        "path": "assets/content/items/containers/item_container_trackcase/item_container_trackcase.bundle",
                        "rcid": ""
                    },
                    "QuestItem": false,
                    "QuestStashMaxCount": 0,
                    "RagFairCommissionModifier": 1,
                    "RepairCost": 0,
                    "RepairSpeed": 0,
                    "SearchSound": "drawer_metal_looting",
                    "ShortName": "Viktoriya's Secret",
                    "Slots": [],
                    "StackMaxSize": 1,
                    "StackObjectsCount": 1,
                    "Unlootable": false,
                    "UnlootableFromSide": [],
                    "UnlootableFromSlot": "FirstPrimaryWeapon",
                    "UsePrefab": {
                        "path": "",
                        "rcid": ""
                    },
                    "Weight": 2,
                    "Width": 4,
                    "ReverbVolume": 0
                },
                _proto: "",
                _type: "Item"
            },
            fleaPriceRoubles: 385000,
            handbookPriceRoubles: 385000,
            handbookParentId: "",
            locales: {
                "en": {
                    name: "Viktoriya's Secret",
                    shortName: "Viktoriya's Secret",
                    description: "Top shelf stuff, and no return policy\n==============================\nModded Weapon - 47.5%\nBody armor - 28.5%\nHelmet - 24.0%"
                }
            }
        }; /// standard armor
        const armorcrate = {
            newItem: {
                _id: "armor_crate",
                _name: "gambling_container_armor",
                _parent: "62f109593b54472778797866",
                _props: {
                    "AnimationVariantsNumber": 0,
                    "BackgroundColor": "orange",
                    "BlocksArmorVest": false,
                    "CanPutIntoDuringTheRaid": true,
                    "CanRequireOnRagfair": false,
                    "CanSellOnRagfair": false,
                    "CantRemoveFromSlotsDuringRaid": [],
                    "ConflictingItems": [],
                    "Description": "Armor Crate",
                    "DiscardLimit": -1,
                    "DiscardingBlock": false,
                    "DropSoundType": "None",
                    "ExamineExperience": 100,
                    "ExamineTime": 1,
                    "ExaminedByDefault": true,
                    "ExtraSizeDown": 0,
                    "ExtraSizeForceAdd": false,
                    "ExtraSizeLeft": 0,
                    "ExtraSizeRight": 0,
                    "ExtraSizeUp": 0,
                    "Grids": [
                        {
                            "_id": "6489c03c8bc5233fdc78e789",
                            "_name": "main",
                            "_parent": "6489c03c8bc5233fdc78e788",
                            "_props": {
                                "cellsH": 1,
                                "cellsV": 1,
                                "filters": [
                                    {
                                        "ExcludedFilter": [
                                            "54009119af1c881c07000029"
                                        ],
                                        "Filter": []
                                    }
                                ],
                                "isSortingTable": false,
                                "maxCount": 99,
                                "maxWeight": 0,
                                "minCount": 1
                            },
                            "_proto": "55d329c24bdc2d892f8b4567"
                        }
                    ],
                    "Height": 4,
                    "HideEntrails": true,
                    "InsuranceDisabled": false,
                    "IsAlwaysAvailableForInsurance": false,
                    "IsLockedafterEquip": false,
                    "IsSpecialSlotOnly": false,
                    "IsUnbuyable": false,
                    "IsUndiscardable": false,
                    "IsUngivable": false,
                    "IsUnremovable": false,
                    "IsUnsaleable": false,
                    "ItemSound": "container_plastic",
                    "LootExperience": 20,
                    "MergesWithChildren": false,
                    "Name": "Armor Crate",
                    "NotShownInSlot": false,
                    "Prefab": {
                        "path": "assets/content/items/spec/item_spec_armorrepair/item_spec_armorrepair.bundle",
                        "rcid": ""
                    },
                    "QuestItem": false,
                    "QuestStashMaxCount": 0,
                    "RagFairCommissionModifier": 1,
                    "RepairCost": 0,
                    "RepairSpeed": 0,
                    "SearchSound": "drawer_metal_looting",
                    "ShortName": "Armor Crate",
                    "Slots": [],
                    "StackMaxSize": 1,
                    "StackObjectsCount": 1,
                    "Unlootable": false,
                    "UnlootableFromSide": [],
                    "UnlootableFromSlot": "FirstPrimaryWeapon",
                    "UsePrefab": {
                        "path": "",
                        "rcid": ""
                    },
                    "Weight": 2,
                    "Width": 4,
                    "ReverbVolume": 0
                },
                _proto: "",
                _type: "Item"
            },
            fleaPriceRoubles: 79750,
            handbookPriceRoubles: 79750,
            handbookParentId: "",
            locales: {
                "en": {
                    name: "Armor Crate",
                    shortName: "Armor Crate",
                    description: "Standard body armor crate\n==============================\nTier 2 - 15.0%\nTier 3 - 45.0%\nTier 4 - 30.0%\nTier 5 - 10%"
                }
            }
        };
        const premiumcrate = {
            newItem: {
                _id: "premium_crate",
                _name: "gambling_container_premium",
                _parent: "62f109593b54472778797866",
                _props: {
                    "AnimationVariantsNumber": 0,
                    "BackgroundColor": "orange",
                    "BlocksArmorVest": false,
                    "CanPutIntoDuringTheRaid": true,
                    "CanRequireOnRagfair": false,
                    "CanSellOnRagfair": false,
                    "CantRemoveFromSlotsDuringRaid": [],
                    "ConflictingItems": [],
                    "Description": "Armor Crate",
                    "DiscardLimit": -1,
                    "DiscardingBlock": false,
                    "DropSoundType": "None",
                    "ExamineExperience": 100,
                    "ExamineTime": 1,
                    "ExaminedByDefault": true,
                    "ExtraSizeDown": 0,
                    "ExtraSizeForceAdd": false,
                    "ExtraSizeLeft": 0,
                    "ExtraSizeRight": 0,
                    "ExtraSizeUp": 0,
                    "Grids": [
                        {
                            "_id": "6489c03c8bc5233fdc78e789",
                            "_name": "main",
                            "_parent": "6489c03c8bc5233fdc78e788",
                            "_props": {
                                "cellsH": 1,
                                "cellsV": 1,
                                "filters": [
                                    {
                                        "ExcludedFilter": [
                                            "54009119af1c881c07000029"
                                        ],
                                        "Filter": []
                                    }
                                ],
                                "isSortingTable": false,
                                "maxCount": 99,
                                "maxWeight": 0,
                                "minCount": 1
                            },
                            "_proto": "55d329c24bdc2d892f8b4567"
                        }
                    ],
                    "Height": 4,
                    "HideEntrails": true,
                    "InsuranceDisabled": false,
                    "IsAlwaysAvailableForInsurance": false,
                    "IsLockedafterEquip": false,
                    "IsSpecialSlotOnly": false,
                    "IsUnbuyable": false,
                    "IsUndiscardable": false,
                    "IsUngivable": false,
                    "IsUnremovable": false,
                    "IsUnsaleable": false,
                    "ItemSound": "container_plastic",
                    "LootExperience": 20,
                    "MergesWithChildren": false,
                    "Name": "Premium Armor Crate",
                    "NotShownInSlot": false,
                    "Prefab": {
                        "path": "assets/content/items/spec/item_spec_armorrepair/item_spec_armorrepair.bundle",
                        "rcid": ""
                    },
                    "QuestItem": false,
                    "QuestStashMaxCount": 0,
                    "RagFairCommissionModifier": 1,
                    "RepairCost": 0,
                    "RepairSpeed": 0,
                    "SearchSound": "drawer_metal_looting",
                    "ShortName": "Premium Armor Crate",
                    "Slots": [],
                    "StackMaxSize": 1,
                    "StackObjectsCount": 1,
                    "Unlootable": false,
                    "UnlootableFromSide": [],
                    "UnlootableFromSlot": "FirstPrimaryWeapon",
                    "UsePrefab": {
                        "path": "",
                        "rcid": ""
                    },
                    "Weight": 2,
                    "Width": 4,
                    "ReverbVolume": 0
                },
                _proto: "",
                _type: "Item"
            },
            fleaPriceRoubles: 165000,
            handbookPriceRoubles: 165000,
            handbookParentId: "",
            locales: {
                "en": {
                    name: "Premium Armor Crate",
                    shortName: "Premium Armor Crate",
                    description: "Premium body armor crate\n==============================\nTier 4 - 30.0%\nTier 5 - 50.0%\nTier 6 - 20.0%"
                }
            }
        };
        const sevensixtwo = {
            newItem: {
                _id: "sevensixtwo_crate",
                _name: "gambling_container_762",
                _parent: "62f109593b54472778797866",
                _props: {
                    "AnimationVariantsNumber": 0,
                    "BackgroundColor": "orange",
                    "BlocksArmorVest": false,
                    "CanPutIntoDuringTheRaid": true,
                    "CanRequireOnRagfair": false,
                    "CanSellOnRagfair": false,
                    "CantRemoveFromSlotsDuringRaid": [],
                    "ConflictingItems": [],
                    "Description": "Armor Crate",
                    "DiscardLimit": -1,
                    "DiscardingBlock": false,
                    "DropSoundType": "None",
                    "ExamineExperience": 100,
                    "ExamineTime": 1,
                    "ExaminedByDefault": true,
                    "ExtraSizeDown": 0,
                    "ExtraSizeForceAdd": false,
                    "ExtraSizeLeft": 0,
                    "ExtraSizeRight": 0,
                    "ExtraSizeUp": 0,
                    "Grids": [
                        {
                            "_id": "6489c03c8bc5233fdc78e789",
                            "_name": "main",
                            "_parent": "6489c03c8bc5233fdc78e788",
                            "_props": {
                                "cellsH": 1,
                                "cellsV": 1,
                                "filters": [
                                    {
                                        "ExcludedFilter": [
                                            "54009119af1c881c07000029"
                                        ],
                                        "Filter": []
                                    }
                                ],
                                "isSortingTable": false,
                                "maxCount": 99,
                                "maxWeight": 0,
                                "minCount": 1
                            },
                            "_proto": "55d329c24bdc2d892f8b4567"
                        }
                    ],
                    "Height": 4,
                    "HideEntrails": true,
                    "InsuranceDisabled": false,
                    "IsAlwaysAvailableForInsurance": false,
                    "IsLockedafterEquip": false,
                    "IsSpecialSlotOnly": false,
                    "IsUnbuyable": false,
                    "IsUndiscardable": false,
                    "IsUngivable": false,
                    "IsUnremovable": false,
                    "IsUnsaleable": false,
                    "ItemSound": "container_plastic",
                    "LootExperience": 20,
                    "MergesWithChildren": false,
                    "Name": "7.62x39 Mystery Box",
                    "NotShownInSlot": false,
                    "Prefab": {
                        "path": "assets/content/items/spec/item_spec_weaprepair/item_spec_weaprepair.bundle",
                        "rcid": ""
                    },
                    "QuestItem": false,
                    "QuestStashMaxCount": 0,
                    "RagFairCommissionModifier": 1,
                    "RepairCost": 0,
                    "RepairSpeed": 0,
                    "SearchSound": "drawer_metal_looting",
                    "ShortName": "7.62x39 Mystery Box",
                    "Slots": [],
                    "StackMaxSize": 1,
                    "StackObjectsCount": 1,
                    "Unlootable": false,
                    "UnlootableFromSide": [],
                    "UnlootableFromSlot": "FirstPrimaryWeapon",
                    "UsePrefab": {
                        "path": "",
                        "rcid": ""
                    },
                    "Weight": 2,
                    "Width": 4,
                    "ReverbVolume": 0
                },
                _proto: "",
                _type: "Item"
            },
            fleaPriceRoubles: 88000,
            handbookPriceRoubles: 88000,
            handbookParentId: "",
            locales: {
                "en": {
                    name: "7.62x39 Mystery Box",
                    shortName: "7.62x39 Mystery Box",
                    description: "7.62x39 Mystery Box, contains only 7.62 weapons obviously\n==============================\nFully modded weapon - 20.0%\nRandom default weapon - 80.0%"
                }
            }
        };
        const viktoriyasvoucher = {
            newItem: {
                _id: "viktoriyas_voucher",
                _name: "viktoriyas_voucher",
                _parent: "57864a3d24597754843f8721",
                _props: {
                    "AnimationVariantsNumber": 0,
                    "BackgroundColor": "orange",
                    "BlocksArmorVest": false,
                    "CanPutIntoDuringTheRaid": true,
                    "CanRequireOnRagfair": false,
                    "CanSellOnRagfair": false,
                    "CantRemoveFromSlotsDuringRaid": [],
                    "ConflictingItems": [],
                    "Description": "Viktoriya's Voucher",
                    "DiscardLimit": -1,
                    "DiscardingBlock": false,
                    "DropSoundType": "None",
                    "ExamineExperience": 100,
                    "ExamineTime": 1,
                    "ExaminedByDefault": true,
                    "ExtraSizeDown": 0,
                    "ExtraSizeForceAdd": false,
                    "ExtraSizeLeft": 0,
                    "ExtraSizeRight": 0,
                    "ExtraSizeUp": 0,
                    "Grids": [
                        {
                            "_id": "6489c03c8bc5233fdc78e789",
                            "_name": "main",
                            "_parent": "6489c03c8bc5233fdc78e788",
                            "_props": {
                                "cellsH": 1,
                                "cellsV": 1,
                                "filters": [
                                    {
                                        "ExcludedFilter": [
                                            "54009119af1c881c07000029"
                                        ],
                                        "Filter": []
                                    }
                                ],
                                "isSortingTable": false,
                                "maxCount": 99,
                                "maxWeight": 0,
                                "minCount": 1
                            },
                            "_proto": "55d329c24bdc2d892f8b4567"
                        }
                    ],
                    "Height": 1,
                    "HideEntrails": true,
                    "InsuranceDisabled": false,
                    "IsAlwaysAvailableForInsurance": false,
                    "IsLockedafterEquip": false,
                    "IsSpecialSlotOnly": false,
                    "IsUnbuyable": false,
                    "IsUndiscardable": false,
                    "IsUngivable": false,
                    "IsUnremovable": false,
                    "IsUnsaleable": false,
                    "ItemSound": "container_plastic",
                    "LootExperience": 20,
                    "MergesWithChildren": false,
                    "Name": "Viktoriya's Voucher",
                    "NotShownInSlot": false,
                    "Prefab": {
                        "path": "assets/content/items/barter/item_barter_valuable_nyball/item_barter_valuable_nyball_violet.bundle",
                        "rcid": ""
                    },
                    "QuestItem": false,
                    "QuestStashMaxCount": 0,
                    "RagFairCommissionModifier": 1,
                    "RepairCost": 0,
                    "RepairSpeed": 0,
                    "SearchSound": "drawer_metal_looting",
                    "ShortName": "Viktoriya's Voucher",
                    "Slots": [],
                    "StackMaxSize": 1,
                    "StackObjectsCount": 1,
                    "Unlootable": false,
                    "UnlootableFromSide": [],
                    "UnlootableFromSlot": "FirstPrimaryWeapon",
                    "UsePrefab": {
                        "path": "",
                        "rcid": ""
                    },
                    "Weight": 2,
                    "Width": 1,
                    "ReverbVolume": 0
                },
                _proto: "",
                _type: "Item"
            },
            fleaPriceRoubles: 165000,
            handbookPriceRoubles: 165000,
            handbookParentId: "",
            locales: {
                "en": {
                    name: "Viktoriyas Voucher",
                    shortName: "Viktoriyas Voucher",
                    description: "Viktoriya's Voucher - used for bartering"
                }
            }
        };
        const fivefivesix = {
            newItem: {
                _id: "fivefivesix_crate",
                _name: "gambling_container_556",
                _parent: "62f109593b54472778797866",
                _props: {
                    "AnimationVariantsNumber": 0,
                    "BackgroundColor": "orange",
                    "BlocksArmorVest": false,
                    "CanPutIntoDuringTheRaid": true,
                    "CanRequireOnRagfair": false,
                    "CanSellOnRagfair": false,
                    "CantRemoveFromSlotsDuringRaid": [],
                    "ConflictingItems": [],
                    "Description": "Armor Crate",
                    "DiscardLimit": -1,
                    "DiscardingBlock": false,
                    "DropSoundType": "None",
                    "ExamineExperience": 100,
                    "ExamineTime": 1,
                    "ExaminedByDefault": true,
                    "ExtraSizeDown": 0,
                    "ExtraSizeForceAdd": false,
                    "ExtraSizeLeft": 0,
                    "ExtraSizeRight": 0,
                    "ExtraSizeUp": 0,
                    "Grids": [
                        {
                            "_id": "6489c03c8bc5233fdc78e789",
                            "_name": "main",
                            "_parent": "6489c03c8bc5233fdc78e788",
                            "_props": {
                                "cellsH": 1,
                                "cellsV": 1,
                                "filters": [
                                    {
                                        "ExcludedFilter": [
                                            "54009119af1c881c07000029"
                                        ],
                                        "Filter": []
                                    }
                                ],
                                "isSortingTable": false,
                                "maxCount": 99,
                                "maxWeight": 0,
                                "minCount": 1
                            },
                            "_proto": "55d329c24bdc2d892f8b4567"
                        }
                    ],
                    "Height": 4,
                    "HideEntrails": true,
                    "InsuranceDisabled": false,
                    "IsAlwaysAvailableForInsurance": false,
                    "IsLockedafterEquip": false,
                    "IsSpecialSlotOnly": false,
                    "IsUnbuyable": false,
                    "IsUndiscardable": false,
                    "IsUngivable": false,
                    "IsUnremovable": false,
                    "IsUnsaleable": false,
                    "ItemSound": "container_plastic",
                    "LootExperience": 20,
                    "MergesWithChildren": false,
                    "Name": "5.56x45 Mystery Box",
                    "NotShownInSlot": false,
                    "Prefab": {
                        "path": "assets/content/items/spec/item_spec_weaprepair/item_spec_weaprepair.bundle",
                        "rcid": ""
                    },
                    "QuestItem": false,
                    "QuestStashMaxCount": 0,
                    "RagFairCommissionModifier": 1,
                    "RepairCost": 0,
                    "RepairSpeed": 0,
                    "SearchSound": "drawer_metal_looting",
                    "ShortName": "5.56x45 Mystery Box",
                    "Slots": [],
                    "StackMaxSize": 1,
                    "StackObjectsCount": 1,
                    "Unlootable": false,
                    "UnlootableFromSide": [],
                    "UnlootableFromSlot": "FirstPrimaryWeapon",
                    "UsePrefab": {
                        "path": "",
                        "rcid": ""
                    },
                    "Weight": 2,
                    "Width": 4,
                    "ReverbVolume": 0
                },
                _proto: "",
                _type: "Item"
            },
            fleaPriceRoubles: 88000,
            handbookPriceRoubles: 88000,
            handbookParentId: "",
            locales: {
                "en": {
                    name: "5.56x45 Mystery Box",
                    shortName: "5.56x45 Mystery Box",
                    description: "5.56x45 Mystery Box, contains only 5.56 weapons obviously\n==============================\nFully modded weapon - 20.0%\nRandom default weapon - 80.0%"
                }
            }
        };
        const kc_prm = {
            newItem: {
                _id: "kc_prm",
                _name: "gambling_container_kc_prm",
                _parent: "62f109593b54472778797866",
                _props: {
                    "AnimationVariantsNumber": 0,
                    "BackgroundColor": "orange",
                    "BlocksArmorVest": false,
                    "CanPutIntoDuringTheRaid": true,
                    "CanRequireOnRagfair": false,
                    "CanSellOnRagfair": false,
                    "CantRemoveFromSlotsDuringRaid": [],
                    "ConflictingItems": [],
                    "Description": "Gambling Keycard",
                    "DiscardLimit": -1,
                    "DiscardingBlock": false,
                    "DropSoundType": "None",
                    "ExamineExperience": 100,
                    "ExamineTime": 1,
                    "ExaminedByDefault": true,
                    "ExtraSizeDown": 0,
                    "ExtraSizeForceAdd": false,
                    "ExtraSizeLeft": 0,
                    "ExtraSizeRight": 0,
                    "ExtraSizeUp": 0,
                    "Grids": [
                        {
                            "_id": "6489c03c8bc5233fdc78e789",
                            "_name": "main",
                            "_parent": "6489c03c8bc5233fdc78e788",
                            "_props": {
                                "cellsH": 1,
                                "cellsV": 1,
                                "filters": [
                                    {
                                        "ExcludedFilter": [
                                            "54009119af1c881c07000029"
                                        ],
                                        "Filter": []
                                    }
                                ],
                                "isSortingTable": false,
                                "maxCount": 99,
                                "maxWeight": 0,
                                "minCount": 1
                            },
                            "_proto": "55d329c24bdc2d892f8b4567"
                        }
                    ],
                    "Height": 1,
                    "HideEntrails": true,
                    "InsuranceDisabled": false,
                    "IsAlwaysAvailableForInsurance": false,
                    "IsLockedafterEquip": false,
                    "IsSpecialSlotOnly": false,
                    "IsUnbuyable": false,
                    "IsUndiscardable": false,
                    "IsUngivable": false,
                    "IsUnremovable": false,
                    "IsUnsaleable": false,
                    "ItemSound": "container_plastic",
                    "LootExperience": 20,
                    "MergesWithChildren": false,
                    "Name": "Gambling Wallet",
                    "NotShownInSlot": false,
                    "Prefab": {
                        "path": "assets/content/items/barter/item_container_cardholder/item_container_cardholder.bundle",
                        "rcid": ""
                    },
                    "QuestItem": false,
                    "QuestStashMaxCount": 0,
                    "RagFairCommissionModifier": 1,
                    "RepairCost": 0,
                    "RepairSpeed": 0,
                    "SearchSound": "drawer_metal_looting",
                    "ShortName": "Gambling Keycard",
                    "Slots": [],
                    "StackMaxSize": 1,
                    "StackObjectsCount": 1,
                    "Unlootable": false,
                    "UnlootableFromSide": [],
                    "UnlootableFromSlot": "FirstPrimaryWeapon",
                    "UsePrefab": {
                        "path": "",
                        "rcid": ""
                    },
                    "Weight": 2,
                    "Width": 1,
                    "ReverbVolume": 0
                },
                _proto: "",
                _type: "Item"
            },
            fleaPriceRoubles: 5500000,
            handbookPriceRoubles: 5500000,
            handbookParentId: "",
            locales: {
                "en": {
                    name: "High Roll Keycard",
                    shortName: "HR Keycard",
                    description: "High rollers only, hit it high or lose it all!\n==============================\nNothing - 60.0%\nYellow Keycard - 15.0%\nBlack Keycard - 12.0%\nViolet Keycard - 7.5%\nBlue Keycard - 4.0%\nGreen Keycard - 1.0%\nRed Keycard - 0.5%\nAdditionaly there is 30% for Viktoriyas Secret Voucher!"
                }
            }
        };
        const fiftyfifty = {
            newItem: {
                _id: "50/50",
                _name: "gambling_container_50/50",
                _parent: "62f109593b54472778797866",
                _props: {
                    "AnimationVariantsNumber": 0,
                    "BackgroundColor": "orange",
                    "BlocksArmorVest": false,
                    "CanPutIntoDuringTheRaid": true,
                    "CanRequireOnRagfair": false,
                    "CanSellOnRagfair": false,
                    "CantRemoveFromSlotsDuringRaid": [],
                    "ConflictingItems": [],
                    "Description": "Gambling Keycard",
                    "DiscardLimit": -1,
                    "DiscardingBlock": false,
                    "DropSoundType": "None",
                    "ExamineExperience": 100,
                    "ExamineTime": 1,
                    "ExaminedByDefault": true,
                    "ExtraSizeDown": 0,
                    "ExtraSizeForceAdd": false,
                    "ExtraSizeLeft": 0,
                    "ExtraSizeRight": 0,
                    "ExtraSizeUp": 0,
                    "Grids": [
                        {
                            "_id": "6489c03c8bc5233fdc78e789",
                            "_name": "main",
                            "_parent": "6489c03c8bc5233fdc78e788",
                            "_props": {
                                "cellsH": 1,
                                "cellsV": 1,
                                "filters": [
                                    {
                                        "ExcludedFilter": [
                                            "54009119af1c881c07000029"
                                        ],
                                        "Filter": []
                                    }
                                ],
                                "isSortingTable": false,
                                "maxCount": 99,
                                "maxWeight": 0,
                                "minCount": 1
                            },
                            "_proto": "55d329c24bdc2d892f8b4567"
                        }
                    ],
                    "Height": 4,
                    "HideEntrails": true,
                    "InsuranceDisabled": false,
                    "IsAlwaysAvailableForInsurance": false,
                    "IsLockedafterEquip": false,
                    "IsSpecialSlotOnly": false,
                    "IsUnbuyable": false,
                    "IsUndiscardable": false,
                    "IsUngivable": false,
                    "IsUnremovable": false,
                    "IsUnsaleable": false,
                    "ItemSound": "container_plastic",
                    "LootExperience": 20,
                    "MergesWithChildren": false,
                    "Name": "Gambling Wallet",
                    "NotShownInSlot": false,
                    "Prefab": {
                        "path": "assets/content/items/containers/item_container_money/item_container_money.bundle",
                        "rcid": ""
                    },
                    "QuestItem": false,
                    "QuestStashMaxCount": 0,
                    "RagFairCommissionModifier": 1,
                    "RepairCost": 0,
                    "RepairSpeed": 0,
                    "SearchSound": "drawer_metal_looting",
                    "ShortName": "Gambling Keycard",
                    "Slots": [],
                    "StackMaxSize": 1,
                    "StackObjectsCount": 1,
                    "Unlootable": false,
                    "UnlootableFromSide": [],
                    "UnlootableFromSlot": "FirstPrimaryWeapon",
                    "UsePrefab": {
                        "path": "",
                        "rcid": ""
                    },
                    "Weight": 2,
                    "Width": 5,
                    "ReverbVolume": 0
                },
                _proto: "",
                _type: "Item"
            },
            fleaPriceRoubles: 6500000,
            handbookPriceRoubles: 6500000,
            handbookParentId: "",
            locales: {
                "en": {
                    name: "50/50",
                    shortName: "50/50",
                    description: "The true all in, ALL OR NOTHING!\n==============================\nNothing - 50.0%\n10 Million Roubles - 50.0%"
                }
            }
        };
        const fivefourfive = {
            newItem: {
                _id: "fivefourfive_crate",
                _name: "gambling_container_545",
                _parent: "62f109593b54472778797866",
                _props: {
                    "AnimationVariantsNumber": 0,
                    "BackgroundColor": "orange",
                    "BlocksArmorVest": false,
                    "CanPutIntoDuringTheRaid": true,
                    "CanRequireOnRagfair": false,
                    "CanSellOnRagfair": false,
                    "CantRemoveFromSlotsDuringRaid": [],
                    "ConflictingItems": [],
                    "Description": "Armor Crate",
                    "DiscardLimit": -1,
                    "DiscardingBlock": false,
                    "DropSoundType": "None",
                    "ExamineExperience": 100,
                    "ExamineTime": 1,
                    "ExaminedByDefault": true,
                    "ExtraSizeDown": 0,
                    "ExtraSizeForceAdd": false,
                    "ExtraSizeLeft": 0,
                    "ExtraSizeRight": 0,
                    "ExtraSizeUp": 0,
                    "Grids": [
                        {
                            "_id": "6489c03c8bc5233fdc78e789",
                            "_name": "main",
                            "_parent": "6489c03c8bc5233fdc78e788",
                            "_props": {
                                "cellsH": 1,
                                "cellsV": 1,
                                "filters": [
                                    {
                                        "ExcludedFilter": [
                                            "54009119af1c881c07000029"
                                        ],
                                        "Filter": []
                                    }
                                ],
                                "isSortingTable": false,
                                "maxCount": 99,
                                "maxWeight": 0,
                                "minCount": 1
                            },
                            "_proto": "55d329c24bdc2d892f8b4567"
                        }
                    ],
                    "Height": 4,
                    "HideEntrails": true,
                    "InsuranceDisabled": false,
                    "IsAlwaysAvailableForInsurance": false,
                    "IsLockedafterEquip": false,
                    "IsSpecialSlotOnly": false,
                    "IsUnbuyable": false,
                    "IsUndiscardable": false,
                    "IsUngivable": false,
                    "IsUnremovable": false,
                    "IsUnsaleable": false,
                    "ItemSound": "container_plastic",
                    "LootExperience": 20,
                    "MergesWithChildren": false,
                    "Name": "5.45x39 Mystery Box",
                    "NotShownInSlot": false,
                    "Prefab": {
                        "path": "assets/content/items/spec/item_spec_weaprepair/item_spec_weaprepair.bundle",
                        "rcid": ""
                    },
                    "QuestItem": false,
                    "QuestStashMaxCount": 0,
                    "RagFairCommissionModifier": 1,
                    "RepairCost": 0,
                    "RepairSpeed": 0,
                    "SearchSound": "drawer_metal_looting",
                    "ShortName": "5.45x39 Mystery Box",
                    "Slots": [],
                    "StackMaxSize": 1,
                    "StackObjectsCount": 1,
                    "Unlootable": false,
                    "UnlootableFromSide": [],
                    "UnlootableFromSlot": "FirstPrimaryWeapon",
                    "UsePrefab": {
                        "path": "",
                        "rcid": ""
                    },
                    "Weight": 2,
                    "Width": 4,
                    "ReverbVolume": 0
                },
                _proto: "",
                _type: "Item"
            },
            fleaPriceRoubles: 88000,
            handbookPriceRoubles: 88000,
            handbookParentId: "",
            locales: {
                "en": {
                    name: "5.45x39 Mystery Box",
                    shortName: "5.45x39 Mystery Box",
                    description: "5.45x39 Mystery Box, contains only 5.45 weapons obviously\n==============================\nFully modded weapon - 20.0%\nRandom default weapon - 80.0%"
                }
            }
        };
        // Create the items and put them in DB
        customItem.createItem(walletRoller);
        customItem.createItem(keycardRoller);
        customItem.createItem(viktoriyassecret);
        customItem.createItem(armorcrate);
        customItem.createItem(premiumcrate);
        customItem.createItem(sevensixtwo);
        customItem.createItem(viktoriyasvoucher);
        customItem.createItem(fivefivesix);
        customItem.createItem(kc_prm);
        customItem.createItem(fiftyfifty);
        customItem.createItem(fivefourfive);
    }
}
exports.ItemCreateHelper = ItemCreateHelper;
