
import { getUserSession } from "@/lib/api/Session";
import { Lock } from "lucide-react";
import Link from "next/link";
import "animate.css";
import ProfileClientUI from "@/app/dashboard/user/page";

export const dynamic = "force-dynamic";

export default async function UserProfilePage() {
    const user = await getUserSession();

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 transition-colors duration-300 animate__animated animate__fadeIn">
                <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-100 dark:border-gray-800 rounded-[2.5rem] p-10 sm:p-12 max-w-md w-full text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] animate__animated animate__zoomIn animate__faster">
                    
                    <div className="w-20 h-20 bg-blue-50 dark:bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner animate__animated animate__pulse animate__infinite animate__slower">
                        <Lock size={36} className="text-blue-600 dark:text-blue-400" />
                    </div>
                    
                    <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mb-3 tracking-tight">
                        Access Restricted
                    </h2>
                    
                    <p className="text-gray-500 dark:text-gray-400 font-medium mb-8 leading-relaxed">
                        Secure area. Please log in to access your dashboard and manage your personal profile.
                    </p>
                    
                    <Link
                        href="/signin"
                        className="inline-flex items-center justify-center w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-black rounded-2xl py-4 transition-all shadow-lg shadow-blue-500/30 active:scale-[0.98]"
                    >
                        Go to Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="animate__animated animate__fadeIn animate__faster">
            <ProfileClientUI initialUser={user} />
        </div>
    );
}