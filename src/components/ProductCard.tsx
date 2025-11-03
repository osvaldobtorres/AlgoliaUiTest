import React from 'react';
import { useNavigate } from 'react-router-dom';
import { InvestmentProduct } from '../types/investment';
import './ProductCard.css';

interface ProductCardProps {
  product: any;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();

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

  // Handle card click with portfolio metrics
  const handleCardClick = () => {
    // Generate realistic capital based on copiers count
    const mockCapitalValue = product.copiesCount 
      ? (product.copiesCount * (Math.random() * 3000 + 500)) // 500-3500 per copier
      : (Math.random() * 50000000) + 1000000; // $1M to $51M fallback

    const portfolioMetrics = {
      thirtyDayReturn: product.lastMonthReturns ? (product.lastMonthReturns * 100) : ((Math.random() * 10) - 2),
      allTimeReturn: product.totalReturns ? (product.totalReturns * 100) : ((Math.random() * 150) + 50),
      totalCopiers: product.copiesCount || Math.floor(Math.random() * 5000) + 1000,
      totalCapital: product.totalCapital || formatCapital(mockCapitalValue),
      // Pass the product data as well
      productData: {
        name: product.name,
        ticker: product.ticker,
        description: product.description,
        profileImage: product.profileImage,
        historicalReturns: product.historicalReturns
      }
    };

    navigate(`/portfolio/${product.externalId}`, { 
      state: { portfolioMetrics }
    });
  };

  // Generate mock data inspired by the reference design
  const generateTicker = (name: string) => {
    // Extract ticker-like abbreviation from name
    if (name.includes('ETF') || name.includes('Fund')) {
      return name.split(' ')[0].toUpperCase().slice(0, 4);
    }
    return name.split(' ')[0].toUpperCase().slice(0, 4);
  };

  const generatePerformance = () => {
    // Generate random performance between -2% and +10%
    const performance = (Math.random() * 12 - 2).toFixed(1);
    return performance;
  };

  const generateCopiers = () => {
    // Generate random number of copiers between 100-2500
    return Math.floor(Math.random() * 2400) + 100;
  };

  const getPerformanceColor = (perf: string) => {
    return parseFloat(perf) >= 0 ? '#38e07b' : '#ef4444';
  };

  // Generate image placeholder based on category
  const getImagePlaceholder = (category: string) => {
    const colors = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#6366F1'];
    const colorIndex = category.length % colors.length;
    return colors[colorIndex];
  };

  const ticker = generateTicker(product.name);
  const performance = generatePerformance();
  const copiers = generateCopiers();
  const imageColor = getImagePlaceholder(product.category);

  // Determine chart color based on overall performance trend
  const getChartColor = () => {
    return '#38e07b';
  };

  // Generate SVG path using real historical returns
  const generateChartPath = () => {
    const returns = product.historicalReturns;
    
    // If no historical data, use fallback
    if (!returns || !Array.isArray(returns) || returns.length === 0) {
      const points = [];
      for (let i = 0; i <= 6; i++) {
        const x = (i * 184) / 6;
        const y = 2 + Math.random() * 42;
        points.push(`${i === 0 ? 'M' : 'L'}${x} ${y}`);
      }
      return points.join(' ');
    }

    // Normalize returns data to fit in chart area (0-46px height)
    const minReturn = Math.min(...returns);
    const maxReturn = Math.max(...returns);
    const range = maxReturn - minReturn;
    
    const points = returns.map((returnValue, index) => {
      const x = (index * 184) / Math.max(returns.length - 1, 1);
      // Invert Y axis (0 at top, 46 at bottom) and normalize
      const normalizedY = range === 0 ? 23 : (maxReturn - returnValue) / range;
      const y = 2 + (normalizedY * 42); // 2px margin top, 42px usable height
      
      return `${index === 0 ? 'M' : 'L'}${x} ${y}`;
    });
    
    return points.join(' ');
  };

  return (
    <div className="product-card" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
      <div className="card-container">
        {/* Header with title and ticker */}
        <div className="card-header">
          <p className="card-title">{product.name}</p>
          <span className="card-ticker">{product.ticker}</span>
        </div>

        {/* Content with icon and description */}
        <div className="card-content">
          <img 
            className="card-icon"
            src={product.profileImage}
            alt={product.name}
          />
          <p className="card-description">{product.description}</p>
        </div>

        {/* Metrics */}
        <div className="card-metrics">
          <div className="metric-item">
            <span 
              className="performance-value"
              style={{ color: getPerformanceColor(product.lastMonthReturns) }}
            >
              {parseFloat(product.lastMonthReturns) * 100 >= 0 ? '+' : ''}{(product.lastMonthReturns * 100).toFixed(2)}%
            </span>
            <span className="metric-label">30D returns</span>
          </div>
          <div className="metric-item">
            <span className="copiers-value">{product.copiesCount ?? 0}</span>
            <span className="metric-label">copiers</span>
          </div>
        </div>

        {/* Evolution Chart */}
        <div className="card-evolution">
          <p className="evolution-label">YTD Evolution</p>
          <div className="evolution-chart">
            <svg className="chart-svg" fill="none" preserveAspectRatio="none">
              <path
                d={generateChartPath()}
                stroke={getChartColor()}
                strokeLinecap="round"
                strokeWidth="2"
              />
              {/* Add data points for better visualization */}
              {product.historicalReturns && product.historicalReturns.length > 0 && 
                product.historicalReturns.map((returnValue: number, index: number) => {
                  const x = (index * 184) / Math.max(product.historicalReturns.length - 1, 1);
                  const minReturn = Math.min(...product.historicalReturns);
                  const maxReturn = Math.max(...product.historicalReturns);
                  const range = maxReturn - minReturn;
                  const normalizedY = range === 0 ? 23 : (maxReturn - returnValue) / range;
                  const y = 2 + (normalizedY * 42);
                  
                  return (
                    <circle
                      key={index}
                      cx={x}
                      cy={y}
                      r="1.5"
                      fill={getChartColor()}
                      opacity="0.8"
                    />
                  );
                })
              }
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;