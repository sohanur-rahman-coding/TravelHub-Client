"use client";

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Camera, Mail, ShieldCheck, User, Edit2, Check, X, Loader2, UploadCloud } from 'lucide-react';
import { authClient } from "@/lib/auth-client";
import { updateProfileAPI } from '@/lib/actions/manageUser';
// import { updateProfileAPI } from '@/lib/actions/user';

export default function ProfileClientUI({ initialUser }) {
    const router = useRouter();
    const [user, setUser] = useState(initialUser);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    
    const [formData, setFormData] = useState({ name: initialUser?.name || '' });
    const [previewImage, setPreviewImage] = useState(initialUser?.image || initialUser?.profilePicture || null);
    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef(null);

    const roleColors = {
        admin: "bg-red-50 text-red-600 border-red-200 dark:bg-red-500/10 dark:border-red-500/20",
        vendor: "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-500/10 dark:border-amber-500/20",
        user: "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/20"
    };
    const currentRoleColor = roleColors[user?.role?.toLowerCase()] || roleColors.user;

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            let finalImageUrl = user?.image || user?.profilePicture;

            if (selectedFile) {
                const imgFormData = new FormData();
                imgFormData.append("image", selectedFile);
                
                const imgbbKey = process.env.NEXT_PUBLIC_IMGBB_KEY;
                
                if (!imgbbKey) {
                    alert("ImgBB API Key is missing in .env.local file!");
                    setIsSaving(false);
                    return;
                }

                const imgbbRes = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbKey}`, {
                    method: 'POST',
                    body: imgFormData
                });
                const imgbbData = await imgbbRes.json();
                
                if (imgbbData.success) {
                    finalImageUrl = imgbbData.data.url;
                } else {
                    alert(`ImgBB Error: ${imgbbData?.error?.message || "Upload failed"}`);
                    throw new Error("Failed to upload image to ImgBB");
                }
            }

            const updateRes = await updateProfileAPI(user?.email, { 
                name: formData.name, 
                image: finalImageUrl 
            });

            if (updateRes.success) {
                await authClient.updateUser({
                    name: formData.name,
                    image: finalImageUrl
                });

                setUser(prev => ({ ...prev, name: formData.name, image: finalImageUrl }));
                setIsEditing(false);
                setSelectedFile(null);
                router.refresh(); 
            } else {
                alert(`Error: ${updateRes.message || "Failed to update profile in database!"}`);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setFormData({ name: user?.name });
        setPreviewImage(user?.image || user?.profilePicture);
        setSelectedFile(null);
        setIsEditing(false);
    };

    return (
        <div className="flex items-center justify-center min-h-[80vh] w-full px-4 py-8 font-sans">
            <div className="w-full max-w-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-2xl dark:shadow-none rounded-[2rem] overflow-hidden relative transition-all duration-300">
                
                <div className="h-40 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
                    <div className="absolute top-5 right-5">
                        <span className={`text-[10px] uppercase tracking-widest font-black px-4 py-1.5 rounded-full border shadow-sm backdrop-blur-md ${currentRoleColor}`}>
                            {user?.role || "User"}
                        </span>
                    </div>
                </div>

                <div className="px-8 pb-10 pt-2 relative flex flex-col items-center">
                    
                    <div className="relative -mt-24 mb-6 group">
                        <div className="w-32 h-32 rounded-full border-[6px] border-white dark:border-zinc-950 overflow-hidden shadow-xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center relative">
                            {previewImage ? (
                                <Image src={previewImage} alt={user?.name || "User"} fill unoptimized className="object-cover" />
                            ) : (
                                <span className="text-5xl font-black text-zinc-300 dark:text-zinc-700">
                                    {user?.name?.[0]?.toUpperCase()}
                                </span>
                            )}

                            {isEditing && (
                                <label className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer z-10">
                                    <UploadCloud className="w-8 h-8 text-white mb-1" />
                                    <span className="text-white text-[10px] font-bold uppercase tracking-wider">Change</span>
                                    <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageChange} />
                                </label>
                            )}
                        </div>
                        {isEditing && (
                            <button onClick={() => fileInputRef.current?.click()} className="absolute bottom-1 right-1 bg-blue-600 text-white p-2.5 rounded-full shadow-lg hover:bg-blue-700 transition-colors border-2 border-white dark:border-zinc-950 z-20">
                                <Camera className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    <div className="w-full space-y-6">
                        <div className="text-center">
                            {isEditing ? (
                                <div className="space-y-1.5 max-w-xs mx-auto">
                                    <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider text-left block">Display Name</label>
                                    <input 
                                        type="text" 
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        className="w-full text-center text-xl font-bold bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                                        placeholder="Enter your name"
                                    />
                                </div>
                            ) : (
                                <>
                                    <h1 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">{user?.name}</h1>
                                    <p className="text-sm text-zinc-500 font-medium mt-1">Welcome back to your profile</p>
                                </>
                            )}
                        </div>

                        <div className="w-full h-px bg-gradient-to-r from-transparent via-zinc-200 dark:via-zinc-800 to-transparent my-4"></div>

                        <div className="space-y-4">
                            {!isEditing && (
                                <div className="group flex items-center gap-4 px-5 py-4 bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-900/50 dark:hover:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800/60 transition-colors">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center shrink-0">
                                        <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div className="flex-1 truncate">
                                        <p className="text-[11px] uppercase font-bold tracking-widest text-zinc-400 mb-0.5">Full Name</p>
                                        <p className="text-base font-bold text-zinc-900 dark:text-zinc-100 truncate">{user?.name}</p>
                                    </div>
                                </div>
                            )}

                            <div className="group flex items-center gap-4 px-5 py-4 bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-900/50 dark:hover:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800/60 transition-colors">
                                <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-500/10 flex items-center justify-center shrink-0">
                                    <Mail className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div className="flex-1 truncate">
                                    <p className="text-[11px] uppercase font-bold tracking-widest text-zinc-400 mb-0.5">Email Address</p>
                                    <p className="text-base font-bold text-zinc-900 dark:text-zinc-100 truncate">{user?.email}</p>
                                </div>
                                {isEditing && <LockIcon />}
                            </div>

                            <div className="group flex items-center gap-4 px-5 py-4 bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-900/50 dark:hover:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800/60 transition-colors">
                                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center shrink-0">
                                    <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <div className="flex-1 truncate">
                                    <p className="text-[11px] uppercase font-bold tracking-widest text-zinc-400 mb-0.5">Account Role</p>
                                    <p className="text-base font-bold text-zinc-900 dark:text-zinc-100 capitalize">{user?.role || "User"}</p>
                                </div>
                                {isEditing && <LockIcon />}
                            </div>
                        </div>

                        <div className="pt-4">
                            {isEditing ? (
                                <div className="flex gap-3">
                                    <button 
                                        onClick={handleCancel}
                                        disabled={isSaving}
                                        className="flex-1 flex items-center justify-center gap-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-bold py-3.5 px-4 rounded-xl transition-colors disabled:opacity-50"
                                    >
                                        <X className="w-4 h-4" /> Cancel
                                    </button>
                                    <button 
                                        onClick={handleSave}
                                        disabled={isSaving || !formData.name?.trim()}
                                        className="flex-[2] flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-lg shadow-blue-600/20 disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {isSaving ? (
                                            <><Loader2 className="w-5 h-5 animate-spin" /> Saving...</>
                                        ) : (
                                            <><Check className="w-5 h-5" /> Save Changes</>
                                        )}
                                    </button>
                                </div>
                            ) : (
                                <button 
                                    onClick={() => setIsEditing(true)}
                                    className="w-full flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-900 font-bold py-3.5 px-4 rounded-xl transition-all shadow-lg shadow-zinc-900/10 dark:shadow-white/10 active:scale-[0.98]"
                                >
                                    <Edit2 className="w-4 h-4" /> Edit Profile
                                </button>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

const LockIcon = () => (
    <div className="px-2 py-1 bg-zinc-200/50 dark:bg-zinc-800/50 rounded-md">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
    </div>
);