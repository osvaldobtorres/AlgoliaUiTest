import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { subCategories, getCategoryRows } from '../data/mockData';
import ProductCard from '../components/ProductCard';
import './ProductsPage.css';

const ProductsPage: React.FC = () => {
  const { subCategoryId } = useParams<{ subCategoryId: string }>();
  const navigate = useNavigate();

  const subCategory = subCategories.find(sub => sub.id === subCategoryId);
  const categoryRows = getCategoryRows(subCategoryId!);

  if (!subCategory) {
    return <div>Subcategory not found</div>;
  }

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleViewAll = (categoryId: string) => {
    // Navigate to view all products page for category
    console.log(`View all for category: ${categoryId}`);
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
        {categoryRows.map((row) => (
          <div key={row.id} className="category-row">
            <div className="row-header">
              <h2 className="row-title">{row.title}</h2>
              <button 
                className="view-all-button"
                onClick={() => handleViewAll(row.id)}
              >
                View All
              </button>
            </div>
            
            <div className="products-scroll">
              <div className="products-list">
                {row.products.map((product) => (
                  <Link 
                    key={product.id} 
                    to={`/portfolio/${product.id}`}
                    style={{ textDecoration: 'none' }}
                  >
                    <ProductCard product={product} />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ))}

        {categoryRows.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">📊</div>
            <h3>No products found</h3>
            <p>Products for this category will be added soon.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;