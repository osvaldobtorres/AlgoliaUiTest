import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { categories, subCategories } from '../data/mockData';
import './SubCategories.css';

const SubCategories: React.FC = () => {
    const { categoryId } = useParams<{ categoryId: string }>();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const category = categories.find(p => p.id === categoryId);
    const categorySubCategories = subCategories.filter(sub => sub.categoryId === categoryId);

    if (!category) {
        return <div>Category not found</div>;
    }

    const handleSubCategoryClick = (subCategoryId: string) => {
        navigate(`/products/${subCategoryId}`);
    };

    const handleBackClick = () => {
        navigate('/');
    };

    return (
        <div className="subcategories-page">
            <div className="subcategories-header">
                <button className="back-button" onClick={handleBackClick}>
                    <span>←</span>
                </button>
                <div className="header-content">
                    <div>
                        <h1 className="page-title">{category.name}</h1>
                    </div>
                </div>
            </div>

            {/* Header */}
            <div className="discovery-header search-bar-container small-padding-top">
                <p className="discovery-subtitle">
                    {category.detailedDescription}
                </p>
            </div>

            <div className="subcategories-content">
                <div className="subcategories-grid">
                    {categorySubCategories.map((subCategory) => (
                        <div
                            key={subCategory.id}
                            className="subcategory-card"
                            onClick={() => handleSubCategoryClick(subCategory.id)}
                        >
                            <div className="subcategory-content">
                                <h3 className="subcategory-name">{subCategory.name}</h3>
                                <p className="subcategory-description">{subCategory.description}</p>
                            </div>
                            <div className="subcategory-header">
                                <div className="subcategory-arrow">
                                    <span>→</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SubCategories;