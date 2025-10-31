import { algoliasearch } from 'algoliasearch';

// Initialize the Algolia client
const client = algoliasearch('1OMCND029R', '2f7885632ce978bba3d5811f2782bd6b');

export interface AlgoliaStrategy {
  objectID: string;
  Id: number;
  StrategyName: string;
  ExternalId: string;
  CreatedAt: string;
  PublishingDate: string;
  StrategyTicker: string;
  AccountId: number;
  UserUuid: string;
  profileImageUrl: string;
  StrategyDescription: string;
  StrategyTagline: string;
  lastRebalanceDate: string;
  averageRebalanceActivity: number;
  CountLast7Days: number;
  totalCapital: number;
  creatorHandle: string;
  creatorName: string;
  copiesCount: number;
  lastMonthReturns: number;
  totalReturns: number;
  currentAllocation: Array<{
    ticker: string;
    sector: string | null;
    fraction: number;
  }>;
  tags: string[];
}

export interface SearchResponse {
  hits: AlgoliaStrategy[];
  nbHits: number;
  page: number;
  nbPages: number;
  hitsPerPage: number;
  processingTimeMS: number;
  exhaustiveNbHits: boolean;
  query: string;
  params: string;
}

export class AlgoliaService {
  // Search strategies with optional filters
  static async searchStrategies(
    query: string = '',
    filters?: string,
    hitsPerPage: number = 20,
    page: number = 0
  ): Promise<SearchResponse> {
    try {
      const searchParams = {
        indexName: 'Strategies',
        query: query,
        hitsPerPage,
        page,
        ...(filters && { filters })
      };

      const result = await client.searchSingleIndex(searchParams);
      return result as SearchResponse;
    } catch (error) {
      console.error('Error searching strategies:', error);
      throw error;
    }
  }

  // Get strategies by tag
  static async getStrategiesByTag(tag: string, hitsPerPage: number = 20): Promise<SearchResponse> {
    return this.searchStrategies('', `tags:"${tag}"`, hitsPerPage);
  }

  // Get strategies by category (using tags)
  static async getStrategiesByCategory(category: string, hitsPerPage: number = 20): Promise<SearchResponse> {
    // Map our app categories to Algolia tags
    const categoryTagMap: { [key: string]: string[] } = {
      'sector': ['sector:technology_ai', 'sector:consumer_trends', 'sector:biotech_healthcare', 'sector:industrials_core', 'sector:defense_aerospace', 'sector:finance_value', 'sector:metals_mining', 'sector:real_assets'],
      'thesis': ['thesis:innovation_wave', 'thesis:long_term_compounders', 'thesis:deep_value_recovery', 'thesis:electrification_pipeline', 'thesis:nuclear_cycle', 'thesis:commodity_supercycle', 'thesis:space_economy', 'thesis:defense_spending_cycle', 'thesis:demographic_trend'],
      'stage': ['stage:early_stage', 'stage:growth', 'stage:established', 'stage:mixed'],
      'geo': ['geo:us_focus', 'geo:global_multi_region', 'geo:commodity_exporters', 'geo:china_focus'],
      'horizon': ['horizon:long_term_structural', 'horizon:thematic', 'horizon:cyclical_repricing', 'horizon:tactical_opportunity'],
      'composition': ['composition:single_stocks_only', 'composition:mixed_assets', 'composition:etf_core', 'composition:etf_satellite']
    };

    const tags = categoryTagMap[category] || [];
    if (tags.length === 0) {
      return this.searchStrategies('', '', hitsPerPage);
    }

    // Create filter for multiple tags with OR logic
    const tagFilters = tags.map(tag => `tags:"${tag}"`).join(' OR ');
    return this.searchStrategies('', `(${tagFilters})`, hitsPerPage);
  }

  // Get strategies by subcategory
  static async getStrategiesBySubcategory(subcategoryId: string, hitsPerPage: number = 20): Promise<SearchResponse> {
    return this.searchStrategies('', `tags:"${subcategoryId}"`, hitsPerPage);
  }

  // Convert Algolia strategy to our InvestmentProduct format
  static convertToInvestmentProduct(strategy: AlgoliaStrategy): any {
    console.log({strategy})
    return {
      id: strategy.Id.toString(),
      name: strategy.StrategyName,
      description: strategy.StrategyTagline,
      type: 'Strategy',
      risk: strategy.averageRebalanceActivity > 5 ? 'high' : strategy.averageRebalanceActivity > 2 ? 'medium' : 'low',
      expectedReturn: `${(strategy.totalReturns * 100).toFixed(1)}%`,
      minimumAmount: Math.max(100, Math.floor(strategy.totalCapital * 0.01)),
      category: strategy.tags.find(tag => tag.includes(':'))?.split(':')[0] || 'Other',
      subCategoryId: strategy.tags.find(tag => tag.includes('::')) || strategy.tags[0] || '',
      ticker: strategy.StrategyTicker,
      creatorName: strategy.creatorName,
      creatorHandle: strategy.creatorHandle,
      totalCapital: strategy.totalCapital,
      copiesCount: strategy.copiesCount,
      lastMonthReturns: strategy.lastMonthReturns,
      totalReturns: strategy.totalReturns,
      currentAllocation: strategy.currentAllocation,
      externalId: strategy.ExternalId,
      profileImage: strategy.profileImageUrl ?? 'https://d1vuy7y9jvyriv.cloudfront.net/portfolios/default/default.png'
    };
  }
}