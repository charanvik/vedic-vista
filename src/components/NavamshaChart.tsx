
import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface NavamshaPlanet {
  name: string;
  isRetro: string;
  current_sign: number;
  house_number: number;
}

interface NavamshaChartProps {
  planets: NavamshaPlanet[];
}

const NavamshaChart = ({ planets }: NavamshaChartProps) => {
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

    const renderNavamshaChart = () => {
      // Group planets by house number (not sign like birth chart)
      const housesWithPlanets: Record<string, NavamshaPlanet[]> = {};
      
      planets.forEach(planet => {
        if (planet && planet.name && typeof planet.house_number === 'number') {
          // Shift planets one house backward to fix positioning
          let adjustedHouseNumber = planet.house_number - 1;
          if (adjustedHouseNumber <= 0) adjustedHouseNumber = 12;
          const houseId = `house${adjustedHouseNumber}`;
          if (!housesWithPlanets[houseId]) housesWithPlanets[houseId] = [];
          housesWithPlanets[houseId].push(planet);
        }
      });

      // Render planets in houses based on house_number
      for (let i = 1; i <= 12; i++) {
        const houseId = `house${i}`;
        const housePolygon = svg.querySelector(`#${houseId}`) as SVGPolygonElement;
        if (!housePolygon) continue;

        const bbox = housePolygon.getBBox();

        if (housesWithPlanets[houseId]) {
          const planetsInHouse = housesWithPlanets[houseId];

          planetsInHouse.forEach((planet, index) => {
            const textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            const centerX = bbox.x + bbox.width / 2;
            const startY = (bbox.y + bbox.height / 2) - ((planetsInHouse.length - 1) * 18) / 2;

            textElement.setAttribute('x', centerX.toString());
            textElement.setAttribute('y', (startY + (index * 18)).toString());
            textElement.textContent = `${planetSymbols[planet.name] || planet.name.substring(0,2)}`;

            textElement.classList.add('planet-label');
            if (planet.name === "Ascendant") textElement.classList.add('ascendant-label');
            if (planet.isRetro === "true") textElement.classList.add('retrograde');

            svg.appendChild(textElement);
          });
        } else {
          const textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          textElement.setAttribute('x', (bbox.x + bbox.width / 2).toString());
          textElement.setAttribute('y', (bbox.y + bbox.height / 2).toString());
          textElement.textContent = `${i}`;
          textElement.classList.add('planet-label', 'empty-house-marker');
          svg.appendChild(textElement);
        }
      }
    };

    renderNavamshaChart();
  }, [planets]);

  return (
    <Card className="w-full mx-auto border-0 shadow-none">
      <CardHeader className="pb-1 pt-2">
        <CardTitle className="text-base font-bold text-center text-primary font-orbitron">
          Navamsha Chart
        </CardTitle>
      </CardHeader>
      <CardContent className="px-1 pb-2">
        <svg
          ref={svgRef}
          className="w-full h-auto bg-card rounded-lg border border-primary/20 shadow-lg"
          viewBox="0 0 780 780"
          preserveAspectRatio="xMidYMid meet"
          style={{
            filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.1))',
            minHeight: '320px',
            maxHeight: '400px'
          }}
        >
          {/* House polygons - same layout as birth chart */}
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
              font-size: 12px;
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
              font-size: 14px;
            }
          `}</style>
        </svg>
      </CardContent>
    </Card>
  );
};

export default NavamshaChart;
