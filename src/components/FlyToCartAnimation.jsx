import React from 'react';
import './FlyToCartAnimation.css';

export default function FlyToCartAnimation({ items = [] }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="fly-cart-container" aria-hidden="true">
      {items.map((item) => (
        <div
          key={item.id}
          className="fly-cart-item"
          style={{
            '--start-x': `${item.startX}px`,
            '--start-y': `${item.startY}px`,
            '--target-x': `${item.targetX}px`,
            '--target-y': `${item.targetY}px`
          }}
        >
          <div className="fly-cart-badge">
            <img 
              src={item.image || '/images/coffee_packet.png'} 
              alt=""
              className="fly-cart-img"
              onError={(e) => { e.currentTarget.src = '/images/coffee_packet.png'; }}
            />
            <span className="fly-cart-sparkle" />
          </div>
        </div>
      ))}
    </div>
  );
}
