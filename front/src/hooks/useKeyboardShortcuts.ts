import { useEffect } from 'react';

interface ShortcutConfig {
    space: () => void;
    arrowLeft: () => void;
    arrowRight: () => void;
    ctrl_f: () => void;
}

export const useKeyboardShortcuts = (config: ShortcutConfig) => {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
                return;
            }

            if (e.code === 'Space') {
                e.preventDefault();
                config.space();
            }
            
            if (e.code === 'ArrowLeft') {
                config.arrowLeft();
            }
            
            if (e.code === 'ArrowRight') {
                config.arrowRight();
            }
            
            if (e.ctrlKey && e.code === 'KeyF') {
                e.preventDefault();
                config.ctrl_f();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [config]);
}; 