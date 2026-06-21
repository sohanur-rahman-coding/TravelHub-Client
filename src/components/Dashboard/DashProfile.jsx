import { getUserSession } from '@/lib/api/Session';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const DashProfile = async () => {
    const user = await getUserSession();

    if (!user) return null;

    const roleColors = {
        admin: "bg-danger-50 text-danger border-danger-200 dark:bg-danger-950/40",
        vendor: "bg-warning-50 text-warning border-warning-200 dark:bg-warning-950/40",
        user: "bg-success-50 text-success border-success-200 dark:bg-success-950/40"
    };

    const currentRoleColor = roleColors[user.role?.toLowerCase()] || roleColors.user;

    return (
        <div className="flex items-center justify-end w-full bg-background px-2">
            <div className="flex items-center gap-4 text-right">
                <div className="flex flex-col items-end">
                    <div className="flex items-center gap-2">
                        <span className={`text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full border ${currentRoleColor}`}>
                            {user.role || "User"}
                        </span>
                        <h2 className="text-base font-bold text-foreground tracking-tight leading-none">
                            {user.name}
                        </h2>
                    </div>
                    <p className="text-xs text-default-500 mt-1 font-medium">
                        {user.email}
                    </p>
                </div>

                <Link href="/" className="relative w-11 h-11 rounded-full border border-default-300 overflow-hidden bg-muted flex items-center justify-center font-bold text-base text-foreground shrink-0">
                    {user.image || user.profilePicture ? (
                        <Image 
                            src={user.image || user.profilePicture} 
                            alt={user.name || "User"} 
                            fill
                            className="object-cover"
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