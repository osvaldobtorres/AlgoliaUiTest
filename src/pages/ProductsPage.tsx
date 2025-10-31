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

  useEffect(() => {
    const loadStrategies = async () => {
      if (!subCategoryId) return;

      try {
        setLoading(true);
        setError(null);

        // Get strategies by subcategory
        const response = await AlgoliaService.getStrategiesBySubcategory(subCategoryId, 50);
        
        if (response.hits.length === 0) {
          // If no results for specific subcategory, get by main category
          const mainCategory = subCategoryId.split('::')[0];
          const fallbackResponse = await AlgoliaService.getStrategiesByCategory(mainCategory, 50);
          
          if (fallbackResponse.hits.length > 0) {
            // Group by sector/theme
            const grouped = groupStrategiesByType(fallbackResponse.hits);
            setProductGroups(grouped);
          } else {
            setProductGroups([]);
          }
        } else {
          // Group the results
          const grouped = groupStrategiesByType(response.hits);
          setProductGroups(grouped);
        }
      } catch (err) {
        console.error('Error loading strategies:', err);
        setError('Failed to load strategies');
      } finally {
        setLoading(false);
      }
    };

    loadStrategies();
  }, [subCategoryId]);

  const groupStrategiesByType = (strategies: AlgoliaStrategy[]): ProductGroup[] => {
    const groups: { [key: string]: AlgoliaStrategy[] } = {};
    
    strategies.forEach(strategy => {
      // Group by primary tag or sector
      const primaryTag = strategy.tags.find(tag => 
        tag.includes('sector:') || tag.includes('thesis:') || tag.includes('stage:')
      );
      
      const groupKey = primaryTag 
        ? primaryTag.replace(/[_:]/g, ' ').replace(/^\w/, c => c.toUpperCase())
        : 'Other Strategies';
      
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(strategy);
    });

    return Object.entries(groups).map(([title, strategies]) => ({
      title,
      strategies: strategies.slice(0, 10) // Limit per group
    }));
  };

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
                    <Link 
                      key={strategy.Id} 
                      to={`/portfolio/${strategy.Id}`}
                      style={{ textDecoration: 'none' }}
                    >
                      <ProductCard product={convertedProduct} />
                    </Link>
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