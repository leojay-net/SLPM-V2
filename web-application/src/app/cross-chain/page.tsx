import { CrossChainSwap } from '@/components/mixer/cross-chain';
import Navigation from '@/components/Navigation';

export default function CrossChainPage() {
    return (
        <div className="min-h-screen bg-gray-950 flex flex-col">
            <Navigation />
            <CrossChainSwap />
        </div>
    );
}
