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
  Star,
  Zap,
  Users,
  BarChart3,
  Clock,
  Smartphone,
  Headphones,
  FileText,
  Calculator,
  Target,
  TrendingUp,
  Award,
  Lock,
  Download,
  Video,
  Phone,
  Mail,
  Calendar,
  MapPin,
  CreditCard,
  AlertTriangle,
  CheckSquare,
  BookOpen,
  Lightbulb,
  Settings,
  Database,
  Globe,
  ShieldCheck,
  Timer,
  DollarSign as DollarSignIcon,
  Car,
  Wrench,
  FileImage,
  MessageCircle,
  UserCheck,
  Handshake as HandshakeIcon,
  ClipboardList,
} from "lucide-react";
import heroImage from "@/assets/hero-coastal.jpg";
import paperworkImage from "@/assets/paperwork-flatlay.jpg";
import { useScrollToSection } from "@/hooks/use-scroll-to-section";
import { useMemo } from "react";

const Index = () => {
  const { scrollToSection } = useScrollToSection();

  const basicFeatures = useMemo(() => [
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

  const premiumFeatures = useMemo(() => [
    {
      icon: BarChart3,
      title: "Advanced Market Analysis Tool",
      description: "AI-powered pricing calculator with real-time market data, seasonal adjustments, and competitor analysis for maximum profit.",
    },
    {
      icon: Video,
      title: "Professional Video Training Series",
      description: "15+ video modules covering every aspect of car selling, from preparation to closing, with expert tips and real examples.",
    },
    {
      icon: Smartphone,
      title: "Mobile App & Digital Tools",
      description: "iOS/Android app with photo optimization, listing templates, buyer tracking, and push notifications for inquiries.",
    },
    {
      icon: Headphones,
      title: "1-on-1 Expert Consultation",
      description: "30-minute phone consultation with a car selling expert to review your listing and provide personalized advice.",
    },
    {
      icon: FileText,
      title: "Legal Document Generator",
      description: "Automated Bill of Sale, Purchase Agreement, and DMV forms with CA-specific legal language and validation.",
    },
    {
      icon: Calculator,
      title: "Profit Maximization Calculator",
      description: "Advanced ROI calculator considering timing, seasonality, repairs, and market trends to optimize your sale price.",
    },
    {
      icon: Target,
      title: "Buyer Psychology Masterclass",
      description: "Deep dive into buyer behavior, objection handling, and psychological triggers to close deals faster.",
    },
    {
      icon: TrendingUp,
      title: "Market Trend Reports",
      description: "Monthly reports on CA car market trends, seasonal pricing patterns, and demand forecasts for your vehicle type.",
    },
    {
      icon: Award,
      title: "Premium Templates Library",
      description: "50+ professional templates for listings, emails, contracts, and follow-ups across all major platforms.",
    },
    {
      icon: Lock,
      title: "Fraud Protection Suite",
      description: "Advanced buyer verification tools, payment security protocols, and scam detection checklists.",
    },
    {
      icon: Download,
      title: "Offline Access & Backup",
      description: "Download all materials for offline use, cloud backup, and lifetime access to updates and new features.",
    },
    {
      icon: Globe,
      title: "Multi-Platform Optimization",
      description: "Automated cross-posting to Craigslist, Facebook, AutoTrader, Cars.com with platform-specific optimizations.",
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

  const basicTestimonials = useMemo(() => [
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

  const premiumTestimonials = useMemo(() => [
    {
      quote: "The AI pricing tool helped me sell my Tesla for $3,200 above market value. The consultation call was worth every penny!",
      author: "Marcus T.",
      location: "Los Angeles",
      premium: true,
    },
    {
      quote: "The video training series transformed how I approach car selling. I've sold 4 cars this year using their methods.",
      author: "Sarah K.",
      location: "San Francisco",
      premium: true,
    },
    {
      quote: "The mobile app made managing multiple listings effortless. The fraud protection saved me from 3 potential scams.",
      author: "David L.",
      location: "San Diego",
      premium: true,
    },
    {
      quote: "The market trend reports helped me time my sale perfectly. Sold for $2,800 more than I expected.",
      author: "Elena M.",
      location: "Sacramento",
      premium: true,
    },
    {
      quote: "The legal document generator was a game-changer. Everything was legally sound and professional.",
      author: "Robert H.",
      location: "Fresno",
      premium: true,
    },
    {
      quote: "The buyer psychology masterclass helped me close deals 40% faster. The ROI was incredible.",
      author: "Jennifer W.",
      location: "Oakland",
      premium: true,
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

  const basicFaqItems = useMemo(() => [
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

  const premiumFaqItems = useMemo(() => [
    {
      value: "premium-1",
      question: "How does the AI pricing tool work?",
      answer: "Our AI analyzes real-time market data, seasonal trends, your vehicle's condition, mileage, and local demand to suggest the optimal listing price. It considers factors like time of year, economic conditions, and competitor listings to maximize your profit potential.",
    },
    {
      value: "premium-2",
      question: "What's included in the expert consultation?",
      answer: "You get a 30-minute phone call with a car selling expert who will review your listing, pricing strategy, and answer any specific questions. They'll provide personalized advice based on your vehicle and local market conditions.",
    },
    {
      value: "premium-3",
      question: "How does the mobile app work?",
      answer: "The app includes photo optimization tools, listing templates, buyer inquiry tracking, push notifications, and offline access to all materials. It syncs across devices and provides real-time market updates.",
    },
    {
      value: "premium-4",
      question: "What's in the video training series?",
      answer: "15+ professional video modules covering pricing strategies, photography techniques, buyer psychology, negotiation tactics, safety protocols, and DMV procedures. Each video is 10-20 minutes with actionable tips you can implement immediately.",
    },
    {
      value: "premium-5",
      question: "How often are market trend reports updated?",
      answer: "Reports are updated monthly with current market conditions, seasonal pricing patterns, demand forecasts, and specific recommendations for your vehicle type and location in California.",
    },
    {
      value: "premium-6",
      question: "What's the fraud protection suite?",
      answer: "Advanced buyer verification tools, payment security protocols, scam detection checklists, and red-flag identification systems to protect you from common car selling scams and fraudulent buyers.",
    },
    {
      value: "premium-7",
      question: "Do I get lifetime access to updates?",
      answer: "Yes! Premium customers get lifetime access to all current and future updates, new features, additional templates, and any new video content we add to the training series.",
    },
    {
      value: "premium-8",
      question: "Can I upgrade from Basic to Premium later?",
      answer: "Absolutely! You can upgrade anytime and we'll credit your Basic kit purchase toward the Premium price. Contact support and we'll process your upgrade immediately.",
    },
  ], []);

  const basicBenefits = useMemo(() => [
    "Save hours of guesswork",
    "Avoid deal-killing mistakes",
    "Look like a pro in your listing",
  ], []);

  const premiumBenefits = useMemo(() => [
    "Maximize profit with AI-powered pricing",
    "Professional video training series",
    "1-on-1 expert consultation",
    "Mobile app with advanced tools",
    "Legal document automation",
    "Fraud protection suite",
    "Market trend intelligence",
    "Lifetime access & updates",
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
              className="bg-golden-300 text-pacific-900 hover:bg-golden-200 font-semibold"
              data-cta="cta-hero-premium"
              aria-label="Get the Premium California Car Seller Kit for $97"
            >
              Get Premium Kit — $97
            </Button>
            <Button
              variant="outline"
              size="xl"
              onClick={() => scrollToSection("price")}
              className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 hover:text-white"
              data-cta="cta-hero-basic"
              aria-label="Get the Basic California Car Seller Kit for $19.99"
            >
              Get Basic Kit — $19.99
            </Button>
            <Button
              variant="outline"
              size="xl"
              onClick={() => scrollToSection("whats-inside")}
              className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 hover:text-white"
              aria-label="Learn more about what's included in the kits"
            >
              Compare Kits
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
            <h2 className="mb-4">Choose Your Kit</h2>
            <p className="text-body-l text-muted-foreground max-w-2xl mx-auto">
              Everything you need to price, list, screen, and close your private car sale in
              California. Choose the level that's right for you.
            </p>
          </div>
          
          {/* BASIC KIT */}
          <div className="mb-16">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-semibold mb-2">Basic Kit - $19.99</h3>
              <p className="text-muted-foreground">Essential tools for confident car selling</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {basicFeatures.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
          </div>

          {/* PREMIUM KIT */}
          <div className="bg-gradient-to-br from-pacific-50 to-seafoam-50 rounded-2xl p-8 border-2 border-pacific-200">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-pacific-500 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
                <Star className="w-4 h-4" />
                PREMIUM KIT
              </div>
              <h3 className="text-3xl font-bold mb-2 text-pacific-900">Professional Edition - $97</h3>
              <p className="text-pacific-700 text-lg">Advanced tools for maximum profit and professional results</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {premiumFeatures.map((feature, index) => (
                <div key={index} className="bg-white rounded-lg p-6 shadow-lg border border-pacific-100 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 w-12 h-12 rounded-lg bg-pacific-100 flex items-center justify-center">
                      <feature.icon className="w-6 h-6 text-pacific-600" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-2 text-pacific-900">{feature.title}</h4>
                      <p className="text-sm text-pacific-700 leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-12">
            <Button variant="hero" size="lg" onClick={() => scrollToSection("price")}>
              Compare Kits & Choose
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
                <div className="text-4xl font-heading font-bold text-pacific-500 mb-2">50+</div>
                <div className="text-sm text-muted-foreground">Templates & Scripts</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-heading font-bold text-pacific-500 mb-2">100%</div>
                <div className="text-sm text-muted-foreground">CA Paperwork Steps</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-heading font-bold text-pacific-500 mb-2">$2,800+</div>
                <div className="text-sm text-muted-foreground">Average Extra Profit</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-heading font-bold text-pacific-500 mb-2">40%</div>
                <div className="text-sm text-muted-foreground">Faster Sales</div>
            </div>
          </div>
          </div>
          
          {/* BASIC TESTIMONIALS */}
          <div className="mb-16">
            <h3 className="text-center text-xl font-semibold mb-8">Basic Kit Success Stories</h3>
          <div className="grid md:grid-cols-3 gap-8">
              {basicTestimonials.map((testimonial, index) => (
              <TestimonialCard
                key={index}
                quote={testimonial.quote}
                author={testimonial.author}
                location={testimonial.location}
              />
            ))}
            </div>
          </div>

          {/* PREMIUM TESTIMONIALS */}
          <div className="bg-gradient-to-br from-pacific-50 to-seafoam-50 rounded-2xl p-8 border border-pacific-200">
            <h3 className="text-center text-xl font-semibold mb-8 text-pacific-900">Premium Kit Success Stories</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {premiumTestimonials.map((testimonial, index) => (
                <div key={index} className="bg-white rounded-lg p-6 shadow-lg border border-pacific-100">
                  <div className="flex items-center gap-2 mb-4">
                    <Star className="w-5 h-5 text-golden-300" />
                    <Star className="w-5 h-5 text-golden-300" />
                    <Star className="w-5 h-5 text-golden-300" />
                    <Star className="w-5 h-5 text-golden-300" />
                    <Star className="w-5 h-5 text-golden-300" />
                  </div>
                  <p className="text-pacific-800 mb-4 italic">"{testimonial.quote}"</p>
                  <div className="text-sm">
                    <div className="font-semibold text-pacific-900">{testimonial.author}</div>
                    <div className="text-pacific-600">{testimonial.location}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PRICE SECTION */}
      <section id="price" className="py-20 bg-sand-50">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="mb-4">Choose Your Kit</h2>
            <p className="text-body-l text-muted-foreground max-w-2xl mx-auto">
              Select the package that matches your needs and budget. Both kits include everything you need to sell successfully.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* BASIC KIT */}
            <div className="bg-card rounded-2xl p-8 shadow-card border-2 border-pacific-200/50">
            <div className="text-center mb-8">
                <h3 className="text-2xl font-semibold mb-2">Basic Kit</h3>
                <div className="text-4xl font-heading font-bold text-pacific-500 mb-2">$19.99</div>
                <p className="text-muted-foreground">Essential tools for confident selling</p>
              </div>
              <ul className="space-y-3 text-left mb-8">
                {basicBenefits.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-seafoam-300 shrink-0 mt-0.5" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
              <Button variant="outline" size="xl" className="w-full mb-6" data-cta="cta-basic">
                Get Basic Kit — $19.99
              </Button>
              <div className="text-center text-xs text-muted-foreground">
                <p>One-time purchase • Instant download</p>
              </div>
            </div>

            {/* PREMIUM KIT */}
            <div className="bg-gradient-to-br from-pacific-500 to-pacific-600 rounded-2xl p-8 shadow-2xl border-2 border-pacific-400 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-golden-300 text-pacific-900 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  MOST POPULAR
                </div>
              </div>
              <div className="text-center mb-8">
                <h3 className="text-2xl font-semibold mb-2 text-white">Premium Kit</h3>
                <div className="text-4xl font-heading font-bold text-golden-300 mb-2">$97</div>
                <p className="text-pacific-100">Professional tools for maximum profit</p>
              </div>
              <ul className="space-y-3 text-left mb-8">
                {premiumBenefits.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-golden-300 shrink-0 mt-0.5" />
                    <span className="text-white">{item}</span>
                  </li>
                ))}
              </ul>
              <Button 
                variant="hero" 
                size="xl" 
                className="w-full mb-6 bg-golden-300 text-pacific-900 hover:bg-golden-200" 
                data-cta="cta-premium"
              >
                Get Premium Kit — $97
              </Button>
              <div className="text-center text-xs text-pacific-100">
                <p>Lifetime access • Mobile app • Expert support</p>
              </div>
            </div>
          </div>

          {/* VALUE COMPARISON */}
          <div className="mt-16 bg-white rounded-2xl p-8 shadow-card border border-pacific-200">
            <h3 className="text-center text-2xl font-semibold mb-8">Why Premium Pays for Itself</h3>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-pacific-500 mb-2">$2,800+</div>
                <div className="text-sm text-muted-foreground">Average extra profit with AI pricing</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-pacific-500 mb-2">40%</div>
                <div className="text-sm text-muted-foreground">Faster sale with buyer psychology</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-pacific-500 mb-2">$500</div>
                <div className="text-sm text-muted-foreground">Value of expert consultation alone</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COMPARISON TABLE */}
      <section className="py-20 bg-background">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <h2 className="text-center mb-12">Feature Comparison</h2>
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
                      Basic Kit
                    </th>
                    <th className="text-center p-6 font-semibold text-golden-300 bg-pacific-500/10">
                      Premium Kit
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border">
                    <td className="p-6 text-foreground font-medium">Pricing Guide & Worksheets</td>
                      <td className="text-center p-6">
                        <X className="w-5 h-5 text-destructive mx-auto" />
                      </td>
                      <td className="text-center p-6 bg-seafoam-300/5">
                        <Check className="w-5 h-5 text-seafoam-300 mx-auto" />
                      </td>
                    <td className="text-center p-6 bg-pacific-500/10">
                      <Check className="w-5 h-5 text-golden-300 mx-auto" />
                    </td>
                    </tr>
                  <tr className="border-b border-border">
                    <td className="p-6 text-foreground font-medium">Photo & Listing Blueprint</td>
                    <td className="text-center p-6">
                      <X className="w-5 h-5 text-destructive mx-auto" />
                    </td>
                    <td className="text-center p-6 bg-seafoam-300/5">
                      <Check className="w-5 h-5 text-seafoam-300 mx-auto" />
                    </td>
                    <td className="text-center p-6 bg-pacific-500/10">
                      <Check className="w-5 h-5 text-golden-300 mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-6 text-foreground font-medium">Buyer Screening Scripts</td>
                    <td className="text-center p-6">
                      <X className="w-5 h-5 text-destructive mx-auto" />
                    </td>
                    <td className="text-center p-6 bg-seafoam-300/5">
                      <Check className="w-5 h-5 text-seafoam-300 mx-auto" />
                    </td>
                    <td className="text-center p-6 bg-pacific-500/10">
                      <Check className="w-5 h-5 text-golden-300 mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-6 text-foreground font-medium">Safe Test-Drive Protocol</td>
                    <td className="text-center p-6">
                      <X className="w-5 h-5 text-destructive mx-auto" />
                    </td>
                    <td className="text-center p-6 bg-seafoam-300/5">
                      <Check className="w-5 h-5 text-seafoam-300 mx-auto" />
                    </td>
                    <td className="text-center p-6 bg-pacific-500/10">
                      <Check className="w-5 h-5 text-golden-300 mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-6 text-foreground font-medium">CA DMV Paperwork</td>
                    <td className="text-center p-6">
                      <X className="w-5 h-5 text-destructive mx-auto" />
                    </td>
                    <td className="text-center p-6 bg-seafoam-300/5">
                      <Check className="w-5 h-5 text-seafoam-300 mx-auto" />
                    </td>
                    <td className="text-center p-6 bg-pacific-500/10">
                      <Check className="w-5 h-5 text-golden-300 mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-6 text-foreground font-medium">AI-Powered Pricing Tool</td>
                    <td className="text-center p-6">
                      <X className="w-5 h-5 text-destructive mx-auto" />
                    </td>
                    <td className="text-center p-6 bg-seafoam-300/5">
                      <X className="w-5 h-5 text-muted-foreground mx-auto" />
                    </td>
                    <td className="text-center p-6 bg-pacific-500/10">
                      <Check className="w-5 h-5 text-golden-300 mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-6 text-foreground font-medium">Video Training Series</td>
                    <td className="text-center p-6">
                      <X className="w-5 h-5 text-destructive mx-auto" />
                    </td>
                    <td className="text-center p-6 bg-seafoam-300/5">
                      <X className="w-5 h-5 text-muted-foreground mx-auto" />
                    </td>
                    <td className="text-center p-6 bg-pacific-500/10">
                      <Check className="w-5 h-5 text-golden-300 mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-6 text-foreground font-medium">Mobile App</td>
                    <td className="text-center p-6">
                      <X className="w-5 h-5 text-destructive mx-auto" />
                    </td>
                    <td className="text-center p-6 bg-seafoam-300/5">
                      <X className="w-5 h-5 text-muted-foreground mx-auto" />
                    </td>
                    <td className="text-center p-6 bg-pacific-500/10">
                      <Check className="w-5 h-5 text-golden-300 mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-6 text-foreground font-medium">Expert Consultation</td>
                    <td className="text-center p-6">
                      <X className="w-5 h-5 text-destructive mx-auto" />
                    </td>
                    <td className="text-center p-6 bg-seafoam-300/5">
                      <X className="w-5 h-5 text-muted-foreground mx-auto" />
                    </td>
                    <td className="text-center p-6 bg-pacific-500/10">
                      <Check className="w-5 h-5 text-golden-300 mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-6 text-foreground font-medium">Legal Document Generator</td>
                    <td className="text-center p-6">
                      <X className="w-5 h-5 text-destructive mx-auto" />
                    </td>
                    <td className="text-center p-6 bg-seafoam-300/5">
                      <X className="w-5 h-5 text-muted-foreground mx-auto" />
                    </td>
                    <td className="text-center p-6 bg-pacific-500/10">
                      <Check className="w-5 h-5 text-golden-300 mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-6 text-foreground font-medium">Market Trend Reports</td>
                    <td className="text-center p-6">
                      <X className="w-5 h-5 text-destructive mx-auto" />
                    </td>
                    <td className="text-center p-6 bg-seafoam-300/5">
                      <X className="w-5 h-5 text-muted-foreground mx-auto" />
                    </td>
                    <td className="text-center p-6 bg-pacific-500/10">
                      <Check className="w-5 h-5 text-golden-300 mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-6 text-foreground font-medium">Fraud Protection Suite</td>
                    <td className="text-center p-6">
                      <X className="w-5 h-5 text-destructive mx-auto" />
                    </td>
                    <td className="text-center p-6 bg-seafoam-300/5">
                      <X className="w-5 h-5 text-muted-foreground mx-auto" />
                    </td>
                    <td className="text-center p-6 bg-pacific-500/10">
                      <Check className="w-5 h-5 text-golden-300 mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-6 text-foreground font-medium">Lifetime Access & Updates</td>
                    <td className="text-center p-6">
                      <X className="w-5 h-5 text-destructive mx-auto" />
                    </td>
                    <td className="text-center p-6 bg-seafoam-300/5">
                      <X className="w-5 h-5 text-muted-foreground mx-auto" />
                    </td>
                    <td className="text-center p-6 bg-pacific-500/10">
                      <Check className="w-5 h-5 text-golden-300 mx-auto" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="text-center mt-8">
            <Button variant="hero" size="lg" onClick={() => scrollToSection("price")}>
              Choose Your Kit
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="py-20 bg-sand-50">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-center mb-12">Frequently Asked Questions</h2>
          
          {/* BASIC FAQ */}
          <div className="mb-16">
            <h3 className="text-center text-xl font-semibold mb-8">Basic Kit Questions</h3>
            <div className="max-w-[800px] mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
                {basicFaqItems.map((item) => (
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
          </div>

          {/* PREMIUM FAQ */}
          <div className="bg-gradient-to-br from-pacific-50 to-seafoam-50 rounded-2xl p-8 border border-pacific-200">
            <h3 className="text-center text-xl font-semibold mb-8 text-pacific-900">Premium Kit Questions</h3>
            <div className="max-w-[800px] mx-auto">
              <Accordion type="single" collapsible className="space-y-4">
                {premiumFaqItems.map((item) => (
                  <AccordionItem
                    key={item.value}
                    value={item.value}
                    className="bg-white rounded-lg px-6 shadow-lg border border-pacific-100"
                  >
                    <AccordionTrigger className="hover:no-underline text-pacific-900" data-track="faq-open">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-pacific-700">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
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
          <h2 className="text-white mb-4">Ready to sell with confidence?</h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Choose the kit that's right for you and start maximizing your car's value today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              variant="hero"
              size="xl"
              onClick={() => scrollToSection("price")}
              className="bg-golden-300 text-pacific-900 hover:bg-golden-200 font-semibold"
              data-cta="cta-premium-bottom"
            >
              Get Premium Kit — $97
            </Button>
            <Button
              variant="outline"
              size="xl"
              onClick={() => scrollToSection("price")}
              className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 hover:text-white"
              data-cta="cta-basic-bottom"
            >
              Get Basic Kit — $19.99
            </Button>
            <Button
              variant="outline"
              size="xl"
              onClick={() => scrollToSection("whats-inside")}
              className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 hover:text-white"
            >
              Compare Kits
            </Button>
          </div>
          <div className="mt-8 text-white/80 text-sm">
            <p>✓ 30-day money-back guarantee • ✓ Instant access • ✓ Works on all devices</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
