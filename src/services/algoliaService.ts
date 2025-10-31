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
        const workingTag = await this.findWorkingTag(subcategoryId, hitsPerPage);

        if (workingTag) {
            return this.searchStrategies('', `tags:"${workingTag}"`, hitsPerPage);
        }

        console.log('No results found for subcategory, using general search');
        return this.searchStrategies('', '', hitsPerPage);
    }

    // Specialized search methods for different sections

    // Get trending strategies (using recommend API or highest activity)
    static async getTrendingStrategies(subcategoryId: string, hitsPerPage: number = 10): Promise<SearchResponse> {
        try {
            const result = await client.searchSingleIndex({
                indexName: 'Strategies_CountLast7Days_desc',
                searchParams: {
                    hitsPerPage,
                    facetFilters: [[`tags:${subcategoryId}`]]
                }
            });
            return result as SearchResponse;
        } catch (error) {
            // Fallback to regular search if sort fails
            return this.searchStrategies('', `tags:"${subcategoryId}"`, hitsPerPage);
        }
    }

    // Get strategies sorted by number of copies
    static async getStrategiesByCopies(subcategoryId: string, hitsPerPage: number = 10): Promise<SearchResponse> {
        const response = await this.searchStrategies('', `tags:"${subcategoryId}"`, 50);

        // Sort by copiesCount in descending order
        const sortedHits = response.hits
            .sort((a, b) => (b.copiesCount || 0) - (a.copiesCount || 0))
            .slice(0, hitsPerPage);

        return {
            ...response,
            hits: sortedHits,
            nbHits: sortedHits.length
        };
    }

    // Get strategies sorted by total capital
    static async getStrategiesByCapital(subcategoryId: string, hitsPerPage: number = 10): Promise<SearchResponse> {
        const response = await this.searchStrategies('', `tags:"${subcategoryId}"`, 50);

        // Sort by totalCapital in descending order
        const sortedHits = response.hits
            .sort((a, b) => (b.totalCapital || 0) - (a.totalCapital || 0))
            .slice(0, hitsPerPage);

        return {
            ...response,
            hits: sortedHits,
            nbHits: sortedHits.length
        };
    }

    // Get strategies with recent peak performance (lastMonthReturns > 0.1)
    static async getRecentPeakStrategies(subcategoryId: string, hitsPerPage: number = 10): Promise<SearchResponse> {
        const response = await this.searchStrategies('', `tags:"${subcategoryId}"`, 50);

        // Filter by lastMonthReturns > 0.1 and sort by performance
        const filteredHits = response.hits
            .filter(strategy => (strategy.lastMonthReturns || 0) > 0.1)
            .sort((a, b) => (b.lastMonthReturns || 0) - (a.lastMonthReturns || 0))
            .slice(0, hitsPerPage);

        return {
            ...response,
            hits: filteredHits,
            nbHits: filteredHits.length
        };
    }

    // Get random/discover strategies (mixed sorting)
    static async getDiscoverStrategies(subcategoryId: string, hitsPerPage: number = 10): Promise<SearchResponse> {
        const response = await this.searchStrategies('', `tags:"${subcategoryId}"`, 50);

        // Create a discovery score based on multiple factors
        const scoredHits = response.hits.map(strategy => ({
            ...strategy,
            discoveryScore: this.calculateDiscoveryScore(strategy)
        }))
            .sort((a, b) => b.discoveryScore - a.discoveryScore)
            .slice(0, hitsPerPage);

        return {
            ...response,
            hits: scoredHits,
            nbHits: scoredHits.length
        };
    }

    // Get newest strategies (by creation date)
    static async getFreshStrategies(subcategoryId: string, hitsPerPage: number = 10): Promise<SearchResponse> {
        const response = await this.searchStrategies('', `tags:"${subcategoryId}"`, 50);

        // Sort by CreatedAt or PublishingDate in descending order (newest first)
        const sortedHits = response.hits
            .sort((a, b) => {
                const dateA = new Date(a.PublishingDate || a.CreatedAt).getTime();
                const dateB = new Date(b.PublishingDate || b.CreatedAt).getTime();
                return dateB - dateA;
            })
            .slice(0, hitsPerPage);

        return {
            ...response,
            hits: sortedHits,
            nbHits: sortedHits.length
        };
    }

    // Get diversified strategies (more than 10 tickers in allocation)
    static async getDiversifiedStrategies(subcategoryId: string, hitsPerPage: number = 10): Promise<SearchResponse> {
        const response = await this.searchStrategies('', `tags:"${subcategoryId}"`, 50);

        // Filter by strategies with more than 10 tickers and sort by diversity
        const filteredHits = response.hits
            .filter(strategy => {
                const allocation = strategy.currentAllocation || [];
                return allocation.length > 10;
            })
            .sort((a, b) => {
                const tickersA = (a.currentAllocation || []).length;
                const tickersB = (b.currentAllocation || []).length;
                return tickersB - tickersA; // Sort by most diversified first
            })
            .slice(0, hitsPerPage);

        return {
            ...response,
            hits: filteredHits,
            nbHits: filteredHits.length
        };
    }

    // Get long time in market strategies (CreatedAt > 1 year ago)
    static async getLongTimeInMarketStrategies(subcategoryId: string, hitsPerPage: number = 10): Promise<SearchResponse> {
        const response = await this.searchStrategies('', `tags:"${subcategoryId}"`, 50);

        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

        // Filter by strategies created more than 1 year ago
        const filteredHits = response.hits
            .filter(strategy => {
                const createdDate = new Date(strategy.CreatedAt);
                return createdDate < oneYearAgo;
            })
            .sort((a, b) => {
                // Sort by oldest first (most experienced)
                const dateA = new Date(a.CreatedAt).getTime();
                const dateB = new Date(b.CreatedAt).getTime();
                return dateA - dateB;
            })
            .slice(0, hitsPerPage);

        return {
            ...response,
            hits: filteredHits,
            nbHits: filteredHits.length
        };
    }

    // Helper method to calculate discovery score
    private static calculateDiscoveryScore(strategy: AlgoliaStrategy): number {
        const random = Math.random() * 0.3; // 30% randomness
        const capitalScore = Math.log(strategy.totalCapital || 1) * 0.2;
        const copiesScore = Math.log(strategy.copiesCount || 1) * 0.2;
        const returnsScore = (strategy.totalReturns || 0) * 0.3;

        return random + capitalScore + copiesScore + returnsScore;
    }

    // Helper method to find the correct tag format for a subcategory
    private static async findWorkingTag(subcategoryId: string, hitsPerPage: number = 20): Promise<string | null> {
        const tagVariations = [
            subcategoryId, // exact match: "sector::technology_ai"
            subcategoryId.replace('::', ':'), // "sector:technology_ai"
            subcategoryId.split('::')[1], // "technology_ai"
            subcategoryId.split('::').join('_'), // "sector_technology_ai"
        ];

        for (const tagVariation of tagVariations) {
            const result = await this.searchStrategies('', `tags:"${tagVariation}"`, Math.min(hitsPerPage, 5));
            if (result.hits.length > 0) {
                console.log('Working tag format found:', tagVariation);
                return tagVariation;
            }
        }

        return null;
    }

    // Debug method to check available tags
    static async debugAvailableTags(hitsPerPage: number = 50): Promise<string[]> {
        const response = await this.searchStrategies('', '', hitsPerPage);
        const allTags = new Set<string>();

        response.hits.forEach(strategy => {
            if (strategy.tags && Array.isArray(strategy.tags)) {
                strategy.tags.forEach(tag => allTags.add(tag));
            }
        });

        const uniqueTags = Array.from(allTags).sort();
        console.log('Available tags in index:', uniqueTags);
        return uniqueTags;
    }

    // Convert Algolia strategy to our InvestmentProduct format
    static convertToInvestmentProduct(strategy: AlgoliaStrategy): any {
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