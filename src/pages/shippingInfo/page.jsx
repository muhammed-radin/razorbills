import { Package, Clock, Truck, MapPin, IndianRupee, Search, Shield, AlertCircle, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function RazorbillsShipping() {
  const deliveryTimes = [
    {
      title: 'Standard Delivery Time',
      duration: '3–7 working days',
      description: 'For most locations across India'
    }
  ];

  const processingSteps = [
    'We process and ship most orders within 24 working hours of order confirmation',
    'Orders placed on public holidays are processed on the next working day',
    'Dispatch timelines may vary for high-volume, bulk, or made-to-order items',
    'Order status and tracking details are shared via email once the order is shipped'
  ];

  const deliveryFactors = [
    'Customer location',
    'Courier partner serviceability',
    'Local delivery conditions'
  ];

  const trackingFeatures = [
    'A tracking number shared via email/SMS',
    'Updates from the courier partner until delivery'
  ];

  return (
    <div className="min-h-screen bg-white text-neutral-900 dark:bg-black/10 dark:text-gray-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b dark:border-neutral-700">
        <div className="absolute inset-0"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 dark:text-white">
              Shipping Information
            </h1>
            <p className="text-xl max-w-3xl mx-auto leading-relaxed dark:text-gray-300">
              We ship electronic components across India with reliable logistics partners to ensure safe and timely delivery.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Shipping Coverage */}
        <Card className="mb-12 border-amber-200 bg-amber-50 dark:bg-amber-900/10 dark:border-amber-500/30">
          <CardContent className="p-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-amber-100 flex items-center justify-center rounded-lg dark:bg-amber-900/30">
                <Package className="w-7 h-7 text-amber-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-1 text-black dark:text-white">
                  Shipping Coverage
                </h2>
                <p className="text-lg text-amber-600 font-semibold">
                  We currently deliver nationwide across India
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Order Processing Time */}
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-amber-100 flex items-center justify-center rounded-lg dark:bg-amber-900/30">
                  <Clock className="w-6 h-6 text-amber-600" />
                </div>
                <h2 className="text-2xl font-bold text-black dark:text-white">
                  Order Processing & Dispatch
                </h2>
              </div>
              <ul className="space-y-3">
                {processingSteps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5 dark:bg-amber-900/30">
                      <span className="text-amber-600 text-xs font-bold">✓</span>
                    </div>
                    <span className="text-neutral-700 dark:text-gray-300">{step}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Shipping Charges */}
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-amber-100 flex items-center justify-center rounded-lg dark:bg-amber-900/30">
                  <IndianRupee className="w-6 h-6 text-amber-600" />
                </div>
                <h2 className="text-2xl font-bold text-black dark:text-white">
                  Shipping Charges
                </h2>
              </div>
              <h3 className="font-semibold text-lg mb-4 text-black dark:text-white">
                Shipping Fee Structure
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b-2 border-neutral-300 dark:border-neutral-600">
                      <th className="text-left py-3 px-2 text-sm font-semibold text-black dark:text-white">Payment Type</th>
                      <th className="text-left py-3 px-2 text-sm font-semibold text-black dark:text-white">Order Value</th>
                      <th className="text-left py-3 px-2 text-sm font-semibold text-black dark:text-white">Shipping Fee</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-neutral-200 dark:border-neutral-700">
                      <td className="py-3 px-2 text-sm text-neutral-700 dark:text-gray-300">Prepaid (UPI / Card)</td>
                      <td className="py-3 px-2 text-sm text-neutral-700 dark:text-gray-300">More than ₹500</td>
                      <td className="py-3 px-2 text-sm font-semibold text-green-600">FREE</td>
                    </tr>
                    <tr className="border-b border-neutral-200 dark:border-neutral-700">
                      <td className="py-3 px-2 text-sm text-neutral-700 dark:text-gray-300">Prepaid (UPI / Card)</td>
                      <td className="py-3 px-2 text-sm text-neutral-700 dark:text-gray-300">Less than ₹500</td>
                      <td className="py-3 px-2 text-sm font-semibold text-amber-600">₹50</td>
                    </tr>
                    <tr className="border-b border-neutral-200 dark:border-neutral-700">
                      <td className="py-3 px-2 text-sm text-neutral-700 dark:text-gray-300">Cash on Delivery (COD)</td>
                      <td className="py-3 px-2 text-sm text-neutral-700 dark:text-gray-300">More than ₹500</td>
                      <td className="py-3 px-2 text-sm font-semibold text-amber-600">₹30</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-2 text-sm text-neutral-700 dark:text-gray-300">Cash on Delivery (COD)</td>
                      <td className="py-3 px-2 text-sm text-neutral-700 dark:text-gray-300">Less than ₹500</td>
                      <td className="py-3 px-2 text-sm font-semibold text-amber-600">₹80</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-neutral-600 dark:text-gray-400 mt-4">
                Shipping charges (if applicable) are displayed clearly at checkout.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Estimated Delivery Time */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-amber-100 flex items-center justify-center rounded-lg dark:bg-amber-900/30">
              <Truck className="w-6 h-6 text-amber-600" />
            </div>
            <h2 className="text-3xl font-bold text-black dark:text-white">
              Estimated Delivery Time
            </h2>
          </div>
          
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="font-bold text-2xl mb-2 text-black dark:text-white">
                  Standard Delivery Time
                </h3>
                <p className="text-3xl text-amber-600 font-bold mb-4">
                  3–7 working days
                </p>
                <p className="text-neutral-600 dark:text-gray-400">
                  For most locations across India
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-4 text-black dark:text-white">
                Delivery time depends on:
              </h3>
              <ul className="space-y-3">
                {deliveryFactors.map((factor, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5 dark:bg-amber-900/30">
                      <span className="text-amber-600 text-xs font-bold">✓</span>
                    </div>
                    <span className="text-neutral-700 dark:text-gray-300">{factor}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-neutral-300 dark:border-neutral-600">
            <CardContent className="p-4">
              <p className="text-sm text-neutral-600 dark:text-gray-400 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>
                  Delivery timelines are estimated and may be affected by factors beyond our control such as weather, strikes, natural calamities, or courier delays.
                </span>
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Address & Delivery Responsibility */}
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-amber-100 flex items-center justify-center rounded-lg dark:bg-amber-900/30">
                  <MapPin className="w-6 h-6 text-amber-600" />
                </div>
                <h2 className="text-2xl font-bold text-black dark:text-white">
                  Address & Delivery Responsibility
                </h2>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5 dark:bg-amber-900/30">
                    <span className="text-amber-600 text-xs font-bold">✓</span>
                  </div>
                  <span className="text-neutral-700 dark:text-gray-300">
                    Customers must ensure that the shipping address, PIN code, and contact number are accurate
                  </span>
                </li>
              </ul>
              <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg dark:bg-orange-900/10 dark:border-orange-500/30">
                <p className="text-sm font-semibold text-neutral-800 dark:text-gray-200 mb-2">
                  We are not responsible for delays or non-delivery due to:
                </p>
                <ul className="space-y-2 text-sm text-neutral-700 dark:text-gray-300">
                  <li className="flex items-center gap-2">
                    <span className="text-orange-600">•</span>
                    Incorrect or incomplete address
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-orange-600">•</span>
                    Unreachable customer
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-orange-600">•</span>
                    Repeated delivery attempt failures
                  </li>
                </ul>
                <p className="text-sm font-semibold text-orange-700 dark:text-orange-400 mt-3">
                  Any re-shipping due to address issues will be chargeable.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Partial / Split Shipments */}
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-amber-100 flex items-center justify-center rounded-lg dark:bg-amber-900/30">
                  <Package className="w-6 h-6 text-amber-600" />
                </div>
                <h2 className="text-2xl font-bold text-black dark:text-white">
                  Partial / Split Shipments
                </h2>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5 dark:bg-amber-900/30">
                    <span className="text-amber-600 text-xs font-bold">✓</span>
                  </div>
                  <span className="text-neutral-700 dark:text-gray-300">
                    In some cases, orders containing multiple items may be shipped in multiple packages
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5 dark:bg-amber-900/30">
                    <span className="text-amber-600 text-xs font-bold">✓</span>
                  </div>
                  <span className="text-neutral-700 dark:text-gray-300">
                    Customers will receive tracking details for each shipment separately
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Order Tracking */}
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-amber-100 flex items-center justify-center rounded-lg dark:bg-amber-900/30">
                  <Search className="w-6 h-6 text-amber-600" />
                </div>
                <h2 className="text-2xl font-bold text-black dark:text-white">
                  Shipment Tracking
                </h2>
              </div>
              <p className="text-neutral-700 dark:text-gray-300 mb-4">
                Once dispatched, you will receive:
              </p>
              <ul className="space-y-3">
                {trackingFeatures.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5 dark:bg-amber-900/30">
                      <span className="text-amber-600 text-xs font-bold">✓</span>
                    </div>
                    <span className="text-neutral-700 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
              <p className="text-sm text-neutral-600 dark:text-gray-400 mt-4">
                Customers are requested to track their shipment regularly and coordinate with the courier if required.
              </p>
            </CardContent>
          </Card>

          {/* Packaging & Safety */}
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-amber-100 flex items-center justify-center rounded-lg dark:bg-amber-900/30">
                  <Shield className="w-6 h-6 text-amber-600" />
                </div>
                <h2 className="text-2xl font-bold text-black dark:text-white">
                  Packaging & Safety
                </h2>
              </div>
              <p className="text-neutral-700 dark:text-gray-300">
                All components are packed securely to prevent damage during transit. Sensitive electronic parts are handled with appropriate protective packaging.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Undelivered / RTO Shipments */}
        <Card className="mb-12 border-orange-200 bg-orange-50 dark:bg-orange-900/10 dark:border-orange-500/30">
          <CardContent className="p-8">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold mb-3 text-black dark:text-white">
                  Undelivered / RTO Shipments
                </h3>
                <p className="text-neutral-700 dark:text-gray-300 mb-3">
                  If a shipment is returned to us (RTO – Return to Origin) due to:
                </p>
                <ul className="space-y-2 mb-4 text-neutral-700 dark:text-gray-300">
                  <li className="flex items-center gap-2">
                    <span className="text-orange-600">•</span>
                    Customer unavailability
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-orange-600">•</span>
                    Incorrect address
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-orange-600">•</span>
                    COD refusal
                  </li>
                </ul>
                <div className="bg-white dark:bg-black/20 p-4 rounded-lg border border-orange-300 dark:border-orange-600">
                  <p className="font-semibold text-neutral-800 dark:text-gray-200 mb-2">Then:</p>
                  <ul className="space-y-2 text-neutral-700 dark:text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 font-bold">→</span>
                      Re-shipping will be done only after additional shipping charges are paid
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 font-bold">→</span>
                      Refunds (if applicable) will be processed after deducting actual shipping and handling costs
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Questions Section */}
        <Card className="border-amber-200 bg-amber-50 dark:bg-amber-900/10 dark:border-amber-500/30">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4 text-black dark:text-white">
              Questions About Shipping?
            </h3>
            <p className="text-neutral-700 dark:text-gray-300 mb-6">
              For shipping-related questions, please contact us at:
            </p>
            <div className="flex items-center justify-center gap-2 mb-6">
              <Mail className="w-5 h-5 text-amber-600" />
              <a href="mailto:support@razorbills.com" className="text-lg font-semibold text-amber-600 hover:text-amber-700">
                support@razorbills.com
              </a>
            </div>
            <p className="text-neutral-700 dark:text-gray-300">
              We're happy to assist.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}