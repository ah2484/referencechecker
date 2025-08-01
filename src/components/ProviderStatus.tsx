'use client';

import { useState, useEffect } from 'react';
import { getAvailableProviders, getDefaultProviders } from '../providers/init';

interface ProviderStatusProps {
  className?: string;
}

export default function ProviderStatus({ className = '' }: ProviderStatusProps) {
  const [availableProviders, setAvailableProviders] = useState<Record<string, string[]>>({});
  const [defaultProviders, setDefaultProviders] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const available = getAvailableProviders();
      const defaults = getDefaultProviders();
      
      setAvailableProviders(available);
      setDefaultProviders(defaults);
    } catch (error) {
      console.error('Error getting provider status:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className={`card ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            <div className="h-3 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  const getProviderStatusColor = (service: string) => {
    const defaultProvider = defaultProviders[service];
    const available = availableProviders[service] || [];
    
    if (available.includes(defaultProvider)) {
      return 'text-green-600';
    }
    return 'text-red-600';
  };

  const getProviderStatusIcon = (service: string) => {
    const defaultProvider = defaultProviders[service];
    const available = availableProviders[service] || [];
    
    if (available.includes(defaultProvider)) {
      return '✅';
    }
    return '❌';
  };

  return (
    <div className={`card ${className}`}>
      <h3 className="text-lg font-semibold mb-4">Provider Status</h3>
      
      <div className="space-y-3">
        {Object.entries(defaultProviders).map(([service, provider]) => (
          <div key={service} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium capitalize">{service}:</span>
              <span className={`text-sm font-mono ${getProviderStatusColor(service)}`}>
                {provider}
              </span>
            </div>
            <span className="text-sm">{getProviderStatusIcon(service)}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Available Providers</h4>
        <div className="space-y-1">
          {Object.entries(availableProviders).map(([service, providers]) => (
            <div key={service} className="text-xs text-gray-600">
              <span className="capitalize">{service}:</span>{' '}
              <span className="font-mono">
                {providers.length > 0 ? providers.join(', ') : 'None'}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-xs text-blue-700">
          💡 <strong>Tip:</strong> Change providers by setting environment variables like{' '}
          <code className="bg-blue-100 px-1 rounded">AUTH_PROVIDER=clerk</code> or{' '}
          <code className="bg-blue-100 px-1 rounded">DATABASE_PROVIDER=supabase</code>
        </p>
      </div>
    </div>
  );
} 