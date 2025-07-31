import React, { useState, useRef } from 'react';

const Draggable = ({ children, initialPosition = { x: 0, y: 0 } }) => {
    const [position, setPosition] = useState(initialPosition);
    const dragStartPos = useRef({ x: 0, y: 0 });
    const nodeRef = useRef(null);

    const handleMouseDown = (e) => {
        // Only allow dragging from an element with the 'draggable-header' class
        if (!e.target.classList.contains('draggable-header')) {
            return;
        }
        e.preventDefault();
        dragStartPos.current = {
            x: e.clientX - position.x,
            y: e.clientY - position.y,
        };
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp, { once: true });
    };

    const handleMouseMove = (e) => {
        setPosition({
            x: e.clientX - dragStartPos.current.x,
            y: e.clientY - dragStartPos.current.y,
        });
    };

    const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
    };

    return (
        <div
            ref={nodeRef}
            className="fixed z-50"
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
            }}
            onMouseDown={handleMouseDown}
        >
            {children}
        </div>
    );
};

export default Draggable;