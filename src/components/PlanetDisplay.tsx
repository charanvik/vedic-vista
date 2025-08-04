import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Planet {
  name: string;
  fullDegree: number;
  normDegree: number;
  isRetro: string;
  current_sign: number;
}

interface PlanetDisplayProps {
  planets: Planet[];
}

const zodiacSigns = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

const planetIcons: Record<string, string> = {
  "Sun": "☉",
  "Moon": "☽",
  "Mars": "♂",
  "Mercury": "☿",
  "Jupiter": "♃",
  "Venus": "♀",
  "Saturn": "♄",
  "Rahu": "☊",
  "Ketu": "☋",
  "Ascendant": "⇧",
  "Uranus": "♅",
  "Neptune": "♆",
  "Pluto": "♇"
};

const PlanetDisplay = ({ planets }: PlanetDisplayProps) => {
  const getZodiacSign = (signNumber: number) => {
    return zodiacSigns[signNumber - 1] || "Unknown";
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-center text-primary mb-6">Planetary Positions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {planets.map((planet, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-lg">
                <span className="flex items-center gap-2">
                  <span className="text-2xl">{planetIcons[planet.name] || "★"}</span>
                  {planet.name}
                </span>
                {planet.isRetro === "true" && (
                  <Badge variant="destructive" className="text-xs">R</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sign:</span>
                <span className="font-semibold text-secondary">
                  {getZodiacSign(planet.current_sign)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Degree:</span>
                <span className="font-mono">{planet.normDegree.toFixed(2)}°</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">House:</span>
                <span className="font-semibold">{planet.current_sign}</span>
              </div>
              {planet.isRetro === "true" && (
                <div className="text-center">
                  <Badge variant="outline" className="text-destructive border-destructive">
                    Retrograde
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PlanetDisplay;