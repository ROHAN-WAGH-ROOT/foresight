import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  // Close modal on 'Escape' key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden"; // Prevent background scrolling
      window.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Render the modal inside a React Portal (at the bottom of document.body)
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop Overlay */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose} 
      />

      {/* Modal Content Box */}
      <div className="relative w-full max-w-lg transform overflow-hidden rounded-xl bg-white dark:bg-slate-900 p-6 shadow-2xl transition-all border border-neutral-200 dark:border-slate-800 text-neutral-900 dark:text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-slate-800">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-slate-50">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-neutral-400 dark:text-slate-500 hover:bg-neutral-100 dark:hover:bg-slate-800 hover:text-neutral-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            {/* Close SVG Icon */}
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="mt-4 text-sm text-neutral-600 dark:text-slate-300">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}