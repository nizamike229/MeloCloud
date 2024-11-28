import React, { useEffect, useRef } from 'react';

interface EqualizerProps {
    isPlaying: boolean;
}

export const Equalizer: React.FC<EqualizerProps> = ({ isPlaying }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationId: number;
        const bars = 20;
        const barWidth = 2;
        const gap = 1;

        const animate = () => {
            if (!isPlaying) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                return;
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#3b82f6';

            for (let i = 0; i < bars; i++) {
                const height = isPlaying ? Math.random() * 30 : 2;
                ctx.fillRect(
                    i * (barWidth + gap),
                    canvas.height - height,
                    barWidth,
                    height
                );
            }

            animationId = requestAnimationFrame(animate);
        };

        animate();
        return () => cancelAnimationFrame(animationId);
    }, [isPlaying]);

    return (
        <canvas 
            ref={canvasRef} 
            width={60} 
            height={30} 
            className="opacity-70"
        />
    );
}; 