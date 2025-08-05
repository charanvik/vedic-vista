import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  const [timeFormat, setTimeFormat] = useState({ 
    hours: 12, 
    minutes: 0, 
    seconds: 0, 
    period: 'PM' as 'AM' | 'PM' 
  });

  // Function to fetch timezone from coordinates
  const fetchTimezone = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://timeapi.io/api/TimeZone/coordinate?latitude=${lat}&longitude=${lng}`
      );
      const data = await response.json();
      return data.currentUtcOffset?.seconds ? data.currentUtcOffset.seconds / 3600 : 0;
    } catch (error) {
      console.error("Error fetching timezone:", error);
      // Fallback to rough timezone estimation
      return Math.round(lng / 15);
    }
  };

  const handleLocationSelect = async (lat: number, lng: number, address: string) => {
    const timezone = await fetchTimezone(lat, lng);
    setBirthDetails(prev => ({
      ...prev,
      latitude: lat,
      longitude: lng,
      timezone: timezone,
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

  // Convert 12-hour format to 24-hour format
  const convertTo24Hour = (hours: number, period: 'AM' | 'PM') => {
    if (period === 'AM') {
      return hours === 12 ? 0 : hours;
    } else {
      return hours === 12 ? 12 : hours + 12;
    }
  };

  // Handle time format changes
  const handleTimeChange = (field: 'hours' | 'minutes' | 'seconds', value: string) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue) || value === '') {
      const newValue = value === '' ? 0 : numValue;
      setTimeFormat(prev => ({ ...prev, [field]: newValue }));
      
      // Update birth details with 24-hour format
      if (field === 'hours') {
        const hours24 = convertTo24Hour(newValue, timeFormat.period);
        setBirthDetails(prev => ({ ...prev, hours: hours24 }));
      } else {
        setBirthDetails(prev => ({ ...prev, [field]: newValue }));
      }
    }
  };

  const handlePeriodChange = (period: 'AM' | 'PM') => {
    setTimeFormat(prev => ({ ...prev, period }));
    const hours24 = convertTo24Hour(timeFormat.hours, period);
    setBirthDetails(prev => ({ ...prev, hours: hours24 }));
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
    <Card className="mx-1 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-primary">Birth Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Date Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-semibold text-sm">
              <Calendar className="w-4 h-4 text-primary" />
              Date of Birth
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label htmlFor="year" className="text-xs text-muted-foreground">Year</Label>
                <Input
                  id="year"
                  type="number"
                  value={birthDetails.year}
                  onChange={(e) => handleNumberChange('year', e.target.value)}
                  min="1900"
                  max="2030"
                  className="h-12 text-center"
                />
              </div>
              <div>
                <Label htmlFor="month" className="text-xs text-muted-foreground">Month</Label>
                <Input
                  id="month"
                  type="number"
                  value={birthDetails.month}
                  onChange={(e) => handleNumberChange('month', e.target.value)}
                  min="1"
                  max="12"
                  className="h-12 text-center"
                />
              </div>
              <div>
                <Label htmlFor="date" className="text-xs text-muted-foreground">Date</Label>
                <Input
                  id="date"
                  type="number"
                  value={birthDetails.date}
                  onChange={(e) => handleNumberChange('date', e.target.value)}
                  min="1"
                  max="31"
                  className="h-12 text-center"
                />
              </div>
            </div>
          </div>

          {/* Time Section with AM/PM */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-semibold text-sm">
              <Clock className="w-4 h-4 text-primary" />
              Time of Birth
            </div>
            <div className="grid grid-cols-4 gap-2">
              <div>
                <Label htmlFor="hours" className="text-xs text-muted-foreground">Hours</Label>
                <Input
                  id="hours"
                  type="number"
                  value={timeFormat.hours}
                  onChange={(e) => handleTimeChange('hours', e.target.value)}
                  min="1"
                  max="12"
                  className="h-12 text-center"
                />
              </div>
              <div>
                <Label htmlFor="minutes" className="text-xs text-muted-foreground">Minutes</Label>
                <Input
                  id="minutes"
                  type="number"
                  value={timeFormat.minutes}
                  onChange={(e) => handleTimeChange('minutes', e.target.value)}
                  min="0"
                  max="59"
                  className="h-12 text-center"
                />
              </div>
              <div>
                <Label htmlFor="seconds" className="text-xs text-muted-foreground">Seconds</Label>
                <Input
                  id="seconds"
                  type="number"
                  value={timeFormat.seconds}
                  onChange={(e) => handleTimeChange('seconds', e.target.value)}
                  min="0"
                  max="59"
                  className="h-12 text-center"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">AM/PM</Label>
                <Select value={timeFormat.period} onValueChange={handlePeriodChange}>
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AM">AM</SelectItem>
                    <SelectItem value="PM">PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="text-xs text-muted-foreground text-center">
              24-hour format: {birthDetails.hours.toString().padStart(2, '0')}:{birthDetails.minutes.toString().padStart(2, '0')}:{birthDetails.seconds.toString().padStart(2, '0')}
            </div>
          </div>

          {/* Location Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-semibold text-sm">
              <MapPin className="w-4 h-4 text-primary" />
              Birth Location
            </div>
            
            <LocationSearch onLocationSelect={handleLocationSelect} />
            
            {selectedLocation && (
              <div className="p-3 bg-muted/50 rounded-lg border">
                <p className="font-medium text-sm">{selectedLocation}</p>
                <p className="text-xs text-muted-foreground">
                  {birthDetails.latitude.toFixed(4)}, {birthDetails.longitude.toFixed(4)}
                </p>
              </div>
            )}

            <div>
              <Label htmlFor="timezone" className="text-xs text-muted-foreground">Timezone (UTC offset) - Auto-detected</Label>
              <Input
                id="timezone"
                type="number"
                step="0.5"
                value={birthDetails.timezone}
                onChange={(e) => handleNumberChange('timezone', e.target.value)}
                min="-12"
                max="14"
                className="h-12 text-center bg-muted/30"
                placeholder="Auto-detected timezone"
              />
              <div className="text-xs text-muted-foreground mt-1 text-center">
                UTC {birthDetails.timezone >= 0 ? '+' : ''}{birthDetails.timezone}
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full h-12 text-base font-semibold" variant="sacred" disabled={isLoading}>
            {isLoading ? "Generating Charts..." : "Generate Charts"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default BirthDetailsForm;