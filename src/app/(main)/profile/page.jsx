import ProfileClientUI from "@/app/dashboard/user/page";
import { getUserSession } from "@/lib/api/Session";


export default async function UserProfilePage() {
    const user = await getUserSession();

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-[70vh]">
                <p className="text-default-500 font-medium">Please login to view profile.</p>
            </div>
        );
    }

    return <ProfileClientUI initialUser={user} />;
}