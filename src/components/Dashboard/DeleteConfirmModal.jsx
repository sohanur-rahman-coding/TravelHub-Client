// components/DeleteConfirmModal.jsx (অথবা আপনার পছন্দমতো পাথ)
"use client";

import React from "react";
import { Modal, Button } from "@heroui/react";
import { Trash2, Loader2 } from "lucide-react";

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
  itemName = "this item", // ডিফল্ট ভ্যালু, রিইউজ করার সময় পাল্টে দিতে পারবেন
  title = "Confirm Deletion"
}) {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={() => !isDeleting && onClose()}>
      <Modal.Backdrop>
        <Modal.Container placement="auto">
          <Modal.Dialog className="sm:max-w-md w-full">
            <Modal.CloseTrigger onClick={onClose} />
            <Modal.Header>
              <Modal.Heading className="text-xl font-black text-red-600">
                {title}
              </Modal.Heading>
            </Modal.Header>
            <Modal.Body className="p-6 pb-2">
              <p className="text-gray-600 text-sm">
                Are you sure you want to delete <span className="font-bold text-gray-800">"{itemName}"</span>? This action cannot be undone.
              </p>
            </Modal.Body>
            <Modal.Footer className="px-6 py-4 flex gap-3 justify-end mt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                onClick={onConfirm}
                disabled={isDeleting}
                className="bg-red-600 text-white hover:bg-red-700 font-bold flex items-center gap-2 rounded-xl"
              >
                {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}