import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const FAQ: React.FC = () => {
  const faqItems = [
    {
      question: "Is this CA-specific?",
      answer: "Yes; it's built for California sellers with CA DMV steps, forms, and legal requirements. We include links to official CA DMV resources and California-specific safety protocols."
    },
    {
      question: "How do I get the files?",
      answer: "Instant download + email receipt with links. After purchase, you'll receive an email with download links that work on any device. Files are in PDF format and can be printed or used digitally."
    },
    {
      question: "Can I get a refund?",
      answer: "30-day full refund if you're not satisfied. No questions asked. If the kit doesn't help you sell your car faster and safer, we'll refund your money completely."
    },
    {
      question: "Do you include DMV forms?",
      answer: "We include links and completed examples and show exactly how to fill them out. Premium includes a forms library & templates. We provide step-by-step guidance for all required California DMV paperwork."
    },
    {
      question: "What if I have a loan on my car?",
      answer: "The kit covers payoff steps, timing, and the documents you'll need to coordinate with your lender. We walk you through handling title transfers when there's an outstanding loan, including payoff verification and timing considerations."
    },
    {
      question: "How quickly can I sell my car using this kit?",
      answer: "Most sellers see results within 3-7 days when following our pricing and listing strategies. The kit helps you price competitively and create listings that attract serious buyers quickly."
    },
    {
      question: "Is this legal advice?",
      answer: "No, this is an educational resource that includes official CA DMV links and step-by-step guidance. For specific legal questions, consult an attorney. We focus on the practical process of selling your car legally in California."
    },
    {
      question: "What file formats are included?",
      answer: "All files are in PDF format for easy printing and digital use. Templates are also provided in Word format for customization. Files work on any device - phone, tablet, or computer."
    }
  ];

  return (
    <section className="py-20 bg-background" aria-labelledby="faq-title">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <h2 id="faq-title" className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to know about the CA Car Seller Kit
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqItems.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="bg-white rounded-lg border shadow-sm">
              <AccordionTrigger className="px-6 py-4 text-left font-semibold text-gray-900 hover:no-underline">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4 text-gray-700 leading-relaxed">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="text-center mt-12">
          <div className="bg-sand-50 rounded-xl p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Still have questions?
            </h3>
            <p className="text-gray-600 mb-6">
              We're here to help you sell your car successfully
            </p>
            <a 
              href="mailto:support@ca-car-seller.com" 
              className="inline-flex items-center justify-center px-6 py-3 bg-pacific-600 text-white rounded-lg hover:bg-pacific-700 transition-colors font-semibold"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
