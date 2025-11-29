module.exports = [
"[project]/src/storage/tokenVault.server.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Server-only token vault for persisting Cashu tokens by quoteId
// Storage backend: JSON file under .data/cashu-tokens.json
__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
;
;
const DATA_DIR = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), '.data');
const VAULT_FILE = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(DATA_DIR, 'cashu-tokens.json');
async function ensureDir() {
    try {
        await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].mkdir(DATA_DIR, {
            recursive: true
        });
    } catch (_) {
    // ignore
    }
}
async function loadFile() {
    await ensureDir();
    try {
        const raw = await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].readFile(VAULT_FILE, 'utf8');
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object' && parsed.records) {
            return {
                version: parsed.version || 1,
                records: parsed.records
            };
        }
    } catch (_) {}
    return {
        version: 1,
        records: {}
    };
}
async function saveFile(data) {
    const content = JSON.stringify(data, null, 2);
    await __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["promises"].writeFile(VAULT_FILE, content, 'utf8');
}
const TokenVault = {
    async get (quote) {
        const data = await loadFile();
        return data.records[quote] || null;
    },
    async set (record) {
        const data = await loadFile();
        data.records[record.quote] = record;
        await saveFile(data);
    },
    async has (quote) {
        const rec = await this.get(quote);
        return !!rec;
    },
    async list (limit = 100) {
        const data = await loadFile();
        const all = Object.values(data.records);
        all.sort((a, b)=>b.createdAt - a.createdAt);
        return all.slice(0, limit);
    }
};
const __TURBOPACK__default__export__ = TokenVault;
}),
];

//# sourceMappingURL=src_storage_tokenVault_server_ts_563da3b1._.js.map