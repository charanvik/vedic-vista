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

  // Filter out invalid planets and add safety checks
  const validPlanets = planets.filter(planet => 
    planet && 
    planet.name && 
    typeof planet.normDegree === 'number' && 
    typeof planet.current_sign === 'number'
  );

  if (validPlanets.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No valid planetary data available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-3">
        {validPlanets.map((planet, index) => (
          <Card key={index} className="shadow-sm border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{planetIcons[planet.name] || "★"}</span>
                  <div>
                    <h3 className="font-semibold text-base">{planet.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {getZodiacSign(planet.current_sign)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-sm font-medium">
                    {typeof planet.normDegree === 'number' ? planet.normDegree.toFixed(1) : '0.0'}°
                  </div>
                  {planet.isRetro === "true" && (
                    <Badge variant="destructive" className="text-xs mt-1">R</Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PlanetDisplay;