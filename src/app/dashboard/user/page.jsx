"use client";

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Camera, Mail, ShieldCheck, User, Edit2, Check, X, Loader2, UploadCloud, Lock } from 'lucide-react';
import { authClient } from "@/lib/auth-client";
import { updateProfileAPI, updateProfileClientUI} from '@/lib/actions/manageUser';
import "animate.css";
import toast from 'react-hot-toast';


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
                    toast.error("ImgBB API Key is missing in .env.local file!");
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
                    toast.error(`ImgBB Error: ${imgbbData?.error?.message || "Upload failed"}`);
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
                toast.error(`Error: ${updateRes.message || "Failed to update profile in database!"}`);
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
        <div className="flex items-center justify-center min-h-[85vh] w-full px-4 py-8 sm:py-12 font-sans overflow-hidden transition-colors duration-300">
            <div className="w-full max-w-xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-2xl border border-gray-200 dark:border-gray-800 shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden relative transition-all duration-500 animate__animated animate__zoomIn animate__faster">
                
                <div className="h-32 sm:h-48 bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-600 relative overflow-hidden animate__animated animate__fadeInDown">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20"></div>
                    <div className="absolute top-4 right-4 sm:top-6 sm:right-6 animate__animated animate__fadeInRight animate__delay-1s">
                        <span className={`text-[9px] sm:text-[10px] uppercase tracking-widest font-black px-4 sm:px-5 py-1.5 sm:py-2 rounded-full border shadow-lg backdrop-blur-md ${currentRoleColor}`}>
                            {user?.role || "User"}
                        </span>
                    </div>
                </div>

                <div className="px-5 sm:px-10 pb-8 sm:pb-12 pt-2 relative flex flex-col items-center">
                    
                    <div className="relative -mt-16 sm:-mt-24 mb-4 sm:mb-6 group animate__animated animate__zoomIn" style={{ animationDelay: '0.2s' }}>
                        <div className="w-24 h-24 sm:w-36 sm:h-36 rounded-full border-[4px] sm:border-[6px] border-white dark:border-gray-900 overflow-hidden shadow-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center relative transition-transform duration-500 group-hover:scale-[1.02]">
                            {previewImage ? (
                                <Image src={previewImage} alt={user?.name || "User"} fill unoptimized className="object-cover transition-transform duration-700 group-hover:scale-110" />
                            ) : (
                                <span className="text-4xl sm:text-6xl font-black text-gray-400 dark:text-gray-600">
                                    {user?.name?.[0]?.toUpperCase()}
                                </span>
                            )}

                            {isEditing && (
                                <label className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer z-10">
                                    <UploadCloud className="w-8 h-8 sm:w-10 sm:h-10 text-white mb-1 sm:mb-2 animate__animated animate__bounceIn" />
                                    <span className="text-white text-[9px] sm:text-[11px] font-black uppercase tracking-widest">Upload</span>
                                    <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageChange} />
                                </label>
                            )}
                        </div>
                        {isEditing && (
                            <button onClick={() => fileInputRef.current?.click()} className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white p-2.5 sm:p-3 rounded-full shadow-xl hover:shadow-blue-500/40 border-[2px] sm:border-[3px] border-white dark:border-gray-900 z-20 transition-all hover:scale-110 active:scale-95 group-hover:animate-bounce">
                                <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                        )}
                    </div>

                    <div className="w-full space-y-5 sm:space-y-7">
                        <div className="text-center animate__animated animate__fadeInUp" style={{ animationDelay: '0.3s' }}>
                            {isEditing ? (
                                <div className="space-y-1.5 sm:space-y-2 max-w-sm mx-auto">
                                    <label className="text-[10px] sm:text-[11px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest text-left block pl-1">Display Name</label>
                                    <input 
                                        type="text" 
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        className="w-full text-center text-lg sm:text-xl font-black text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl sm:rounded-2xl px-4 sm:px-5 py-3 sm:py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white dark:focus:bg-gray-800 transition-all shadow-inner placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                        placeholder="Enter your name"
                                    />
                                </div>
                            ) : (
                                <>
                                    <h1 className="text-2xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight leading-none mb-1.5 sm:mb-2">{user?.name}</h1>
                                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-bold">Manage your personal information</p>
                                </>
                            )}
                        </div>

                        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent my-4 sm:my-6 animate__animated animate__fadeIn" style={{ animationDelay: '0.4s' }}></div>

                        <div className="space-y-3 sm:space-y-4">
                            {!isEditing && (
                                <div className="group flex items-center gap-3 sm:gap-5 px-4 sm:px-6 py-3 sm:py-4.5 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800/40 dark:hover:bg-gray-800 rounded-xl sm:rounded-2xl border border-gray-200/60 dark:border-gray-700/60 transition-all duration-300 shadow-sm hover:shadow-md animate__animated animate__fadeInUp" style={{ animationDelay: '0.5s' }}>
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                                        <User className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div className="flex-1 truncate">
                                        <p className="text-[10px] sm:text-[11px] uppercase font-black tracking-widest text-gray-500 dark:text-gray-400 mb-0.5 sm:mb-1">Full Name</p>
                                        <p className="text-sm sm:text-base font-black text-gray-900 dark:text-white truncate">{user?.name}</p>
                                    </div>
                                </div>
                            )}

                            <div className="group flex items-center gap-3 sm:gap-5 px-4 sm:px-6 py-3 sm:py-4.5 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800/40 dark:hover:bg-gray-800 rounded-xl sm:rounded-2xl border border-gray-200/60 dark:border-gray-700/60 transition-all duration-300 shadow-sm hover:shadow-md animate__animated animate__fadeInUp" style={{ animationDelay: '0.6s' }}>
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-purple-100 dark:bg-purple-500/10 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                                    <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div className="flex-1 truncate">
                                    <p className="text-[10px] sm:text-[11px] uppercase font-black tracking-widest text-gray-500 dark:text-gray-400 mb-0.5 sm:mb-1">Email Address</p>
                                    <p className="text-sm sm:text-base font-black text-gray-900 dark:text-white truncate">{user?.email}</p>
                                </div>
                                {isEditing && (
                                    <div className="px-2 sm:px-3 py-1 sm:py-1.5 bg-gray-200/50 dark:bg-gray-700/50 rounded-lg animate__animated animate__fadeIn">
                                        <Lock className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 dark:text-gray-400" />
                                    </div>
                                )}
                            </div>

                            <div className="group flex items-center gap-3 sm:gap-5 px-4 sm:px-6 py-3 sm:py-4.5 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800/40 dark:hover:bg-gray-800 rounded-xl sm:rounded-2xl border border-gray-200/60 dark:border-gray-700/60 transition-all duration-300 shadow-sm hover:shadow-md animate__animated animate__fadeInUp" style={{ animationDelay: '0.7s' }}>
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300">
                                    <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <div className="flex-1 truncate">
                                    <p className="text-[10px] sm:text-[11px] uppercase font-black tracking-widest text-gray-500 dark:text-gray-400 mb-0.5 sm:mb-1">Account Role</p>
                                    <p className="text-sm sm:text-base font-black text-gray-900 dark:text-white capitalize">{user?.role || "User"}</p>
                                </div>
                                {isEditing && (
                                    <div className="px-2 sm:px-3 py-1 sm:py-1.5 bg-gray-200/50 dark:bg-gray-700/50 rounded-lg animate__animated animate__fadeIn">
                                        <Lock className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 dark:text-gray-400" />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="pt-4 sm:pt-6 animate__animated animate__fadeInUp" style={{ animationDelay: '0.8s' }}>
                            {isEditing ? (
                                <div className="flex gap-3 sm:gap-4">
                                    <button 
                                        onClick={handleCancel}
                                        disabled={isSaving}
                                        className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-black py-3 sm:py-4 px-3 sm:px-4 rounded-xl sm:rounded-2xl transition-all disabled:opacity-50 group cursor-pointer border border-gray-200 dark:border-gray-700 text-sm sm:text-base"
                                    >
                                        <X className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 group-hover:text-red-500 transition-all" /> Cancel
                                    </button>
                                    <button 
                                        onClick={handleSave}
                                        disabled={isSaving || !formData.name?.trim()}
                                        className="flex-[2] flex items-center justify-center gap-1.5 sm:gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-black py-3 sm:py-4 px-3 sm:px-4 rounded-xl sm:rounded-2xl transition-all shadow-lg shadow-blue-500/30 disabled:opacity-70 disabled:cursor-not-allowed group cursor-pointer active:scale-[0.98] border-transparent text-sm sm:text-base"
                                    >
                                        {isSaving ? (
                                            <><Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" /> Saving...</>
                                        ) : (
                                            <><Check className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-125 group-hover:-translate-y-1 transition-transform" /> Save Changes</>
                                        )}
                                    </button>
                                </div>
                            ) : (
                                <button 
                                    onClick={() => setIsEditing(true)}
                                    className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-gray-200 text-white dark:text-gray-900 font-black py-3.5 sm:py-4.5 px-4 rounded-xl sm:rounded-2xl transition-all shadow-xl shadow-gray-900/20 dark:shadow-white/10 active:scale-[0.98] group cursor-pointer border border-transparent text-sm sm:text-base"
                                >
                                    <Edit2 className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-12 group-hover:scale-110 transition-transform" /> Edit Profile
                                </button>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}