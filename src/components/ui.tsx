import React from 'react';

// --- Shadcn/ui Component Placeholders (Conceptual) ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline';
  size?: 'default' | 'sm' | 'icon';
}

export const Button = ({ children, onClick, className, variant = 'default', size = 'default', disabled, ...props }: ButtonProps) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background dark:ring-offset-gray-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
      variant === 'destructive'
        ? 'bg-red-600 text-white hover:bg-red-700/90 dark:bg-red-700 dark:hover:bg-red-800/90'
        : variant === 'outline'
        ? 'border border-input bg-background hover:bg-accent hover:text-accent-foreground dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300 dark:hover:text-gray-100'
        : 'bg-blue-600 text-primary-foreground hover:bg-blue-700/90 dark:bg-blue-500 dark:text-blue-50 dark:hover:bg-blue-600/90'
    } ${
      size === 'sm' ? 'h-9 px-3' : size === 'icon' ? 'h-10 w-10' : 'h-10 px-4 py-2'
    } ${className}`}
    {...props}
  >
    {children}
  </button>
);

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  onValueChange: (value: string) => void;
}

export const Select = ({ value, onValueChange, children, disabled, ...props }: SelectProps) => (
    <select
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        disabled={disabled}
        className="flex h-10 w-full items-center justify-between rounded-md border border-input dark:border-gray-600 bg-background dark:bg-gray-700 px-3 py-2 text-sm ring-offset-background dark:ring-offset-gray-900 placeholder:text-muted-foreground dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ring dark:focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:text-white"
        {...props}
    >
        {children}
    </select>
);

interface SelectItemProps extends React.OptionHTMLAttributes<HTMLOptionElement> {
  value: string;
}

export const SelectItem = ({ value, children, ...props }: SelectItemProps) => (
  <option value={value} {...props}>{children}</option>
);

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Input = ({ type = 'text', value, onChange, placeholder, className, disabled, ...props }: InputProps) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    disabled={disabled}
    className={`flex h-10 w-full rounded-md border border-input dark:border-gray-600 bg-background dark:bg-gray-700 px-3 py-2 text-sm ring-offset-background dark:ring-offset-gray-900 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground dark:placeholder-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:text-white ${className}`}
    {...props}
  />
);

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card = ({ children, className }: CardProps) => (
  <div className={`rounded-lg border bg-white dark:bg-gray-800 text-card-foreground dark:text-gray-200 shadow-sm dark:border-gray-700 ${className}`}>
    {children}
  </div>
);

export const CardHeader = ({ children, className }: CardProps) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>
    {children}
  </div>
);

export const CardTitle = ({ children, className }: CardProps) => (
  <h3 className={`text-lg font-semibold leading-none tracking-tight dark:text-gray-100 ${className}`}>
    {children}
  </h3>
);

export const CardContent = ({ children, className }: CardProps) => (
  <div className={`p-6 pt-0 ${className}`}>
    {children}
  </div>
);

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  htmlFor: string;
}

export const Label = ({ children, htmlFor, className }: LabelProps) => (
  <label htmlFor={htmlFor} className={`block text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2 dark:text-gray-300 ${className}`}>
    {children}
  </label>
);

interface AlertDialogProps {
  title: string;
  description: string;
  open: boolean;
  onClose: () => void;
  theme: 'light' | 'dark';
}

export const AlertDialog = ({ title, description, open, onClose, theme }: AlertDialogProps) => {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md">
                <h3 className="text-lg font-semibold mb-2 dark:text-white">{title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{description}</p>
                <div className="flex justify-end">
                    <Button onClick={onClose}>OK</Button>
                </div>
            </div>
        </div>
    );
};

interface MetricCardProps {
  title: string;
  value: string;
  subValue?: string;
  baseBgColor: 'blue' | 'green' | 'yellow' | 'red' | 'indigo';
  theme: 'light' | 'dark';
}

export const MetricCard = ({ title, value, subValue, baseBgColor, theme }: MetricCardProps) => {
    const isDark = theme === 'dark';
    // Define color palettes for light and dark themes
    // Using Tailwind-like color shades for consistency
    const colors = {
        blue:   isDark ? { bg: 'bg-blue-900/70', text: 'text-blue-300' }  : { bg: 'bg-blue-50',   text: 'text-blue-800' },
        green:  isDark ? { bg: 'bg-green-900/70', text: 'text-green-300' } : { bg: 'bg-green-50',  text: 'text-green-800' },
        yellow: isDark ? { bg: 'bg-yellow-900/70',text: 'text-yellow-300' }: { bg: 'bg-yellow-50', text: 'text-yellow-800' },
        red:    isDark ? { bg: 'bg-red-900/70',   text: 'text-red-300' }   : { bg: 'bg-red-50',    text: 'text-red-800' },
        indigo: isDark ? { bg: 'bg-indigo-900/70',text: 'text-indigo-300' }: { bg: 'bg-indigo-50', text: 'text-indigo-800' },
    };
    const currentColors = colors[baseBgColor] || colors.blue; // Fallback to blue

    return (
        <div className={`${currentColors.bg} p-3 rounded-md shadow text-center`}>
            <span className={`font-semibold block ${currentColors.text}`}>{title}:</span>
            <span className={`${currentColors.text} text-base font-medium`}>{value}</span>
            {subValue && <span className={`text-xs block ${currentColors.text} opacity-80`}>{subValue}</span>}
        </div>
    );
}; 