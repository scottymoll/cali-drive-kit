import React from 'react';

interface ButtonProps {
  onClick: () => void;
  label: string;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({ onClick, label, disabled = false, variant = 'primary' }) => {
  const baseStyle = 'py-2 px-4 rounded focus:outline-none';
  const variantStyle = variant === 'primary' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black';
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variantStyle} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {label}
    </button>
  );
};

export default Button;