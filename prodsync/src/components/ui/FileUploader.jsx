'use client';

import { useState, useRef, useCallback, useId } from 'react';
import { cn } from '../../lib/utils';

const FileUploader = ({
  onFileSelect,
  onFileRemove,
  files = [],
  multiple = false,
  accept,
  maxSize = 10 * 1024 * 1024, // 10MB
  maxFiles = 5,
  label,
  error,
  helperText,
  disabled = false,
  required = false,
  className,
  ...props
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);
  
  const hasError = !!error || !!uploadError;
  const generatedId = useId();
  const fileUploaderId = props.id || generatedId;
  
  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  // Validate file
  const validateFile = (file) => {
    if (file.size > maxSize) {
      return `File size must be less than ${formatFileSize(maxSize)}`;
    }
    
    if (accept && !accept.split(',').some(type => {
      const trimmedType = type.trim();
      if (trimmedType.startsWith('.')) {
        return file.name.toLowerCase().endsWith(trimmedType.toLowerCase());
      }
      return file.type.match(trimmedType.replace('*', '.*'));
    })) {
      return `File type not allowed. Accepted types: ${accept}`;
    }
    
    return null;
  };
  
  // Handle file selection
  const handleFileSelect = useCallback((selectedFiles) => {
    setUploadError('');
    
    if (!multiple && selectedFiles.length > 1) {
      setUploadError('Only one file is allowed');
      return;
    }
    
    if (files.length + selectedFiles.length > maxFiles) {
      setUploadError(`Maximum ${maxFiles} files allowed`);
      return;
    }
    
    const validFiles = [];
    const errors = [];
    
    Array.from(selectedFiles).forEach(file => {
      const error = validateFile(file);
      if (error) {
        errors.push(`${file.name}: ${error}`);
      } else {
        validFiles.push(file);
      }
    });
    
    if (errors.length > 0) {
      setUploadError(errors.join(', '));
    }
    
    if (validFiles.length > 0) {
      onFileSelect?.(validFiles);
    }
  }, [files.length, maxFiles, maxSize, accept, multiple, onFileSelect]);
  
  // Handle drag and drop
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragOver(true);
    }
  }, [disabled]);
  
  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);
  
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (disabled) return;
    
    const droppedFiles = e.dataTransfer.files;
    handleFileSelect(droppedFiles);
  }, [disabled, handleFileSelect]);
  
  // Handle file input change
  const handleInputChange = (e) => {
    const selectedFiles = e.target.files;
    handleFileSelect(selectedFiles);
    
    // Reset input value to allow selecting the same file again
    e.target.value = '';
  };
  
  // Handle file removal
  const handleFileRemove = (index) => {
    onFileRemove?.(index);
  };
  
  // Handle click to open file dialog
  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };
  
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={fileUploaderId}
          className="block text-sm font-medium text-slate-700 mb-2"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {/* Upload Area */}
      <div
        className={cn(
          'relative border-2 border-dashed rounded-lg p-6 text-center transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
          isDragOver && 'border-blue-500 bg-blue-50',
          hasError && 'border-red-500',
          !hasError && !isDragOver && 'border-slate-300 hover:border-slate-400',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-describedby={
          hasError ? `${fileUploaderId}-error` : helperText ? `${fileUploaderId}-helper` : undefined
        }
        {...props}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={handleInputChange}
          className="hidden"
          disabled={disabled}
          required={required}
        />
        
        <div className="space-y-2">
          <svg
            className={cn(
              'mx-auto h-12 w-12',
              isDragOver ? 'text-blue-500' : 'text-slate-400'
            )}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          
          <div className="text-sm">
            <span className="font-medium text-blue-600 hover:text-blue-500">
              Click to upload
            </span>
            <span className="text-slate-500"> or drag and drop</span>
          </div>
          
          <p className="text-xs text-slate-500">
            {accept && `Accepted formats: ${accept}`}
            {maxSize && ` • Max size: ${formatFileSize(maxSize)}`}
            {maxFiles > 1 && ` • Max files: ${maxFiles}`}
          </p>
        </div>
      </div>
      
      {/* File List */}
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 p-3"
            >
              <div className="flex items-center space-x-3">
                <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-slate-900">{file.name}</p>
                  <p className="text-xs text-slate-500">{formatFileSize(file.size)}</p>
                </div>
              </div>
              
              <button
                type="button"
                onClick={() => handleFileRemove(index)}
                className="rounded-md p-1 text-slate-400 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                aria-label={`Remove ${file.name}`}
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
      
      {/* Error Message */}
      {hasError && (
        <p id={`${fileUploaderId}-error`} className="mt-1 text-sm text-red-600" role="alert">
          {error || uploadError}
        </p>
      )}
      
      {/* Helper Text */}
      {helperText && !hasError && (
        <p id={`${fileUploaderId}-helper`} className="mt-1 text-sm text-slate-500">
          {helperText}
        </p>
      )}
    </div>
  );
};

export { FileUploader };
