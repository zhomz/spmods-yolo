import { IPreset } from "@spt-aki/models/eft/common/IGlobals";
import { IDatabaseTables } from "@spt-aki/models/spt/server/IDatabaseTables";


// more helpers
import { WeaponCreateHelper } from "./weaponCreateHelper";

export class PresetCreateHelper
{
    public createItemPresets(tables: IDatabaseTables) : void
    {
        const wepCreate = new WeaponCreateHelper();
        // You have to create one of these every item!
        const exfilbPreset: IPreset = {
            _id: "exfilb",
            _type: "Preset",
            _changeWeaponName: false,
            _name: "Exfil B For Viktoriya's Secret",
            _parent: "exfilb",
            _items: wepCreate.createExfilB(),
            _encyclopedia: ""
        }
        // Put the preset into the DB.
        tables.globals.ItemPresets["exfilb"] = exfilbPreset;

        const exfilcoyotePreset: IPreset = {
            _id: "exfilcoyote",
            _type: "Preset",
            _changeWeaponName: false,
            _name: "Exfil Coyote For Viktoriya's Secret",
            _parent: "exfilc",
            _items: wepCreate.createExfilCoyote(),
            _encyclopedia: ""
        }
        // Put the preset into the DB.
        tables.globals.ItemPresets["exfilcoyote"] = exfilcoyotePreset;

        const rd704_vikPreset: IPreset = {
            _id: "rd704_vik",
            _type: "Preset",
            _changeWeaponName: false,
            _name: "RD704 For Viktoriya's Secret",
            _parent: "rd704_vik",
            _items: wepCreate.createRd704_vik(),
            _encyclopedia: ""
        }
        // Put the preset into the DB.
        tables.globals.ItemPresets["rd704_vik"] = rd704_vikPreset;

        const t5000Preset: IPreset = {
            _id: "t5000_vik",
            _type: "Preset",
            _changeWeaponName: false,
            _name: "T5000 For Viktoriya's Secret",
            _parent: "t5000_vik",
            _items: wepCreate.CreateT5000(),
            _encyclopedia: ""
        }
        // Put the preset into the DB.
        tables.globals.ItemPresets["t5000_vik"] = t5000Preset;

        const vssPreset: IPreset = {
            _id: "vss_vik",
            _type: "Preset",
            _changeWeaponName: false,
            _name: "VSS For Viktoriya's Secret",
            _parent: "vss_vik",
            _items: wepCreate.createVSS(),
            _encyclopedia: ""
        }
        // Put the preset into the DB.
        tables.globals.ItemPresets["vss_vik"] = vssPreset;

        const ak74nPreset: IPreset = {
            _id: "ak74n_vik",
            _type: "Preset",
            _changeWeaponName: false,
            _name: "Ak74N For Viktoriya's Secret",
            _parent: "ak74n_vik",
            _items: wepCreate.createAk74N(),
            _encyclopedia: ""
        }
        // Put the preset into the DB.
        tables.globals.ItemPresets["ak74n_vik"] = ak74nPreset;

        const rsh12Preset: IPreset = {
            _id: "rsh12_vik",
            _type: "Preset",
            _changeWeaponName: false,
            _name: "Rsh12 For Viktoriya's Secret",
            _parent: "rsh12_vik",
            _items: wepCreate.createRsh12(),
            _encyclopedia: ""
        }
        // Put the preset into the DB.
        tables.globals.ItemPresets["rsh12_vik"] = rsh12Preset;

        const altynsPreset: IPreset = {
            _id: "altyns",
            _type: "Preset",
            _changeWeaponName: false,
            _name: "Altyn For Viktoriya's Secret",
            _parent: "altyns",
            _items: wepCreate.createAltynShielded(),
            _encyclopedia: ""
        }
        // Put the preset into the DB.
        tables.globals.ItemPresets["altyns"] = altynsPreset;

        const vpoVik: IPreset = {
            _id: "vpo_vik",
            _type: "Preset",
            _changeWeaponName: false,
            _name: "VPO Vik For 762 case",
            _parent: "vpo_vik",
            _items: wepCreate.createvpo(),
            _encyclopedia: ""
        }
        tables.globals.ItemPresets["vpo_vik"] = vpoVik;

        const ak103Vik: IPreset = {
            _id: "ak103_vik",
            _type: "Preset",
            _changeWeaponName: false,
            _name: "AK103 Vik For 762 case",
            _parent: "ak103_vik",
            _items: wepCreate.createak103(),
            _encyclopedia: ""
        }
        tables.globals.ItemPresets["ak103_vik"] = ak103Vik;

        const ak101Vik: IPreset = {
            _id: "ak101_vik",
            _type: "Preset",
            _changeWeaponName: false,
            _name: "AK101 Vik For 556 case",
            _parent: "ak101_vik",
            _items: wepCreate.createAK101(),
            _encyclopedia: ""
        }
        tables.globals.ItemPresets["ak101_vik"] = ak101Vik;

        const adarVik: IPreset = {
            _id: "adar_vik",
            _type: "Preset",
            _changeWeaponName: false,
            _name: "ADAR Vik For 556 case",
            _parent: "adar_vik",
            _items: wepCreate.createADAR(),
            _encyclopedia: ""
        }
        tables.globals.ItemPresets["adar_vik"] = adarVik;

        const m4a1vik: IPreset = {
            _id: "m4a1_vik",
            _type: "Preset",
            _changeWeaponName: false,
            _name: "M4a1 Vik For 556 case",
            _parent: "m4a1_vik",
            _items: wepCreate.createm4a1(),
            _encyclopedia: ""
        }
        tables.globals.ItemPresets["m4a1_vik"] = m4a1vik;

        const mdrvik: IPreset = {
            _id: "mdr_vik",
            _type: "Preset",
            _changeWeaponName: false,
            _name: "MDR Vik For 556 case",
            _parent: "mdr_vik",
            _items: wepCreate.createmdr(),
            _encyclopedia: ""
        }
        tables.globals.ItemPresets["mdr_vik"] = mdrvik;
        // modded sag545
        const sag545Vik: IPreset = {
            _id: "sag545_vik",
            _type: "Preset",
            _changeWeaponName: false,
            _name: "SAG 545 Vik For 545 case",
            _parent: "sag545_vik",
            _items: wepCreate.createak545(),
            _encyclopedia: ""
        }
        tables.globals.ItemPresets["sag545_vik"] = sag545Vik;

        // modded ak74m
        const ak74mVik: IPreset = {
            _id: "ak74m_vik",
            _type: "Preset",
            _changeWeaponName: false,
            _name: "SAG 545 Vik For 545 case",
            _parent: "ak74m_vik",
            _items: wepCreate.createAk74m(),
            _encyclopedia: ""
        }
        tables.globals.ItemPresets["ak74m_vik"] = ak74mVik;

        // modded ak105
        const ak105Vik: IPreset = {
            _id: "ak105_vik",
            _type: "Preset",
            _changeWeaponName: false,
            _name: "AK 105 Vik For 545 case",
            _parent: "ak105_vik",
            _items: wepCreate.createAk105(),
            _encyclopedia: ""
        }
        tables.globals.ItemPresets["ak105_vik"] = ak105Vik;


    }
}