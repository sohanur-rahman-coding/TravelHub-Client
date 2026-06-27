'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Plane, Train, Bus, MapPin, Calendar, Ticket, ArrowRight, Edit, Trash2, ShieldAlert, ShieldCheck, ClockFading } from 'lucide-react';
import TicketUpdateModal from './TicketUpdateModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import { deleteTicket } from '@/lib/actions/tickets';

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957";

const TicketCardVendor = ({ ticket, onTicketUpdated, onDelete }) => {
  const router = useRouter();
  
  const [timeLeft, setTimeLeft] = useState('');
  const [imgSrc, setImgSrc] = useState(ticket?.image || FALLBACK_IMAGE);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setImgSrc(ticket?.image || FALLBACK_IMAGE);
  }, [ticket?.image, ticket?._id]);

  if (!ticket) {
    return (
      <div className="max-w-md w-full h-[520px] bg-slate-100 dark:bg-slate-800 animate-pulse rounded-[2rem]" />
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
      case 'plane': return <Plane className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case 'train': return <Train className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case 'bus': return <Bus className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      default: return <Ticket className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
    }
  };

  const getStatusBadge = (statusValue) => {
    switch (statusValue?.toLowerCase()) {
      case 'approved':
        return (
          <div className="flex items-center gap-1 bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-xs font-black border border-green-200 dark:border-green-800">
            <ShieldCheck className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
            <span>Approved</span>
          </div>
        );
      case 'rejected':
        return (
          <div className="flex items-center gap-1 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 px-3 py-1 rounded-full text-xs font-black border border-red-200 dark:border-red-800">
            <ShieldAlert className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
            <span>Rejected</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 px-3 py-1 rounded-full text-xs font-black border border-amber-200 dark:border-amber-800">
            <ClockFading className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
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
      alert("Failed to delete the ticket. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-md w-full bg-white! dark:bg-slate-900! rounded-[2rem] border border-gray-200 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] overflow-hidden flex flex-col justify-between font-sans mx-auto transition-all duration-300">
      
      <div className="relative w-full h-60 !bg-gray-100 dark:!bg-slate-800 overflow-hidden">
        <Image
          src={imgSrc} 
          alt={title || "Ticket Image"}
          fill
          unoptimized={true}
          sizes="(max-width: 768px) 100vw, 450px"
          className="object-cover transition-opacity duration-300"
          onError={() => setImgSrc(FALLBACK_IMAGE)}
        />
        
        <div className="absolute top-4 left-4 flex items-center gap-1.5 !bg-white/95 dark:!bg-slate-900/95 backdrop-blur-md px-4 py-1.5 rounded-full shadow-sm border border-gray-200 dark:border-slate-700 z-10 transition-colors">
          {getTransportIcon(type)}
          <span className="text-sm font-black !text-slate-900 dark:!text-gray-100 capitalize tracking-wide">{type}</span>
        </div>

        <div className="absolute top-4 right-4 shadow-sm z-10">
          {getStatusBadge(verificationStatus)}
        </div>

        <div className="absolute bottom-4 right-4 !bg-white/95 dark:!bg-slate-900/95 backdrop-blur-md px-5 py-2 rounded-full shadow-lg border border-gray-200 dark:border-slate-700 z-10 transition-colors">
          <span className="text-xl font-black text-blue-600 dark:text-blue-400">${price}</span>
          <span className="text-xs font-black text-slate-500 dark:text-gray-400 ml-1">/seat</span>
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col justify-between !bg-white dark:!bg-slate-900 transition-colors duration-300">
        <div>
          <h3 className="text-xl font-black !text-slate-900 dark:!text-white tracking-tight mb-4 line-clamp-2 leading-snug">{title}</h3>

          <div className="flex items-center gap-3 !text-slate-800 dark:!text-gray-200 font-black text-sm mb-4 !bg-slate-50 dark:!bg-slate-800/80 p-3 rounded-xl border border-gray-200 dark:border-slate-700 transition-colors">
            <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
            <span className="truncate">{from}</span>
            <ArrowRight className="w-3.5 h-3.5 !text-slate-400 shrink-0 mx-0.5" />
            <span className="truncate">{to}</span>
          </div>

          <div className="flex items-center gap-2 !text-slate-600 dark:!text-slate-400 font-bold text-sm mb-3 transition-colors">
            <Calendar className="w-4 h-4 !text-slate-400 shrink-0" />
            <span className="font-semibold">{formatDepartureDate(date)}</span>
          </div>

          <div className="flex items-center justify-between !text-slate-600 dark:!text-slate-400 font-bold text-sm mb-5 transition-colors">
            <div className="flex items-center gap-2">
              <Ticket className="w-4 h-4 !text-slate-400 shrink-0" />
              <span><strong className="!text-slate-900 dark:!text-white">{quantity}</strong> seats</span>
            </div>
            {timeLeft && (
              <span className="!bg-slate-200 dark:!bg-slate-700 !text-slate-800 dark:!text-slate-200 px-2.5 py-1 text-[11px] font-black rounded-lg font-mono tracking-wider border-transparent transition-colors">{timeLeft}</span>
            )}
          </div>

          {perks && perks.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-4">
              {perks.slice(0, 3).map((perk, index) => (
                <div key={index} className="flex items-center gap-1.5 !bg-amber-50 dark:!bg-amber-500/10 !text-amber-700 dark:!text-amber-400 px-3 py-1.5 rounded-full text-[11px] font-black border !border-amber-200 dark:!border-amber-500/20 transition-colors">
                  <span className="text-amber-500 text-[10px]">✓</span>
                  {perk}
                </div>
              ))}
              {perks.length > 3 && <span className="text-xs font-black !text-slate-500 ml-0.5">+{perks.length - 3}</span>}
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
<button
  onClick={() => setIsModalOpen(true)}
  disabled={isRejected}
  className={`py-3 px-4 rounded-xl font-semibold text-sm border flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer ${
    isRejected
      ? "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-700 opacity-60 cursor-not-allowed"
      : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 shadow-sm hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-700 dark:hover:text-blue-300 hover:shadow-md"
  }`}
>
  <Edit className="w-4 h-4" />
  Update
</button>

<button
  onClick={() => setIsDeleteModalOpen(true)}
  disabled={isRejected}
  className={`py-3 px-4 rounded-xl font-semibold text-sm border flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer ${
    isRejected
      ? "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-700 opacity-60 cursor-not-allowed"
      : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 shadow-sm hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:border-rose-300 dark:hover:border-rose-700 hover:text-rose-700 dark:hover:text-rose-300 hover:shadow-md"
  }`}
>
  <Trash2 className="w-4 h-4" />
  Delete
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

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
        itemName={title} 
        title="Delete Ticket"
      />

    </div>
  );
};

export default TicketCardVendor;