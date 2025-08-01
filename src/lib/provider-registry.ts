import {
  AuthProvider,
  DatabaseProvider,
  EmailProvider,
  NLPProvider,
  StorageProvider,
  BlockchainProvider,
  VerifiableCredentialProvider,
  ZKProofProvider
} from '../providers/types';

/**
 * Provider Registry
 * 
 * This system allows developers to register their own implementations
 * of any service provider and easily swap between different providers.
 * 
 * Usage:
 * 1. Register your provider: ProviderRegistry.registerAuthProvider('custom', new CustomAuthProvider())
 * 2. Use the provider: const auth = ProviderRegistry.getAuthProvider('custom')
 * 3. Or use default: const auth = ProviderRegistry.getAuthProvider()
 */
export class ProviderRegistry {
  private static authProviders = new Map<string, AuthProvider>();
  private static databaseProviders = new Map<string, DatabaseProvider>();
  private static emailProviders = new Map<string, EmailProvider>();
  private static nlpProviders = new Map<string, NLPProvider>();
  private static storageProviders = new Map<string, StorageProvider>();
  private static blockchainProviders = new Map<string, BlockchainProvider>();
  private static vcProviders = new Map<string, VerifiableCredentialProvider>();
  private static zkProviders = new Map<string, ZKProofProvider>();

  // Default provider names (can be overridden via environment variables)
  private static defaultAuthProvider = 'mock';
  private static defaultDatabaseProvider = 'mock';
  private static defaultEmailProvider = 'mock';
  private static defaultNLPProvider = 'mock';
  private static defaultStorageProvider = 'mock';
  private static defaultBlockchainProvider = 'mock';
  private static defaultVCProvider = 'mock';
  private static defaultZKProvider = 'mock';

  /**
   * Initialize default providers from environment variables
   */
  static initialize() {
    this.defaultAuthProvider = process.env.AUTH_PROVIDER || 'mock';
    this.defaultDatabaseProvider = process.env.DATABASE_PROVIDER || 'mock';
    this.defaultEmailProvider = process.env.EMAIL_PROVIDER || 'mock';
    this.defaultNLPProvider = process.env.NLP_PROVIDER || 'mock';
    this.defaultStorageProvider = process.env.STORAGE_PROVIDER || 'mock';
    this.defaultBlockchainProvider = process.env.BLOCKCHAIN_PROVIDER || 'mock';
    this.defaultVCProvider = process.env.VC_PROVIDER || 'mock';
    this.defaultZKProvider = process.env.ZK_PROVIDER || 'mock';
  }

  // ===== AUTH PROVIDERS =====
  
  static registerAuthProvider(name: string, provider: AuthProvider) {
    this.authProviders.set(name, provider);
  }

  static getAuthProvider(name?: string): AuthProvider {
    const providerName = name || this.defaultAuthProvider;
    const provider = this.authProviders.get(providerName);
    
    if (!provider) {
      throw new Error(`Auth provider '${providerName}' not found. Available providers: ${Array.from(this.authProviders.keys()).join(', ')}`);
    }
    
    return provider;
  }

  static getAvailableAuthProviders(): string[] {
    return Array.from(this.authProviders.keys());
  }

  // ===== DATABASE PROVIDERS =====
  
  static registerDatabaseProvider(name: string, provider: DatabaseProvider) {
    this.databaseProviders.set(name, provider);
  }

  static getDatabaseProvider(name?: string): DatabaseProvider {
    const providerName = name || this.defaultDatabaseProvider;
    const provider = this.databaseProviders.get(providerName);
    
    if (!provider) {
      throw new Error(`Database provider '${providerName}' not found. Available providers: ${Array.from(this.databaseProviders.keys()).join(', ')}`);
    }
    
    return provider;
  }

  static getAvailableDatabaseProviders(): string[] {
    return Array.from(this.databaseProviders.keys());
  }

  // ===== EMAIL PROVIDERS =====
  
  static registerEmailProvider(name: string, provider: EmailProvider) {
    this.emailProviders.set(name, provider);
  }

  static getEmailProvider(name?: string): EmailProvider {
    const providerName = name || this.defaultEmailProvider;
    const provider = this.emailProviders.get(providerName);
    
    if (!provider) {
      throw new Error(`Email provider '${providerName}' not found. Available providers: ${Array.from(this.emailProviders.keys()).join(', ')}`);
    }
    
    return provider;
  }

  static getAvailableEmailProviders(): string[] {
    return Array.from(this.emailProviders.keys());
  }

  // ===== NLP PROVIDERS =====
  
  static registerNLPProvider(name: string, provider: NLPProvider) {
    this.nlpProviders.set(name, provider);
  }

  static getNLPProvider(name?: string): NLPProvider {
    const providerName = name || this.defaultNLPProvider;
    const provider = this.nlpProviders.get(providerName);
    
    if (!provider) {
      throw new Error(`NLP provider '${providerName}' not found. Available providers: ${Array.from(this.nlpProviders.keys()).join(', ')}`);
    }
    
    return provider;
  }

  static getAvailableNLPProviders(): string[] {
    return Array.from(this.nlpProviders.keys());
  }

  // ===== STORAGE PROVIDERS =====
  
  static registerStorageProvider(name: string, provider: StorageProvider) {
    this.storageProviders.set(name, provider);
  }

  static getStorageProvider(name?: string): StorageProvider {
    const providerName = name || this.defaultStorageProvider;
    const provider = this.storageProviders.get(providerName);
    
    if (!provider) {
      throw new Error(`Storage provider '${providerName}' not found. Available providers: ${Array.from(this.storageProviders.keys()).join(', ')}`);
    }
    
    return provider;
  }

  static getAvailableStorageProviders(): string[] {
    return Array.from(this.storageProviders.keys());
  }

  // ===== BLOCKCHAIN PROVIDERS =====
  
  static registerBlockchainProvider(name: string, provider: BlockchainProvider) {
    this.blockchainProviders.set(name, provider);
  }

  static getBlockchainProvider(name?: string): BlockchainProvider {
    const providerName = name || this.defaultBlockchainProvider;
    const provider = this.blockchainProviders.get(providerName);
    
    if (!provider) {
      throw new Error(`Blockchain provider '${providerName}' not found. Available providers: ${Array.from(this.blockchainProviders.keys()).join(', ')}`);
    }
    
    return provider;
  }

  static getAvailableBlockchainProviders(): string[] {
    return Array.from(this.blockchainProviders.keys());
  }

  // ===== VERIFIABLE CREDENTIAL PROVIDERS =====
  
  static registerVCProvider(name: string, provider: VerifiableCredentialProvider) {
    this.vcProviders.set(name, provider);
  }

  static getVCProvider(name?: string): VerifiableCredentialProvider {
    const providerName = name || this.defaultVCProvider;
    const provider = this.vcProviders.get(providerName);
    
    if (!provider) {
      throw new Error(`VC provider '${providerName}' not found. Available providers: ${Array.from(this.vcProviders.keys()).join(', ')}`);
    }
    
    return provider;
  }

  static getAvailableVCProviders(): string[] {
    return Array.from(this.vcProviders.keys());
  }

  // ===== ZK PROOF PROVIDERS =====
  
  static registerZKProvider(name: string, provider: ZKProofProvider) {
    this.zkProviders.set(name, provider);
  }

  static getZKProvider(name?: string): ZKProofProvider {
    const providerName = name || this.defaultZKProvider;
    const provider = this.zkProviders.get(providerName);
    
    if (!provider) {
      throw new Error(`ZK provider '${providerName}' not found. Available providers: ${Array.from(this.zkProviders.keys()).join(', ')}`);
    }
    
    return provider;
  }

  static getAvailableZKProviders(): string[] {
    return Array.from(this.zkProviders.keys());
  }

  // ===== UTILITY METHODS =====
  
  /**
   * Get all available providers for all services
   */
  static getAllAvailableProviders(): Record<string, string[]> {
    return {
      auth: this.getAvailableAuthProviders(),
      database: this.getAvailableDatabaseProviders(),
      email: this.getAvailableEmailProviders(),
      nlp: this.getAvailableNLPProviders(),
      storage: this.getAvailableStorageProviders(),
      blockchain: this.getAvailableBlockchainProviders(),
      vc: this.getAvailableVCProviders(),
      zk: this.getAvailableZKProviders()
    };
  }

  /**
   * Get current default providers
   */
  static getDefaultProviders(): Record<string, string> {
    return {
      auth: this.defaultAuthProvider,
      database: this.defaultDatabaseProvider,
      email: this.defaultEmailProvider,
      nlp: this.defaultNLPProvider,
      storage: this.defaultStorageProvider,
      blockchain: this.defaultBlockchainProvider,
      vc: this.defaultVCProvider,
      zk: this.defaultZKProvider
    };
  }

  /**
   * Check if a provider is available
   */
  static hasProvider(service: string, name: string): boolean {
    switch (service) {
      case 'auth':
        return this.authProviders.has(name);
      case 'database':
        return this.databaseProviders.has(name);
      case 'email':
        return this.emailProviders.has(name);
      case 'nlp':
        return this.nlpProviders.has(name);
      case 'storage':
        return this.storageProviders.has(name);
      case 'blockchain':
        return this.blockchainProviders.has(name);
      case 'vc':
        return this.vcProviders.has(name);
      case 'zk':
        return this.zkProviders.has(name);
      default:
        return false;
    }
  }

  /**
   * Clear all providers (useful for testing)
   */
  static clearAll() {
    this.authProviders.clear();
    this.databaseProviders.clear();
    this.emailProviders.clear();
    this.nlpProviders.clear();
    this.storageProviders.clear();
    this.blockchainProviders.clear();
    this.vcProviders.clear();
    this.zkProviders.clear();
  }
}

// Initialize the registry when the module is loaded
ProviderRegistry.initialize(); 