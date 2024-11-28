import React, { useState } from 'react';
import { Input } from "@/components/ui/input"

interface FileInputProps {
    label: string
    accept: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    isImage?: boolean
}

export const FileInput: React.FC<FileInputProps> = ({label, accept, onChange, isImage = false}) => {
    const [preview, setPreview] = useState<string | null>(null)
    const [fileName, setFileName] = useState<string | null>(null)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setFileName(file.name)
            if (isImage) {
                const reader = new FileReader()
                reader.onloadend = () => {
                    setPreview(reader.result as string)
                }
                reader.readAsDataURL(file)
            }
        } else {
            setFileName(null)
            setPreview(null)
        }
        onChange(e)
    }

    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-200 mb-2">{label}</label>
            <div className="relative">
                <Input
                    type="file"
                    accept={accept}
                    onChange={handleChange}
                    className="hidden"
                    id={label.replace(/\s+/g, '-').toLowerCase()}
                />
                <label htmlFor={label.replace(/\s+/g, '-').toLowerCase()} className="cursor-pointer bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md inline-flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
                    </svg>
                    Choose file
                </label>
            </div>
            {fileName && (
                <p className="mt-2 text-sm text-green-400">Selected file: {fileName}</p>
            )}
            {isImage && preview && (
                <div className="mt-2">
                    <img src={preview} alt="Preview" className="max-w-full h-auto max-h-40 rounded-md"/>
                </div>
            )}
        </div>
    )
} 