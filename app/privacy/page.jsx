'use client';

import React from "react";
import { Separator } from "@/components/ui/separator";

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground text-lg">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <Separator className="mb-8" />

        <div className="space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
            <p className="text-muted-foreground leading-relaxed">
              At RazorBills, we are committed to protecting your privacy and ensuring the security of your personal information. 
              This Privacy Policy explains how we collect, use, protect, and share your information when you use our e-commerce platform 
              for electronics and electronic components.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-medium mb-2">Personal Information</h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Name, email address, and phone number</li>
                  <li>Billing and shipping addresses</li>
                  <li>Payment information (processed securely through encrypted channels)</li>
                  <li>Account credentials (username and encrypted password)</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2">Usage Information</h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Product preferences and purchase history</li>
                  <li>Website interaction data and browsing patterns</li>
                  <li>Search queries and wishlist items</li>
                  <li>Device information and IP address</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Data Security & Encryption */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Data Security & Encryption</h2>
            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                We implement industry-standard security measures to protect your data:
              </p>
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="text-xl font-medium mb-2">End-to-End Encryption</h3>
                <p className="text-muted-foreground">
                  All sensitive data transmitted between your device and our servers is protected using end-to-end encryption. 
                  This ensures that your personal information, payment details, and communications remain secure during transmission.
                </p>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="text-xl font-medium mb-2">Secure Backend Infrastructure</h3>
                <p className="text-muted-foreground">
                  Our ExpressJS backend implements robust security protocols, including data validation, secure authentication, 
                  and encrypted API communications to protect against unauthorized access.
                </p>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="text-xl font-medium mb-2">Firebase Security</h3>
                <p className="text-muted-foreground">
                  We use Firebase as our database solution, which provides enterprise-grade security with automatic encryption 
                  at rest and in transit, secure authentication, and comprehensive security rules to protect your data.
                </p>
              </div>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Process and fulfill your orders and transactions</li>
              <li>Provide customer support and respond to inquiries</li>
              <li>Send order confirmations, shipping updates, and important account notifications</li>
              <li>Personalize your shopping experience and product recommendations</li>
              <li>Improve our website functionality and user experience</li>
              <li>Detect and prevent fraudulent activities</li>
              <li>Comply with legal obligations and protect our legal rights</li>
            </ul>
          </section>

          {/* Data Sharing */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Data Sharing and Third Parties</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We do not sell, rent, or trade your personal information to third parties. We may share your information only in the following circumstances:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>With trusted service providers who assist in operating our platform (payment processors, shipping companies)</li>
              <li>When required by law or to respond to legal process</li>
              <li>To protect our rights, property, or safety, or that of our users</li>
              <li>In connection with a business transfer or merger (with prior notice to users)</li>
            </ul>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Your Privacy Rights</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              You have the following rights regarding your personal information:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li><strong>Access:</strong> Request a copy of the personal information we have about you</li>
              <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
              <li><strong>Deletion:</strong> Request deletion of your personal information (subject to legal requirements)</li>
              <li><strong>Portability:</strong> Request transfer of your data to another service provider</li>
              <li><strong>Opt-out:</strong> Unsubscribe from marketing communications at any time</li>
              <li><strong>Restrict Processing:</strong> Request limitation on how we use your information</li>
            </ul>
          </section>

          {/* Cookies and Tracking */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Cookies and Tracking Technologies</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We use cookies and similar technologies to enhance your browsing experience:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li><strong>Essential Cookies:</strong> Required for website functionality and security</li>
              <li><strong>Performance Cookies:</strong> Help us understand how visitors interact with our website</li>
              <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
              <li><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements (with your consent)</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              You can manage your cookie preferences through your browser settings or our cookie management tool.
            </p>
          </section>

          {/* Data Retention */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Data Retention</h2>
            <p className="text-muted-foreground leading-relaxed">
              We retain your personal information only for as long as necessary to fulfill the purposes outlined in this policy, 
              comply with legal obligations, resolve disputes, and enforce our agreements. Account information is typically 
              retained while your account is active and for a reasonable period thereafter for legal and business purposes.
            </p>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Children's Privacy</h2>
            <p className="text-muted-foreground leading-relaxed">
              RazorBills is not intended for children under 13 years of age. We do not knowingly collect personal information 
              from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, 
              please contact us immediately, and we will delete such information from our systems.
            </p>
          </section>

          {/* International Transfers */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">International Data Transfers</h2>
            <p className="text-muted-foreground leading-relaxed">
              Your information may be transferred to and processed in countries other than your country of residence. 
              These countries may have different data protection laws. When we transfer your information internationally, 
              we ensure appropriate safeguards are in place to protect your privacy and comply with applicable data protection laws.
            </p>
          </section>

          {/* Policy Updates */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Policy Updates</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this Privacy Policy from time to time to reflect changes in our practices or applicable laws. 
              We will notify you of any material changes by posting the updated policy on our website and updating the "Last updated" date. 
              Your continued use of our services after such changes constitutes your acceptance of the updated policy.
            </p>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="bg-muted p-6 rounded-lg space-y-2">
              <p><strong>RazorBills Privacy Team</strong></p>
              <p>Email: privacy@razorbills.com</p>
              <p>Address: [Your Business Address]</p>
              <p>Phone: [Your Contact Number]</p>
            </div>
            <p className="text-muted-foreground mt-4">
              We are committed to resolving any privacy-related concerns promptly and transparently.
            </p>
          </section>
        </div>

        <Separator className="mt-12 mb-8" />
        
        <div className="text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} RazorBills. Your privacy is our priority.</p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;