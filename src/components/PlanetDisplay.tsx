import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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

  // Filter out invalid planets and exclude Ascendant for karaka calculations
  const validPlanets = planets.filter(planet => 
    planet && 
    planet.name && 
    typeof planet.normDegree === 'number' && 
    typeof planet.current_sign === 'number'
  );

  const planetsForKaraka = validPlanets.filter(planet => planet.name !== "Ascendant");

  if (validPlanets.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No valid planetary data available.</p>
      </div>
    );
  }

  // Calculate Atmakaraka (highest degree) and Darakaraka (lowest degree)
  const atmakaraka = planetsForKaraka.reduce((prev, current) => 
    (prev.normDegree > current.normDegree) ? prev : current
  );
  
  const darakaraka = planetsForKaraka.reduce((prev, current) => 
    (prev.normDegree < current.normDegree) ? prev : current
  );

  return (
    <div className="space-y-4">
      <Card className="shadow-sm border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-primary font-orbitron">Planetary Positions</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b">
                <TableHead className="text-xs font-semibold">Planet</TableHead>
                <TableHead className="text-xs font-semibold">Sign</TableHead>
                <TableHead className="text-xs font-semibold">Degree</TableHead>
                <TableHead className="text-xs font-semibold">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {validPlanets.map((planet, index) => (
                <TableRow key={index} className="border-b last:border-b-0">
                  <TableCell className="py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{planetIcons[planet.name] || "★"}</span>
                      <span className="font-medium text-sm">{planet.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-3">
                    <span className="text-sm text-muted-foreground">
                      {getZodiacSign(planet.current_sign)}
                    </span>
                  </TableCell>
                  <TableCell className="py-3">
                    <span className="font-mono text-sm font-medium">
                      {typeof planet.normDegree === 'number' ? planet.normDegree.toFixed(1) : '0.0'}°
                    </span>
                  </TableCell>
                  <TableCell className="py-3">
                    {planet.isRetro === "true" && (
                      <Badge variant="destructive" className="text-xs">R</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Karaka Section */}
      <div className="grid grid-cols-1 gap-3">
        <Card className="shadow-sm border border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-sm text-primary">Atmakaraka (Soul)</h3>
                <p className="text-xs text-muted-foreground">Highest degree planet</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{planetIcons[atmakaraka.name] || "★"}</span>
                  <div>
                    <span className="font-semibold text-sm">{atmakaraka.name}</span>
                    <div className="font-mono text-xs text-muted-foreground">
                      {atmakaraka.normDegree.toFixed(1)}°
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-sm text-primary">Darakaraka (Spouse)</h3>
                <p className="text-xs text-muted-foreground">Lowest degree planet</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{planetIcons[darakaraka.name] || "★"}</span>
                  <div>
                    <span className="font-semibold text-sm">{darakaraka.name}</span>
                    <div className="font-mono text-xs text-muted-foreground">
                      {darakaraka.normDegree.toFixed(1)}°
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PlanetDisplay;
