import { ThemeProvider } from '@/src/utils/theme-provider';
import '@/src/index.css';

export const metadata = {
  title: 'RazorBills',
  description: 'Electronic components marketplace',
  icons: {
    icon: '/vite.svg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Bakbak+One&family=Outfit:wght@100..900&display=swap" rel="stylesheet" />
      </head>
      <body>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
