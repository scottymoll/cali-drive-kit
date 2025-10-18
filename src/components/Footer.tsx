const Footer = () => {
  return (
    <footer className="bg-pacific-900 text-white mt-24">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <h4 className="font-heading font-bold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li>
                <button
                  onClick={() => {
                    const element = document.getElementById("whats-inside");
                    if (element) {
                      const offset = 80;
                      const elementPosition = element.getBoundingClientRect().top;
                      const offsetPosition = elementPosition + window.pageYOffset - offset;
                      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
                    }
                  }}
                  className="hover:text-white transition-smooth"
                >
                  What's Inside
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    const element = document.getElementById("how-it-works");
                    if (element) {
                      const offset = 80;
                      const elementPosition = element.getBoundingClientRect().top;
                      const offsetPosition = elementPosition + window.pageYOffset - offset;
                      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
                    }
                  }}
                  className="hover:text-white transition-smooth"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    const element = document.getElementById("faq");
                    if (element) {
                      const offset = 80;
                      const elementPosition = element.getBoundingClientRect().top;
                      const offsetPosition = elementPosition + window.pageYOffset - offset;
                      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
                    }
                  }}
                  className="hover:text-white transition-smooth"
                >
                  FAQ
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-bold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li>
                <a href="#" className="hover:text-white transition-smooth">
                  CA DMV Resources
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-smooth">
                  Smog Check Info
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-smooth">
                  Title Transfer Guide
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li>
                <a href="#" className="hover:text-white transition-smooth">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-smooth">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-bold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li>
                <a href="#" className="hover:text-white transition-smooth">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-smooth">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-smooth">
                  Disclaimers
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/60">
            <p>© {new Date().getFullYear()} CA Car Seller Kit. All rights reserved.</p>
            <p className="text-xs">Not affiliated with the CA DMV.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
