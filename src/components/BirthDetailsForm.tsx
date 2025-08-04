import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, MapPin } from "lucide-react";
import LocationSearch from "./LocationSearch";

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

interface BirthDetailsFormProps {
  onSubmit: (details: BirthDetails) => void;
  isLoading: boolean;
}

const BirthDetailsForm = ({ onSubmit, isLoading }: BirthDetailsFormProps) => {
  const [birthDetails, setBirthDetails] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    date: new Date().getDate(),
    hours: 12,
    minutes: 0,
    seconds: 0,
    latitude: 28.6139,
    longitude: 77.2090,
    timezone: 5.5,
  });
  
  const [selectedLocation, setSelectedLocation] = useState("New Delhi, India");

  const handleLocationSelect = (lat: number, lng: number, address: string) => {
    setBirthDetails(prev => ({
      ...prev,
      latitude: lat,
      longitude: lng,
    }));
    setSelectedLocation(address);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(birthDetails);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-primary flex items-center justify-center gap-2">
          <Calendar className="w-6 h-6" />
          Birth Details
        </CardTitle>
        <p className="text-muted-foreground">Enter your birth information for accurate astrology reading</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <Calendar className="w-5 h-5 text-primary" />
              Birth Date
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  type="number"
                  value={birthDetails.year}
                  onChange={(e) => setBirthDetails(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                  min="1900"
                  max="2030"
                />
              </div>
              <div>
                <Label htmlFor="month">Month</Label>
                <Input
                  id="month"
                  type="number"
                  value={birthDetails.month}
                  onChange={(e) => setBirthDetails(prev => ({ ...prev, month: parseInt(e.target.value) }))}
                  min="1"
                  max="12"
                />
              </div>
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="number"
                  value={birthDetails.date}
                  onChange={(e) => setBirthDetails(prev => ({ ...prev, date: parseInt(e.target.value) }))}
                  min="1"
                  max="31"
                />
              </div>
            </div>
          </div>

          {/* Time Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <Clock className="w-5 h-5 text-primary" />
              Birth Time
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="hours">Hours</Label>
                <Input
                  id="hours"
                  type="number"
                  value={birthDetails.hours}
                  onChange={(e) => setBirthDetails(prev => ({ ...prev, hours: parseInt(e.target.value) }))}
                  min="0"
                  max="23"
                />
              </div>
              <div>
                <Label htmlFor="minutes">Minutes</Label>
                <Input
                  id="minutes"
                  type="number"
                  value={birthDetails.minutes}
                  onChange={(e) => setBirthDetails(prev => ({ ...prev, minutes: parseInt(e.target.value) }))}
                  min="0"
                  max="59"
                />
              </div>
              <div>
                <Label htmlFor="seconds">Seconds</Label>
                <Input
                  id="seconds"
                  type="number"
                  value={birthDetails.seconds}
                  onChange={(e) => setBirthDetails(prev => ({ ...prev, seconds: parseInt(e.target.value) }))}
                  min="0"
                  max="59"
                />
              </div>
            </div>
          </div>

          {/* Location Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <MapPin className="w-5 h-5 text-primary" />
              Birth Location
            </div>
            
            <LocationSearch onLocationSelect={handleLocationSelect} />
            
            {selectedLocation && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Selected Location:</p>
                <p className="font-medium">{selectedLocation}</p>
                <p className="text-xs text-muted-foreground">
                  Lat: {birthDetails.latitude.toFixed(4)}, Lng: {birthDetails.longitude.toFixed(4)}
                </p>
              </div>
            )}

            <div>
              <Label htmlFor="timezone">Timezone (hours from UTC)</Label>
              <Input
                id="timezone"
                type="number"
                step="0.5"
                value={birthDetails.timezone}
                onChange={(e) => setBirthDetails(prev => ({ ...prev, timezone: parseFloat(e.target.value) }))}
                min="-12"
                max="14"
              />
            </div>
          </div>

          <Button type="submit" className="w-full" variant="sacred" disabled={isLoading}>
            {isLoading ? "Generating Chart..." : "Generate Astrology Chart"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default BirthDetailsForm;