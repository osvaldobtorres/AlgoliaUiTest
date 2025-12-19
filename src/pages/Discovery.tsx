import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { categories } from '../data/mockData';
import { ArrowLeft, TrendingUp } from 'lucide-react';
import './Discovery.css';
import { AlgoliaService } from '../services/algoliaService';

const Discovery: React.FC = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [searchResults, setSearchResults] = useState<any>([]);

    const handleCategoryClick = (categoryId: string) => {
        navigate(`/category/${categoryId}`);
    };

    const handleSearchFocus = () => {
        setIsSearchFocused(true);
    };

    const handleSearchClose = () => {
        setIsSearchFocused(false);
        setSearchQuery('');
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        if (e.target.value.length > 0 && !isSearchFocused) {
            setIsSearchFocused(true);
        }
    };

    const getSearchResults = async () => {
        const results = await AlgoliaService.search(searchQuery);
        setSearchResults(results.hits);
    }

    useEffect(() => {
        if (searchQuery.length != 0) {
            getSearchResults();
        }
    }, [searchQuery]);

    // Mock search data
    const popularSearches = [
        'Top 10 Tech',
        'Biotech Revolution'
    ];

    const matchingPortfolios = [
        {
            id: '1',
            name: 'Tech Innovators',
            ticker: 'TINV',
            avatar: '🚀'
        },
        {
            id: '2',
            name: 'Fintech Leaders',
            ticker: 'FNTC',
            avatar: '💳'
        }
    ];

    return (
        <div className="discovery-page">
            {/* Search bar */}
            <div className="discovery-search">
                <input
                    type="text"
                    className="search-bar"
                    placeholder="Search portfolios"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onFocus={handleSearchFocus}
                />
            </div>

            {/* Search Overlay */}
            {isSearchFocused && (
                <div className="search-overlay">
                    <div className="search-overlay-content">
                        {/* Search Header */}
                        <div className="search-header">
                            <button className="search-back-button" onClick={handleSearchClose}>
                                <ArrowLeft size={20} />
                            </button>
                            <input
                                type="text"
                                className="search-overlay-input"
                                placeholder="Search portfolios"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                autoFocus
                            />
                        </div>

                        {/* Search Results */}
                        <div className="search-results">
                            {/* Popular Searches */}
                            <div className="search-section">
                                <h3 className="search-section-title">Popular Searches</h3>
                                <div className="popular-searches">
                                    {popularSearches.map((search, index) => (
                                        <div key={index} className="popular-search-item">
                                            <TrendingUp size={16} className="trending-icon" />
                                            <span>{search}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Matching Portfolios */}
                            <div className="search-section">
                                <h3 className="search-section-title">Matching Portfolioss</h3>
                                <div className="matching-portfolios">
                                    {searchResults.map((portfolio: any) => (
                                        <Link
                                            to={`/portfolio/${portfolio.ExternalId}`}
                                            key={portfolio.Id}
                                            style={{ textDecoration: 'none' }}
                                        >
                                            <div className="portfolio-result">
                                                <img className="portfolio-avatar" src={portfolio.ProfileImageUrl}/>
                                                <div className="portfolio-info">
                                                    <div className="portfolio-name">{portfolio.StrategyName}</div>
                                                    <div className="portfolio-ticker">{portfolio.StrategyTicker}</div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

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
                    <h3>Create a dub Portfolio</h3>
                </button>
                <button className="action-button">
                    <h3>What are Copy Credits?</h3>
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
                            <h3>{category.name}</h3>
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
                        <h3>Talk to Dub AI</h3>
                    </div>
                </div>
            </div>

            <div className="categories-section">
                <h2>Relevant to You</h2>
                <div className="portfolio-grid huge-grid">

                </div>
            </div>

            <div className="categories-section">
                <h2>Continue Where You Left Off</h2>
                <div className="portfolio-grid huge-grid">

                </div>
            </div>

            <div className="categories-section">
                <h2>Similar to What You Copied</h2>
                <div className="portfolio-grid huge-grid">

                </div>
            </div>
        </div>
    );
};

export default Discovery;