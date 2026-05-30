import {
  RefreshCcw,
  AlertCircle,
  X,
  FileText,
  DollarSign,
  Package,
  Truck,
  Mail,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Returns() {
  const returnEligibility = [
    "The product received is damaged, defective, or incorrect",
    "The issue is reported within 48 hours of delivery",
    "The product is unused, unsoldered, and in original condition",
    "Original packaging, labels, and accessories are intact",
  ];

  const nonReturnableItems = [
    "Used or soldered electronic components",
    "Items damaged due to improper handling or installation",
    "Clearance or discounted products (if mentioned at purchase)",
    "Products returned without prior approval",
  ];

  const returnSteps = [
    {
      number: "1",
      text: "Contact us at support@razorbills.com",
    },
    {
      number: "2",
      text: "Share your order ID, product details, and clear images or videos of the issue",
    },
    {
      number: "3",
      text: "Our team will review the request and respond within 2 business days",
    },
  ];

  const importantNotes = [
    "Do not send products back without confirmation",
    "We reserve the right to reject returns that do not meet the eligibility criteria",
    "Refund timelines may vary based on banks or payment providers",
  ];

  return (
    <div className="min-h-screen bg-white text-neutral-900 dark:bg-black/10 dark:text-gray-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b dark:border-neutral-700">
        <div className="absolute inset-0"></div>

        <div className="relative max-w-7xl mx-auto px-6 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 dark:text-white">
              Returns & Refund Policy
            </h1>
            <p className="text-xl max-w-3xl mx-auto leading-relaxed dark:text-gray-300">
              We aim to provide high-quality electronic components and a
              transparent buying experience. Please read the return and refund
              policy carefully before placing an order.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Return Eligibility */}
        <Card className="mb-12">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-amber-100 flex items-center justify-center rounded-lg dark:bg-amber-900/30">
                <CheckCircle2 className="w-6 h-6 text-amber-600" />
              </div>
              <h2 className="text-3xl font-bold text-black dark:text-white">
                Return Eligibility
              </h2>
            </div>
            <p className="text-neutral-700 dark:text-gray-300 mb-4">
              Returns are accepted only under the following conditions:
            </p>
            <ul className="space-y-3">
              {returnEligibility.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5 dark:bg-amber-900/30">
                    <span className="text-amber-600 text-xs font-bold">✓</span>
                  </div>
                  <span className="text-neutral-700 dark:text-gray-300">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
            <Card className="mt-6 border-orange-200 bg-orange-50 dark:bg-orange-900/10 dark:border-orange-500/30">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-neutral-700 dark:text-gray-300">
                    <strong>
                      Products that have been used, installed, soldered,
                      altered, or physically damaged after delivery are not
                      eligible for return.
                    </strong>
                  </p>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        {/* Non-Returnable Items */}
        <Card className="mb-12 border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-500/30">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-red-100 flex items-center justify-center rounded-lg dark:bg-red-900/30">
                <X className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-3xl font-bold text-black dark:text-white">
                Non-Returnable Items
              </h2>
            </div>
            <p className="text-neutral-700 dark:text-gray-300 mb-4">
              The following items are not eligible for return or refund:
            </p>
            <ul className="space-y-3">
              {nonReturnableItems.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <X className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <span className="text-neutral-700 dark:text-gray-300">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* How to Request a Return */}
        <Card className="mb-12">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-amber-100 flex items-center justify-center rounded-lg dark:bg-amber-900/30">
                <FileText className="w-6 h-6 text-amber-600" />
              </div>
              <h2 className="text-3xl font-bold text-black dark:text-white">
                How to Request a Return
              </h2>
            </div>
            <p className="text-neutral-700 dark:text-gray-300 mb-6">
              To initiate a return:
            </p>
            <div className="space-y-4 mb-6">
              {returnSteps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold flex-shrink-0">
                    {step.number}
                  </div>
                  <p className="text-neutral-700 dark:text-gray-300 pt-1.5">
                    {step.text}
                  </p>
                </div>
              ))}
            </div>
            <Card className="border-amber-200 bg-amber-50 dark:bg-amber-900/10 dark:border-amber-500/30">
              <CardContent className="p-4">
                <p className="text-sm font-semibold text-neutral-800 dark:text-gray-200">
                  Returns must be approved before shipping the product back.
                </p>
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Refunds */}
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-amber-100 flex items-center justify-center rounded-lg dark:bg-amber-900/30">
                  <DollarSign className="w-6 h-6 text-amber-600" />
                </div>
                <h2 className="text-2xl font-bold text-black dark:text-white">
                  Refunds
                </h2>
              </div>
              <ul className="space-y-3 mb-4">
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5 dark:bg-amber-900/30">
                    <span className="text-amber-600 text-xs font-bold">✓</span>
                  </div>
                  <span className="text-neutral-700 dark:text-gray-300">
                    Once the returned product is received and inspected, we will
                    notify you of the approval or rejection
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5 dark:bg-amber-900/30">
                    <span className="text-amber-600 text-xs font-bold">✓</span>
                  </div>
                  <span className="text-neutral-700 dark:text-gray-300">
                    If approved, refunds will be processed within 5–7 business
                    days
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5 dark:bg-amber-900/30">
                    <span className="text-amber-600 text-xs font-bold">✓</span>
                  </div>
                  <span className="text-neutral-700 dark:text-gray-300">
                    Refunds will be credited to the original payment method
                  </span>
                </li>
              </ul>
              <p className="text-sm text-neutral-600 dark:text-gray-400 italic">
                Shipping charges (if any) are non-refundable, unless the return
                is due to our error.
              </p>
            </CardContent>
          </Card>

          {/* Replacement Option */}
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-amber-100 flex items-center justify-center rounded-lg dark:bg-amber-900/30">
                  <Package className="w-6 h-6 text-amber-600" />
                </div>
                <h2 className="text-2xl font-bold text-black dark:text-white">
                  Replacement Option
                </h2>
              </div>
              <p className="text-neutral-700 dark:text-gray-300">
                In cases of damaged or defective products, we may offer a
                replacement instead of a refund, based on availability and
                customer preference.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Return Shipping */}
        <Card className="mb-12">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-amber-100 flex items-center justify-center rounded-lg dark:bg-amber-900/30">
                <Truck className="w-6 h-6 text-amber-600" />
              </div>
              <h2 className="text-2xl font-bold text-black dark:text-white">
                Return Shipping
              </h2>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5 dark:bg-amber-900/30">
                  <span className="text-amber-600 text-xs font-bold">✓</span>
                </div>
                <span className="text-neutral-700 dark:text-gray-300">
                  If the return is due to a wrong or defective product, return
                  shipping will be arranged or reimbursed by us
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5 dark:bg-amber-900/30">
                  <span className="text-amber-600 text-xs font-bold">✓</span>
                </div>
                <span className="text-neutral-700 dark:text-gray-300">
                  For other approved returns, the customer may be responsible
                  for return shipping costs
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Important Notes */}
        <Card className="mb-12 border-blue-200 bg-blue-50 dark:bg-blue-900/10 dark:border-blue-500/30">
          <CardContent className="p-8">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold mb-4 text-black dark:text-white">
                  Important Notes
                </h3>
                <ul className="space-y-3">
                  {importantNotes.map((note, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="text-blue-600 font-bold">•</span>
                      <span className="text-neutral-700 dark:text-gray-300">
                        {note}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Need Help Section */}
        <Card className="border-amber-200 bg-amber-50 dark:bg-amber-900/10 dark:border-amber-500/30">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4 text-black dark:text-white">
              Need Help?
            </h3>
            <p className="text-neutral-700 dark:text-gray-300 mb-6">
              For questions related to returns or refunds, contact:
            </p>
            <div className="flex items-center justify-center gap-2 mb-6">
              <Mail className="w-5 h-5 text-amber-600" />
              <a
                href="mailto:support@razorbills.com"
                className="text-lg font-semibold text-amber-600 hover:text-amber-700"
              >
                support@razorbills.com
              </a>
            </div>
            <p className="text-neutral-700 dark:text-gray-300">
              We're here to help.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
