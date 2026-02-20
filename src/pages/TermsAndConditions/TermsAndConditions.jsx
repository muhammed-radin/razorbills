import { FileText, CheckCircle, Shield, Package, CreditCard, Truck, RefreshCcw, Copyright, AlertCircle, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TermsAndConditions() {
  const sections = [
    {
      id: 1,
      icon: FileText,
      title: 'Use of Website',
      content: 'By using this website, you confirm that you are legally capable of entering into a binding agreement. You agree to use the website only for lawful purposes.'
    },
    {
      id: 2,
      icon: Package,
      title: 'Products & Information',
      content: 'We make every effort to ensure that product descriptions, pricing, and availability are accurate. However, errors may occur. Razorbills reserves the right to correct any errors or update information without prior notice.'
    },
    {
      id: 3,
      icon: CreditCard,
      title: 'Orders & Payments',
      content: 'All orders are subject to acceptance and availability. Currently, we accept payments through UPI. Cash on Delivery (COD) will be introduced soon. Orders will be processed only after successful payment confirmation.'
    },
    {
      id: 4,
      icon: CheckCircle,
      title: 'Pricing',
      content: 'Prices listed on the website are subject to change without prior notice. Any applicable taxes will be included as per Indian regulations.'
    },
    {
      id: 5,
      icon: Truck,
      title: 'Shipping & Delivery',
      content: 'Delivery timelines may vary depending on location and product availability. Razorbills is not responsible for delays caused by logistics partners or unforeseen circumstances.'
    },
    {
      id: 6,
      icon: RefreshCcw,
      title: 'Returns & Refunds',
      content: 'Returns and refunds are governed by our Return & Refund Policy. Please review that page for detailed information.'
    },
    {
      id: 7,
      icon: Copyright,
      title: 'Intellectual Property',
      content: 'All content on this website, including text, logos, images, and design, is the property of Razorbills and may not be copied or used without permission.'
    },
    {
      id: 8,
      icon: Shield,
      title: 'Limitation of Liability',
      content: 'Razorbills shall not be liable for any indirect, incidental, or consequential damages arising from the use of our website or products.'
    },
    {
      id: 9,
      icon: AlertCircle,
      title: 'Changes to Terms',
      content: 'We reserve the right to modify these Terms & Conditions at any time. Continued use of the website means you accept the updated terms.'
    },
    {
      id: 10,
      icon: Mail,
      title: 'Contact Information',
      content: 'If you have any questions regarding these Terms & Conditions, please contact us through the details provided on our Contact Us page.'
    }
  ];

  return (
    <div className="min-h-screen bg-white text-neutral-900 dark:bg-black/10 dark:text-gray-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b dark:border-neutral-700">
        <div className="absolute inset-0"></div>
        
        <div className="relative max-w-4xl mx-auto px-6 py-20 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 dark:text-white">
            Terms & Conditions
          </h1>
          <p className="text-lg dark:text-gray-300">
            Last updated: 2/14/2026
          </p>
        </div>
      </div>

      {/* Introduction */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-8 mb-12 dark:bg-black/10 dark:border-neutral-700">
          <p className="text-lg leading-relaxed dark:text-gray-300">
            Welcome to Razorbills. By accessing or using our website, you agree to the following terms and conditions. Please read them carefully.
          </p>
        </div>

        {/* Terms Sections */}
        <div className="space-y-8">
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <div 
                key={section.id}
                className="bg-white border border-neutral-200 rounded-lg p-6 hover:border-amber-500 transition-colors dark:hover:border-amber-500 dark:transition-colors dark:bg-black/10 dark:border-neutral-700"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-amber-100 flex items-center justify-center flex-shrink-0 rounded-lg dark:bg-amber-900/30">
                    <Icon className="w-6 h-6 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold mb-3 text-black dark:text-white">
                      {section.id}. {section.title}
                    </h2>
                    <p className="leading-relaxed text-neutral-600 dark:text-gray-300">
                      {section.content}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Important Notice */}
        <div className="mt-12 bg-amber-50 border border-amber-200 rounded-lg p-6 dark:bg-amber-900/10 dark:border-amber-500/30">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-bold mb-2 text-black dark:text-white">
                Important Notice
              </h3>
              <p className="leading-relaxed text-neutral-700 dark:text-gray-300">
                By continuing to use Razorbills, you acknowledge that you have read, understood, and agree to be bound by these Terms & Conditions. If you do not agree with any part of these terms, please discontinue use of our website immediately.
              </p>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="mt-12 text-center border-neutral-200 border-t pt-12 dark:border-neutral-700">
          <h3 className="text-2xl font-bold mb-4 text-black dark:text-white">
            Questions About Our Terms?
          </h3>
          <p className="mb-6 text-neutral-600 dark:text-gray-300">
            Our team is here to help clarify any concerns you may have.
          </p>
          <Button className="inline-flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Contact Us
          </Button>
        </div>
      </div>
    </div>
  );
}