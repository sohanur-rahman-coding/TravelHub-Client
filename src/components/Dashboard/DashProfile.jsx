import { getUserSession } from '@/lib/api/Session';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import "animate.css";

const DashProfile = async () => {
    const user = await getUserSession();

    if (!user) return null;

    const roleColors = {
        admin: "bg-red-50 text-red-600 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20",
        vendor: "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
        user: "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20"
    };

    const currentRoleColor = roleColors[user.role?.toLowerCase()] || roleColors.user;

    return (
        <div className="flex items-center justify-end w-full px-4 sm:px-6 py-2 bg-transparent animate__animated animate__fadeInRight animate__faster">
            <div className="flex items-center gap-4 sm:gap-5 text-right bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl px-5 py-2.5 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] hover:shadow-lg transition-all duration-500">
                
                <div className="flex flex-col items-end">
                    <div className="flex items-center gap-3">
                        <span className={`text-[10px] uppercase tracking-widest font-black px-3 py-1 rounded-full border shadow-sm animate__animated animate__fadeInDown animate__delay-1s ${currentRoleColor}`}>
                            {user.role || "User"}
                        </span>
                        <h2 className="text-sm sm:text-base font-black text-gray-900 dark:text-white tracking-tight leading-none animate__animated animate__fadeInLeft">
                            {user.name}
                        </h2>
                    </div>
                    <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 mt-1.5 font-bold tracking-wide animate__animated animate__fadeInUp">
                        {user.email}
                    </p>
                </div>

                <Link 
                    href="/dashboard" 
                    className="relative w-12 h-12 rounded-full border-[3px] border-white dark:border-gray-800 overflow-hidden bg-gray-50 dark:bg-gray-800 flex items-center justify-center font-black text-xl text-gray-400 dark:text-gray-500 shrink-0 shadow-md hover:shadow-blue-500/30 transition-all duration-300 hover:scale-110 active:scale-95 group animate__animated animate__zoomIn animate__delay-1s"
                >
                    {user.image || user.profilePicture ? (
                        <Image 
                            src={user.image || user.profilePicture} 
                            alt={user.name || "User"} 
                            fill
                            unoptimized
                            className="object-cover group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500"
                        />
                    ) : (
                        user.name?.[0]?.toUpperCase()
                    )}
                </Link>
                
            </div>
        </div>
    );
};

export default DashProfile;