import React, { useEffect, useRef } from "react";
import jazzicon from "jazzicon";

interface WalletAvatarProps {
  address: string;
  size?: number;
  className?: string;
}

const WalletAvatar: React.FC<WalletAvatarProps> = ({ 
  address, 
  size = 40, 
  className = "" 
}) => {
  const avatarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (address && avatarRef.current) {
      // Clear previous avatar
      avatarRef.current.innerHTML = "";
      
      // Generate new avatar
      const seed = parseInt(address.slice(2, 10), 16);
      const icon = jazzicon(size, seed);
      avatarRef.current.appendChild(icon);
    }
  }, [address, size]);

  if (!address) return null;

  return (
    <div 
      ref={avatarRef} 
      className={`rounded-full overflow-hidden ${className}`}
      style={{ width: size, height: size }}
    />
  );
};

export default WalletAvatar;
