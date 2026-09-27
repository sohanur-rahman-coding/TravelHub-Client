"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Star, ShieldCheck, MessageSquarePlus, ThumbsUp, X, Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

function StarRating({ rating = 0, size = 16, interactive = false, onSelect = null }) {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = interactive
          ? (hoverRating || rating) >= star
          : rating >= star;
        return (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onMouseEnter={() => interactive && setHoverRating(star)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            onClick={() => interactive && onSelect && onSelect(star)}
            className={`${interactive ? "cursor-pointer transform hover:scale-125 transition-transform" : "cursor-default"}`}
          >
            <Star
              size={size}
              className={`${
                isFilled
                  ? "fill-amber-400 text-amber-400"
                  : "fill-transparent text-gray-300 dark:text-slate-700"
              } transition-colors`}
            />
          </button>
        );
      })}
    </div>
  );
}

export default function TicketReviews({ ticketId, user }) {
  const [data, setData] = useState({
    totalReviews: 0,
    averageRating: 0,
    ratingCounts: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    reviews: [],
  });
  const [loading, setLoading] = useState(true);
  const [eligibility, setEligibility] = useState({
    isEligible: true,
    isVerifiedBuyer: false,
    hasReviewed: false,
    existingReview: null,
  });

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRating, setSelectedRating] = useState(5);
  const [comment, setComment] = useState("");
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Pre-fill user data when user session changes
  useEffect(() => {
    if (user) {
      if (user.name) setGuestName(user.name);
      if (user.email) setGuestEmail(user.email);
    }
  }, [user]);

  const fetchReviews = useCallback(async () => {
    if (!ticketId) return;
    try {
      const res = await fetch(`${BASE_URL}/api/reviews/ticket/${ticketId}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error("Failed to load reviews:", err);
    } finally {
      setLoading(false);
    }
  }, [ticketId]);

  const checkEligibility = useCallback(async () => {
    if (!ticketId) return;
    try {
      let headers = {};
      if (user) {
        try {
          const { data: token } = await authClient.token();
          if (token?.token || token) {
            headers.authorization = `Bearer ${token?.token || token}`;
          }
        } catch (e) {}
      }

      const emailParam = user?.email ? `?email=${encodeURIComponent(user.email)}` : "";
      const res = await fetch(`${BASE_URL}/api/reviews/eligibility/${ticketId}${emailParam}`, {
        headers,
      });
      if (res.ok) {
        const json = await res.json();
        setEligibility(json);
        if (json.existingReview) {
          setSelectedRating(json.existingReview.rating || 5);
          setComment(json.existingReview.comment || "");
        }
      }
    } catch (err) {
      console.error("Failed to check review eligibility:", err);
    }
  }, [ticketId, user]);

  useEffect(() => {
    fetchReviews();
    checkEligibility();
  }, [fetchReviews, checkEligibility]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error("Please provide a short review comment.");
      return;
    }

    const reviewerName = user?.name || guestName.trim() || "Traveler";

    setSubmitting(true);
    try {
      let headers = {
        "Content-Type": "application/json",
      };

      if (user) {
        try {
          const { data: token } = await authClient.token();
          if (token?.token || token) {
            headers.authorization = `Bearer ${token?.token || token}`;
          }
        } catch (e) {}
      }

      const res = await fetch(`${BASE_URL}/api/reviews`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          ticketId,
          rating: selectedRating,
          comment: comment.trim(),
          userName: reviewerName,
          userEmail: user?.email || guestEmail.trim() || undefined,
          userImage: user?.image || undefined,
        }),
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.message || "Failed to submit review");
      }

      toast.success(resData.message || "Review submitted successfully! 🎉");
      setIsModalOpen(false);
      setComment("");
      fetchReviews();
      checkEligibility();
    } catch (err) {
      toast.error(err.message || "Error submitting review");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "Recent";
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch (e) {
      return "Recent";
    }
  };

  return (
    <div id="ticket-reviews" className="mt-14 w-full scroll-mt-20">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-400">
              Verified Feedback
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
            Passenger Reviews &amp; Ratings
          </h2>
        </div>

        {/* Action Button */}
        <div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold text-sm shadow-lg shadow-cyan-500/25 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
          >
            <MessageSquarePlus size={18} />
            {eligibility.hasReviewed ? "Update Your Review" : "Leave a Review"}
          </button>
        </div>
      </div>

      {/* Ratings Overview Card */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 bg-white dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-sm">
        {/* Score Summary */}
        <div className="flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-100 dark:border-slate-700 pb-6 md:pb-0 md:pr-6">
          <div className="text-6xl font-black text-gray-900 dark:text-white tracking-tight">
            {data.totalReviews > 0 ? data.averageRating : "—"}
          </div>
          <div className="mt-3">
            <StarRating rating={data.averageRating} size={20} />
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-slate-400 mt-2">
            Based on {data.totalReviews} {data.totalReviews === 1 ? "review" : "reviews"}
          </p>
        </div>

        {/* Breakdown Progress Bars */}
        <div className="md:col-span-2 flex flex-col justify-center space-y-2.5">
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = data.ratingCounts?.[stars] || 0;
            const percentage =
              data.totalReviews > 0
                ? Math.round((count / data.totalReviews) * 100)
                : 0;

            return (
              <div key={stars} className="flex items-center gap-3 text-xs">
                <span className="w-7 font-bold text-gray-700 dark:text-slate-300">
                  {stars} ★
                </span>
                <div className="flex-1 h-2.5 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-10 text-right font-medium text-gray-400 dark:text-slate-400">
                  {percentage}%
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reviews List */}
      <div className="mt-8 space-y-4">
        {loading ? (
          <div className="py-12 flex justify-center items-center text-gray-400">
            <Loader2 className="animate-spin mr-2" size={20} />
            Loading passenger reviews...
          </div>
        ) : data.reviews.length === 0 ? (
          <div className="text-center py-14 bg-gray-50/50 dark:bg-slate-800/30 rounded-3xl border border-dashed border-gray-200 dark:border-slate-800 p-8">
            <div className="w-14 h-14 bg-amber-100 dark:bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Star size={26} />
            </div>
            <h4 className="text-base font-bold text-gray-900 dark:text-white">
              No passenger reviews yet
            </h4>
            <p className="text-xs text-gray-500 dark:text-slate-400 max-w-sm mx-auto mt-1 mb-4">
              Be the first passenger to share your travel experience for this route!
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-xs hover:bg-cyan-500/20 transition-colors cursor-pointer"
            >
              <MessageSquarePlus size={15} /> Write the first review
            </button>
          </div>
        ) : (
          data.reviews.map((rev) => (
            <div
              key={rev._id}
              className="bg-white dark:bg-slate-800/80 border border-gray-100 dark:border-slate-700/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  {rev.userImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={rev.userImage}
                      alt={rev.userName}
                      className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-slate-700"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 text-white font-black flex items-center justify-center text-sm">
                      {rev.userName?.[0]?.toUpperCase() || "T"}
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-gray-900 dark:text-white">
                        {rev.userName || "Traveler"}
                      </h4>
                      {rev.isVerifiedBuyer !== false && (
                        <span className="flex items-center gap-1 text-[10px] font-black uppercase bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 px-2 py-0.5 rounded-full">
                          <ShieldCheck size={12} />
                          Verified Passenger
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-400 dark:text-slate-400 mt-0.5">
                      {formatDate(rev.createdAt || rev.updatedAt)}
                    </p>
                  </div>
                </div>

                <StarRating rating={rev.rating} size={15} />
              </div>

              <p className="mt-4 text-sm text-gray-700 dark:text-slate-300 leading-relaxed">
                {rev.comment}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Write / Edit Review Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden z-10"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-500/10 text-amber-500 flex items-center justify-center">
                    <Star size={20} fill="currentColor" />
                  </div>
                  <div>
                    <h3 className="font-black text-lg text-gray-900 dark:text-white">
                      {eligibility.hasReviewed ? "Update Your Review" : "Passenger Review"}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-slate-400">
                      Share your experience with fellow travelers
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmitReview} className="p-6 space-y-4">
                {/* Rating Select */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400 mb-2">
                    Your Rating
                  </label>
                  <div className="flex items-center gap-3 bg-gray-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-gray-100 dark:border-slate-800">
                    <StarRating
                      rating={selectedRating}
                      size={26}
                      interactive={true}
                      onSelect={(val) => setSelectedRating(val)}
                    />
                    <span className="text-sm font-black text-amber-500 ml-2">
                      {selectedRating} / 5 Stars
                    </span>
                  </div>
                </div>

                {/* Name / Email input if not logged in */}
                {!user && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400 mb-1.5">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Alex Johnson"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        className="w-full bg-gray-50 dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700/80 rounded-xl p-3 text-sm outline-none focus:border-cyan-500 focus:bg-white dark:focus:bg-slate-900 transition-all dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400 mb-1.5">
                        Email (Optional)
                      </label>
                      <input
                        type="email"
                        placeholder="alex@example.com"
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        className="w-full bg-gray-50 dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700/80 rounded-xl p-3 text-sm outline-none focus:border-cyan-500 focus:bg-white dark:focus:bg-slate-900 transition-all dark:text-white"
                      />
                    </div>
                  </div>
                )}

                {/* Comment Textarea */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400 mb-2">
                    Your Feedback *
                  </label>
                  <textarea
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="How was the journey, vehicle comfort, departure timeliness, and operator service?"
                    maxLength={1000}
                    className="w-full bg-gray-50 dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700/80 rounded-2xl p-4 text-sm outline-none focus:border-cyan-500 focus:bg-white dark:focus:bg-slate-900 transition-all dark:text-white placeholder:text-gray-400"
                    required
                  />
                  <div className="text-right text-[11px] text-gray-400 mt-1">
                    {comment.length} / 1000 characters
                  </div>
                </div>

                {/* Verified Badge Assurance */}
                <div className="flex items-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-xl text-emerald-700 dark:text-emerald-400 text-xs font-medium">
                  <ShieldCheck size={16} className="shrink-0 text-emerald-500" />
                  <span>
                    {eligibility.isVerifiedBuyer
                      ? "Verified Booking: Your review will carry the Verified Passenger badge."
                      : "Thank you for helping fellow travelers with your authentic feedback."}
                  </span>
                </div>

                {/* Buttons */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-3 rounded-xl border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 text-sm font-bold hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || !comment.trim()}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold text-sm shadow-lg shadow-cyan-500/25 disabled:opacity-50 transition-all cursor-pointer"
                  >
                    {submitting && <Loader2 size={16} className="animate-spin" />}
                    {eligibility.hasReviewed ? "Save Changes" : "Submit Review"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
