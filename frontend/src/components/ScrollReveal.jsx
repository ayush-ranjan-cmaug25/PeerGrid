import React, { useEffect, useRef, useState } from 'react';

const ScrollReveal = ({ children, width = "fit-content" }) => {
    const ref = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            {
                rootMargin: "-50px",
                threshold: 0.1
            }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, []);

    return (
        <div 
            ref={ref} 
            className={`reveal-on-scroll ${isVisible ? 'is-visible' : ''}`}
            style={{ width }}
        >
            {children}
        </div>
    );
};

export default ScrollReveal;
