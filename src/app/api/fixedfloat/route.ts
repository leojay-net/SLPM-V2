/**
 * FixedFloat API Proxy Route
 * 
 * This proxies requests to FixedFloat API to:
 * 1. Keep API credentials secure (not exposed to browser)
 * 2. Handle CORS issues
 */

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const FIXEDFLOAT_API = 'https://ff.io/api/v2';
const API_KEY = process.env.FIXEDFLOAT_API_KEY || '';
const API_SECRET = process.env.FIXEDFLOAT_API_SECRET || '';

function createSignature(body: string): string {
    return crypto
        .createHmac('sha256', API_SECRET)
        .update(body)
        .digest('hex');
}

export async function POST(request: NextRequest) {
    try {
        const { endpoint, data } = await request.json();

        if (!endpoint || typeof endpoint !== 'string') {
            return NextResponse.json(
                { success: false, error: 'Missing endpoint' },
                { status: 400 }
            );
        }

        // Validate endpoint to prevent abuse
        const allowedEndpoints = ['/price', '/create', '/order', '/orders', '/ccies'];
        if (!allowedEndpoints.includes(endpoint)) {
            return NextResponse.json(
                { success: false, error: 'Invalid endpoint' },
                { status: 400 }
            );
        }

        if (!API_KEY || !API_SECRET) {
            return NextResponse.json(
                { success: false, error: 'FixedFloat API not configured' },
                { status: 500 }
            );
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
                'X-API-SIGN': signature,
            },
            body,
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

        return NextResponse.json({ success: true, ...result });

    } catch (error) {
        console.error('[FixedFloat Proxy Error]', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'FixedFloat API error'
            },
            { status: 500 }
        );
    }
}
