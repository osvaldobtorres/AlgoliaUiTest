import React from 'react';
import { InvestmentProduct } from '../types/investment';
import './ProductCard.css';

interface ProductCardProps {
  product: any;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
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

  // Generate SVG path for chart (more realistic looking)
  const generateChartPath = () => {
    const points = [];
    for (let i = 0; i <= 6; i++) {
      const x = (i * 184) / 6;
      const y = 2 + Math.random() * 42;
      points.push(`${i === 0 ? 'M' : 'L'}${x} ${y}`);
    }
    return points.join(' ');
  };

  console.log({product})

  return (
    <div className="product-card">
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
                stroke="#38e07b"
                strokeLinecap="round"
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;