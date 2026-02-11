import { Product } from '../types';
import { ProductCard } from './ProductCard';

interface ProductSliderProps {
  title: string;
  products: Product[];
  onCompare?: (product: Product) => void;
  onSetAlert?: (product: Product) => void;
  isAuthenticated?: boolean;
}

export function ProductSlider({ 
  title, 
  products, 
  onCompare, 
  onSetAlert, 
  isAuthenticated 
}: ProductSliderProps) {
  if (products.length === 0) return null;

  const scrollLeft = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollBy({ left: -400, behavior: 'smooth' });
    }
  };

  const scrollRight = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollBy({ left: 400, behavior: 'smooth' });
    }
  };

  const sliderId = `slider-${title.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-semibold text-[#1d1d1f] dark:text-white font-apple tracking-[-0.01em]">
          {title}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => scrollLeft(sliderId)}
            className="p-2 rounded-full bg-white dark:bg-[#1c1c1e] border border-gray-300 dark:border-[#38383a] hover:bg-gray-50 dark:hover:bg-[#2c2c2e] transition-colors shadow-md hover:shadow-lg"
            aria-label="Scroll left"
          >
            <svg
              className="w-5 h-5 text-gray-700 dark:text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={() => scrollRight(sliderId)}
            className="p-2 rounded-full bg-white dark:bg-[#1c1c1e] border border-gray-300 dark:border-[#38383a] hover:bg-gray-50 dark:hover:bg-[#2c2c2e] transition-colors shadow-md hover:shadow-lg"
            aria-label="Scroll right"
          >
            <svg
              className="w-5 h-5 text-gray-700 dark:text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="relative w-full overflow-x-hidden">
        <div
          id={sliderId}
          className="flex gap-5 overflow-x-auto scrollbar-hide scroll-smooth"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="flex-shrink-0 w-[260px] md:w-[280px]"
            >
              <ProductCard
                product={product}
                onCompare={onCompare}
                onSetAlert={onSetAlert}
                isAuthenticated={isAuthenticated}
                isInCompare={false}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
