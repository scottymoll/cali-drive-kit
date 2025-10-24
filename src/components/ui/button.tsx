import React from 'react';
import './Button.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary';
    children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ variant = 'primary', children, ...props }) => {
    return (
        <button className={`button ${variant}`} {...props}>
            {children}
        </button>
    );
};

export default Button;
