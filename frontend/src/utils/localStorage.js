// Recently Viewed Cars Management
const STORAGE_KEY = 'recentlyViewedCars';
const MAX_RECENT_CARS = 10;

export const addRecentlyViewed = (car) => {
  try {
    let recentCars = getRecentlyViewed();
    
    // Remove if already exists
    recentCars = recentCars.filter(c => c.CarID !== car.CarID);
    
    // Add to beginning
    recentCars.unshift({
      CarID: car.CarID,
      ArabaMarka: car.ArabaMarka,
      CarModel: car.CarModel,
      CarPack: car.CarPack,
      CarPhotos: car.CarPhotos,
      CarPrice: car.CarPrice,
      CarHorsePower: car.CarHorsePower,
      averageRating: car.averageRating,
      viewedAt: new Date().toISOString()
    });
    
    // Keep only MAX_RECENT_CARS
    recentCars = recentCars.slice(0, MAX_RECENT_CARS);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recentCars));
  } catch (error) {
    console.error('Error saving recently viewed car:', error);
  }
};

export const getRecentlyViewed = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error getting recently viewed cars:', error);
    return [];
  }
};

export const clearRecentlyViewed = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing recently viewed cars:', error);
  }
};

// Popular Comparisons Management
const COMPARISONS_KEY = 'popularComparisons';

export const trackComparison = (car1Id, car2Id, car1Name, car2Name) => {
  try {
    let comparisons = getPopularComparisons();
    
    // Create comparison key (sorted to avoid duplicates)
    const key = [car1Id, car2Id].sort().join('-');
    
    // Find existing or create new
    const existing = comparisons.find(c => c.key === key);
    
    if (existing) {
      existing.count++;
      existing.lastCompared = new Date().toISOString();
    } else {
      comparisons.push({
        key,
        car1Id,
        car2Id,
        car1Name,
        car2Name,
        count: 1,
        lastCompared: new Date().toISOString()
      });
    }
    
    // Sort by count and keep top 20
    comparisons.sort((a, b) => b.count - a.count);
    comparisons = comparisons.slice(0, 20);
    
    localStorage.setItem(COMPARISONS_KEY, JSON.stringify(comparisons));
  } catch (error) {
    console.error('Error tracking comparison:', error);
  }
};

export const getPopularComparisons = () => {
  try {
    const stored = localStorage.getItem(COMPARISONS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error getting popular comparisons:', error);
    return [];
  }
};

export const clearPopularComparisons = () => {
  try {
    localStorage.removeItem(COMPARISONS_KEY);
  } catch (error) {
    console.error('Error clearing popular comparisons:', error);
  }
};
