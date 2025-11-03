// Blue API Service for fetching portfolio data
export interface Creator {
  uuid: string;
  userUuid: string;
  creatorType: string;
  creatorUserType: string;
  handle: string;
  displayName: string;
  bio: string;
  profileImageUrl: string;
}

export interface StrategyInfo {
  strategyId: string;
  strategyOwnerAccountId: string;
  strategyName: string;
  strategyTagline: string | null;
  strategyDescription: string;
  strategyLogo: string | null;
  tickerName: string;
  benchmarkInstrumentId: string | null;
  currentState: string;
  managementType: string;
  creationType: string;
  basedOnStrategy: string | null;
  strategyCategoryType: Array<{
    externalId: string;
    displayName: string;
    description: string;
    order: number;
    highlighted: boolean;
    unlisted: boolean;
  }>;
  inceptionDate: string;
  isPrivate: boolean;
  profileImageUrl: string;
  profileVideoUrl: string | null;
  profileVideoThumbnailUrl: string | null;
  strategyThumbnailUrl: string | null;
}

export interface InstrumentDto {
  externalId: string;
  ticker: string;
  companyName: string;
  companyImageUrl: string;
  sector: string | null;
}

export interface Equity {
  instrumentDto: InstrumentDto;
  fraction: string;
}

export interface CurrentAllocation {
  equities: Equity[];
  currencies: Array<any>;
}

export interface Disclosure {
  thesis: string | null;
  strategyConstruction: string | null;
  risks: string | null;
  fullDescription: string;
}

export interface BacktestData {
  returns: any;
  startDate: any;
  endDate: any;
  lastUpdatedAt: any;
}

export interface BluePortfolioStats {
  creatorInvestmentAmount: string;
  dubbersQuantity: string;
  dubbingCapital: string;
  createdAt: string;
  firstDubTime: string;
  annualYield: string;
  allTimeReturns: number;
  backtestData: BacktestData;
  riskScore: any;
  averageDaysBetweenRebalances: number;
  daysSinceTheLastRebalance: number;
  lastRebalanceDate: string;
  rebalancesCount: number;
  averageDaysBetweenRebalancesIncludingToday: number;
}

export interface BlueHistoricalData {
  window: string;
  strategyHistoricalData: {
    close: number[];
  };
}

export interface BluePortfolioData {
  creator: Creator;
  sponsoredCreator: any;
  strategyInfo: StrategyInfo;
  currentAllocation: CurrentAllocation;
  isManagementFee: boolean;
  disclosure: Disclosure;
}

class BlueApiService {
  private static readonly BASE_URL = 'https://prod.blue/strategies/v2';

  static async getPortfolioById(id: string): Promise<BluePortfolioData> {
    try {
      const response = await fetch(`${this.BASE_URL}/${id}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch portfolio: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching portfolio from Blue API:', error);
      throw error;
    }
  }

  static async getPortfolioStats(externalId: string): Promise<BluePortfolioStats> {
    try {
      const response = await fetch(`https://prod.blue/strategies/v1/${externalId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch portfolio stats: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching portfolio stats from Blue API:', error);
      throw error;
    }
  }

  static async getPortfolioHistoricalData(strategyId: string, window: string = 'YTD'): Promise<BlueHistoricalData> {
    try {
      const baseUrl = 'https://prod.blue/historical/portfolios/v3';
      const response = await fetch(`${baseUrl}/${strategyId}?windows=${window}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch portfolio historical data: ${response.status}`);
      }

      const data = await response.json();
      return data[0];
    } catch (error) {
      console.error('Error fetching portfolio historical data from Blue API:', error);
      throw error;
    }
  }
}

export default BlueApiService;