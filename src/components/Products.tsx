'use client';

import Image from 'next/image';
import { useRef, useEffect, useState } from 'react';

interface Product {
  id: number;
  name: string;
  category: string;
  image: string;
}

const featuredProducts: Product[] = [
  {
    id: 1,
    name: '45 DEGREE ELBOW',
    category: 'BUTTWELD FITTINGS',
    image: '/products/product1.png'
  },
  {
    id: 2,
    name: 'RUBBER MAT',
    category: 'RUBBER',
    image: '/products/product2.png'
  },
  {
    id: 3,
    name: 'UNION TYPE COUPLINGS',
    category: 'EXPANSION JOINTS',
    image: '/products/product3.png'
  },
  {
    id: 4,
    name: '45 DEGREE ELBOW',
    category: 'GROOVED FITTINGS',
    image: '/products/product4.png'
  },
  {
    id: 5,
    name: 'FIRE AXE',
    category: 'FIRE SAFETY',
    image: '/products/product5.png'
   }, {
    id: 6,
    name: 'DISPOSABLE COVERALL',
    category: 'SAFETY EQUIPMENTS',
    image: '/products/product6.png'
  }
];

const Products = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [currentScrollPosition, setCurrentScrollPosition] = useState(0);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const scrollSpeed = 1;

  useEffect(() => {
    let animationFrameId: number;
    
    const scroll = () => {
      const container = scrollContainerRef.current;
      if (container && isAutoScrolling) {
        const maxScroll = container.scrollWidth - container.clientWidth;
        let newPosition = currentScrollPosition + scrollSpeed;

        if (newPosition >= maxScroll / 3) {
          newPosition = 0;
        }

        container.scrollTo({
          left: newPosition,
          behavior: 'auto'
        });
        setCurrentScrollPosition(newPosition);
      }
      animationFrameId = requestAnimationFrame(scroll);
    };

    if (isAutoScrolling) {
      animationFrameId = requestAnimationFrame(scroll);
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isAutoScrolling, currentScrollPosition]);

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setShowLeftButton(container.scrollLeft > 0);
      setShowRightButton(
        container.scrollLeft < container.scrollWidth - container.clientWidth - 10
      );
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    setIsAutoScrolling(false);
    if (scrollContainerRef.current) {
      const scrollAmount = 280;
      const newScrollLeft = scrollContainerRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
      setCurrentScrollPosition(newScrollLeft);
    }
  };

  const extendedProducts = [...featuredProducts, ...featuredProducts, ...featuredProducts];

  return (
    <section className="max-w-[1400px] mx-auto py-12">
      <div className="text-center mb-10">
        <h3 className="text-4xl font-bold mb-2">
          Explore Our Featured
        </h3>
        <h2 className="text-3xl text-[#1e3a8a] text-semibold">
          Products
        </h2>
      </div>

      <div 
        className="relative group"
        onMouseEnter={() => {
          setIsAutoScrolling(false);
          setShowControls(true);
        }}
        onMouseLeave={() => {
          setIsAutoScrolling(true);
          setShowControls(false);
        }}
      >
        <button
          onClick={() => scroll('left')}
          className={`absolute left-4 top-1/2 -translate-y-1/2 z-10 
            p-4 rounded-full shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100 
            w-14 h-14 flex items-center justify-center`}
        >
          <span className="text-blue-600 text-2xl">←</span>
        </button>

        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto scroll-smooth hide-scrollbar snap-x snap-mandatory"
          style={{ 
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none',
            maskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)'
          }}
        >
          {extendedProducts.map((product, index) => (
            <div
              key={`${product.id}-${index}`}
              className="min-w-[280px] flex flex-col items-center transform transition-all duration-300 hover:-translate-y-1 snap-center"
            >
              <div className="relative w-48 h-48 transition-transform duration-300 hover:scale-110">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain"
                />
              </div>
              <h3 className="text-lg font-semibold mt-4">{product.name}</h3>
              <p className="text-gray-600">{product.category}</p>
            </div>
          ))}
        </div>

        <button
          onClick={() => scroll('right')}
          className={`absolute right-4 top-1/2 -translate-y-1/2 z-10 
            p-4 rounded-full shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100 
            w-12 h-12 flex items-center justify-center
            ${!showRightButton && 'hidden'}`}
        >
          <span className="text-blue-600 text-xl">→</span>
        </button>
      </div>
    </section>
  );
};

export default Products;