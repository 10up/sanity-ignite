import '../globals.css';

import Footer from '@/components/Layout/Footer';
import Header from '@/components/Layout/Header';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="min-h-screen pt-24">
      <Header />
      {children}
      <Footer />
    </section>
  );
}
