export default function Input({
  label,
  type = 'text',
  name,
  value,
  onChange,
  error,
  placeholder,
  required = false,
  className = '',
  ...props
}) {
  const inputClasses = `w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
    error 
      ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
      : 'border-gray-300 focus:border-blue-500'
  } ${className}`;

  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <input
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={inputClasses}
        {...props}
      />
      
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}