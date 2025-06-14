
import { useState, useEffect } from 'react';
import { sleepTips } from '@/utils/sleepTips';

const DailyTip = () => {
    const [currentTip, setCurrentTip] = useState(sleepTips[0]);

    useEffect(() => {
        const selectRandomTip = () => {
            const randomIndex = Math.floor(Math.random() * sleepTips.length);
            setCurrentTip(sleepTips[randomIndex]);
        };

        selectRandomTip();
        const intervalId = setInterval(selectRandomTip, 10 * 60 * 1000); // 10 minutes

        return () => clearInterval(intervalId);
    }, []);

    const icon = currentTip.type === 'tip' ? '💡' : '💤';
    const prefix = currentTip.type === 'tip' ? 'Sleep Tip: ' : '';

    return (
        <div className="bg-slate-800/50 border border-white/10 rounded-2xl p-6 text-center max-w-3xl mx-auto animate-fade-in my-8 backdrop-blur-sm">
            <p className="text-lg text-white/90 font-light leading-relaxed">
                <span className="text-2xl mr-3 align-middle">{icon}</span>
                <span className="font-medium">{prefix}</span>
                {currentTip.text}
            </p>
        </div>
    );
};

export default DailyTip;
