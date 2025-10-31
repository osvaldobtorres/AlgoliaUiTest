import { Category, SubCategory, InvestmentProduct, CategoryRow } from '../types/investment';

export const categories: Category[] = [
  {
    id: 'sector',
    name: 'Sector',
    icon: '🏭',
    description: 'Dominant Economic Sectors',
    detailedDescription: 'Used to identify the structural economic theme of the portfolio. This category helps you understand which economic sectors will drive the performance of your investments.',
    color: '#3B82F6'
  },
  {
    id: 'thesis',
    name: 'Thesis',
    icon: '�',
    description: 'Core Investment Narrative',
    detailedDescription: 'This is the layer that explains why the portfolio exists. It represents the central investment hypothesis and the fundamental reasoning behind the strategy.',
    color: '#8B5CF6'
  },
  {
    id: 'stage',
    name: 'Stage',
    icon: '📈',
    description: 'Thesis Maturity Phase',
    detailedDescription: 'Used to convey the maturity profile of assets without explicitly discussing risk. This helps understand whether investments are in early, growth, or mature phases.',
    color: '#10B981'
  },
  {
    id: 'geo',
    name: 'Geo',
    icon: '🌍',
    description: 'Geographic Exposure',
    detailedDescription: 'Defines where value comes from, not just where the company is listed. This category focuses on the geographical sources of revenue and economic exposure.',
    color: '#F59E0B'
  },
  {
    id: 'horizon',
    name: 'Horizon',
    icon: '⏳',
    description: 'Thesis Maturation Time',
    detailedDescription: 'Helps communicate time expectations without suggesting returns. This category guides you on the expected timeframe for the investment thesis to materialize.',
    color: '#EF4444'
  },
  {
    id: 'composition',
    name: 'Composition',
    icon: '🔧',
    description: 'Portfolio Structure',
    detailedDescription: 'Helps users understand the format and structure of the portfolio, not the risk. This focuses on how the portfolio is constructed and what types of instruments it contains.',
    color: '#6366F1'
  }
];

export const subCategories: SubCategory[] = [
  // SECTOR
  { id: 'sector::technology_ai', name: 'Technology & AI', description: 'Tech innovation and artificial intelligence', categoryId: 'sector', icon: '💻' },
  { id: 'sector::consumer_trends', name: 'Consumer Trends', description: 'Evolving consumer behavior & brands', categoryId: 'sector', icon: '🛒' },
  { id: 'sector::biotech_healthcare', name: 'Biotech & Healthcare', description: 'Medical breakthroughs & healthcare services', categoryId: 'sector', icon: '🧬' },
  { id: 'sector::industrials_core', name: 'Industrials Core', description: 'Manufacturing, infrastructure & logistics', categoryId: 'sector', icon: '�' },
  { id: 'sector::defense_aerospace', name: 'Defense & Aerospace', description: 'Military contracts & space technology', categoryId: 'sector', icon: '🚀' },
  { id: 'sector::finance_value', name: 'Finance & Value', description: 'Banking, insurance & financial services', categoryId: 'sector', icon: '🏦' },
  { id: 'sector::metals_mining', name: 'Metals & Mining', description: 'Precious metals, copper, lithium extraction', categoryId: 'sector', icon: '⛏️' },
  { id: 'sector::real_assets', name: 'Real Assets', description: 'Real estate, infrastructure & tangible assets', categoryId: 'sector', icon: '🏢' },
  
  // THESIS
  { id: 'thesis::innovation_wave', name: 'Innovation Wave', description: 'Disruptive technologies reshaping industries', categoryId: 'thesis', icon: '🌊' },
  { id: 'thesis::long_term_compounders', name: 'Long-term Compounders', description: 'Quality businesses with sustainable moats', categoryId: 'thesis', icon: '📈' },
  { id: 'thesis::deep_value_recovery', name: 'Deep Value Recovery', description: 'Undervalued assets with turnaround potential', categoryId: 'thesis', icon: '💎' },
  { id: 'thesis::electrification_pipeline', name: 'Electrification Pipeline', description: 'Electric vehicles & energy storage ecosystem', categoryId: 'thesis', icon: '🔋' },
  { id: 'thesis::nuclear_cycle', name: 'Nuclear Cycle', description: 'Nuclear energy renaissance & uranium supply', categoryId: 'thesis', icon: '⚛️' },
  { id: 'thesis::commodity_supercycle', name: 'Commodity Supercycle', description: 'Multi-year commodity price appreciation', categoryId: 'thesis', icon: '📊' },
  { id: 'thesis::space_economy', name: 'Space Economy', description: 'Commercial space ventures & satellite tech', categoryId: 'thesis', icon: '🚀' },
  { id: 'thesis::defense_spending_cycle', name: 'Defense Spending Cycle', description: 'Geopolitical tensions driving military spending', categoryId: 'thesis', icon: '🛡️' },
  { id: 'thesis::demographic_trend', name: 'Demographic Trend', description: 'Aging populations & healthcare demand', categoryId: 'thesis', icon: '👥' },
  
  // STAGE
  { id: 'stage::early_stage', name: 'Early Stage', description: 'Emerging companies with high growth potential', categoryId: 'stage', icon: '🌱' },
  { id: 'stage::growth', name: 'Growth', description: 'Scaling companies with proven business models', categoryId: 'stage', icon: '📈' },
  { id: 'stage::established', name: 'Established', description: 'Mature market leaders with stable returns', categoryId: 'stage', icon: '🏛️' },
  { id: 'stage::mixed', name: 'Mixed', description: 'Diversified portfolio across all growth stages', categoryId: 'stage', icon: '🔄' },
  
  // GEO
  { id: 'geo::us_focus', name: 'US Focus', description: 'American market concentration & exposure', categoryId: 'geo', icon: '🇺🇸' },
  { id: 'geo::global_multi_region', name: 'Global Multi-Region', description: 'Diversified international exposure', categoryId: 'geo', icon: '🌍' },
  { id: 'geo::commodity_exporters', name: 'Commodity Exporters', description: 'Resource-rich emerging market exposure', categoryId: 'geo', icon: '🌏' },
  { id: 'geo::china_focus', name: 'China Focus', description: 'Chinese market & supply chain exposure', categoryId: 'geo', icon: '🇨�' },
  
  // HORIZON
  { id: 'horizon::long_term_structural', name: 'Long-term Structural', description: '5-10 year mega-trend positioning', categoryId: 'horizon', icon: '⏳' },
  { id: 'horizon::thematic', name: 'Thematic', description: '2-5 year investment themes', categoryId: 'horizon', icon: '🎯' },
  { id: 'horizon::cyclical_repricing', name: 'Cyclical Repricing', description: '1-3 year economic cycle plays', categoryId: 'horizon', icon: '🔄' },
  { id: 'horizon::tactical_opportunity', name: 'Tactical Opportunity', description: '6-18 month market inefficiencies', categoryId: 'horizon', icon: '⚡' },
  
  // COMPOSITION
  { id: 'composition::single_stocks_only', name: 'Single Stocks Only', description: 'Individual stock selection strategy', categoryId: 'composition', icon: '📈' },
  { id: 'composition::mixed_assets', name: 'Mixed Assets', description: 'Stocks, bonds, REITs & alternatives', categoryId: 'composition', icon: '🔧' },
  { id: 'composition::etf_core', name: 'ETF Core', description: 'ETF-focused portfolio construction', categoryId: 'composition', icon: '📊' },
  { id: 'composition::etf_satellite', name: 'ETF Satellite', description: 'Core holdings with targeted ETF exposure', categoryId: 'composition', icon: '�️' }
];

export const investmentProducts: InvestmentProduct[] = [
  // Technology & AI
  { id: '1', name: 'NVIDIA Corp', description: 'Leading AI chip manufacturer', type: 'Stock', risk: 'high', expectedReturn: 'Variable', minimumAmount: 500, category: 'AI Hardware', subCategoryId: 'sector::technology_ai', ticker: 'NVDA' },
  { id: '2', name: 'Microsoft Corp', description: 'Cloud computing & AI services', type: 'Stock', risk: 'medium', expectedReturn: 'Variable', minimumAmount: 400, category: 'Cloud Computing', subCategoryId: 'sector::technology_ai', ticker: 'MSFT' },
  { id: '3', name: 'VanEck Semiconductor ETF', description: 'Semiconductor industry exposure', type: 'ETF', risk: 'medium', expectedReturn: '12-18% annually', minimumAmount: 100, category: 'Tech Hardware', subCategoryId: 'sector::technology_ai', ticker: 'SMH' },
  
  // Biotech & Healthcare
  { id: '4', name: 'Moderna Inc', description: 'mRNA technology pioneer', type: 'Stock', risk: 'high', expectedReturn: 'Variable', minimumAmount: 200, category: 'Biotechnology', subCategoryId: 'sector::biotech_healthcare', ticker: 'MRNA' },
  { id: '5', name: 'Johnson & Johnson', description: 'Diversified healthcare giant', type: 'Stock', risk: 'low', expectedReturn: '8-10% annually', minimumAmount: 300, category: 'Pharmaceuticals', subCategoryId: 'sector::biotech_healthcare', ticker: 'JNJ' },
  
  // Defense & Aerospace
  { id: '6', name: 'Lockheed Martin', description: 'Defense contractor leader', type: 'Stock', risk: 'medium', expectedReturn: '10-12% annually', minimumAmount: 400, category: 'Defense Contractors', subCategoryId: 'sector::defense_aerospace', ticker: 'LMT' },
  { id: '7', name: 'SpaceX Ventures Fund', description: 'Private space company exposure', type: 'Fund', risk: 'high', expectedReturn: '20-30% annually', minimumAmount: 5000, category: 'Space Technology', subCategoryId: 'sector::defense_aerospace', ticker: 'SPACEX' },
  
  // Innovation Wave Thesis
  { id: '8', name: 'ARK Innovation ETF', description: 'Disruptive innovation fund', type: 'ETF', risk: 'high', expectedReturn: '15-25% annually', minimumAmount: 250, category: 'Innovation Funds', subCategoryId: 'thesis::innovation_wave', ticker: 'ARKK' },
  { id: '9', name: 'Tesla Inc', description: 'Electric vehicle & energy innovation', type: 'Stock', risk: 'high', expectedReturn: 'Variable', minimumAmount: 600, category: 'EV Technology', subCategoryId: 'thesis::innovation_wave', ticker: 'TSLA' },
  
  // Nuclear Cycle
  { id: '10', name: 'Cameco Corporation', description: 'Uranium mining leader', type: 'Stock', risk: 'high', expectedReturn: 'Variable', minimumAmount: 300, category: 'Uranium Mining', subCategoryId: 'thesis::nuclear_cycle', ticker: 'CCJ' },
  { id: '11', name: 'Global X Uranium ETF', description: 'Nuclear energy supply chain', type: 'ETF', risk: 'high', expectedReturn: '18-28% annually', minimumAmount: 200, category: 'Nuclear Energy', subCategoryId: 'thesis::nuclear_cycle', ticker: 'URA' },
  
  // Early Stage
  { id: '12', name: 'Venture Capital Fund III', description: 'Early-stage startup investments', type: 'Fund', risk: 'high', expectedReturn: '25-40% annually', minimumAmount: 10000, category: 'Venture Capital', subCategoryId: 'stage::early_stage' },
  { id: '13', name: 'Growth Equity Fund', description: 'High-growth private companies', type: 'Fund', risk: 'high', expectedReturn: '20-30% annually', minimumAmount: 5000, category: 'Growth Equity', subCategoryId: 'stage::early_stage' },
  
  // US Focus
  { id: '14', name: 'S&P 500 ETF', description: 'US large-cap market index', type: 'ETF', risk: 'medium', expectedReturn: '10-12% annually', minimumAmount: 100, category: 'US Index Funds', subCategoryId: 'geo::us_focus' },
  { id: '15', name: 'Russell 2000 ETF', description: 'US small-cap exposure', type: 'ETF', risk: 'medium', expectedReturn: '12-15% annually', minimumAmount: 150, category: 'Small Cap Index', subCategoryId: 'geo::us_focus' },
  
  // Long-term Structural
  { id: '16', name: 'Infrastructure Fund', description: 'Global infrastructure investments', type: 'Fund', risk: 'medium', expectedReturn: '8-12% annually', minimumAmount: 1000, category: 'Infrastructure', subCategoryId: 'horizon::long_term_structural' },
  { id: '17', name: 'Clean Energy Transition', description: 'Renewable energy mega-trend', type: 'ETF', risk: 'medium', expectedReturn: '10-15% annually', minimumAmount: 200, category: 'Energy Transition', subCategoryId: 'horizon::long_term_structural' },
  
  // Single Stocks Only
  { id: '18', name: 'Apple Inc', description: 'Technology ecosystem leader', type: 'Stock', risk: 'medium', expectedReturn: 'Variable', minimumAmount: 400, category: 'Large Cap Tech', subCategoryId: 'composition::single_stocks_only' },
  { id: '19', name: 'Berkshire Hathaway', description: 'Value investing conglomerate', type: 'Stock', risk: 'low', expectedReturn: 'Variable', minimumAmount: 300, category: 'Value Stocks', subCategoryId: 'composition::single_stocks_only' }
];

export const getCategoryRows = (subCategoryId: string): CategoryRow[] => {
  const products = investmentProducts.filter(p => p.subCategoryId === subCategoryId);
  
  // Group products by category
  const categoriesMap = new Map<string, InvestmentProduct[]>();
  products.forEach(product => {
    if (!categoriesMap.has(product.category)) {
      categoriesMap.set(product.category, []);
    }
    categoriesMap.get(product.category)!.push(product);
  });

  // Convert to CategoryRow array
  return Array.from(categoriesMap.entries()).map(([category, products]) => ({
    id: category.toLowerCase().replace(/\s+/g, '-'),
    title: category,
    products
  }));
};