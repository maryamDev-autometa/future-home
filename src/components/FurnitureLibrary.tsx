'use client';

import React, { useState } from 'react';
import { Search, Grid3X3, List, Star, Download, Eye } from 'lucide-react';

interface FurnitureItem {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  style: string;
  rating: number;
  downloads: string;
  image: string;
  tags: string[];
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
}

interface FurnitureLibraryProps {
  onSelectFurniture: (item: FurnitureItem) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function FurnitureLibrary({ onSelectFurniture, selectedCategory, onCategoryChange }: FurnitureLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedSubcategory, setSelectedSubcategory] = useState('all');

  const furnitureCategories = [
    {
      id: 'popular',
      name: 'Popular models',
      icon: '🔥',
      count: 145,
      subcategories: ['trending', 'most-used', 'new-arrivals']
    },
    {
      id: 'furniture',
      name: 'Furniture',
      icon: '🛋️',
      count: 1234,
      subcategories: ['sofas', 'chairs', 'tables', 'storage', 'beds', 'desks']
    },
    {
      id: 'lighting',
      name: 'Lighting',
      icon: '💡',
      count: 456,
      subcategories: ['pendant', 'table-lamps', 'floor-lamps', 'chandeliers', 'wall-lights']
    },
    {
      id: 'kitchen',
      name: 'Kitchen',
      icon: '🍳',
      count: 789,
      subcategories: ['cabinets', 'appliances', 'islands', 'sinks', 'countertops']
    },
    {
      id: 'bathroom',
      name: 'Bathroom',
      icon: '🛁',
      count: 321,
      subcategories: ['vanities', 'toilets', 'showers', 'bathtubs', 'accessories']
    },
    {
      id: 'decor',
      name: 'Home Decor',
      icon: '🖼️',
      count: 567,
      subcategories: ['artwork', 'plants', 'mirrors', 'rugs', 'curtains', 'accessories']
    },
    {
      id: 'appliances',
      name: 'Appliances',
      icon: '🔌',
      count: 234,
      subcategories: ['kitchen', 'laundry', 'hvac', 'electronics', 'small-appliances']
    }
  ];

  const furnitureItems: FurnitureItem[] = [
    // Popular/Trending items
    {
      id: 'sofa-l',
      name: 'L-Shaped Sectional Sofa',
      category: 'popular',
      subcategory: 'trending',
      style: 'modern',
      rating: 4.8,
      downloads: '12.5k',
      image: '/api/placeholder/200/150',
      tags: ['sectional', 'fabric', 'comfortable'],
      dimensions: { width: 280, height: 85, depth: 160 }
    },
    {
      id: 'coffee-table',
      name: 'Glass Coffee Table',
      category: 'popular',
      subcategory: 'trending',
      style: 'modern',
      rating: 4.6,
      downloads: '8.9k',
      image: '/api/placeholder/200/150',
      tags: ['coffee-table', 'glass', 'wood'],
      dimensions: { width: 120, height: 45, depth: 60 }
    },
    {
      id: 'tv-unit',
      name: 'Modern TV Unit',
      category: 'popular',
      subcategory: 'trending',
      style: 'modern',
      rating: 4.7,
      downloads: '10.2k',
      image: '/api/placeholder/200/150',
      tags: ['tv-stand', 'entertainment', 'storage'],
      dimensions: { width: 300, height: 50, depth: 50 }
    },
    {
      id: 'plant',
      name: 'Monstera Plant',
      category: 'popular',
      subcategory: 'trending',
      style: 'natural',
      rating: 4.9,
      downloads: '15.3k',
      image: '/api/placeholder/200/150',
      tags: ['plant', 'decoration', 'green'],
      dimensions: { width: 80, height: 150, depth: 80 }
    },
    
    // Furniture
    {
      id: 'office-chair',
      name: 'Ergonomic Office Chair',
      category: 'furniture',
      subcategory: 'chairs',
      style: 'modern',
      rating: 4.9,
      downloads: '15.2k',
      image: '/api/placeholder/200/150',
      tags: ['office', 'ergonomic', 'adjustable'],
      dimensions: { width: 65, height: 120, depth: 65 }
    },
    {
      id: 'desk',
      name: 'Modern Office Desk',
      category: 'furniture',
      subcategory: 'tables',
      style: 'modern',
      rating: 4.7,
      downloads: '9.1k',
      image: '/api/placeholder/200/150',
      tags: ['desk', 'wood', 'office'],
      dimensions: { width: 220, height: 75, depth: 120 }
    },
    {
      id: 'bed',
      name: 'Platform Bed Frame',
      category: 'furniture',
      subcategory: 'beds',
      style: 'minimalist',
      rating: 4.5,
      downloads: '7.3k',
      image: '/api/placeholder/200/150',
      tags: ['bed', 'platform', 'storage'],
      dimensions: { width: 270, height: 35, depth: 420 }
    },
    {
      id: 'nightstand',
      name: 'Wooden Nightstand',
      category: 'furniture',
      subcategory: 'storage',
      style: 'traditional',
      rating: 4.4,
      downloads: '6.2k',
      image: '/api/placeholder/200/150',
      tags: ['nightstand', 'wood', 'drawer'],
      dimensions: { width: 60, height: 60, depth: 40 }
    },
    {
      id: 'wardrobe',
      name: 'Double Door Wardrobe',
      category: 'furniture',
      subcategory: 'storage',
      style: 'modern',
      rating: 4.6,
      downloads: '8.7k',
      image: '/api/placeholder/200/150',
      tags: ['wardrobe', 'storage', 'closet'],
      dimensions: { width: 100, height: 200, depth: 60 }
    },

    // Lighting
    {
      id: 'pendant-light-set',
      name: 'Modern Pendant Light Set',
      category: 'lighting',
      subcategory: 'pendant',
      style: 'modern',
      rating: 4.6,
      downloads: '6.8k',
      image: '/api/placeholder/200/150',
      tags: ['pendant', 'brass', 'dimmable'],
      dimensions: { width: 30, height: 150, depth: 30 }
    },
    {
      id: 'table-lamp-ceramic',
      name: 'Ceramic Table Lamp',
      category: 'lighting',
      subcategory: 'table-lamps',
      style: 'traditional',
      rating: 4.4,
      downloads: '4.2k',
      image: '/api/placeholder/200/150',
      tags: ['table-lamp', 'ceramic', 'fabric-shade'],
      dimensions: { width: 35, height: 60, depth: 35 }
    },

    // Kitchen
    {
      id: 'kitchen-island',
      name: 'Marble Kitchen Island',
      category: 'kitchen',
      subcategory: 'islands',
      style: 'luxury',
      rating: 4.9,
      downloads: '11.7k',
      image: '/api/placeholder/200/150',
      tags: ['island', 'marble', 'storage'],
      dimensions: { width: 320, height: 90, depth: 150 }
    },
    {
      id: 'fridge',
      name: 'Stainless Steel Refrigerator',
      category: 'kitchen',
      subcategory: 'appliances',
      style: 'modern',
      rating: 4.7,
      downloads: '5.9k',
      image: '/api/placeholder/200/150',
      tags: ['refrigerator', 'stainless', 'energy-star'],
      dimensions: { width: 70, height: 180, depth: 70 }
    },
    {
      id: 'stove',
      name: 'Professional Gas Stove',
      category: 'kitchen',
      subcategory: 'appliances',
      style: 'modern',
      rating: 4.8,
      downloads: '7.4k',
      image: '/api/placeholder/200/150',
      tags: ['stove', 'gas', 'professional'],
      dimensions: { width: 150, height: 85, depth: 100 }
    },

    // Home Decor
    {
      id: 'large-monstera-plant',
      name: 'Large Monstera Plant',
      category: 'decor',
      subcategory: 'plants',
      style: 'natural',
      rating: 4.8,
      downloads: '13.4k',
      image: '/api/placeholder/200/150',
      tags: ['plant', 'tropical', 'air-purifying'],
      dimensions: { width: 80, height: 150, depth: 80 }
    },
    {
      id: 'abstract-wall-art',
      name: 'Abstract Wall Art Set',
      category: 'decor',
      subcategory: 'artwork',
      style: 'contemporary',
      rating: 4.5,
      downloads: '3.8k',
      image: '/api/placeholder/200/150',
      tags: ['artwork', 'abstract', 'canvas'],
      dimensions: { width: 60, height: 80, depth: 3 }
    }
  ];

  const getCurrentCategory = () => {
    return furnitureCategories.find(cat => cat.id === selectedCategory) || furnitureCategories[0];
  };

  const getFilteredItems = () => {
    let filtered = furnitureItems.filter(item => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSubcategory = selectedSubcategory === 'all' || item.subcategory === selectedSubcategory;
      const matchesSearch = searchQuery === '' || 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return matchesCategory && matchesSubcategory && matchesSearch;
    });

    return filtered;
  };

  const currentCategory = getCurrentCategory();
  const filteredItems = getFilteredItems();

  return (
    <div className="h-full bg-white border-r border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">Furniture Library</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1 rounded ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by enter..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="p-4 border-b border-gray-200">
        <div className="space-y-1">
          {furnitureCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => {
                onCategoryChange(category.id);
                setSelectedSubcategory('all');
              }}
              className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors ${
                selectedCategory === category.id
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'hover:bg-gray-50 text-gray-700'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-lg">{category.icon}</span>
                <div>
                  <div className="font-medium text-sm">{category.name}</div>
                  {category.id === 'popular' && (
                    <div className="text-xs text-red-500 font-medium">● Popular models</div>
                  )}
                </div>
              </div>
              <span className="text-xs text-gray-500">{category.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Subcategories */}
      {selectedCategory !== 'all' && currentCategory.subcategories && (
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedSubcategory('all')}
              className={`px-3 py-1 text-xs rounded-full ${
                selectedSubcategory === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            {currentCategory.subcategories.map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSubcategory(sub)}
                className={`px-3 py-1 text-xs rounded-full capitalize ${
                  selectedSubcategory === sub
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {sub.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Items */}
      <div className="flex-1 overflow-y-auto p-4">
        {filteredItems.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">🔍</div>
            <p>No items found</p>
            <p className="text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-2 gap-3' : 'space-y-3'}>
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  console.log('Clicked furniture item:', item);
                  onSelectFurniture(item);
                }}
                className={`bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-blue-500 hover:shadow-lg hover:bg-blue-50 transition-all cursor-pointer transform hover:scale-105 ${
                  viewMode === 'list' ? 'flex' : ''
                }`}
              >
                <div className={`bg-gradient-to-br from-blue-100 to-purple-100 ${viewMode === 'list' ? 'w-20 h-20' : 'h-32'} flex items-center justify-center relative`}>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-white bg-opacity-80 rounded-lg mx-auto mb-1 flex items-center justify-center shadow-sm">
                      <span className="text-2xl">
                        {item.id === 'sofa-l' ? '🛋️' :
                         item.id === 'coffee-table' ? '🪑' :
                         item.id === 'tv-unit' ? '📺' :
                         item.id === 'plant' ? '🪴' :
                         item.id === 'office-chair' ? '💺' :
                         item.id === 'desk' ? '🖥️' :
                         item.id === 'bed' ? '🛏️' :
                         item.id === 'nightstand' ? '🕯️' :
                         item.id === 'wardrobe' ? '👔' :
                         item.id === 'kitchen-island' ? '🏝️' :
                         item.id === 'fridge' ? '❄️' :
                         item.id === 'stove' ? '🔥' :
                         '🪑'}
                      </span>
                    </div>
                    <div className="text-xs font-medium text-gray-700 bg-white bg-opacity-60 px-2 py-1 rounded">
                      {item.name.split(' ')[0]}
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">+</span>
                  </div>
                </div>
                <div className={`p-3 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                  <div className="mb-2">
                    <h3 className={`font-medium text-gray-900 ${viewMode === 'list' ? 'text-sm' : 'text-xs'}`}>
                      {item.name}
                    </h3>
                  </div>
                  
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex items-center">
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      <span className="text-xs text-gray-600 ml-1">{item.rating}</span>
                    </div>
                    <div className="flex items-center">
                      <Download className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-600 ml-1">{item.downloads}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-2">
                    {item.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="text-xs text-gray-500">
                    {item.dimensions.width}×{item.dimensions.depth}×{item.dimensions.height} cm
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-center text-xs text-gray-600">
          Showing {filteredItems.length} of {furnitureItems.length} items
        </div>
      </div>
    </div>
  );
}