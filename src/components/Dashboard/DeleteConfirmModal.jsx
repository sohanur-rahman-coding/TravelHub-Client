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
  itemName = "this item",
  title = "Confirm Deletion"
}) {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={() => !isDeleting && onClose()}>
      <Modal.Backdrop>
        <Modal.Container placement="auto">
          {/* 🟢 Forced Light & Dark background classes applied */}
          <Modal.Dialog className="sm:max-w-md w-full !bg-white dark:!bg-slate-900 border border-gray-200 dark:border-slate-800 transition-colors">
            <Modal.CloseTrigger onClick={onClose} />
            <Modal.Header>
              <Modal.Heading className="text-xl font-black text-red-600 dark:text-red-500">
                {title}
              </Modal.Heading>
            </Modal.Header>
            <Modal.Body className="p-6 pb-2">
              <p className="!text-slate-600 dark:!text-slate-300 text-sm">
                Are you sure you want to delete <span className="font-bold !text-slate-800 dark:!text-white">"{itemName}"</span>? This action cannot be undone.
              </p>
            </Modal.Body>
            <Modal.Footer className="px-6 py-4 flex gap-3 justify-end mt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                disabled={isDeleting}
                className="font-black !bg-slate-100 dark:!bg-slate-800 !text-slate-700 dark:!text-slate-300 border-transparent rounded-xl"
              >
                Cancel
              </Button>
              <Button
                onClick={onConfirm}
                disabled={isDeleting}
                className="bg-red-600 text-white hover:bg-red-700 font-bold flex items-center gap-2 rounded-xl border-transparent"
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