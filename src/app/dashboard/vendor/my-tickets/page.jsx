import { getUserSession } from '@/lib/api/Session';
import { getAddedTicketsByVendor } from '@/lib/api/tickets';
import { authClient } from '@/lib/auth-client';
import React from 'react';

const myTickets = async () => {
    const session = await getUserSession();
   
    const tickets = await getAddedTicketsByVendor(session.email);
    console.log(tickets);
    return (
        <div>
            my tikets
        </div>
    );
};

export default myTickets;