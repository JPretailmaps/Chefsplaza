import SeoMetaHead from '@components/common/seo-meta-head';
import dynamic from 'next/dynamic';

const ContactForm = dynamic(() => import('@components/contact/contact-form'));

function ContactPage() {
  return (
    <div className="main-container">
      <SeoMetaHead pageTitle="Contact Us" />
      <ContactForm />
    </div>
  );
}

ContactPage.authenticate = true;

ContactPage.noredirect = true;

export default ContactPage;
