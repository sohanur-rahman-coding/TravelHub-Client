"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Switch,
} from "@heroui/react";
import { toggleAdvertiseTicket } from "@/lib/actions/tickets";
import toast from "react-hot-toast";

const MAX_ADVERTISED = 6;

export default function Advertisetable({ ticketsData }) {
  const [tickets, setTickets] = useState(ticketsData || []);
  // Track in-flight rows in a Set instead of a single id, so toggling one
  // row no longer clobbers the "Updating…" state of another row that's
  // still mid-request.
  const [pendingIds, setPendingIds] = useState(() => new Set());

  // Keep local state in sync if the parent ever passes fresh data
  // (e.g. after a router refresh / server revalidation). Previously the
  // initial `ticketsData` was only used once, via useState's initializer,
  // so the table could silently go stale.
  useEffect(() => {
    setTickets(ticketsData || []);
  }, [ticketsData]);

  // Derive the count from `tickets` instead of keeping a second piece of
  // state in sync by hand. That second `advertisedCount` state was the
  // root of the race condition: it only got incremented *after* the
  // network call resolved, so a burst of fast clicks all read the same
  // stale value and could sail past the limit of 6.
  const advertisedCount = useMemo(
    () => tickets.filter((t) => t.isAdvertised).length,
    [tickets]
  );

  // O(1) row-number lookup via a Map, instead of calling
  // `tickets.indexOf(item)` inside the render loop (O(n) per row, so
  // O(n²) for the whole table).
  const indexById = useMemo(() => {
    const map = new Map();
    tickets.forEach((t, i) => map.set(t._id, i));
    return map;
  }, [tickets]);

  const handleAdvertise = async (id, currentState) => {
    if (!currentState && advertisedCount >= MAX_ADVERTISED) {
      // NOTE: react-hot-toast has no `.warning()` method — calling it
      // throws "toast.warning is not a function" at runtime, which is why
      // hitting the limit silently broke the toggle before. `toast()`
      // with a custom icon gives the same warning-style look safely.
      toast(`You can't advertise more than ${MAX_ADVERTISED} tickets at a time.`, {
        icon: "⚠️",
      });
      return;
    }

    if (pendingIds.has(id)) return; // ignore a double-click on the same row

    const nextState = !currentState;

    // Optimistic update: flip the switch instantly so the toggle feels
    // immediate, then reconcile with the server response. This is what
    // actually makes the toggle feel "smooth" — previously the UI sat on
    // "Updating…" until the round trip finished before changing at all.
    setTickets((prev) =>
      prev.map((t) => (t._id === id ? { ...t, isAdvertised: nextState } : t))
    );
    setPendingIds((prev) => new Set(prev).add(id));

    try {
      const result = await toggleAdvertiseTicket(id, currentState);

      if (result?.success) {
        toast.success(result?.message || "Successfully updated status!");
      } else {
        // Roll back on a handled failure
        setTickets((prev) =>
          prev.map((t) =>
            t._id === id ? { ...t, isAdvertised: currentState } : t
          )
        );
        toast.error(result?.message || "Something went wrong!");
      }
    } catch (err) {
      // Roll back on a thrown/network error too
      setTickets((prev) =>
        prev.map((t) =>
          t._id === id ? { ...t, isAdvertised: currentState } : t
        )
      );
      toast.error("Something went wrong. Please try again.");
    } finally {
      setPendingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const atLimit = advertisedCount >= MAX_ADVERTISED;

  return (
    <>
      <div
        className={[
          "px-4 py-3 rounded-xl mb-6 font-bold text-sm w-fit border transition-colors duration-200",
          atLimit
            ? "bg-amber-50 border-amber-200 text-amber-800"
            : "bg-blue-50 border-blue-100 text-blue-800",
        ].join(" ")}
      >
        Advertised Tickets: {advertisedCount} / {MAX_ADVERTISED}
      </div>

      <div className="bg-white rounded-2xl border border-default-100 shadow-sm overflow-hidden mt-2">
        <Table aria-label="Advertise Tickets Table" className="w-full">
          <TableHeader>
            <TableColumn>#</TableColumn>
            <TableColumn>TITLE</TableColumn>
            <TableColumn>VENDOR</TableColumn>
            <TableColumn>PRICE</TableColumn>
            <TableColumn>ADVERTISE</TableColumn>
          </TableHeader>
          <TableBody items={tickets} emptyContent="No tickets found">
            {(item) => {
              const isPending = pendingIds.has(item._id);
              return (
                <TableRow
                  key={item._id}
                  className="border-b border-default-100 last:border-none hover:bg-default-50"
                >
                  <TableCell className="py-4 text-default-500 font-medium">
                    {indexById.get(item._id) + 1}
                  </TableCell>
                  <TableCell className="py-4 text-sm font-bold text-foreground">
                    {item.title}
                  </TableCell>
                  <TableCell className="py-4 text-sm text-default-500">
                    {item.vendorName}
                  </TableCell>
                  <TableCell className="py-4 text-sm font-semibold">
                    ${item.price}
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center justify-center gap-2">
                      <Switch
                        isSelected={item.isAdvertised}
                        isDisabled={isPending}
                        onValueChange={() =>
                          handleAdvertise(item._id, item.isAdvertised)
                        }
                        size="sm"
                        color="success"
                        aria-label={`Advertise ${item.title}`}
                      />
                      <span
                        className={[
                          "text-xs font-semibold w-16 transition-colors duration-200",
                          isPending
                            ? "text-default-400 animate-pulse"
                            : item.isAdvertised
                            ? "text-emerald-600"
                            : "text-default-400",
                        ].join(" ")}
                      >
                        {isPending
                          ? "Updating…"
                          : item.isAdvertised
                          ? "Advertised"
                          : "Off"}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              );
            }}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
