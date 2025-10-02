import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service | AI Music Studio',
  description: 'Terms and Conditions for AI Music Studio',
};

/* eslint-disable react/no-unescaped-entities */
export default function TermsPage() {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms and Conditions</h1>
          <p className="text-gray-600 mb-8">Last Updated: October 1, 2025</p>

          <div className="prose prose-gray max-w-none">
            {/* 1. INTRODUCTION */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. INTRODUCTION</h2>
              <p className="text-gray-700 mb-4">
                Welcome to AI Music Studio! These Terms and Conditions ("Terms") govern your access to and use of our website, 
                products, and services (collectively, "Services"). By accessing or using any part of our Services, you agree to 
                be bound by these Terms, our Privacy Policy, and all other policies and guidelines incorporated by reference. 
                If you do not agree to all of these Terms, do not access or use our Services.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">1.1 Acceptance of Terms</h3>
              <p className="text-gray-700 mb-4">
                Your continued use of our Services constitutes your explicit acceptance of these Terms. If you are using the 
                Services on behalf of an entity, you represent and warrant that you have the authority to bind that entity to 
                these Terms, and "you" and "your" refer to that entity.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">1.2 Changes to Terms</h3>
              <p className="text-gray-700 mb-4">
                We reserve the right to modify or update these Terms at any time. We will notify you of material changes by 
                posting the updated Terms on our website or through other reasonable means. Your continued use of the Services 
                after such modifications constitutes your acceptance of the revised Terms. It is your responsibility to review 
                these Terms periodically.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">1.3 Eligibility</h3>
              <p className="text-gray-700 mb-4">
                You must be at least 18 years old to use our Services. By agreeing to these Terms, you represent and warrant 
                that you are at least 18 years old and are otherwise legally qualified to enter into and form contracts under 
                applicable law.
              </p>
            </section>

            {/* 2. SERVICES DESCRIPTION */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. SERVICES DESCRIPTION</h2>
              <p className="text-gray-700 mb-4">
                AI Music Studio provides an innovative AI-powered platform designed to generate professional-quality music using 
                artificial intelligence. Our Services include access to AI music generation models, audio editing tools, and 
                features that leverage cutting-edge AI and machine learning technologies.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">2.1 AI-Powered Music Generation</h3>
              <p className="text-gray-700 mb-4">
                Our Services utilize AI models that generate music, audio, and related content ("AI-Generated Content"). While 
                we strive for quality and relevance, AI-Generated Content is produced by algorithms and may not always meet your 
                expectations or requirements. You acknowledge that AI technology is constantly evolving and may produce unexpected 
                results.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">2.2 Beta Features</h3>
              <p className="text-gray-700 mb-4">
                From time to time, we may offer new features or tools that are in beta testing. These features may not be fully 
                functional or stable and may be subject to change or withdrawal without notice. Your use of such features is at 
                your own risk.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">2.3 Service Availability</h3>
              <p className="text-gray-700 mb-4">
                We will use commercially reasonable efforts to ensure the availability of our Services. However, we do not 
                guarantee uninterrupted or error-free operation. We may suspend or discontinue any part of the Services at any 
                time, including for maintenance, upgrades, or unforeseen circumstances.
              </p>
            </section>

            {/* 3. USER ACCOUNTS AND REGISTRATION */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. USER ACCOUNTS AND REGISTRATION</h2>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">3.1 Account Creation</h3>
              <p className="text-gray-700 mb-4">
                To access certain features of our Services, you may be required to create an account. You agree to provide 
                accurate, current, and complete information during the registration process and to update such information to 
                keep it accurate, current, and complete.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">3.2 Account Security</h3>
              <p className="text-gray-700 mb-4">
                You are responsible for maintaining the confidentiality of your account credentials and for all activities that 
                occur under your account. You agree to notify us immediately of any unauthorized use of your account or any other 
                breach of security. We will not be liable for any loss or damage arising from your failure to comply with this 
                section.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">3.3 Account Usage</h3>
              <p className="text-gray-700 mb-4">
                You agree to use your account solely for your personal or internal business purposes and not to share your 
                account credentials with any third party. You are responsible for ensuring that all users who access our Services 
                through your account comply with these Terms.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">3.4 Termination of Account</h3>
              <p className="text-gray-700 mb-4">
                We reserve the right to suspend or terminate your account at our sole discretion, without notice or liability, 
                for any reason, including if you violate these Terms or if your use of the Services poses a security risk or 
                legal liability to us or others.
              </p>
            </section>

            {/* 4. USER CONDUCT AND RESPONSIBILITIES */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. USER CONDUCT AND RESPONSIBILITIES</h2>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">4.1 Prohibited Uses</h3>
              <p className="text-gray-700 mb-4">
                You agree not to use our Services for any purpose that is unlawful, harmful, or prohibited by these Terms. 
                Prohibited uses include, but are not limited to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>Engaging in any activity that violates applicable laws or regulations</li>
                <li>Infringing upon the intellectual property rights of others</li>
                <li>Transmitting any harmful, defamatory, obscene, or otherwise objectionable content</li>
                <li>Attempting to gain unauthorized access to our systems or other users' accounts</li>
                <li>Interfering with the proper functioning of our Services</li>
                <li>Using the Services to generate or disseminate misinformation, hate speech, or content that promotes violence or discrimination</li>
                <li>Reverse engineering, decompiling, or disassembling any part of our Services</li>
                <li>Using any automated system to access the Services in a manner that sends more request messages than a human can reasonably produce</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">4.2 Content Guidelines</h3>
              <p className="text-gray-700 mb-4">
                When using our Services to generate music or submit content, you agree to comply with all applicable content 
                guidelines and policies. You are solely responsible for the content you generate or submit and for ensuring that 
                it does not violate any third-party rights or applicable laws.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">4.3 Feedback</h3>
              <p className="text-gray-700 mb-4">
                If you provide us with any feedback, suggestions, or ideas regarding our Services ("Feedback"), you grant us a 
                perpetual, irrevocable, worldwide, royalty-free, and non-exclusive license to use, reproduce, modify, adapt, 
                publish, translate, distribute, and display such Feedback for any purpose, without compensation to you.
              </p>
            </section>

            {/* 5. INTELLECTUAL PROPERTY */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. INTELLECTUAL PROPERTY</h2>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">5.1 Our Intellectual Property</h3>
              <p className="text-gray-700 mb-4">
                All content, features, and functionality of the Services, including but not limited to text, graphics, logos, 
                icons, images, audio clips, video clips, data compilations, and software, and the design, selection, and 
                arrangement thereof, are the exclusive property of AI Music Studio or its licensors and are protected by 
                international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights 
                laws.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">5.2 User Content</h3>
              <p className="text-gray-700 mb-4">
                You retain all rights in and to the content you submit, generate, or display through our Services ("User Content"). 
                By submitting, generating, or displaying User Content, you grant AI Music Studio a worldwide, non-exclusive, 
                royalty-free, transferable, and sublicensable license to use, reproduce, distribute, prepare derivative works of, 
                display, and perform the User Content in connection with the Services and AI Music Studio's business, including 
                for promoting and redistributing part or all of the Services.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">5.3 AI-Generated Music Ownership</h3>
              <p className="text-gray-700 mb-4">
                To the extent that AI-Generated music is created using our Services, and subject to your compliance with these 
                Terms, we assign to you all our right, title, and interest in and to the AI-Generated music. You are responsible 
                for ensuring that your use of AI-Generated music complies with all applicable laws and does not infringe upon the 
                rights of any third party.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">5.4 Trademarks</h3>
              <p className="text-gray-700 mb-4">
                The AI Music Studio name, logo, and all related names, logos, product and service names, designs, and slogans are 
                trademarks of AI Music Studio or its affiliates or licensors. You must not use such marks without the prior 
                written permission of AI Music Studio.
              </p>
            </section>

            {/* 6. FEES AND PAYMENT */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. FEES AND PAYMENT</h2>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">6.1 Pricing</h3>
              <p className="text-gray-700 mb-4">
                Access to certain features of our Services may require payment of fees or purchase of credits. All fees are 
                clearly stated on our website or within the Service. We reserve the right to change our pricing at any time, 
                but such changes will not affect ongoing subscriptions until their renewal.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">6.2 Payment Terms</h3>
              <p className="text-gray-700 mb-4">
                All payments are due in advance for the subscription period or credit purchase. We accept various payment methods 
                as indicated on our website. You authorize us to charge your chosen payment method for all applicable fees.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">6.3 Automatic Renewal</h3>
              <p className="text-gray-700 mb-4">
                Unless otherwise specified, subscriptions automatically renew at the end of each billing cycle. You can cancel 
                automatic renewal at any time through your account settings or by contacting customer support. Cancellation will 
                take effect at the end of the current billing cycle.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">6.4 Refunds</h3>
              <p className="text-gray-700 mb-4">
                All fees are non-refundable unless otherwise stated in a specific refund policy or required by applicable law. 
                Credits are non-refundable once purchased. For details on our refund policy, please contact customer support.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">6.5 Taxes</h3>
              <p className="text-gray-700 mb-4">
                You are responsible for all taxes associated with your use of the Services, other than taxes based on our net 
                income.
              </p>
            </section>

            {/* 7. DISCLAIMER OF WARRANTIES */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. DISCLAIMER OF WARRANTIES</h2>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                <p className="text-gray-800 font-medium">
                  OUR SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE," WITHOUT ANY WARRANTIES OF ANY KIND, EITHER EXPRESS OR 
                  IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, 
                  NON-INFRINGEMENT, OR COURSE OF PERFORMANCE. AI MUSIC STUDIO DOES NOT WARRANT THAT THE SERVICES WILL BE 
                  UNINTERRUPTED, SECURE, OR ERROR-FREE, THAT DEFECTS WILL BE CORRECTED, OR THAT THE SERVICES OR THE SERVERS 
                  THAT MAKE THEM AVAILABLE ARE FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS. WE MAKE NO WARRANTIES REGARDING THE 
                  ACCURACY, RELIABILITY, COMPLETENESS, OR TIMELINESS OF ANY CONTENT OR INFORMATION OBTAINED THROUGH THE SERVICES, 
                  INCLUDING AI-GENERATED MUSIC.
                </p>
              </div>
            </section>

            {/* 8. THIRD-PARTY LINKS AND SERVICES */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. THIRD-PARTY LINKS AND SERVICES</h2>
              <p className="text-gray-700 mb-4">
                Our Services may contain links to third-party websites or services that are not owned or controlled by AI Music 
                Studio. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of 
                any third-party websites or services. You acknowledge and agree that AI Music Studio shall not be responsible or 
                liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with the 
                use of or reliance on any such content, goods, or services available on or through any such websites or services.
              </p>
            </section>

            {/* 9. LIMITATION OF LIABILITY */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. LIMITATION OF LIABILITY</h2>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">9.1 General Limitation</h3>
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
                <p className="text-gray-800 font-medium">
                  TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL AI MUSIC STUDIO, ITS AFFILIATES, DIRECTORS, 
                  EMPLOYEES, AGENTS, LICENSORS, OR SUPPLIERS BE LIABLE FOR ANY INDIRECT, PUNITIVE, INCIDENTAL, SPECIAL, CONSEQUENTIAL, 
                  OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, 
                  ARISING OUT OF OR RELATING TO YOUR USE OF OUR SERVICES.
                </p>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">9.2 Cap on Liability</h3>
              <p className="text-gray-700 mb-4">
                OUR TOTAL LIABILITY TO YOU FOR ALL CLAIMS ARISING OUT OF OR RELATING TO THESE TERMS OR OUR SERVICES SHALL NOT 
                EXCEED THE AMOUNT YOU PAID TO US FOR THE SERVICES DURING THE TWELVE (12) MONTHS PRECEDING THE EVENT GIVING RISE 
                TO LIABILITY, OR ONE HUNDRED DOLLARS ($100), WHICHEVER IS GREATER.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">9.3 AI-Specific Limitations</h3>
              <p className="text-gray-700 mb-4">
                YOU ACKNOWLEDGE THAT AI TECHNOLOGY IS INHERENTLY PROBABILISTIC AND MAY PRODUCE UNEXPECTED OR INCORRECT RESULTS. 
                WE ARE NOT LIABLE FOR ANY DECISIONS MADE OR ACTIONS TAKEN BASED ON AI-GENERATED MUSIC OR RECOMMENDATIONS.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">9.4 Essential Purpose</h3>
              <p className="text-gray-700 mb-4">
                THE LIMITATIONS OF LIABILITY SET FORTH IN THIS SECTION ARE FUNDAMENTAL ELEMENTS OF THE BASIS OF THE BARGAIN 
                BETWEEN AI MUSIC STUDIO AND YOU. OUR SERVICES WOULD NOT BE PROVIDED WITHOUT SUCH LIMITATIONS.
              </p>
            </section>

            {/* 10. INDEMNIFICATION */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. INDEMNIFICATION</h2>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">10.1 User Indemnification</h3>
              <p className="text-gray-700 mb-4">
                You agree to indemnify, defend, and hold harmless AI Music Studio, its officers, directors, employees, agents, 
                licensors, and suppliers from and against all losses, expenses, damages, and costs, including reasonable attorneys' 
                fees, resulting from:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>Your use of our Services in violation of these Terms</li>
                <li>Your violation of any rights of another party</li>
                <li>Your violation of any applicable laws or regulations</li>
                <li>Any content you submit, post, or transmit through our Services</li>
                <li>Any claims that your use of our Services infringes upon the rights of any third party</li>
                <li>Any negligent or wrongful conduct by you or anyone using your account</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">10.2 Defense of Claims</h3>
              <p className="text-gray-700 mb-4">
                AI Music Studio reserves the right to assume the exclusive defense and control of any matter subject to 
                indemnification by you, and you agree to cooperate with our defense of such claims.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">10.3 Notice Requirement</h3>
              <p className="text-gray-700 mb-4">
                You must promptly notify us of any potential claims or legal proceedings that may be subject to indemnification 
                under this section.
              </p>
            </section>

            {/* 11. TERMINATION */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. TERMINATION</h2>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">11.1 Termination by You</h3>
              <p className="text-gray-700 mb-4">
                You may terminate your account and discontinue use of our Services at any time by following the account closure 
                procedures specified in our platform or by contacting our customer support team.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">11.2 Termination by AI Music Studio</h3>
              <p className="text-gray-700 mb-4">
                We may terminate or suspend your access to our Services immediately, without prior notice or liability, for any 
                reason, including but not limited to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>Breach of these Terms</li>
                <li>Violation of applicable laws or regulations</li>
                <li>Fraudulent, abusive, or illegal activity</li>
                <li>Non-payment of fees</li>
                <li>Extended periods of inactivity</li>
                <li>Circumstances that could harm our business, reputation, or other users</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">11.3 Effect of Termination</h3>
              <p className="text-gray-700 mb-4">
                Upon termination, your right to access and use our Services will immediately cease. We may delete your account 
                and all associated data, though we may retain certain information as required by law or for legitimate business 
                purposes.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">11.4 Survival</h3>
              <p className="text-gray-700 mb-4">
                Sections relating to intellectual property, limitation of liability, indemnification, governing law, and dispute 
                resolution shall survive termination of these Terms.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">11.5 Data Export</h3>
              <p className="text-gray-700 mb-4">
                Prior to account termination, you may request export of your data in a commonly used format, subject to technical 
                feasibility and applicable law.
              </p>
            </section>

            {/* 12. GOVERNING LAW AND DISPUTE RESOLUTION */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. GOVERNING LAW AND DISPUTE RESOLUTION</h2>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">12.1 Governing Law</h3>
              <p className="text-gray-700 mb-4">
                These Terms and any disputes arising out of or related to these Terms or our Services shall be governed by and 
                construed in accordance with the laws of the State of Delaware, United States, without regard to its conflict of 
                law principles.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">12.2 Jurisdiction</h3>
              <p className="text-gray-700 mb-4">
                Any legal action or proceeding arising under these Terms shall be brought exclusively in the federal or state 
                courts located in Delaware, and you hereby consent to personal jurisdiction and venue therein.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">12.3 Dispute Resolution Process</h3>
              <p className="text-gray-700 mb-4">
                Before initiating any legal proceedings, you agree to first attempt to resolve any dispute through good faith 
                negotiations by contacting our legal department at legal@mindforu.com.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">12.4 Arbitration Agreement</h3>
              <p className="text-gray-700 mb-4">
                For disputes that cannot be resolved through negotiation, you agree that any claim or dispute shall be resolved 
                through binding arbitration administered by the American Arbitration Association under its Commercial Arbitration 
                Rules, rather than in court, except as otherwise provided herein.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">12.5 Class Action Waiver</h3>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                <p className="text-gray-800 font-medium">
                  YOU AGREE THAT ANY ARBITRATION OR LEGAL PROCEEDING SHALL BE LIMITED TO THE DISPUTE BETWEEN YOU AND AI MUSIC 
                  STUDIO INDIVIDUALLY. YOU WAIVE ANY RIGHT TO PARTICIPATE IN A CLASS ACTION LAWSUIT OR CLASS-WIDE ARBITRATION.
                </p>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">12.6 Injunctive Relief</h3>
              <p className="text-gray-700 mb-4">
                Notwithstanding the arbitration provision, either party may seek injunctive relief in court to protect 
                intellectual property rights or confidential information.
              </p>
            </section>

            {/* 13. MODIFICATIONS TO TERMS */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">13. MODIFICATIONS TO TERMS</h2>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">13.1 Right to Modify</h3>
              <p className="text-gray-700 mb-4">
                We reserve the right to modify these Terms at any time to reflect changes in our Services, legal requirements, 
                or business practices. We will provide notice of material changes through email, platform notifications, or by 
                posting updated Terms on our website.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">13.2 Effective Date of Changes</h3>
              <p className="text-gray-700 mb-4">
                Modified Terms will become effective thirty (30) days after notice is provided, unless you object to the changes 
                by terminating your account before the effective date.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">13.3 Continued Use</h3>
              <p className="text-gray-700 mb-4">
                Your continued use of our Services after the effective date of modified Terms constitutes acceptance of the changes.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">13.4 Version Control</h3>
              <p className="text-gray-700 mb-4">
                We will maintain version control of our Terms and make previous versions available upon request for a reasonable 
                period.
              </p>
            </section>

            {/* 14. GENERAL PROVISIONS */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">14. GENERAL PROVISIONS</h2>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">14.1 Entire Agreement</h3>
              <p className="text-gray-700 mb-4">
                These Terms, together with our Privacy Policy and any applicable service agreements, constitute the entire 
                agreement between you and AI Music Studio regarding our Services and supersede all prior agreements and 
                understandings.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">14.2 Severability</h3>
              <p className="text-gray-700 mb-4">
                If any provision of these Terms is found to be unenforceable or invalid, the remaining provisions will remain in 
                full force and effect, and the unenforceable provision will be modified to the minimum extent necessary to make 
                it enforceable.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">14.3 Waiver</h3>
              <p className="text-gray-700 mb-4">
                Our failure to enforce any provision of these Terms shall not constitute a waiver of that provision or any other 
                provision.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">14.4 Assignment</h3>
              <p className="text-gray-700 mb-4">
                You may not assign or transfer these Terms or your rights hereunder without our prior written consent. We may 
                assign these Terms without restriction.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">14.5 Force Majeure</h3>
              <p className="text-gray-700 mb-4">
                Neither party shall be liable for any failure or delay in performance due to circumstances beyond their reasonable 
                control, including but not limited to acts of God, natural disasters, war, terrorism, or government actions.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">14.6 Independent Contractors</h3>
              <p className="text-gray-700 mb-4">
                The relationship between you and AI Music Studio is that of independent contractors, and these Terms do not create 
                any partnership, joint venture, or employment relationship.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">14.7 Export Compliance</h3>
              <p className="text-gray-700 mb-4">
                You agree to comply with all applicable export and import laws and regulations in your use of our Services.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">14.8 Language</h3>
              <p className="text-gray-700 mb-4">
                These Terms are written in English, and any translations are provided for convenience only. In case of conflict, 
                the English version shall prevail.
              </p>
            </section>

            {/* 15. CONTACT INFORMATION */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">15. CONTACT INFORMATION</h2>
              <p className="text-gray-700 mb-4">
                For questions, concerns, or notices regarding these Terms or our Services, please contact us at:
              </p>

              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">AI Music Studio Legal Department</h4>
                  <p className="text-gray-700">Email: legal@mindforu.com</p>
                  <p className="text-gray-700">Website: https://mindforu.com</p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Customer Support</h4>
                  <p className="text-gray-700">Email: support@mindforu.com</p>
                  <p className="text-gray-700">Website: https://mindforu.com/support</p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Data Protection Officer</h4>
                  <p className="text-gray-700">Email: privacy@mindforu.com</p>
                </div>
              </div>
            </section>

            {/* ACKNOWLEDGMENT */}
            <section className="mb-12">
              <div className="bg-blue-50 border-l-4 border-blue-600 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">ACKNOWLEDGMENT</h2>
                <p className="text-gray-800 font-medium">
                  BY USING OUR SERVICES, YOU ACKNOWLEDGE THAT YOU HAVE READ THESE TERMS, UNDERSTAND THEM, AND AGREE TO BE BOUND 
                  BY THEM. IF YOU DO NOT AGREE TO THESE TERMS, YOU MUST NOT USE OUR SERVICES.
                </p>
                <p className="text-gray-700 mt-4">
                  These Terms and Conditions are effective as of the "Last Updated" date specified above and will remain in effect 
                  until modified or terminated in accordance with the provisions herein.
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
