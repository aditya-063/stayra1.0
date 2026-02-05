// Partner price simulators
// Later: Replace function bodies with real API calls, keep interface the same

export interface PartnerOffer {
    partner: string;
    partnerName: string;
    roomType: string;
    price: number;
    currency: string;
    taxes: number;
    totalPrice: number;
    refundable: boolean;
    cancellation: string;
    deeplink: string;
}

/**
 * Simulate Booking.com pricing
 */
export function simulateBookingPrice(basePrice: number): number {
    return Math.round((basePrice + (Math.random() * 20 - 10)) * 100) / 100;
}

/**
 * Simulate Agoda pricing (more variation)
 */
export function simulateAgodaPrice(basePrice: number): number {
    return Math.round((basePrice + (Math.random() * 30 - 15)) * 100) / 100;
}

/**
 * Simulate Expedia pricing
 */
export function simulateExpediaPrice(basePrice: number): number {
    return Math.round((basePrice + (Math.random() * 16 - 8)) * 100) / 100;
}

/**
 * Simulate Hotels.com pricing
 */
export function simulateHotelsComPrice(basePrice: number): number {
    return Math.round((basePrice + (Math.random() * 12 - 6)) * 100) / 100;
}

/**
 * Get partner display name
 */
export function getPartnerName(partnerId: string): string {
    const names: Record<string, string> = {
        booking: 'Booking.com',
        agoda: 'Agoda',
        expedia: 'Expedia',
        hotelscom: 'Hotels.com',
    };
    return names[partnerId] || partnerId;
}

/**
 * Get cancellation policy text
 */
export function getCancellationPolicy(refundable: boolean): string {
    if (refundable) {
        const policies = [
            'Free cancellation until 24 hours before check-in',
            'Free cancellation until 48 hours before check-in',
            'Free cancellation until 72 hours before check-in',
        ];
        return policies[Math.floor(Math.random() * policies.length)];
    }
    return 'Non-refundable';
}

/**
 * Generate simulated partner offers for a hotel
 * Later: This will call real partner APIs
 */
export function simulatePartnerOffers(
    hotelId: string,
    basePrice: number,
    currency: string = 'EUR'
): PartnerOffer[] {
    const partners = ['booking', 'agoda', 'expedia', 'hotelscom'];
    const priceFunctions: Record<string, (price: number) => number> = {
        booking: simulateBookingPrice,
        agoda: simulateAgodaPrice,
        expedia: simulateExpediaPrice,
        hotelscom: simulateHotelsComPrice,
    };

    return partners.map((partner) => {
        const price = priceFunctions[partner](basePrice);
        const taxes = Math.round(price * 0.12 * 100) / 100;
        const refundable = Math.random() > 0.4;

        return {
            partner,
            partnerName: getPartnerName(partner),
            roomType: 'Deluxe King Room',
            price,
            currency,
            taxes,
            totalPrice: Math.round((price + taxes) * 100) / 100,
            refundable,
            cancellation: getCancellationPolicy(refundable),
            deeplink: `/api/partners/${partner}/redirect/${hotelId}`,
        };
    });
}
