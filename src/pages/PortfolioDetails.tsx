import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { ArrowLeft, Users, Copy } from 'lucide-react';
import { investmentProducts } from '../data/mockData';
import ProductCard from '../components/ProductCard';
import BlueApiService, { BluePortfolioData, BlueHistoricalData, Equity } from '../services/blueApiService';
import './PortfolioDetails.css';
import { AlgoliaService } from '../services/algoliaService';

interface Asset {
    ticker: string;
    name: string;
    sector: string;
    allocation: number;
}

interface CopierProfile {
    id: string;
    name: string;
    avatar: string;
    copiedAmount: string;
    joinedDate: string;
}

const PortfolioDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const [portfolioData, setPortfolioData] = useState<BluePortfolioData | null>(null);
    const [historicalData, setHistoricalData] = useState<BlueHistoricalData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [similarPortfolios, setSimilarPortfolios] = useState<any[]>([]);
    const [loadingSimilar, setLoadingSimilar] = useState(false);

    const portfolio = investmentProducts.find(p => p.id === id);

    // Fetch portfolio data from Blue API and similar portfolios from Algolia
    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;

            try {
                setLoading(true);
                setError(null);

                // Fetch portfolio data from Blue API
                const data = await BlueApiService.getPortfolioById(id);
                setPortfolioData(data);

                // Fetch historical data from Blue API
                try {
                    const histData = await BlueApiService.getPortfolioHistoricalData(id);
                    setHistoricalData(histData);
                } catch (histError) {
                    console.error('Error fetching portfolio historical data:', histError);
                    // Continue without historical data if they fail to load
                }

                // Fetch similar portfolios from Algolia
                setLoadingSimilar(true);
                const similarData = await AlgoliaService.getSimilarPortfolios(id);
                setSimilarPortfolios(similarData || []);
            } catch (err) {
                console.error('Error fetching portfolio data:', err);
                setError('Failed to load portfolio data');
            } finally {
                setLoading(false);
                setLoadingSimilar(false);
            }
        };

        fetchData();
    }, [id]);

    const handleGoBack = () => {
        navigate(-1);
    };

    if (loading) {
        return (
            <div className="portfolio-details">
                <div className="portfolio-header">
                    <button className="back-button" onClick={handleGoBack}>
                        <ArrowLeft size={20} />
                    </button>
                    <h1>Loading...</h1>
                </div>
            </div>
        );
    }

    if (error || (!portfolioData && !portfolio)) {
        return (
            <div className="portfolio-details">
                <div className="portfolio-header">
                    <button className="back-button" onClick={handleGoBack}>
                        <ArrowLeft size={20} />
                    </button>
                    <h1>{error || 'Portfolio not found'}</h1>
                </div>
            </div>
        );
    }

    // Convert Blue API data to our Asset format
    const portfolioAssets: Asset[] = portfolioData ?
        portfolioData.currentAllocation.equities.map(equity => ({
            ticker: equity.instrumentDto.ticker,
            name: equity.instrumentDto.companyName,
            sector: equity.instrumentDto.sector || 'Unknown',
            allocation: parseFloat(equity.fraction) * 100 // Convert fraction to percentage
        })).sort((a, b) => b.allocation - a.allocation) // Sort by allocation descending
        : [];

    // Mock portfolios copied by same users (fallback to existing logic)
    const relatedPortfolios = investmentProducts.filter(p =>
        portfolio && p.id !== portfolio.id
    ).slice(0, 4);

    // Mock copier profiles
    const copiers: CopierProfile[] = [
        { id: '1', name: 'John Silva', avatar: '👨‍💼', copiedAmount: '$12.5K', joinedDate: '2 months' },
        { id: '2', name: 'Maria Santos', avatar: '👩‍💼', copiedAmount: '$8.9K', joinedDate: '1 month' },
        { id: '3', name: 'Peter Costa', avatar: '👨‍🎓', copiedAmount: '$15.2K', joinedDate: '3 weeks' },
        { id: '4', name: 'Ana Oliveira', avatar: '👩‍🔬', copiedAmount: '$6.7K', joinedDate: '1 week' }
    ];

    // Format capital with elegant rules: 3M, 220K, 1.2K, $9.5K
    const formatCapital = (value: number): string => {
        if (value >= 1000000) {
            // Above 1M: show with 2 decimals if < 10M, no decimals if >= 10M
            const millions = value / 1000000;
            return millions >= 10
                ? `$${Math.round(millions)}M`
                : `$${millions.toFixed(2)}M`;
        } else if (value >= 10000) {
            // 10K to 1M: whole numbers only (220K, 55K)
            return `$${Math.round(value / 1000)}K`;
        } else if (value >= 1000) {
            // 1K to 10K: show decimals (1.2K, 9.5K)
            return `$${(value / 1000).toFixed(1)}K`;
        } else {
            // Below 1K: show whole dollars
            return `$${Math.round(value)}`;
        }
    };

    // Generate portfolio metrics using data from ProductCard navigation or mock data
    const generateMetrics = () => {
        // First priority: data passed from ProductCard navigation
        const passedMetrics = location.state?.portfolioMetrics;
        if (passedMetrics) {
            return {
                thirtyDayReturn: passedMetrics.thirtyDayReturn,
                allTimeReturn: passedMetrics.allTimeReturn,
                totalCopiers: passedMetrics.totalCopiers,
                totalCapital: formatCapital(passedMetrics.totalCapital) // Already formatted from ProductCard
            };
        }

        // Fallback to mock data
        const thirtyDayReturn = ((Math.random() * 10) - 2); // -2% to 8%
        const allTimeReturn = ((Math.random() * 150) + 50); // 50% to 200%
        const totalCopiers = Math.floor(Math.random() * 5000) + 1000; // 1K to 6K
        const mockCapital = (Math.random() * 50000000) + 1000000; // $1M to $51M

        return {
            thirtyDayReturn,
            allTimeReturn,
            totalCopiers,
            totalCapital: formatCapital(mockCapital)
        };
    };

    const metrics = generateMetrics();

    // Generate YTD chart path like ProductCard
    const generateYTDChartPath = () => {
        if (historicalData && historicalData.strategyHistoricalData && historicalData.strategyHistoricalData.close && historicalData.strategyHistoricalData.close.length > 0) {
            const closedData = historicalData.strategyHistoricalData.close;

            // Find min and max values for normalization like ProductCard
            const minValue = Math.min(...closedData);
            const maxValue = Math.max(...closedData);
            const range = maxValue - minValue;

            const points = closedData.map((value, index) => {
                const x = (index * 100) / Math.max(closedData.length - 1, 1); // Use 100% width
                // Normalize and invert Y like ProductCard (0 at top, 46 at bottom)
                const normalizedY = range === 0 ? 23 : (maxValue - value) / range;
                const y = 2 + (normalizedY * 42); // Same as ProductCard: 2px margin, 42px usable

                return `${index === 0 ? 'M' : 'L'}${x} ${y}`;
            });

            return points.join(' ');
        }

        // Fallback to mock data like ProductCard
        const points = [];
        for (let i = 0; i <= 6; i++) {
            const x = (i * 100) / 6;
            const y = 2 + Math.random() * 42;
            points.push(`${i === 0 ? 'M' : 'L'}${x} ${y}`);
        }
        return points.join(' ');
    };

    const getYTDChartColor = () => {
        return '#38e07b';
    };

    // Calculate performance using real data when available
    const currentPerformance = (() => {
        if (historicalData && historicalData.strategyHistoricalData && historicalData.strategyHistoricalData.close && historicalData.strategyHistoricalData.close.length > 0) {
            const closedData = historicalData.strategyHistoricalData.close;
            const firstValue = closedData[0];
            const lastValue = closedData[closedData.length - 1];
            return ((lastValue - firstValue) / firstValue) * 100;
        }
        // Fallback to mock calculation
        return ((Math.random() * 10) - 2);
    })();

    const pathData = generateYTDChartPath();

    return (
        <div className="portfolio-details">
            {/* Header */}
            <div className="portfolio-header">
                <button className="back-button" onClick={handleGoBack}>
                    <ArrowLeft size={20} />
                </button>
                <div className='portfolio-info-aux-container'>
                    <img className="card-icon" src={portfolioData?.strategyInfo?.profileImageUrl ?? ''} />
                    <div className="portfolio-info">
                        <div className="portfolio-main-info">
                            <h1 className="portfolio-name">
                                {portfolioData ? portfolioData.strategyInfo.strategyName : (portfolio?.name || 'Unknown Portfolio')}
                            </h1>
                            <span className="portfolio-ticker">
                                {portfolioData ? portfolioData.strategyInfo.tickerName : (portfolio?.ticker || 'PORTFOLIO')}
                            </span>
                        </div>
                        <p className="portfolio-description">
                            {portfolioData?.strategyInfo?.strategyTagline}
                        </p>
                    </div>
                </div>
            </div>

            <div className="strategy-description-container">
                <p className="discovery-subtitle">
                    {`${portfolioData?.strategyInfo?.strategyDescription}`}
                </p>
            </div>

            {/* Portfolio Metrics */}
            <div className="portfolio-metrics">
                <div className="metrics-grid">
                    <div className="metric-card">
                        <div className="metric-value">
                            <span className={metrics.thirtyDayReturn >= 0 ? 'positive' : 'negative'}>
                                {metrics.thirtyDayReturn >= 0 ? '+' : ''}{metrics.thirtyDayReturn.toFixed(2)}%
                            </span>
                        </div>
                        <div className="metric-label">30D Returns</div>
                    </div>

                    <div className="metric-card">
                        <div className="metric-value">
                            <span className={metrics.allTimeReturn >= 0 ? 'positive' : 'negative'}>
                                {metrics.allTimeReturn >= 0 ? '+' : ''}{metrics.allTimeReturn.toFixed(2)}%
                            </span>
                        </div>
                        <div className="metric-label">All Time Returns</div>
                    </div>

                    <div className="metric-card">
                        <div className="metric-value">{metrics.totalCopiers.toLocaleString()}</div>
                        <div className="metric-label">Total Copiers</div>
                    </div>

                    <div className="metric-card">
                        <div className="metric-value">{metrics.totalCapital}</div>
                        <div className="metric-label">Total Capital</div>
                    </div>
                </div>

                <p className="discovery-subtitle" style={{paddingTop: 10}}>
                    {`Inception Date: ${new Date(portfolioData?.strategyInfo?.inceptionDate ?? '').toLocaleDateString()}`}
                </p>
            </div>

            {/* YTD Performance Chart */}
            <div className="ytd-section">
                <div className="ytd-header">
                    <h2>YTD Performance</h2>
                </div>
                <div className="ytd-chart">
                    <svg width="100%" height="200" viewBox="0 0 100 46" preserveAspectRatio="xMidYMid meet">
                        {/* Main line - clean without points */}
                        <path
                            d={pathData}
                            fill="none"
                            stroke={getYTDChartColor()}
                            strokeLinecap="round"
                            strokeWidth="1"
                            vectorEffect="non-scaling-stroke"
                        />
                    </svg>
                </div>
            </div>

            {/* Portfolio Breakdown */}
            <div className="breakdown-section">
                <h2>Portfolio Composition</h2>
                <div className="assets-list">
                    {portfolioAssets.length > 0 ? (
                        portfolioAssets.map((asset, index) => (
                            <div key={asset.ticker} className="asset-item">
                                <div className="asset-info">
                                    <div className="asset-main">
                                        <span className="asset-ticker">{asset.ticker}</span>
                                        <span className="asset-name">{asset.name}</span>
                                    </div>
                                    <span className="asset-sector">{asset.sector}</span>
                                </div>
                                <div className="asset-allocation">
                                    <span className="allocation-percentage">{asset.allocation.toFixed(1)}%</span>
                                    <div className="allocation-bar">
                                        <div
                                            className="allocation-fill"
                                            style={{ width: `${Math.min(asset.allocation, 100)}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No portfolio composition data available.</p>
                    )}
                </div>
            </div>

            {/* Similar Portfolios */}
            <div className="similar-section">
                <h2>Similar Portfolios</h2>
                <div className="horizontal-scroll">
                    {loadingSimilar ? (
                        <p>Loading similar portfolios...</p>
                    ) : similarPortfolios.length > 0 ? (
                        similarPortfolios.map(portfolio => {
                            // Transform Algolia data to match ProductCard expected format
                            const transformedProduct = {
                                id: portfolio.ExternalId,
                                name: portfolio.StrategyName,
                                ticker: portfolio.StrategyTicker,
                                description: portfolio.StrategyTagline,
                                category: portfolio.tags?.[0] || 'general',
                                lastMonthReturns: portfolio.lastMonthReturns || 0,
                                copiesCount: portfolio.copiesCount || 0,
                                profileImage: portfolio.ProfileImageUrl,
                                historicalReturns: portfolio.historicalReturns || [],
                                totalReturns: portfolio.totalReturns,
                                totalCapital: portfolio.totalCapital
                            };

                            return (
                                <ProductCard key={portfolio.ExternalId} product={transformedProduct} />
                            );
                        })
                    ) : (
                        <p>No similar portfolios found.</p>
                    )}
                </div>
            </div>

            {/* Related Portfolios */}
            <div className="related-section">
                <div className="related-header">
                    <h2>People who copied this also copied</h2>
                </div>
                <div className="horizontal-scroll">
                    {relatedPortfolios.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PortfolioDetails;