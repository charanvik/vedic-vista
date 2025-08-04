import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import BirthDetailsForm from "@/components/BirthDetailsForm";
import PlanetDisplay from "@/components/PlanetDisplay";
import AstrologyChart from "@/components/AstrologyChart";
import { Star, Moon, Sun, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import heroImage from "@/assets/astrology-hero.jpg";

interface Planet {
  name: string;
  fullDegree: number;
  normDegree: number;
  isRetro: string;
  current_sign: number;
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
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const { toast } = useToast();

  const generateChart = async (birthDetails: BirthDetails) => {
    setIsLoading(true);
    try {
      const response = await fetch('https://json.freeastrologyapi.com/planets', {
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
      });

      if (!response.ok) {
        throw new Error('Failed to fetch astrology data');
      }

      const data = await response.json();
      
      if (data.statusCode === 200 && data.output && data.output[0]) {
        const planetData = data.output[0];
        const planetsArray: Planet[] = [];
        
        for (const key in planetData) {
          if (key !== 'debug' && planetData[key].name) {
            planetsArray.push(planetData[key]);
          }
        }
        
        setPlanets(planetsArray);
        setShowResults(true);
        
        toast({
          title: "Chart Generated Successfully",
          description: "Your astrology chart has been calculated based on your birth details.",
        });
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error generating chart:', error);
      toast({
        title: "Error",
        description: "Failed to generate astrology chart. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setShowResults(false);
    setPlanets([]);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div 
        className="relative h-96 bg-cover bg-center bg-no-repeat hindu-pattern"
        style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${heroImage})` }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white space-y-4">
            <div className="flex items-center justify-center gap-2 text-4xl md:text-6xl font-bold">
              <Star className="w-12 h-12 text-yellow-400 animate-pulse" />
              <span>Vedic Astrology</span>
              <Moon className="w-12 h-12 text-blue-200 animate-pulse" />
            </div>
            <p className="text-xl md:text-2xl font-medium">
              Discover Your Cosmic Blueprint
            </p>
            <div className="flex items-center justify-center gap-4">
              <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                <Sparkles className="w-4 h-4 mr-1" />
                Ancient Wisdom
              </Badge>
              <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                <Sun className="w-4 h-4 mr-1" />
                Modern Precision
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {!showResults ? (
          <div className="space-y-8">
            {/* Introduction */}
            <Card className="max-w-4xl mx-auto">
              <CardContent className="p-8 text-center">
                <h2 className="text-3xl font-bold text-primary mb-4">
                  Welcome to Sacred Astrology
                </h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Enter your birth details to generate a comprehensive Vedic astrology chart. 
                  Our advanced calculations use authentic Vedic principles to provide accurate 
                  planetary positions and cosmic insights.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Star className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">Planetary Positions</h3>
                    <p className="text-sm text-muted-foreground">
                      Precise calculations of all planets and cosmic points
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Moon className="w-8 h-8 text-secondary" />
                    </div>
                    <h3 className="font-semibold mb-2">Birth Chart</h3>
                    <p className="text-sm text-muted-foreground">
                      Traditional Vedic chart with house positions
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Sparkles className="w-8 h-8 text-accent" />
                    </div>
                    <h3 className="font-semibold mb-2">Cosmic Insights</h3>
                    <p className="text-sm text-muted-foreground">
                      Deep analysis based on ancient Vedic wisdom
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Birth Details Form */}
            <BirthDetailsForm onSubmit={generateChart} isLoading={isLoading} />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Header with Reset Button */}
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold text-primary">Your Astrology Chart</h1>
              <p className="text-lg text-muted-foreground">
                Explore your planetary positions and cosmic influences
              </p>
              <Button onClick={resetForm} variant="outline">
                Generate New Chart
              </Button>
            </div>

            {/* Results in Tabs */}
            <Tabs defaultValue="planets" className="w-full">
              <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
                <TabsTrigger value="planets" className="flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  Planets
                </TabsTrigger>
                <TabsTrigger value="chart" className="flex items-center gap-2">
                  <Moon className="w-4 h-4" />
                  Chart
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="planets" className="mt-8">
                <PlanetDisplay planets={planets} />
              </TabsContent>
              
              <TabsContent value="chart" className="mt-8">
                <AstrologyChart planets={planets} />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-muted/50 py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            Sacred Astrology - Connecting you with cosmic wisdom
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Built with ancient Vedic principles and modern technology
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;