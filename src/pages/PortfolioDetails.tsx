import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, TrendingUp, Users, Copy } from 'lucide-react';
import { investmentProducts } from '../data/mockData';
import ProductCard from '../components/ProductCard';
import './PortfolioDetails.css';

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

    const portfolio = investmentProducts.find(p => p.id === id);

    if (!portfolio) {
        return (
            <div className="portfolio-details">
                <div className="portfolio-header">
                    <Link to="/products" className="back-button">
                        <ArrowLeft size={20} />
                    </Link>
                    <h1>Portfolio not found</h1>
                </div>
            </div>
        );
    }

    // Mock data for portfolio breakdown
    const portfolioAssets: Asset[] = [
        { ticker: 'AAPL', name: 'Apple Inc.', sector: 'Technology', allocation: 15.2 },
        { ticker: 'MSFT', name: 'Microsoft Corp.', sector: 'Technology', allocation: 12.8 },
        { ticker: 'NVDA', name: 'NVIDIA Corp.', sector: 'Technology', allocation: 10.5 },
        { ticker: 'GOOGL', name: 'Alphabet Inc.', sector: 'Technology', allocation: 9.3 },
        { ticker: 'AMZN', name: 'Amazon.com Inc.', sector: 'Consumer Discretionary', allocation: 8.7 },
        { ticker: 'TSLA', name: 'Tesla Inc.', sector: 'Consumer Discretionary', allocation: 7.9 },
        { ticker: 'META', name: 'Meta Platforms', sector: 'Technology', allocation: 6.8 },
        { ticker: 'BRK.B', name: 'Berkshire Hathaway', sector: 'Financial Services', allocation: 5.4 },
        { ticker: 'V', name: 'Visa Inc.', sector: 'Financial Services', allocation: 4.7 },
        { ticker: 'JNJ', name: 'Johnson & Johnson', sector: 'Healthcare', allocation: 4.2 }
    ];

    // Mock similar portfolios
    const similarPortfolios = investmentProducts.filter(p =>
        p.id !== portfolio.id && p.category === portfolio.category
    ).slice(0, 4);

    // Mock portfolios copied by same users
    const relatedPortfolios = investmentProducts.filter(p =>
        p.id !== portfolio.id
    ).slice(0, 4);

    // Mock copier profiles
    const copiers: CopierProfile[] = [
        { id: '1', name: 'John Silva', avatar: '👨‍💼', copiedAmount: '$12.5K', joinedDate: '2 months' },
        { id: '2', name: 'Maria Santos', avatar: '👩‍💼', copiedAmount: '$8.9K', joinedDate: '1 month' },
        { id: '3', name: 'Peter Costa', avatar: '👨‍🎓', copiedAmount: '$15.2K', joinedDate: '3 weeks' },
        { id: '4', name: 'Ana Oliveira', avatar: '👩‍🔬', copiedAmount: '$6.7K', joinedDate: '1 week' }
    ];

    // Generate portfolio metrics
    const generateMetrics = () => {
        const thirtyDayReturn = ((Math.random() * 10) - 2).toFixed(2); // -2% to 8%
        const allTimeReturn = ((Math.random() * 150) + 50).toFixed(2); // 50% to 200%
        const totalCopiers = Math.floor(Math.random() * 5000) + 1000; // 1K to 6K
        const totalCapital = (Math.random() * 50 + 10).toFixed(1); // $10M to $60M

        return {
            thirtyDayReturn: parseFloat(thirtyDayReturn),
            allTimeReturn: parseFloat(allTimeReturn),
            totalCopiers,
            totalCapital: `$${totalCapital}M`
        };
    };

    const metrics = generateMetrics();

    // Generate YTD chart data
    const generateYTDData = () => {
        const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out'];
        const points = [];
        let currentValue = 100;

        for (let i = 0; i < months.length; i++) {
            const change = (Math.random() - 0.3) * 8; // Slight upward bias
            currentValue += change;
            points.push({
                x: (i / (months.length - 1)) * 100,
                y: ((120 - currentValue) / 40) * 100,
                value: currentValue
            });
        }

        return points;
    };

    const ytdData = generateYTDData();
    const currentPerformance = ytdData[ytdData.length - 1].value - 100;
    const pathData = ytdData.map((point, index) =>
        `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
    ).join(' ');

    return (
        <div className="portfolio-details">
            {/* Header */}
            <div className="portfolio-header">
                <Link to="/products" className="back-button">
                    <ArrowLeft size={20} />
                </Link>
                <div className="portfolio-info">
                    <div className="portfolio-main-info">
                        <h1 className="portfolio-name">{portfolio.name}</h1>
                        <span className="portfolio-ticker">{portfolio.ticker || 'PORTFOLIO'}</span>
                    </div>
                    <p className="portfolio-description">{portfolio.description}</p>
                </div>
            </div>

            <div className="strategy-description-container">
                <p className="discovery-subtitle">
                    Description Here
                </p>
            </div>

            {/* Portfolio Metrics */}
            <div className="portfolio-metrics">
                <div className="metrics-grid">
                    <div className="metric-card">
                        <div className="metric-value">
                            <span className={metrics.thirtyDayReturn >= 0 ? 'positive' : 'negative'}>
                                {metrics.thirtyDayReturn >= 0 ? '+' : ''}{metrics.thirtyDayReturn}%
                            </span>
                        </div>
                        <div className="metric-label">30D Returns</div>
                    </div>

                    <div className="metric-card">
                        <div className="metric-value positive">
                            +{metrics.allTimeReturn}%
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
            </div>

            {/* YTD Performance Chart */}
            <div className="ytd-section">
                <div className="ytd-header">
                    <h2>YTD Performance</h2>
                    <div className="ytd-performance">
                        <span className={`performance-value ${currentPerformance >= 0 ? 'positive' : 'negative'}`}>
                            {currentPerformance >= 0 ? '+' : ''}{currentPerformance.toFixed(2)}%
                        </span>
                        <TrendingUp size={16} className="trend-icon" />
                    </div>
                </div>
                <div className="ytd-chart">
                    <svg width="100%" height="200" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <defs>
                            <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="rgba(56, 224, 123, 0.3)" />
                                <stop offset="100%" stopColor="rgba(56, 224, 123, 0.05)" />
                            </linearGradient>
                        </defs>

                        {/* Grid lines */}
                        <g stroke="rgba(255,255,255,0.1)" strokeWidth="0.5">
                            {[25, 50, 75].map(y => (
                                <line key={y} x1="0" y1={y} x2="100" y2={y} />
                            ))}
                        </g>

                        {/* Area under curve */}
                        <path
                            d={`${pathData} L 100 100 L 0 100 Z`}
                            fill="url(#chartGradient)"
                        />

                        {/* Main line */}
                        <path
                            d={pathData}
                            fill="none"
                            stroke="#38e07b"
                            strokeWidth="2"
                            vectorEffect="non-scaling-stroke"
                        />

                        {/* Data points */}
                        {ytdData.map((point, index) => (
                            <circle
                                key={index}
                                cx={point.x}
                                cy={point.y}
                                r="1.5"
                                fill="#38e07b"
                                vectorEffect="non-scaling-stroke"
                            />
                        ))}
                    </svg>
                </div>
            </div>

            {/* Portfolio Breakdown */}
            <div className="breakdown-section">
                <h2>Portfolio Composition</h2>
                <div className="assets-list">
                    {portfolioAssets.map((asset, index) => (
                        <div key={asset.ticker} className="asset-item">
                            <div className="asset-info">
                                <div className="asset-main">
                                    <span className="asset-ticker">{asset.ticker}</span>
                                    <span className="asset-name">{asset.name}</span>
                                </div>
                                <span className="asset-sector">{asset.sector}</span>
                            </div>
                            <div className="asset-allocation">
                                <span className="allocation-percentage">{asset.allocation}%</span>
                                <div className="allocation-bar">
                                    <div
                                        className="allocation-fill"
                                        style={{ width: `${(asset.allocation / 20) * 100}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Similar Portfolios */}
            <div className="similar-section">
                <h2>Similar Portfolios</h2>
                <div className="horizontal-scroll">
                    {similarPortfolios.map(product => (
                        <Link key={product.id} to={`/portfolio/${product.id}`}>
                            <ProductCard product={product} />
                        </Link>
                    ))}
                </div>
            </div>

            {/* Related Portfolios */}
            <div className="related-section">
                <div className="related-header">
                    <h2>People who copied this also copied</h2>
                </div>
                <div className="horizontal-scroll">
                    {relatedPortfolios.map(product => (
                        <Link key={product.id} to={`/portfolio/${product.id}`}>
                            <ProductCard product={product} />
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PortfolioDetails;