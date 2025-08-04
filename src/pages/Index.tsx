import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BirthDetailsForm from "@/components/BirthDetailsForm";
import PlanetDisplay from "@/components/PlanetDisplay";
import AstrologyChart from "@/components/AstrologyChart";
import NavamshaChart from "@/components/NavamshaChart";
import { Star, Moon, Sun } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import heroImage from "@/assets/astrology-hero.jpg";
interface Planet {
  name: string;
  fullDegree: number;
  normDegree: number;
  isRetro: string;
  current_sign: number;
}
interface NavamshaPlanet {
  name: string;
  isRetro: string;
  current_sign: number;
  house_number: number;
}
interface BirthDetails {
  year: number;
  month: number;
  date: number;
  hours: number;
  minutes: number;
  seconds: number;
  latitude: number;
  longitude: number;
  timezone: number;
}
const Index = () => {
  const [planets, setPlanets] = useState<Planet[]>([]);
  const [navamshaPlanets, setNavamshaPlanets] = useState<NavamshaPlanet[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const {
    toast
  } = useToast();
  const generateChart = async (birthDetails: BirthDetails) => {
    setIsLoading(true);
    try {
      // Fetch both charts simultaneously
      const [planetsResponse, navamshaResponse] = await Promise.all([fetch('https://json.freeastrologyapi.com/planets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'y9Jkhkq1ot9iLwQTCqicG7FlllPYblPR47F8kCxT'
        },
        body: JSON.stringify({
          ...birthDetails,
          settings: {
            observation_point: "topocentric",
            ayanamsha: "lahiri"
          }
        })
      }), fetch('https://json.freeastrologyapi.com/navamsa-chart-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'y9Jkhkq1ot9iLwQTCqicG7FlllPYblPR47F8kCxT'
        },
        body: JSON.stringify({
          ...birthDetails,
          settings: {
            observation_point: "topocentric",
            ayanamsha: "lahiri"
          }
        })
      })]);
      if (!planetsResponse.ok || !navamshaResponse.ok) {
        throw new Error('Failed to fetch astrology data');
      }
      const [planetsData, navamshaData] = await Promise.all([planetsResponse.json(), navamshaResponse.json()]);

      // Process planets data
      if (planetsData.statusCode === 200 && planetsData.output && planetsData.output[0]) {
        const planetData = planetsData.output[0];
        const planetsArray: Planet[] = [];
        for (const key in planetData) {
          if (key !== 'debug' && planetData[key].name) {
            planetsArray.push(planetData[key]);
          }
        }
        setPlanets(planetsArray);
      }

      // Process navamsha data
      if (navamshaData.statusCode === 200 && navamshaData.output) {
        const navamshaArray: NavamshaPlanet[] = [];
        for (const key in navamshaData.output) {
          if (navamshaData.output[key].name) {
            navamshaArray.push(navamshaData.output[key]);
          }
        }
        setNavamshaPlanets(navamshaArray);
      }
      setShowResults(true);
      toast({
        title: "Charts Generated Successfully",
        description: "Your astrology charts have been calculated."
      });
    } catch (error) {
      console.error('Error generating chart:', error);
      toast({
        title: "Error",
        description: "Failed to generate astrology charts. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  const resetForm = () => {
    setShowResults(false);
    setPlanets([]);
    setNavamshaPlanets([]);
  };
  return <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-64 bg-cover bg-center bg-no-repeat" style={{
      backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${heroImage})`
    }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">ASTRO MANJITH</h1>
            <p className="text-lg">Professional Chart Analysis</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {!showResults ? <BirthDetailsForm onSubmit={generateChart} isLoading={isLoading} /> : <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-primary mb-2">Your Astrology Charts</h2>
              <Button onClick={resetForm} variant="outline" size="sm">
                Generate New Chart
              </Button>
            </div>

            <Tabs defaultValue="planets" className="w-full">
              <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto">
                <TabsTrigger value="planets" className="flex items-center gap-1">
                  <Star className="w-4 h-4" />
                  Planets
                </TabsTrigger>
                <TabsTrigger value="chart" className="flex items-center gap-1">
                  <Moon className="w-4 h-4" />
                  Birth Chart
                </TabsTrigger>
                <TabsTrigger value="navamsha" className="flex items-center gap-1">
                  <Sun className="w-4 h-4" />
                  Navamsha
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="planets" className="mt-6">
                <PlanetDisplay planets={planets} />
              </TabsContent>
              
              <TabsContent value="chart" className="mt-6">
                <AstrologyChart planets={planets} />
              </TabsContent>
              
              <TabsContent value="navamsha" className="mt-6">
                <NavamshaChart planets={navamshaPlanets} />
              </TabsContent>
            </Tabs>
          </div>}
      </div>
    </div>;
};
export default Index;