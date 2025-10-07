import React, { useState } from 'react';

const Tabs = ({ defaultValue, value, onValueChange, className = '', ...props }) => {
  const [activeTab, setActiveTab] = useState(defaultValue || value || '');

  const handleValueChange = (newValue) => {
    setActiveTab(newValue);
    if (onValueChange) {
      onValueChange(newValue);
    }
  };

  return (
    <div className={className} {...props}>
      {React.Children.map(props.children, (child) => {
        if (child.type === TabsList) {
          return React.cloneElement(child, {
            activeTab,
            onValueChange: handleValueChange,
          });
        }
        if (child.type === TabsContent) {
          return React.cloneElement(child, { activeTab });
        }
        return child;
      })}
    </div>
  );
};

const TabsList = ({ className = '', activeTab, onValueChange, ...props }) => {
  return (
    <div
      className={`inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground ${className}`}
      {...props}
    >
      {React.Children.map(props.children, (child) => {
        if (child.type === TabsTrigger) {
          return React.cloneElement(child, {
            activeTab,
            onValueChange,
          });
        }
        return child;
      })}
    </div>
  );
};

const TabsTrigger = ({ value, className = '', activeTab, onValueChange, ...props }) => {
  const isActive = activeTab === value;

  return (
    <button
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
        isActive
          ? 'bg-background text-foreground shadow-sm'
          : 'hover:bg-muted/50'
      } ${className}`}
      onClick={() => onValueChange && onValueChange(value)}
      {...props}
    />
  );
};

const TabsContent = ({ value, className = '', activeTab, ...props }) => {
  if (activeTab !== value) {
    return null;
  }

  return (
    <div
      className={`mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${className}`}
      {...props}
    />
  );
};

export { Tabs, TabsList, TabsTrigger, TabsContent };