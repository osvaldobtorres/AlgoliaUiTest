import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Discovery from './pages/Discovery';
import SubCategories from './pages/SubCategories';
import ProductsPage from './pages/ProductsPage';
import PortfolioDetails from './pages/PortfolioDetails';
import BottomNavigation from './components/BottomNavigation';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Discovery />} />
          <Route path="/category/:categoryId" element={<SubCategories />} />
          <Route path="/products/:subCategoryId" element={<ProductsPage />} />
          <Route path="/portfolio/:id" element={<PortfolioDetails />} />
          {/* Placeholder routes for navigation */}
          <Route path="/core" element={<Discovery />} />
          <Route path="/premium" element={<div style={{padding: '40px 20px', textAlign: 'center'}}>Premium features coming soon...</div>} />
          <Route path="/leaderboard" element={<div style={{padding: '40px 20px', textAlign: 'center'}}>Leaderboard coming soon...</div>} />
          <Route path="/activity" element={<div style={{padding: '40px 20px', textAlign: 'center'}}>Activity feed coming soon...</div>} />
        </Routes>
        <BottomNavigation />
      </div>
    </Router>
  );
}

export default App;
