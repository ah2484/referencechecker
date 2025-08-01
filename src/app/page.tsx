'use client';

import { useState, useEffect } from 'react';
import { getProviders, getAvailableProviders, getDefaultProviders } from '../providers/init';
import { Candidate, EmploymentHistory, Referee, ReferenceResponse } from '../providers/types';

export default function HomePage() {
  const [providers, setProviders] = useState<any>(null);
  const [availableProviders, setAvailableProviders] = useState<any>(null);
  const [defaultProviders, setDefaultProviders] = useState<any>(null);
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [employmentHistory, setEmploymentHistory] = useState<EmploymentHistory[]>([]);
  const [referees, setReferees] = useState<Referee[]>([]);
  const [referenceResponses, setReferenceResponses] = useState<ReferenceResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function initializeApp() {
      try {
        setLoading(true);
        
        // Get provider information
        const providers = getProviders();
        const available = getAvailableProviders();
        const defaults = getDefaultProviders();
        
        setProviders(providers);
        setAvailableProviders(available);
        setDefaultProviders(defaults);

        // Load sample data
        if (providers.database) {
          const candidate = await providers.database.getCandidate('1');
          const employment = await providers.database.getEmploymentHistory('1');
          const refereeList = await providers.database.getReferees('1');
          const responses = await providers.database.getReferenceResponses('1');

          setCandidate(candidate);
          setEmploymentHistory(employment);
          setReferees(refereeList);
          setReferenceResponses(responses);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    initializeApp();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Reference Validator...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">❌ Error</div>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Reference Validator
              </h1>
              <p className="text-gray-600">Open Source Foundation</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Provider System</div>
              <div className="text-lg font-semibold text-blue-600">
                {defaultProviders?.database || 'mock'}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Provider Information */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Available Providers */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Available Providers</h2>
            <div className="space-y-2">
              {availableProviders && Object.entries(availableProviders).map(([service, providers]: [string, any]) => (
                <div key={service} className="flex justify-between items-center">
                  <span className="capitalize font-medium">{service}:</span>
                  <span className="text-sm text-gray-600">
                    {Array.isArray(providers) ? providers.join(', ') : 'None'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Default Providers */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Default Providers</h2>
            <div className="space-y-2">
              {defaultProviders && Object.entries(defaultProviders).map(([service, provider]: [string, any]) => (
                <div key={service} className="flex justify-between items-center">
                  <span className="capitalize font-medium">{service}:</span>
                  <span className="text-sm text-blue-600 font-medium">{provider}</span>
                </div>
              ))}
            </div>
          </div>

          {/* System Status */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">System Status</h2>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>Database:</span>
                <span className="text-green-600">✅ Connected</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Authentication:</span>
                <span className="text-green-600">✅ Ready</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Mock Data:</span>
                <span className="text-green-600">✅ Loaded</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sample Data Display */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Candidate Information */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Sample Candidate</h2>
            {candidate && (
              <div className="space-y-3">
                <div>
                  <label className="form-label">Name</label>
                  <p className="text-gray-900">{candidate.fullName}</p>
                </div>
                <div>
                  <label className="form-label">Email</label>
                  <p className="text-gray-900">{candidate.email}</p>
                </div>
                <div>
                  <label className="form-label">Status</label>
                  <p className="text-gray-900 capitalize">{candidate.currentEmploymentStatus}</p>
                </div>
              </div>
            )}
          </div>

          {/* Employment History */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Employment History</h2>
            {employmentHistory.length > 0 ? (
              <div className="space-y-3">
                {employmentHistory.map((employment) => (
                  <div key={employment.id} className="border-l-4 border-blue-500 pl-4">
                    <h3 className="font-medium">{employment.jobTitle}</h3>
                    <p className="text-gray-600">{employment.companyName}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(employment.startDate).toLocaleDateString()} - 
                      {employment.endDate ? new Date(employment.endDate).toLocaleDateString() : 'Present'}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No employment history found</p>
            )}
          </div>

          {/* Referees */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Referees</h2>
            {referees.length > 0 ? (
              <div className="space-y-3">
                {referees.map((referee) => (
                  <div key={referee.id} className="border rounded-lg p-3">
                    <h3 className="font-medium">{referee.name}</h3>
                    <p className="text-gray-600">{referee.role} at {referee.company}</p>
                    <p className="text-sm text-gray-500">{referee.email}</p>
                    <div className="mt-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        referee.isVerified 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {referee.isVerified ? 'Verified' : 'Pending Verification'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No referees found</p>
            )}
          </div>

          {/* Reference Responses */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Reference Responses</h2>
            {referenceResponses.length > 0 ? (
              <div className="space-y-3">
                {referenceResponses.map((response) => (
                  <div key={response.id} className="border rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">Response #{response.id}</h3>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        response.submittedAt 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {response.submittedAt ? 'Submitted' : 'Pending'}
                      </span>
                    </div>
                    {response.submittedAt && (
                      <div className="space-y-1 text-sm">
                        <p><strong>Would Rehire:</strong> {response.wouldRehire ? 'Yes' : 'No'}</p>
                        <p><strong>Left on Good Terms:</strong> {response.leftOnGoodTerms ? 'Yes' : 'No'}</p>
                        {response.additionalComments && (
                          <p><strong>Comments:</strong> {response.additionalComments}</p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No reference responses found</p>
            )}
          </div>
        </div>

        {/* Developer Information */}
        <div className="mt-8 card">
          <h2 className="text-xl font-semibold mb-4">🚀 Ready for Development</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">What's Working</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>✅ Provider-agnostic architecture</li>
                <li>✅ Mock providers for development</li>
                <li>✅ TypeScript interfaces</li>
                <li>✅ Database operations</li>
                <li>✅ Sample data loaded</li>
                <li>✅ Next.js 14 with App Router</li>
                <li>✅ Tailwind CSS styling</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Next Steps</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>🔧 Implement your own providers</li>
                <li>🔧 Add authentication flow</li>
                <li>🔧 Create forms and components</li>
                <li>🔧 Add email functionality</li>
                <li>🔧 Implement AI scoring</li>
                <li>🔧 Add blockchain features</li>
                <li>🔧 Deploy to your platform</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 