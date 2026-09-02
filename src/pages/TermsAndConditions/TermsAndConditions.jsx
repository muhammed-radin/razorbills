import { FileText, CheckCircle, Shield, Package, CreditCard, Truck, RefreshCcw, Copyright, AlertCircle, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';


export default function TermsAndConditions() {
  const { t } = useTranslation();
  const sections = [
    {
      id: 1,
      icon: FileText,
      title: t("terms.sections.useOfWebsite.title"),
      content: t("terms.sections.useOfWebsite.content")
    },
    {
      id: 2,
      icon: Package,
      title: t("terms.sections.productsAndInformation.title"),
      content: t("terms.sections.productsAndInformation.content")
    },
    {
      id: 3,
      icon: CreditCard,
      title: t("terms.sections.ordersAndPayments.title"),
      content: t("terms.sections.ordersAndPayments.content")
    },
    {
      id: 4,
      icon: CheckCircle,
      title: t("terms.sections.pricing.title"),
      content: t("terms.sections.pricing.content")
    },
    {
      id: 5,
      icon: Truck,
      title: t("terms.sections.shippingAndDelivery.title"),
      content: t("terms.sections.shippingAndDelivery.content")
    },
    {
      id: 6,
      icon: RefreshCcw,
      title: t("terms.sections.returnsAndRefunds.title"),
      content: t("terms.sections.returnsAndRefunds.content")
    },
    {
      id: 7,
      icon: Copyright,
      title: t("terms.sections.intellectualProperty.title"),
      content: t("terms.sections.intellectualProperty.content")
    },
    {
      id: 8,
      icon: Shield,
      title: t("terms.sections.limitationOfLiability.title"),
      content: t("terms.sections.limitationOfLiability.content")
    },
    {
      id: 9,
      icon: AlertCircle,
      title: t("terms.sections.changesToTerms.title"),
      content: t("terms.sections.changesToTerms.content")
    },
    {
      id: 10,
      icon: Mail,
      title: t("terms.sections.contactInformation.title"),
      content: t("terms.sections.contactInformation.content")
    }
  ];

  return (
    <div className="min-h-screen bg-white text-neutral-900 dark:bg-black/10 dark:text-gray-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b dark:border-neutral-700">
        <div className="absolute inset-0"></div>
        
        <div className="relative max-w-4xl mx-auto px-6 py-20 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 dark:text-white">
            {t("terms.title")}
          </h1>
          <p className="text-lg dark:text-gray-300">
            {t("terms.lastUpdated")}: 2/14/2026
          </p>
        </div>
      </div>

      {/* Introduction */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-8 mb-12 dark:bg-black/10 dark:border-neutral-700">
          <p className="text-lg leading-relaxed dark:text-gray-300">
            {t("terms.welcome")}
          </p>
        </div>

        {/* Terms Sections */}
        <div className="space-y-8">
          {sections.map((section) => {
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
                {t("terms.importantNotice.title")}
              </h3>
              <p className="leading-relaxed text-neutral-700 dark:text-gray-300">
                {t("terms.importantNotice.content")}
              </p>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="mt-12 text-center border-neutral-200 border-t pt-12 dark:border-neutral-700">
          <h3 className="text-2xl font-bold mb-4 text-black dark:text-white">
            {t("terms.questions.title")}
          </h3>
          <p className="mb-6 text-neutral-600 dark:text-gray-300">
            {t("terms.questions.content")}
          </p>
          <Button className="inline-flex items-center gap-2">
            <Mail className="w-5 h-5" />
             {t("terms.questions.contactUs")}
          </Button>
        </div>
      </div>
    </div>
  );
}