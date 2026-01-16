import React from 'react';

const Input = ({ label, icon, name, type = "text", value, onChange, placeholder, required = true }) => {
    return (
        <div className="flex flex-col gap-1.5 w-full">
            <label htmlFor={name} className="text-sm font-semibold text-gray-700 ml-1">
                {label}
            </label>
            <div className="relative group">
                {icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                        {React.cloneElement(icon, { size: 18 })}
                    </div>
                )}
                <input
                    id={name}
                    name={name}
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    className={`
                        w-full py-2.5 bg-gray-50 border border-gray-300 rounded-lg outline-none
                        transition-all duration-200
                        focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
                        ${icon ? 'pl-10' : 'pl-4'} pr-4
                    `}
                />
            </div>
        </div>
    );
};

export default Input;