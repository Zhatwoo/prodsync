'use client';

import { useEffect, useRef } from 'react';
import { cn } from '../../lib/utils';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  closable = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  className,
  ...props
}) => {
  const modalRef = useRef(null);
  const previousActiveElement = useRef(null);
  
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4'
  };
  
  // Handle escape key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;
    
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape, onClose]);
  
  // Handle focus management
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement;
      modalRef.current?.focus();
    } else {
      previousActiveElement.current?.focus();
    }
  }, [isOpen]);
  
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };
  
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
      {...props}
    >
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleOverlayClick}
        aria-hidden="true"
      />
      
      {/* Modal */}
      <div
        ref={modalRef}
        className={cn(
          'relative w-full transform rounded-lg bg-white shadow-xl transition-all',
          'focus:outline-none',
          sizeClasses[size],
          className
        )}
        tabIndex={-1}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
            <h2
              id="modal-title"
              className="text-lg font-semibold text-slate-900"
            >
              {title}
            </h2>
            {closable && (
              <button
                type="button"
                className="rounded-md p-1 text-slate-400 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={onClose}
                aria-label="Close modal"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}
        
        {/* Content */}
        <div className="px-6 py-4">
          {children}
        </div>
      </div>
    </div>
  );
};

// Modal Header component
const ModalHeader = ({ children, className, ...props }) => (
  <div
    className={cn('flex items-center justify-between border-b border-slate-200 px-6 py-4', className)}
    {...props}
  >
    {children}
  </div>
);

// Modal Body component
const ModalBody = ({ children, className, ...props }) => (
  <div
    className={cn('px-6 py-4', className)}
    {...props}
  >
    {children}
  </div>
);

// Modal Footer component
const ModalFooter = ({ children, className, ...props }) => (
  <div
    className={cn('flex items-center justify-end space-x-3 border-t border-slate-200 px-6 py-4', className)}
    {...props}
  >
    {children}
  </div>
);

// Modal Title component
const ModalTitle = ({ children, className, ...props }) => (
  <h2
    id="modal-title"
    className={cn('text-lg font-semibold text-slate-900', className)}
    {...props}
  >
    {children}
  </h2>
);

// Modal Close Button component
const ModalCloseButton = ({ onClose, className, ...props }) => (
  <button
    type="button"
    className={cn(
      'rounded-md p-1 text-slate-400 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500',
      className
    )}
    onClick={onClose}
    aria-label="Close modal"
    {...props}
  >
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  </button>
);

export { Modal, ModalHeader, ModalBody, ModalFooter, ModalTitle, ModalCloseButton };
