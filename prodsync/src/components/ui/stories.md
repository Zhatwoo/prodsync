# UI Components Stories

This document provides comprehensive examples and usage patterns for all UI components in the `src/components/ui/` directory.

## 📋 Table of Contents

- [Button](#button)
- [Input](#input)
- [Select](#select)
- [Modal](#modal)
- [Table](#table)
- [Pagination](#pagination)
- [DatePicker](#datepicker)
- [FileUploader](#fileuploader)
- [Toast](#toast)

---

## Button

A versatile button component with multiple variants, sizes, and states.

### Basic Usage

```jsx
import { Button } from '../components/ui/Button';

// Default button
<Button>Click me</Button>

// With variants
<Button variant="destructive">Delete</Button>
<Button variant="outline">Cancel</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'destructive' \| 'outline' \| 'secondary' \| 'ghost' \| 'link'` | `'default'` | Button style variant |
| `size` | `'default' \| 'sm' \| 'lg' \| 'icon'` | `'default'` | Button size |
| `disabled` | `boolean` | `false` | Disable the button |
| `loading` | `boolean` | `false` | Show loading spinner |
| `leftIcon` | `ReactNode` | - | Icon to display on the left |
| `rightIcon` | `ReactNode` | - | Icon to display on the right |
| `asChild` | `boolean` | `false` | Render as child element |

### Examples

```jsx
// Different sizes
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon">
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
</Button>

// With icons
<Button leftIcon={<PlusIcon />}>Add Item</Button>
<Button rightIcon={<ArrowRightIcon />}>Continue</Button>

// Loading state
<Button loading>Processing...</Button>

// Disabled state
<Button disabled>Cannot click</Button>
```

---

## Input

A form input component with validation states, icons, and accessibility features.

### Basic Usage

```jsx
import { Input } from '../components/ui/Input';

// Basic input
<Input placeholder="Enter your name" />

// With label and validation
<Input
  label="Email Address"
  type="email"
  placeholder="Enter your email"
  error="Please enter a valid email"
  required
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `string` | `'text'` | Input type |
| `label` | `string` | - | Input label |
| `error` | `string` | - | Error message |
| `helperText` | `string` | - | Helper text |
| `leftIcon` | `ReactNode` | - | Icon on the left |
| `rightIcon` | `ReactNode` | - | Icon on the right |
| `showPasswordToggle` | `boolean` | `false` | Show password toggle for password inputs |
| `disabled` | `boolean` | `false` | Disable the input |
| `required` | `boolean` | `false` | Mark as required |

### Examples

```jsx
// Password input with toggle
<Input
  type="password"
  label="Password"
  showPasswordToggle
  placeholder="Enter your password"
/>

// Input with icons
<Input
  label="Search"
  leftIcon={<SearchIcon />}
  placeholder="Search..."
/>

// Input with validation
<Input
  label="Username"
  placeholder="Enter username"
  error="Username is required"
  helperText="Must be at least 3 characters"
/>

// Disabled input
<Input
  label="Read Only"
  value="Cannot edit this"
  disabled
/>
```

---

## Select

A dropdown select component with search, multi-select, and keyboard navigation.

### Basic Usage

```jsx
import { Select } from '../components/ui/Select';

const options = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' }
];

<Select
  options={options}
  placeholder="Select an option"
  onChange={(value) => console.log(value)}
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `Array<{value: string, label: string, disabled?: boolean}>` | `[]` | Select options |
| `value` | `string \| string[]` | - | Selected value(s) |
| `onChange` | `(value: string \| string[]) => void` | - | Change handler |
| `placeholder` | `string` | `'Select an option...'` | Placeholder text |
| `label` | `string` | - | Select label |
| `error` | `string` | - | Error message |
| `helperText` | `string` | - | Helper text |
| `searchable` | `boolean` | `false` | Enable search |
| `multiple` | `boolean` | `false` | Allow multiple selection |
| `clearable` | `boolean` | `false` | Show clear button |
| `disabled` | `boolean` | `false` | Disable the select |
| `required` | `boolean` | `false` | Mark as required |

### Examples

```jsx
// Multi-select
<Select
  options={options}
  multiple
  placeholder="Select multiple options"
  onChange={(values) => console.log(values)}
/>

// Searchable select
<Select
  options={options}
  searchable
  placeholder="Search and select..."
/>

// With validation
<Select
  options={options}
  label="Country"
  error="Please select a country"
  required
/>

// Clearable select
<Select
  options={options}
  clearable
  placeholder="Select with clear option"
/>
```

---

## Modal

A modal dialog component with overlay, animations, and focus management.

### Basic Usage

```jsx
import { Modal, ModalHeader, ModalBody, ModalFooter } from '../components/ui/Modal';

const [isOpen, setIsOpen] = useState(false);

<Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Modal Title">
  <p>Modal content goes here</p>
</Modal>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | - | Whether modal is open |
| `onClose` | `() => void` | - | Close handler |
| `title` | `string` | - | Modal title |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | `'md'` | Modal size |
| `closable` | `boolean` | `true` | Show close button |
| `closeOnOverlayClick` | `boolean` | `true` | Close on overlay click |
| `closeOnEscape` | `boolean` | `true` | Close on escape key |

### Examples

```jsx
// Different sizes
<Modal size="sm" isOpen={isOpen} onClose={onClose}>
  Small modal content
</Modal>

<Modal size="lg" isOpen={isOpen} onClose={onClose}>
  Large modal content
</Modal>

// Using sub-components
<Modal isOpen={isOpen} onClose={onClose}>
  <ModalHeader>
    <ModalTitle>Custom Header</ModalTitle>
    <ModalCloseButton onClose={onClose} />
  </ModalHeader>
  
  <ModalBody>
    <p>Modal body content</p>
  </ModalBody>
  
  <ModalFooter>
    <Button variant="outline" onClick={onClose}>Cancel</Button>
    <Button onClick={handleSave}>Save</Button>
  </ModalFooter>
</Modal>

// Non-closable modal
<Modal
  isOpen={isOpen}
  onClose={onClose}
  closable={false}
  closeOnOverlayClick={false}
  closeOnEscape={false}
>
  <p>This modal cannot be closed by user interaction</p>
</Modal>
```

---

## Table

A data table component with sorting, selection, and customizable columns.

### Basic Usage

```jsx
import { Table } from '../components/ui/Table';

const data = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' }
];

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Role' }
];

<Table data={data} columns={columns} />
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `Array<Object>` | `[]` | Table data |
| `columns` | `Array<Column>` | `[]` | Column definitions |
| `sortable` | `boolean` | `true` | Enable sorting |
| `selectable` | `boolean` | `false` | Enable row selection |
| `onSort` | `(key: string, direction: string) => void` | - | Sort handler |
| `onSelect` | `(selectedRows: string[]) => void` | - | Selection handler |
| `onSelectAll` | `(selectedRows: string[]) => void` | - | Select all handler |
| `selectedRows` | `string[]` | `[]` | Selected row IDs |

### Column Definition

```jsx
const columns = [
  {
    key: 'name',
    label: 'Name',
    sortable: true, // Optional, defaults to true
    className: 'font-medium', // Optional cell styling
    cellClassName: 'text-blue-600', // Optional cell content styling
    render: (value, row, index) => ( // Optional custom render
      <span className="font-bold">{value}</span>
    )
  }
];
```

### Examples

```jsx
// Sortable table
<Table
  data={data}
  columns={columns}
  sortable
  onSort={(key, direction) => console.log(key, direction)}
/>

// Selectable table
<Table
  data={data}
  columns={columns}
  selectable
  selectedRows={selectedRows}
  onSelect={setSelectedRows}
  onSelectAll={(rows) => setSelectedRows(rows)}
/>

// Custom column rendering
const columns = [
  {
    key: 'status',
    label: 'Status',
    render: (value) => (
      <span className={`px-2 py-1 rounded-full text-xs ${
        value === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}>
        {value}
      </span>
    )
  }
];
```

---

## Pagination

A pagination component with page controls and optional page size changer.

### Basic Usage

```jsx
import { Pagination } from '../components/ui/Pagination';

<Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  totalItems={totalItems}
  onPageChange={setCurrentPage}
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `currentPage` | `number` | `1` | Current page number |
| `totalPages` | `number` | `1` | Total number of pages |
| `totalItems` | `number` | `0` | Total number of items |
| `itemsPerPage` | `number` | `10` | Items per page |
| `onPageChange` | `(page: number) => void` | - | Page change handler |
| `showInfo` | `boolean` | `true` | Show pagination info |
| `showSizeChanger` | `boolean` | `false` | Show page size changer |
| `pageSizeOptions` | `number[]` | `[10, 20, 50, 100]` | Page size options |
| `onPageSizeChange` | `(size: number) => void` | - | Page size change handler |

### Examples

```jsx
// Basic pagination
<Pagination
  currentPage={1}
  totalPages={10}
  totalItems={100}
  onPageChange={setCurrentPage}
/>

// With page size changer
<Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  totalItems={totalItems}
  itemsPerPage={itemsPerPage}
  onPageChange={setCurrentPage}
  onPageSizeChange={setItemsPerPage}
  showSizeChanger
  pageSizeOptions={[5, 10, 25, 50]}
/>

// Simple pagination
import { SimplePagination } from '../components/ui/Pagination';

<SimplePagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={setCurrentPage}
/>
```

---

## DatePicker

A date picker component with calendar interface and keyboard navigation.

### Basic Usage

```jsx
import { DatePicker } from '../components/ui/DatePicker';

<DatePicker
  value={selectedDate}
  onChange={setSelectedDate}
  placeholder="Select a date"
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `Date` | - | Selected date |
| `onChange` | `(date: Date) => void` | - | Date change handler |
| `placeholder` | `string` | `'Select date...'` | Placeholder text |
| `label` | `string` | - | DatePicker label |
| `error` | `string` | - | Error message |
| `helperText` | `string` | - | Helper text |
| `minDate` | `Date` | - | Minimum selectable date |
| `maxDate` | `Date` | - | Maximum selectable date |
| `format` | `string` | `'MM/dd/yyyy'` | Date format |
| `disabled` | `boolean` | `false` | Disable the DatePicker |
| `required` | `boolean` | `false` | Mark as required |

### Examples

```jsx
// With date restrictions
<DatePicker
  value={selectedDate}
  onChange={setSelectedDate}
  minDate={new Date()}
  maxDate={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)}
  label="Select date"
/>

// With validation
<DatePicker
  value={selectedDate}
  onChange={setSelectedDate}
  label="Birth Date"
  error="Please select a valid date"
  required
/>

// Custom format
<DatePicker
  value={selectedDate}
  onChange={setSelectedDate}
  format="dd/MM/yyyy"
  placeholder="DD/MM/YYYY"
/>
```

---

## FileUploader

A file upload component with drag-and-drop support and file validation.

### Basic Usage

```jsx
import { FileUploader } from '../components/ui/FileUploader';

<FileUploader
  onFileSelect={(files) => console.log(files)}
  onFileRemove={(index) => console.log('Remove', index)}
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onFileSelect` | `(files: File[]) => void` | - | File selection handler |
| `onFileRemove` | `(index: number) => void` | - | File removal handler |
| `files` | `File[]` | `[]` | Current files |
| `multiple` | `boolean` | `false` | Allow multiple files |
| `accept` | `string` | - | Accepted file types |
| `maxSize` | `number` | `10485760` | Max file size in bytes |
| `maxFiles` | `number` | `5` | Maximum number of files |
| `label` | `string` | - | FileUploader label |
| `error` | `string` | - | Error message |
| `helperText` | `string` | - | Helper text |
| `disabled` | `boolean` | `false` | Disable the FileUploader |
| `required` | `boolean` | `false` | Mark as required |

### Examples

```jsx
// Single file upload
<FileUploader
  onFileSelect={(files) => setFile(files[0])}
  accept=".pdf,.doc,.docx"
  maxSize={5 * 1024 * 1024} // 5MB
  label="Upload Document"
/>

// Multiple file upload
<FileUploader
  multiple
  maxFiles={10}
  accept="image/*"
  onFileSelect={setFiles}
  onFileRemove={removeFile}
  label="Upload Images"
/>

// With validation
<FileUploader
  onFileSelect={handleFileSelect}
  accept=".jpg,.jpeg,.png"
  maxSize={2 * 1024 * 1024} // 2MB
  maxFiles={3}
  error="Please upload valid image files"
/>
```

---

## Toast

A notification system with different types and auto-dismiss functionality.

### Setup

First, wrap your app with the ToastProvider:

```jsx
import { ToastProvider } from '../components/ui/Toast';

function App() {
  return (
    <ToastProvider>
      {/* Your app content */}
    </ToastProvider>
  );
}
```

### Basic Usage

```jsx
import { useToast, toast } from '../components/ui/Toast';

// Using hook
const { addToast } = useToast();

const showSuccess = () => {
  addToast({
    type: 'success',
    title: 'Success!',
    message: 'Your action was completed successfully.'
  });
};

// Using convenience functions
const showError = () => {
  toast.error('Something went wrong!');
};

const showWarning = () => {
  toast.warning('Please check your input.');
};

const showInfo = () => {
  toast.info('Here is some information.');
};
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `'success' \| 'error' \| 'warning' \| 'info'` | `'info'` | Toast type |
| `title` | `string` | - | Toast title |
| `message` | `string` | - | Toast message |
| `duration` | `number` | `5000` | Auto-dismiss duration (0 = no auto-dismiss) |
| `action` | `ReactNode` | - | Action button or element |

### Examples

```jsx
// Different toast types
toast.success('Operation completed successfully!');
toast.error('Failed to save changes');
toast.warning('Please review your input');
toast.info('New updates available');

// With title and action
addToast({
  type: 'success',
  title: 'File uploaded',
  message: 'Your file has been uploaded successfully.',
  action: (
    <Button size="sm" variant="outline">
      View
    </Button>
  )
});

// Persistent toast (no auto-dismiss)
addToast({
  type: 'error',
  title: 'Connection Error',
  message: 'Unable to connect to server.',
  duration: 0 // No auto-dismiss
});

// Custom toast with hook
const { addToast, removeToast, clearAllToasts } = useToast();

const showCustomToast = () => {
  const id = addToast({
    type: 'info',
    message: 'Custom toast message'
  });
  
  // Remove specific toast
  setTimeout(() => removeToast(id), 3000);
  
  // Or clear all toasts
  // clearAllToasts();
};
```

---

## 🎨 Styling and Theming

All components use Tailwind CSS classes and can be customized by:

1. **Passing custom className props**
2. **Using CSS custom properties for theming**
3. **Extending the component variants**

### Custom Styling Example

```jsx
// Custom button styling
<Button 
  className="bg-purple-600 hover:bg-purple-700 text-white"
  variant="default"
>
  Custom Button
</Button>

// Custom input styling
<Input 
  className="border-purple-300 focus:border-purple-500 focus:ring-purple-500"
  placeholder="Custom styled input"
/>
```

### Theme Customization

You can customize the default colors by modifying the component variants or using CSS custom properties:

```css
:root {
  --primary-color: #3b82f6;
  --primary-hover: #2563eb;
  --error-color: #ef4444;
  --success-color: #10b981;
}
```

---

## ♿ Accessibility Features

All components include comprehensive accessibility features:

- **Keyboard navigation** for interactive elements
- **ARIA attributes** for screen readers
- **Focus management** for modals and dropdowns
- **Color contrast** compliance
- **Semantic HTML** structure

### Accessibility Examples

```jsx
// Button with proper ARIA attributes
<Button 
  aria-label="Close dialog"
  onClick={onClose}
>
  <CloseIcon />
</Button>

// Input with error state
<Input
  label="Email"
  error="Please enter a valid email"
  aria-invalid={!!error}
  aria-describedby="email-error"
/>

// Modal with focus management
<Modal
  isOpen={isOpen}
  onClose={onClose}
  aria-labelledby="modal-title"
  aria-describedby="modal-description"
>
  <h2 id="modal-title">Modal Title</h2>
  <p id="modal-description">Modal description</p>
</Modal>
```

---

## 🚀 Performance Tips

1. **Use React.memo** for expensive components
2. **Implement proper key props** for lists
3. **Debounce search inputs** to reduce API calls
4. **Lazy load** large datasets in tables
5. **Use useCallback** for event handlers passed to child components

### Performance Example

```jsx
import { memo, useCallback } from 'react';

const ExpensiveTable = memo(({ data, onSort }) => {
  const handleSort = useCallback((key, direction) => {
    onSort(key, direction);
  }, [onSort]);

  return (
    <Table
      data={data}
      onSort={handleSort}
    />
  );
});
```

---

This documentation provides comprehensive examples for all UI components. Each component is designed to be accessible, performant, and highly customizable while maintaining consistency across your application.
