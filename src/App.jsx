import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import BottomNav from '@/components/BottomNav';
import HomePage from '@/pages/HomePage.jsx';
import AddFoodPage from '@/pages/AddFoodPage.jsx';
import HistoryPage from '@/pages/HistoryPage.jsx';
import AchievementsPage from '@/pages/AchievementsPage.jsx';
import SettingsPage from '@/pages/SettingsPage.jsx';
import ProfilePage from '@/pages/ProfilePage.jsx';
import AuthPage from '@/pages/AuthPage.jsx';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Helmet } from 'react-helmet';
import { DataProvider } from '@/context/DataContext';
import SplashScreen from '@/components/SplashScreen';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const pageVariants = {
  initial: { opacity: 0, scale: 0.98 },
  in: { opacity: 1, scale: 1 },
  out: { opacity: 0, scale: 1.02 }
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.4
};

const PageWrapper = ({ children }) => (
  <motion.div
    initial="initial"
    animate="in"
    exit="out"
    variants={pageVariants}
    transition={pageTransition}
  >
    {children}
  </motion.div>
);

const ProtectedRoute = ({ children }) => {
  const { session, loading } = useAuth();
  if (loading) return null;
  if (!session) {
    return <Navigate to="/auth" replace />;
  }
  return children;
};

const AuthRoute = ({ children }) => {
    const { session, loading } = useAuth();
    if (loading) return null;
    if (session) {
        return <Navigate to="/" replace />;
    }
    return children;
}

function AppContent() {
  const { session, loading: authLoading } = useAuth();
  const [appLoading, setAppLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => setAppLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  const isLoading = authLoading || appLoading;

  return (
    <div className="flex justify-center items-center min-h-screen bg-background text-foreground">
      <AnimatePresence>
        {isLoading && <SplashScreen key="splash" />}
      </AnimatePresence>
      
      {!isLoading && (
        <motion.div
          key="app"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md h-screen md:h-[90vh] md:max-h-[800px] md:rounded-2xl shadow-2xl overflow-hidden flex flex-col bg-card relative"
        >
          <main className="flex-grow overflow-y-auto pb-20">
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                <Route path="/auth" element={<AuthRoute><PageWrapper><AuthPage /></PageWrapper></AuthRoute>} />
                <Route path="/" element={<ProtectedRoute><PageWrapper><HomePage /></PageWrapper></ProtectedRoute>} />
                <Route path="/add-food" element={<ProtectedRoute><PageWrapper><AddFoodPage /></PageWrapper></ProtectedRoute>} />
                <Route path="/history" element={<ProtectedRoute><PageWrapper><HistoryPage /></PageWrapper></ProtectedRoute>} />
                <Route path="/achievements" element={<ProtectedRoute><PageWrapper><AchievementsPage /></PageWrapper></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><PageWrapper><SettingsPage /></PageWrapper></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><PageWrapper><ProfilePage /></PageWrapper></ProtectedRoute>} />
              </Routes>
            </AnimatePresence>
          </main>
          {session && <BottomNav />}
        </motion.div>
      )}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Router>
          <AuthProvider>
            <DataProvider>
              <Helmet>
                <title>CalorieTrack - Seu Rastreador de Calorias</title>
                <meta name="description" content="Acompanhe sua ingestão de calorias e atinja seus objetivos de saúde com o CalorieTrack. Um aplicativo moderno, intuitivo e gamificado." />
              </Helmet>
              <AppContent />
              <Toaster />
            </DataProvider>
          </AuthProvider>
        </Router>
    </ThemeProvider>
  );
}

export default App;