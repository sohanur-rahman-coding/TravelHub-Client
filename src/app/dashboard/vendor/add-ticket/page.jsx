"use client";

import React, { useState } from "react";
import { Button, Input, Label, Surface, TextField } from "@heroui/react";
import { CheckCircle, Loader2, UploadCloud, Check, Plus } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { uploadImageToImgBB } from "@/lib/UploadImage"; 
import { addTicketAction } from "@/lib/actions/tickets";
const ALL_PERKS = ["AC", "Non-AC", "WiFi", "Breakfast", "Blanket", "Water Bottle", "Sleeper"];

export default function AddTicketPage({ onTicketAdded }) {
  const session = authClient.useSession();
  const currentUser = session?.data?.user;

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [perks, setPerks] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);

  const togglePerk = (perk) => {
    setPerks((prev) =>
      prev.includes(perk) ? prev.filter((p) => p !== perk) : [...prev, perk]
    );
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const formData = new FormData(e.target);
      const imageFile = formData.get("imageFile");
      
      let uploadedImageUrl = "";

      // ১. ImgBB-তে ইমেজ আপলোড প্রসেস স্টার্ট
      if (imageFile && imageFile.size > 0) {
        uploadedImageUrl = await uploadImageToImgBB(imageFile);
      } else {
        alert("Please select a ticket image.");
        setLoading(false);
        return;
      }

      // ২. সম্পূর্ণ ফর্ম ডাটা অবজেক্ট তৈরি (ImgBB URL সহ)
      const ticketData = {
        title: formData.get("title"),
        from: formData.get("from"),
        to: formData.get("to"),
        price: Number(formData.get("price")),
        quantity: Number(formData.get("quantity")),
        type: formData.get("type"),
        date: formData.get("date"),
        image: uploadedImageUrl, // ডাটাবেজে এই ইউআরএলটি যাবে
        perks: perks,
        vendorName: currentUser?.name || "Unknown Vendor",
        vendorEmail: currentUser?.email || "Unknown Email",
        verificationStatus: "pending",
      };

      console.log("Submitting Ticket Data to DB:", ticketData);

      // ব্যাকএন্ডServer Action কল:
      await addTicketAction(ticketData);

      setSuccess(true);
      setPerks([]);
      setImagePreview(null);
      e.target.reset();

      if (onTicketAdded) onTicketAdded();
    } catch (error) {
      console.error("Submission failed:", error);
      alert("Failed to upload image or submit ticket. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl w-full mx-auto">
      <h2 className="text-2xl font-black text-foreground mb-6">Add New Ticket</h2>
      
      {success && (
        <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 mb-5 flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle size={18} className="text-emerald-600 shrink-0" />
          <p className="text-sm text-emerald-700 dark:text-emerald-400 font-semibold">
            Ticket submitted for admin review. You will be notified once approved.
          </p>
        </div>
      )}

      <Surface variant="default" className="bg-background border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-xl shadow-zinc-100/50 dark:shadow-none">
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          
          <TextField className="w-full" variant="secondary">
            <Label className="text-xs font-bold text-zinc-400 dark:text-zinc-500 mb-1.5 uppercase tracking-wider">Ticket Title *</Label>
            <Input name="title" required placeholder="e.g. London to Paris Flight / Intercity Express" />
          </TextField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextField variant="secondary">
              <Label className="text-xs font-bold text-zinc-400 dark:text-zinc-500 mb-1.5 uppercase tracking-wider">From (City / Country) *</Label>
              <Input name="from" required placeholder="e.g. New York, USA" />
            </TextField>

            <TextField variant="secondary">
              <Label className="text-xs font-bold text-zinc-400 dark:text-zinc-500 mb-1.5 uppercase tracking-wider">To (City / Country) *</Label>
              <Input name="to" required placeholder="e.g. Tokyo, Japan" />
            </TextField>

            <TextField variant="secondary">
              <Label className="text-xs font-bold text-zinc-400 dark:text-zinc-500 mb-1.5 uppercase tracking-wider">Price / Seat (USD) *</Label>
              <Input name="price" type="number" min="1" required placeholder="150" />
            </TextField>

            <TextField variant="secondary">
              <Label className="text-xs font-bold text-zinc-400 dark:text-zinc-500 mb-1.5 uppercase tracking-wider">Total Seats *</Label>
              <Input name="quantity" type="number" min="1" required placeholder="50" />
            </TextField>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-0.5">Transport Type *</label>
              <select name="type" className="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 h-10 text-sm text-foreground outline-none focus:border-[#0B3977] transition-all">
                {["Bus", "Train", "Plane", "Launch"].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <TextField variant="secondary">
              <Label className="text-xs font-bold text-zinc-400 dark:text-zinc-500 mb-1.5 uppercase tracking-wider">Departure Date & Time *</Label>
              <Input name="date" type="datetime-local" required />
            </TextField>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Perks / Amenities</label>
            <div className="flex flex-wrap gap-2">
              {ALL_PERKS.map((p) => {
                const isChecked = perks.includes(p);
                return (
                  <label key={p} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all border ${isChecked ? "bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900 text-[#0B3977] dark:text-blue-400" : "bg-zinc-50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-foreground"}`}>
                    <input type="checkbox" checked={isChecked} onChange={() => togglePerk(p)} className="sr-only" />
                    {isChecked && <Check size={10} strokeWidth={3} />}
                    {p}
                  </label>
                );
              })}
            </div>
          </div>

          {/* Clickable Picker Zone */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Ticket Image *</label>
            <label className="w-full h-32 border-2 border-dashed border-zinc-300 dark:border-zinc-800 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900/30 transition-all overflow-hidden relative group">
              <input name="imageFile" type="file" accept="image/*" required onChange={handleImageChange} className="sr-only" />
              
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <>
                  <UploadCloud className="w-8 h-8 text-zinc-400 group-hover:text-[#0B3977] transition-colors" />
                  <span className="text-xs font-bold text-zinc-500">Click to upload ticket photo</span>
                </>
              )}
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <TextField variant="secondary">
              <Label className="text-xs font-bold text-zinc-400 dark:text-zinc-500 mb-1.5 uppercase tracking-wider">Vendor Name</Label>
              <Input readOnly value={currentUser?.name || "Loading..."} className="cursor-not-allowed text-zinc-400 dark:text-zinc-500 bg-zinc-100 dark:bg-zinc-900" />
            </TextField>
            <TextField variant="secondary">
              <Label className="text-xs font-bold text-zinc-400 dark:text-zinc-500 mb-1.5 uppercase tracking-wider">Vendor Email</Label>
              <Input readOnly value={currentUser?.email || "Loading..."} className="cursor-not-allowed text-zinc-400 dark:text-zinc-500 bg-zinc-100 dark:bg-zinc-900" />
            </TextField>
          </div>

          <div className="mt-4 border-t border-zinc-200 dark:border-zinc-800 pt-4 flex gap-3 justify-end">
            <Button type="submit" disabled={loading} className="w-full bg-[#0B3977] text-white hover:bg-blue-700 py-3.5 px-6 font-bold flex items-center justify-center gap-2 disabled:opacity-50 transition-all rounded-xl shadow-lg">
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
              {loading ? "Uploading Image..." : "Add Ticket for Review"}
            </Button>
          </div>

        </form>
      </Surface>
    </div>
  );
}