/**
 * Indian Cities & State Bullion Differential Matrix
 * Covers all 28 States and 8 Union Territories in India.
 * When the admin updates ONE base spot price for Gold 24K and Silver 999:
 * Every single city across India is automatically calculated based on statutory state
 * spreads, transportation, octroi, and local bullion association differentials.
 */

export interface CityFactor {
  city: string;
  state: string;
  goldDelta: number; // Offset in ₹ per 10g from base 24K spot
  silverDelta: number; // Offset in ₹ per 1kg from base Silver 999 spot
}

export interface CityBullionRate {
  city: string;
  state: string;
  gold24K: number;
  gold22K: number;
  silver1Kg: number;
}

export const ALL_INDIAN_STATE_CITIES: CityFactor[] = [
  // 1. Maharashtra (Base Benchmark Hub)
  { city: 'Mumbai', state: 'Maharashtra', goldDelta: 0, silverDelta: 0 },
  { city: 'Pune', state: 'Maharashtra', goldDelta: 20, silverDelta: 50 },
  { city: 'Nagpur', state: 'Maharashtra', goldDelta: 60, silverDelta: 100 },
  { city: 'Nashik', state: 'Maharashtra', goldDelta: 30, silverDelta: 80 },
  { city: 'Aurangabad (Chhatrapati Sambhajinagar)', state: 'Maharashtra', goldDelta: 40, silverDelta: 90 },
  { city: 'Kolhapur', state: 'Maharashtra', goldDelta: 30, silverDelta: 80 },

  // 2. Delhi National Capital Region (NCR)
  { city: 'Delhi', state: 'Delhi NCR', goldDelta: 150, silverDelta: 300 },
  { city: 'Noida', state: 'Uttar Pradesh (NCR)', goldDelta: 150, silverDelta: 300 },
  { city: 'Gurugram', state: 'Haryana (NCR)', goldDelta: 150, silverDelta: 300 },
  { city: 'Ghaziabad', state: 'Uttar Pradesh (NCR)', goldDelta: 150, silverDelta: 300 },
  { city: 'Faridabad', state: 'Haryana (NCR)', goldDelta: 150, silverDelta: 300 },

  // 3. Tamil Nadu
  { city: 'Chennai', state: 'Tamil Nadu', goldDelta: 100, silverDelta: 3500 },
  { city: 'Coimbatore', state: 'Tamil Nadu', goldDelta: 110, silverDelta: 3500 },
  { city: 'Madurai', state: 'Tamil Nadu', goldDelta: 110, silverDelta: 3500 },
  { city: 'Salem', state: 'Tamil Nadu', goldDelta: 110, silverDelta: 3500 },
  { city: 'Tiruchirappalli (Trichy)', state: 'Tamil Nadu', goldDelta: 110, silverDelta: 3500 },
  { city: 'Tirunelveli', state: 'Tamil Nadu', goldDelta: 120, silverDelta: 3500 },

  // 4. Karnataka
  { city: 'Bengaluru', state: 'Karnataka', goldDelta: 120, silverDelta: 1500 },
  { city: 'Mysuru', state: 'Karnataka', goldDelta: 130, silverDelta: 1500 },
  { city: 'Mangaluru', state: 'Karnataka', goldDelta: 120, silverDelta: 1500 },
  { city: 'Hubballi-Dharwad', state: 'Karnataka', goldDelta: 130, silverDelta: 1500 },
  { city: 'Belagavi', state: 'Karnataka', goldDelta: 130, silverDelta: 1500 },

  // 5. Telangana
  { city: 'Hyderabad', state: 'Telangana', goldDelta: 120, silverDelta: 2000 },
  { city: 'Warangal', state: 'Telangana', goldDelta: 130, silverDelta: 2000 },
  { city: 'Nizamabad', state: 'Telangana', goldDelta: 130, silverDelta: 2000 },
  { city: 'Karimnagar', state: 'Telangana', goldDelta: 130, silverDelta: 2000 },

  // 6. Andhra Pradesh
  { city: 'Vijayawada', state: 'Andhra Pradesh', goldDelta: 120, silverDelta: 2000 },
  { city: 'Visakhapatnam', state: 'Andhra Pradesh', goldDelta: 110, silverDelta: 2000 },
  { city: 'Guntur', state: 'Andhra Pradesh', goldDelta: 120, silverDelta: 2000 },
  { city: 'Tirupati', state: 'Andhra Pradesh', goldDelta: 120, silverDelta: 2000 },
  { city: 'Nellore', state: 'Andhra Pradesh', goldDelta: 120, silverDelta: 2000 },
  { city: 'Kurnool', state: 'Andhra Pradesh', goldDelta: 125, silverDelta: 2000 },

  // 7. West Bengal
  { city: 'Kolkata', state: 'West Bengal', goldDelta: 80, silverDelta: 200 },
  { city: 'Siliguri', state: 'West Bengal', goldDelta: 100, silverDelta: 250 },
  { city: 'Asansol', state: 'West Bengal', goldDelta: 90, silverDelta: 220 },
  { city: 'Durgapur', state: 'West Bengal', goldDelta: 90, silverDelta: 220 },

  // 8. Gujarat
  { city: 'Ahmedabad', state: 'Gujarat', goldDelta: 40, silverDelta: 100 },
  { city: 'Surat', state: 'Gujarat', goldDelta: 40, silverDelta: 100 },
  { city: 'Vadodara', state: 'Gujarat', goldDelta: 50, silverDelta: 100 },
  { city: 'Rajkot', state: 'Gujarat', goldDelta: 45, silverDelta: 100 },
  { city: 'Bhavnagar', state: 'Gujarat', goldDelta: 50, silverDelta: 110 },
  { city: 'Jamnagar', state: 'Gujarat', goldDelta: 50, silverDelta: 110 },

  // 9. Uttar Pradesh
  { city: 'Lucknow', state: 'Uttar Pradesh', goldDelta: 160, silverDelta: 350 },
  { city: 'Kanpur', state: 'Uttar Pradesh', goldDelta: 160, silverDelta: 350 },
  { city: 'Varanasi', state: 'Uttar Pradesh', goldDelta: 170, silverDelta: 400 },
  { city: 'Agra', state: 'Uttar Pradesh', goldDelta: 155, silverDelta: 320 },
  { city: 'Prayagraj (Allahabad)', state: 'Uttar Pradesh', goldDelta: 165, silverDelta: 360 },
  { city: 'Meerut', state: 'Uttar Pradesh', goldDelta: 150, silverDelta: 300 },
  { city: 'Gorakhpur', state: 'Uttar Pradesh', goldDelta: 170, silverDelta: 380 },
  { city: 'Bareilly', state: 'Uttar Pradesh', goldDelta: 160, silverDelta: 340 },

  // 10. Rajasthan
  { city: 'Jaipur', state: 'Rajasthan', goldDelta: 140, silverDelta: 280 },
  { city: 'Jodhpur', state: 'Rajasthan', goldDelta: 145, silverDelta: 290 },
  { city: 'Udaipur', state: 'Rajasthan', goldDelta: 145, silverDelta: 290 },
  { city: 'Kota', state: 'Rajasthan', goldDelta: 145, silverDelta: 290 },
  { city: 'Bikaner', state: 'Rajasthan', goldDelta: 150, silverDelta: 300 },
  { city: 'Ajmer', state: 'Rajasthan', goldDelta: 140, silverDelta: 280 },

  // 11. Kerala
  { city: 'Kochi', state: 'Kerala', goldDelta: 90, silverDelta: 3200 },
  { city: 'Thiruvananthapuram', state: 'Kerala', goldDelta: 90, silverDelta: 3200 },
  { city: 'Kozhikode', state: 'Kerala', goldDelta: 90, silverDelta: 3200 },
  { city: 'Thrissur', state: 'Kerala', goldDelta: 90, silverDelta: 3200 },
  { city: 'Kollam', state: 'Kerala', goldDelta: 90, silverDelta: 3200 },
  { city: 'Kannur', state: 'Kerala', goldDelta: 90, silverDelta: 3200 },

  // 12. Punjab
  { city: 'Chandigarh', state: 'Punjab / Haryana / UT', goldDelta: 150, silverDelta: 300 },
  { city: 'Ludhiana', state: 'Punjab', goldDelta: 150, silverDelta: 300 },
  { city: 'Amritsar', state: 'Punjab', goldDelta: 150, silverDelta: 300 },
  { city: 'Jalandhar', state: 'Punjab', goldDelta: 150, silverDelta: 300 },
  { city: 'Patiala', state: 'Punjab', goldDelta: 150, silverDelta: 300 },

  // 13. Haryana
  { city: 'Panipat', state: 'Haryana', goldDelta: 150, silverDelta: 300 },
  { city: 'Ambala', state: 'Haryana', goldDelta: 150, silverDelta: 300 },
  { city: 'Hisar', state: 'Haryana', goldDelta: 150, silverDelta: 300 },
  { city: 'Karnal', state: 'Haryana', goldDelta: 150, silverDelta: 300 },
  { city: 'Rohtak', state: 'Haryana', goldDelta: 150, silverDelta: 300 },

  // 14. Madhya Pradesh
  { city: 'Bhopal', state: 'Madhya Pradesh', goldDelta: 130, silverDelta: 250 },
  { city: 'Indore', state: 'Madhya Pradesh', goldDelta: 130, silverDelta: 250 },
  { city: 'Jabalpur', state: 'Madhya Pradesh', goldDelta: 140, silverDelta: 270 },
  { city: 'Gwalior', state: 'Madhya Pradesh', goldDelta: 135, silverDelta: 260 },
  { city: 'Ujjain', state: 'Madhya Pradesh', goldDelta: 130, silverDelta: 250 },

  // 15. Bihar
  { city: 'Patna', state: 'Bihar', goldDelta: 180, silverDelta: 400 },
  { city: 'Gaya', state: 'Bihar', goldDelta: 190, silverDelta: 420 },
  { city: 'Muzaffarpur', state: 'Bihar', goldDelta: 190, silverDelta: 420 },
  { city: 'Bhagalpur', state: 'Bihar', goldDelta: 190, silverDelta: 420 },
  { city: 'Darbhanga', state: 'Bihar', goldDelta: 190, silverDelta: 420 },

  // 16. Odisha
  { city: 'Bhubaneswar', state: 'Odisha', goldDelta: 120, silverDelta: 250 },
  { city: 'Cuttack', state: 'Odisha', goldDelta: 120, silverDelta: 250 },
  { city: 'Rourkela', state: 'Odisha', goldDelta: 130, silverDelta: 260 },
  { city: 'Berhampur', state: 'Odisha', goldDelta: 125, silverDelta: 250 },
  { city: 'Sambalpur', state: 'Odisha', goldDelta: 130, silverDelta: 260 },

  // 17. Jharkhand
  { city: 'Ranchi', state: 'Jharkhand', goldDelta: 170, silverDelta: 350 },
  { city: 'Jamshedpur', state: 'Jharkhand', goldDelta: 170, silverDelta: 350 },
  { city: 'Dhanbad', state: 'Jharkhand', goldDelta: 170, silverDelta: 350 },
  { city: 'Bokaro', state: 'Jharkhand', goldDelta: 170, silverDelta: 350 },

  // 18. Chhattisgarh
  { city: 'Raipur', state: 'Chhattisgarh', goldDelta: 140, silverDelta: 280 },
  { city: 'Bilaspur', state: 'Chhattisgarh', goldDelta: 145, silverDelta: 290 },
  { city: 'Durg-Bhilai', state: 'Chhattisgarh', goldDelta: 140, silverDelta: 280 },

  // 19. Assam
  { city: 'Guwahati', state: 'Assam', goldDelta: 190, silverDelta: 450 },
  { city: 'Dibrugarh', state: 'Assam', goldDelta: 200, silverDelta: 480 },
  { city: 'Silchar', state: 'Assam', goldDelta: 200, silverDelta: 480 },
  { city: 'Jorhat', state: 'Assam', goldDelta: 200, silverDelta: 480 },

  // 20. Goa
  { city: 'Panaji', state: 'Goa', goldDelta: 70, silverDelta: 150 },
  { city: 'Margao', state: 'Goa', goldDelta: 70, silverDelta: 150 },

  // 21. Uttarakhand
  { city: 'Dehradun', state: 'Uttarakhand', goldDelta: 160, silverDelta: 320 },
  { city: 'Haridwar', state: 'Uttarakhand', goldDelta: 160, silverDelta: 320 },
  { city: 'Haldwani', state: 'Uttarakhand', goldDelta: 165, silverDelta: 330 },
  { city: 'Rishikesh', state: 'Uttarakhand', goldDelta: 160, silverDelta: 320 },

  // 22. Himachal Pradesh
  { city: 'Shimla', state: 'Himachal Pradesh', goldDelta: 170, silverDelta: 350 },
  { city: 'Dharamshala', state: 'Himachal Pradesh', goldDelta: 175, silverDelta: 360 },
  { city: 'Mandi', state: 'Himachal Pradesh', goldDelta: 175, silverDelta: 360 },
  { city: 'Solan', state: 'Himachal Pradesh', goldDelta: 170, silverDelta: 350 },

  // 23. Jammu & Kashmir
  { city: 'Srinagar', state: 'Jammu & Kashmir', goldDelta: 200, silverDelta: 500 },
  { city: 'Jammu', state: 'Jammu & Kashmir', goldDelta: 180, silverDelta: 400 },
  { city: 'Anantnag', state: 'Jammu & Kashmir', goldDelta: 200, silverDelta: 500 },

  // 24. Ladakh
  { city: 'Leh', state: 'Ladakh', goldDelta: 220, silverDelta: 550 },

  // 25. Puducherry
  { city: 'Puducherry', state: 'Puducherry', goldDelta: 100, silverDelta: 3400 },

  // 26. Tripura
  { city: 'Agartala', state: 'Tripura', goldDelta: 210, silverDelta: 500 },

  // 27. Meghalaya
  { city: 'Shillong', state: 'Meghalaya', goldDelta: 200, silverDelta: 480 },

  // 28. Manipur
  { city: 'Imphal', state: 'Manipur', goldDelta: 220, silverDelta: 520 },

  // 29. Nagaland
  { city: 'Kohima', state: 'Nagaland', goldDelta: 220, silverDelta: 520 },
  { city: 'Dimapur', state: 'Nagaland', goldDelta: 210, silverDelta: 500 },

  // 30. Mizoram
  { city: 'Aizawl', state: 'Mizoram', goldDelta: 220, silverDelta: 520 },

  // 31. Arunachal Pradesh
  { city: 'Itanagar', state: 'Arunachal Pradesh', goldDelta: 220, silverDelta: 520 },

  // 32. Sikkim
  { city: 'Gangtok', state: 'Sikkim', goldDelta: 190, silverDelta: 450 },

  // 33. Andaman & Nicobar Islands
  { city: 'Port Blair', state: 'Andaman & Nicobar', goldDelta: 180, silverDelta: 400 },

  // 34. Dadra & Nagar Haveli and Daman & Diu
  { city: 'Daman', state: 'Dadra & Nagar Haveli and Daman & Diu', goldDelta: 50, silverDelta: 100 },
  { city: 'Silvassa', state: 'Dadra & Nagar Haveli and Daman & Diu', goldDelta: 50, silverDelta: 100 },
];

/**
 * Computes rates for all 70+ Indian cities across all states from a single base spot price
 */
export function computeAllIndianCityRates(
  baseGold24K: number,
  baseSilverKg: number
): CityBullionRate[] {
  return ALL_INDIAN_STATE_CITIES.map((c) => {
    const gold24K = Math.round(baseGold24K + c.goldDelta);
    const gold22K = Math.round((gold24K / 24) * 22);
    const silver1Kg = Math.round(baseSilverKg + c.silverDelta);
    return {
      city: c.city,
      state: c.state,
      gold24K,
      gold22K,
      silver1Kg,
    };
  });
}
