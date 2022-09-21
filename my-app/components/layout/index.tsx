import type { NextPage } from 'next';
import type { ReactNode } from 'react';
import Navbar from 'components/Navbar';
import Footer from 'components/Footer';

type ILayoutProps = {
  children: ReactNode,
};

const Layout: NextPage<ILayoutProps> = ({ children }) => {
  return (
    <div>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
