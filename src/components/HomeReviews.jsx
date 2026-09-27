"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Star, 
  ShieldCheck, 
  Quote, 
  Bus, 
  Train, 
  Plane, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  MessageSquarePlus, 
  X, 
  CheckCircle2,
  Send,
  Loader2
} from "lucide-react";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-hot-toast";

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

export function HomeReviews() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalReviewsCount, setTotalReviewsCount] = useState(0);
  const [averageRating, setAverageRating] = useState(4.9);

  // Review Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [formData, setFormData] = useState({
    userName: "",
    userEmail: "",
    comment: "",
    journeyTitle: "",
    transportType: "Bus"
  });

  // Pre-fill user data if logged in
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        userName: user.name || "",
        userEmail: user.email || ""
      }));
    }
  }, [user]);

  // Fetch reviews from API whenever currentPage changes
  const fetchReviews = async (page = 1) => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/reviews/public?page=${page}&limit=6`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews || []);
        setTotalPages(data.totalPages || 1);
        setTotalReviewsCount(data.totalReviews || 0);
        if (data.averageRating) setAverageRating(data.averageRating);
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews(currentPage);
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      const section = document.getElementById("passenger-reviews-section");
      if (section) {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!formData.userName.trim() || !formData.comment.trim()) {
      toast.error("Please enter your name and review message");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        userName: formData.userName,
        userEmail: formData.userEmail || user?.email || "guest@travelhub.com",
        userImage: user?.image || null,
        rating,
        comment: formData.comment,
        journeyTitle: formData.journeyTitle || "TravelHub Express Journey",
        transportType: formData.transportType || "Bus"
      };

      const res = await fetch(`${BASE_URL}/api/reviews/public`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Thank you! Your review is live on TravelHub 🎉");
        setIsModalOpen(false);
        setFormData(prev => ({ ...prev, comment: "", journeyTitle: "" }));
        setRating(5);
        setCurrentPage(1);
        fetchReviews(1);
      } else {
        toast.error(data.message || "Failed to submit review");
      }
    } catch (err) {
      console.error("Error submitting review:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTransportIcon = (type) => {
    const t = String(type || "").toLowerCase();
    if (t.includes("train") || t.includes("rail")) return <Train className="w-4 h-4" />;
    if (t.includes("plane") || t.includes("flight") || t.includes("air")) return <Plane className="w-4 h-4" />;
    return <Bus className="w-4 h-4" />;
  };

  return (
    <section 
      id="passenger-reviews-section" 
      className="py-24 px-4 sm:px-6 relative bg-default-50 dark:bg-slate-900/50 border-t border-b border-default-200/60 dark:border-slate-800/60 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto relative z-10">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-center md:items-end justify-between mb-16 gap-6 text-center md:text-left">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-xs font-bold uppercase tracking-widest mb-4"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-500" /> Real Passenger Feedback
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl font-black tracking-tight text-foreground"
            >
              What Our Travelers <span className="text-cyan-500 dark:text-cyan-400">Say About Us</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-foreground/70 text-base sm:text-lg mt-3 font-normal max-w-2xl"
            >
              Verified passenger reviews and ratings across all our premium bus, train, and flight destinations.
            </motion.p>
          </div>

          {/* "Review Us" Action Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25 }}
          >
            <button
              onClick={() => setIsModalOpen(true)}
              className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold text-sm tracking-wide shadow-xl shadow-cyan-500/20 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <MessageSquarePlus className="w-5 h-5 transition-transform group-hover:rotate-12" />
              <span>Review Us</span>
              <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
            </button>
          </motion.div>
        </div>

        {/* Dynamic Animated Statistics Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6"
        >
          {/* Stat 1: Average Rating */}
          <div className="p-6 rounded-[2rem] bg-content1 border border-default-200 dark:border-default-100/15 shadow-lg text-center border-t-2 border-t-amber-400">
            <div className="text-3xl sm:text-4xl font-black text-amber-500 flex items-center justify-center gap-1.5">
              <AnimatedCounter value={averageRating} decimals={1} />
              <Star className="w-7 h-7 fill-amber-400 text-amber-400" />
            </div>
            <p className="text-xs sm:text-sm font-bold text-foreground/70 mt-2">
              Average Passenger Rating
            </p>
          </div>

          {/* Stat 2: On-Time Arrival */}
          <div className="p-6 rounded-[2rem] bg-content1 border border-default-200 dark:border-default-100/15 shadow-lg text-center border-t-2 border-t-cyan-500">
            <div className="text-3xl sm:text-4xl font-black text-cyan-500 dark:text-cyan-400">
              <AnimatedCounter value={99.4} decimals={1} suffix="%" />
            </div>
            <p className="text-xs sm:text-sm font-bold text-foreground/70 mt-2">
              On-Time Departure Rate
            </p>
          </div>

          {/* Stat 3: Verified Passengers */}
          <div className="p-6 rounded-[2rem] bg-content1 border border-default-200 dark:border-default-100/15 shadow-lg text-center border-t-2 border-t-emerald-500">
            <div className="text-3xl sm:text-4xl font-black text-emerald-500 flex items-center justify-center gap-1.5">
              <AnimatedCounter value={100} decimals={0} suffix="%" />
              <ShieldCheck className="w-7 h-7 text-emerald-500" />
            </div>
            <p className="text-xs sm:text-sm font-bold text-foreground/70 mt-2">
              Verified Passengers
            </p>
          </div>

          {/* Stat 4: Total Reviews Count */}
          <div className="p-6 rounded-[2rem] bg-content1 border border-default-200 dark:border-default-100/15 shadow-lg text-center border-t-2 border-t-blue-500">
            <div className="text-3xl sm:text-4xl font-black text-blue-600 dark:text-blue-400">
              <AnimatedCounter value={totalReviewsCount > 0 ? totalReviewsCount : 13} decimals={0} suffix="+" />
            </div>
            <p className="text-xs sm:text-sm font-bold text-foreground/70 mt-2">
              Total Live Reviews
            </p>
          </div>
        </motion.div>

        {/* Reviews Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div 
                key={i} 
                className="h-[280px] rounded-[2rem] bg-default-200/60 dark:bg-slate-800/60 animate-pulse border border-default-200 dark:border-slate-800" 
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((rev, i) => (
              <motion.div
                key={rev._id || i}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -6 }}
                className="group relative flex flex-col justify-between p-8 rounded-[2rem] bg-content1 border border-default-200 dark:border-default-100/15 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-cyan-500/40 overflow-hidden"
              >
                {/* Decorative Quote Mark */}
                <Quote className="absolute top-6 right-6 w-12 h-12 text-default-200/50 dark:text-slate-800/70 group-hover:text-cyan-500/20 transition-colors pointer-events-none" />

                <div>
                  {/* Journey / Ticket Badge */}
                  {rev.ticketInfo && (
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 text-xs font-bold text-cyan-600 dark:text-cyan-400 mb-5 border border-cyan-500/20">
                      <span className="text-cyan-500">{getTransportIcon(rev.ticketInfo.type)}</span>
                      <span className="truncate max-w-[210px]">{rev.ticketInfo.title}</span>
                    </div>
                  )}

                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, s) => (
                      <Star
                        key={s}
                        className={`w-4.5 h-4.5 ${
                          s < rev.rating
                            ? "fill-amber-400 text-amber-400"
                            : "fill-default-200 text-default-300 dark:fill-slate-800 dark:text-slate-800"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Review Body */}
                  <p className="text-foreground/90 font-medium text-sm leading-relaxed italic mb-6">
                    &ldquo;{rev.comment}&rdquo;
                  </p>
                </div>

                {/* Reviewer Profile */}
                <div className="pt-5 border-t border-default-200/60 dark:border-default-100/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {rev.userImage ? (
                      <img
                        src={rev.userImage}
                        alt={rev.userName}
                        className="w-11 h-11 rounded-full object-cover ring-2 ring-cyan-500/30"
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-full bg-cyan-500 text-white font-extrabold flex items-center justify-center text-sm shadow-sm">
                        {rev.userName ? rev.userName.charAt(0).toUpperCase() : "P"}
                      </div>
                    )}
                    <div>
                      <h4 className="text-sm font-black text-foreground flex items-center gap-1">
                        {rev.userName || "Traveler"}
                      </h4>
                      {rev.isVerifiedBuyer !== false && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Verified Passenger
                        </span>
                      )}
                    </div>
                  </div>

                  {rev.createdAt && (
                    <span className="text-[11px] font-semibold text-foreground/50">
                      {new Date(rev.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Dynamic Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-14 flex items-center justify-center gap-3">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center gap-1.5 px-5 py-3 rounded-2xl border border-default-200 dark:border-slate-800 bg-background text-foreground text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:bg-default-100 shadow-md cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>

            <div className="flex items-center gap-2 px-2">
              {[...Array(totalPages)].map((_, idx) => {
                const pageNum = idx + 1;
                const isActive = pageNum === currentPage;
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-10 h-10 rounded-2xl text-xs font-black transition-all cursor-pointer ${
                      isActive
                        ? "bg-cyan-500 text-white font-black shadow-lg shadow-cyan-500/25 scale-105"
                        : "bg-background text-foreground border border-default-200 dark:border-slate-800 hover:bg-default-100"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1.5 px-5 py-3 rounded-2xl border border-default-200 dark:border-slate-800 bg-background text-foreground text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:bg-default-100 shadow-md cursor-pointer"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Review Us Modal Dialog */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-lg p-6 sm:p-8 rounded-[2.5rem] bg-background dark:bg-slate-900 border border-default-200 dark:border-slate-800 shadow-2xl text-foreground"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-6 border-b border-default-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white flex items-center justify-center font-black shadow-md shadow-cyan-500/20">
                    <Star className="w-6 h-6 fill-white text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-foreground">Review TravelHub</h3>
                    <p className="text-xs text-foreground/70 font-medium">Share your journey experience live with travelers</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-9 h-9 rounded-full bg-default-100 dark:bg-slate-800 flex items-center justify-center text-foreground/70 hover:text-foreground transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmitReview} className="mt-6 space-y-5">
                {/* Rating Selector */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-foreground/70 mb-2">
                    Your Star Rating
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1.5 focus:outline-none transition-transform hover:scale-110 cursor-pointer"
                      >
                        <Star
                          className={`w-7 h-7 ${
                            star <= (hoverRating || rating)
                              ? "fill-amber-400 text-amber-400"
                              : "fill-default-200 text-default-300 dark:fill-slate-800 dark:text-slate-800"
                          }`}
                        />
                      </button>
                    ))}
                    <span className="ml-2 text-sm font-black text-amber-500">
                      {hoverRating || rating} / 5 Stars
                    </span>
                  </div>
                </div>

                {/* Name Input */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-foreground/70 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Johnson"
                    value={formData.userName}
                    onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-2xl bg-default-100/70 dark:bg-slate-800/80 border border-default-200 dark:border-slate-700 text-sm font-medium focus:outline-none focus:border-cyan-500 text-foreground"
                  />
                </div>

                {/* Journey Title & Transport Type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-foreground/70 mb-2">
                      Journey / Route Title
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. London to Edinburgh"
                      value={formData.journeyTitle}
                      onChange={(e) => setFormData({ ...formData, journeyTitle: e.target.value })}
                      className="w-full px-4 py-3.5 rounded-2xl bg-default-100/70 dark:bg-slate-800/80 border border-default-200 dark:border-slate-700 text-sm font-medium focus:outline-none focus:border-cyan-500 text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-foreground/70 mb-2">
                      Transport Mode
                    </label>
                    <select
                      value={formData.transportType}
                      onChange={(e) => setFormData({ ...formData, transportType: e.target.value })}
                      className="w-full px-4 py-3.5 rounded-2xl bg-default-100/70 dark:bg-slate-800/80 border border-default-200 dark:border-slate-700 text-sm font-medium focus:outline-none focus:border-cyan-500 text-foreground"
                    >
                      <option value="Bus">Bus Express</option>
                      <option value="Train">High Speed Rail</option>
                      <option value="Plane">Air Flight</option>
                    </select>
                  </div>
                </div>

                {/* Comment Textarea */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-foreground/70 mb-2">
                    Your Review Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us about the comfort, punctuality, and overall travel experience..."
                    value={formData.comment}
                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-2xl bg-default-100/70 dark:bg-slate-800/80 border border-default-200 dark:border-slate-700 text-sm font-medium focus:outline-none focus:border-cyan-500 text-foreground"
                  />
                </div>

                {/* Submit button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black text-sm tracking-wide flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/25 hover:from-cyan-600 hover:to-blue-700 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" /> Submitting Review...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" /> Submit Review Live
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
