import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import { Calendar, User, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Navbar() {
    const { user, login, logout, isAuthenticated } = useAuth();

    return (
        <nav className="bg-neutral-900 border-b border-neutral-800 backdrop-blur-md sticky top-0 z-40">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 group">
                    <motion.div
                        whileHover={{ rotate: 10 }}
                        className="w-10 h-10 bg-gradient-to-br from-rose-500 to-orange-400 rounded-xl flex items-center justify-center shadow-lg shadow-rose-900/20"
                    >
                        <Calendar className="text-white w-6 h-6" />
                    </motion.div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-400 group-hover:to-white transition-all">
                        SydneyEvents
                    </span>
                </Link>

                <div className="flex items-center gap-6">
                    <Link to="/" className="text-neutral-400 hover:text-white transition-colors text-sm font-medium">
                        Browse
                    </Link>

                    {isAuthenticated ? (
                        <div className="flex items-center gap-4">
                            <Link to="/dashboard" className="text-neutral-400 hover:text-white transition-colors text-sm font-medium">
                                Admin Dashboard
                            </Link>

                            <div className="relative group">
                                <button className="flex items-center gap-3 pl-3 pr-2 py-1.5 rounded-full bg-neutral-800 border border-neutral-700 hover:border-neutral-600 hover:bg-neutral-700/50 transition-all">
                                    <img
                                        src={user.picture || `https://ui-avatars.com/api/?name=${user.name}`}
                                        alt={user.name}
                                        className="w-6 h-6 rounded-full"
                                    />
                                    <span className="text-sm font-medium text-neutral-200 truncate max-w-[100px]">{user.name}</span>
                                </button>

                                <div className="absolute right-0 top-full mt-2 w-48 bg-neutral-800 border border-neutral-700 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top-right scale-95 group-hover:scale-100">
                                    <div className="p-2">
                                        <button
                                            onClick={logout}
                                            className="w-full text-left px-4 py-2 text-sm text-rose-400 hover:bg-neutral-700/50 rounded-lg flex items-center gap-2"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Sign Out
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <GoogleLogin
                                onSuccess={credentialResponse => {
                                    login(credentialResponse);
                                }}
                                onError={() => {
                                    console.log('Login Failed');
                                }}
                                useOneTap
                                shape="pill"
                                theme="filled_black"
                                text="signin_with"
                            />
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
