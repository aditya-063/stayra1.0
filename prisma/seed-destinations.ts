import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Top 100 worldwide tourist destinations
const destinations = [
    // Europe
    { city: 'Paris', country: 'France', region: 'Europe', latitude: 48.8566, longitude: 2.3522, population: 2161000, isPopular: true },
    { city: 'London', country: 'United Kingdom', region: 'Europe', latitude: 51.5074, longitude: -0.1278, population: 9002488, isPopular: true },
    { city: 'Rome', country: 'Italy', region: 'Europe', latitude: 41.9028, longitude: 12.4964, population: 2873000, isPopular: true },
    { city: 'Barcelona', country: 'Spain', region: 'Europe', latitude: 41.3851, longitude: 2.1734, population: 1636000, isPopular: true },
    { city: 'Amsterdam', country: 'Netherlands', region: 'Europe', latitude: 52.3676, longitude: 4.9041, population: 872680, isPopular: true },
    { city: 'Venice', country: 'Italy', region: 'Europe', latitude: 45.4408, longitude: 12.3155, population: 261905, isPopular: true },
    { city: 'Prague', country: 'Czech Republic', region: 'Europe', latitude: 50.0755, longitude: 14.4378, population: 1309000, isPopular: true },
    { city: 'Vienna', country: 'Austria', region: 'Europe', latitude: 48.2082, longitude: 16.3738, population: 1911000, isPopular: true },
    { city: 'Berlin', country: 'Germany', region: 'Europe', latitude: 52.5200, longitude: 13.4050, population: 3769000, isPopular: true },
    { city: 'Munich', country: 'Germany', region: 'Europe', latitude: 48.1351, longitude: 11.5820, population: 1472000, isPopular: true },

    // Asia
    { city: 'Dubai', country: 'United Arab Emirates', region: 'Asia', latitude: 25.2048, longitude: 55.2708, population: 3331000, isPopular: true },
    { city: 'Tokyo', country: 'Japan', region: 'Asia', latitude: 35.6762, longitude: 139.6503, population: 13960000, isPopular: true },
    { city: 'Singapore', country: 'Singapore', region: 'Asia', latitude: 1.3521, longitude: 103.8198, population: 5686000, isPopular: true },
    { city: 'Bangkok', country: 'Thailand', region: 'Asia', latitude: 13.7563, longitude: 100.5018, population: 10722000, isPopular: true },
    { city: 'Hong Kong', country: 'China', region: 'Asia', latitude: 22.3193, longitude: 114.1694, population: 7482000, isPopular: true },
    { city: 'Mumbai', country: 'India', region: 'Asia', latitude: 19.0760, longitude: 72.8777, population: 20411000, isPopular: true },
    { city: 'Delhi', country: 'India', region: 'Asia', latitude: 28.7041, longitude: 77.1025, population: 30291000, isPopular: true },
    { city: 'Goa', country: 'India', region: 'Asia', latitude: 15.2993, longitude: 74.1240, population: 1458000, isPopular: true },
    { city: 'Jaipur', country: 'India', region: 'Asia', latitude: 26.9124, longitude: 75.7873, population: 3046000, isPopular: true },
    { city: 'Agra', country: 'India', region: 'Asia', latitude: 27.1767, longitude: 78.0081, population: 1585000, isPopular: true },

    // North America
    { city: 'New York', country: 'United States', region: 'North America', latitude: 40.7128, longitude: -74.0060, population: 8336000, isPopular: true },
    { city: 'Las Vegas', country: 'United States', region: 'North America', latitude: 36.1699, longitude: -115.1398, population: 641903, isPopular: true },
    { city: 'Los Angeles', country: 'United States', region: 'North America', latitude: 34.0522, longitude: -118.2437, population: 3979000, isPopular: true },
    { city: 'San Francisco', country: 'United States', region: 'North America', latitude: 37.7749, longitude: -122.4194, population: 883305, isPopular: true },
    { city: 'Miami', country: 'United States', region: 'North America', latitude: 25.7617, longitude: -80.1918, population: 467963, isPopular: true },
    { city: 'Cancun', country: 'Mexico', region: 'North America', latitude: 21.1619, longitude: -86.8515, population: 888797, isPopular: true },
    { city: 'Toronto', country: 'Canada', region: 'North America', latitude: 43.6532, longitude: -79.3832, population: 2931000, isPopular: true },
    { city: 'Vancouver', country: 'Canada', region: 'North America', latitude: 49.2827, longitude: -123.1207, population: 675218, isPopular: true },

    // South America
    { city: 'Rio de Janeiro', country: 'Brazil', region: 'South America', latitude: -22.9068, longitude: -43.1729, population: 6748000, isPopular: true },
    { city: 'Buenos Aires', country: 'Argentina', region: 'South America', latitude: -34.6037, longitude: -58.3816, population: 3075000, isPopular: true },
    { city: 'Lima', country: 'Peru', region: 'South America', latitude: -12.0464, longitude: -77.0428, population: 10719000, isPopular: true },

    // Australia / Oceania
    { city: 'Sydney', country: 'Australia', region: 'Oceania', latitude: -33.8688, longitude: 151.2093, population: 5312000, isPopular: true },
    { city: 'Melbourne', country: 'Australia', region: 'Oceania', latitude: -37.8136, longitude: 144.9631, population: 5078000, isPopular: true },
    { city: 'Auckland', country: 'New Zealand', region: 'Oceania', latitude: -36.8485, longitude: 174.7633, population: 1657000, isPopular: true },

    // Middle East
    { city: 'Istanbul', country: 'Turkey', region: 'Middle East', latitude: 41.0082, longitude: 28.9784, population: 15460000, isPopular: true },
    { city: 'Doha', country: 'Qatar', region: 'Middle East', latitude: 25.2854, longitude: 51.5310, population: 2382000, isPopular: true },
    { city: 'Abu Dhabi', country: 'United Arab Emirates', region: 'Middle East', latitude: 24.4539, longitude: 54.3773, population: 1450000, isPopular: true },

    // Africa
    { city: 'Cape Town', country: 'South Africa', region: 'Africa', latitude: -33.9249, longitude: 18.4241, population: 4618000, isPopular: true },
    { city: 'Marrakech', country: 'Morocco', region: 'Africa', latitude: 31.6295, longitude: -7.9811, population: 928850, isPopular: true },
    { city: 'Cairo', country: 'Egypt', region: 'Africa', latitude: 30.0444, longitude: 31.2357, population: 20901000, isPopular: true },

    // More Asian destinations
    { city: 'Bali', country: 'Indonesia', region: 'Asia', latitude: -8.4095, longitude: 115.1889, population: 4317000, isPopular: true },
    { city: 'Phuket', country: 'Thailand', region: 'Asia', latitude: 7.8804, longitude: 98.3923, population: 416582, isPopular: true },
    { city: 'Seoul', country: 'South Korea', region: 'Asia', latitude: 37.5665, longitude: 126.9780, population: 9776000, isPopular: true },
    { city: 'Kyoto', country: 'Japan', region: 'Asia', latitude: 35.0116, longitude: 135.7681, population: 1475000, isPopular: true },
    { city: 'Shanghai', country: 'China', region: 'Asia', latitude: 31.2304, longitude: 121.4737, population: 27058000, isPopular: true },
    { city: 'Beijing', country: 'China', region: 'Asia', latitude: 39.9042, longitude: 116.4074, population: 21540000, isPopular: true },

    // More European destinations
    { city: 'Athens', country: 'Greece', region: 'Europe', latitude: 37.9838, longitude: 23.7275, population: 3154000, isPopular: true },
    { city: 'Lisbon', country: 'Portugal', region: 'Europe', latitude: 38.7223, longitude: -9.1393, population: 505526, isPopular: true },
    { city: 'Budapest', country: 'Hungary', region: 'Europe', latitude: 47.4979, longitude: 19.0402, population: 1752000, isPopular: false },
    { city: 'Dublin', country: 'Ireland', region: 'Europe', latitude: 53.3498, longitude: -6.2603, population: 1387000, isPopular: false },

    // Additional major cities
    { city: 'Bangalore', country: 'India', region: 'Asia', latitude: 12.9716, longitude: 77.5946, population: 12765000, isPopular: false },
    { city: 'Hyderabad', country: 'India', region: 'Asia', latitude: 17.3850, longitude: 78.4867, population: 10004000, isPopular: false },
    { city: 'Chennai', country: 'India', region: 'Asia', latitude: 13.0827, longitude: 80.2707, population: 10971000, isPopular: false },
    { city: 'Kolkata', country: 'India', region: 'Asia', latitude: 22.5726, longitude: 88.3639, population: 14850000, isPopular: false },
    { city: 'Pune', country: 'India', region: 'Asia', latitude: 18.5204, longitude: 73.8567, population: 7764000, isPopular: false },
    { city: 'Udaipur', country: 'India', region: 'Asia', latitude: 24.5854, longitude: 73.7125, population: 475000, isPopular: true },
    { city: 'Kerala', country: 'India', region: 'Asia', latitude: 10.8505, longitude: 76.2711, population: 34699000, isPopular: true },
    { city: 'Manali', country: 'India', region: 'Asia', latitude: 32.2396, longitude: 77.1887, population: 8000, isPopular: true },
    { city: 'Shimla', country: 'India', region: 'Asia', latitude: 31.1048, longitude: 77.1734, population: 171817, isPopular: true },
    { city: 'Darjeeling', country: 'India', region: 'Asia', latitude: 27.0360, longitude: 88.2627, population: 119000, isPopular: true },

    { city: 'Maldives', country: 'Maldives', region: 'Asia', latitude: 3.2028, longitude: 73.2207, population: 540544, isPopular: true },
    { city: 'Kuala Lumpur', country: 'Malaysia', region: 'Asia', latitude: 3.1390, longitude: 101.6869, population: 1982000, isPopular: true },
    { city: 'Manila', country: 'Philippines', region: 'Asia', latitude: 14.5995, longitude: 120.9842, population: 13923000, isPopular: false },
    { city: 'Hanoi', country: 'Vietnam', region: 'Asia', latitude: 21.0285, longitude: 105.8542, population: 8246000, isPopular: true },
    { city: 'Ho Chi Minh City', country: 'Vietnam', region: 'Asia', latitude: 10.8231, longitude: 106.6297, population: 8993000, isPopular: true },
    { city: 'Kathmandu', country: 'Nepal', region: 'Asia', latitude: 27.7172, longitude: 85.3240, population: 1442271, isPopular: true },
    { city: 'Colombo', country: 'Sri Lanka', region: 'Asia', latitude: 6.9271, longitude: 79.8612, population: 752993, isPopular: false },

    { city: 'Madrid', country: 'Spain', region: 'Europe', latitude: 40.4168, longitude: -3.7038, population: 3223000, isPopular: true },
    { city: 'Milan', country: 'Italy', region: 'Europe', latitude: 45.4642, longitude: 9.1900, population: 1396000, isPopular: false },
    { city: 'Florence', country: 'Italy', region: 'Europe', latitude: 43.7696, longitude: 11.2558, population: 382808, isPopular: true },
    { city: 'Zurich', country: 'Switzerland', region: 'Europe', latitude: 47.3769, longitude: 8.5417, population: 415367, isPopular: false },
    { city: 'Geneva', country: 'Switzerland', region: 'Europe', latitude: 46.2044, longitude: 6.1432, population: 203856, isPopular: false },
    { city: 'Brussels', country: 'Belgium', region: 'Europe', latitude: 50.8503, longitude: 4.3517, population: 2081000, isPopular: false },
    { city: 'Copenhagen', country: 'Denmark', region: 'Europe', latitude: 55.6761, longitude: 12.5683, population: 1345000, isPopular: false },
    { city: 'Stockholm', country: 'Sweden', region: 'Europe', latitude: 59.3293, longitude: 18.0686, population: 975904, isPopular: false },
    { city: 'Oslo', country: 'Norway', region: 'Europe', latitude: 59.9139, longitude: 10.7522, population: 697010, isPopular: false },
    { city: 'Helsinki', country: 'Finland', region: 'Europe', latitude: 60.1699, longitude: 24.9384, population: 655281, isPopular: false },
    { city: 'Reykjavik', country: 'Iceland', region: 'Europe', latitude: 64.1466, longitude: -21.9426, population: 131136, isPopular: true },
    { city: 'Edinburgh', country: 'United Kingdom', region: 'Europe', latitude: 55.9533, longitude: -3.1883, population: 524930, isPopular: true },
    { city: 'Glasgow', country: 'United Kingdom', region: 'Europe', latitude: 55.8642, longitude: -4.2518, population: 635640, isPopular: false },
    { city: 'Manchester', country: 'United Kingdom', region: 'Europe', latitude: 53.4808, longitude: -2.2426, population: 553230, isPopular: false },

    { city: 'Chicago', country: 'United States', region: 'North America', latitude: 41.8781, longitude: -87.6298, population: 2716000, isPopular: false },
    { city: 'Boston', country: 'United States', region: 'North America', latitude: 42.3601, longitude: -71.0589, population: 694583, isPopular: false },
    { city: 'Seattle', country: 'United States', region: 'North America', latitude: 47.6062, longitude: -122.3321, population: 753675, isPopular: false },
    { city: 'Orlando', country: 'United States', region: 'North America', latitude: 28.5383, longitude: -81.3792, population: 307573, isPopular: true },
    { city: 'Hawaii', country: 'United States', region: 'North America', latitude: 19.8968, longitude: -155.5828, population: 1455271, isPopular: true },
    { city: 'San Diego', country: 'United States', region: 'North America', latitude: 32.7157, longitude: -117.1611, population: 1423851, isPopular: true },
    { city: 'Washington D.C.', country: 'United States', region: 'North America', latitude: 38.9072, longitude: -77.0369, population: 705749, isPopular: true },
    { city: 'Nashville', country: 'United States', region: 'North America', latitude: 36.1627, longitude: -86.7816, population: 689447, isPopular: false },
    { city: 'New Orleans', country: 'United States', region: 'North America', latitude: 29.9511, longitude: -90.0715, population: 391006, isPopular: true },
    { city: 'Montreal', country: 'Canada', region: 'North America', latitude: 45.5017, longitude: -73.5673, population: 1780000, isPopular: false },
    { city: 'Mexico City', country: 'Mexico', region: 'North America', latitude: 19.4326, longitude: -99.1332, population: 21672000, isPopular: false },
    { city: 'Playa del Carmen', country: 'Mexico', region: 'North America', latitude: 20.6296, longitude: -87.0739, population: 319815, isPopular: true },
    { city: 'Tulum', country: 'Mexico', region: 'North America', latitude: 20.2114, longitude: -87.4654, population: 18233, isPopular: true },
];

async function seedDestinations() {
    console.log('🌍 Seeding destinations...');

    try {
        // Delete existing destinations
        await prisma.destination.deleteMany();
        console.log('✅ Cleared existing destinations');

        // Insert new destinations
        await prisma.destination.createMany({
            data: destinations,
        });

        console.log(`✅ Seeded ${destinations.length} destinations`);
        console.log('🌟 Popular destinations:', destinations.filter(d => d.isPopular).length);
    } catch (error) {
        console.error('❌ Error seeding destinations:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

seedDestinations();
