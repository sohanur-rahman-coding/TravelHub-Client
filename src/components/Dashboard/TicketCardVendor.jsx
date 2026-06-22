'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Plane, Train, Bus, MapPin, Calendar, Ticket, ArrowRight, Edit, Trash2, ShieldAlert, ShieldCheck, ClockFading } from 'lucide-react';
import TicketUpdateModal from './TicketUpdateModal';
import DeleteConfirmModal from './DeleteConfirmModal'; // নতুন মডাল ইম্পোর্ট করা হলো
import { deleteTicket } from '@/lib/actions/tickets';

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957";

const TicketCardVendor = ({ ticket, onTicketUpdated, onDelete }) => {
  const router = useRouter();
  
  const [timeLeft, setTimeLeft] = useState('');
  const [imgSrc, setImgSrc] = useState(ticket?.image || FALLBACK_IMAGE);
  
  // মডাল স্টেটসমূহ
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setImgSrc(ticket?.image || FALLBACK_IMAGE);
  }, [ticket?.image, ticket?._id]);

  if (!ticket) {
    return (
      <div className="max-w-md w-full h-[520px] bg-slate-100 animate-pulse rounded-[2rem]" />
    );
  }

  const {
    _id,
    title,
    from,
    to,
    type,
    price,
    quantity,
    perks,
    date,
    verificationStatus = 'pending',
  } = ticket;

  const isRejected = verificationStatus?.toLowerCase() === 'rejected';

  useEffect(() => {
    const calculateTimeLeft = () => {
      if (!date) return;
      const difference = +new Date(date) - +new Date();
      
      if (difference <= 0) {
        setTimeLeft('Expired');
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s left`);
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [date]);

  const getTransportIcon = (transportType) => {
    switch (transportType?.toLowerCase()) {
      case 'plane': return <Plane className="w-4 h-4 text-blue-600" />;
      case 'train': return <Train className="w-4 h-4 text-blue-600" />;
      case 'bus': return <Bus className="w-4 h-4 text-blue-600" />;
      default: return <Ticket className="w-4 h-4 text-blue-600" />;
    }
  };

  const getStatusBadge = (statusValue) => {
    switch (statusValue?.toLowerCase()) {
      case 'approved':
        return (
          <div className="flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold border border-green-200">
            <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
            <span>Approved</span>
          </div>
        );
      case 'rejected':
        return (
          <div className="flex items-center gap-1 bg-red-50 text-red-700 px-3 py-1 rounded-full text-xs font-bold border border-red-200">
            <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
            <span>Rejected</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs font-bold border border-amber-200">
            <ClockFading className="w-3.5 h-3.5 text-amber-600" />
            <span>Pending</span>
          </div>
        );
    }
  };

  const formatDepartureDate = (dateString) => {
    if (!dateString) return '';
    const dateObj = new Date(dateString);
    return dateObj.toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true,
    });
  };

  const handleConfirmDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteTicket(_id);
      setIsDeleteModalOpen(false);
      
      if (onDelete) onDelete(_id); 
      router.refresh(); 
      
    } catch (error) {
      // console.error("Failed to delete ticket:", error);
      alert("Failed to delete the ticket. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-md w-full bg-white rounded-[2rem] border border-gray-100 shadow-md overflow-hidden flex flex-col justify-between font-sans mx-auto">
      
      <div className="relative w-full h-60">
        <Image
          src={imgSrc} 
          alt={title || "Ticket Image"}
          fill
          sizes="(max-width: 768px) 100vw, 450px"
          className="object-cover"
          priority
          onError={() => setImgSrc(FALLBACK_IMAGE)}
        />
        
        <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-blue-50/95 px-4 py-1 rounded-full shadow-sm">
          {getTransportIcon(type)}
          <span className="text-sm font-semibold text-blue-700 capitalize">{type}</span>
        </div>

        <div className="absolute top-4 right-4 shadow-sm">
          {getStatusBadge(verificationStatus)}
        </div>

        <div className="absolute bottom-4 right-4 bg-[#eef2ff] px-5 py-2 rounded-full shadow-sm border border-white">
          <span className="text-xl font-bold text-blue-600">${price}</span>
          <span className="text-xs font-medium text-gray-500">/seat</span>
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900 tracking-tight mb-4 line-clamp-2">{title}</h3>

          <div className="flex items-center gap-2 text-gray-800 font-semibold text-sm mb-3">
            <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
            <span className="truncate">{from}</span>
            <ArrowRight className="w-3.5 h-3.5 text-gray-400 shrink-0 mx-0.5" />
            <span className="truncate">{to}</span>
          </div>

          <div className="flex items-center gap-2 text-gray-500 font-medium text-sm mb-3">
            <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
            <span>{formatDepartureDate(date)}</span>
          </div>

          <div className="flex items-center justify-between text-gray-500 font-medium text-sm mb-5">
            <div className="flex items-center gap-2">
              <Ticket className="w-4 h-4 text-gray-400 shrink-0" />
              <span>{quantity} seats</span>
            </div>
            {timeLeft && (
              <span className="bg-gray-200 text-gray-800 px-2 py-0.5 text-xs font-semibold rounded font-mono">{timeLeft}</span>
            )}
          </div>

          {perks && perks.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-4">
              {perks.slice(0, 3).map((perk, index) => (
                <div key={index} className="flex items-center gap-1 bg-[#fffbeb] text-[#b45309] px-3 py-1 rounded-full text-xs font-semibold border border-[#fef3c7]">
                  <span className="text-[#d97706] text-xs font-bold">✓</span>
                  {perk}
                </div>
              ))}
              {perks.length > 3 && <span className="text-xs font-semibold text-gray-500 ml-0.5">+{perks.length - 3}</span>}
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              disabled={isRejected}
              className={`py-2.5 px-4 rounded-xl font-bold text-sm border flex items-center justify-center gap-2 transition-all cursor-pointer ${isRejected ? 'bg-gray-100 text-gray-400 border-gray-200 opacity-50 pointer-events-none cursor-not-allowed' : 'bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-700 hover:text-blue-600'}`}
            >
              <Edit className="w-4 h-4" /> Update
            </button>

            <button
              onClick={() => setIsDeleteModalOpen(true)}
              disabled={isRejected}
              className={`py-2.5 px-4 rounded-xl font-bold text-sm border flex items-center justify-center gap-2 transition-all cursor-pointer ${isRejected ? 'bg-gray-100 text-gray-400 border-gray-200 opacity-50 pointer-events-none cursor-not-allowed' : 'bg-white border-gray-200 hover:border-red-300 hover:bg-red-50 text-gray-700 hover:text-red-600'}`}
            >
              <Trash2 className="w-4 h-4" /> Delete
            </button>
          </div>
        </div>
      </div>

      <TicketUpdateModal 
        ticket={ticket} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onTicketUpdated={onTicketUpdated}
      />

      {/* নতুন রিইউজেবল ডিলিট মডাল কল করা হলো */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
        itemName={title} // ডাইনামিক নাম পাস করা হলো
        title="Delete Ticket"
      />

    </div>
  );
};

export default TicketCardVendor;