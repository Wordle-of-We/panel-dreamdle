import './globals.css';
import { AuthProvider } from '../contexts/AuthContext';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'DreamWorks Painel',
  description: 'Acesso de administração',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
