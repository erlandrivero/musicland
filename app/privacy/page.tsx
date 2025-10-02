import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Shield, Lock, Eye, Database, Globe, Users } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy | AI Music Studio',
  description: 'Privacy Policy for AI Music Studio',
};

/* eslint-disable react/no-unescaped-entities */
export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Home</span>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900">Privacy Policy</h1>
            </div>
            <p className="text-gray-600">Last Updated: October 1, 2025</p>
          </div>

          {/* Quick Links */}
          <div className="bg-blue-50 border-l-4 border-blue-600 p-6 mb-8">
            <h3 className="font-semibold text-gray-900 mb-3">Quick Navigation</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <a href="#introduction" className="text-blue-600 hover:text-blue-800">1. Introduction</a>
              <a href="#information-we-collect" className="text-blue-600 hover:text-blue-800">2. Information We Collect</a>
              <a href="#how-we-use" className="text-blue-600 hover:text-blue-800">3. How We Use Your Information</a>
              <a href="#how-we-share" className="text-blue-600 hover:text-blue-800">4. How We Share Your Information</a>
              <a href="#data-retention" className="text-blue-600 hover:text-blue-800">5. Data Retention</a>
              <a href="#your-rights" className="text-blue-600 hover:text-blue-800">6. Your Privacy Rights</a>
              <a href="#data-security" className="text-blue-600 hover:text-blue-800">7. Data Security</a>
              <a href="#international-transfers" className="text-blue-600 hover:text-blue-800">8. International Data Transfers</a>
              <a href="#cookies" className="text-blue-600 hover:text-blue-800">9. Cookies and Tracking</a>
              <a href="#children" className="text-blue-600 hover:text-blue-800">10. Children's Privacy</a>
              <a href="#california" className="text-blue-600 hover:text-blue-800">11. California Privacy Rights</a>
              <a href="#contact" className="text-blue-600 hover:text-blue-800">13. Contact Information</a>
            </div>
          </div>

          <div className="prose prose-gray max-w-none">
            {/* 1. Introduction */}
            <section id="introduction" className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
              <p className="text-gray-700 mb-4">
                This Privacy Policy describes how AI Music Studio ("we," "us," or "our") collects, uses, processes, and 
                shares your personal information when you use our website, products, and services (collectively, "Services"). 
                We are committed to protecting your privacy and handling your data in a transparent and secure manner. By 
                accessing or using our Services, you agree to the terms of this Privacy Policy.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">1.1 Scope of Policy</h3>
              <p className="text-gray-700 mb-4">
                This Privacy Policy applies to all personal information collected through our Services, as well as any related 
                services, sales, marketing, or events. It does not apply to third-party websites or services that may be linked 
                from our Services.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">1.2 Changes to Policy</h3>
              <p className="text-gray-700 mb-4">
                We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the 
                updated policy on our website or through other appropriate communication channels. Your continued use of our 
                Services after such changes constitutes your acceptance of the revised Privacy Policy.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">1.3 Data Controller</h3>
              <p className="text-gray-700 mb-4">
                AI Music Studio is the data controller responsible for your personal information collected through our Services.
              </p>
            </section>

            {/* 2. Information We Collect */}
            <section id="information-we-collect" className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <Database className="w-6 h-6 text-blue-600" />
                2. Information We Collect
              </h2>
              <p className="text-gray-700 mb-4">
                We collect various types of information to provide and improve our Services, including:
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">2.1 Personal Information You Provide</h3>
              
              <div className="space-y-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Account Data</h4>
                  <p className="text-gray-700">
                    When you create an account, we collect your name, email address, and password. If you use third-party 
                    authentication (e.g., Google Sign-In), we receive information from that service as authorized by you.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Contact Data</h4>
                  <p className="text-gray-700">
                    If you contact us for support, inquiries, or feedback, we collect your name, email address, and the 
                    content of your communication.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Payment Data</h4>
                  <p className="text-gray-700">
                    When you make purchases, we collect payment information through secure third-party payment processors. 
                    We do not store full payment card numbers on our servers.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Usage Data</h4>
                  <p className="text-gray-700">
                    Information about how you use our Services, including features accessed, music generated, time spent, 
                    and interactions with AI models.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Content Data</h4>
                  <p className="text-gray-700">
                    Any content you create, upload, or generate using our Services, including music, audio files, lyrics, 
                    or other media.
                  </p>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">2.2 Information Collected Automatically</h3>
              
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li><strong>Log Data:</strong> IP address, browser type, operating system, referring URLs, device information, and timestamps</li>
                <li><strong>Usage Data:</strong> Pages viewed, features used, and duration of sessions</li>
                <li><strong>Device Data:</strong> Hardware model, operating system, unique device identifiers, and mobile network information</li>
                <li><strong>Location Data:</strong> Approximate location based on IP address or precise location if you enable location services</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">2.3 Information from Third Parties</h3>
              <p className="text-gray-700 mb-4">
                We may receive information about you from third-party services, such as analytics providers, advertising 
                partners, and social media platforms, in accordance with their privacy policies.
              </p>
            </section>

            {/* 3. How We Use Your Information */}
            <section id="how-we-use" className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <Eye className="w-6 h-6 text-blue-600" />
                3. How We Use Your Information
              </h2>
              <p className="text-gray-700 mb-4">
                We use the information we collect for various purposes, including:
              </p>

              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li><strong>To Provide and Maintain Services:</strong> To operate, maintain, and improve the functionality of our Services, including processing music generation requests and delivering requested features</li>
                <li><strong>To Personalize User Experience:</strong> To tailor our Services to your preferences, provide customized music recommendations, and offer relevant suggestions</li>
                <li><strong>To Communicate with You:</strong> To send you service-related notifications, updates, security alerts, and support messages</li>
                <li><strong>For Analytics and Research:</strong> To understand how users interact with our Services, analyze trends, and conduct research to enhance our offerings</li>
                <li><strong>For Security and Fraud Prevention:</strong> To detect, prevent, and address fraudulent or unauthorized activities</li>
                <li><strong>For Legal Compliance:</strong> To comply with applicable laws, regulations, legal processes, and governmental requests</li>
                <li><strong>For Marketing and Advertising:</strong> To deliver targeted advertisements and measure the effectiveness of our marketing campaigns</li>
                <li><strong>For AI Model Training:</strong> To train and improve our AI music generation models using anonymized or aggregated data. We do not use personal content for training without explicit consent</li>
              </ul>
            </section>

            {/* 4. How We Share Your Information */}
            <section id="how-we-share" className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <Users className="w-6 h-6 text-blue-600" />
                4. How We Share Your Information
              </h2>
              <p className="text-gray-700 mb-4">
                We may share your information with third parties in the following circumstances:
              </p>

              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Service Providers</h4>
                  <p className="text-gray-700">
                    We engage third-party service providers to perform functions on our behalf, such as payment processing, 
                    hosting, analytics, and customer support. These providers have access to personal information only as 
                    needed to perform their functions and are bound by confidentiality obligations.
                  </p>
                </div>

                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Business Transfers</h4>
                  <p className="text-gray-700">
                    In the event of a merger, acquisition, reorganization, or sale of all or a portion of our assets, your 
                    information may be transferred as part of that transaction.
                  </p>
                </div>

                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Legal Requirements</h4>
                  <p className="text-gray-700">
                    We may disclose your information if required to do so by law or in response to valid requests by public 
                    authorities.
                  </p>
                </div>

                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Protection of Rights</h4>
                  <p className="text-gray-700">
                    We may disclose your information to protect our rights, property, or safety, or the rights, property, or 
                    safety of our users or others.
                  </p>
                </div>

                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold text-gray-900 mb-2">With Your Consent</h4>
                  <p className="text-gray-700">
                    We may share your information with third parties when we have your explicit consent to do so.
                  </p>
                </div>

                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Aggregated or Anonymized Data</h4>
                  <p className="text-gray-700">
                    We may share aggregated or anonymized data that cannot reasonably be used to identify you with third 
                    parties for various purposes, including research, analytics, and marketing.
                  </p>
                </div>
              </div>
            </section>

            {/* 5. Data Retention */}
            <section id="data-retention" className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Data Retention</h2>
              <p className="text-gray-700 mb-4">
                We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy 
                Policy, unless a longer retention period is required or permitted by law. When your personal information is no 
                longer needed, we will securely delete or anonymize it.
              </p>
            </section>

            {/* 6. Your Privacy Rights */}
            <section id="your-rights" className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Your Privacy Rights</h2>
              <p className="text-gray-700 mb-4">
                Depending on your jurisdiction, you may have certain rights regarding your personal information, including:
              </p>

              <div className="bg-green-50 rounded-lg p-6 space-y-3">
                <div>
                  <h4 className="font-semibold text-gray-900">✓ Right to Access</h4>
                  <p className="text-gray-700">Request access to the personal information we hold about you</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">✓ Right to Rectification</h4>
                  <p className="text-gray-700">Request correction of inaccurate or incomplete personal information</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">✓ Right to Erasure (Right to be Forgotten)</h4>
                  <p className="text-gray-700">Request deletion of your personal information under certain circumstances</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">✓ Right to Restriction of Processing</h4>
                  <p className="text-gray-700">Request restriction of processing under certain conditions</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">✓ Right to Data Portability</h4>
                  <p className="text-gray-700">Receive your personal information in a structured, machine-readable format</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">✓ Right to Object</h4>
                  <p className="text-gray-700">Object to processing of your personal information, including for direct marketing</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">✓ Right to Withdraw Consent</h4>
                  <p className="text-gray-700">Withdraw consent at any time where we rely on consent to process your data</p>
                </div>
              </div>

              <p className="text-gray-700 mt-4">
                To exercise any of these rights, please contact us using the contact information provided in Section 13.
              </p>
            </section>

            {/* 7. Data Security */}
            <section id="data-security" className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <Lock className="w-6 h-6 text-blue-600" />
                7. Data Security
              </h2>
              <p className="text-gray-700 mb-4">
                We implement appropriate technical and organizational measures to protect your personal information from 
                unauthorized access, disclosure, alteration, or destruction. These measures include:
              </p>

              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>Encryption of data in transit and at rest</li>
                <li>Access controls and authentication mechanisms</li>
                <li>Regular security audits and vulnerability assessments</li>
                <li>Employee training on data protection and security</li>
                <li>Secure data centers with physical security measures</li>
              </ul>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <p className="text-gray-800">
                  <strong>Important:</strong> However, no method of transmission over the internet or electronic storage is 
                  100% secure, and we cannot guarantee absolute security of your personal information.
                </p>
              </div>
            </section>

            {/* 8. International Data Transfers */}
            <section id="international-transfers" className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <Globe className="w-6 h-6 text-blue-600" />
                8. International Data Transfers
              </h2>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">8.1 Global Operations</h3>
              <p className="text-gray-700 mb-4">
                AI Music Studio operates globally, and your personal information may be transferred to and processed in 
                countries other than your country of residence. These countries may have different data protection laws than 
                your country.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">8.2 Safeguards for International Transfers</h3>
              <p className="text-gray-700 mb-4">
                When we transfer personal information internationally, we implement appropriate safeguards:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li><strong>Adequacy Decisions:</strong> Transfer to countries deemed to provide adequate protection</li>
                <li><strong>Standard Contractual Clauses:</strong> Use of European Commission-approved clauses</li>
                <li><strong>Binding Corporate Rules:</strong> Implementation of internal data protection rules</li>
                <li><strong>Certification Programs:</strong> Reliance on certification programs providing appropriate safeguards</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">8.3 Data Processing Locations</h3>
              <p className="text-gray-700 mb-4">
                Your personal information may be processed in the following regions:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>United States (primary data processing location)</li>
                <li>European Union (for EU users and backup purposes)</li>
                <li>Other regions where our service providers operate</li>
              </ul>
            </section>

            {/* 9. Cookies and Tracking Technologies */}
            <section id="cookies" className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Cookies and Tracking Technologies</h2>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">9.1 Types of Cookies We Use</h3>
              <div className="space-y-3 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Essential Cookies</h4>
                  <p className="text-gray-700">
                    Necessary for the operation of our Services, including authentication, security, and basic functionality.
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Performance Cookies</h4>
                  <p className="text-gray-700">
                    Help us understand how users interact with our Services by collecting anonymous usage statistics.
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Functional Cookies</h4>
                  <p className="text-gray-700">
                    Enable enhanced functionality and personalization, such as remembering your preferences.
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Marketing Cookies</h4>
                  <p className="text-gray-700">
                    Used to deliver relevant advertisements and measure the effectiveness of marketing campaigns.
                  </p>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">9.2 Third-Party Cookies</h3>
              <p className="text-gray-700 mb-4">
                We may allow third-party service providers to place cookies on your device for analytics, advertising, and 
                other purposes. These third parties have their own privacy policies governing their use of your information.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">9.3 Cookie Management</h3>
              <p className="text-gray-700 mb-4">
                You can control cookies through your browser settings:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Most browsers allow you to block or delete cookies</li>
                <li>You can set your browser to notify you when cookies are being used</li>
                <li>Some features of our Services may not function properly if you disable cookies</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">9.4 Do Not Track</h3>
              <p className="text-gray-700 mb-4">
                Currently, we do not respond to "Do Not Track" signals from browsers, as there is no universally accepted 
                standard for how to respond to such signals.
              </p>
            </section>

            {/* 10. Children's Privacy */}
            <section id="children" className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Children's Privacy</h2>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">10.1 Age Restrictions</h3>
              <p className="text-gray-700 mb-4">
                Our Services are not intended for children under the age of 16. We do not knowingly collect personal 
                information from children under 16 without parental consent.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">10.2 Parental Rights</h3>
              <p className="text-gray-700 mb-4">
                If you are a parent or guardian and believe that your child has provided us with personal information, please 
                contact us immediately. We will take steps to remove such information from our systems.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">10.3 Educational Use</h3>
              <p className="text-gray-700 mb-4">
                If our Services are used in educational settings with children, we ensure compliance with applicable laws such 
                as COPPA (Children's Online Privacy Protection Act) and work with educational institutions to obtain appropriate 
                consents.
              </p>
            </section>

            {/* 11. California Privacy Rights */}
            <section id="california" className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. California Privacy Rights</h2>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">11.1 CCPA Disclosures</h3>
              <p className="text-gray-700 mb-4">
                For California residents, we provide the following disclosures about our data practices:
              </p>

              <div className="bg-blue-50 rounded-lg p-6 mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Categories of Personal Information Collected:</h4>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>Identifiers (name, email, IP address)</li>
                  <li>Commercial information (purchase history, preferences)</li>
                  <li>Internet activity (usage data, device information)</li>
                  <li>Audio/visual information (music files, voice recordings)</li>
                  <li>Professional information (job title, company)</li>
                </ul>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">11.2 Sale of Personal Information</h3>
              <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
                <p className="text-gray-800 font-medium">
                  We do not sell personal information as defined by the CCPA. We do not have actual knowledge of selling 
                  personal information of minors under 16 years of age.
                </p>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">11.3 Exercising CCPA Rights</h3>
              <p className="text-gray-700 mb-4">
                California residents can exercise their rights by:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Emailing us at privacy@mindforu.com</li>
                <li>Submitting a request through our website</li>
              </ul>
              <p className="text-gray-700 mb-4">
                We do not discriminate against users who exercise their CCPA rights.
              </p>
            </section>

            {/* 12. Updates to This Privacy Policy */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Updates to This Privacy Policy</h2>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">12.1 Policy Changes</h3>
              <p className="text-gray-700 mb-4">
                We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal 
                requirements, or other factors. We will notify you of any material changes through:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Email notification to the email address associated with your account</li>
                <li>Posting a prominent notice on our website and within our Services</li>
                <li>Providing notification through our platform interface</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">12.2 Effective Date</h3>
              <p className="text-gray-700 mb-4">
                Changes to this Privacy Policy will become effective on the date specified in the updated policy. Your 
                continued use of our Services after the effective date constitutes acceptance of the updated Privacy Policy.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">12.3 Material Changes</h3>
              <p className="text-gray-700 mb-4">
                For material changes that significantly affect your privacy rights, we will provide at least 30 days' advance 
                notice and may require your explicit consent to continue using our Services.
              </p>
            </section>

            {/* 13. Contact Information */}
            <section id="contact" className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Contact Information</h2>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">13.1 Privacy Officer</h3>
              <p className="text-gray-700 mb-4">
                For questions, concerns, or requests related to this Privacy Policy or our data practices, please contact our 
                Privacy Officer:
              </p>
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <p className="text-gray-700"><strong>Email:</strong> privacy@mindforu.com</p>
                <p className="text-gray-700"><strong>Website:</strong> https://mindforu.com</p>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">13.2 Data Protection Officer</h3>
              <p className="text-gray-700 mb-4">
                For users in the European Union, you can contact our Data Protection Officer:
              </p>
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <p className="text-gray-700"><strong>Email:</strong> dpo@mindforu.com</p>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">13.3 General Contact Information</h3>
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <p className="text-gray-700"><strong>Customer Support:</strong> support@mindforu.com</p>
                <p className="text-gray-700"><strong>Legal Department:</strong> legal@mindforu.com</p>
                <p className="text-gray-700"><strong>Website:</strong> https://mindforu.com</p>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">13.4 Supervisory Authorities</h3>
              <p className="text-gray-700 mb-4">
                If you are located in the European Economic Area and believe we have violated your privacy rights, you have 
                the right to lodge a complaint with your local data protection authority.
              </p>
            </section>

            {/* 14. Additional Information */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Additional Information</h2>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">14.1 Third-Party Links</h3>
              <p className="text-gray-700 mb-4">
                Our Services may contain links to third-party websites or services. This Privacy Policy does not apply to 
                those third-party sites, and we are not responsible for their privacy practices. We encourage you to review 
                the privacy policies of any third-party sites you visit.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">14.2 Social Media</h3>
              <p className="text-gray-700 mb-4">
                We may maintain social media accounts and interact with users through social media platforms. Your 
                interactions with us on social media are governed by the privacy policies of those platforms.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">14.3 Data Accuracy</h3>
              <p className="text-gray-700 mb-4">
                We strive to maintain accurate and up-to-date personal information. Please help us by keeping your account 
                information current and notifying us of any changes.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">14.4 Privacy by Design</h3>
              <p className="text-gray-700 mb-4">
                We incorporate privacy considerations into the design and development of our Services, implementing 
                privacy-protective measures from the outset rather than as an afterthought.
              </p>
            </section>

            {/* ACKNOWLEDGMENT */}
            <section className="mb-12">
              <div className="bg-blue-50 border-l-4 border-blue-600 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">ACKNOWLEDGMENT</h2>
                <p className="text-gray-800 font-medium">
                  By using our Services, you acknowledge that you have read and understood this Privacy Policy and agree to 
                  our collection, use, and disclosure of your personal information as described herein.
                </p>
                <p className="text-gray-700 mt-4">
                  This Privacy Policy is effective as of the "Last Updated" date specified above and will remain in effect 
                  until modified in accordance with the provisions herein.
                </p>
              </div>
            </section>

            {/* Footer */}
            <div className="text-center pt-8 border-t border-gray-200">
              <p className="text-gray-600">© 2025 AI Music Studio. All rights reserved.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
