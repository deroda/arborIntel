/**
 * ArborIntel 2035 - AI Risk Engine (Heuristic Model V1)
 * Calculates tree failure probability based on static bio-metrics and dynamic weather loads.
 */

class RiskService {
    constructor() {
        // Base brittleness factors (0.1 = resilient, 0.9 = brittle)
        this.speciesFactors = {
            'English Oak': 0.2,   // Strong
            'Silver Birch': 0.5,  // Moderate
            'Common Ash': 0.4,    // Moderate-Strong
            'Lombardy Poplar': 0.8, // Brittle
            'Cedar': 0.3          // Flexible
        };
    }

    /**
     * Calculate failure probability (0.0 - 1.0)
     * @param {Object} tree - Tree asset data (species, height_m, dbh_cm)
     * @param {Object} weather - Current weather state (windSpeed_mph)
     */
    calculateFailureProb(tree, weather) {
        const windSpeed = weather.windSpeed_mph || 0;
        const speciesFactor = this.speciesFactors[tree.species] || 0.4; // Default to moderate

        // 1. Height Load: Taller trees catch more wind
        // Normalize height: 10m = 1.0, 30m = 3.0
        const heightM = parseFloat(tree.height) || 15; // Handle string "15m" or raw 15
        const heightFactor = heightM / 10.0;

        // 2. Wind Severity: Non-linear increase
        // < 30mph = minimal risk
        // > 50mph = exponential risk
        let windLoad = 0;
        if (windSpeed < 30) {
            windLoad = 0.1;
        } else if (windSpeed < 50) {
            windLoad = 0.4 + ((windSpeed - 30) / 20) * 0.3; // 0.4 to 0.7
        } else {
            windLoad = 0.8 + ((windSpeed - 50) / 50) * 0.2; // 0.8 to 1.0+
        }

        // 3. Algorithm: (Species * Height) * Wind
        // Example: Oak (0.2) * 20m (2.0) = 0.4 (internal structural load)
        // Combined with Wind (e.g., Storm = 0.9)

        let rawRisk = (speciesFactor * heightFactor * 0.5) + (windLoad * 0.8);

        // Cap at 0.0 - 0.99
        return Math.min(Math.max(rawRisk * 0.6, 0.01), 0.99); // Scaling down to keep reasonable for MVP
    }
}

module.exports = new RiskService();
