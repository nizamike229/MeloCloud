'use client'

import {useState} from 'react'
import {useRouter} from 'next/navigation'
import myDefault from 'axios'
import {motion, AnimatePresence} from 'framer-motion'

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const router = useRouter()
    const axios = myDefault.create({
        withCredentials: true,
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setSuccess('')

        try {
            const endpoint = isLogin
                ? 'http://localhost:5151/auth/login'
                : 'http://localhost:5151/auth/register'

            const response = await axios.post(endpoint, {username, password})

            if (response.status === 200) {
                setSuccess(isLogin ? 'Login successful!' : 'Registration successful!')
                if (isLogin) {
                    setTimeout(() => router.push('/'), 1500)
                } else {
                    setTimeout(() => setIsLogin(true), 1500)
                }
            }
        } catch (err: any) {
            const errorMessage = err.response?.data || err.message || 'An error occurred'
            setError(typeof errorMessage === 'string' ? errorMessage : 'An unexpected error occurred')
        }
    }

    const toggleAuthMode = () => {
        setIsLogin(!isLogin)
        setError('')
        setSuccess('')
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <motion.div
                initial={{opacity: 0, y: -20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.5}}
                className="w-full max-w-md"
            >
                <form onSubmit={handleSubmit} className="bg-gray-800 shadow-xl rounded-lg px-8 pt-6 pb-8 mb-4">
                    <h2 className="text-2xl font-bold mb-6 text-center text-white">
                        {isLogin ? 'Login' : 'Register'}
                    </h2>
                    <div className="mb-4">
                        <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="username">
                            Username
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-700 text-white border-gray-600 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            id="username"
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-700 text-white border-gray-600 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            id="password"
                            type="password"
                            placeholder="******************"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <motion.button
                            whileHover={{scale: 1.05}}
                            whileTap={{scale: 0.95}}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-200"
                            type="submit"
                        >
                            {isLogin ? 'Sign In' : 'Sign Up'}
                        </motion.button>
                        <motion.button
                            whileHover={{scale: 1.05}}
                            whileTap={{scale: 0.95}}
                            className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-400 transition-colors duration-200"
                            type="button"
                            onClick={toggleAuthMode}
                        >
                            {isLogin ? 'Need an account?' : 'Already have an account?'}
                        </motion.button>
                    </div>
                </form>
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{opacity: 0, y: -10}}
                            animate={{opacity: 1, y: 0}}
                            exit={{opacity: 0, y: -10}}
                            className="bg-red-500 text-white px-4 py-2 rounded-md shadow-md"
                        >
                            {error}
                        </motion.div>
                    )}
                    {success && (
                        <motion.div
                            initial={{opacity: 0, y: -10}}
                            animate={{opacity: 1, y: 0}}
                            exit={{opacity: 0, y: -10}}
                            className="bg-green-500 text-white px-4 py-2 rounded-md shadow-md"
                        >
                            {success}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    )
}