import { Quote } from "lucide-react";

interface TestimonialCardProps {
  quote: string;
  author: string;
  location: string;
}

const TestimonialCard = ({ quote, author, location }: TestimonialCardProps) => {
  return (
    <div className="bg-card rounded-lg p-6 shadow-card">
      <Quote className="w-8 h-8 text-seafoam-300 mb-4" />
      <p className="text-foreground/90 leading-relaxed mb-4">&quot;{quote}&quot;</p>
      <div className="text-sm">
        <span className="font-semibold text-foreground">— {author}</span>
        <span className="text-muted-foreground">, {location}</span>
      </div>
    </div>
  );
};

export default TestimonialCard;
