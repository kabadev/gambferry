import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Step = {
  number: number;
  title: string;
};

const steps: Step[] = [
  { number: 1, title: "Trip Details" },
  { number: 2, title: "Passenger Info" },
  { number: 3, title: "Payment" },
];

export function MultiStepProgress({ currentStep }: { currentStep: number }) {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors",
                  currentStep > step.number
                    ? "border-primary bg-primary text-primary-foreground"
                    : currentStep === step.number
                    ? "border-primary bg-background text-primary"
                    : "border-muted bg-background text-muted-foreground"
                )}
              >
                {currentStep > step.number ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <span className="font-semibold">{step.number}</span>
                )}
              </div>
              <span
                className={cn(
                  "mt-2 text-sm font-medium",
                  currentStep >= step.number
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "h-0.5 flex-1 mx-4 transition-colors",
                  currentStep > step.number ? "bg-primary" : "bg-muted"
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
