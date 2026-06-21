import React from 'react';
import Image from 'next/image';
import { Camera, Mail, ShieldCheck, User } from 'lucide-react';
import { getUserSession } from '@/lib/api/Session';

const UserProfile = async () => {
    const user = await getUserSession();

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-[70vh]">
                <p className="text-default-500 font-medium">Loading profile information...</p>
            </div>
        );
    }

    const roleColors = {
        admin: "bg-danger-50 text-danger border-danger-200 dark:bg-danger-950/40",
        vendor: "bg-warning-50 text-warning border-warning-200 dark:bg-warning-950/40",
        user: "bg-success-50 text-success border-success-200 dark:bg-success-950/40"
    };

    const currentRoleColor = roleColors[user.role?.toLowerCase()] || roleColors.user;

    return (
        <div className="flex items-center justify-center min-h-[75vh] w-full px-4">
            <div className="w-full max-w-md bg-background border border-zinc-200 dark:border-zinc-800 shadow-2xl rounded-3xl overflow-hidden relative group/card transition-all duration-300 hover:shadow-zinc-300/50 dark:hover:shadow-none">
                
                <div className="h-32 bg-gradient-to-r from-[#0B3977] to-blue-600 relative">
                    <div className="absolute top-4 right-4">
                        <span className={`text-[10px] uppercase tracking-wider font-extrabold px-3 py-1 rounded-full border bg-white/10 text-white backdrop-blur-md border-white/20`}>
                            {user.role || "User"}
                        </span>
                    </div>
                </div>

                <div className="px-6 pb-8 pt-2 relative flex flex-col items-center">
                    
                    <div className="relative -mt-20 mb-4 w-28 h-28 rounded-full border-4 border-background overflow-hidden shadow-xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center group/avatar">
                        {user.image || user.profilePicture ? (
                            <Image
                                src={user.image || user.profilePicture}
                                alt={user.name || "User"}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <span className="text-4xl font-black text-zinc-400">
                                {user.name?.[0]?.toUpperCase()}
                            </span>
                        )}
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity cursor-pointer">
                            <Camera className="w-6 h-6 text-white" />
                        </div>
                    </div>

                    <div className="text-center w-full space-y-5">
                        <div>
                            <h1 className="text-2xl font-black text-foreground tracking-tight">
                                {user.name}
                            </h1>
                            <p className="text-sm text-zinc-400 dark:text-zinc-500 font-medium mt-0.5">
                                Account Overview
                            </p>
                        </div>

                        <div className="border-t border-zinc-100 dark:border-zinc-800/60 my-2"></div>

                        <div className="space-y-3.5 text-left">
                            <div className="flex items-center gap-3.5 px-4 py-3 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-100 dark:border-zinc-800/40">
                                <User className="w-4 h-4 text-zinc-400 shrink-0" />
                                <div className="truncate">
                                    <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 leading-none mb-1">Full Name</p>
                                    <p className="text-sm font-semibold text-foreground truncate">{user.name}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3.5 px-4 py-3 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-100 dark:border-zinc-800/40">
                                <Mail className="w-4 h-4 text-zinc-400 shrink-0" />
                                <div className="truncate">
                                    <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 leading-none mb-1">Email Address</p>
                                    <p className="text-sm font-semibold text-foreground truncate">{user.email}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3.5 px-4 py-3 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-100 dark:border-zinc-800/40">
                                <ShieldCheck className="w-4 h-4 text-zinc-400 shrink-0" />
                                <div className="truncate">
                                    <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 leading-none mb-1">Assigned Role</p>
                                    <p className="text-sm font-semibold text-foreground capitalize">{user.role || "user"}</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-2">
                            <button className="w-full bg-[#0B3977] hover:bg-blue-700 text-white font-bold text-sm py-3 px-4 rounded-2xl transition-all shadow-lg shadow-blue-600/10 active:scale-[0.98]">
                                Edit Profile
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default UserProfile;