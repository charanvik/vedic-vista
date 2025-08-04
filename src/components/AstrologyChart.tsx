import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Planet {
  name: string;
  fullDegree: number;
  normDegree: number;
  isRetro: string;
  current_sign: number;
}

interface AstrologyChartProps {
  planets: Planet[];
}

const AstrologyChart = ({ planets }: AstrologyChartProps) => {
  const svgRef = useRef<SVGSVGElement>(null);

  const planetSymbols: Record<string, string> = {
    "Ascendant": "As",
    "Sun": "Su",
    "Moon": "Mo",
    "Mars": "Ma",
    "Mercury": "Me",
    "Jupiter": "Ju",
    "Venus": "Ve",
    "Saturn": "Sa",
    "Rahu": "Ra",
    "Ketu": "Ke",
    "Uranus": "Ur",
    "Neptune": "Ne",
    "Pluto": "Pl"
  };

  useEffect(() => {
    if (!svgRef.current || !planets.length) return;

    const svg = svgRef.current;
    
    // Clear existing planet labels
    const existingLabels = svg.querySelectorAll('.planet-label, .empty-house-marker');
    existingLabels.forEach(label => label.remove());

    const parseAstroData = (planetData: Planet[]) => {
      const parsedData: Record<string, any> = {};
      planetData.forEach(planet => {
        if (planet && planet.name && typeof planet.normDegree === 'number' && typeof planet.current_sign === 'number') {
          parsedData[planet.name] = {
            name: planet.name,
            sign: planet.current_sign,
            isRetro: planet.isRetro === 'true',
            degree: planet.normDegree
          };
        }
      });
      return parsedData;
    };

    const createSignToHouseMap = (ascendantSign: number) => {
      const antiClockwiseHouseIds = [
        'house1', 'house2', 'house3', 'house4', 'house5', 'house6',
        'house7', 'house8', 'house9', 'house10', 'house11', 'house12'
      ];
      const signToHouseIdMap: Record<number, string> = {};
      
      for (let i = 0; i < 12; i++) {
        const signNumber = (ascendantSign - 1 + i) % 12 + 1;
        const physicalHouseId = antiClockwiseHouseIds[i];
        signToHouseIdMap[signNumber] = physicalHouseId;
      }
      return signToHouseIdMap;
    };

    const renderChart = (astroData: Record<string, any>) => {
      if (!astroData.Ascendant) {
        console.error("Ascendant data is missing.");
        return;
      }

      const ascendantSign = astroData.Ascendant.sign;
      const signToHouseMap = createSignToHouseMap(ascendantSign);
      const housesWithPlanets: Record<string, any[]> = {};

      // Group planets by house
      for (const planetName in astroData) {
        const planet = astroData[planetName];
        const houseId = signToHouseMap[planet.sign];
        if (houseId) {
          if (!housesWithPlanets[houseId]) housesWithPlanets[houseId] = [];
          housesWithPlanets[houseId].push(planet);
        }
      }

      const houseIdToSignMap: Record<string, number> = {};
      for (const sign in signToHouseMap) {
        houseIdToSignMap[signToHouseMap[sign]] = parseInt(sign);
      }

      // Render planets in houses
      for (let i = 1; i <= 12; i++) {
        const houseId = `house${i}`;
        const housePolygon = svg.querySelector(`#${houseId}`) as SVGPolygonElement;
        if (!housePolygon) continue;

        const bbox = housePolygon.getBBox();

        if (housesWithPlanets[houseId]) {
          const planetsInHouse = housesWithPlanets[houseId];
          const displayedSignsInHouse = new Set();

          planetsInHouse.forEach((planetInfo, index) => {
            const textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            const centerX = bbox.x + bbox.width / 2;
            const startY = (bbox.y + bbox.height / 2) - ((planetsInHouse.length - 1) * 22) / 2;

            textElement.setAttribute('x', centerX.toString());
            textElement.setAttribute('y', (startY + (index * 22)).toString());

            if (displayedSignsInHouse.has(planetInfo.sign)) {
              textElement.textContent = `${planetSymbols[planetInfo.name]} ${Math.round(planetInfo.degree)}°`;
            } else {
              textElement.textContent = `${planetSymbols[planetInfo.name]} ${Math.round(planetInfo.degree)}° (${planetInfo.sign})`;
              displayedSignsInHouse.add(planetInfo.sign);
            }

            textElement.classList.add('planet-label');
            if (planetInfo.name === "Ascendant") textElement.classList.add('ascendant-label');
            if (planetInfo.isRetro) textElement.classList.add('retrograde');

            svg.appendChild(textElement);
          });
        } else {
          const signForThisHouse = houseIdToSignMap[houseId];
          const textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          textElement.setAttribute('x', (bbox.x + bbox.width / 2).toString());
          textElement.setAttribute('y', (bbox.y + bbox.height / 2).toString());
          textElement.textContent = `(${signForThisHouse})`;
          textElement.classList.add('planet-label', 'empty-house-marker');
          svg.appendChild(textElement);
        }
      }
    };

    const astroData = parseAstroData(planets);
    renderChart(astroData);
  }, [planets]);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-primary">
          Vedic Astrology Chart
        </CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center">
        <svg
          ref={svgRef}
          className="w-full h-auto bg-background rounded-xl border max-w-2xl"
          viewBox="0 0 780 800"
          preserveAspectRatio="xMidYMid meet"
          style={{
            filter: 'drop-shadow(0 10px 25px rgba(0,0,0,0.1))'
          }}
        >
          {/* House polygons */}
          <polygon className="fill-background stroke-border stroke-2 hover:fill-muted transition-colors" points="400 100,250 250,400 400,550 250" id="house1" />
          <polygon className="fill-background stroke-border stroke-2 hover:fill-muted transition-colors" points="100 100, 250 250,400 100" id="house2" />
          <polygon className="fill-background stroke-border stroke-2 hover:fill-muted transition-colors" points="100 400,250 250,100 100" id="house3" />
          <polygon className="fill-background stroke-border stroke-2 hover:fill-muted transition-colors" points="250 250,100 400,250 550,400 400" id="house4" />
          <polygon className="fill-background stroke-border stroke-2 hover:fill-muted transition-colors" points="100 400,250 550,100 700" id="house5" />
          <polygon className="fill-background stroke-border stroke-2 hover:fill-muted transition-colors" points="100 700,250 550,400 700" id="house6" />
          <polygon className="fill-background stroke-border stroke-2 hover:fill-muted transition-colors" points="400 400,250 550,400 700,550 550" id="house7" />
          <polygon className="fill-background stroke-border stroke-2 hover:fill-muted transition-colors" points="400 700,550 550,700 700" id="house8" />
          <polygon className="fill-background stroke-border stroke-2 hover:fill-muted transition-colors" points="700 400,550 550,700 700" id="house9" />
          <polygon className="fill-background stroke-border stroke-2 hover:fill-muted transition-colors" points="550 250,700 400,550 550,400 400" id="house10" />
          <polygon className="fill-background stroke-border stroke-2 hover:fill-muted transition-colors" points="700 100,550 250,700 400" id="house11" />
          <polygon className="fill-background stroke-border stroke-2 hover:fill-muted transition-colors" points="400 100,550 250,700 100" id="house12" />

          <style>{`
            .planet-label {
              font-family: 'Inter', sans-serif;
              font-size: 13px;
              font-weight: bold;
              fill: hsl(var(--foreground));
              text-anchor: middle;
              dominant-baseline: middle;
              pointer-events: none;
            }
            .planet-label.retrograde {
              fill: hsl(var(--destructive));
            }
            .ascendant-label {
              fill: hsl(var(--primary));
            }
            .empty-house-marker {
              fill: hsl(var(--muted-foreground));
              font-size: 16px;
            }
          `}</style>
        </svg>
      </CardContent>
    </Card>
  );
};

export default AstrologyChart;