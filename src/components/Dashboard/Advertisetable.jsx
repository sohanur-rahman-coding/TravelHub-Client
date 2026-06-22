"use client";

import { useState } from "react";
import { Table } from "@heroui/react";
import { toggleAdvertiseTicket } from "@/lib/actions/tickets";

export default function Advertisetable({ ticketsData }) {
  const activeAds = ticketsData.filter((t) => t.isAdvertised).length;
  const [advertisedCount, setAdvertisedCount] = useState(activeAds);
  const [loadingId, setLoadingId] = useState(null);

  const handleAdvertise = async (id, currentState) => {
    if (!currentState && advertisedCount >= 6) {
      alert("You cannot advertise more than 6 tickets at a time.");
      return;
    }

    setLoadingId(id);
    const result = await toggleAdvertiseTicket(id, currentState);

    if (result?.success) {
      setAdvertisedCount((prev) => (!currentState ? prev + 1 : prev - 1));
    } else {
      alert(result?.message || "Something went wrong!");
    }
    setLoadingId(null);
  };

  return (
    <>
      <div className="bg-blue-50 border border-blue-100 px-4 py-3 rounded-xl mb-6 font-bold text-blue-800 text-sm w-fit">
        Advertised Tickets: {advertisedCount} / 6
      </div>

      <div className="bg-white rounded-2xl border border-default-100 shadow-sm overflow-hidden mt-2">
        <Table>
          <Table.ScrollContainer>
            <Table.Content aria-label="Advertise Tickets Table" className="w-full">
              <Table.Header>
                <Table.Column isRowHeader>#</Table.Column>
                <Table.Column>TITLE</Table.Column>
                <Table.Column>VENDOR</Table.Column>
                <Table.Column>PRICE</Table.Column>
                <Table.Column>ADVERTISE</Table.Column>
              </Table.Header>
              <Table.Body
                items={ticketsData || []}
                renderEmptyState={() => "No tickets found"}
              >
                {(item) => (
                  <Table.Row
                    id={item._id}
                    className="border-b border-default-100 last:border-none hover:bg-default-50"
                  >
                    <Table.Cell className="py-4 text-default-500 font-medium">
                      {ticketsData.indexOf(item) + 1}
                    </Table.Cell>
                    <Table.Cell className="py-4 text-sm font-bold text-foreground">
                      {item.title}
                    </Table.Cell>
                    <Table.Cell className="py-4 text-sm text-default-500">
                      {item.vendorName}
                    </Table.Cell>
                    <Table.Cell className="py-4 text-sm font-semibold">
                      ${item.price}
                    </Table.Cell>
                    <Table.Cell className="py-4">
                      <div className="flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() =>
                            handleAdvertise(item._id, item.isAdvertised)
                          }
                          disabled={loadingId === item._id}
                          className={[
                            "relative inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold",
                            "transition-all duration-200 border",
                            "disabled:opacity-60 disabled:cursor-not-allowed",
                            item.isAdvertised
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                              : "bg-default-50 text-default-500 border-default-200 hover:bg-default-100 hover:text-default-700",
                          ].join(" ")}
                        >
                          <span
                            className={[
                              "w-2 h-2 rounded-full transition-colors",
                              loadingId === item._id
                                ? "bg-default-300 animate-pulse"
                                : item.isAdvertised
                                ? "bg-emerald-500"
                                : "bg-default-300",
                            ].join(" ")}
                          />
                          {loadingId === item._id
                            ? "Updating…"
                            : item.isAdvertised
                            ? "Advertised"
                            : "Advertise"}
                        </button>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>
        </Table>
      </div>
    </>
  );
}