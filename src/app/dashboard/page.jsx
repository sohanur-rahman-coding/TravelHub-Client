// import { getUserSession } from '@/lib/api/Session';
import { getUserSession } from '@/lib/api/Session';
import ProfileClientUI from './user/page';
// import ProfileClientUI from './ProfileClientUI';

export const dynamic = "force-dynamic";

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