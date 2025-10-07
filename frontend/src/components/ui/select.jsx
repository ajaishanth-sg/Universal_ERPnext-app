import React, { useState } from 'react';

const Select = ({ children, ...props }) => {
  return (
    <div className="relative" {...props}>
      {children}
    </div>
  );
};

const SelectTrigger = ({ className = '', children, ...props }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <button
      type="button"
      className={`flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      onClick={() => setIsOpen(!isOpen)}
      {...props}
    >
      {children}
      <svg className="h-4 w-4 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="m6 9 6 6 6-6"/>
      </svg>
    </button>
  );
};

const SelectValue = ({ placeholder = 'Select option...', className = '' }) => {
  return <span className={className}>{placeholder}</span>;
};

const SelectContent = ({ children, className = '' }) => {
  return (
    <div className={`absolute top-full left-0 right-0 z-50 mt-1 rounded-md border bg-popover text-popover-foreground shadow-md ${className}`}>
      {children}
    </div>
  );
};

const SelectItem = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem };