import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="footer">
            <div className="container">
                <p>© 2023 Your Company. All rights reserved.</p>
                <nav>
                    <ul>
                        <li><a href="/privacy">Privacy Policy</a></li>
                        <li><a href="/terms">Terms of Service</a></li>
                    </ul>
                </nav>
            </div>
        </footer>
    );
};

export default Footer;