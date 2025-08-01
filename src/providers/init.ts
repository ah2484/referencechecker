import { ProviderRegistry } from '../lib/provider-registry';
import { MockAuthProvider } from './mock/mock-auth-provider';
import { MockDatabaseProvider } from './mock/mock-database-provider';

/**
 * Provider Initialization
 * 
 * This file registers the default mock providers and can be extended
 * to register custom providers. Developers can modify this file to
 * use their own authentication, database, email, and other providers.
 */

export function initializeProviders() {
  // Register mock providers by default
  ProviderRegistry.registerAuthProvider('mock', new MockAuthProvider());
  ProviderRegistry.registerDatabaseProvider('mock', new MockDatabaseProvider());

  // TODO: Register additional mock providers
  // ProviderRegistry.registerEmailProvider('mock', new MockEmailProvider());
  // ProviderRegistry.registerNLPProvider('mock', new MockNLPProvider());
  // ProviderRegistry.registerStorageProvider('mock', new MockStorageProvider());
  // ProviderRegistry.registerBlockchainProvider('mock', new MockBlockchainProvider());
  // ProviderRegistry.registerVCProvider('mock', new MockVCProvider());
  // ProviderRegistry.registerZKProvider('mock', new MockZKProvider());

  console.log('✅ Providers initialized successfully');
  console.log('📋 Available providers:', ProviderRegistry.getAllAvailableProviders());
  console.log('🔧 Default providers:', ProviderRegistry.getDefaultProviders());
}

/**
 * Example: How to register custom providers
 * 
 * Uncomment and modify these examples to use your own providers:
 */

/*
// Example: Register Clerk authentication
import { ClerkAuthProvider } from './clerk/clerk-auth-provider';
ProviderRegistry.registerAuthProvider('clerk', new ClerkAuthProvider());

// Example: Register Supabase database
import { SupabaseDatabaseProvider } from './supabase/supabase-database-provider';
ProviderRegistry.registerDatabaseProvider('supabase', new SupabaseDatabaseProvider());

// Example: Register Resend email
import { ResendEmailProvider } from './resend/resend-email-provider';
ProviderRegistry.registerEmailProvider('resend', new ResendEmailProvider());

// Example: Register OpenAI NLP
import { OpenAINLPProvider } from './openai/openai-nlp-provider';
ProviderRegistry.registerNLPProvider('openai', new OpenAINLPProvider());

// Example: Register AWS S3 storage
import { AWSS3StorageProvider } from './aws/aws-s3-storage-provider';
ProviderRegistry.registerStorageProvider('aws-s3', new AWSS3StorageProvider());

// Example: Register Ethereum blockchain
import { EthereumBlockchainProvider } from './ethereum/ethereum-blockchain-provider';
ProviderRegistry.registerBlockchainProvider('ethereum', new EthereumBlockchainProvider());
*/

/**
 * Helper function to get providers with error handling
 */
export function getProviders() {
  try {
    const auth = ProviderRegistry.getAuthProvider();
    const database = ProviderRegistry.getDatabaseProvider();
    
    return {
      auth,
      database,
      // Add other providers as needed
      // email: ProviderRegistry.getEmailProvider(),
      // nlp: ProviderRegistry.getNLPProvider(),
      // storage: ProviderRegistry.getStorageProvider(),
      // blockchain: ProviderRegistry.getBlockchainProvider(),
      // vc: ProviderRegistry.getVCProvider(),
      // zk: ProviderRegistry.getZKProvider(),
    };
  } catch (error) {
    console.error('❌ Error getting providers:', error);
    throw error;
  }
}

/**
 * Helper function to check if a specific provider is available
 */
export function hasProvider(service: string, name: string): boolean {
  return ProviderRegistry.hasProvider(service, name);
}

/**
 * Helper function to get all available providers
 */
export function getAvailableProviders() {
  return ProviderRegistry.getAllAvailableProviders();
}

/**
 * Helper function to get default providers
 */
export function getDefaultProviders() {
  return ProviderRegistry.getDefaultProviders();
} 