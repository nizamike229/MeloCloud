import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface PopupProps {
    message: string
    type: 'success' | 'error'
    onClose: () => void
}

export const Popup: React.FC<PopupProps> = ({message, type, onClose}) => {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        setIsVisible(true)
        const timer = setTimeout(() => {
            setIsVisible(false)
            setTimeout(onClose, 300)
        }, 3000)

        return () => clearTimeout(timer)
    }, [onClose])

    return (
        <div className={`fixed inset-0 flex items-center justify-center z-[9999] transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <Card className={`max-w-md w-full ${type === 'success' ? 'border-t-4 border-t-green-500' : 'border-t-4 border-t-red-500'}`}>
                <CardContent className="p-6">
                    <div className="flex flex-col items-center mb-4">
                        <div className={`w-16 h-16 rounded-md flex items-center justify-center mb-4 ${type === 'success' ? 'bg-green-100' : 'bg-red-100'}`}>
                            {type === 'success' ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                                </svg>
                            )}
                        </div>
                        <h3 className="text-lg font-semibold">{type === 'success' ? 'Success' : 'Error'}</h3>
                    </div>
                    <p className="text-gray-600 text-center mb-4">{message}</p>
                    <Button onClick={() => {
                        setIsVisible(false)
                        setTimeout(onClose, 300)
                    }} className={`w-full ${type === 'success' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}`}>
                        OK
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
} 