import React from 'react';

const PageSection = ({ children, className = "", style = {} }) => {
    return (
        <section className={`py-5 position-relative z-1 ${className}`} style={style}>
            <div className="container py-5">
                {children}
            </div>
        </section>
    );
};

export default PageSection;
