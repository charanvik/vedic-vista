
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
  const currentDate = new Date();
  const [birthDetails, setBirthDetails] = useState({
    year: currentDate.getFullYear(),
    month: currentDate.getMonth() + 1,
    date: currentDate.getDate(),
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

  const handleNumberChange = (field: keyof typeof birthDetails, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) || value === '' || value === '-') {
      setBirthDetails(prev => ({
        ...prev,
        [field]: value === '' || value === '-' ? 0 : numValue,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = Object.values(birthDetails).every(value => 
      typeof value === 'number' && !isNaN(value)
    );
    
    if (isValid) {
      onSubmit(birthDetails);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-primary">Birth Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 font-semibold">
              <Calendar className="w-5 h-5 text-primary" />
              Date
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  type="number"
                  value={birthDetails.year}
                  onChange={(e) => handleNumberChange('year', e.target.value)}
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
                  onChange={(e) => handleNumberChange('month', e.target.value)}
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
                  onChange={(e) => handleNumberChange('date', e.target.value)}
                  min="1"
                  max="31"
                />
              </div>
            </div>
          </div>

          {/* Time Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 font-semibold">
              <Clock className="w-5 h-5 text-primary" />
              Time
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="hours">Hours</Label>
                <Input
                  id="hours"
                  type="number"
                  value={birthDetails.hours}
                  onChange={(e) => handleNumberChange('hours', e.target.value)}
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
                  onChange={(e) => handleNumberChange('minutes', e.target.value)}
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
                  onChange={(e) => handleNumberChange('seconds', e.target.value)}
                  min="0"
                  max="59"
                />
              </div>
            </div>
          </div>

          {/* Location Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 font-semibold">
              <MapPin className="w-5 h-5 text-primary" />
              Location
            </div>
            
            <LocationSearch onLocationSelect={handleLocationSelect} />
            
            {selectedLocation && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="font-medium">{selectedLocation}</p>
                <p className="text-xs text-muted-foreground">
                  {birthDetails.latitude.toFixed(4)}, {birthDetails.longitude.toFixed(4)}
                </p>
              </div>
            )}

            <div>
              <Label htmlFor="timezone">Timezone (UTC offset)</Label>
              <Input
                id="timezone"
                type="number"
                step="0.5"
                value={birthDetails.timezone}
                onChange={(e) => handleNumberChange('timezone', e.target.value)}
                min="-12"
                max="14"
              />
            </div>
          </div>

          <Button type="submit" className="w-full" variant="sacred" disabled={isLoading}>
            {isLoading ? "Generating Charts..." : "Generate Charts"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default BirthDetailsForm;
