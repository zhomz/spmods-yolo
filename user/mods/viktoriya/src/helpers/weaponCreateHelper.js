"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeaponCreateHelper = void 0;
class WeaponCreateHelper {
    createExfilB() {
        const exfilb = [];
        exfilb.push({
            _id: "exfil_base",
            _tpl: "5e00c1ad86f774747333222c"
        });
        exfilb.push({
            _id: "exfil_ears",
            _tpl: "5e00cfa786f77469dc6e5685",
            parentId: "exfil_base",
            slotId: "mod_equipment_000"
        });
        exfilb.push({
            _id: "exfil_shield",
            _tpl: "5e00cdd986f7747473332240",
            parentId: "exfil_base",
            slotId: "mod_equipment_001"
        });
        return exfilb;
    }
    createExfilCoyote() {
        const exfilcoyote = [];
        exfilcoyote.push({
            _id: "exfilc_base",
            _tpl: "5e01ef6886f77445f643baa4"
        });
        exfilcoyote.push({
            _id: "exfilc_ears",
            _tpl: "5e01f31d86f77465cf261343",
            parentId: "exfilc_base",
            slotId: "mod_equipment_000"
        });
        exfilcoyote.push({
            _id: "exfilc_nvg",
            _tpl: "5c0558060db834001b735271",
            parentId: "exfilc_base",
            slotId: "mod_nvg"
        });
        return exfilcoyote;
    }
    createAltynShielded() {
        const altyns = [];
        altyns.push({
            _id: "altyn_base",
            _tpl: "5aa7e276e5b5b000171d0647"
        });
        altyns.push({
            _id: "altyn_shield",
            _tpl: "5aa7e373e5b5b000137b76f0",
            parentId: "altyn_base",
            slotId: "mod_equipment"
        });
        return altyns;
    }
    createRd704_vik() {
        const rd704_vik = [];
        rd704_vik.push({
            _id: "rd_base",
            _tpl: "628a60ae6b1d481ff772e9c8"
        });
        rd704_vik.push({
            _id: "rd_muzzle",
            _tpl: "5dfa3cd1b33c0951220c079b",
            parentId: "rd_base",
            slotId: "mod_muzzle"
        });
        rd704_vik.push({
            _id: "rd_muzzle_suppresor",
            _tpl: "5dfa3d2b0dee1b22f862eade",
            parentId: "rd_muzzle",
            slotId: "mod_muzzle"
        });
        rd704_vik.push({
            _id: "rd_pistol_grip",
            _tpl: "628a664bccaab13006640e47",
            parentId: "rd_base",
            slotId: "mod_pistol_grip"
        });
        rd704_vik.push({
            _id: "rd_reciever",
            _tpl: "5d2c76ed48f03532f2136169",
            parentId: "rd_base",
            slotId: "mod_reciever"
        });
        rd704_vik.push({
            _id: "rd_reciever_scope",
            _tpl: "58491f3324597764bc48fa02",
            parentId: "rd_reciever",
            slotId: "mod_scope"
        });
        rd704_vik.push({
            _id: "rd_gas_block",
            _tpl: "628a83c29179c324ed269508",
            parentId: "rd_base",
            slotId: "mod_gas_block"
        });
        rd704_vik.push({
            _id: "rd_stock",
            _tpl: "5b0e794b5acfc47a877359b2",
            parentId: "rd_base",
            slotId: "mod_stock_000"
        });
        rd704_vik.push({
            _id: "rd_mlok",
            _tpl: "5b7be4895acfc400170e2dd5",
            parentId: "rd_gas_block",
            slotId: "mod_foregrip"
        });
        rd704_vik.push({
            _id: "rd_mlok_foregrip",
            _tpl: "5b057b4f5acfc4771e1bd3e9",
            parentId: "rd_mlok",
            slotId: "mod_foregrip"
        });
        rd704_vik.push({
            _id: "rd_mlok_flashlight",
            _tpl: "5b7be47f5acfc400170e2dd2",
            parentId: "rd_gas_block",
            slotId: "mod_mount_001"
        });
        rd704_vik.push({
            _id: "rd_flashlight",
            _tpl: "56def37dd2720bec348b456a",
            parentId: "rd_mlok_flashlight",
            slotId: "mod_tactical"
        });
        return rd704_vik;
    }
    CreateT5000() {
        const t5000_vik = [];
        t5000_vik.push({
            _id: "t5000_base",
            _tpl: "5df24cf80dee1b22f862e9bc"
        });
        t5000_vik.push({
            _id: "t5000_body",
            _tpl: "5df35e59c41b2312ea3334d5",
            parentId: "t5000_base",
            slotId: "mod_stock"
        });
        t5000_vik.push({
            _id: "t5000_stock",
            _tpl: "5df35ddddfc58d14537c2036",
            parentId: "t5000_body",
            slotId: "mod_stock_axis"
        });
        t5000_vik.push({
            _id: "t5000_pistol_grip",
            _tpl: "5df38a5fb74cd90030650cb6",
            parentId: "t5000_body",
            slotId: "mod_pistol_grip"
        });
        t5000_vik.push({
            _id: "t5000_handguard",
            _tpl: "5df25d3bfd6b4e6e2276dc9a",
            parentId: "t5000_body",
            slotId: "mod_handguard"
        });
        t5000_vik.push({
            _id: "t5000_barrel",
            _tpl: "5df256570dee1b22f862e9c4",
            parentId: "t5000_base",
            slotId: "mod_barrel"
        });
        t5000_vik.push({
            _id: "t5000_mount",
            _tpl: "5df35e970b92095fd441e4d2",
            parentId: "t5000_base",
            slotId: "mod_mount"
        });
        t5000_vik.push({
            _id: "t5000_adapter",
            _tpl: "59bffc1f86f77435b128b872",
            parentId: "t5000_barrel",
            slotId: "mod_muzzle"
        });
        t5000_vik.push({
            _id: "t5000_silencer",
            _tpl: "59bffbb386f77435b379b9c2",
            parentId: "t5000_adapter",
            slotId: "mod_muzzle"
        });
        t5000_vik.push({
            _id: "t5000_scope_mount",
            _tpl: "5b3b99265acfc4704b4a1afb",
            parentId: "t5000_mount",
            slotId: "mod_scope"
        });
        t5000_vik.push({
            _id: "t5000_scope",
            _tpl: "618ba27d9008e4636a67f61d",
            parentId: "t5000_scope_mount",
            slotId: "mod_scope"
        });
        t5000_vik.push({
            _id: "t5000_foregrip",
            _tpl: "5df36948bb49d91fb446d5ad",
            parentId: "t5000_handguard",
            slotId: "mod_foregrip"
        });
        t5000_vik.push({
            _id: "t5000_rail",
            _tpl: "5df35eb2b11454561e3923e2",
            parentId: "t5000_handguard",
            slotId: "mod_mount_000"
        });
        t5000_vik.push({
            _id: "t5000_laser",
            _tpl: "5cc9c20cd7f00c001336c65d",
            parentId: "t5000_rail",
            slotId: "mod_tactical"
        });
        return t5000_vik;
    }
    createVSS() {
        const vss_vik = [];
        vss_vik.push({
            _id: "vss_base",
            _tpl: "57838ad32459774a17445cd2"
        });
        vss_vik.push({
            _id: "vss_scope",
            _tpl: "5c82343a2e221644f31c0611",
            parentId: "vss_base",
            slotId: "mod_mount_000"
        });
        vss_vik.push({
            _id: "vss_muzzle",
            _tpl: "57838c962459774a1651ec63",
            parentId: "vss_base",
            slotId: "mod_muzzle"
        });
        vss_vik.push({
            _id: "vss_reciever",
            _tpl: "578395402459774a256959b5",
            parentId: "vss_base",
            slotId: "mod_reciever"
        });
        vss_vik.push({
            _id: "vss_stock",
            _tpl: "578395e82459774a0e553c7b",
            parentId: "vss_base",
            slotId: "mod_stock"
        });
        vss_vik.push({
            _id: "vss_mount",
            _tpl: "59eb7ebe86f7740b373438ce",
            parentId: "vss_muzzle",
            slotId: "mod_mount_000"
        });
        vss_vik.push({
            _id: "vss_foregrip",
            _tpl: "5c1bc5af2e221602b412949b",
            parentId: "vss_mount",
            slotId: "mod_foregrip"
        });
        vss_vik.push({
            _id: "vss_flashlight",
            _tpl: "56def37dd2720bec348b456a",
            parentId: "vss_mount",
            slotId: "mod_tactical_000"
        });
        return vss_vik;
    }
    createAk74N() {
        const ak74n_vik = [];
        ak74n_vik.push({
            _id: "ak74_base",
            _tpl: "5644bd2b4bdc2d3b4c8b4572"
        });
        ak74n_vik.push({
            _id: "ak74_muzzle",
            _tpl: "593d493f86f7745e6b2ceb22",
            parentId: "ak74_base",
            slotId: "mod_muzzle"
        });
        ak74n_vik.push({
            _id: "ak74_pistol_grip",
            _tpl: "6087e663132d4d12c81fd96b",
            parentId: "ak74_base",
            slotId: "mod_pistol_grip"
        });
        ak74n_vik.push({
            _id: "ak74_reciever",
            _tpl: "5d2c76ed48f03532f2136169",
            parentId: "ak74_base",
            slotId: "mod_reciever"
        });
        ak74n_vik.push({
            _id: "ak74_stock",
            _tpl: "6087e2a5232e5a31c233d552",
            parentId: "ak74_base",
            slotId: "mod_stock"
        });
        ak74n_vik.push({
            _id: "ak74_gas_block",
            _tpl: "5b237e425acfc4771e1be0b6",
            parentId: "ak74_base",
            slotId: "mod_gas_block"
        });
        ak74n_vik.push({
            _id: "ak74_flashlight_rail",
            _tpl: "5b4736a986f774040571e998",
            parentId: "ak74_gas_block",
            slotId: "mod_mount_000"
        });
        ak74n_vik.push({
            _id: "ak74_flashlight",
            _tpl: "56def37dd2720bec348b456a",
            parentId: "ak74_flashlight_rail",
            slotId: "mod_tactical"
        });
        ak74n_vik.push({
            _id: "ak74_foregrip_rail",
            _tpl: "5b4736b986f77405cb415c10",
            parentId: "ak74_gas_block",
            slotId: "mod_mount_002"
        });
        ak74n_vik.push({
            _id: "ak74_foregrip",
            _tpl: "5c1cd46f2e22164bef5cfedb",
            parentId: "ak74_foregrip_rail",
            slotId: "mod_foregrip"
        });
        ak74n_vik.push({
            _id: "ak74_scope",
            _tpl: "59f9d81586f7744c7506ee62",
            parentId: "ak74_reciever",
            slotId: "mod_scope"
        });
        return ak74n_vik;
    }
    createRsh12() {
        const rsh12_vik = [];
        rsh12_vik.push({
            _id: "rsh_base",
            _tpl: "633ec7c2a6918cb895019c6c"
        });
        rsh12_vik.push({
            _id: "rsh_flashlight",
            _tpl: "56def37dd2720bec348b456a",
            parentId: "rsh_base",
            slotId: "mod_tactical"
        });
        rsh12_vik.push({
            _id: "rsh_pistol_grip",
            _tpl: "633ec8e4025b096d320a3b1e",
            parentId: "rsh_base",
            slotId: "mod_pistol_grip"
        });
        rsh12_vik.push({
            _id: "rsh_magazine",
            _tpl: "633ec6ee025b096d320a3b15",
            parentId: "rsh_base",
            slotId: "mod_magazine"
        });
        rsh12_vik.push({
            _id: "rsh_scope_mount",
            _tpl: "57c69dd424597774c03b7bbc",
            parentId: "rsh_base",
            slotId: "mod_scope"
        });
        rsh12_vik.push({
            _id: "rsh_scope",
            _tpl: "618ba27d9008e4636a67f61d",
            parentId: "rsh_scope_mount",
            slotId: "mod_scope"
        });
        return rsh12_vik;
    }
    createak103() {
        const ak103_vik = [];
        ak103_vik.push({
            _id: "ak103_base",
            _tpl: "5ac66d2e5acfc43b321d4b53"
        });
        ak103_vik.push({
            _id: "ak103_muzzle",
            _tpl: "5f633f791b231926f2329f13",
            parentId: "ak103_base",
            slotId: "mod_muzzle"
        });
        ak103_vik.push({
            _id: "ak103_pistol_grip",
            _tpl: "5649ade84bdc2d1b2b8b4587",
            parentId: "ak103_base",
            slotId: "mod_pistol_grip"
        });
        ak103_vik.push({
            _id: "ak103_reciever",
            _tpl: "5d2c770c48f0354b4a07c100",
            parentId: "ak103_base",
            slotId: "mod_reciever"
        });
        ak103_vik.push({
            _id: "ak103_sight",
            _tpl: "5ac72e475acfc400180ae6fe",
            parentId: "ak103_base",
            slotId: "mod_sight_rear"
        });
        ak103_vik.push({
            _id: "ak103_stock",
            _tpl: "5ac50c185acfc400163398d4",
            parentId: "ak103_base",
            slotId: "mod_stock"
        });
        ak103_vik.push({
            _id: "ak103_stock_pad",
            _tpl: "5a0c59791526d8dba737bba7",
            parentId: "ak103_stock",
            slotId: "mod_stock"
        });
        ak103_vik.push({
            _id: "ak103_gas_block",
            _tpl: "59d64ec286f774171d1e0a42",
            parentId: "ak103_base",
            slotId: "mod_gas_block"
        });
        ak103_vik.push({
            _id: "ak103_handguard",
            _tpl: "57cff947245977638e6f2a19",
            parentId: "ak103_gas_block",
            slotId: "mod_handguard"
        });
        ak103_vik.push({
            _id: "ak103_rail",
            _tpl: "5b7be4895acfc400170e2dd5",
            parentId: "ak103_handguard",
            slotId: "mod_mount_003"
        });
        ak103_vik.push({
            _id: "ak103_foregrip",
            _tpl: "5c1bc5af2e221602b412949b",
            parentId: "ak103_rail",
            slotId: "mod_foregrip"
        });
        ak103_vik.push({
            _id: "ak103_charge",
            _tpl: "6130ca3fd92c473c77020dbd",
            parentId: "ak103_base",
            slotId: "mod_charge"
        });
        ak103_vik.push({
            _id: "ak103_scope",
            _tpl: "58491f3324597764bc48fa02",
            parentId: "ak103_reciever",
            slotId: "mod_scope"
        });
        return ak103_vik;
    }
    createvpo() {
        const vpo_vik = [];
        vpo_vik.push({
            _id: "vpo_base",
            _tpl: "59e6152586f77473dc057aa1"
        });
        vpo_vik.push({
            _id: "vpo_gas_block",
            _tpl: "59e649f986f77411d949b246",
            parentId: "vpo_base",
            slotId: "mod_gas_block"
        });
        vpo_vik.push({
            _id: "vpo_stock",
            _tpl: "5649b0fc4bdc2d17108b4588",
            parentId: "vpo_base",
            slotId: "mod_stock"
        });
        vpo_vik.push({
            _id: "vpo_muzzle",
            _tpl: "59e61eb386f77440d64f5daf",
            parentId: "vpo_base",
            slotId: "mod_muzzle"
        });
        vpo_vik.push({
            _id: "vpo_stock_pad",
            _tpl: "5a0c59791526d8dba737bba7",
            parentId: "vpo_stock",
            slotId: "mod_stock"
        });
        vpo_vik.push({
            _id: "vpo_handguard",
            _tpl: "57cff947245977638e6f2a19",
            parentId: "vpo_gas_block",
            slotId: "mod_handguard"
        });
        vpo_vik.push({
            _id: "vpo_rail",
            _tpl: "5b7be4895acfc400170e2dd5",
            parentId: "vpo_handguard",
            slotId: "mod_mount_003"
        });
        vpo_vik.push({
            _id: "vpo_foregrip",
            _tpl: "5c1bc5af2e221602b412949b",
            parentId: "vpo_rail",
            slotId: "mod_foregrip"
        });
        vpo_vik.push({
            _id: "vpo_pistol_grip",
            _tpl: "5b30ac585acfc433000eb79c",
            parentId: "vpo_base",
            slotId: "mod_pistol_grip"
        });
        vpo_vik.push({
            _id: "vpo_rear_sight",
            _tpl: "59d650cf86f7741b846413a4",
            parentId: "vpo_base",
            slotId: "mod_sight_rear"
        });
        vpo_vik.push({
            _id: "vpo_charge",
            _tpl: "6130ca3fd92c473c77020dbd",
            parentId: "vpo_base",
            slotId: "mod_charge"
        });
        vpo_vik.push({
            _id: "vpo_reciever",
            _tpl: "5d2c770c48f0354b4a07c100",
            parentId: "vpo_base",
            slotId: "mod_reciever"
        });
        vpo_vik.push({
            _id: "vpo_scope",
            _tpl: "57ac965c24597706be5f975c",
            parentId: "vpo_reciever",
            slotId: "mod_scope"
        });
        return vpo_vik;
    }
    createADAR() {
        const adar_vik = [];
        adar_vik.push({
            _id: "adar_base",
            _tpl: "5c07c60e0db834002330051f"
        });
        adar_vik.push({
            _id: "adar_stock",
            _tpl: "5c793fb92e221644f31bfb64",
            parentId: "adar_base",
            slotId: "mod_stock"
        });
        adar_vik.push({
            _id: "adar_charge",
            _tpl: "5f633ff5c444ce7e3c30a006",
            parentId: "adar_base",
            slotId: "mod_charge"
        });
        adar_vik.push({
            _id: "adar_pistol_grip",
            _tpl: "5a33e75ac4a2826c6e06d759",
            parentId: "adar_base",
            slotId: "mod_pistol_grip"
        });
        adar_vik.push({
            _id: "adar_reciever",
            _tpl: "5c0e2f26d174af02a9625114",
            parentId: "adar_base",
            slotId: "mod_reciever"
        });
        adar_vik.push({
            _id: "adar_barrel",
            _tpl: "5c0e2f94d174af029f650d56",
            parentId: "adar_reciever",
            slotId: "mod_barrel"
        });
        adar_vik.push({
            _id: "adar_handguard",
            _tpl: "5c78f26f2e221601da3581d1",
            parentId: "adar_reciever",
            slotId: "mod_handguard"
        });
        adar_vik.push({
            _id: "adar_muzzle",
            _tpl: "5cf6937cd7f00c056c53fb39",
            parentId: "adar_barrel",
            slotId: "mod_muzzle"
        });
        adar_vik.push({
            _id: "adar_gas_block",
            _tpl: "5d00ec68d7ad1a04a067e5be",
            parentId: "adar_barrel",
            slotId: "mod_gas_block"
        });
        adar_vik.push({
            _id: "adar_scope",
            _tpl: "626bb8532c923541184624b4",
            parentId: "adar_reciever",
            slotId: "mod_scope"
        });
        adar_vik.push({
            _id: "adar_foregrip_rail",
            _tpl: "5b7be4895acfc400170e2dd5",
            parentId: "adar_handguard",
            slotId: "mod_foregrip"
        });
        adar_vik.push({
            _id: "adar_foregrip",
            _tpl: "5c1cd46f2e22164bef5cfedb",
            parentId: "adar_foregrip_rail",
            slotId: "mod_foregrip"
        });
        adar_vik.push({
            _id: "adar_mount_rail",
            _tpl: "5b7be47f5acfc400170e2dd2",
            parentId: "adar_handguard",
            slotId: "mod_mount_000"
        });
        adar_vik.push({
            _id: "adar_tactical",
            _tpl: "5cc9c20cd7f00c001336c65d",
            parentId: "adar_mount_rail",
            slotId: "mod_tactical"
        });
        return adar_vik;
    }
    createAK101() {
        const ak101_vik = [];
        ak101_vik.push({
            _id: "ak101_base",
            _tpl: "5ac66cb05acfc40198510a10"
        });
        ak101_vik.push({
            _id: "ak101_stock_tube",
            _tpl: "5beec8b20db834001961942a",
            parentId: "ak101_base",
            slotId: "mod_stock"
        });
        ak101_vik.push({
            _id: "ak101_stock",
            _tpl: "5a9eb32da2750c00171b3f9c",
            parentId: "ak101_stock_tube",
            slotId: "mod_stock"
        });
        ak101_vik.push({
            _id: "ak101_charge",
            _tpl: "6130ca3fd92c473c77020dbd",
            parentId: "ak101_base",
            slotId: "mod_charge"
        });
        ak101_vik.push({
            _id: "ak101_reciever",
            _tpl: "5d2c770c48f0354b4a07c100",
            parentId: "ak101_base",
            slotId: "mod_reciever"
        });
        ak101_vik.push({
            _id: "ak101_pistol_grip",
            _tpl: "6087e663132d4d12c81fd96b",
            parentId: "ak101_base",
            slotId: "mod_pistol_grip"
        });
        ak101_vik.push({
            _id: "ak101_muzzle",
            _tpl: "5a9fbb84a2750c00137fa685",
            parentId: "ak101_base",
            slotId: "mod_muzzle"
        });
        ak101_vik.push({
            _id: "ak101_gas_block",
            _tpl: "59d64ec286f774171d1e0a42",
            parentId: "ak101_base",
            slotId: "mod_gas_block"
        });
        ak101_vik.push({
            _id: "ak101_handguard",
            _tpl: "5cf4e3f3d7f00c06595bc7f0",
            parentId: "ak101_gas_block",
            slotId: "mod_handguard"
        });
        ak101_vik.push({
            _id: "ak101_flashlight1",
            _tpl: "56def37dd2720bec348b456a",
            parentId: "ak101_handguard",
            slotId: "mod_tactical_002"
        });
        ak101_vik.push({
            _id: "ak101_flashlight2",
            _tpl: "56def37dd2720bec348b456a",
            parentId: "ak101_handguard",
            slotId: "mod_tactical_003"
        });
        ak101_vik.push({
            _id: "ak101_scope",
            _tpl: "59f9d81586f7744c7506ee62",
            parentId: "ak101_reciever",
            slotId: "mod_scope"
        });
        ak101_vik.push({
            _id: "ak101_rear_sight",
            _tpl: "5ac72e475acfc400180ae6fe",
            parentId: "ak101_base",
            slotId: "mod_sight_rear"
        });
        ak101_vik.push({
            _id: "ak101_foregrip",
            _tpl: "5c1bc7432e221602b412949d",
            parentId: "ak101_handguard",
            slotId: "mod_foregrip"
        });
        return ak101_vik;
    }
    createm4a1() {
        const m4a1_vik = [];
        m4a1_vik.push({
            _id: "m4a1_base",
            _tpl: "5447a9cd4bdc2dbd208b4567"
        });
        m4a1_vik.push({
            _id: "m4a1_stock_tube",
            _tpl: "5c793fb92e221644f31bfb64",
            parentId: "m4a1_base",
            slotId: "mod_stock"
        });
        m4a1_vik.push({
            _id: "m4a1_stock",
            _tpl: "5d135ecbd7ad1a21c176542e",
            parentId: "m4a1_stock_tube",
            slotId: "mod_stock_000"
        });
        m4a1_vik.push({
            _id: "m4a1_pistol_grip",
            _tpl: "59db3a1d86f77429e05b4e92",
            parentId: "m4a1_base",
            slotId: "mod_pistol_grip"
        });
        m4a1_vik.push({
            _id: "m4a1_charge",
            _tpl: "5b2240bf5acfc40dc528af69",
            parentId: "m4a1_base",
            slotId: "mod_charge"
        });
        m4a1_vik.push({
            _id: "m4a1_reciever",
            _tpl: "59bfe68886f7746004266202",
            parentId: "m4a1_base",
            slotId: "mod_reciever"
        });
        m4a1_vik.push({
            _id: "m4a1_scope",
            _tpl: "558022b54bdc2dac148b458d",
            parentId: "m4a1_reciever",
            slotId: "mod_scope"
        });
        m4a1_vik.push({
            _id: "m4a1_handguard",
            _tpl: "5ea16ada09aa976f2e7a51be",
            parentId: "m4a1_reciever",
            slotId: "mod_handguard"
        });
        m4a1_vik.push({
            _id: "m4a1_barrel",
            _tpl: "55d3632e4bdc2d972f8b4569",
            parentId: "m4a1_reciever",
            slotId: "mod_barrel"
        });
        m4a1_vik.push({
            _id: "m4a1_muzzle",
            _tpl: "626667e87379c44d557b7550",
            parentId: "m4a1_barrel",
            slotId: "mod_muzzle"
        });
        m4a1_vik.push({
            _id: "m4a1_muzzle_silencer",
            _tpl: "626673016f1edc06f30cf6d5",
            parentId: "m4a1_muzzle",
            slotId: "mod_muzzle"
        });
        m4a1_vik.push({
            _id: "m4a1_gas_block",
            _tpl: "5d00ec68d7ad1a04a067e5be",
            parentId: "m4a1_barrel",
            slotId: "mod_gas_block"
        });
        m4a1_vik.push({
            _id: "m4a1_rear",
            _tpl: "5c18b9192e2216398b5a8104",
            parentId: "m4a1_reciever",
            slotId: "mod_sight_rear"
        });
        m4a1_vik.push({
            _id: "m4a1_rail1",
            _tpl: "5b7be47f5acfc400170e2dd2",
            parentId: "m4a1_handguard",
            slotId: "mod_mount_000"
        });
        m4a1_vik.push({
            _id: "m4a1_rail2",
            _tpl: "5b7be47f5acfc400170e2dd2",
            parentId: "m4a1_handguard",
            slotId: "mod_mount_001"
        });
        m4a1_vik.push({
            _id: "m4a1_flashlight_1",
            _tpl: "626becf9582c3e319310b837",
            parentId: "m4a1_rail1",
            slotId: "mod_tactical"
        });
        m4a1_vik.push({
            _id: "m4a1_flashlight_2",
            _tpl: "626becf9582c3e319310b837",
            parentId: "m4a1_rail2",
            slotId: "mod_tactical"
        });
        m4a1_vik.push({
            _id: "m4a1_foregrip_rail",
            _tpl: "5b7be4895acfc400170e2dd5",
            parentId: "m4a1_handguard",
            slotId: "mod_foregrip"
        });
        m4a1_vik.push({
            _id: "m4a1_foregrip",
            _tpl: "5fce0cf655375d18a253eff0",
            parentId: "m4a1_foregrip_rail",
            slotId: "mod_foregrip"
        });
        return m4a1_vik;
    }
    createmdr() {
        const mdr_vik = [];
        mdr_vik.push({
            _id: "mdr_base",
            _tpl: "5c488a752e221602b412af63"
        });
        mdr_vik.push({
            _id: "mdr_pistol_grip",
            _tpl: "5dcbd6dddbd3d91b3e5468de",
            parentId: "mdr_base",
            slotId: "mod_pistol_grip"
        });
        mdr_vik.push({
            _id: "mdr_rear_sight",
            _tpl: "5c1780312e221602b66cc189",
            parentId: "mdr_base",
            slotId: "mod_sight_rear"
        });
        mdr_vik.push({
            _id: "mdr_scope",
            _tpl: "626bb8532c923541184624b4",
            parentId: "mdr_base",
            slotId: "mod_scope"
        });
        mdr_vik.push({
            _id: "mdr_barrel",
            _tpl: "5c48a2852e221602b21d5923",
            parentId: "mdr_base",
            slotId: "mod_barrel"
        });
        mdr_vik.push({
            _id: "mdr_muzzle",
            _tpl: "5cf6937cd7f00c056c53fb39",
            parentId: "mdr_barrel",
            slotId: "mod_muzzle"
        });
        mdr_vik.push({
            _id: "mdr_handguard",
            _tpl: "5dcbd6b46ec07c0c4347a564",
            parentId: "mdr_base",
            slotId: "mod_handguard"
        });
        mdr_vik.push({
            _id: "mdr_foregrip_rail",
            _tpl: "5b7be4895acfc400170e2dd5",
            parentId: "mdr_handguard",
            slotId: "mod_mount_000"
        });
        mdr_vik.push({
            _id: "mdr_foregrip",
            _tpl: "619386379fb0c665d5490dbe",
            parentId: "mdr_foregrip_rail",
            slotId: "mod_foregrip"
        });
        mdr_vik.push({
            _id: "mdr_flashlight_rail",
            _tpl: "5b7be47f5acfc400170e2dd2",
            parentId: "mdr_handguard",
            slotId: "mod_mount_001"
        });
        mdr_vik.push({
            _id: "mdr_flashlight",
            _tpl: "56def37dd2720bec348b456a",
            parentId: "mdr_flashlight_rail",
            slotId: "mod_tactical"
        });
        return mdr_vik;
    }
    createak545() {
        const ak_545 = [];
        ak_545.push({
            _id: "ak545_base",
            _tpl: "628b5638ad252a16da6dd245"
        });
        ak_545.push({
            _id: "ak545_gas_block",
            _tpl: "628b8d83717774443b15e248",
            parentId: "ak545_base",
            slotId: "mod_gas_block"
        });
        ak_545.push({
            _id: "ak545_handguard",
            _tpl: "628b916469015a4e1711ed8d",
            parentId: "ak545_gas_block",
            slotId: "mod_handguard"
        });
        ak_545.push({
            _id: "ak545_buffer",
            _tpl: "628b9a40717774443b15e9f2",
            parentId: "ak545_base",
            slotId: "mod_stock_000"
        });
        ak_545.push({
            _id: "ak545_stock",
            _tpl: "5c793fde2e221601da358614",
            parentId: "ak545_buffer",
            slotId: "mod_stock"
        });
        ak_545.push({
            _id: "ak545_rail",
            _tpl: "5b7be47f5acfc400170e2dd2",
            parentId: "ak545_handguard",
            slotId: "mod_mount_001"
        });
        ak_545.push({
            _id: "ak545_tactical",
            _tpl: "5d2369418abbc306c62e0c80",
            parentId: "ak545_rail",
            slotId: "mod_tactical"
        });
        ak_545.push({
            _id: "ak545_dust_cover",
            _tpl: "628b9be6cff66b70c002b14c",
            parentId: "ak545_handguard",
            slotId: "mod_reciever"
        });
        ak_545.push({
            _id: "ak545_rear_sight",
            _tpl: "628b9471078f94059a4b9bfb",
            parentId: "ak545_dust_cover",
            slotId: "mod_sight_rear"
        });
        ak_545.push({
            _id: "ak545_eotech",
            _tpl: "5c07dd120db834001c39092d",
            parentId: "ak545_dust_cover",
            slotId: "mod_scope"
        });
        ak_545.push({
            _id: "ak545_grip",
            _tpl: "5c6bf4aa2e2216001219b0ae",
            parentId: "ak545_base",
            slotId: "mod_pistol_grip"
        });
        ak_545.push({
            _id: "ak545_thread_mount",
            _tpl: "59bffc1f86f77435b128b872",
            parentId: "ak545_base",
            slotId: "mod_muzzle"
        });
        ak_545.push({
            _id: "ak545_suppressor",
            _tpl: "59bffbb386f77435b379b9c2",
            parentId: "ak545_thread_mount",
            slotId: "mod_muzzle"
        });
        return ak_545;
    }
    createAk105() {
        const ak105 = [];
        ak105.push({
            _id: "ak105_base",
            _tpl: "5ac66d9b5acfc4001633997a"
        });
        ak105.push({
            _id: "ak105_gas_block",
            _tpl: "59ccfdba86f7747f2109a587",
            parentId: "ak105_base",
            slotId: "mod_gas_block"
        });
        ak105.push({
            _id: "ak105_charge",
            _tpl: "5648ac824bdc2ded0b8b457d",
            parentId: "ak105_base",
            slotId: "mod_charge"
        });
        ak105.push({
            _id: "ak105_tactical",
            _tpl: "5c5952732e2216398b5abda2",
            parentId: "ak105_gas_block",
            slotId: "mod_tactical_000"
        });
        ak105.push({
            _id: "ak105_grip",
            _tpl: "6087e663132d4d12c81fd96b",
            parentId: "ak105_base",
            slotId: "mod_pistol_grip"
        });
        ak105.push({
            _id: "ak105_stock",
            _tpl: "6386300124a1dc425c00577a",
            parentId: "ak105_base",
            slotId: "mod_stock"
        });
        ak105.push({
            _id: "ak105_stock_cover",
            _tpl: "5a0c59791526d8dba737bba7",
            parentId: "ak105_stock",
            slotId: "mod_stock"
        });
        ak105.push({
            _id: "ak105_reciever",
            _tpl: "5d2c76ed48f03532f2136169",
            parentId: "ak105_base",
            slotId: "mod_reciever"
        });
        ak105.push({
            _id: "ak105_scope",
            _tpl: "584924ec24597768f12ae244",
            parentId: "ak105_reciever",
            slotId: "mod_scope"
        });
        ak105.push({
            _id: "ak105_suppressor",
            _tpl: "593d493f86f7745e6b2ceb22",
            parentId: "ak105_base",
            slotId: "mod_muzzle"
        });
        return ak105;
    }
    createAk74m() {
        const ak74m = [];
        ak74m.push({
            _id: "ak74m_base",
            _tpl: "5ac4cd105acfc40016339859"
        });
        ak74m.push({
            _id: "ak74m_gas_block",
            _tpl: "5b237e425acfc4771e1be0b6",
            parentId: "ak74m_base",
            slotId: "mod_gas_block"
        });
        ak74m.push({
            _id: "ak74m_stock",
            _tpl: "5ac50c185acfc400163398d4",
            parentId: "ak74m_base",
            slotId: "mod_stock"
        });
        ak74m.push({
            _id: "ak74m_charge",
            _tpl: "5648ac824bdc2ded0b8b457d",
            parentId: "ak74m_base",
            slotId: "mod_charge"
        });
        ak74m.push({
            _id: "ak74m_reciever",
            _tpl: "5d2c76ed48f03532f2136169",
            parentId: "ak74m_base",
            slotId: "mod_reciever"
        });
        ak74m.push({
            _id: "ak74m_grip",
            _tpl: "5649ade84bdc2d1b2b8b4587",
            parentId: "ak74m_base",
            slotId: "mod_pistol_grip"
        });
        ak74m.push({
            _id: "ak74m_muzzle",
            _tpl: "59bffc1f86f77435b128b872",
            parentId: "ak74m_base",
            slotId: "mod_muzzle"
        });
        ak74m.push({
            _id: "ak74m_supressor",
            _tpl: "59bffbb386f77435b379b9c2",
            parentId: "ak74m_muzzle",
            slotId: "mod_muzzle"
        });
        ak74m.push({
            _id: "ak74m_mount_one",
            _tpl: "5b4736a986f774040571e998",
            parentId: "ak74m_gas_block",
            slotId: "mod_mount_000"
        });
        ak74m.push({
            _id: "ak74m_mount_two",
            _tpl: "5b4736a986f774040571e998",
            parentId: "ak74m_gas_block",
            slotId: "mod_mount_001"
        });
        ak74m.push({
            _id: "ak74m_flashlight",
            _tpl: "5a7b483fe899ef0016170d15",
            parentId: "ak74m_mount_one",
            slotId: "mod_tactical"
        });
        ak74m.push({
            _id: "ak74m_laser",
            _tpl: "5cc9c20cd7f00c001336c65d",
            parentId: "ak74m_mount_two",
            slotId: "mod_tactical"
        });
        ak74m.push({
            _id: "ak74m_ring_mount",
            _tpl: "5b3b99265acfc4704b4a1afb",
            parentId: "ak74m_reciever",
            slotId: "mod_scope"
        });
        ak74m.push({
            _id: "ak74m_vudu",
            _tpl: "5b3b99475acfc432ff4dcbee",
            parentId: "ak74m_ring_mount",
            slotId: "mod_scope"
        });
        return ak74m;
    }
}
exports.WeaponCreateHelper = WeaponCreateHelper;
