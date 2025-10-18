interface StepCardProps {
  number: string;
  title: string;
  description: string;
}

const StepCard = ({ number, title, description }: StepCardProps) => {
  return (
    <div className="relative bg-card rounded-lg p-8 shadow-card animate-fade-in">
      <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-pacific-500 text-white flex items-center justify-center font-heading font-bold text-xl shadow-lg">
        {number}
      </div>
      <h3 className="font-semibold mb-3 mt-2">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
};

export default StepCard;
