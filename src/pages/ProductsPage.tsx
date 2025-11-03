import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { subCategories } from '../data/mockData';
import ProductCard from '../components/ProductCard';
import { AlgoliaService, AlgoliaStrategy } from '../services/algoliaService';
import './ProductsPage.css';

interface ProductGroup {
  title: string;
  strategies: AlgoliaStrategy[];
}

const ProductsPage: React.FC = () => {
  const { subCategoryId } = useParams<{ subCategoryId: string }>();
  const navigate = useNavigate();
  const [productGroups, setProductGroups] = useState<ProductGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const subCategory = subCategories.find(sub => sub.id === subCategoryId);
  const subCategoryTag = window.location.pathname.split("/").pop() ?? '';

  useEffect(() => {
    const loadStrategies = async () => {
      if (!subCategoryId) return;

      try {
        setLoading(true);
        setError(null);

        console.log('Loading strategies for subcategoryId:', subCategoryTag);
        
        const [
          trendingResponse,
          copiesResponse,
          capitalResponse,
          peakResponse,
          discoverResponse,
          freshResponse,
          diversifiedResponse,
          longTimeResponse
        ] = await Promise.all([
          AlgoliaService.getTrendingStrategies(subCategoryTag, 10),
          AlgoliaService.getStrategiesByCopies(subCategoryTag, 10),
          AlgoliaService.getStrategiesByCapital(subCategoryTag, 10),
          AlgoliaService.getRecentPeakStrategies(subCategoryTag, 10),
          AlgoliaService.getDiscoverStrategies(subCategoryTag, 10),
          AlgoliaService.getFreshStrategies(subCategoryTag, 10),
          AlgoliaService.getDiversifiedStrategies(subCategoryTag, 10),
          AlgoliaService.getLongTimeInMarketStrategies(subCategoryTag, 10)
        ]);
        
        const groups: ProductGroup[] = [];

        // Add sections with results
        if (trendingResponse.hits.length > 0) {
          groups.push({ title: 'Trending', strategies: trendingResponse.hits });
        }
        
        if (copiesResponse.hits.length > 0) {
          groups.push({ title: 'Most Copied', strategies: copiesResponse.hits });
        }
        
        if (capitalResponse.hits.length > 0) {
          groups.push({ title: 'Highest Capital', strategies: capitalResponse.hits });
        }
        
        if (peakResponse.hits.length > 0) {
          groups.push({ title: 'Recent Peak', strategies: peakResponse.hits });
        }
        
        if (discoverResponse.hits.length > 0) {
          groups.push({ title: 'Discover', strategies: discoverResponse.hits });
        }
        
        if (freshResponse.hits.length > 0) {
          groups.push({ title: 'Fresh', strategies: freshResponse.hits });
        }
        
        if (diversifiedResponse.hits.length > 0) {
          groups.push({ title: 'Diversified', strategies: diversifiedResponse.hits });
        }
        
        if (longTimeResponse.hits.length > 0) {
          groups.push({ title: 'Long Time in Market', strategies: longTimeResponse.hits });
        }

        setProductGroups(groups);
      } catch (err) {
        console.error('Error loading strategies:', err);
        setError('Failed to load strategies');
      } finally {
        setLoading(false);
      }
    };

    loadStrategies();
  }, [subCategoryId]);

  if (!subCategory) {
    return <div>Subcategory not found</div>;
  }

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleViewAll = (groupTitle: string) => {
    console.log(`View all for group: ${groupTitle}`);
  };

  return (
    <div className="products-page">
      <div className="products-header">
        <button className="back-button" onClick={handleBackClick}>
          <span>←</span>
        </button>
        <div className="header-content">
          <div>
            <h1 className="page-title">{subCategory.name}</h1>
            <p className="page-subtitle">{subCategory.description}</p>
          </div>
        </div>
      </div>

      <div className="products-content">
        {loading && (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading strategies...</p>
          </div>
        )}

        {error && (
          <div className="error-state">
            <h3>Error</h3>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && productGroups.map((group, index) => (
          <div key={index} className="category-row">
            <div className="row-header">
              <h2 className="row-title">{group.title}</h2>
              <button 
                className="view-all-button"
                onClick={() => handleViewAll(group.title)}
              >
                View All
              </button>
            </div>
            
            <div className="products-scroll">
              <div className="products-list">
                {group.strategies.map((strategy) => {
                  const convertedProduct = AlgoliaService.convertToInvestmentProduct(strategy);
                  return (
                    <ProductCard key={strategy.Id} product={convertedProduct} />
                  );
                })}
              </div>
            </div>
          </div>
        ))}

        {!loading && !error && productGroups.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">📊</div>
            <h3>No strategies found</h3>
            <p>No strategies available for this category yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;