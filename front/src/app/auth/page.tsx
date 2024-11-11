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
            } else {
                setError(response.data.message || 'An error occurred')
            }
        } catch (err) {
            setError('An error occurred. Please try again.')
        }
    }

    const toggleAuthMode = () => {
        setIsLogin(!isLogin)
        setError('')
        setSuccess('')
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <motion.div
                initial={{opacity: 0, y: -20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.5}}
                className="w-full max-w-md"
            >
                <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <h2 className="text-2xl font-bold mb-6 text-center text-black">
                        {isLogin ? 'Login' : 'Register'}
                    </h2>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                            Username
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="username"
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
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
                            className="bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="submit"
                        >
                            {isLogin ? 'Sign In' : 'Sign Up'}
                        </motion.button>
                        <motion.button
                            whileHover={{scale: 1.05}}
                            whileTap={{scale: 0.95}}
                            className="inline-block align-baseline font-bold text-sm text-black hover:text-gray-800"
                            type="button"
                            onClick={toggleAuthMode}
                        >
                            {isLogin ? 'Need an account?' : 'Already have an account?'}
                        </motion.button>
                    </div>
                </form>
                <AnimatePresence>
                    {error && (
                        <motion.p
                            initial={{opacity: 0, y: -10}}
                            animate={{opacity: 1, y: 0}}
                            exit={{opacity: 0, y: -10}}
                            className="text-red-500 text-xs italic mt-2"
                        >
                            {error}
                        </motion.p>
                    )}
                    {success && (
                        <motion.p
                            initial={{opacity: 0, y: -10}}
                            animate={{opacity: 1, y: 0}}
                            exit={{opacity: 0, y: -10}}
                            className="text-green-500 text-xs italic mt-2"
                        >
                            {success}
                        </motion.p>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    )
}