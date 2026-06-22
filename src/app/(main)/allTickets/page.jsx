import Card from '@/components/Card';
import { getAllApprovedTickets } from '@/lib/api/tickets';
import React from 'react';

const AllTickets = async() => {
    const data = await getAllApprovedTickets()
    console.log(data);
    return (
        <div>
            all tickets
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
        {data.map((ticket) => (
          <Card key={ticket._id} ticket={ticket} />
        ))}
      </div>
        </div>
    );
};

export default AllTickets;