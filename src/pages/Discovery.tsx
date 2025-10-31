import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { categories } from '../data/mockData';
import './Discovery.css';

const Discovery: React.FC = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    const handleCategoryClick = (categoryId: string) => {
        navigate(`/category/${categoryId}`);
    };

    return (
        <div className="discovery-page">
            {/* Search bar */}
            <div className="discovery-search">
                <input
                    type="text"
                    className="search-bar"
                    placeholder="Search portfolios"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Header */}
            <div className="discovery-header">
                <div className="powered-by">
                    POWERED BY DUB
                </div>
                <h1 className="discovery-title">Discover Core Creators.</h1>
                <p className="discovery-subtitle">
                    Your foundation for copy-trading: find rising talent & hidden gems before they go Premium—no fees.
                </p>
            </div>

            {/* Action buttons */}
            <div className="action-buttons">
                <button className="action-button">
                    <h3>
                        Create a dub Portfolio
                        <span className="action-arrow">›</span>
                    </h3>
                </button>
                <button className="action-button">
                    <h3>
                        What are Copy Credits?
                        <span className="action-arrow">›</span>
                    </h3>
                </button>
            </div>

            {/* Categories */}
            <div className="categories-section">
                <h2>Categories</h2>
                <div className="portfolio-grid">
                    {categories.map((category) => (
                        <div
                            key={category.id}
                            className="action-button"
                            onClick={() => handleCategoryClick(category.id)}
                        >
                            <h3>
                                {category.name}
                                <span className="action-arrow">›</span>
                            </h3>
                        </div>
                    ))}
                </div>
            </div>

            <div className="categories-section">
                <h2>Dub AI</h2>
                <div className="portfolio-grid huge-grid">
                    <div
                        className="action-button"
                        onClick={() => console.log('Clicked')}
                    >
                        <h3>
                            Talk to Dub AI
                            <span className="action-arrow">›</span>
                        </h3>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Discovery;