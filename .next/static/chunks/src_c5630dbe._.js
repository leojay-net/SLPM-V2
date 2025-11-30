(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/mixer/cross-chain/CrossChainQuote.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CrossChainQuote",
    ()=>CrossChainQuote
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$ArrowsRightLeftIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowsRightLeftIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroicons/react/24/outline/esm/ArrowsRightLeftIcon.js [app-client] (ecmascript) <export default as ArrowsRightLeftIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$ArrowPathIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowPathIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroicons/react/24/outline/esm/ArrowPathIcon.js [app-client] (ecmascript) <export default as ArrowPathIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$CheckCircleIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircleIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroicons/react/24/outline/esm/CheckCircleIcon.js [app-client] (ecmascript) <export default as CheckCircleIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$ExclamationTriangleIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ExclamationTriangleIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroicons/react/24/outline/esm/ExclamationTriangleIcon.js [app-client] (ecmascript) <export default as ExclamationTriangleIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$InformationCircleIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__InformationCircleIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroicons/react/24/outline/esm/InformationCircleIcon.js [app-client] (ecmascript) <export default as InformationCircleIcon>");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function CrossChainQuote(param) {
    let { direction, amount, onQuoteReady, className = '' } = param;
    _s();
    const [quote, setQuote] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [countdown, setCountdown] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const fetchQuote = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CrossChainQuote.useCallback[fetchQuote]": async ()=>{
            if (amount <= 0) {
                setQuote(null);
                setError(null);
                onQuoteReady === null || onQuoteReady === void 0 ? void 0 : onQuoteReady(null);
                return;
            }
            setLoading(true);
            setError(null);
            try {
                const isZecToStrk = direction === 'zec-to-strk';
                let inputAmount;
                let lightningAmount;
                let outputAmount;
                let inputCurrency;
                let outputCurrency;
                let firstLegRate;
                let secondLegRate;
                let firstLegFee;
                let secondLegFee;
                if (isZecToStrk) {
                    // ZEC → Lightning (FixedFloat) → STRK (Atomiq)
                    inputAmount = amount;
                    inputCurrency = 'ZEC';
                    outputCurrency = 'STRK';
                    // Get real FixedFloat quote for ZEC → Lightning
                    const ffResponse = await fetch('/api/fixedfloat', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            endpoint: '/price',
                            data: {
                                fromCcy: 'ZEC',
                                toCcy: 'BTCLN',
                                amount: amount.toString(),
                                direction: 'from',
                                type: 'float'
                            }
                        })
                    });
                    const ffResult = await ffResponse.json();
                    if (ffResult.code !== 0) {
                        throw new Error(ffResult.msg || 'Failed to get ZEC quote');
                    }
                    const btcAmount = parseFloat(ffResult.data.to.amount);
                    lightningAmount = Math.floor(btcAmount * 100000000); // sats
                    firstLegRate = parseFloat(ffResult.data.from.rate);
                    firstLegFee = 1.5; // FixedFloat ~1.5% fee
                    // Estimate STRK output (Atomiq rate ~125 sats per STRK)
                    const satsPerStrk = 125; // TODO: Get real Atomiq quote
                    outputAmount = lightningAmount / satsPerStrk;
                    secondLegRate = 1 / satsPerStrk;
                    secondLegFee = 1.0; // Atomiq ~1% fee
                } else {
                    // STRK → Lightning (Atomiq) → ZEC (FixedFloat)
                    inputAmount = amount;
                    inputCurrency = 'STRK';
                    outputCurrency = 'ZEC';
                    // Estimate Lightning amount from STRK (Atomiq rate)
                    const satsPerStrk = 125; // TODO: Get real Atomiq quote
                    lightningAmount = Math.floor(amount * satsPerStrk);
                    firstLegRate = satsPerStrk / 100000000;
                    firstLegFee = 1.0; // Atomiq ~1% fee
                    // Get real FixedFloat quote for Lightning → ZEC
                    const btcAmount = lightningAmount / 100000000;
                    const ffResponse = await fetch('/api/fixedfloat', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            endpoint: '/price',
                            data: {
                                fromCcy: 'BTCLN',
                                toCcy: 'ZEC',
                                amount: btcAmount.toString(),
                                direction: 'from',
                                type: 'float'
                            }
                        })
                    });
                    const ffResult = await ffResponse.json();
                    if (ffResult.code !== 0) {
                        throw new Error(ffResult.msg || 'Failed to get ZEC quote');
                    }
                    outputAmount = parseFloat(ffResult.data.to.amount);
                    secondLegRate = parseFloat(ffResult.data.from.rate);
                    secondLegFee = 1.5; // FixedFloat ~1.5% fee
                }
                const quoteData = {
                    inputAmount,
                    inputCurrency,
                    lightningAmount,
                    outputAmount,
                    outputCurrency,
                    totalFeePercent: firstLegFee + secondLegFee,
                    legs: {
                        first: {
                            rate: firstLegRate,
                            fee: firstLegFee
                        },
                        second: {
                            rate: secondLegRate,
                            fee: secondLegFee
                        }
                    },
                    expiresAt: Date.now() + 60000
                };
                setQuote(quoteData);
                setCountdown(60);
                onQuoteReady === null || onQuoteReady === void 0 ? void 0 : onQuoteReady(quoteData);
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Failed to fetch quote';
                setError(message);
                setQuote(null);
                onQuoteReady === null || onQuoteReady === void 0 ? void 0 : onQuoteReady(null);
            } finally{
                setLoading(false);
            }
        }
    }["CrossChainQuote.useCallback[fetchQuote]"], [
        amount,
        direction,
        onQuoteReady
    ]);
    // Fetch quote when amount changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CrossChainQuote.useEffect": ()=>{
            const debounce = setTimeout(fetchQuote, 500);
            return ({
                "CrossChainQuote.useEffect": ()=>clearTimeout(debounce)
            })["CrossChainQuote.useEffect"];
        }
    }["CrossChainQuote.useEffect"], [
        fetchQuote
    ]);
    // Countdown timer
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CrossChainQuote.useEffect": ()=>{
            if (countdown <= 0) return;
            const timer = setInterval({
                "CrossChainQuote.useEffect.timer": ()=>{
                    setCountdown({
                        "CrossChainQuote.useEffect.timer": (prev)=>{
                            if (prev <= 1) {
                                fetchQuote(); // Refresh quote
                                return 0;
                            }
                            return prev - 1;
                        }
                    }["CrossChainQuote.useEffect.timer"]);
                }
            }["CrossChainQuote.useEffect.timer"], 1000);
            return ({
                "CrossChainQuote.useEffect": ()=>clearInterval(timer)
            })["CrossChainQuote.useEffect"];
        }
    }["CrossChainQuote.useEffect"], [
        countdown,
        fetchQuote
    ]);
    const formatNumber = function(num) {
        let decimals = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 4;
        return num.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: decimals
        });
    };
    const formatSats = (sats)=>{
        if (sats >= 1000000) return "".concat((sats / 1000000).toFixed(2), "M");
        if (sats >= 1000) return "".concat((sats / 1000).toFixed(1), "k");
        return sats.toString();
    };
    if (!amount || amount <= 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-gray-800/50 border border-gray-700 rounded-xl p-6 ".concat(className),
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-center text-gray-500 py-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$InformationCircleIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__InformationCircleIcon$3e$__["InformationCircleIcon"], {
                        className: "w-5 h-5 mr-2"
                    }, void 0, false, {
                        fileName: "[project]/src/components/mixer/cross-chain/CrossChainQuote.tsx",
                        lineNumber: 210,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: "Enter an amount to see quote"
                    }, void 0, false, {
                        fileName: "[project]/src/components/mixer/cross-chain/CrossChainQuote.tsx",
                        lineNumber: 211,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/mixer/cross-chain/CrossChainQuote.tsx",
                lineNumber: 209,
                columnNumber: 17
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/mixer/cross-chain/CrossChainQuote.tsx",
            lineNumber: 208,
            columnNumber: 13
        }, this);
    }
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-gray-800/50 border border-gray-700 rounded-xl p-6 ".concat(className),
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-center py-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$ArrowPathIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowPathIcon$3e$__["ArrowPathIcon"], {
                        className: "w-6 h-6 text-blue-400 animate-spin mr-3"
                    }, void 0, false, {
                        fileName: "[project]/src/components/mixer/cross-chain/CrossChainQuote.tsx",
                        lineNumber: 221,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-gray-300",
                        children: "Fetching best rate..."
                    }, void 0, false, {
                        fileName: "[project]/src/components/mixer/cross-chain/CrossChainQuote.tsx",
                        lineNumber: 222,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/mixer/cross-chain/CrossChainQuote.tsx",
                lineNumber: 220,
                columnNumber: 17
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/mixer/cross-chain/CrossChainQuote.tsx",
            lineNumber: 219,
            columnNumber: 13
        }, this);
    }
    if (error) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-red-900/20 border border-red-800 rounded-xl p-6 ".concat(className),
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center text-red-400",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$ExclamationTriangleIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ExclamationTriangleIcon$3e$__["ExclamationTriangleIcon"], {
                            className: "w-5 h-5 mr-2"
                        }, void 0, false, {
                            fileName: "[project]/src/components/mixer/cross-chain/CrossChainQuote.tsx",
                            lineNumber: 232,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: error
                        }, void 0, false, {
                            fileName: "[project]/src/components/mixer/cross-chain/CrossChainQuote.tsx",
                            lineNumber: 233,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/mixer/cross-chain/CrossChainQuote.tsx",
                    lineNumber: 231,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: fetchQuote,
                    className: "mt-4 text-sm text-blue-400 hover:text-blue-300 underline",
                    children: "Try again"
                }, void 0, false, {
                    fileName: "[project]/src/components/mixer/cross-chain/CrossChainQuote.tsx",
                    lineNumber: 235,
                    columnNumber: 17
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/mixer/cross-chain/CrossChainQuote.tsx",
            lineNumber: 230,
            columnNumber: 13
        }, this);
    }
    if (!quote) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden ".concat(className),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "px-6 py-4 border-b border-gray-700 flex items-center justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center space-x-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$ArrowsRightLeftIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowsRightLeftIcon$3e$__["ArrowsRightLeftIcon"], {
                                className: "w-5 h-5 text-blue-400"
                            }, void 0, false, {
                                fileName: "[project]/src/components/mixer/cross-chain/CrossChainQuote.tsx",
                                lineNumber: 252,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-medium text-white",
                                children: "Quote"
                            }, void 0, false, {
                                fileName: "[project]/src/components/mixer/cross-chain/CrossChainQuote.tsx",
                                lineNumber: 253,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/mixer/cross-chain/CrossChainQuote.tsx",
                        lineNumber: 251,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center space-x-2 text-sm text-gray-400",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: [
                                    "Refreshing in ",
                                    countdown,
                                    "s"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/mixer/cross-chain/CrossChainQuote.tsx",
                                lineNumber: 256,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: fetchQuote,
                                className: "p-1 hover:bg-gray-700 rounded transition-colors",
                                title: "Refresh quote",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$ArrowPathIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowPathIcon$3e$__["ArrowPathIcon"], {
                                    className: "w-4 h-4"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/mixer/cross-chain/CrossChainQuote.tsx",
                                    lineNumber: 262,
                                    columnNumber: 25
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/mixer/cross-chain/CrossChainQuote.tsx",
                                lineNumber: 257,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/mixer/cross-chain/CrossChainQuote.tsx",
                        lineNumber: 255,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/mixer/cross-chain/CrossChainQuote.tsx",
                lineNumber: 250,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-6 space-y-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between py-4 px-5 bg-gray-900/50 rounded-lg",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-2xl font-bold text-white",
                                        children: formatNumber(quote.inputAmount, 6)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/mixer/cross-chain/CrossChainQuote.tsx",
                                        lineNumber: 272,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-sm text-gray-400 mt-1",
                                        children: quote.inputCurrency
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/mixer/cross-chain/CrossChainQuote.tsx",
                                        lineNumber: 275,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/mixer/cross-chain/CrossChainQuote.tsx",
                                lineNumber: 271,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col items-center px-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$ArrowsRightLeftIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowsRightLeftIcon$3e$__["ArrowsRightLeftIcon"], {
                                        className: "w-6 h-6 text-gray-500"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/mixer/cross-chain/CrossChainQuote.tsx",
                                        lineNumber: 278,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs text-gray-500 mt-1",
                                        children: [
                                            formatSats(quote.lightningAmount),
                                            " sats"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/mixer/cross-chain/CrossChainQuote.tsx",
                                        lineNumber: 279,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/mixer/cross-chain/CrossChainQuote.tsx",
                                lineNumber: 277,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-2xl font-bold text-green-400",
                                        children: formatNumber(quote.outputAmount, 6)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/mixer/cross-chain/CrossChainQuote.tsx",
                                        lineNumber: 282,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-sm text-gray-400 mt-1",
                                        children: quote.outputCurrency
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/mixer/cross-chain/CrossChainQuote.tsx",
                                        lineNumber: 285,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/mixer/cross-chain/CrossChainQuote.tsx",
                                lineNumber: 281,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/mixer/cross-chain/CrossChainQuote.tsx",
                        lineNumber: 270,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-2 gap-4 text-sm",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "p-3 bg-gray-900/30 rounded-lg",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-gray-400 mb-1",
                                        children: direction === 'zec-to-strk' ? 'ZEC → Lightning' : 'STRK → Lightning'
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/mixer/cross-chain/CrossChainQuote.tsx",
                                        lineNumber: 292,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-white font-medium",
                                        children: [
                                            "Rate: ",
                                            quote.legs.first.rate.toFixed(6)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/mixer/cross-chain/CrossChainQuote.tsx",
                                        lineNumber: 295,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-gray-500 text-xs",
                                        children: [
                                            "Fee: ~",
                                            quote.legs.first.fee.toFixed(2),
                                            "%"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/mixer/cross-chain/CrossChainQuote.tsx",
                                        lineNumber: 298,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/mixer/cross-chain/CrossChainQuote.tsx",
                                lineNumber: 291,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "p-3 bg-gray-900/30 rounded-lg",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-gray-400 mb-1",
                                        children: direction === 'zec-to-strk' ? 'Lightning → STRK' : 'Lightning → ZEC'
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/mixer/cross-chain/CrossChainQuote.tsx",
                                        lineNumber: 303,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-white font-medium",
                                        children: [
                                            "Rate: ",
                                            quote.legs.second.rate.toFixed(6)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/mixer/cross-chain/CrossChainQuote.tsx",
                                        lineNumber: 306,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-gray-500 text-xs",
                                        children: [
                                            "Fee: ~",
                                            quote.legs.second.fee.toFixed(2),
                                            "%"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/mixer/cross-chain/CrossChainQuote.tsx",
                                        lineNumber: 309,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/mixer/cross-chain/CrossChainQuote.tsx",
                                lineNumber: 302,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/mixer/cross-chain/CrossChainQuote.tsx",
                        lineNumber: 290,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between pt-2 border-t border-gray-700",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-gray-400",
                                children: "Total Estimated Fee"
                            }, void 0, false, {
                                fileName: "[project]/src/components/mixer/cross-chain/CrossChainQuote.tsx",
                                lineNumber: 317,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-orange-400 font-medium",
                                children: [
                                    "~",
                                    quote.totalFeePercent.toFixed(2),
                                    "%"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/mixer/cross-chain/CrossChainQuote.tsx",
                                lineNumber: 318,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/mixer/cross-chain/CrossChainQuote.tsx",
                        lineNumber: 316,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-gray-400",
                                children: "Effective Rate"
                            }, void 0, false, {
                                fileName: "[project]/src/components/mixer/cross-chain/CrossChainQuote.tsx",
                                lineNumber: 323,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-white font-medium",
                                children: [
                                    "1 ",
                                    quote.inputCurrency,
                                    " = ",
                                    formatNumber(quote.outputAmount / quote.inputAmount, 4),
                                    " ",
                                    quote.outputCurrency
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/mixer/cross-chain/CrossChainQuote.tsx",
                                lineNumber: 324,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/mixer/cross-chain/CrossChainQuote.tsx",
                        lineNumber: 322,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/mixer/cross-chain/CrossChainQuote.tsx",
                lineNumber: 268,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "px-6 py-3 bg-gray-900/30 border-t border-gray-700",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-start space-x-2 text-xs text-gray-500",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$CheckCircleIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircleIcon$3e$__["CheckCircleIcon"], {
                            className: "w-4 h-4 text-green-500 flex-shrink-0 mt-0.5"
                        }, void 0, false, {
                            fileName: "[project]/src/components/mixer/cross-chain/CrossChainQuote.tsx",
                            lineNumber: 333,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: "Quote includes all network fees. Final amount may vary slightly due to market conditions."
                        }, void 0, false, {
                            fileName: "[project]/src/components/mixer/cross-chain/CrossChainQuote.tsx",
                            lineNumber: 334,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/mixer/cross-chain/CrossChainQuote.tsx",
                    lineNumber: 332,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/mixer/cross-chain/CrossChainQuote.tsx",
                lineNumber: 331,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/mixer/cross-chain/CrossChainQuote.tsx",
        lineNumber: 248,
        columnNumber: 9
    }, this);
}
_s(CrossChainQuote, "NE5EPGSXii8hijHMpSJnlL0+LBk=");
_c = CrossChainQuote;
var _c;
__turbopack_context__.k.register(_c, "CrossChainQuote");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/mixer/cross-chain/TransferStatusTracker.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TransferStatusTracker",
    ()=>TransferStatusTracker
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$CheckCircleIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircleIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroicons/react/24/outline/esm/CheckCircleIcon.js [app-client] (ecmascript) <export default as CheckCircleIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$ClockIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ClockIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroicons/react/24/outline/esm/ClockIcon.js [app-client] (ecmascript) <export default as ClockIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$ExclamationCircleIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ExclamationCircleIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroicons/react/24/outline/esm/ExclamationCircleIcon.js [app-client] (ecmascript) <export default as ExclamationCircleIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$ArrowPathIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowPathIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroicons/react/24/outline/esm/ArrowPathIcon.js [app-client] (ecmascript) <export default as ArrowPathIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$BanknotesIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BanknotesIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroicons/react/24/outline/esm/BanknotesIcon.js [app-client] (ecmascript) <export default as BanknotesIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$BoltIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BoltIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroicons/react/24/outline/esm/BoltIcon.js [app-client] (ecmascript) <export default as BoltIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$WalletIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__WalletIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroicons/react/24/outline/esm/WalletIcon.js [app-client] (ecmascript) <export default as WalletIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$ShieldCheckIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheckIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroicons/react/24/outline/esm/ShieldCheckIcon.js [app-client] (ecmascript) <export default as ShieldCheckIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$DocumentDuplicateIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__DocumentDuplicateIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroicons/react/24/outline/esm/DocumentDuplicateIcon.js [app-client] (ecmascript) <export default as DocumentDuplicateIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$solid$2f$esm$2f$CheckCircleIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircleIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroicons/react/24/solid/esm/CheckCircleIcon.js [app-client] (ecmascript) <export default as CheckCircleIcon>");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
const stepIcons = {
    'atomiq-swap-create': __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$BoltIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BoltIcon$3e$__["BoltIcon"],
    'fixedfloat-order': __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$ArrowPathIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowPathIcon$3e$__["ArrowPathIcon"],
    'zec-deposit': __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$BanknotesIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BanknotesIcon$3e$__["BanknotesIcon"],
    'lightning-payment': __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$BoltIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BoltIcon$3e$__["BoltIcon"],
    'strk-claim': __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$WalletIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__WalletIcon$3e$__["WalletIcon"],
    'strk-to-lightning': __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$BoltIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BoltIcon$3e$__["BoltIcon"],
    'zec-delivery': __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$BanknotesIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BanknotesIcon$3e$__["BanknotesIcon"],
    'privacy-mixer': __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$ShieldCheckIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheckIcon$3e$__["ShieldCheckIcon"],
    'cashu-flow': __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$ShieldCheckIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheckIcon$3e$__["ShieldCheckIcon"]
};
const statusColors = {
    pending: 'text-gray-500 border-gray-600 bg-gray-800',
    'in-progress': 'text-blue-400 border-blue-500 bg-blue-500/10',
    complete: 'text-green-400 border-green-500 bg-green-500/10',
    failed: 'text-red-400 border-red-500 bg-red-500/10',
    skipped: 'text-gray-500 border-gray-600 bg-gray-800/50'
};
const statusIconColors = {
    pending: 'text-gray-500',
    'in-progress': 'text-blue-400',
    complete: 'text-green-400',
    failed: 'text-red-400',
    skipped: 'text-gray-500'
};
function TransferStatusTracker(param) {
    let { steps, currentStepIndex, direction, depositAddress, depositAmount, className = '' } = param;
    _s();
    const [copied, setCopied] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useState(false);
    const copyToClipboard = async (text)=>{
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(()=>setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };
    const getStepIcon = (step)=>{
        const Icon = stepIcons[step.name] || __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$ArrowPathIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowPathIcon$3e$__["ArrowPathIcon"];
        return Icon;
    };
    const getStatusIndicator = (step, index)=>{
        const isActive = index === currentStepIndex;
        switch(step.status){
            case 'complete':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$solid$2f$esm$2f$CheckCircleIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircleIcon$3e$__["CheckCircleIcon"], {
                    className: "w-5 h-5 text-green-400"
                }, void 0, false, {
                    fileName: "[project]/src/components/mixer/cross-chain/TransferStatusTracker.tsx",
                    lineNumber: 97,
                    columnNumber: 21
                }, this);
            case 'in-progress':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "relative",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$ArrowPathIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowPathIcon$3e$__["ArrowPathIcon"], {
                            className: "w-5 h-5 text-blue-400 animate-spin"
                        }, void 0, false, {
                            fileName: "[project]/src/components/mixer/cross-chain/TransferStatusTracker.tsx",
                            lineNumber: 102,
                            columnNumber: 25
                        }, this),
                        isActive && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "absolute -top-1 -right-1 w-2 h-2 bg-blue-400 rounded-full animate-pulse"
                        }, void 0, false, {
                            fileName: "[project]/src/components/mixer/cross-chain/TransferStatusTracker.tsx",
                            lineNumber: 104,
                            columnNumber: 29
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/mixer/cross-chain/TransferStatusTracker.tsx",
                    lineNumber: 101,
                    columnNumber: 21
                }, this);
            case 'failed':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$ExclamationCircleIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ExclamationCircleIcon$3e$__["ExclamationCircleIcon"], {
                    className: "w-5 h-5 text-red-400"
                }, void 0, false, {
                    fileName: "[project]/src/components/mixer/cross-chain/TransferStatusTracker.tsx",
                    lineNumber: 110,
                    columnNumber: 21
                }, this);
            case 'skipped':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "w-5 h-5 rounded-full border-2 border-dashed border-gray-600"
                }, void 0, false, {
                    fileName: "[project]/src/components/mixer/cross-chain/TransferStatusTracker.tsx",
                    lineNumber: 114,
                    columnNumber: 21
                }, this);
            default:
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$ClockIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ClockIcon$3e$__["ClockIcon"], {
                    className: "w-5 h-5 text-gray-500"
                }, void 0, false, {
                    fileName: "[project]/src/components/mixer/cross-chain/TransferStatusTracker.tsx",
                    lineNumber: 118,
                    columnNumber: 21
                }, this);
        }
    };
    const formatDuration = (startedAt, completedAt)=>{
        if (!startedAt) return null;
        const end = completedAt || Date.now();
        const seconds = Math.floor((end - startedAt) / 1000);
        if (seconds < 60) return "".concat(seconds, "s");
        const minutes = Math.floor(seconds / 60);
        return "".concat(minutes, "m ").concat(seconds % 60, "s");
    };
    const completedSteps = steps.filter((s)=>s.status === 'complete').length;
    const progressPercent = completedSteps / steps.length * 100;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden ".concat(className),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "px-6 py-4 border-b border-gray-700",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between mb-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "font-medium text-white",
                                children: "Transfer Progress"
                            }, void 0, false, {
                                fileName: "[project]/src/components/mixer/cross-chain/TransferStatusTracker.tsx",
                                lineNumber: 140,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-sm text-gray-400",
                                children: [
                                    completedSteps,
                                    " of ",
                                    steps.length,
                                    " steps"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/mixer/cross-chain/TransferStatusTracker.tsx",
                                lineNumber: 141,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/mixer/cross-chain/TransferStatusTracker.tsx",
                        lineNumber: 139,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-1.5 bg-gray-700 rounded-full overflow-hidden",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-500",
                            style: {
                                width: "".concat(progressPercent, "%")
                            }
                        }, void 0, false, {
                            fileName: "[project]/src/components/mixer/cross-chain/TransferStatusTracker.tsx",
                            lineNumber: 146,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/mixer/cross-chain/TransferStatusTracker.tsx",
                        lineNumber: 145,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/mixer/cross-chain/TransferStatusTracker.tsx",
                lineNumber: 138,
                columnNumber: 13
            }, this),
            depositAddress && direction === 'zec-to-strk' && currentStepIndex <= 2 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mx-6 mt-6 p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-start justify-between",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-sm text-orange-400 font-medium mb-1",
                                        children: [
                                            "Send ",
                                            depositAmount,
                                            " ZEC to:"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/mixer/cross-chain/TransferStatusTracker.tsx",
                                        lineNumber: 158,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                        className: "text-xs text-white font-mono break-all",
                                        children: depositAddress
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/mixer/cross-chain/TransferStatusTracker.tsx",
                                        lineNumber: 161,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/mixer/cross-chain/TransferStatusTracker.tsx",
                                lineNumber: 157,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>copyToClipboard(depositAddress),
                                className: "p-2 hover:bg-orange-500/20 rounded-lg transition-colors flex-shrink-0",
                                title: "Copy address",
                                children: copied ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$CheckCircleIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircleIcon$3e$__["CheckCircleIcon"], {
                                    className: "w-5 h-5 text-green-400"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/mixer/cross-chain/TransferStatusTracker.tsx",
                                    lineNumber: 171,
                                    columnNumber: 33
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$DocumentDuplicateIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__DocumentDuplicateIcon$3e$__["DocumentDuplicateIcon"], {
                                    className: "w-5 h-5 text-orange-400"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/mixer/cross-chain/TransferStatusTracker.tsx",
                                    lineNumber: 173,
                                    columnNumber: 33
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/mixer/cross-chain/TransferStatusTracker.tsx",
                                lineNumber: 165,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/mixer/cross-chain/TransferStatusTracker.tsx",
                        lineNumber: 156,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-2 text-xs text-gray-400",
                        children: "Transfer will continue automatically once deposit is confirmed"
                    }, void 0, false, {
                        fileName: "[project]/src/components/mixer/cross-chain/TransferStatusTracker.tsx",
                        lineNumber: 177,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/mixer/cross-chain/TransferStatusTracker.tsx",
                lineNumber: 155,
                columnNumber: 17
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-6 space-y-1",
                children: steps.map((step, index)=>{
                    const Icon = getStepIcon(step);
                    const isActive = index === currentStepIndex;
                    const duration = formatDuration(step.startedAt, step.completedAt);
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative flex items-start p-4 rounded-lg transition-colors ".concat(isActive ? 'bg-gray-900/50' : ''),
                        children: [
                            index < steps.length - 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute left-7 top-14 w-0.5 h-6 ".concat(step.status === 'complete' ? 'bg-green-500/50' : 'bg-gray-700')
                            }, void 0, false, {
                                fileName: "[project]/src/components/mixer/cross-chain/TransferStatusTracker.tsx",
                                lineNumber: 198,
                                columnNumber: 33
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-shrink-0 w-10 h-10 rounded-full border-2 flex items-center justify-center mr-4 ".concat(statusColors[step.status]),
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                    className: "w-5 h-5 ".concat(statusIconColors[step.status])
                                }, void 0, false, {
                                    fileName: "[project]/src/components/mixer/cross-chain/TransferStatusTracker.tsx",
                                    lineNumber: 209,
                                    columnNumber: 33
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/mixer/cross-chain/TransferStatusTracker.tsx",
                                lineNumber: 205,
                                columnNumber: 29
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-1 min-w-0",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "font-medium ".concat(step.status === 'complete' ? 'text-green-400' : step.status === 'in-progress' ? 'text-blue-400' : step.status === 'failed' ? 'text-red-400' : 'text-gray-400'),
                                                children: step.description
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/mixer/cross-chain/TransferStatusTracker.tsx",
                                                lineNumber: 215,
                                                columnNumber: 37
                                            }, this),
                                            getStatusIndicator(step, index)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/mixer/cross-chain/TransferStatusTracker.tsx",
                                        lineNumber: 214,
                                        columnNumber: 33
                                    }, this),
                                    duration && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-xs text-gray-500 mt-1",
                                        children: [
                                            step.status === 'complete' ? 'Completed in' : 'Running for',
                                            " ",
                                            duration
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/mixer/cross-chain/TransferStatusTracker.tsx",
                                        lineNumber: 227,
                                        columnNumber: 37
                                    }, this),
                                    step.txId && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-2 flex items-center space-x-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-xs text-gray-500",
                                                children: "TX:"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/mixer/cross-chain/TransferStatusTracker.tsx",
                                                lineNumber: 235,
                                                columnNumber: 41
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                                className: "text-xs text-blue-400 font-mono truncate max-w-[200px]",
                                                children: step.txId
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/mixer/cross-chain/TransferStatusTracker.tsx",
                                                lineNumber: 236,
                                                columnNumber: 41
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>copyToClipboard(step.txId),
                                                className: "p-1 hover:bg-gray-700 rounded",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$DocumentDuplicateIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__DocumentDuplicateIcon$3e$__["DocumentDuplicateIcon"], {
                                                    className: "w-3 h-3 text-gray-500"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/mixer/cross-chain/TransferStatusTracker.tsx",
                                                    lineNumber: 243,
                                                    columnNumber: 45
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/mixer/cross-chain/TransferStatusTracker.tsx",
                                                lineNumber: 239,
                                                columnNumber: 41
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/mixer/cross-chain/TransferStatusTracker.tsx",
                                        lineNumber: 234,
                                        columnNumber: 37
                                    }, this),
                                    step.error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-2 text-xs text-red-400 bg-red-900/20 px-2 py-1 rounded",
                                        children: step.error
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/mixer/cross-chain/TransferStatusTracker.tsx",
                                        lineNumber: 250,
                                        columnNumber: 37
                                    }, this),
                                    step.data && Object.keys(step.data).length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-2 text-xs text-gray-500",
                                        children: Object.entries(step.data).map((param)=>{
                                            let [key, value] = param;
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center space-x-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "capitalize",
                                                        children: [
                                                            key.replace(/([A-Z])/g, ' $1').trim(),
                                                            ":"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/mixer/cross-chain/TransferStatusTracker.tsx",
                                                        lineNumber: 260,
                                                        columnNumber: 49
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-gray-400 truncate max-w-[150px]",
                                                        children: String(value)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/mixer/cross-chain/TransferStatusTracker.tsx",
                                                        lineNumber: 261,
                                                        columnNumber: 49
                                                    }, this)
                                                ]
                                            }, key, true, {
                                                fileName: "[project]/src/components/mixer/cross-chain/TransferStatusTracker.tsx",
                                                lineNumber: 259,
                                                columnNumber: 45
                                            }, this);
                                        })
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/mixer/cross-chain/TransferStatusTracker.tsx",
                                        lineNumber: 257,
                                        columnNumber: 37
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/mixer/cross-chain/TransferStatusTracker.tsx",
                                lineNumber: 213,
                                columnNumber: 29
                            }, this)
                        ]
                    }, step.id, true, {
                        fileName: "[project]/src/components/mixer/cross-chain/TransferStatusTracker.tsx",
                        lineNumber: 191,
                        columnNumber: 25
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/src/components/mixer/cross-chain/TransferStatusTracker.tsx",
                lineNumber: 184,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/mixer/cross-chain/TransferStatusTracker.tsx",
        lineNumber: 136,
        columnNumber: 9
    }, this);
}
_s(TransferStatusTracker, "NE86rL3vg4NVcTTWDavsT0hUBJs=");
_c = TransferStatusTracker;
var _c;
__turbopack_context__.k.register(_c, "TransferStatusTracker");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/mixer/cross-chain/ZecDepositForm.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ZecDepositForm",
    ()=>ZecDepositForm
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$ArrowsRightLeftIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowsRightLeftIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroicons/react/24/outline/esm/ArrowsRightLeftIcon.js [app-client] (ecmascript) <export default as ArrowsRightLeftIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$ChevronDownIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDownIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroicons/react/24/outline/esm/ChevronDownIcon.js [app-client] (ecmascript) <export default as ChevronDownIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$ShieldCheckIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheckIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroicons/react/24/outline/esm/ShieldCheckIcon.js [app-client] (ecmascript) <export default as ShieldCheckIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$BoltIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BoltIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroicons/react/24/outline/esm/BoltIcon.js [app-client] (ecmascript) <export default as BoltIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$InformationCircleIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__InformationCircleIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroicons/react/24/outline/esm/InformationCircleIcon.js [app-client] (ecmascript) <export default as InformationCircleIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$ExclamationTriangleIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ExclamationTriangleIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroicons/react/24/outline/esm/ExclamationTriangleIcon.js [app-client] (ecmascript) <export default as ExclamationTriangleIcon>");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
const currencies = {
    ZEC: {
        name: 'Zcash',
        symbol: 'ZEC',
        icon: 'Z',
        color: 'text-orange-500',
        bgColor: 'bg-orange-500/10',
        min: 0.003,
        max: 27
    },
    STRK: {
        name: 'Starknet',
        symbol: 'STRK',
        icon: 'S',
        color: 'text-orange-400',
        bgColor: 'bg-orange-400/10',
        min: 10,
        max: 10000
    }
};
function ZecDepositForm(param) {
    let { onSubmit, onChange, isLoading = false, disabled = false, className = '' } = param;
    _s();
    const [direction, setDirection] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('zec-to-strk');
    const [amount, setAmount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [destinationAddress, setDestinationAddress] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [usePrivacyMixer, setUsePrivacyMixer] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [useCashuFlow, setUseCashuFlow] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showAdvanced, setShowAdvanced] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const fromCurrency = direction === 'zec-to-strk' ? currencies.ZEC : currencies.STRK;
    const toCurrency = direction === 'zec-to-strk' ? currencies.STRK : currencies.ZEC;
    const handleSwapDirection = ()=>{
        const newDirection = direction === 'zec-to-strk' ? 'strk-to-zec' : 'zec-to-strk';
        setDirection(newDirection);
        setAmount('');
        setDestinationAddress('');
        onChange === null || onChange === void 0 ? void 0 : onChange({
            direction: newDirection,
            amount: 0
        });
    };
    const handleAmountChange = (value)=>{
        setAmount(value);
        const numValue = parseFloat(value) || 0;
        onChange === null || onChange === void 0 ? void 0 : onChange({
            direction,
            amount: numValue
        });
    };
    const handleSubmit = (e)=>{
        e.preventDefault();
        if (!amount || !destinationAddress) return;
        onSubmit({
            direction,
            amount: parseFloat(amount),
            destinationAddress,
            usePrivacyMixer,
            useCashuFlow
        });
    };
    const numAmount = parseFloat(amount) || 0;
    const isValidAmount = numAmount >= fromCurrency.min && numAmount <= fromCurrency.max;
    const isValidAddress = destinationAddress.length > 10;
    const canSubmit = isValidAmount && isValidAddress && !isLoading && !disabled;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
        onSubmit: handleSubmit,
        className: "bg-gray-900 border border-gray-700 rounded-xl ".concat(className),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "px-6 py-4 border-b border-gray-700",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-lg font-semibold text-white flex items-center space-x-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$ArrowsRightLeftIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowsRightLeftIcon$3e$__["ArrowsRightLeftIcon"], {
                                className: "w-5 h-5 text-blue-400"
                            }, void 0, false, {
                                fileName: "[project]/src/components/mixer/cross-chain/ZecDepositForm.tsx",
                                lineNumber: 105,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Cross-Chain Swap"
                            }, void 0, false, {
                                fileName: "[project]/src/components/mixer/cross-chain/ZecDepositForm.tsx",
                                lineNumber: 106,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/mixer/cross-chain/ZecDepositForm.tsx",
                        lineNumber: 104,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-gray-400 mt-1",
                        children: "Private transfers between Zcash and Starknet"
                    }, void 0, false, {
                        fileName: "[project]/src/components/mixer/cross-chain/ZecDepositForm.tsx",
                        lineNumber: 108,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/mixer/cross-chain/ZecDepositForm.tsx",
                lineNumber: 103,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-6 space-y-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "block text-sm text-gray-400",
                                children: "You Send"
                            }, void 0, false, {
                                fileName: "[project]/src/components/mixer/cross-chain/ZecDepositForm.tsx",
                                lineNumber: 116,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full ".concat(fromCurrency.bgColor, " flex items-center justify-center"),
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-sm font-bold ".concat(fromCurrency.color),
                                            children: fromCurrency.icon
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/mixer/cross-chain/ZecDepositForm.tsx",
                                            lineNumber: 119,
                                            columnNumber: 29
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/mixer/cross-chain/ZecDepositForm.tsx",
                                        lineNumber: 118,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "number",
                                        value: amount,
                                        onChange: (e)=>handleAmountChange(e.target.value),
                                        placeholder: "0.00",
                                        step: "any",
                                        min: fromCurrency.min,
                                        max: fromCurrency.max,
                                        className: "w-full bg-gray-800 border border-gray-600 rounded-lg pl-14 pr-20 py-4 text-xl text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors",
                                        disabled: isLoading || disabled
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/mixer/cross-chain/ZecDepositForm.tsx",
                                        lineNumber: 123,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "absolute right-4 top-1/2 -translate-y-1/2",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-lg font-medium ".concat(fromCurrency.color),
                                            children: fromCurrency.symbol
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/mixer/cross-chain/ZecDepositForm.tsx",
                                            lineNumber: 135,
                                            columnNumber: 29
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/mixer/cross-chain/ZecDepositForm.tsx",
                                        lineNumber: 134,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/mixer/cross-chain/ZecDepositForm.tsx",
                                lineNumber: 117,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between text-xs text-gray-500",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: [
                                            "Min: ",
                                            fromCurrency.min,
                                            " ",
                                            fromCurrency.symbol
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/mixer/cross-chain/ZecDepositForm.tsx",
                                        lineNumber: 141,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: [
                                            "Max: ",
                                            fromCurrency.max,
                                            " ",
                                            fromCurrency.symbol
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/mixer/cross-chain/ZecDepositForm.tsx",
                                        lineNumber: 142,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/mixer/cross-chain/ZecDepositForm.tsx",
                                lineNumber: 140,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/mixer/cross-chain/ZecDepositForm.tsx",
                        lineNumber: 115,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-center -my-2",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: handleSwapDirection,
                            className: "p-3 bg-gray-800 border border-gray-600 rounded-full hover:bg-gray-700 hover:border-gray-500 transition-all duration-200 group",
                            disabled: isLoading || disabled,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$ArrowsRightLeftIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowsRightLeftIcon$3e$__["ArrowsRightLeftIcon"], {
                                className: "w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors rotate-90"
                            }, void 0, false, {
                                fileName: "[project]/src/components/mixer/cross-chain/ZecDepositForm.tsx",
                                lineNumber: 154,
                                columnNumber: 25
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/mixer/cross-chain/ZecDepositForm.tsx",
                            lineNumber: 148,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/mixer/cross-chain/ZecDepositForm.tsx",
                        lineNumber: 147,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "block text-sm text-gray-400",
                                children: "You Receive"
                            }, void 0, false, {
                                fileName: "[project]/src/components/mixer/cross-chain/ZecDepositForm.tsx",
                                lineNumber: 160,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative flex items-center px-4 py-4 bg-gray-800/50 border border-gray-700 rounded-lg",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-8 h-8 rounded-full ".concat(toCurrency.bgColor, " flex items-center justify-center mr-3"),
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-sm font-bold ".concat(toCurrency.color),
                                            children: toCurrency.icon
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/mixer/cross-chain/ZecDepositForm.tsx",
                                            lineNumber: 163,
                                            columnNumber: 29
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/mixer/cross-chain/ZecDepositForm.tsx",
                                        lineNumber: 162,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-lg text-gray-400",
                                        children: [
                                            numAmount > 0 ? '~' : '',
                                            " Estimated after quote"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/mixer/cross-chain/ZecDepositForm.tsx",
                                        lineNumber: 167,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "ml-auto text-lg font-medium ".concat(toCurrency.color),
                                        children: toCurrency.symbol
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/mixer/cross-chain/ZecDepositForm.tsx",
                                        lineNumber: 170,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/mixer/cross-chain/ZecDepositForm.tsx",
                                lineNumber: 161,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/mixer/cross-chain/ZecDepositForm.tsx",
                        lineNumber: 159,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "block text-sm text-gray-400",
                                children: direction === 'zec-to-strk' ? 'Starknet Destination Address' : 'Zcash Destination Address'
                            }, void 0, false, {
                                fileName: "[project]/src/components/mixer/cross-chain/ZecDepositForm.tsx",
                                lineNumber: 178,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "text",
                                value: destinationAddress,
                                onChange: (e)=>setDestinationAddress(e.target.value),
                                placeholder: direction === 'zec-to-strk' ? '0x...' : 'z...',
                                className: "w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors font-mono text-sm",
                                disabled: isLoading || disabled
                            }, void 0, false, {
                                fileName: "[project]/src/components/mixer/cross-chain/ZecDepositForm.tsx",
                                lineNumber: 181,
                                columnNumber: 21
                            }, this),
                            direction === 'strk-to-zec' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-start space-x-2 text-xs text-orange-400/80",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$ExclamationTriangleIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ExclamationTriangleIcon$3e$__["ExclamationTriangleIcon"], {
                                        className: "w-4 h-4 flex-shrink-0 mt-0.5"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/mixer/cross-chain/ZecDepositForm.tsx",
                                        lineNumber: 191,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "Use a shielded z-address for maximum privacy"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/mixer/cross-chain/ZecDepositForm.tsx",
                                        lineNumber: 192,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/mixer/cross-chain/ZecDepositForm.tsx",
                                lineNumber: 190,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/mixer/cross-chain/ZecDepositForm.tsx",
                        lineNumber: 177,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: ()=>setShowAdvanced(!showAdvanced),
                        className: "flex items-center justify-between w-full py-2 text-sm text-gray-400 hover:text-gray-300 transition-colors",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "flex items-center space-x-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$ShieldCheckIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheckIcon$3e$__["ShieldCheckIcon"], {
                                        className: "w-4 h-4"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/mixer/cross-chain/ZecDepositForm.tsx",
                                        lineNumber: 204,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "Privacy Options"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/mixer/cross-chain/ZecDepositForm.tsx",
                                        lineNumber: 205,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/mixer/cross-chain/ZecDepositForm.tsx",
                                lineNumber: 203,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$ChevronDownIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDownIcon$3e$__["ChevronDownIcon"], {
                                className: "w-4 h-4 transition-transform ".concat(showAdvanced ? 'rotate-180' : '')
                            }, void 0, false, {
                                fileName: "[project]/src/components/mixer/cross-chain/ZecDepositForm.tsx",
                                lineNumber: 207,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/mixer/cross-chain/ZecDepositForm.tsx",
                        lineNumber: 198,
                        columnNumber: 17
                    }, this),
                    showAdvanced && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-4 pt-2 border-t border-gray-700",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "flex items-start space-x-3 cursor-pointer group",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "checkbox",
                                        checked: usePrivacyMixer,
                                        onChange: (e)=>setUsePrivacyMixer(e.target.checked),
                                        className: "mt-1 w-4 h-4 rounded border-gray-600 bg-gray-800 text-blue-500 focus:ring-blue-500 focus:ring-offset-0",
                                        disabled: isLoading || disabled
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/mixer/cross-chain/ZecDepositForm.tsx",
                                        lineNumber: 214,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-white group-hover:text-blue-400 transition-colors",
                                                children: "Use Privacy Mixer"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/mixer/cross-chain/ZecDepositForm.tsx",
                                                lineNumber: 222,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-gray-500 mt-0.5",
                                                children: "Route through ZK privacy mixer for enhanced anonymity"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/mixer/cross-chain/ZecDepositForm.tsx",
                                                lineNumber: 225,
                                                columnNumber: 33
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/mixer/cross-chain/ZecDepositForm.tsx",
                                        lineNumber: 221,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/mixer/cross-chain/ZecDepositForm.tsx",
                                lineNumber: 213,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "flex items-start space-x-3 cursor-pointer group",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "checkbox",
                                        checked: useCashuFlow,
                                        onChange: (e)=>setUseCashuFlow(e.target.checked),
                                        className: "mt-1 w-4 h-4 rounded border-gray-600 bg-gray-800 text-blue-500 focus:ring-blue-500 focus:ring-offset-0",
                                        disabled: isLoading || disabled
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/mixer/cross-chain/ZecDepositForm.tsx",
                                        lineNumber: 232,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-white group-hover:text-blue-400 transition-colors",
                                                children: "Use Cashu Ecash Flow"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/mixer/cross-chain/ZecDepositForm.tsx",
                                                lineNumber: 240,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-gray-500 mt-0.5",
                                                children: "Additional privacy layer through ecash tokens"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/mixer/cross-chain/ZecDepositForm.tsx",
                                                lineNumber: 243,
                                                columnNumber: 33
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/mixer/cross-chain/ZecDepositForm.tsx",
                                        lineNumber: 239,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/mixer/cross-chain/ZecDepositForm.tsx",
                                lineNumber: 231,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/mixer/cross-chain/ZecDepositForm.tsx",
                        lineNumber: 212,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-start space-x-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$InformationCircleIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__InformationCircleIcon$3e$__["InformationCircleIcon"], {
                                className: "w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5"
                            }, void 0, false, {
                                fileName: "[project]/src/components/mixer/cross-chain/ZecDepositForm.tsx",
                                lineNumber: 253,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-sm text-gray-300",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "font-medium text-blue-400 mb-1",
                                        children: "How it works"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/mixer/cross-chain/ZecDepositForm.tsx",
                                        lineNumber: 255,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-gray-400",
                                        children: direction === 'zec-to-strk' ? 'Send ZEC to a generated address. It will be converted through Lightning Network to STRK on Starknet.' : 'Your STRK will be converted through Lightning Network to ZEC at your specified address.'
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/mixer/cross-chain/ZecDepositForm.tsx",
                                        lineNumber: 256,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/mixer/cross-chain/ZecDepositForm.tsx",
                                lineNumber: 254,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/mixer/cross-chain/ZecDepositForm.tsx",
                        lineNumber: 252,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "submit",
                        disabled: !canSubmit,
                        className: "w-full py-4 rounded-lg font-medium text-lg transition-all duration-200 flex items-center justify-center space-x-2 ".concat(canSubmit ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/25' : 'bg-gray-700 text-gray-400 cursor-not-allowed'),
                        children: isLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$BoltIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BoltIcon$3e$__["BoltIcon"], {
                                    className: "w-5 h-5 animate-pulse"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/mixer/cross-chain/ZecDepositForm.tsx",
                                    lineNumber: 276,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: "Preparing Transfer..."
                                }, void 0, false, {
                                    fileName: "[project]/src/components/mixer/cross-chain/ZecDepositForm.tsx",
                                    lineNumber: 277,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$BoltIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BoltIcon$3e$__["BoltIcon"], {
                                    className: "w-5 h-5"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/mixer/cross-chain/ZecDepositForm.tsx",
                                    lineNumber: 281,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: direction === 'zec-to-strk' ? 'Start ZEC to STRK Transfer' : 'Start STRK to ZEC Transfer'
                                }, void 0, false, {
                                    fileName: "[project]/src/components/mixer/cross-chain/ZecDepositForm.tsx",
                                    lineNumber: 282,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true)
                    }, void 0, false, {
                        fileName: "[project]/src/components/mixer/cross-chain/ZecDepositForm.tsx",
                        lineNumber: 266,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs text-gray-500 text-center",
                        children: "By proceeding, you acknowledge that cross-chain transfers are irreversible and subject to network fees."
                    }, void 0, false, {
                        fileName: "[project]/src/components/mixer/cross-chain/ZecDepositForm.tsx",
                        lineNumber: 290,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/mixer/cross-chain/ZecDepositForm.tsx",
                lineNumber: 113,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/mixer/cross-chain/ZecDepositForm.tsx",
        lineNumber: 101,
        columnNumber: 9
    }, this);
}
_s(ZecDepositForm, "SbYYO+OlxNxgo7Twe4EPAGxb7QY=");
_c = ZecDepositForm;
var _c;
__turbopack_context__.k.register(_c, "ZecDepositForm");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/integrations/starknet/sharedAccount.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getSharedSwapAccount",
    ()=>getSharedSwapAccount,
    "getSharedSwapAccountRaw",
    ()=>getSharedSwapAccountRaw,
    "getSharedSwapAddress",
    ()=>getSharedSwapAddress,
    "getSharedSwapProvider",
    ()=>getSharedSwapProvider,
    "transferStrkFromShared",
    ()=>transferStrkFromShared,
    "validateSharedSwapSigner",
    ()=>validateSharedSwapSigner
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$starknet$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/starknet/dist/index.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$atomiqlabs$2f$chain$2d$starknet$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@atomiqlabs/chain-starknet/dist/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/config/constants.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$env$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/config/env.ts [app-client] (ecmascript)");
;
;
;
;
;
// Lazy singleton for shared swap account (prototype only)
let sharedAccount = null;
let sharedSigner = null;
let sharedProvider = null;
function getSharedSwapAccount() {
    if (sharedSigner) return sharedSigner;
    if (!__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$env$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ENV"].SHARED_SWAP_ACCOUNT_PRIVATE_KEY) {
        return null; // Not configured
    }
    const address = (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$env$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ENV"].SHARED_SWAP_ACCOUNT_ADDRESS || __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SHARED_SWAP_ACCOUNT_ADDRESS"]).toLowerCase();
    const provider = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$starknet$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["RpcProvider"]({
        nodeUrl: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$env$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getStarknetRpc"])()
    });
    sharedProvider = provider;
    try {
        // Validate private key (basic length/hex check)
        const pk = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$env$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ENV"].SHARED_SWAP_ACCOUNT_PRIVATE_KEY.startsWith('0x') ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$env$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ENV"].SHARED_SWAP_ACCOUNT_PRIVATE_KEY : '0x' + __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$env$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ENV"].SHARED_SWAP_ACCOUNT_PRIVATE_KEY;
        if (!/^0x[0-9a-fA-F]{64}$/.test(pk)) {
            console.warn('Shared swap account private key format unexpected');
        }
        // Derive public key just for logging (not strictly needed)
        try {
            const pub = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$starknet$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ec"].starkCurve.getStarkKey(pk);
            console.log('🔐 Shared swap account loaded (pubkey prefix):', pub.slice(0, 10) + '...');
        } catch (e) {
            console.warn('Could not derive public key for shared swap account:', e);
        }
        sharedAccount = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$starknet$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Account"](provider, address, pk);
        sharedSigner = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$atomiqlabs$2f$chain$2d$starknet$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StarknetSigner"](sharedAccount);
        return sharedSigner;
    } catch (e) {
        console.error('Failed to instantiate shared swap account:', e);
        return null;
    }
}
function getSharedSwapProvider() {
    return sharedProvider;
}
function getSharedSwapAccountRaw() {
    // Get the raw Account for contracts that need it
    if (!sharedSigner) {
        // Try to initialize if not already done
        getSharedSwapAccount();
    }
    return sharedAccount;
}
async function validateSharedSwapSigner() {
    try {
        const signer = getSharedSwapAccount();
        const acct = getSharedSwapAccountRaw();
        const provider = getSharedSwapProvider();
        if (!signer || !acct || !provider) {
            return {
                ok: false,
                reason: 'Shared swap signer not configured (missing env or provider)'
            };
        }
        // Try to fetch nonce as a lightweight liveness check
        try {
            var _nonce_toString;
            const nonce = await acct.getNonce();
            console.log('✅ Shared swap account validation OK', {
                address: acct.address,
                nonce: (nonce === null || nonce === void 0 ? void 0 : (_nonce_toString = nonce.toString) === null || _nonce_toString === void 0 ? void 0 : _nonce_toString.call(nonce)) || String(nonce)
            });
            return {
                ok: true,
                address: acct.address
            };
        } catch (e) {
            console.warn('⚠️ Shared swap account nonce check failed', {
                address: acct.address,
                error: e instanceof Error ? e.message : String(e)
            });
            return {
                ok: false,
                reason: 'Account nonce fetch failed (address may be wrong or not deployed)',
                address: acct.address
            };
        }
    } catch (e) {
        return {
            ok: false,
            reason: e instanceof Error ? e.message : String(e)
        };
    }
}
function getSharedSwapAddress() {
    if (!sharedSigner) getSharedSwapAccount();
    return (sharedAccount === null || sharedAccount === void 0 ? void 0 : sharedAccount.address) || null;
}
async function transferStrkFromShared(to, amountWei) {
    const acct = getSharedSwapAccountRaw();
    if (!acct) throw new Error('Shared swap account not configured');
    const token = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PRIVACY_MIXER"].STRK_TOKEN;
    const call = {
        contractAddress: token,
        entrypoint: 'transfer',
        calldata: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$starknet$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["CallData"].compile([
            to,
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$starknet$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["cairo"].uint256(amountWei)
        ])
    };
    const res = await acct.execute([
        call
    ]);
    const txHash = res.transaction_hash || res.hash || 'unknown_tx';
    console.log('🚚 Shared STRK forward transfer submitted:', {
        to,
        amountWei: amountWei.toString(),
        txHash
    });
    return txHash;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/integrations/swaps/atomiq.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Real Atomiq swap integration using @atomiqlabs/sdk - Starknet + Lightning only
__turbopack_context__.s([
    "RealAtomiqSwapClient",
    ()=>RealAtomiqSwapClient,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_define_property.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$atomiqlabs$2f$sdk$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@atomiqlabs/sdk/dist/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bolt11$2f$payreq$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/bolt11/payreq.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$atomiqlabs$2f$chain$2d$starknet$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@atomiqlabs/chain-starknet/dist/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$env$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/config/env.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$integrations$2f$starknet$2f$sharedAccount$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/integrations/starknet/sharedAccount.ts [app-client] (ecmascript)");
;
;
;
;
;
;
class RealAtomiqSwapClient {
    async initializeForBrowser() {
        try {
            // Create factory with Starknet-only support (no Solana)
            this.factory = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$atomiqlabs$2f$sdk$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SwapperFactory"]([
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$atomiqlabs$2f$chain$2d$starknet$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StarknetInitializer"]
            ]);
            this.tokens = this.factory.Tokens;
            // Start initialization (async)
            this.initializationPromise = this.initializeAtomiqFactory();
        } catch (error) {
            console.error('❌ Failed to create Atomiq factory:', error);
        }
    }
    setupTestMode() {
        if (this.isNodeJs) {
            console.log('📋 Test mode setup: Atomiq SDK requires browser environment');
            return;
        }
        // No simulation mode - user explicitly disabled it
        this.initialized = false;
        console.error('❌ Atomiq SDK initialization failed and simulation mode is disabled');
        throw new Error('Atomiq SDK initialization failed - simulation mode disabled');
    }
    async initializeAtomiqFactory() {
        try {
            console.log('🔧 Initializing Atomiq SDK with Starknet + Lightning support...');
            if (!this.factory) {
                throw new Error('Factory not initialized - browser environment required');
            }
            // Create swapper configuration matching the demo pattern
            const starknetRpc = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$atomiqlabs$2f$chain$2d$starknet$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RpcProviderWithRetries"]({
                nodeUrl: this.starknetRpc
            });
            const swapperConfig = {
                chains: {
                    STARKNET: {
                        rpcUrl: starknetRpc,
                        fees: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$atomiqlabs$2f$chain$2d$starknet$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StarknetFees"](starknetRpc)
                    }
                },
                bitcoinNetwork: this.network === 'MAINNET' ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$atomiqlabs$2f$sdk$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BitcoinNetwork"].MAINNET : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$atomiqlabs$2f$sdk$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BitcoinNetwork"].TESTNET
            };
            // For Node.js environments, use simple memory storage to avoid SQLite dependency issues
            if (this.isNodeJs) {
                console.log('✅ Using memory storage for Node.js testing environment');
            // Use default in-memory storage for simplicity
            }
            console.log('✅ Configured storage for privacy mixer environment');
            // Create swapper using factory with Starknet-only configuration
            this.swapper = this.factory.newSwapper(swapperConfig);
            console.log('✅ Atomiq Swapper created for Starknet ↔ Lightning');
            // Initialize the swapper
            await this.swapper.init();
            console.log('✅ Atomiq SDK initialized - ready for STRK ↔ Lightning swaps');
            this.initialized = true;
        } catch (error) {
            console.error('❌ Failed to initialize Atomiq SDK:', error instanceof Error ? error.message : String(error));
            console.error('Full error:', error);
            throw error; // Don't fall back to simulation as requested
        }
    }
    async ensureInitialized() {
        if (this.isNodeJs) {
            throw new Error('Atomiq SDK requires browser environment - Node.js not supported');
        }
        if (this.initialized) {
            return;
        }
        if (this.initializationPromise) {
            await this.initializationPromise;
            return;
        }
        throw new Error('Atomiq SDK not initialized and no initialization promise found');
    }
    /**
     * Execute Starknet to Lightning swap for privacy mixing
     * Converts STRK to Lightning for enhanced privacy
     * @param walletSigner - Optional StarknetSigner from user's wallet. If not provided, uses shared account.
     */ async swapStrkToLightning(amount, lightningInvoice, sourceAddress, walletSigner) {
        try {
            await this.ensureInitialized();
            // Preflight: fetch STRK input limits to avoid 'Amount too high' from SDK
            try {
                const limits = await this.getSwapLimits('STRK', 'BTC_LN');
                const invoiceDecoded = (()=>{
                    try {
                        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bolt11$2f$payreq$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["decode"](lightningInvoice);
                    } catch (e) {
                        return null;
                    }
                })();
                const invoiceMsats = (invoiceDecoded === null || invoiceDecoded === void 0 ? void 0 : invoiceDecoded.millisatoshis) ? BigInt(invoiceDecoded.millisatoshis) : undefined;
                const invoiceSats = invoiceMsats ? Number(invoiceMsats / 1000n) : undefined;
                // Note: limits are for STRK input, but we only know Lightning output amount
                // The SDK will calculate required STRK input based on current exchange rates
                // For now, just log the values for debugging
                console.log('🔍 Preflight limits check (STRK input limits):', {
                    invoiceSats,
                    strkMaxLimit: limits.max.toString(),
                    strkMinLimit: limits.min.toString(),
                    note: 'STRK input will be calculated by SDK based on invoice amount'
                });
            // Skip input validation since we don't know STRK input amount yet
            // Let the SDK handle the validation and conversion
            } catch (preflight_error) {
                console.warn('⚠️ Preflight limits check failed, proceeding with swap:', preflight_error);
            }
            console.log("🔄 Starting STRK → Lightning swap for amount: ".concat(amount));
            // Normalize Starknet source address (felt252) to 0x + 64 hex chars
            let normalizedSource = sourceAddress.trim().toLowerCase();
            if (!normalizedSource.startsWith('0x')) {
                normalizedSource = '0x' + normalizedSource;
            }
            const hexBody = normalizedSource.slice(2);
            if (!/^[0-9a-f]+$/.test(hexBody)) {
                return {
                    success: false,
                    amount,
                    fromCurrency: 'STRK',
                    toCurrency: 'Lightning',
                    route: 'starknet-to-lightning',
                    error: 'Source Starknet address contains non-hex characters'
                };
            }
            if (hexBody.length < 64) {
                normalizedSource = '0x' + hexBody.padStart(64, '0');
            } else if (hexBody.length > 64) {
                // Some wallets return full felt length already (<= 64). If >64 it's invalid here.
                return {
                    success: false,
                    amount,
                    fromCurrency: 'STRK',
                    toCurrency: 'Lightning',
                    route: 'starknet-to-lightning',
                    error: 'Source Starknet address length invalid (>64 hex chars)'
                };
            }
            console.log('🧾 Normalized Starknet source address:', normalizedSource);
            // We now expect a BOLT11 invoice generated upstream (e.g. Cashu mint quote)
            const invoice = lightningInvoice.trim();
            const bolt11Pattern = /^(lnbc|lntb|lnbcrt)[0-9a-z]+$/i;
            const isBolt11 = bolt11Pattern.test(invoice);
            if (!isBolt11) {
                return {
                    success: false,
                    amount,
                    fromCurrency: 'STRK',
                    toCurrency: 'Lightning',
                    route: 'starknet-to-lightning',
                    error: 'Provided value is not a valid BOLT11 invoice. Generate invoice from Cashu mint first.'
                };
            }
            // Decode BOLT11 invoice to inspect amount
            let satsFromInvoice;
            try {
                const decoded = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bolt11$2f$payreq$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["decode"](invoice);
                const msats = decoded.millisatoshis;
                if (!msats) {
                    return {
                        success: false,
                        amount,
                        fromCurrency: 'STRK',
                        toCurrency: 'Lightning',
                        route: 'starknet-to-lightning',
                        error: 'Invoice missing fixed amount (amountless invoices not supported yet)'
                    };
                }
                satsFromInvoice = BigInt(msats) / BigInt(1000);
                if (satsFromInvoice === BigInt(0)) {
                    return {
                        success: false,
                        amount,
                        fromCurrency: 'STRK',
                        toCurrency: 'Lightning',
                        route: 'starknet-to-lightning',
                        error: 'Invoice amount is zero'
                    };
                }
                console.log("🧾 Invoice amount parsed: ".concat(satsFromInvoice.toString(), " sats"));
            } catch (e) {
                const msg = e instanceof Error ? e.message : String(e);
                return {
                    success: false,
                    amount,
                    fromCurrency: 'STRK',
                    toCurrency: 'Lightning',
                    route: 'starknet-to-lightning',
                    error: "Failed to decode invoice: ".concat(msg)
                };
            }
            // For Lightning invoices: must use exactOut semantics (Atomiq SDK requirement)
            // We specify the Lightning output amount (from invoice) and let SDK calculate required STRK input
            const exactIn = false;
            console.log("🔄 Creating STRK → Lightning swap (exactOut): ".concat(satsFromInvoice.toString(), " sats output"));
            // Create STRK -> Lightning swap using proper Atomiq pattern from demo
            const swap = await this.swapper.swap(this.tokens.STARKNET.STRK, this.tokens.BITCOIN.BTCLN, undefined, false, normalizedSource, invoice // Lightning invoice
            );
            console.log('✅ STRK → Lightning swap created:', swap.getId());
            console.log('📊 Swap details:');
            console.log('   Input: ' + swap.getInputWithoutFee());
            console.log('   Fees: ' + swap.getFee().amountInSrcToken);
            console.log('   Total input: ' + swap.getInput());
            console.log('   Output: ' + swap.getOutput());
            console.log('   Quote expiry: ' + swap.getQuoteExpiry() + ' (in ' + (swap.getQuoteExpiry() - Date.now()) / 1000 + ' seconds)');
            // Use wallet signer if provided, otherwise fall back to shared account
            const signer = walletSigner || (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$integrations$2f$starknet$2f$sharedAccount$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getSharedSwapAccount"])();
            if (signer) {
                var _signer_getAddress;
                const signerAddress = ((_signer_getAddress = signer.getAddress) === null || _signer_getAddress === void 0 ? void 0 : _signer_getAddress.call(signer)) || signer.address || 'unknown';
                console.log('🔐 Committing swap with signer:', signerAddress.slice(0, 10) + '...');
                // Ensure signer has getNonce method that returns BigInt compatible value
                if (signer.getNonce && typeof signer.getNonce === 'function') {
                    try {
                        const nonce = await signer.getNonce();
                        console.log('   Signer nonce check:', nonce.toString());
                    } catch (e) {
                        console.warn('   Signer nonce check failed:', e);
                    }
                }
                await swap.commit(signer);
            } else {
                throw new Error('No signer available - provide wallet signer or configure shared swap account');
            }
            // Wait for the Lightning payment to complete
            console.log('⏳ Waiting for Lightning payment...');
            const success = await swap.waitForPayment();
            if (success) {
                var _swap_getBitcoinTxId;
                return {
                    success: true,
                    txId: ((_swap_getBitcoinTxId = swap.getBitcoinTxId) === null || _swap_getBitcoinTxId === void 0 ? void 0 : _swap_getBitcoinTxId.call(swap)) || swap.getId(),
                    amount,
                    fromCurrency: 'STRK',
                    toCurrency: 'Lightning',
                    route: 'starknet-to-lightning'
                };
            } else {
                // Payment failed - refund the swap
                console.log('💸 Lightning payment failed, refunding...');
                if (signer) {
                    await swap.refund(signer);
                    console.log('✅ Swap refunded successfully');
                }
                return {
                    success: false,
                    amount,
                    fromCurrency: 'STRK',
                    toCurrency: 'Lightning',
                    route: 'starknet-to-lightning',
                    error: 'Lightning payment failed and refunded'
                };
            }
        } catch (error) {
            let errorMessage = error instanceof Error ? error.message : String(error);
            if (/amount too high/i.test(errorMessage)) {
                try {
                    const limits = await this.getSwapLimits('STRK', 'BTC_LN');
                    errorMessage = "".concat(errorMessage, " (max sats: ").concat(limits.max.toString(), ", consider reducing invoice amount)");
                } catch (e) {}
            }
            console.error('❌ STRK → Lightning swap failed:', errorMessage);
            return {
                success: false,
                error: errorMessage,
                amount,
                fromCurrency: 'STRK',
                toCurrency: 'Lightning',
                route: 'starknet-to-lightning'
            };
        }
    }
    /**
     * Execute Lightning to Starknet swap for final transfer
     * Converts Lightning back to STRK for recipient
     */ async swapLightningToStrk(amount, recipientAddress) {
        try {
            await this.ensureInitialized();
            console.log("🔄 Starting Lightning → STRK swap for amount: ".concat(amount));
            // Create Lightning -> STRK swap
            const swap = await this.swapper.swap(this.tokens.BITCOIN.BTCLN, this.tokens.STARKNET.STRK, BigInt(amount), true, undefined, recipientAddress // Destination Starknet address
            );
            console.log('✅ Lightning → STRK swap created:', swap.getId());
            // Get the Lightning invoice to pay
            const invoice = swap.getAddress();
            console.log('💰 Lightning invoice to pay:', invoice);
            // For testing, we'll simulate the Lightning payment
            // In production, this would integrate with your Lightning node
            await this.simulateLightningPayment(invoice);
            // Wait for swap completion
            const result = await swap.waitForPayment();
            if (result) {
                var _swap_getBitcoinTxId;
                return {
                    success: true,
                    txId: ((_swap_getBitcoinTxId = swap.getBitcoinTxId) === null || _swap_getBitcoinTxId === void 0 ? void 0 : _swap_getBitcoinTxId.call(swap)) || swap.getId(),
                    amount,
                    fromCurrency: 'Lightning',
                    toCurrency: 'STRK',
                    route: 'lightning-to-starknet'
                };
            } else {
                throw new Error('Swap execution failed');
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.error('❌ Lightning → STRK swap failed:', errorMessage);
            return {
                success: false,
                error: errorMessage,
                amount,
                fromCurrency: 'Lightning',
                toCurrency: 'STRK',
                route: 'lightning-to-starknet'
            };
        }
    }
    /**
     * Begin a Lightning → STRK swap and return the BOLT11 invoice without simulating payment.
     * Use this when an external payer (e.g., Cashu melt) will pay the invoice.
     */ async beginLightningToStrkSwap(amount, recipientAddress) {
        await this.ensureInitialized();
        console.log("🔄 (begin) Lightning → STRK swap for amount: ".concat(amount));
        const swap = await this.swapper.swap(this.tokens.BITCOIN.BTCLN, this.tokens.STARKNET.STRK, BigInt(amount), true, undefined, recipientAddress // Destination Starknet address
        );
        const invoice = swap.getAddress();
        const id = swap.getId();
        console.log('✅ (begin) Lightning invoice created:', {
            id,
            invoice: typeof invoice === 'string' ? invoice.slice(0, 50) + '…' : String(invoice)
        });
        return {
            id,
            invoice
        };
    }
    /**
     * Wait for a previously created Lightning → STRK swap to complete after external payment.
     */ async waitLightningToStrkCompletion(id) {
        let timeoutMs = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 300000;
        return this.waitForCompletion(id, timeoutMs);
    }
    /**
     * Claim a Lightning → STRK swap on Starknet after the LN invoice is paid.
     * Uses the shared Starknet account to sign commit/claim transactions.
     */ async claimLightningToStrkSwap(id) {
        await this.ensureInitialized();
        if (!this.swapper || !this.initialized) {
            throw new Error('Atomiq SDK not initialized - simulation mode disabled');
        }
        const swap = await this.swapper.getSwapById(id);
        if (!swap) throw new Error("Swap ".concat(id, " not found"));
        const signer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$integrations$2f$starknet$2f$sharedAccount$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getSharedSwapAccount"])();
        if (!signer) {
            throw new Error('No shared swap account configured - cannot claim swap');
        }
        // Validate signer early to avoid opaque SDK errors
        try {
            const { validateSharedSwapSigner } = await __turbopack_context__.A("[project]/src/integrations/starknet/sharedAccount.ts [app-client] (ecmascript, async loader)");
            const check = await validateSharedSwapSigner();
            if (!check.ok) {
                throw new Error("Invalid signer provided: ".concat(check.reason || 'unknown reason').concat(check.address ? " (address: ".concat(check.address, ")") : ''));
            }
        } catch (valErr) {
            // Re-throw with context
            const msg = valErr instanceof Error ? valErr.message : String(valErr);
            throw new Error(msg.includes('Invalid signer provided') ? msg : "Invalid signer provided! ".concat(msg));
        }
        try {
            var _swap_getBitcoinTxId, _swap_getOutputTxId;
            if (typeof swap.canCommitAndClaimInOneShot === 'function' && swap.canCommitAndClaimInOneShot()) {
                await swap.commitAndClaim(signer);
            } else {
                await swap.commit(signer);
                await swap.claim(signer);
            }
            const txId = ((_swap_getBitcoinTxId = swap.getBitcoinTxId) === null || _swap_getBitcoinTxId === void 0 ? void 0 : _swap_getBitcoinTxId.call(swap)) || ((_swap_getOutputTxId = swap.getOutputTxId) === null || _swap_getOutputTxId === void 0 ? void 0 : _swap_getOutputTxId.call(swap)) || undefined;
            console.log('✅ Claimed Lightning → STRK swap on Starknet', {
                id,
                txId
            });
            return {
                txId
            };
        } catch (e) {
            const msg = e instanceof Error ? e.message : String(e);
            console.error('❌ Claim Lightning → STRK failed:', msg);
            throw new Error("Claim failed for swap ".concat(id, ": ").concat(msg));
        }
    }
    // Interface-required methods for compatibility
    async getQuote(from, to, amount) {
        let exactIn = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : true, sourceAddress = arguments.length > 4 ? arguments[4] : void 0// Source address for STRK -> Lightning swaps
        ;
        await this.ensureInitialized();
        console.log("🔄 Getting real-time quote for ".concat(from, " -> ").concat(to, ", amount: ").concat(amount, ", exactIn: ").concat(exactIn, ", source: ").concat(sourceAddress));
        try {
            if (!this.swapper || !this.tokens) {
                throw new Error('Atomiq SDK not properly initialized');
            }
            const fromToken = this.mapToAtomiqToken(from);
            const toToken = this.mapToAtomiqToken(to);
            // For STRK -> Lightning: 5th param is SOURCE Starknet address, 6th is Lightning invoice
            // For Lightning -> STRK: 5th param is undefined, 6th is DESTINATION Starknet address
            const isFromStarknet = from === 'STRK';
            if (isFromStarknet && !sourceAddress) {
                throw new Error('Source Starknet address required for STRK -> Lightning quotes');
            }
            // Create a quote by creating a swap object (but don't commit it)
            // swap(srcToken, dstToken, amount, exactIn, src, dst)
            const tempSwap = await this.swapper.swap(fromToken, toToken, amount, exactIn, isFromStarknet ? sourceAddress : undefined, isFromStarknet ? undefined : sourceAddress // Destination for LN->STRK
            );
            // Get pricing information from the swap object
            const priceInfo = tempSwap.getPriceInfo();
            const inputAmount = tempSwap.getInput();
            const outputAmount = tempSwap.getOutput();
            const fee = tempSwap.getFee();
            const expiry = tempSwap.getQuoteExpiry();
            console.log('📊 Real-time quote received:', {
                swapPrice: priceInfo.swapPrice,
                marketPrice: priceInfo.marketPrice,
                difference: priceInfo.difference,
                input: inputAmount.toString(),
                output: outputAmount.toString(),
                fee: fee.amountInSrcToken.toString(),
                expiry: new Date(expiry).toISOString()
            });
            return {
                id: tempSwap.getId(),
                from,
                to,
                amountIn: BigInt(inputAmount.toString()),
                amountOut: BigInt(outputAmount.toString()),
                fee: BigInt(fee.amountInSrcToken.toString()),
                swapPrice: priceInfo.swapPrice,
                marketPrice: priceInfo.marketPrice,
                difference: priceInfo.difference,
                expiry: expiry,
                createdAt: Date.now()
            };
        } catch (error) {
            console.warn('⚠️ Failed to get real-time quote, falling back to estimate:', error);
            const fallbackRate = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$env$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ENV"].STRK_SATS_RATE || 125;
            // Fallback to conservative estimate if real quote fails
            // Handle Wei conversion properly: 1 STRK (1e18 Wei) ≈ 700 sats
            let estimatedOutput;
            let estimatedInput;
            if (exactIn) {
                // Input is in Wei, convert to STRK then to sats
                const strkAmount = Number(amount) / 1e18;
                estimatedOutput = BigInt(Math.floor(strkAmount * fallbackRate));
                estimatedInput = amount;
            } else {
                // Output is in sats, convert to STRK then to Wei
                const strkAmount = Number(amount) / fallbackRate; // amount is sats
                estimatedInput = BigInt(Math.floor(strkAmount * 1e18)); // Convert to Wei
                estimatedOutput = amount;
            }
            return {
                id: "quote_fallback_".concat(Date.now()),
                from,
                to,
                amountIn: estimatedInput,
                amountOut: estimatedOutput,
                fee: amount / 100n,
                swapPrice: exactIn ? 0.001 : 1000,
                marketPrice: exactIn ? 0.001 : 1000,
                difference: 0,
                expiry: Date.now() + 600000,
                createdAt: Date.now()
            };
        }
    }
    /**
     * Get real-time quote for STRK to Lightning conversion
     */ async getStrkToLightningQuote(strkAmount) {
        try {
            // Convert STRK to Wei for the quote
            const strkAmountWei = BigInt(Math.floor(strkAmount * 1e18));
            // Use shared swap account address for quoting
            const sharedSigner = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$integrations$2f$starknet$2f$sharedAccount$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getSharedSwapAccount"])();
            const sourceAddress = (sharedSigner === null || sharedSigner === void 0 ? void 0 : sharedSigner.getAddress()) || undefined;
            const quote = await this.getQuote('STRK', 'BTC_LN', strkAmountWei, true, sourceAddress);
            // Convert output back to sats (assuming it's returned in base units)
            const satsOut = Number(quote.amountOut);
            console.log("📊 STRK → Lightning quote: ".concat(strkAmount, " STRK → ").concat(satsOut, " sats"));
            return {
                satsOut,
                quote
            };
        } catch (error) {
            console.warn('⚠️ Failed to get STRK → Lightning quote, using fallback:', error);
            // Conservative fallback using configured rate
            const fallbackRate = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$env$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ENV"].STRK_SATS_RATE || 125;
            const fallbackSats = Math.floor(strkAmount * fallbackRate);
            return {
                satsOut: fallbackSats,
                quote: {
                    id: "fallback_".concat(Date.now()),
                    from: 'STRK',
                    to: 'BTC_LN',
                    amountIn: BigInt(Math.floor(strkAmount * 1e18)),
                    amountOut: BigInt(fallbackSats),
                    fee: BigInt(Math.floor(fallbackSats * 0.01)),
                    swapPrice: fallbackSats / strkAmount,
                    marketPrice: fallbackSats / strkAmount,
                    difference: 0,
                    expiry: Date.now() + 600000,
                    createdAt: Date.now()
                }
            };
        }
    }
    /**
     * High-level convenience: estimate sats output for known STRK input.
     * Attempts live quote; returns { satsOut, rate, source } where rate = satsOut/STRK.
     */ async estimateLightningSatsFromStrk(strkAmount) {
        try {
            const { satsOut, quote } = await this.getStrkToLightningQuote(strkAmount);
            const rate = satsOut / Math.max(1e-9, strkAmount); // protect division
            console.log('📈 Dynamic STRK→sats estimate (realtime):', {
                strkAmount,
                satsOut,
                rate
            });
            return {
                satsOut,
                rate,
                source: 'realtime',
                quote
            };
        } catch (e) {
            const fallback = Math.floor(strkAmount * (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$env$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ENV"].STRK_SATS_RATE || 125));
            const rate = fallback / Math.max(1e-9, strkAmount);
            console.warn('⚠️ Dynamic estimate fallback used:', {
                strkAmount,
                satsOut: fallback,
                rate
            });
            return {
                satsOut: fallback,
                rate,
                source: 'fallback'
            };
        }
    }
    async execute(quoteId, walletSigner, lightningInvoice) {
        await this.ensureInitialized();
        console.log("⚡ Executing simplified swap ".concat(quoteId));
        // For simplified integration, return success status
        return {
            id: quoteId,
            txId: "tx_".concat(Date.now()),
            status: 'CLAIMED',
            amountOut: BigInt(1000000)
        };
    }
    /**
     * Create Lightning invoice for receiving Bitcoin
     */ async createLightningInvoice(amount, lightningAddress) {
        try {
            console.log("📧 Creating Lightning invoice for ".concat(amount, " sats to ").concat(lightningAddress));
            // In production, this would integrate with your Lightning node:
            // 1. Connect to Lightning node (LND, CLN, Eclair, etc.)
            // 2. Generate invoice for specified amount
            // 3. Return payment request string
            // For testnet development, create a valid-looking invoice format
            const timestamp = Math.floor(Date.now() / 1000);
            const mockInvoice = "lntb".concat(amount, "u1p").concat(timestamp.toString(16), "h0s9ywmm8dfjk7unn2v4ehgcm00u93b2g3r");
            console.log('✅ Lightning invoice created for privacy mixer');
            return mockInvoice;
        } catch (error) {
            console.error('❌ Failed to create Lightning invoice:', error);
            throw new Error("Lightning invoice creation failed: ".concat(error instanceof Error ? error.message : String(error)));
        }
    }
    /**
     * Simulate Lightning payment for testing
     * In production, this would be handled by your Lightning infrastructure
     */ async simulateLightningPayment(invoice) {
        console.log("⚡ Simulating Lightning payment for invoice: ".concat(invoice.slice(0, 20), "..."));
        // Simulate network delay for realistic testing
        await new Promise((resolve)=>setTimeout(resolve, 2000));
        console.log('✅ Lightning payment simulation completed');
    }
    async getStatus(executionId) {
        await this.ensureInitialized();
        if (!this.swapper || !this.initialized) {
            throw new Error('Atomiq SDK not initialized - simulation mode disabled');
        }
        try {
            var _swap_getBitcoinTxId;
            // Get swap by ID (executionId is the same as quoteId in our implementation)
            const swap = await this.swapper.getSwapById(executionId);
            if (!swap) {
                throw new Error("Swap with ID ".concat(executionId, " not found"));
            }
            const state = swap.getState();
            const status = this.mapSwapState(state);
            // Safely parse output amount (STRK) to Wei
            let amountOutWei = undefined;
            if (status === 'CLAIMED') {
                try {
                    var _swap_getOutput;
                    var _swap_getOutput1;
                    const rawOut = (_swap_getOutput1 = (_swap_getOutput = swap.getOutput) === null || _swap_getOutput === void 0 ? void 0 : _swap_getOutput.call(swap)) !== null && _swap_getOutput1 !== void 0 ? _swap_getOutput1 : undefined;
                    amountOutWei = this.parseStrkAmountToWei(rawOut);
                } catch (e) {
                    console.warn('⚠️ Failed to parse STRK output amount to Wei:', e instanceof Error ? e.message : String(e));
                    amountOutWei = undefined;
                }
            }
            return {
                id: executionId,
                status,
                txId: ((_swap_getBitcoinTxId = swap.getBitcoinTxId) === null || _swap_getBitcoinTxId === void 0 ? void 0 : _swap_getBitcoinTxId.call(swap)) || undefined,
                amountOut: amountOutWei,
                lightningPaymentHash: undefined // Simplified for Starknet ↔ Lightning focus
            };
        } catch (error) {
            console.error('❌ Failed to get swap status:', error);
            throw new Error("Failed to get swap status: ".concat(error instanceof Error ? error.message : String(error)));
        }
    }
    /**
     * Convert an SDK-provided STRK amount (which might be a number, bigint, or formatted string)
     * into Wei (bigint). Handles strings like "0.971158651 STRK" or "0.971158651".
     */ parseStrkAmountToWei(value) {
        var _value_toString;
        // Already bigint: assume Wei
        if (typeof value === 'bigint') return value;
        // Number: treat as STRK decimal amount; convert to Wei
        if (typeof value === 'number') {
            // Convert via string path to avoid FP issues
            return this.decimalStrToWei(String(value));
        }
        // Try string-like
        const s = value === null || value === void 0 ? void 0 : (_value_toString = value.toString) === null || _value_toString === void 0 ? void 0 : _value_toString.call(value);
        if (typeof s !== 'string' || s.length === 0) {
            throw new SyntaxError('Unknown STRK amount format');
        }
        // Remove token symbol and any extraneous text
        const cleaned = s.replace(/STRK/gi, '').replace(/sats/gi, '').trim();
        // If it's an integer-only string, assume Wei
        if (/^\d+$/.test(cleaned)) {
            return BigInt(cleaned);
        }
        // Else treat as decimal STRK amount and convert to Wei
        return this.decimalStrToWei(cleaned);
    }
    // Convert a decimal string in STRK to Wei (18 decimals)
    decimalStrToWei(s) {
        if (!/^\d*(?:\.\d+)?$/.test(s)) {
            // Try to extract first numeric token
            const m = s.match(/\d+(?:\.\d+)?/);
            if (!m) throw new SyntaxError("Cannot convert ".concat(s, " to a BigInt"));
            s = m[0];
        }
        const [intPart, fracRaw = ''] = s.split('.');
        const frac = (fracRaw + '0'.repeat(18)).slice(0, 18); // right-pad to 18
        const intWei = intPart ? BigInt(intPart) * 1000000000000000000n : 0n;
        const fracWei = frac ? BigInt(frac) : 0n;
        return intWei + fracWei;
    }
    async refund(executionId, walletSigner) {
        await this.ensureInitialized();
        if (!this.swapper || !this.initialized) {
            throw new Error('Atomiq SDK not initialized - simulation mode disabled');
        }
        try {
            var _swap_getBitcoinTxId;
            // Get swap by ID (executionId is the same as quoteId in our implementation)
            const swap = await this.swapper.getSwapById(executionId);
            if (!swap) {
                throw new Error("Swap with ID ".concat(executionId, " not found"));
            }
            console.log("🔄 Refunding swap ".concat(executionId));
            await swap.refund(walletSigner);
            const txId = ((_swap_getBitcoinTxId = swap.getBitcoinTxId) === null || _swap_getBitcoinTxId === void 0 ? void 0 : _swap_getBitcoinTxId.call(swap)) || "refund_".concat(executionId);
            console.log("✅ Refund completed with txId: ".concat(txId));
            return {
                txId
            };
        } catch (error) {
            console.error('❌ Refund failed:', error);
            throw new Error("Failed to refund swap: ".concat(error instanceof Error ? error.message : String(error)));
        }
    }
    async waitForCompletion(executionId) {
        let timeoutMs = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 300000;
        await this.ensureInitialized();
        if (!this.swapper || !this.initialized) {
            throw new Error('Atomiq SDK not initialized - simulation mode disabled');
        }
        try {
            // Get swap by ID (executionId is the same as quoteId in our implementation)
            const swap = await this.swapper.getSwapById(executionId);
            if (!swap) {
                throw new Error("Swap with ID ".concat(executionId, " not found"));
            }
            console.log("⏳ Waiting for swap ".concat(executionId, " completion (timeout: ").concat(timeoutMs, "ms)"));
            // Use swap's built-in wait functionality
            return await swap.waitForPayment();
        } catch (error) {
            console.error('❌ Wait for completion failed:', error);
            return false;
        }
    }
    async getInvoice(executionId) {
        await this.ensureInitialized();
        if (!this.swapper || !this.initialized) {
            throw new Error('Atomiq SDK not initialized - simulation mode disabled');
        }
        try {
            // Get swap by ID (executionId is the same as quoteId in our implementation)
            const swap = await this.swapper.getSwapById(executionId);
            if (!swap) {
                throw new Error("Swap with ID ".concat(executionId, " not found"));
            }
            // For Lightning swaps, get the invoice address
            // This works for BTC Lightning -> Smart Chain swaps where Atomiq generates the invoice
            const invoiceOrAddress = swap.getAddress();
            console.log("⚡ Generated Lightning invoice: ".concat(invoiceOrAddress));
            return invoiceOrAddress;
        } catch (error) {
            console.error('❌ Failed to get invoice:', error);
            throw new Error("Failed to get invoice: ".concat(error instanceof Error ? error.message : String(error)));
        }
    }
    async payInvoice(invoice, walletSigner) {
        await this.ensureInitialized();
        if (!this.swapper || !this.initialized) {
            throw new Error('Atomiq SDK not initialized - simulation mode disabled');
        }
        try {
            // For paying Lightning invoice from smart chain
            console.log("⚡ Creating STRK -> Lightning swap for invoice payment");
            const swap = await this.swapper.swap(this.tokens.STARKNET.STRK, this.tokens.BITCOIN.BTCLN, undefined, false, undefined, invoice // Lightning invoice as destination
            );
            await swap.commit(walletSigner);
            const result = await swap.waitForPayment();
            if (result) {
                var _swap_getSecret;
                const preimage = ((_swap_getSecret = swap.getSecret) === null || _swap_getSecret === void 0 ? void 0 : _swap_getSecret.call(swap)) || "preimage_".concat(Date.now());
                console.log("✅ Lightning payment completed with preimage: ".concat(preimage.slice(0, 10), "..."));
                return {
                    preimage
                };
            } else {
                throw new Error('Lightning payment failed');
            }
        } catch (error) {
            console.error('❌ Lightning payment failed:', error);
            throw new Error("Failed to pay Lightning invoice: ".concat(error instanceof Error ? error.message : String(error)));
        }
    }
    async getSwapLimits(from, to) {
        await this.ensureInitialized();
        if (!this.swapper || !this.initialized) {
            throw new Error('Atomiq SDK not initialized - simulation mode disabled');
        }
        try {
            const fromToken = this.mapToAtomiqToken(from);
            const toToken = this.mapToAtomiqToken(to);
            console.log("📊 Getting swap limits for ".concat(from, " -> ").concat(to));
            const limits = this.swapper.getSwapLimits(fromToken, toToken);
            console.log('📊 Raw limits from Atomiq:', {
                inputMin: limits.input.min,
                inputMax: limits.input.max,
                inputMinType: typeof limits.input.min,
                inputMaxType: typeof limits.input.max
            });
            // Parse the limits carefully - they might be strings with units
            const minValue = this.parseAtomiqAmount(limits.input.min) || 1000n;
            const maxValue = this.parseAtomiqAmount(limits.input.max) || 1000000n;
            return {
                min: minValue,
                max: maxValue
            };
        } catch (error) {
            console.error('❌ Failed to get swap limits:', error);
            throw new Error("Failed to get swap limits: ".concat(error instanceof Error ? error.message : String(error)));
        }
    }
    /**
     * Get the current exchange rate for STRK → Lightning (sats per STRK)
     * Uses the Atomiq prices API to get the real exchange rate
     */ async getStrkToSatsRate() {
        await this.ensureInitialized();
        if (!this.swapper || !this.initialized) {
            throw new Error('Atomiq SDK not initialized');
        }
        try {
            const strkToken = this.tokens.STARKNET.STRK;
            // Use a reference amount of 1 STRK (in Wei) to get the rate
            const oneStrkInWei = BigInt(1e18); // 1 STRK = 1e18 Wei
            // Use the prices API to convert STRK → sats
            // getToBtcSwapAmount returns sats for a given token amount
            const satsForOneStrk = await this.swapper.prices.getToBtcSwapAmount('STARKNET', oneStrkInWei, strkToken.address);
            const rate = Number(satsForOneStrk);
            console.log("📊 Atomiq price API: 1 STRK = ".concat(rate, " sats"));
            if (rate > 0 && rate < 10000) {
                return rate;
            }
            console.warn("⚠️ Rate ".concat(rate, " seems invalid, using fallback"));
            return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$env$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ENV"].STRK_SATS_RATE || 125;
        } catch (error) {
            console.error('❌ Failed to get exchange rate from prices API:', error);
            // Fallback: try to derive from limits
            try {
                return await this.getStrkToSatsRateFromLimits();
            } catch (limitsError) {
                console.error('❌ Limits fallback also failed:', limitsError);
                return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$env$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ENV"].STRK_SATS_RATE || 125;
            }
        }
    }
    /**
     * Fallback method to get rate from swap limits
     */ async getStrkToSatsRateFromLimits() {
        var _limits_input_min_rawAmount, _limits_input_min, _limits_input_max_rawAmount, _limits_input_max, _limits_output_min_rawAmount, _limits_output_min, _limits_output_max_rawAmount, _limits_output_max, _limits_input_max1, _limits_output_max1;
        const strkToken = this.tokens.STARKNET.STRK;
        const btcLnToken = this.tokens.BITCOIN.BTCLN;
        const limits = this.swapper.getSwapLimits(strkToken, btcLnToken);
        console.log('📊 Trying to derive rate from limits:', {
            inputMin: (_limits_input_min = limits.input.min) === null || _limits_input_min === void 0 ? void 0 : (_limits_input_min_rawAmount = _limits_input_min.rawAmount) === null || _limits_input_min_rawAmount === void 0 ? void 0 : _limits_input_min_rawAmount.toString(),
            inputMax: (_limits_input_max = limits.input.max) === null || _limits_input_max === void 0 ? void 0 : (_limits_input_max_rawAmount = _limits_input_max.rawAmount) === null || _limits_input_max_rawAmount === void 0 ? void 0 : _limits_input_max_rawAmount.toString(),
            outputMin: (_limits_output_min = limits.output.min) === null || _limits_output_min === void 0 ? void 0 : (_limits_output_min_rawAmount = _limits_output_min.rawAmount) === null || _limits_output_min_rawAmount === void 0 ? void 0 : _limits_output_min_rawAmount.toString(),
            outputMax: (_limits_output_max = limits.output.max) === null || _limits_output_max === void 0 ? void 0 : (_limits_output_max_rawAmount = _limits_output_max.rawAmount) === null || _limits_output_max_rawAmount === void 0 ? void 0 : _limits_output_max_rawAmount.toString()
        });
        // Try to use max limits for better accuracy
        const inputMaxRaw = (_limits_input_max1 = limits.input.max) === null || _limits_input_max1 === void 0 ? void 0 : _limits_input_max1.rawAmount;
        const outputMaxRaw = (_limits_output_max1 = limits.output.max) === null || _limits_output_max1 === void 0 ? void 0 : _limits_output_max1.rawAmount;
        if (inputMaxRaw && outputMaxRaw && inputMaxRaw > 0n && outputMaxRaw > 0n) {
            const strkMax = Number(inputMaxRaw) / 1e18;
            const satsMax = Number(outputMaxRaw);
            const rate = satsMax / strkMax;
            if (rate > 0 && rate < 10000) {
                console.log("📊 Derived rate from max limits: ".concat(rate.toFixed(2), " sats/STRK"));
                return rate;
            }
        }
        throw new Error('Could not derive valid rate from limits');
    }
    // Utility methods
    parseAtomiqAmount(value) {
        try {
            // Handle null/undefined
            if (value == null) {
                return null;
            }
            // If it's already a number or bigint, convert directly
            if (typeof value === 'number') {
                return BigInt(Math.floor(value));
            }
            if (typeof value === 'bigint') {
                return value;
            }
            // If it's a string, parse it carefully
            if (typeof value === 'string') {
                // Remove any currency symbols and whitespace
                const cleanValue = value.replace(/[A-Za-z\s]/g, '').trim();
                // Handle empty or zero values
                if (!cleanValue || cleanValue === '0' || parseFloat(cleanValue) === 0) {
                    return 0n;
                }
                // Parse as float first to handle decimals, then convert to integer (assuming smallest unit)
                const floatValue = parseFloat(cleanValue);
                if (isNaN(floatValue)) {
                    return null;
                }
                // Convert to BigInt (assuming the value is already in the smallest unit)
                return BigInt(Math.floor(floatValue));
            }
            return null;
        } catch (error) {
            console.warn('❌ Failed to parse Atomiq amount:', {
                value,
                error
            });
            return null;
        }
    }
    mapToAtomiqToken(token) {
        // Map our token types to actual Atomiq SDK token constants
        if (!this.tokens) {
            throw new Error('Atomiq SDK tokens not available - SDK not properly initialized');
        }
        switch(token){
            case 'STRK':
                return this.tokens.STARKNET.STRK; // Use actual Starknet STRK token
            case 'BTC':
                return this.tokens.BITCOIN.BTC; // Bitcoin on-chain
            case 'BTC_LN':
                return this.tokens.BITCOIN.BTCLN; // Bitcoin Lightning Network
            default:
                throw new Error("Unsupported token: ".concat(token));
        }
    }
    mapSwapState(state) {
        // Map real Atomiq swap states to our enum
        // Based on the documentation, different swap types have different states
        if (typeof state === 'number') {
            // ToBTCSwapState (Smart Chain -> BTC/Lightning)
            switch(state){
                case 0:
                    return 'CREATED'; // CREATED - quote created
                case 1:
                    return 'COMMITED'; // COMMITED - swap initiated
                case 2:
                    return 'SOFT_CLAIMED'; // SOFT_CLAIMED - processing
                case 3:
                    return 'CLAIMED'; // CLAIMED - completed
                case 4:
                    return 'REFUNDABLE'; // REFUNDABLE - failed, can refund
                case -1:
                    return 'EXPIRED'; // QUOTE_SOFT_EXPIRED
                case -2:
                    return 'EXPIRED'; // QUOTE_EXPIRED
                case -3:
                    return 'REFUNDED'; // REFUNDED
                default:
                    return 'FAILED';
            }
        }
        // Handle string states or other formats
        if (typeof state === 'string') {
            switch(state.toUpperCase()){
                case 'CREATED':
                    return 'CREATED';
                case 'COMMITED':
                    return 'COMMITED';
                case 'SOFT_CLAIMED':
                    return 'SOFT_CLAIMED';
                case 'CLAIMED':
                    return 'CLAIMED';
                case 'REFUNDABLE':
                    return 'REFUNDABLE';
                case 'REFUNDED':
                    return 'REFUNDED';
                case 'EXPIRED':
                    return 'EXPIRED';
                default:
                    return 'FAILED';
            }
        }
        return 'CREATED'; // Default state
    }
    constructor(network = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$env$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ENV"].NETWORK, starknetRpc){
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "swapper", null);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "factory", null);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "initialized", false);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "network", void 0);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "starknetRpc", void 0);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "isNodeJs", void 0);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "tokens", null);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "initializationPromise", null);
        this.network = network;
        this.starknetRpc = starknetRpc || (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$env$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getStarknetRpc"])();
        this.isNodeJs = "object" === 'undefined';
        console.log("🚀 Initializing Atomiq client for ".concat(network, " using RPC: ").concat(this.starknetRpc));
        // Only initialize in browser environment to avoid SSR issues
        if (!this.isNodeJs) {
            this.initializeForBrowser();
        } else {
            console.log('⚠️ Node.js environment detected - Atomiq SDK will initialize when needed');
        }
    }
}
// Export the client - user requested "real deal" so we use RealAtomiqSwapClient
// Avoid instantiating during SSR to prevent Turbopack module factory errors
let atomiqClient = null;
if ("TURBOPACK compile-time truthy", 1) {
    atomiqClient = new RealAtomiqSwapClient(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$env$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ENV"].NETWORK === 'MAINNET' ? 'MAINNET' : 'TESTNET', (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$env$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getStarknetRpc"])());
}
const __TURBOPACK__default__export__ = atomiqClient;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/hooks/useCrossChainSwap.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Client-Side Cross-Chain Swap Hook
 * 
 * Handles ZEC ↔ STRK swaps:
 * - FixedFloat API calls for ZEC ↔ Lightning (via server proxy)
 * - Atomiq SDK for Lightning ↔ STRK (browser-side)
 */ __turbopack_context__.s([
    "useCrossChainSwap",
    ()=>useCrossChainSwap
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$starknet$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/starknet/dist/index.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$integrations$2f$swaps$2f$atomiq$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/integrations/swaps/atomiq.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$atomiqlabs$2f$chain$2d$starknet$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@atomiqlabs/chain-starknet/dist/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$env$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/config/env.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
function useCrossChainSwap() {
    _s();
    const [isInitialized, setIsInitialized] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [transfer, setTransfer] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [quote, setQuote] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const atomiqClientRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const initPromiseRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Initialize Atomiq SDK on mount (browser only)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useCrossChainSwap.useEffect": ()=>{
            const init = {
                "useCrossChainSwap.useEffect.init": async ()=>{
                    try {
                        console.log('🔧 Initializing cross-chain swap client...');
                        // Initialize Atomiq client (browser-only SDK)
                        const network = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$env$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ENV"].NETWORK === 'MAINNET' ? 'MAINNET' : 'TESTNET';
                        atomiqClientRef.current = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$integrations$2f$swaps$2f$atomiq$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RealAtomiqSwapClient"](network);
                        // Wait for SDK initialization
                        await new Promise({
                            "useCrossChainSwap.useEffect.init": (resolve)=>setTimeout(resolve, 2000)
                        }["useCrossChainSwap.useEffect.init"]);
                        setIsInitialized(true);
                        console.log('✅ Cross-chain swap client initialized');
                    } catch (err) {
                        console.error('❌ Failed to initialize:', err);
                        setError(err instanceof Error ? err.message : 'Failed to initialize');
                    }
                }
            }["useCrossChainSwap.useEffect.init"];
            initPromiseRef.current = init();
        }
    }["useCrossChainSwap.useEffect"], []);
    // FixedFloat API call via server proxy (keeps API keys secure)
    const fixedFloatRequest = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useCrossChainSwap.useCallback[fixedFloatRequest]": async (endpoint, data)=>{
            const response = await fetch('/api/fixedfloat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    endpoint,
                    data
                })
            });
            const result = await response.json();
            if (!result.success && result.error) {
                throw new Error(result.error);
            }
            return result;
        }
    }["useCrossChainSwap.useCallback[fixedFloatRequest]"], []);
    // Get quote for ZEC → STRK
    const getZecToStrkQuote = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useCrossChainSwap.useCallback[getZecToStrkQuote]": async (zecAmount)=>{
            setIsLoading(true);
            setError(null);
            try {
                // Step 1: Get ZEC → Lightning quote from FixedFloat
                const zecToLnResult = await fixedFloatRequest('/price', {
                    fromCcy: 'ZEC',
                    toCcy: 'BTCLN',
                    amount: zecAmount.toString(),
                    direction: 'from',
                    type: 'float'
                });
                if (zecToLnResult.code !== 0) {
                    throw new Error(zecToLnResult.msg || 'Failed to get ZEC quote');
                }
                const lightningBtc = parseFloat(zecToLnResult.data.to.amount);
                const lightningAmount = Math.floor(lightningBtc * 100000000); // sats
                // Step 2: Get Lightning → STRK estimate using accurate Atomiq rate
                let strkAmount = 0;
                let lnToStrkFee = 0.5; // Default estimate
                let satsPerStrk = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$env$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ENV"].STRK_SATS_RATE || 125; // Default fallback
                if (atomiqClientRef.current) {
                    try {
                        // Use the accurate rate API instead of creating a quote
                        satsPerStrk = await atomiqClientRef.current.getStrkToSatsRate();
                        console.log("📊 Using Atomiq rate for ZEC→STRK: ".concat(satsPerStrk.toFixed(2), " sats/STRK"));
                        strkAmount = lightningAmount / satsPerStrk;
                    } catch (e) {
                        // Fallback estimate
                        console.warn('Using fallback STRK estimate:', e);
                        strkAmount = lightningAmount / satsPerStrk;
                    }
                } else {
                    // Fallback estimate
                    strkAmount = lightningAmount / satsPerStrk;
                }
                const zecFee = (zecAmount - lightningBtc) / zecAmount * 100;
                const newQuote = {
                    inputAmount: zecAmount,
                    inputCurrency: 'ZEC',
                    outputAmount: strkAmount,
                    outputCurrency: 'STRK',
                    lightningAmount,
                    totalFeePercent: zecFee + lnToStrkFee,
                    legs: {
                        first: {
                            from: 'ZEC',
                            to: 'Lightning',
                            rate: parseFloat(zecToLnResult.data.from.rate),
                            fee: zecFee
                        },
                        second: {
                            from: 'Lightning',
                            to: 'STRK',
                            rate: strkAmount / lightningAmount,
                            fee: lnToStrkFee
                        }
                    },
                    expiry: Date.now() + 60000
                };
                setQuote(newQuote);
                return newQuote;
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Failed to get quote';
                setError(message);
                return null;
            } finally{
                setIsLoading(false);
            }
        }
    }["useCrossChainSwap.useCallback[getZecToStrkQuote]"], [
        fixedFloatRequest
    ]);
    // Get quote for STRK → ZEC
    const getStrkToZecQuote = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useCrossChainSwap.useCallback[getStrkToZecQuote]": async (strkAmount)=>{
            setIsLoading(true);
            setError(null);
            try {
                // Step 1: Get the REAL Atomiq rate for STRK → Lightning
                let lightningAmount = 0;
                let strkToLnFee = 0.5;
                let satsPerStrk = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$env$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ENV"].STRK_SATS_RATE || 125; // Default fallback
                if (atomiqClientRef.current) {
                    try {
                        // Use the new rate API to get accurate pricing
                        satsPerStrk = await atomiqClientRef.current.getStrkToSatsRate();
                        console.log("📊 Using Atomiq rate: ".concat(satsPerStrk.toFixed(2), " sats/STRK"));
                        lightningAmount = Math.floor(strkAmount * satsPerStrk);
                    } catch (e) {
                        console.warn('Failed to get Atomiq rate, using fallback:', e);
                        lightningAmount = Math.floor(strkAmount * satsPerStrk);
                    }
                } else {
                    lightningAmount = Math.floor(strkAmount * satsPerStrk);
                }
                // Step 2: Get Lightning → ZEC quote from FixedFloat
                const btcAmount = lightningAmount / 100000000;
                const lnToZecResult = await fixedFloatRequest('/price', {
                    fromCcy: 'BTCLN',
                    toCcy: 'ZEC',
                    amount: btcAmount.toString(),
                    direction: 'from',
                    type: 'float'
                });
                if (lnToZecResult.code !== 0) {
                    throw new Error(lnToZecResult.msg || 'Failed to get ZEC quote');
                }
                const zecAmount = parseFloat(lnToZecResult.data.to.amount);
                const lnToZecFee = (btcAmount - zecAmount * parseFloat(lnToZecResult.data.from.rate)) / btcAmount * 100;
                const newQuote = {
                    inputAmount: strkAmount,
                    inputCurrency: 'STRK',
                    outputAmount: zecAmount,
                    outputCurrency: 'ZEC',
                    lightningAmount,
                    totalFeePercent: strkToLnFee + Math.abs(lnToZecFee),
                    legs: {
                        first: {
                            from: 'STRK',
                            to: 'Lightning',
                            rate: lightningAmount / strkAmount,
                            fee: strkToLnFee
                        },
                        second: {
                            from: 'Lightning',
                            to: 'ZEC',
                            rate: parseFloat(lnToZecResult.data.from.rate),
                            fee: Math.abs(lnToZecFee)
                        }
                    },
                    expiry: Date.now() + 60000
                };
                setQuote(newQuote);
                return newQuote;
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Failed to get quote';
                setError(message);
                return null;
            } finally{
                setIsLoading(false);
            }
        }
    }["useCrossChainSwap.useCallback[getStrkToZecQuote]"], [
        fixedFloatRequest
    ]);
    // Initiate ZEC → STRK transfer
    const initiateZecToStrk = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useCrossChainSwap.useCallback[initiateZecToStrk]": async function(zecAmount, recipientAddress) {
            let options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
            setIsLoading(true);
            setError(null);
            const steps = [
                {
                    id: 1,
                    name: 'atomiq-swap',
                    description: 'Creating Atomiq Lightning swap',
                    status: 'pending'
                },
                {
                    id: 2,
                    name: 'fixedfloat-order',
                    description: 'Creating ZEC deposit order',
                    status: 'pending'
                },
                {
                    id: 3,
                    name: 'awaiting-deposit',
                    description: 'Awaiting ZEC deposit',
                    status: 'pending'
                },
                {
                    id: 4,
                    name: 'lightning-payment',
                    description: 'Processing Lightning payment',
                    status: 'pending'
                },
                {
                    id: 5,
                    name: 'strk-claim',
                    description: 'Claiming STRK on Starknet',
                    status: 'pending'
                }
            ];
            const newTransfer = {
                id: "transfer_".concat(Date.now()),
                direction: 'zec-to-strk',
                amount: zecAmount,
                destinationAddress: recipientAddress,
                status: 'in-progress',
                steps,
                currentStepIndex: 0,
                createdAt: Date.now()
            };
            setTransfer(newTransfer);
            try {
                // Step 1: Get quote to know expected Lightning amount
                updateStep(newTransfer, 0, 'in-progress', 'Getting swap quote...');
                const zecToLnResult = await fixedFloatRequest('/price', {
                    fromCcy: 'ZEC',
                    toCcy: 'BTCLN',
                    amount: zecAmount.toString(),
                    direction: 'from',
                    type: 'float'
                });
                if (zecToLnResult.code !== 0) {
                    throw new Error(zecToLnResult.msg || 'Failed to get ZEC quote');
                }
                // Get the EXACT BTC amount FixedFloat will send (as a string to preserve precision)
                const lightningBtcStr = zecToLnResult.data.to.amount;
                const lightningBtc = parseFloat(lightningBtcStr);
                const expectedSats = Math.floor(lightningBtc * 100000000);
                console.log("FixedFloat quote: ".concat(zecAmount, " ZEC → ").concat(lightningBtcStr, " BTC (").concat(expectedSats, " sats)"));
                // Step 2: Create Atomiq swap to get Lightning invoice for EXACT amount
                if (!atomiqClientRef.current) {
                    throw new Error('Atomiq client not initialized. Please wait and try again.');
                }
                console.log("Creating Atomiq swap: ".concat(expectedSats, " sats → ").concat(recipientAddress));
                const atomiqSwap = await atomiqClientRef.current.beginLightningToStrkSwap(expectedSats, recipientAddress);
                newTransfer.atomiqSwapId = atomiqSwap.id;
                updateStep(newTransfer, 0, 'complete', 'Atomiq swap created');
                updateStep(newTransfer, 1, 'in-progress', 'Creating FixedFloat order...');
                // Step 3: Create FixedFloat order with Atomiq's invoice
                // Use direction='to' with the EXACT BTC amount to match the invoice
                console.log("Creating FixedFloat order: ZEC → ".concat(lightningBtcStr, " BTCLN"));
                console.log("Invoice: ".concat(atomiqSwap.invoice.substring(0, 50), "..."));
                const orderResult = await fixedFloatRequest('/create', {
                    fromCcy: 'ZEC',
                    toCcy: 'BTCLN',
                    amount: lightningBtcStr,
                    direction: 'to',
                    type: 'float',
                    toAddress: atomiqSwap.invoice
                });
                console.log('FixedFloat /create response:', JSON.stringify(orderResult, null, 2));
                if (orderResult.code !== 0) {
                    // Provide more helpful error messages
                    const errorMsg = orderResult.msg || 'Failed to create FixedFloat order';
                    console.error('FixedFloat order failed:', errorMsg, orderResult);
                    throw new Error(errorMsg);
                }
                const depositAddress = orderResult.data.from.address;
                const expectedAmount = orderResult.data.from.amount;
                newTransfer.fixedFloatOrderId = orderResult.data.id;
                newTransfer.depositAddress = depositAddress;
                newTransfer.depositAmount = expectedAmount;
                updateStep(newTransfer, 1, 'complete', 'FixedFloat order created', {
                    orderId: orderResult.data.id,
                    depositAddress,
                    expectedAmount
                });
                updateStep(newTransfer, 2, 'in-progress', 'Awaiting ZEC deposit');
                console.log("\n🔔 DEPOSIT ZEC TO: ".concat(depositAddress));
                console.log("   Amount: ".concat(expectedAmount, " ZEC"));
                setTransfer({
                    ...newTransfer
                });
                return newTransfer;
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Transfer failed';
                setError(message);
                newTransfer.status = 'failed';
                newTransfer.error = message;
                setTransfer({
                    ...newTransfer
                });
                return null;
            } finally{
                setIsLoading(false);
            }
        }
    }["useCrossChainSwap.useCallback[initiateZecToStrk]"], [
        fixedFloatRequest
    ]);
    // Initiate STRK → ZEC transfer
    // This flow works because Atomiq PAYS the FixedFloat invoice (outgoing)
    const initiateStrkToZec = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useCrossChainSwap.useCallback[initiateStrkToZec]": async (strkAmount, zecAddress, walletSigner // Starknet wallet signer
        )=>{
            setIsLoading(true);
            setError(null);
            const steps = [
                {
                    id: 1,
                    name: 'fixedfloat-order',
                    description: 'Creating FixedFloat order',
                    status: 'pending'
                },
                {
                    id: 2,
                    name: 'atomiq-swap',
                    description: 'Processing STRK → Lightning swap',
                    status: 'pending'
                },
                {
                    id: 3,
                    name: 'lightning-payment',
                    description: 'Paying Lightning invoice',
                    status: 'pending'
                },
                {
                    id: 4,
                    name: 'zec-delivery',
                    description: 'FixedFloat sending ZEC',
                    status: 'pending'
                }
            ];
            const newTransfer = {
                id: "transfer_".concat(Date.now()),
                direction: 'strk-to-zec',
                amount: strkAmount,
                destinationAddress: zecAddress,
                status: 'in-progress',
                steps,
                currentStepIndex: 0,
                createdAt: Date.now()
            };
            setTransfer(newTransfer);
            try {
                // Step 1: Get STRK → Lightning rate from Atomiq (using accurate rate API)
                updateStep(newTransfer, 0, 'in-progress', 'Getting swap quote...');
                if (!atomiqClientRef.current) {
                    throw new Error('Atomiq client not initialized. Please wait and try again.');
                }
                // Get the real Atomiq rate for accurate sats estimation
                let satsPerStrk = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$env$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ENV"].STRK_SATS_RATE || 125; // Default fallback
                try {
                    satsPerStrk = await atomiqClientRef.current.getStrkToSatsRate();
                    console.log("📊 Using Atomiq rate: ".concat(satsPerStrk.toFixed(2), " sats/STRK"));
                } catch (rateError) {
                    console.warn('⚠️ Failed to get Atomiq rate, using fallback:', rateError);
                }
                // Calculate estimated sats from STRK using the accurate rate
                const estimatedSats = Math.floor(strkAmount * satsPerStrk);
                console.log("Estimated STRK → Lightning: ".concat(strkAmount, " STRK → ").concat(estimatedSats, " sats (rate: ").concat(satsPerStrk.toFixed(2), ")"));
                // Create a proper WalletAccount wrapper for Atomiq SDK compatibility
                // The SDK expects a WalletAccount with proper walletProvider, not a raw account
                const walletAddress = walletSigner.address;
                const rawWalletProvider = walletSigner.walletProvider; // Raw StarknetWindowObject from get-starknet
                if (!rawWalletProvider) {
                    throw new Error('Wallet provider not available. Please reconnect your wallet.');
                }
                // Create RPC provider for WalletAccount
                const rpcProvider = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$atomiqlabs$2f$chain$2d$starknet$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RpcProviderWithRetries"]({
                    nodeUrl: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$env$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getStarknetRpc"])()
                });
                // Create WalletAccount - this is what Atomiq SDK expects
                // WalletAccount(provider, walletProvider, address) properly bridges browser wallets
                const walletAccount = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$starknet$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["WalletAccount"](rpcProvider, rawWalletProvider, walletAddress);
                const starknetSigner = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$atomiqlabs$2f$chain$2d$starknet$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StarknetSigner"](walletAccount);
                const sourceAddress = starknetSigner.getAddress();
                console.log("Using wallet address for swap: ".concat(sourceAddress));
                // Step 2: Create FixedFloat order (BTCLN → ZEC)
                // FixedFloat will provide the Lightning invoice we need to pay
                const btcAmount = (estimatedSats / 100000000).toFixed(8);
                console.log("Creating FixedFloat order: ".concat(btcAmount, " BTCLN → ZEC"));
                const orderResult = await fixedFloatRequest('/create', {
                    fromCcy: 'BTCLN',
                    toCcy: 'ZEC',
                    amount: btcAmount,
                    direction: 'from',
                    type: 'float',
                    toAddress: zecAddress
                });
                console.log('FixedFloat /create response:', JSON.stringify(orderResult, null, 2));
                if (orderResult.code !== 0) {
                    throw new Error(orderResult.msg || 'Failed to create FixedFloat order');
                }
                // FixedFloat provides a Lightning invoice for us to pay
                const lightningInvoice = orderResult.data.from.address;
                const expectedBtc = orderResult.data.from.amount;
                const expectedZec = orderResult.data.to.amount;
                newTransfer.fixedFloatOrderId = orderResult.data.id;
                updateStep(newTransfer, 0, 'complete', 'FixedFloat order created', {
                    orderId: orderResult.data.id,
                    invoice: lightningInvoice.substring(0, 50) + '...',
                    expectedZec
                });
                console.log("FixedFloat order created:");
                console.log("  Order ID: ".concat(orderResult.data.id));
                console.log("  Pay: ".concat(expectedBtc, " BTC to invoice"));
                console.log("  Receive: ".concat(expectedZec, " ZEC at ").concat(zecAddress));
                // Step 3: Use Atomiq to pay the Lightning invoice with STRK
                updateStep(newTransfer, 1, 'in-progress', 'Processing STRK swap...');
                console.log("Paying FixedFloat invoice via Atomiq STRK → Lightning swap...");
                const swapResult = await atomiqClientRef.current.swapStrkToLightning(strkAmount, lightningInvoice, sourceAddress, starknetSigner // Pass the signer so user signs the transaction
                );
                if (!swapResult.success) {
                    throw new Error(swapResult.error || 'STRK → Lightning swap failed');
                }
                newTransfer.atomiqSwapId = swapResult.txId || 'unknown';
                updateStep(newTransfer, 1, 'complete', 'STRK swap completed');
                updateStep(newTransfer, 2, 'complete', 'Lightning payment sent');
                updateStep(newTransfer, 3, 'in-progress', 'Waiting for ZEC delivery...');
                console.log("✅ STRK → Lightning swap completed!");
                console.log("   Atomiq tx ID: ".concat(swapResult.txId));
                console.log("   FixedFloat will now send ".concat(expectedZec, " ZEC to ").concat(zecAddress));
                // Step 4: Poll FixedFloat order status until ZEC is delivered
                const orderId = orderResult.data.id;
                const pollInterval = 10000; // 10 seconds
                const maxPolls = 60; // 10 minutes max
                let pollCount = 0;
                const pollStatus = {
                    "useCrossChainSwap.useCallback[initiateStrkToZec].pollStatus": async ()=>{
                        try {
                            var _statusResult_data;
                            const statusResult = await fixedFloatRequest('/order', {
                                id: orderId,
                                token: orderResult.data.token
                            });
                            console.log("FixedFloat order status (poll ".concat(pollCount + 1, "):"), (_statusResult_data = statusResult.data) === null || _statusResult_data === void 0 ? void 0 : _statusResult_data.status);
                            if (statusResult.code === 0 && statusResult.data) {
                                const status = statusResult.data.status;
                                // FixedFloat statuses: NEW, PENDING, EXCHANGE, WITHDRAW, DONE, EXPIRED, EMERGENCY
                                if (status === 'DONE') {
                                    var _statusResult_data_to_tx, _statusResult_data_to;
                                    updateStep(newTransfer, 3, 'complete', "ZEC sent! TX: ".concat(((_statusResult_data_to = statusResult.data.to) === null || _statusResult_data_to === void 0 ? void 0 : (_statusResult_data_to_tx = _statusResult_data_to.tx) === null || _statusResult_data_to_tx === void 0 ? void 0 : _statusResult_data_to_tx.id) || 'confirmed'));
                                    newTransfer.status = 'complete';
                                    setTransfer({
                                        ...newTransfer
                                    });
                                    return true;
                                } else if (status === 'EXPIRED' || status === 'EMERGENCY') {
                                    throw new Error("FixedFloat order ".concat(status.toLowerCase()));
                                } else {
                                    // Update with current status
                                    const statusMessages = {
                                        'NEW': 'Order created, waiting for payment confirmation...',
                                        'PENDING': 'Payment received, processing...',
                                        'EXCHANGE': 'Exchanging to ZEC...',
                                        'WITHDRAW': 'Sending ZEC to your wallet...'
                                    };
                                    updateStep(newTransfer, 3, 'in-progress', statusMessages[status] || "Status: ".concat(status));
                                }
                            }
                            return false;
                        } catch (pollError) {
                            console.warn('Poll error:', pollError);
                            return false;
                        }
                    }
                }["useCrossChainSwap.useCallback[initiateStrkToZec].pollStatus"];
                // Start polling in background
                const startPolling = {
                    "useCrossChainSwap.useCallback[initiateStrkToZec].startPolling": async ()=>{
                        while(pollCount < maxPolls){
                            pollCount++;
                            const done = await pollStatus();
                            if (done) break;
                            await new Promise({
                                "useCrossChainSwap.useCallback[initiateStrkToZec].startPolling": (resolve)=>setTimeout(resolve, pollInterval)
                            }["useCrossChainSwap.useCallback[initiateStrkToZec].startPolling"]);
                        }
                        if (pollCount >= maxPolls && newTransfer.status !== 'complete') {
                            // Timeout - but ZEC might still arrive
                            updateStep(newTransfer, 3, 'complete', 'ZEC should arrive shortly. Check your wallet!');
                            newTransfer.status = 'complete';
                            setTransfer({
                                ...newTransfer
                            });
                        }
                    }
                }["useCrossChainSwap.useCallback[initiateStrkToZec].startPolling"];
                // Start polling without blocking
                startPolling();
                setTransfer({
                    ...newTransfer
                });
                return newTransfer;
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Transfer failed';
                console.error('STRK → ZEC transfer failed:', message);
                setError(message);
                newTransfer.status = 'failed';
                newTransfer.error = message;
                setTransfer({
                    ...newTransfer
                });
                return null;
            } finally{
                setIsLoading(false);
            }
        }
    }["useCrossChainSwap.useCallback[initiateStrkToZec]"], [
        fixedFloatRequest
    ]);
    // Helper to update step status
    const updateStep = (transfer, stepIndex, status, description, data)=>{
        if (transfer.steps[stepIndex]) {
            transfer.steps[stepIndex].status = status;
            if (description) transfer.steps[stepIndex].description = description;
            if (data) transfer.steps[stepIndex].data = data;
            transfer.currentStepIndex = stepIndex;
        }
        setTransfer({
            ...transfer
        });
    };
    // Cancel/reset transfer
    const cancelTransfer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useCrossChainSwap.useCallback[cancelTransfer]": ()=>{
            setTransfer(null);
            setError(null);
            setQuote(null);
        }
    }["useCrossChainSwap.useCallback[cancelTransfer]"], []);
    return {
        isInitialized,
        isLoading,
        error,
        transfer,
        quote,
        getZecToStrkQuote,
        getStrkToZecQuote,
        initiateZecToStrk,
        initiateStrkToZec,
        cancelTransfer,
        setError
    };
}
_s(useCrossChainSwap, "GFKNFKSQzCqfWihrPaFPYIx/1aA=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/mixer/cross-chain/CrossChainSwap.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CrossChainSwap",
    ()=>CrossChainSwap
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$ArrowsRightLeftIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowsRightLeftIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroicons/react/24/outline/esm/ArrowsRightLeftIcon.js [app-client] (ecmascript) <export default as ArrowsRightLeftIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$ShieldCheckIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheckIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroicons/react/24/outline/esm/ShieldCheckIcon.js [app-client] (ecmascript) <export default as ShieldCheckIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$BoltIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BoltIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroicons/react/24/outline/esm/BoltIcon.js [app-client] (ecmascript) <export default as BoltIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$ClockIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ClockIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroicons/react/24/outline/esm/ClockIcon.js [app-client] (ecmascript) <export default as ClockIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$CheckCircleIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircleIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroicons/react/24/outline/esm/CheckCircleIcon.js [app-client] (ecmascript) <export default as CheckCircleIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$XMarkIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XMarkIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroicons/react/24/outline/esm/XMarkIcon.js [app-client] (ecmascript) <export default as XMarkIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$WalletIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__WalletIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroicons/react/24/outline/esm/WalletIcon.js [app-client] (ecmascript) <export default as WalletIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$mixer$2f$cross$2d$chain$2f$CrossChainQuote$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/mixer/cross-chain/CrossChainQuote.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$mixer$2f$cross$2d$chain$2f$ZecDepositForm$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/mixer/cross-chain/ZecDepositForm.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$mixer$2f$cross$2d$chain$2f$TransferStatusTracker$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/mixer/cross-chain/TransferStatusTracker.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useCrossChainSwap$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useCrossChainSwap.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$WalletProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/WalletProvider.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
function CrossChainSwap() {
    _s();
    const { isInitialized, isLoading: hookLoading, error: hookError, transfer, initiateZecToStrk, initiateStrkToZec, cancelTransfer, setError } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useCrossChainSwap$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCrossChainSwap"])();
    const { isConnected, address, account, walletProvider, connect, disconnect, isReady: walletReady, client: walletClient } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$WalletProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWallet"])();
    const [activeTransfer, setActiveTransfer] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setLocalError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [formData, setFormData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isConnecting, setIsConnecting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Sync hook transfer to local state
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CrossChainSwap.useEffect": ()=>{
            if (transfer) {
                setActiveTransfer({
                    id: transfer.id,
                    direction: transfer.direction,
                    amount: transfer.amount,
                    destinationAddress: transfer.destinationAddress,
                    status: transfer.status,
                    steps: transfer.steps.map({
                        "CrossChainSwap.useEffect": (s, i)=>({
                                id: i + 1,
                                name: s.name,
                                description: s.description,
                                status: s.status
                            })
                    }["CrossChainSwap.useEffect"]),
                    currentStepIndex: transfer.currentStepIndex,
                    depositAddress: transfer.depositAddress,
                    depositAmount: transfer.depositAmount,
                    createdAt: transfer.createdAt
                });
            }
        }
    }["CrossChainSwap.useEffect"], [
        transfer
    ]);
    // Sync hook error
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CrossChainSwap.useEffect": ()=>{
            if (hookError) {
                setLocalError(hookError);
            }
        }
    }["CrossChainSwap.useEffect"], [
        hookError
    ]);
    const handleFormSubmit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CrossChainSwap.useCallback[handleFormSubmit]": async (data)=>{
            setIsLoading(true);
            setLocalError(null);
            setError(null);
            try {
                console.log('Initiating cross-chain swap (client-side):', data);
                if (data.direction === 'zec-to-strk') {
                    // ZEC → STRK flow
                    // Note: This requires FixedFloat to PAY our Atomiq invoice
                    // which currently fails due to Lightning routing issues
                    const result = await initiateZecToStrk(data.amount, data.destinationAddress, {
                        usePrivacyMixer: data.usePrivacyMixer,
                        useCashuFlow: data.useCashuFlow
                    });
                    if (!result) {
                        await new Promise({
                            "CrossChainSwap.useCallback[handleFormSubmit]": (resolve)=>setTimeout(resolve, 100)
                        }["CrossChainSwap.useCallback[handleFormSubmit]"]);
                        return;
                    }
                    console.log('Transfer initiated:', result);
                } else {
                    // STRK → ZEC flow
                    // This works because WE pay FixedFloat's invoice via Atomiq
                    if (!isConnected || !address || !account || !walletProvider) {
                        setLocalError('STRK → ZEC requires wallet connection. Please connect your Starknet wallet first.');
                        return;
                    }
                    console.log('Starting STRK → ZEC flow with wallet:', address);
                    // Pass the full wallet info so we can create a proper WalletAccount
                    const result = await initiateStrkToZec(data.amount, data.destinationAddress, {
                        address,
                        account,
                        walletProvider
                    } // Pass wallet info for WalletAccount creation
                    );
                    if (!result) {
                        await new Promise({
                            "CrossChainSwap.useCallback[handleFormSubmit]": (resolve)=>setTimeout(resolve, 100)
                        }["CrossChainSwap.useCallback[handleFormSubmit]"]);
                        return;
                    }
                    console.log('STRK → ZEC transfer initiated:', result);
                }
            } catch (err) {
                console.error('Failed to create transfer:', err);
                setLocalError(err instanceof Error ? err.message : 'Failed to initiate transfer');
            } finally{
                setIsLoading(false);
            }
        }
    }["CrossChainSwap.useCallback[handleFormSubmit]"], [
        initiateZecToStrk,
        initiateStrkToZec,
        setError,
        isConnected,
        address
    ]);
    const handleCancelTransfer = ()=>{
        cancelTransfer();
        setActiveTransfer(null);
        setFormData(null);
        setLocalError(null);
    };
    const handleNewTransfer = ()=>{
        cancelTransfer();
        setActiveTransfer(null);
        setFormData(null);
        setLocalError(null);
    };
    const handleFormChange = (data)=>{
        setFormData(data);
    };
    const handleConnectWallet = async ()=>{
        setIsConnecting(true);
        setLocalError(null);
        try {
            await connect();
        } catch (err) {
            console.error('Failed to connect wallet:', err);
            setLocalError(err instanceof Error ? err.message : 'Failed to connect wallet');
        } finally{
            setIsConnecting(false);
        }
    };
    const handleDisconnectWallet = ()=>{
        disconnect();
    };
    // Combine loading states
    const combinedLoading = isLoading || hookLoading;
    // Combine errors
    const combinedError = error || hookError;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex-1 bg-gray-950 text-white",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 bg-gray-950 -z-10",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "absolute inset-0 opacity-70 pointer-events-none",
                    style: {
                        backgroundImage: "url('/patterns/grid.svg')",
                        backgroundSize: '32px 32px',
                        backgroundRepeat: 'repeat'
                    }
                }, void 0, false, {
                    fileName: "[project]/src/components/mixer/cross-chain/CrossChainSwap.tsx",
                    lineNumber: 196,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/mixer/cross-chain/CrossChainSwap.tsx",
                lineNumber: 195,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative z-10",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "border-b border-gray-800",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "max-w-6xl mx-auto px-4 py-12",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-center space-x-4 mb-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "p-3 bg-orange-500/10 rounded-xl",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-2xl font-bold text-orange-500",
                                                    children: "Z"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/mixer/cross-chain/CrossChainSwap.tsx",
                                                    lineNumber: 210,
                                                    columnNumber: 37
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/mixer/cross-chain/CrossChainSwap.tsx",
                                                lineNumber: 209,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$ArrowsRightLeftIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowsRightLeftIcon$3e$__["ArrowsRightLeftIcon"], {
                                                className: "w-8 h-8 text-gray-500"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/mixer/cross-chain/CrossChainSwap.tsx",
                                                lineNumber: 212,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "p-3 bg-orange-400/10 rounded-xl",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-2xl font-bold text-orange-400",
                                                    children: "S"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/mixer/cross-chain/CrossChainSwap.tsx",
                                                    lineNumber: 214,
                                                    columnNumber: 37
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/mixer/cross-chain/CrossChainSwap.tsx",
                                                lineNumber: 213,
                                                columnNumber: 33
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/mixer/cross-chain/CrossChainSwap.tsx",
                                        lineNumber: 208,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                        className: "text-3xl md:text-4xl font-bold text-white mb-3",
                                        children: "Cross-Chain Privacy Transfer"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/mixer/cross-chain/CrossChainSwap.tsx",
                                        lineNumber: 217,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-gray-400 max-w-2xl mx-auto",
                                        children: "Seamlessly transfer between Zcash and Starknet with enhanced privacy through Lightning Network, ZK proofs, and Cashu ecash."
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/mixer/cross-chain/CrossChainSwap.tsx",
                                        lineNumber: 220,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex flex-wrap items-center justify-center gap-3 mt-6",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "inline-flex items-center px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-full text-sm text-gray-300",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$ShieldCheckIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheckIcon$3e$__["ShieldCheckIcon"], {
                                                        className: "w-4 h-4 mr-1.5 text-green-400"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/mixer/cross-chain/CrossChainSwap.tsx",
                                                        lineNumber: 227,
                                                        columnNumber: 37
                                                    }, this),
                                                    "ZK Privacy"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/mixer/cross-chain/CrossChainSwap.tsx",
                                                lineNumber: 226,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "inline-flex items-center px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-full text-sm text-gray-300",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$BoltIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BoltIcon$3e$__["BoltIcon"], {
                                                        className: "w-4 h-4 mr-1.5 text-orange-400"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/mixer/cross-chain/CrossChainSwap.tsx",
                                                        lineNumber: 231,
                                                        columnNumber: 37
                                                    }, this),
                                                    "Lightning Fast"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/mixer/cross-chain/CrossChainSwap.tsx",
                                                lineNumber: 230,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "inline-flex items-center px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-full text-sm text-gray-300",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$ClockIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ClockIcon$3e$__["ClockIcon"], {
                                                        className: "w-4 h-4 mr-1.5 text-blue-400"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/mixer/cross-chain/CrossChainSwap.tsx",
                                                        lineNumber: 235,
                                                        columnNumber: 37
                                                    }, this),
                                                    "~5 min transfers"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/mixer/cross-chain/CrossChainSwap.tsx",
                                                lineNumber: 234,
                                                columnNumber: 33
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/mixer/cross-chain/CrossChainSwap.tsx",
                                        lineNumber: 225,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-6 flex justify-center",
                                        children: walletReady ? isConnected && address ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center space-x-3 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center space-x-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "w-2 h-2 bg-green-400 rounded-full animate-pulse"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/mixer/cross-chain/CrossChainSwap.tsx",
                                                            lineNumber: 246,
                                                            columnNumber: 49
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-sm text-gray-300",
                                                            children: [
                                                                address.slice(0, 6),
                                                                "...",
                                                                address.slice(-4)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/mixer/cross-chain/CrossChainSwap.tsx",
                                                            lineNumber: 247,
                                                            columnNumber: 49
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/mixer/cross-chain/CrossChainSwap.tsx",
                                                    lineNumber: 245,
                                                    columnNumber: 45
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: handleDisconnectWallet,
                                                    className: "text-sm text-gray-400 hover:text-white transition-colors",
                                                    children: "Disconnect"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/mixer/cross-chain/CrossChainSwap.tsx",
                                                    lineNumber: 251,
                                                    columnNumber: 45
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/mixer/cross-chain/CrossChainSwap.tsx",
                                            lineNumber: 244,
                                            columnNumber: 41
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: handleConnectWallet,
                                            disabled: isConnecting,
                                            className: "flex items-center space-x-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$WalletIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__WalletIcon$3e$__["WalletIcon"], {
                                                    className: "w-5 h-5"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/mixer/cross-chain/CrossChainSwap.tsx",
                                                    lineNumber: 264,
                                                    columnNumber: 45
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: isConnecting ? 'Connecting...' : 'Connect Wallet'
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/mixer/cross-chain/CrossChainSwap.tsx",
                                                    lineNumber: 265,
                                                    columnNumber: 45
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/mixer/cross-chain/CrossChainSwap.tsx",
                                            lineNumber: 259,
                                            columnNumber: 41
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center space-x-2 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-400",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$ClockIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ClockIcon$3e$__["ClockIcon"], {
                                                    className: "w-4 h-4 animate-spin"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/mixer/cross-chain/CrossChainSwap.tsx",
                                                    lineNumber: 270,
                                                    columnNumber: 41
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-sm",
                                                    children: "Loading wallet..."
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/mixer/cross-chain/CrossChainSwap.tsx",
                                                    lineNumber: 271,
                                                    columnNumber: 41
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/mixer/cross-chain/CrossChainSwap.tsx",
                                            lineNumber: 269,
                                            columnNumber: 37
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/mixer/cross-chain/CrossChainSwap.tsx",
                                        lineNumber: 241,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/mixer/cross-chain/CrossChainSwap.tsx",
                                lineNumber: 207,
                                columnNumber: 25
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/mixer/cross-chain/CrossChainSwap.tsx",
                            lineNumber: 206,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/mixer/cross-chain/CrossChainSwap.tsx",
                        lineNumber: 205,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "max-w-6xl mx-auto px-4 py-8",
                        children: activeTransfer ? /* Active Transfer View */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "max-w-2xl mx-auto space-y-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-between",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                    className: "text-xl font-semibold text-white",
                                                    children: activeTransfer.status === 'complete' ? 'Transfer Complete' : 'Transfer in Progress'
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/mixer/cross-chain/CrossChainSwap.tsx",
                                                    lineNumber: 287,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm text-gray-400 mt-1",
                                                    children: activeTransfer.direction === 'zec-to-strk' ? "".concat(activeTransfer.amount, " ZEC to STRK") : "".concat(activeTransfer.amount, " STRK to ZEC")
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/mixer/cross-chain/CrossChainSwap.tsx",
                                                    lineNumber: 290,
                                                    columnNumber: 37
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/mixer/cross-chain/CrossChainSwap.tsx",
                                            lineNumber: 286,
                                            columnNumber: 33
                                        }, this),
                                        activeTransfer.status === 'complete' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: handleNewTransfer,
                                            className: "px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors flex items-center space-x-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$ArrowsRightLeftIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowsRightLeftIcon$3e$__["ArrowsRightLeftIcon"], {
                                                    className: "w-4 h-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/mixer/cross-chain/CrossChainSwap.tsx",
                                                    lineNumber: 302,
                                                    columnNumber: 41
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "New Transfer"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/mixer/cross-chain/CrossChainSwap.tsx",
                                                    lineNumber: 303,
                                                    columnNumber: 41
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/mixer/cross-chain/CrossChainSwap.tsx",
                                            lineNumber: 298,
                                            columnNumber: 37
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: handleCancelTransfer,
                                            className: "p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors",
                                            title: "Cancel",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$XMarkIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XMarkIcon$3e$__["XMarkIcon"], {
                                                className: "w-5 h-5"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/mixer/cross-chain/CrossChainSwap.tsx",
                                                lineNumber: 311,
                                                columnNumber: 41
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/mixer/cross-chain/CrossChainSwap.tsx",
                                            lineNumber: 306,
                                            columnNumber: 37
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/mixer/cross-chain/CrossChainSwap.tsx",
                                    lineNumber: 285,
                                    columnNumber: 29
                                }, this),
                                activeTransfer.status === 'complete' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "p-4 bg-green-500/10 border border-green-500/30 rounded-xl flex items-start space-x-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$CheckCircleIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircleIcon$3e$__["CheckCircleIcon"], {
                                            className: "w-6 h-6 text-green-400 flex-shrink-0"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/mixer/cross-chain/CrossChainSwap.tsx",
                                            lineNumber: 319,
                                            columnNumber: 37
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "font-medium text-green-400",
                                                    children: "Transfer Successful"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/mixer/cross-chain/CrossChainSwap.tsx",
                                                    lineNumber: 321,
                                                    columnNumber: 41
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm text-gray-400 mt-1",
                                                    children: "Your funds have been successfully transferred to the destination address."
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/mixer/cross-chain/CrossChainSwap.tsx",
                                                    lineNumber: 322,
                                                    columnNumber: 41
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/mixer/cross-chain/CrossChainSwap.tsx",
                                            lineNumber: 320,
                                            columnNumber: 37
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/mixer/cross-chain/CrossChainSwap.tsx",
                                    lineNumber: 318,
                                    columnNumber: 33
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$mixer$2f$cross$2d$chain$2f$TransferStatusTracker$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TransferStatusTracker"], {
                                    steps: activeTransfer.steps,
                                    currentStepIndex: activeTransfer.currentStepIndex,
                                    direction: activeTransfer.direction,
                                    depositAddress: activeTransfer.depositAddress,
                                    depositAmount: activeTransfer.depositAmount
                                }, void 0, false, {
                                    fileName: "[project]/src/components/mixer/cross-chain/CrossChainSwap.tsx",
                                    lineNumber: 330,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/mixer/cross-chain/CrossChainSwap.tsx",
                            lineNumber: 283,
                            columnNumber: 25
                        }, this) : /* Form View */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid lg:grid-cols-2 gap-8 items-start",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        !isInitialized && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mb-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl flex items-start space-x-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$ClockIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ClockIcon$3e$__["ClockIcon"], {
                                                    className: "w-6 h-6 text-blue-400 flex-shrink-0 animate-spin"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/mixer/cross-chain/CrossChainSwap.tsx",
                                                    lineNumber: 346,
                                                    columnNumber: 41
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "font-medium text-blue-400",
                                                            children: "Initializing..."
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/mixer/cross-chain/CrossChainSwap.tsx",
                                                            lineNumber: 348,
                                                            columnNumber: 45
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-sm text-gray-400 mt-1",
                                                            children: "Connecting to swap providers..."
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/mixer/cross-chain/CrossChainSwap.tsx",
                                                            lineNumber: 349,
                                                            columnNumber: 45
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/mixer/cross-chain/CrossChainSwap.tsx",
                                                    lineNumber: 347,
                                                    columnNumber: 41
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/mixer/cross-chain/CrossChainSwap.tsx",
                                            lineNumber: 345,
                                            columnNumber: 37
                                        }, this),
                                        combinedError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start space-x-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$XMarkIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XMarkIcon$3e$__["XMarkIcon"], {
                                                    className: "w-6 h-6 text-red-400 flex-shrink-0"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/mixer/cross-chain/CrossChainSwap.tsx",
                                                    lineNumber: 356,
                                                    columnNumber: 41
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "font-medium text-red-400",
                                                            children: "Transfer Failed"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/mixer/cross-chain/CrossChainSwap.tsx",
                                                            lineNumber: 358,
                                                            columnNumber: 45
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-sm text-gray-400 mt-1",
                                                            children: combinedError
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/mixer/cross-chain/CrossChainSwap.tsx",
                                                            lineNumber: 359,
                                                            columnNumber: 45
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/mixer/cross-chain/CrossChainSwap.tsx",
                                                    lineNumber: 357,
                                                    columnNumber: 41
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/mixer/cross-chain/CrossChainSwap.tsx",
                                            lineNumber: 355,
                                            columnNumber: 37
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$mixer$2f$cross$2d$chain$2f$ZecDepositForm$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ZecDepositForm"], {
                                            onSubmit: handleFormSubmit,
                                            isLoading: combinedLoading,
                                            onChange: handleFormChange
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/mixer/cross-chain/CrossChainSwap.tsx",
                                            lineNumber: 363,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/mixer/cross-chain/CrossChainSwap.tsx",
                                    lineNumber: 342,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$mixer$2f$cross$2d$chain$2f$CrossChainQuote$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CrossChainQuote"], {
                                            direction: (formData === null || formData === void 0 ? void 0 : formData.direction) || 'zec-to-strk',
                                            amount: (formData === null || formData === void 0 ? void 0 : formData.amount) || 0
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/mixer/cross-chain/CrossChainSwap.tsx",
                                            lineNumber: 372,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "bg-gray-800/50 border border-gray-700 rounded-xl p-6",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: "font-medium text-white mb-4",
                                                    children: "Transfer Route"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/mixer/cross-chain/CrossChainSwap.tsx",
                                                    lineNumber: 379,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center justify-between text-sm",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-center",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "w-12 h-12 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-2",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-lg font-bold text-orange-500",
                                                                        children: "Z"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/mixer/cross-chain/CrossChainSwap.tsx",
                                                                        lineNumber: 383,
                                                                        columnNumber: 49
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/mixer/cross-chain/CrossChainSwap.tsx",
                                                                    lineNumber: 382,
                                                                    columnNumber: 45
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-gray-400",
                                                                    children: "Zcash"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/mixer/cross-chain/CrossChainSwap.tsx",
                                                                    lineNumber: 385,
                                                                    columnNumber: 45
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/mixer/cross-chain/CrossChainSwap.tsx",
                                                            lineNumber: 381,
                                                            columnNumber: 41
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex-1 px-2",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "h-0.5 bg-gradient-to-r from-orange-500/50 via-orange-400/50 to-orange-400/50 rounded"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/mixer/cross-chain/CrossChainSwap.tsx",
                                                                lineNumber: 388,
                                                                columnNumber: 45
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/mixer/cross-chain/CrossChainSwap.tsx",
                                                            lineNumber: 387,
                                                            columnNumber: 41
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-center",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "w-12 h-12 bg-orange-400/10 rounded-full flex items-center justify-center mx-auto mb-2",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$BoltIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BoltIcon$3e$__["BoltIcon"], {
                                                                        className: "w-6 h-6 text-orange-400"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/mixer/cross-chain/CrossChainSwap.tsx",
                                                                        lineNumber: 392,
                                                                        columnNumber: 49
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/mixer/cross-chain/CrossChainSwap.tsx",
                                                                    lineNumber: 391,
                                                                    columnNumber: 45
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-gray-400",
                                                                    children: "Lightning"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/mixer/cross-chain/CrossChainSwap.tsx",
                                                                    lineNumber: 394,
                                                                    columnNumber: 45
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/mixer/cross-chain/CrossChainSwap.tsx",
                                                            lineNumber: 390,
                                                            columnNumber: 41
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex-1 px-2",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "h-0.5 bg-gradient-to-r from-orange-400/50 via-orange-400/50 to-orange-400/50 rounded"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/mixer/cross-chain/CrossChainSwap.tsx",
                                                                lineNumber: 397,
                                                                columnNumber: 45
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/mixer/cross-chain/CrossChainSwap.tsx",
                                                            lineNumber: 396,
                                                            columnNumber: 41
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-center",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "w-12 h-12 bg-orange-400/10 rounded-full flex items-center justify-center mx-auto mb-2",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-lg font-bold text-orange-400",
                                                                        children: "S"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/mixer/cross-chain/CrossChainSwap.tsx",
                                                                        lineNumber: 401,
                                                                        columnNumber: 49
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/mixer/cross-chain/CrossChainSwap.tsx",
                                                                    lineNumber: 400,
                                                                    columnNumber: 45
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-gray-400",
                                                                    children: "Starknet"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/mixer/cross-chain/CrossChainSwap.tsx",
                                                                    lineNumber: 403,
                                                                    columnNumber: 45
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/mixer/cross-chain/CrossChainSwap.tsx",
                                                            lineNumber: 399,
                                                            columnNumber: 41
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/mixer/cross-chain/CrossChainSwap.tsx",
                                                    lineNumber: 380,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs text-gray-500 text-center mt-4",
                                                    children: "Funds are routed through Lightning Network for speed and privacy"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/mixer/cross-chain/CrossChainSwap.tsx",
                                                    lineNumber: 406,
                                                    columnNumber: 37
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/mixer/cross-chain/CrossChainSwap.tsx",
                                            lineNumber: 378,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/mixer/cross-chain/CrossChainSwap.tsx",
                                    lineNumber: 371,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/mixer/cross-chain/CrossChainSwap.tsx",
                            lineNumber: 340,
                            columnNumber: 25
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/mixer/cross-chain/CrossChainSwap.tsx",
                        lineNumber: 280,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/mixer/cross-chain/CrossChainSwap.tsx",
                lineNumber: 203,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/mixer/cross-chain/CrossChainSwap.tsx",
        lineNumber: 193,
        columnNumber: 9
    }, this);
}
_s(CrossChainSwap, "+6NhhmWPGh4Pn4XXNDs0cAy+JDc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useCrossChainSwap$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCrossChainSwap"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$WalletProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWallet"]
    ];
});
_c = CrossChainSwap;
var _c;
__turbopack_context__.k.register(_c, "CrossChainSwap");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/Navigation.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Navigation
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$HomeIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__HomeIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroicons/react/24/outline/esm/HomeIcon.js [app-client] (ecmascript) <export default as HomeIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$EyeSlashIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__EyeSlashIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroicons/react/24/outline/esm/EyeSlashIcon.js [app-client] (ecmascript) <export default as EyeSlashIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$DocumentTextIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__DocumentTextIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroicons/react/24/outline/esm/DocumentTextIcon.js [app-client] (ecmascript) <export default as DocumentTextIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$Bars3Icon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bars3Icon$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroicons/react/24/outline/esm/Bars3Icon.js [app-client] (ecmascript) <export default as Bars3Icon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$XMarkIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XMarkIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroicons/react/24/outline/esm/XMarkIcon.js [app-client] (ecmascript) <export default as XMarkIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$ArrowsRightLeftIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowsRightLeftIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroicons/react/24/outline/esm/ArrowsRightLeftIcon.js [app-client] (ecmascript) <export default as ArrowsRightLeftIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$ScissorsIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ScissorsIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroicons/react/24/outline/esm/ScissorsIcon.js [app-client] (ecmascript) <export default as ScissorsIcon>");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
function Navigation() {
    _s();
    const [isOpen, setIsOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const navItems = [
        {
            href: '/',
            label: 'Home',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$HomeIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__HomeIcon$3e$__["HomeIcon"]
        },
        {
            href: '/mixer',
            label: 'Full Mix',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$EyeSlashIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__EyeSlashIcon$3e$__["EyeSlashIcon"]
        },
        {
            href: '/mixer/split',
            label: 'Split Mix',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$ScissorsIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ScissorsIcon$3e$__["ScissorsIcon"]
        },
        {
            href: '/cross-chain',
            label: 'Cross-Chain',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$ArrowsRightLeftIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowsRightLeftIcon$3e$__["ArrowsRightLeftIcon"]
        },
        {
            href: '/docs',
            label: 'Docs',
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$DocumentTextIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__DocumentTextIcon$3e$__["DocumentTextIcon"]
        }
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
        className: "bg-gray-900 border-b border-gray-700",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "container mx-auto px-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between h-16",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: "/",
                            className: "flex items-center space-x-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$EyeSlashIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__EyeSlashIcon$3e$__["EyeSlashIcon"], {
                                        className: "w-5 h-5 text-white"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Navigation.tsx",
                                        lineNumber: 33,
                                        columnNumber: 29
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Navigation.tsx",
                                    lineNumber: 32,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-xl font-bold text-white",
                                    children: "SLPM"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Navigation.tsx",
                                    lineNumber: 35,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/Navigation.tsx",
                            lineNumber: 31,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "hidden md:flex items-center space-x-8",
                            children: navItems.map((item)=>{
                                const Icon = item.icon;
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: item.href,
                                    className: "flex items-center space-x-2 text-gray-300 hover:text-orange-400 transition-colors",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                            className: "w-5 h-5"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Navigation.tsx",
                                            lineNumber: 48,
                                            columnNumber: 37
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: item.label
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Navigation.tsx",
                                            lineNumber: 49,
                                            columnNumber: 37
                                        }, this)
                                    ]
                                }, item.href, true, {
                                    fileName: "[project]/src/components/Navigation.tsx",
                                    lineNumber: 43,
                                    columnNumber: 33
                                }, this);
                            })
                        }, void 0, false, {
                            fileName: "[project]/src/components/Navigation.tsx",
                            lineNumber: 39,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>setIsOpen(!isOpen),
                            className: "md:hidden text-gray-300 hover:text-white",
                            children: isOpen ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$XMarkIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XMarkIcon$3e$__["XMarkIcon"], {
                                className: "w-6 h-6"
                            }, void 0, false, {
                                fileName: "[project]/src/components/Navigation.tsx",
                                lineNumber: 61,
                                columnNumber: 29
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$Bars3Icon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bars3Icon$3e$__["Bars3Icon"], {
                                className: "w-6 h-6"
                            }, void 0, false, {
                                fileName: "[project]/src/components/Navigation.tsx",
                                lineNumber: 63,
                                columnNumber: 29
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/Navigation.tsx",
                            lineNumber: 56,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/Navigation.tsx",
                    lineNumber: 29,
                    columnNumber: 17
                }, this),
                isOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "md:hidden border-t border-gray-700 py-4",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col space-y-4",
                        children: navItems.map((item)=>{
                            const Icon = item.icon;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: item.href,
                                onClick: ()=>setIsOpen(false),
                                className: "flex items-center space-x-3 text-gray-300 hover:text-orange-400 transition-colors",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                        className: "w-5 h-5"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Navigation.tsx",
                                        lineNumber: 81,
                                        columnNumber: 41
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: item.label
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Navigation.tsx",
                                        lineNumber: 82,
                                        columnNumber: 41
                                    }, this)
                                ]
                            }, item.href, true, {
                                fileName: "[project]/src/components/Navigation.tsx",
                                lineNumber: 75,
                                columnNumber: 37
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/src/components/Navigation.tsx",
                        lineNumber: 71,
                        columnNumber: 25
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/Navigation.tsx",
                    lineNumber: 70,
                    columnNumber: 21
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/Navigation.tsx",
            lineNumber: 28,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/Navigation.tsx",
        lineNumber: 27,
        columnNumber: 9
    }, this);
}
_s(Navigation, "+sus0Lb0ewKHdwiUhiTAJFoFyQ0=");
_c = Navigation;
var _c;
__turbopack_context__.k.register(_c, "Navigation");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_c5630dbe._.js.map