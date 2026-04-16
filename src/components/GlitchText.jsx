import React from 'react';

import './GlitchText.css';

// eslint-disable-next-line no-unused-vars
const GlitchText = ({ text, as: Component = 'h1', className = '' }) => {
    return (
        <div className={`glitch-wrapper ${className}`}>
            <Component className="glitch" data-text={text}>
                {text}
            </Component>
        </div>
    );
};

export default GlitchText;
