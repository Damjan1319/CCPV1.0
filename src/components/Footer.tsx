import { useTranslation } from 'react-i18next';

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-900 dark:bg-[#000000] text-gray-300 dark:text-[#ebebf5] mt-16 w-full overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-white font-semibold mb-4 font-apple tracking-[-0.01em]">
              {t('footer.about', { defaultValue: 'About' })}
            </h3>
            <p className="text-sm text-[#ebebf5]/80 mb-4 font-apple">
              {t('footer.description', {
                defaultValue: 'Compare prices from multiple stores and find the best deals. Save time and money with our price comparison platform.',
              })}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">
              {t('footer.quickLinks', { defaultValue: 'Quick Links' })}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-[#ebebf5]/60 hover:text-white transition-colors font-apple">
                  {t('footer.howItWorks', { defaultValue: 'How It Works' })}
                </a>
              </li>
              <li>
                <a href="#" className="text-[#ebebf5]/60 hover:text-white transition-colors font-apple">
                  {t('footer.categories', { defaultValue: 'Categories' })}
                </a>
              </li>
              <li>
                <a href="#" className="text-[#ebebf5]/60 hover:text-white transition-colors font-apple">
                  {t('footer.stores', { defaultValue: 'Stores' })}
                </a>
              </li>
              <li>
                <a href="#" className="text-[#ebebf5]/60 hover:text-white transition-colors font-apple">
                  {t('footer.deals', { defaultValue: 'Deals' })}
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">
              {t('footer.support', { defaultValue: 'Support' })}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-[#ebebf5]/60 hover:text-white transition-colors font-apple">
                  {t('footer.help', { defaultValue: 'Help Center' })}
                </a>
              </li>
              <li>
                <a href="#" className="text-[#ebebf5]/60 hover:text-white transition-colors font-apple">
                  {t('footer.contact', { defaultValue: 'Contact Us' })}
                </a>
              </li>
              <li>
                <a href="#" className="text-[#ebebf5]/60 hover:text-white transition-colors font-apple">
                  {t('footer.faq', { defaultValue: 'FAQ' })}
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">
              {t('footer.legal', { defaultValue: 'Legal' })}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-[#ebebf5]/60 hover:text-white transition-colors font-apple">
                  {t('footer.privacy', { defaultValue: 'Privacy Policy' })}
                </a>
              </li>
              <li>
                <a href="#" className="text-[#ebebf5]/60 hover:text-white transition-colors font-apple">
                  {t('footer.terms', { defaultValue: 'Terms of Service' })}
                </a>
              </li>
              <li>
                <a href="#" className="text-[#ebebf5]/60 hover:text-white transition-colors font-apple">
                  {t('footer.cookies', { defaultValue: 'Cookie Policy' })}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} {t('app.title')}. {t('footer.rights', { defaultValue: 'All rights reserved.' })}
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">
                {t('footer.facebook', { defaultValue: 'Facebook' })}
              </a>
              <a href="#" className="hover:text-white transition-colors">
                {t('footer.twitter', { defaultValue: 'Twitter' })}
              </a>
              <a href="#" className="hover:text-white transition-colors">
                {t('footer.instagram', { defaultValue: 'Instagram' })}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
