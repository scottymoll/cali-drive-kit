import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FeatureCard from "@/components/FeatureCard";
import StepCard from "@/components/StepCard";
import TestimonialCard from "@/components/TestimonialCard";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  DollarSign,
  Camera,
  MessageSquare,
  Shield,
  Handshake,
  FileCheck,
  Check,
  X,
  CheckCircle2,
} from "lucide-react";
import heroImage from "@/assets/hero-coastal.jpg";
import paperworkImage from "@/assets/paperwork-flatlay.jpg";
import { useScrollToSection } from "@/hooks/use-scroll-to-section";
import { useMemo } from "react";

const Index = () => {
  const { scrollToSection } = useScrollToSection();

  const features = useMemo(() => [
    {
      icon: DollarSign,
      title: "Pricing Guide & Worksheets",
      description: "Find market value using KBB, comps & mileage/condition adjustments. Templates included.",
    },
    {
      icon: Camera,
      title: "Photo & Listing Blueprint",
      description: "Shot list, angles, lighting tips, and winning copy templates.",
    },
    {
      icon: MessageSquare,
      title: "Buyer Screening Scripts",
      description: "Text/phone scripts to filter tire-kickers and time-wasters.",
    },
    {
      icon: Shield,
      title: "Safe Test-Drive Protocol",
      description: "Insurance checks, ID verification, route plan, and red-flag checklist.",
    },
    {
      icon: Handshake,
      title: "Offer & Negotiation Tactics",
      description: "Counter templates, deposit handling, and how to create urgency without pressure.",
    },
    {
      icon: FileCheck,
      title: "Closeout & DMV Paperwork",
      description: "Step-by-step CA transfer checklist, smog nuances, Notice of Transfer (REG 138), Bill of Sale, title instructions.",
    },
  ], []);

  const steps = useMemo(() => [
    {
      number: "1",
      title: "Purchase & download your kit",
      description: "Instant access to templates and checklists.",
    },
    {
      number: "2",
      title: "Follow the guided flow",
      description: "Do one section per day—or binge it in a weekend.",
    },
    {
      number: "3",
      title: "List, screen, sell, file",
      description: "Use our scripts and closeout checklist to transfer ownership right.",
    },
  ], []);

  const testimonials = useMemo(() => [
    {
      quote: "I sold my CR-V in 48 hours for $1,100 more than my first draft listing.",
      author: "Jamie R.",
      location: "San Diego",
    },
    {
      quote: "The DMV steps section alone saved me a day.",
      author: "Mateo G.",
      location: "Sacramento",
    },
    {
      quote: "Scripts made screening buyers painless.",
      author: "Priya S.",
      location: "Long Beach",
    },
  ], []);

  const beforeItems = useMemo(() => [
    "Guessing the price",
    "Overwhelming forms",
    "Risky test drives",
    "Lowball offers",
    "Scattered browser tabs",
    "Confusion about smog/title",
  ], []);

  const afterItems = useMemo(() => [
    "Clear pricing",
    "Simple paperwork path",
    "Safe test-drive plan",
    "Confident closeout",
    "Single, calm checklist",
    "Price confidence",
  ], []);

  const comparisonFeatures = useMemo(() => [
    "Correct pricing framework",
    "Winning listing template",
    "Screening scripts",
    "Safety test-drive plan",
    "CA paperwork steps",
    "Red-flag checks",
    "Negotiation templates",
    "Clean handoff checklist",
  ], []);

  const faqItems = useMemo(() => [
    {
      value: "item-1",
      question: "Will this work if I still have a loan?",
      answer: "Yes—the guide covers payoff steps, timing, and the documents you'll need to coordinate with your lender. We walk you through how to handle the title transfer when there's an outstanding loan.",
    },
    {
      value: "item-2",
      question: "Do I need a smog check?",
      answer: "The guide explains exactly how smog checks interact with private sales in California, including model year exemptions, who's responsible, and edge cases. We make sure you know when it's required and when it's not.",
    },
    {
      value: "item-3",
      question: "How fast can I sell?",
      answer: "It depends on your car and price point, but our pricing and listing blueprint are designed to accelerate interest from serious buyers. Many sellers see results within days when they follow the system.",
    },
    {
      value: "item-4",
      question: "Is this legal advice?",
      answer: "No—this is an educational resource that includes official CA DMV links and steps. For specific legal questions, consult an attorney.",
    },
    {
      value: "item-5",
      question: "Can I use it on my phone?",
      answer: "Yes—everything is mobile-friendly and printable. Access the kit on any device and print what you need.",
    },
    {
      value: "item-6",
      question: "What if the buyer is from out of state?",
      answer: "We outline CA seller responsibilities and point out cross-state nuances to be aware of. The kit focuses on what you need to do as a California seller.",
    },
  ], []);

  const benefits = useMemo(() => [
    "Save hours of guesswork",
    "Avoid deal-killing mistakes",
    "Look like a pro in your listing",
  ], []);

  const capabilities = useMemo(() => [
    "Price it right",
    "Create a pro-grade listing",
    "Screen for serious buyers",
    "Run safe test drives",
    "Close cleanly, zero DMV surprises",
  ], []);

  return (
    <div className="min-h-screen">
      <Header />

      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden" aria-label="Hero section">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(rgba(13, 43, 62, 0.7), rgba(13, 43, 62, 0.5)), url(${heroImage})`,
          }}
          aria-hidden="true"
        />
        <div className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-12 py-32 text-center">
          <h1 className="text-white mb-6 animate-fade-in">
            Sell your car in California—fast, safe, and DMV-compliant.
          </h1>
          <p className="text-body-l text-white/95 max-w-3xl mx-auto mb-8 animate-fade-in [animation-delay:150ms]">
            A step-by-step kit with pricing tools, checklist, scripts, forms, and a no-nonsense
            timeline tailored to California rules.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-fade-in [animation-delay:300ms]">
            <Button
              variant="hero"
              size="xl"
              onClick={() => scrollToSection("price")}
              data-cta="cta-hero"
              aria-label="Get the California Car Seller Kit for $19.99"
            >
              Get the Kit — $19.99
            </Button>
            <Button
              variant="outline"
              size="xl"
              onClick={() => scrollToSection("whats-inside")}
              className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 hover:text-white"
              aria-label="Learn more about what's included in the kit"
            >
              See What's Inside
            </Button>
          </div>
          <div className="flex flex-wrap justify-center gap-8 text-white/90 text-sm animate-fade-in [animation-delay:450ms]" role="list" aria-label="Key features">
            <div className="flex items-center gap-2" role="listitem">
              <CheckCircle2 className="w-5 h-5 text-seafoam-300" aria-hidden="true" />
              <span>California-specific</span>
            </div>
            <div className="flex items-center gap-2" role="listitem">
              <CheckCircle2 className="w-5 h-5 text-seafoam-300" aria-hidden="true" />
              <span>DMV forms & checklist</span>
            </div>
            <div className="flex items-center gap-2" role="listitem">
              <CheckCircle2 className="w-5 h-5 text-seafoam-300" aria-hidden="true" />
              <span>Finish in a weekend</span>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT'S INSIDE SECTION */}
      <section id="whats-inside" className="py-20 bg-background">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="mb-4">What's Inside the Kit</h2>
            <p className="text-body-l text-muted-foreground max-w-2xl mx-auto">
              Everything you need to price, list, screen, and close your private car sale in
              California.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
          <div className="text-center mt-12">
            <Button variant="hero" size="lg" onClick={() => scrollToSection("price")}>
              Get the Kit — $19.99
            </Button>
          </div>
        </div>
      </section>

      {/* BUILT FOR CALIFORNIA SECTION */}
      <section className="py-20 bg-sand-50">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="mb-8">Built for California</h2>
              <div className="space-y-8">
                <div>
                  <div className="inline-block bg-sunset-400/10 text-sunset-400 px-3 py-1 rounded-full text-sm font-semibold mb-3">
                    Smog & Transfer Nuances
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    How smog checks interact with private sales, model year exemptions, who pays,
                    and timing.
                  </p>
                </div>
                <div>
                  <div className="inline-block bg-golden-300/10 text-asphalt-700 px-3 py-1 rounded-full text-sm font-semibold mb-3">
                    Title Scenarios
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Lost title, lien payoff, out-of-state title—what to do in CA.
                  </p>
                </div>
                <div>
                  <div className="inline-block bg-seafoam-300/10 text-pacific-600 px-3 py-1 rounded-full text-sm font-semibold mb-3">
                    Payments & Taxes
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Cashier's check verification, instant bank payment guidance, and why private
                    sellers don't collect sales tax.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-2xl p-8 shadow-card">
              <h3 className="font-semibold mb-6 text-pacific-600">What you'll confidently do</h3>
              <ul className="space-y-4">
                {capabilities.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-seafoam-300 shrink-0 mt-0.5" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-20 bg-background">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="mb-4">How It Works</h2>
            <p className="text-body-l text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to selling your car the right way in California.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {steps.map((step, index) => (
              <StepCard
                key={index}
                number={step.number}
                title={step.title}
                description={step.description}
              />
            ))}
          </div>
          <div className="bg-seafoam-300/10 rounded-lg p-6 text-center border border-seafoam-300/20">
            <p className="text-sm text-foreground/80">
              <strong>Average time to list:</strong> 2 hours. <strong>Average time to sell once listed:</strong> varies by vehicle & price.
              The kit helps maximize interest and minimize hassle.
            </p>
          </div>
        </div>
      </section>

      {/* BEFORE VS AFTER SECTION */}
      <section className="py-20 bg-sand-50">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <h2 className="text-center mb-16">Before vs After</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-card rounded-lg p-8 shadow-card border-2 border-destructive/20">
              <div className="inline-block bg-destructive/10 text-destructive px-3 py-1 rounded-full text-sm font-semibold mb-6">
                Before
              </div>
              <ul className="space-y-4">
                {beforeItems.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <X className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-card rounded-lg p-8 shadow-card border-2 border-seafoam-300">
              <div className="inline-block bg-seafoam-300/20 text-pacific-600 px-3 py-1 rounded-full text-sm font-semibold mb-6">
                After
              </div>
              <ul className="space-y-4">
                {afterItems.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-seafoam-300 shrink-0 mt-0.5" />
                    <span className="text-foreground font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* RESULTS / SOCIAL PROOF SECTION */}
      <section id="results" className="py-20 bg-background">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <div className="text-center mb-12">
            <h2 className="mb-8">Results That Speak</h2>
            <div className="flex flex-wrap justify-center gap-12 mb-16">
              <div className="text-center">
                <div className="text-4xl font-heading font-bold text-pacific-500 mb-2">10+</div>
                <div className="text-sm text-muted-foreground">Templates & Scripts</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-heading font-bold text-pacific-500 mb-2">100%</div>
                <div className="text-sm text-muted-foreground">CA Paperwork Steps</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-heading font-bold text-pacific-500 mb-2">2x</div>
                <div className="text-sm text-muted-foreground">More Inquiries</div>
              </div>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={index}
                quote={testimonial.quote}
                author={testimonial.author}
                location={testimonial.location}
              />
            ))}
          </div>
        </div>
      </section>

      {/* PRICE SECTION */}
      <section id="price" className="py-20 bg-sand-50">
        <div className="max-w-[600px] mx-auto px-6">
          <div className="bg-card rounded-2xl p-10 shadow-card-hover border-2 border-pacific-500/10">
            <div className="text-center mb-8">
              <h2 className="mb-2">CA Car Seller Kit</h2>
              <div className="text-5xl font-heading font-bold text-pacific-500 mb-6">$19.99</div>
              <ul className="space-y-3 text-left mb-8">
                {benefits.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-seafoam-300 shrink-0 mt-0.5" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
              <Button variant="hero" size="xl" className="w-full mb-6" data-cta="cta-price">
                Get the Kit — $19.99
              </Button>
              <div className="flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" />
                  Instant download
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" />
                  Secure payment
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" />
                  Works on phone or desktop
                </span>
              </div>
            </div>
            <div className="border-t border-border pt-6 text-center">
              <p className="text-sm text-muted-foreground">
                One-time purchase. Updates for CA rules included for this edition.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* COMPARISON TABLE */}
      <section className="py-20 bg-background">
        <div className="max-w-[900px] mx-auto px-6 md:px-12">
          <h2 className="text-center mb-12">DIY vs Our Kit</h2>
          <div className="bg-card rounded-lg shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-6 font-semibold">Feature</th>
                    <th className="text-center p-6 font-semibold text-muted-foreground">
                      DIY Alone
                    </th>
                    <th className="text-center p-6 font-semibold text-pacific-500 bg-seafoam-300/5">
                      CA Car Seller Kit
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((feature, index) => (
                    <tr key={index} className="border-b border-border last:border-0">
                      <td className="p-6 text-foreground">{feature}</td>
                      <td className="text-center p-6">
                        <X className="w-5 h-5 text-destructive mx-auto" />
                      </td>
                      <td className="text-center p-6 bg-seafoam-300/5">
                        <Check className="w-5 h-5 text-seafoam-300 mx-auto" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="text-center mt-8">
            <Button variant="hero" size="lg" onClick={() => scrollToSection("price")}>
              Get the Kit — $19.99
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="py-20 bg-sand-50">
        <div className="max-w-[800px] mx-auto px-6">
          <h2 className="text-center mb-12">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="space-y-4">
            {faqItems.map((item) => (
              <AccordionItem
                key={item.value}
                value={item.value}
                className="bg-card rounded-lg px-6 shadow-card border-none"
              >
                <AccordionTrigger className="hover:no-underline" data-track="faq-open">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* DMV RESOURCES SECTION */}
      <section className="py-20 bg-background">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <div className="text-center mb-12">
            <h2 className="mb-4">Official DMV Resources</h2>
            <p className="text-sm text-muted-foreground mb-8">
              Not affiliated with the CA DMV.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-card rounded-lg p-6 shadow-card hover:shadow-card-hover transition-smooth">
              <h3 className="font-semibold mb-3 text-lg">Transfer & Notice</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Official CA DMV Notice of Transfer (REG 138) and transfer requirements.
              </p>
              <a
                href="#"
                className="text-sm text-pacific-500 hover:text-pacific-600 font-medium"
              >
                Learn more →
              </a>
            </div>
            <div className="bg-card rounded-lg p-6 shadow-card hover:shadow-card-hover transition-smooth">
              <h3 className="font-semibold mb-3 text-lg">Title Transfer Basics</h3>
              <p className="text-sm text-muted-foreground mb-4">
                How to properly transfer a vehicle title in California.
              </p>
              <a
                href="#"
                className="text-sm text-pacific-500 hover:text-pacific-600 font-medium"
              >
                Learn more →
              </a>
            </div>
            <div className="bg-card rounded-lg p-6 shadow-card hover:shadow-card-hover transition-smooth">
              <h3 className="font-semibold mb-3 text-lg">Smog Check Program</h3>
              <p className="text-sm text-muted-foreground mb-4">
                California's smog check requirements and exemptions.
              </p>
              <a
                href="#"
                className="text-sm text-pacific-500 hover:text-pacific-600 font-medium"
              >
                Learn more →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA BAND */}
      <section className="py-24 gradient-cta relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: `url(${paperworkImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        </div>
        <div className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-12 text-center">
          <h2 className="text-white mb-8">Ready to sell with confidence?</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="hero"
              size="xl"
              onClick={() => scrollToSection("price")}
              className="bg-white text-pacific-900 hover:bg-white/90"
              data-cta="cta-bottom"
            >
              Get the Kit — $19.99
            </Button>
            <Button
              variant="outline"
              size="xl"
              onClick={() => scrollToSection("whats-inside")}
              className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 hover:text-white"
            >
              See What's Inside
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
