import { LiveDataVerificationPanel } from "@/components/live-data-verification-panel";
import { Navigation } from "@/components/navigation";

export default function VerificationPage() {
  // Test coordinates - Berlin (as per the provided API URLs)
  const berlinCoords = { lat: 52.52, lng: 13.41 };

  // Indian cities for testing
  const indianCities = [
    { name: "Delhi", lat: 28.6139, lng: 77.209 },
    { name: "Mumbai", lat: 19.076, lng: 72.8777 },
    { name: "Bangalore", lat: 12.9716, lng: 77.5946 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Add Navigation Component */}
      <Navigation />

      <div className="container mx-auto p-6 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">
            API Data Verification
          </h1>
          <p className="text-lg text-gray-600">
            Verify live data integration with Open-Meteo APIs
          </p>
        </div>

        {/* Berlin Test (matching provided API URLs) */}
        <LiveDataVerificationPanel
          latitude={berlinCoords.lat}
          longitude={berlinCoords.lng}
          locationName="Berlin, Germany (Test Location)"
        />

        {/* Indian Cities Tests */}
        {indianCities.map((city) => (
          <LiveDataVerificationPanel
            key={city.name}
            latitude={city.lat}
            longitude={city.lng}
            locationName={`${city.name}, India`}
          />
        ))}
      </div>
    </div>
  );
}
