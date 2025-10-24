import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, DollarSign, TrendingUp, Car } from 'lucide-react';

interface PricingData {
  year: number;
  make: string;
  model: string;
  mileage: number;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
}

const InteractivePricingCalculator: React.FC = () => {
  const [pricingData, setPricingData] = useState<PricingData>({
    year: new Date().getFullYear() - 5,
    make: '',
    model: '',
    mileage: 50000,
    condition: 'good'
  });

  const [estimatedValue, setEstimatedValue] = useState<number | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateValue = () => {
    setIsCalculating(true);
    
    // Simulate calculation delay
    setTimeout(() => {
      // Simple calculation based on year, mileage, and condition
      const baseValue = 15000; // Base value
      const yearDepreciation = (new Date().getFullYear() - pricingData.year) * 2000;
      const mileageDepreciation = Math.max(0, (pricingData.mileage - 30000) * 0.1);
      
      let conditionMultiplier = 1;
      switch (pricingData.condition) {
        case 'excellent':
          conditionMultiplier = 1.1;
          break;
        case 'good':
          conditionMultiplier = 1.0;
          break;
        case 'fair':
          conditionMultiplier = 0.85;
          break;
        case 'poor':
          conditionMultiplier = 0.7;
          break;
      }
      
      const calculatedValue = Math.max(1000, (baseValue - yearDepreciation - mileageDepreciation) * conditionMultiplier);
      setEstimatedValue(Math.round(calculatedValue));
      setIsCalculating(false);
    }, 1500);
  };

  const conditionOptions = [
    { value: 'excellent', label: 'Excellent', description: 'Like new, no issues' },
    { value: 'good', label: 'Good', description: 'Minor wear, well maintained' },
    { value: 'fair', label: 'Fair', description: 'Some wear, needs minor repairs' },
    { value: 'poor', label: 'Poor', description: 'Significant wear or damage' }
  ];

  return (
    <Card className="w-full max-w-2xl mx-auto" role="region" aria-labelledby="calculator-title">
      <CardHeader>
        <CardTitle id="calculator-title" className="flex items-center gap-2">
          <Calculator className="w-5 h-5" aria-hidden="true" />
          Interactive Car Value Calculator
        </CardTitle>
        <CardDescription>
          Get an instant estimate of your car's value to help with pricing decisions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="year">Year</Label>
            <Input
              id="year"
              type="number"
              value={pricingData.year}
              onChange={(e) => setPricingData(prev => ({ ...prev, year: parseInt(e.target.value) || 0 }))}
              min="1990"
              max={new Date().getFullYear()}
              aria-describedby="year-help"
            />
            <p id="year-help" className="text-sm text-muted-foreground">Vehicle model year</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="mileage">Mileage</Label>
            <Input
              id="mileage"
              type="number"
              value={pricingData.mileage}
              onChange={(e) => setPricingData(prev => ({ ...prev, mileage: parseInt(e.target.value) || 0 }))}
              min="0"
              aria-describedby="mileage-help"
            />
            <p id="mileage-help" className="text-sm text-muted-foreground">Total miles on odometer</p>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="condition">Condition</Label>
          <div className="grid grid-cols-2 gap-2">
            {conditionOptions.map((option) => (
              <label
                key={option.value}
                className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-muted/50"
                htmlFor={`condition-${option.value}`}
              >
                <input
                  id={`condition-${option.value}`}
                  type="radio"
                  name="condition"
                  value={option.value}
                  checked={pricingData.condition === option.value}
                  onChange={(e) => setPricingData(prev => ({ ...prev, condition: e.target.value as any }))}
                  className="sr-only"
                />
                <div className="flex-1">
                  <div className="font-medium">{option.label}</div>
                  <div className="text-sm text-muted-foreground">{option.description}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <Button 
          onClick={calculateValue} 
          disabled={isCalculating}
          className="w-full"
          aria-describedby="calculate-help"
        >
          {isCalculating ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" aria-hidden="true" />
              Calculating...
            </>
          ) : (
            <>
              <Calculator className="w-4 h-4 mr-2" aria-hidden="true" />
              Calculate Value
            </>
          )}
        </Button>
        <p id="calculate-help" className="text-sm text-muted-foreground text-center">
          This is a basic estimate. For accurate pricing, use our comprehensive pricing guide.
        </p>

        {estimatedValue && (
          <div className="bg-gradient-to-r from-pacific-50 to-seafoam-50 p-6 rounded-lg border border-pacific-200">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-pacific-600" aria-hidden="true" />
                <span className="text-sm font-medium text-pacific-700">Estimated Value</span>
              </div>
              <div className="text-3xl font-bold text-pacific-900 mb-2">
                ${estimatedValue.toLocaleString()}
              </div>
              <p className="text-sm text-pacific-700 mb-4">
                Based on {pricingData.year} vehicle with {pricingData.mileage.toLocaleString()} miles in {pricingData.condition} condition
              </p>
              <div className="flex items-center justify-center gap-4 text-sm text-pacific-600">
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" aria-hidden="true" />
                  <span>Market range: ${Math.round(estimatedValue * 0.9).toLocaleString()} - ${Math.round(estimatedValue * 1.1).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-muted/50 p-4 rounded-lg">
          <div className="flex items-start gap-3">
            <Car className="w-5 h-5 text-muted-foreground mt-0.5" aria-hidden="true" />
            <div>
              <h4 className="font-medium mb-1">Want More Accurate Pricing?</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Our comprehensive pricing guide includes KBB values, market comparisons, and condition adjustments for precise pricing.
              </p>
              <Button variant="outline" size="sm">
                Get Pricing Guide
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InteractivePricingCalculator;
