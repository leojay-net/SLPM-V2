module.exports = [
"[project]/.next-internal/server/app/api/fixedfloat/route/actions.js [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__, module, exports) => {

}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[project]/src/app/api/fixedfloat/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * FixedFloat API Proxy Route
 * 
 * This proxies requests to FixedFloat API to:
 * 1. Keep API credentials secure (not exposed to browser)
 * 2. Handle CORS issues
 */ __turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/crypto [external] (crypto, cjs)");
;
;
const FIXEDFLOAT_API = 'https://ff.io/api/v2';
const API_KEY = process.env.FIXEDFLOAT_API_KEY || '';
const API_SECRET = process.env.FIXEDFLOAT_API_SECRET || '';
function createSignature(body) {
    return __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].createHmac('sha256', API_SECRET).update(body).digest('hex');
}
async function POST(request) {
    try {
        const { endpoint, data } = await request.json();
        if (!endpoint || typeof endpoint !== 'string') {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: 'Missing endpoint'
            }, {
                status: 400
            });
        }
        // Validate endpoint to prevent abuse
        const allowedEndpoints = [
            '/price',
            '/create',
            '/order',
            '/orders',
            '/ccies'
        ];
        if (!allowedEndpoints.includes(endpoint)) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: 'Invalid endpoint'
            }, {
                status: 400
            });
        }
        if (!API_KEY || !API_SECRET) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: 'FixedFloat API not configured'
            }, {
                status: 500
            });
        }
        const body = JSON.stringify(data || {});
        const signature = createSignature(body);
        console.log(`[FixedFloat Proxy] ${endpoint}`, data);
        // Debug: Log full request for /create with BTCLN
        if (endpoint === '/create' && data?.toCcy === 'BTCLN') {
            console.log(`[FixedFloat Debug] BTCLN Create Request:`);
            console.log(`  - fromCcy: ${data.fromCcy}`);
            console.log(`  - toCcy: ${data.toCcy}`);
            console.log(`  - amount: ${data.amount}`);
            console.log(`  - direction: ${data.direction}`);
            console.log(`  - toAddress (invoice): ${data.toAddress?.substring(0, 80)}...`);
            console.log(`  - toAddress length: ${data.toAddress?.length}`);
        }
        const response = await fetch(`${FIXEDFLOAT_API}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-KEY': API_KEY,
                'X-API-SIGN': signature
            },
            body
        });
        const result = await response.json();
        // Log full response for debugging
        if (result.code !== 0) {
            console.log(`[FixedFloat Response] ${endpoint} FAILED:`, JSON.stringify(result, null, 2));
        } else {
            console.log(`[FixedFloat Response] ${endpoint}: SUCCESS`);
            if (endpoint === '/price') {
                console.log(`  → Output: ${result.data?.to?.amount} ${result.data?.to?.code}`);
                console.log(`  → Min: ${result.data?.from?.min}, Max: ${result.data?.from?.max}`);
            }
            if (endpoint === '/create') {
                console.log(`  → Order ID: ${result.data?.id}`);
                console.log(`  → Deposit: ${result.data?.from?.amount} ${result.data?.from?.code} to ${result.data?.from?.address}`);
            }
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            ...result
        });
    } catch (error) {
        console.error('[FixedFloat Proxy Error]', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: error instanceof Error ? error.message : 'FixedFloat API error'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__45ea6819._.js.map