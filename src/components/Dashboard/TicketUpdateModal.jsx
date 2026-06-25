"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // রাউটার ইম্পোর্ট করা হলো
import { Button, Input, Label, Modal, Surface, TextField } from "@heroui/react";
import { Loader2, UploadCloud, Check, Save } from "lucide-react";
import { uploadImageToImgBB } from "@/lib/UploadImage";
import { updateTicket } from "@/lib/actions/tickets";

const ALL_PERKS = [
  "AC",
  "Non-AC",
  "WiFi",
  "Breakfast",
  "Blanket",
  "Water Bottle",
  "Sleeper",
];

export default function TicketUpdateModal({
  ticket,
  isOpen,
  onClose,
  onTicketUpdated,
}) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [perks, setPerks] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);

 
  const [formData, setFormData] = useState({
    title: "",
    from: "",
    to: "",
    price: "",
    quantity: "",
    type: "Bus",
    date: "",
  });

  
  const formatIsoDateForInput = (isoString) => {
    if (!isoString) return "";
    if (isoString.length === 16) return isoString;
    try {
      const dateObj = new Date(isoString);
      const pad = (num) => String(num).padStart(2, "0");
      return `${dateObj.getFullYear()}-${pad(dateObj.getMonth() + 1)}-${pad(dateObj.getDate())}T${pad(dateObj.getHours())}:${pad(dateObj.getMinutes())}`;
    } catch (e) {
      return isoString;
    }
  };


  useEffect(() => {
    if (ticket && isOpen) {
      setFormData({
        title: ticket.title || "",
        from: ticket.from || "",
        to: ticket.to || "",
        price: ticket.price || "",
        quantity: ticket.quantity || "",
        type: ticket.type || "Bus",
        date: formatIsoDateForInput(ticket.date),
      });
      setPerks(ticket.perks || []);
      setImagePreview(ticket.image || null);
    }
  }, [ticket, isOpen]);

  if (!ticket || !isOpen) return null;


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const togglePerk = (perk) => {
    setPerks((prev) =>
      prev.includes(perk) ? prev.filter((p) => p !== perk) : [...prev, perk],
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

    try {
      const fileInput = e.target.imageFile;
      const imageFile = fileInput?.files[0];
      let uploadedImageUrl = ticket.image;

      if (imageFile) {
        uploadedImageUrl = await uploadImageToImgBB(imageFile);
      }

      const updatedTicketData = {
        _id: ticket._id,
        title: formData.title,
        from: formData.from,
        to: formData.to,
        price: Number(formData.price),
        quantity: Number(formData.quantity),
        type: formData.type,
        date: formData.date,
        image: uploadedImageUrl,
        perks: perks,
        vendorName: ticket.vendorName,
        vendorEmail: ticket.vendorEmail,
        verificationStatus: "pending",
      };

      await updateTicket(updatedTicketData);

      if (onTicketUpdated) onTicketUpdated();
      onClose();
      
   
      router.refresh(); 

    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update ticket. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Backdrop>
        <Modal.Container placement="auto">
          <Modal.Dialog className="sm:max-w-2xl w-full">
            {/* এখানে onClick ইভেন্টটি যুক্ত করা হয়েছে যেন ক্রসে ক্লিক করলে মোডাল অফ হয় */}
            <Modal.CloseTrigger onClick={onClose} />
            
            <Modal.Header>
              <Modal.Heading className="text-xl font-black text-foreground">
                Update Ticket Details
              </Modal.Heading>
            </Modal.Header>
            
            <Modal.Body className="p-6">
              <Surface variant="default" className="bg-background border-none p-0">
                <form onSubmit={onSubmit} className="flex flex-col gap-4">
                  
                  <TextField className="w-full" variant="secondary">
                    <Label className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1.5">
                      Ticket Title *
                    </Label>
                    <Input
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g. London to Paris"
                    />
                  </TextField>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <TextField variant="secondary">
                      <Label className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1.5">
                        From *
                      </Label>
                      <Input name="from" value={formData.from} onChange={handleInputChange} required />
                    </TextField>

                    <TextField variant="secondary">
                      <Label className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1.5">
                        To *
                      </Label>
                      <Input name="to" value={formData.to} onChange={handleInputChange} required />
                    </TextField>

                    <TextField variant="secondary">
                      <Label className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1.5">
                        Price / Seat (USD) *
                      </Label>
                      <Input
                        name="price"
                        type="number"
                        min="1"
                        value={formData.price}
                        onChange={handleInputChange}
                        required
                      />
                    </TextField>

                    <TextField variant="secondary">
                      <Label className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1.5">
                        Total Seats *
                      </Label>
                      <Input
                        name="quantity"
                        type="number"
                        min="1"
                        value={formData.quantity}
                        onChange={handleInputChange}
                        required
                      />
                    </TextField>

                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1.5">
                        Transport Type *
                      </label>
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        className="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 h-10 text-sm text-foreground outline-none focus:border-[#0B3977] transition-all"
                      >
                        {["Bus", "Train", "Plane", "Launch"].map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>

                    <TextField variant="secondary">
                      <Label className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1.5">
                        Departure Date & Time *
                      </Label>
                      <Input
                        name="date"
                        type="datetime-local"
                        value={formData.date}
                        onChange={handleInputChange}
                        required
                      />
                    </TextField>
                  </div>

                  {/* Perks Section */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                      Perks / Amenities
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {ALL_PERKS.map((p) => {
                        const isChecked = perks.includes(p);
                        return (
                          <label
                            key={p}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all border ${isChecked ? "bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900 text-[#0B3977] dark:text-blue-400" : "bg-zinc-50 dark:bg-zinc-900/30 border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-foreground"}`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => togglePerk(p)}
                              className="sr-only"
                            />
                            {isChecked && <Check size={10} strokeWidth={3} />}
                            {p}
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Image Section */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                      Ticket Image (Leave empty to keep current)
                    </label>
                    <label className="w-full h-32 border-2 border-dashed border-zinc-300 dark:border-zinc-800 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900/30 transition-all overflow-hidden relative group">
                      <input
                        name="imageFile"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="sr-only"
                      />
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <>
                          <UploadCloud className="w-8 h-8 text-zinc-400 group-hover:text-[#0B3977] transition-colors" />
                          <span className="text-xs font-bold text-zinc-500">
                            Click to replace photo
                          </span>
                        </>
                      )}
                    </label>
                  </div>

                  <Modal.Footer className="px-0 pb-0 mt-4">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={onClose}
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="bg-[#0B3977] text-white hover:bg-blue-700 font-bold flex items-center gap-2 rounded-xl"
                    >
                      {loading ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Save size={16} />
                      )}
                      {loading ? "Saving Changes..." : "Update Ticket"}
                    </Button>
                  </Modal.Footer>
                </form>
              </Surface>
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}