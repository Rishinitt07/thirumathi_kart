import React, { useState } from 'react';

const ProductDetailModal = ({ product, onClose }) => {
  const [selectedImage, setSelectedImage] = useState(0);

  if (!product) return null;

  const renderRating = (rating = 5) => {
    return (
      <div className="flex text-yellow-400 text-sm">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i}>{i < Math.round(rating) ? '★' : '☆'}</span>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col relative animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>

        <div className="flex flex-col md:flex-row h-full overflow-y-auto">
          {/* Image Gallery */}
          <div className="w-full md:w-1/2 bg-gray-100 flex flex-col relative h-64 md:h-auto shrink-0 border-b md:border-b-0 md:border-r border-gray-200">
            <img
              src={product.images?.[selectedImage] || 'https://placehold.co/400x400/f472b6/ffffff?text=No+Image'}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
            {product.images?.length > 1 && (
              <div className="absolute bottom-4 left-0 right-0 flex gap-3 overflow-x-auto px-4 w-full justify-center">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-14 h-14 shrink-0 rounded-lg border-2 p-0.5 bg-white shadow-lg transition-all ${selectedImage === idx ? 'border-hotpink-500 scale-110' : 'border-transparent hover:scale-105'}`}
                  >
                    <img src={img} alt="thumbnail" className="w-full h-full object-cover rounded-md" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="w-full md:w-1/2 p-6 lg:p-8">
            <div className="mb-2">
              <span className="text-xs font-normal text-hotpink-600 bg-hotpink-50 px-2 py-1 rounded capitalize">
                {product.category || 'Product'}
              </span>
            </div>
            <h2 className="text-2xl font-normal text-gray-900 mb-2 leading-tight">{product.name}</h2>
            
            <div className="flex items-center gap-3 mb-6">
              {renderRating(product.rating)}
              <span className="text-sm text-gray-500">({product.reviews || 0} reviews)</span>
            </div>

            <div className="mb-6">
              <div className="flex items-end gap-3">
                <span className="text-3xl font-normal text-gray-900">
                  ₹{((product.price || 0) * (1 - (product.discount || 0) / 100)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                {(product.discount || 0) > 0 && (
                  <>
                    <span className="text-lg text-gray-500 line-through mb-1">
                      ₹{(product.price || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span className="text-sm font-normal text-green-600 mb-1">
                      {product.discount}% OFF
                    </span>
                  </>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-1">Inclusive of all taxes</p>
            </div>

            <div className="prose prose-sm text-gray-600 mb-8 border-t border-b border-gray-100 py-6">
              <h4 className="text-gray-900 font-normal mb-2">Description</h4>
              <p>{product.description || 'No description available for this product.'}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded-xl">
              <div>
                <p className="text-gray-500 mb-1">Brand</p>
                <p className="font-normal text-gray-900">{product.brand || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">SKU</p>
                <p className="font-normal text-gray-900">{product.sku || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Weight</p>
                <p className="font-normal text-gray-900">{product.weight || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Stock Status</p>
                <p className={`font-normal ${(product.stock || 0) > 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {(product.stock || 0) > 0 ? 'In Stock' : 'Out of Stock'}
                </p>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
