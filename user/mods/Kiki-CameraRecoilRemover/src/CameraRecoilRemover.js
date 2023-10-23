"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CameraRecoilRemover {
    container;
    config = require("../config/config.json");
    logger;
    postDBLoad(container) {
        this.container = container;
        this.logger = this.container.resolve("WinstonLogger");
        const items = this.container.resolve("DatabaseServer").getTables().templates.items;
        const weaponClassList = [
            "pistol",
            "smg",
            "shotgun",
            "assaultRifle",
            "assaultCarbine",
            "machinegun",
            "marksmanRifle",
            "sniperRifle",
            "grenadeLauncher",
            "specialWeapon"
        ];
        for (let eachItem in items) {
            if (weaponClassList.includes(items[eachItem]._props.weapClass)) {
                items[eachItem]._props.CameraRecoil *= this.config.CameraRecoil;
            }
        }
        if (this.config.debug === true) {
            this.logger.log(`[Kiki-CameraRecoilRemover] : Camera recoil is multiplied by ${this.config.CameraRecoil}`, "yellow", "black");
        }
    }
}
module.exports = { mod: new CameraRecoilRemover() };
