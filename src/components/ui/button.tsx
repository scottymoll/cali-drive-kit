import React from 'react';
import './button.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({ variant = 'primary', children, ...props }) => {
    return (
        <button className={`button ${variant}`} {...props}>
            {children}
        </button>
    );
};

export default Button;
