'use client';

import React, { useState } from 'react';
import { Plus, RefreshCw, Eye, MoreHorizontal } from 'lucide-react';

interface ProjectTemplate {
  id: string;
  title: string;
  description: string;
  image: string;
  category: 'living' | 'bedroom' | 'kitchen' | 'bathroom' | 'office' | 'outdoor';
  style: 'modern' | 'traditional' | 'minimalist' | 'cozy' | 'luxury';
  lastModified: string;
}

interface ProjectGalleryProps {
  onSelectTemplate: (template: ProjectTemplate) => void;
  onNewProject: () => void;
}

export default function ProjectGallery({ onSelectTemplate, onNewProject }: ProjectGalleryProps) {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const projectTemplates: ProjectTemplate[] = [
    {
      id: 'home-office-comfort',
      title: 'Home Office | Comfort Meets Style',
      description: 'Modern home office with ergonomic furniture and natural lighting',
      image: '/api/placeholder/300/200',
      category: 'office',
      style: 'modern',
      lastModified: '0 minutes ago'
    },
    {
      id: 'living-room-comfort',
      title: 'Living Room | Comfort Meets Style',
      description: 'Cozy living space with comfortable seating and warm atmosphere',
      image: '/api/placeholder/300/200',
      category: 'living',
      style: 'cozy',
      lastModified: '0 minutes ago'
    },
    {
      id: 'outdoor-vibrant',
      title: 'Outdoor | Vibrant Outdoor Dining',
      description: 'Colorful outdoor dining area with modern furniture',
      image: '/api/placeholder/300/200',
      category: 'outdoor',
      style: 'modern',
      lastModified: '2 hours ago'
    },
    {
      id: 'patio-cozy',
      title: 'Outdoor | Cozy Patio Dining',
      description: 'Warm and inviting patio space with natural materials',
      image: '/api/placeholder/300/200',
      category: 'outdoor',
      style: 'cozy',
      lastModified: '1 day ago'
    },
    {
      id: 'bedroom-modern',
      title: 'Bedroom | Modern Sanctuary',
      description: 'Contemporary bedroom with clean lines and calming colors',
      image: '/api/placeholder/300/200',
      category: 'bedroom',
      style: 'modern',
      lastModified: '2 days ago'
    },
    {
      id: 'bathroom-luxury',
      title: 'Bathroom | Luxury Spa Experience',
      description: 'Elegant bathroom with premium fixtures and materials',
      image: '/api/placeholder/300/200',
      category: 'bathroom',
      style: 'luxury',
      lastModified: '3 days ago'
    },
    {
      id: 'kitchen-farmhouse',
      title: 'Kitchen | Farmhouse Charm',
      description: 'Rustic kitchen with modern appliances and cozy atmosphere',
      image: '/api/placeholder/300/200',
      category: 'kitchen',
      style: 'traditional',
      lastModified: '1 week ago'
    },
    {
      id: 'living-minimalist',
      title: 'Living Room | Minimalist Zen',
      description: 'Clean, uncluttered living space with focus on functionality',
      image: '/api/placeholder/300/200',
      category: 'living',
      style: 'minimalist',
      lastModified: '2 weeks ago'
    }
  ];

  const filterOptions = [
    { id: 'all', label: 'All Rooms', count: projectTemplates.length },
    { id: 'living', label: 'Living Room', count: projectTemplates.filter(p => p.category === 'living').length },
    { id: 'bedroom', label: 'Bedroom', count: projectTemplates.filter(p => p.category === 'bedroom').length },
    { id: 'kitchen', label: 'Kitchen', count: projectTemplates.filter(p => p.category === 'kitchen').length },
    { id: 'bathroom', label: 'Bathroom', count: projectTemplates.filter(p => p.category === 'bathroom').length },
    { id: 'office', label: 'Office', count: projectTemplates.filter(p => p.category === 'office').length },
    { id: 'outdoor', label: 'Outdoor', count: projectTemplates.filter(p => p.category === 'outdoor').length }
  ];

  const filteredProjects = selectedFilter === 'all' 
    ? projectTemplates 
    : projectTemplates.filter(p => p.category === selectedFilter);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">🏠 Professional Home Designer</h1>
              <p className="text-gray-600 mt-1">Create beautiful spaces with our interactive 3D design tool</p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* New Project Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* New Project Card */}
          <div 
            onClick={onNewProject}
            className="bg-white rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors cursor-pointer p-8 flex flex-col items-center justify-center text-center group"
          >
            <div className="w-16 h-16 bg-gray-100 group-hover:bg-blue-50 rounded-full flex items-center justify-center mb-4 transition-colors">
              <Plus className="w-8 h-8 text-gray-400 group-hover:text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">New Project</h3>
            <p className="text-gray-600 text-sm">Start designing from scratch</p>
          </div>

          {/* Recent Projects */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="h-32 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
              <div className="w-16 h-16 bg-gray-400 rounded"></div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900">Your Recent Project</h3>
              <p className="text-sm text-gray-600 mt-1">Last edited: Today</p>
              <div className="flex items-center justify-between mt-4">
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Project details
                </button>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="h-32 bg-gradient-to-br from-amber-200 to-orange-300 flex items-center justify-center">
              <div className="w-16 h-16 bg-amber-400 rounded"></div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900">Template</h3>
              <p className="text-sm text-gray-600 mt-1">Pre-designed layouts</p>
              <div className="flex items-center justify-between mt-4">
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Project details
                </button>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Templates Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Pick a room to start</h2>
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium">
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
              <span className="text-gray-400">|</span>
              <button className="text-blue-600 hover:text-blue-700 font-medium">
                View all →
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {filterOptions.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedFilter === filter.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {filter.label} ({filter.count})
              </button>
            ))}
          </div>

          {/* Template Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProjects.map((template) => (
              <div
                key={template.id}
                onClick={() => onSelectTemplate(template)}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
              >
                <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 relative overflow-hidden">
                  {/* Placeholder for template image */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-white bg-opacity-50 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <Eye className="w-8 h-8 text-gray-600" />
                      </div>
                      <p className="text-sm text-gray-600 font-medium">
                        {template.category.charAt(0).toUpperCase() + template.category.slice(1)} Design
                      </p>
                    </div>
                  </div>
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      template.style === 'modern' ? 'bg-blue-100 text-blue-800' :
                      template.style === 'traditional' ? 'bg-amber-100 text-amber-800' :
                      template.style === 'minimalist' ? 'bg-gray-100 text-gray-800' :
                      template.style === 'cozy' ? 'bg-orange-100 text-orange-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {template.style}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {template.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {template.description}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    {template.lastModified}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">✨ Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-xl">🏗️</span>
              </div>
              <h4 className="font-medium text-gray-900">Interactive Room Builder</h4>
              <p className="text-sm text-gray-600 mt-1">Draw rooms and see them in 3D instantly</p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-xl">🛋️</span>
              </div>
              <h4 className="font-medium text-gray-900">Extensive Furniture Library</h4>
              <p className="text-sm text-gray-600 mt-1">Thousands of realistic 3D furniture models</p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-xl">🎨</span>
              </div>
              <h4 className="font-medium text-gray-900">Professional Materials</h4>
              <p className="text-sm text-gray-600 mt-1">Realistic textures and lighting effects</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}