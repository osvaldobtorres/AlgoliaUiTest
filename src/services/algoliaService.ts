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
    ProfileImageUrl: string;
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
    historicalReturns: number[];
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
        const result = await client.searchSingleIndex({
            indexName: 'Strategies_CountLast7Days_desc',
            searchParams: {
                hitsPerPage,
                facetFilters: [[`tags:${subcategoryId}`]]
            }
        });
        return result as SearchResponse;
    }

    // Get strategies sorted by number of copies
    static async getStrategiesByCopies(subcategoryId: string, hitsPerPage: number = 10): Promise<SearchResponse> {
        const result = await client.searchSingleIndex({
            indexName: 'Strategies_TotalCopies_desc',
            searchParams: {
                hitsPerPage,
                facetFilters: [[`tags:${subcategoryId}`]]
            }
        });
        return result as SearchResponse;
    }

    // Get strategies sorted by total capital
    static async getStrategiesByCapital(subcategoryId: string, hitsPerPage: number = 10): Promise<SearchResponse> {
        const result = await client.searchSingleIndex({
            indexName: 'Strategies_TotalCapital_desc',
            searchParams: {
                hitsPerPage,
                facetFilters: [[`tags:${subcategoryId}`]]
            }
        });
        return result as SearchResponse;
    }

    // Get strategies with recent peak performance (lastMonthReturns > 0.1)
    static async getRecentPeakStrategies(subcategoryId: string, hitsPerPage: number = 10): Promise<SearchResponse> {
        const result = await client.searchSingleIndex({
            indexName: 'Strategies',
            searchParams: {
                query: '',
                filters: 'lastMonthReturns > 0.1',
                hitsPerPage: 50,
                optionalFilters: ['CountLast7Days>10']
            }
        });
        return result as SearchResponse;
    }

    static async search(searchTerm: string, hitsPerPage: number = 5): Promise<SearchResponse> {
        const result = await client.searchSingleIndex({
            indexName: 'Strategies',
            searchParams: {
                query: searchTerm
            }
        });
        return result as SearchResponse;
    }

    // Get random/discover strategies (mixed sorting)
    static async getDiscoverStrategies(subcategoryId: string, hitsPerPage: number = 10): Promise<SearchResponse> {
        const result = await client.searchSingleIndex({
            indexName: 'Strategies',
            searchParams: {
                hitsPerPage: hitsPerPage
            }
        });
        return result as SearchResponse;
    }

    // Get newest strategies (by creation date)
    static async getFreshStrategies(subcategoryId: string, hitsPerPage: number = 10): Promise<SearchResponse> {
        const THIRTY_DAYS = 30 * 24 * 60 * 60;
        const now = Math.floor(Date.now() / 1000);
        const minCreatedAt = now - THIRTY_DAYS;

        const result = await client.searchSingleIndex({
            indexName: 'Strategies',
            searchParams: {
                filters: `CreatedAt >= ${minCreatedAt}`,
                hitsPerPage: hitsPerPage
            }
        });
        return result as SearchResponse;
    }

    // Get diversified strategies (more than 10 tickers in allocation)
    static async getDiversifiedStrategies(subcategoryId: string, hitsPerPage: number = 10): Promise<SearchResponse> {
        const result = await client.searchSingleIndex({
            indexName: 'Strategies',
            searchParams: {
                filters: `numberOfTickers >= 10`,
                hitsPerPage: hitsPerPage
            }
        });
        return result as SearchResponse;
    }

    static async getSimilarPortfolios(externalId: string, hitsPerPage = 20): Promise<any> {
        // 1) Buscar o portfolio base
        const baseRes = await client.searchSingleIndex({
            indexName: 'Strategies',
            searchParams: {
                query: externalId,
                hitsPerPage: 1
            }
        });

        const base = baseRes.hits[0] as any;
        if (!base) return { 
                hits: [],
                nbHits: 0,
                page: 0,
                nbPages: 0,
                hitsPerPage: 0,
                processingTimeMS: 0,
                exhaustiveNbHits: false,
                query: '',
                params: ''
            }

        // 2) Extrair componentes principais de similaridade
        const similarTags = base.tags || [];

        // pegar top 3 tickers mais pesados
        const tickers = (base.currentAllocation || [])
            .sort((a: any, b: any) => b.fraction - a.fraction)
            .slice(0, 3)
            .map((x: any) => x.ticker);

        // calcular faixa de retorno para manter mesmo perfil
        const minReturn = base.lastMonthReturns - 0.05;
        const maxReturn = base.lastMonthReturns + 0.05;

        // 3) Construir query de similaridade
        const search = await client.searchSingleIndex({
            indexName: 'Strategies',
            searchParams: {
                hitsPerPage: hitsPerPage,
                optionalFilters: [
                    ...similarTags.map((tag: any) => `tags:${tag}`),
                    ...tickers.map((t: any) => `currentAllocation.ticker:${t}`)
                ],
                filters: `lastMonthReturns >= ${minReturn} AND lastMonthReturns <= ${maxReturn}`,
                relevancyStrictness: 60
            }
        });

        // 4) Remover o próprio portfolio da lista
        const filtered = search.hits.filter((p: any) => p.ExternalId !== externalId);
        return filtered;
    }

    // Get long time in market strategies (CreatedAt > 1 year ago)
    static async getLongTimeInMarketStrategies(subcategoryId: string, hitsPerPage: number = 10): Promise<SearchResponse> {
        const ONE_YEAR = 365 * 24 * 60 * 60;
        const now = Math.floor(Date.now() / 1000);
        const maxCreatedAt = now - ONE_YEAR;

        const result = await client.searchSingleIndex({
            indexName: 'Strategies',
            searchParams: {
                filters: `CreatedAt <= ${maxCreatedAt}`,
                hitsPerPage: hitsPerPage
            }
        });
        return result as SearchResponse;
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
            historicalReturns: strategy.historicalReturns,
            profileImage: strategy.ProfileImageUrl ?? 'https://d1vuy7y9jvyriv.cloudfront.net/portfolios/default/default.png'
        };
    }
}