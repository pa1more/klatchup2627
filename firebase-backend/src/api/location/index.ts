import { Router, Request, Response } from 'express';
import { verifyAuth } from '../../middleware/auth';

const router = Router();

// POST /location - Search nearby places (using Google Places API)
router.post('/', verifyAuth, async (req: Request, res: Response) => {
  try {
    const { latitude, longitude, radiusMeters = 5000, placeTypes = ['restaurant', 'cafe', 'bar', 'night_club', 'movie_theater', 'park', 'gym', 'bowling_alley', 'sports_bar', 'coffee_shop', 'amusement_park'] } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({
        message: 'latitude and longitude are required',
        type: 'VALIDATION_ERROR',
      });
    }

    // Call Google Places API
    const googleKey = process.env.GOOGLE_PLACES_API_KEY;
    if (!googleKey) {
      return res.status(500).json({
        message: 'Google API key not configured',
        type: 'CONFIG_ERROR',
      });
    }

    const url = 'https://places.googleapis.com/v1/places:searchNearby';
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': googleKey,
        'X-Goog-FieldMask': 'places.displayName,places.id,places.formattedAddress,places.types',
      },
      body: JSON.stringify({
        includedTypes: placeTypes,
        maxResultCount: 20,
        locationRestriction: {
          circle: {
            center: {
              latitude: parseFloat(latitude),
              longitude: parseFloat(longitude),
            },
            radius: radiusMeters,
          },
        },
      }),
    };

    const response = await fetch(url, options);
    const places: any = await response.json();

    if (!response.ok) {
      throw new Error(places.error?.message || 'Failed to fetch places');
    }

    // Transform places to extract displayName.text and filter out residential places
    const transformedPlaces = (places.places || [])
      .filter((place: any) => {
        // Exclude residential and housing-related types
        const types = place.types || [];
        const excludedTypes = [
          'housing_complex',
          'residential_area', 
          'sublocality',
          'sublocality_level_1',
          'sublocality_level_2',
          'sublocality_level_3',
          'locality',
          'neighborhood',
          'premise',
          'plus_code',
          'political',
          'postal_code',
          'administrative_area',
          'subpremise'
        ];
        
        // If the place ONLY has these types (and maybe point_of_interest/establishment), exclude it
        const nonExcludedTypes = types.filter((type: string) => 
          !excludedTypes.includes(type) && 
          type !== 'point_of_interest' && 
          type !== 'establishment'
        );
        
        // Keep the place if it has at least one non-excluded type (like restaurant, cafe, bar, etc.)
        return nonExcludedTypes.length > 0;
      })
      .map((place: any) => ({
        name: place.name,
        id: place.id,
        displayName: place.displayName?.text || place.displayName || 'Unknown',
        formattedAddress: place.formattedAddress || '',
        types: place.types || [],
      }));

    res.status(200).json({
      places: transformedPlaces,
      latitude,
      longitude,
    });
  } catch (error: any) {
    console.error('Error fetching places:', error);
    res.status(404).json({
      message: error.message || 'Location not found',
      type: 'LOCATION_NOT_FOUND',
    });
  }
});

export default router;
