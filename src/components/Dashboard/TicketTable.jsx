"use client";

import { useState } from "react";
import { Table, Button, Chip } from "@heroui/react";
import { updateTicketStatus } from "@/lib/actions/manageUser";

export default function TicketTable({ ticketsData }) {
  const [loadingId, setLoadingId] = useState(null);

  
  const ticketsArray = Array.isArray(ticketsData) ? ticketsData : (ticketsData?.tickets || []);

  const handleStatus = async (id, status) => {
    setLoadingId(id);
    try {
      await updateTicketStatus(id, status);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <Table className="mt-6">
      <Table.ScrollContainer>
        <Table.Content
          aria-label="Manage Tickets Table"
          className="min-w-[800px]"
        >
          <Table.Header>
            <Table.Column isRowHeader>#</Table.Column>
            <Table.Column>Title</Table.Column>
            <Table.Column>Vendor</Table.Column>
            <Table.Column>Route</Table.Column>
            <Table.Column>Price</Table.Column>
            <Table.Column>Status</Table.Column>
            <Table.Column>Actions</Table.Column>
          </Table.Header>

          <Table.Body>
           
            {ticketsArray.map((ticket, index) => (
              <Table.Row key={ticket._id}>
                <Table.Cell>{index + 1}</Table.Cell>

                <Table.Cell className="font-semibold">
                  {ticket.title}
                </Table.Cell>

                <Table.Cell>{ticket.vendorName}</Table.Cell>

                <Table.Cell>
                  {ticket.from} <br />
                  <span className="text-xs text-gray-500">to {ticket.to}</span>
                </Table.Cell>

                <Table.Cell>${ticket.price}</Table.Cell>

                <Table.Cell>
                  <Chip
                    size="sm"
                    className={`capitalize text-white font-bold border-none ${
                      ticket.verificationStatus === "approved"
                        ? "bg-green-600"
                        : ticket.verificationStatus === "rejected"
                        ? "bg-red-600"
                        : "bg-yellow-500"
                    }`}
                  >
                    {ticket.verificationStatus}
                  </Chip>
                </Table.Cell>

                <Table.Cell>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="font-bold text-white bg-green-600 disabled:bg-green-300 disabled:text-gray-100 disabled:cursor-not-allowed"
                      onClick={() => handleStatus(ticket._id, "approved")}
                      isDisabled={ticket.verificationStatus === "approved" || loadingId === ticket._id}
                      isLoading={loadingId === ticket._id}
                    >
                      Approve
                    </Button>
                    
                    <Button
                      size="sm"
                      className="font-bold text-white bg-red-600 disabled:bg-red-300 disabled:text-gray-100 disabled:cursor-not-allowed"
                      onClick={() => handleStatus(ticket._id, "rejected")}
                      isDisabled={ticket.verificationStatus === "rejected" || loadingId === ticket._id}
                      isLoading={loadingId === ticket._id}
                    >
                      Reject
                    </Button>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  );
}