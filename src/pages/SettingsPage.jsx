import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Bell, User, ChevronRight, LogOut } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';
import { useToast } from "@/components/ui/use-toast";
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useNavigate } from 'react-router-dom';

const SettingsPage = () => {
    const navigate = useNavigate();
    const { theme, setTheme } = useTheme();
    const { toast } = useToast();
    const { signOut } = useAuth();

    const handleNotImplemented = () => {
        toast({
            title: "🚧 Funcionalidade em construção!",
            description: "Não se preocupe! Você pode solicitar isso no seu próximo prompt! 🚀",
        });
    };

    return (
        <div className="p-4 space-y-6">
            <Helmet>
                <title>Ajustes - CalorieTrack</title>
                <meta name="description" content="Gerencie as configurações do seu aplicativo CalorieTrack." />
            </Helmet>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center"
            >
                <h1 className="text-2xl font-bold">Ajustes</h1>
                <p className="text-muted-foreground">Personalize sua experiência</p>
            </motion.div>

            <motion.div
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ duration: 0.5, delay: 0.2 }}
            >
                <Card>
                    <CardHeader>
                        <CardTitle>Aparência</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between items-center">
                            <span>Modo Escuro</span>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            >
                                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                                <span className="sr-only">Toggle theme</span>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
            
            <motion.div
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ duration: 0.5, delay: 0.3 }}
            >
                <Card>
                    <CardHeader>
                        <CardTitle>Conta</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <button className="w-full flex justify-between items-center p-2 rounded-md hover:bg-muted" onClick={() => navigate('/profile')}>
                            <div className="flex items-center space-x-3">
                                <User className="w-5 h-5 text-muted-foreground" />
                                <span>Perfil</span>
                            </div>
                            <ChevronRight className="w-5 h-5 text-muted-foreground" />
                        </button>
                        <button className="w-full flex justify-between items-center p-2 rounded-md hover:bg-muted" onClick={handleNotImplemented}>
                            <div className="flex items-center space-x-3">
                                <Bell className="w-5 h-5 text-muted-foreground" />
                                <span>Notificações</span>
                            </div>
                            <ChevronRight className="w-5 h-5 text-muted-foreground" />
                        </button>
                    </CardContent>
                </Card>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
            >
                <Button variant="destructive" className="w-full" onClick={signOut}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sair
                </Button>
            </motion.div>

        </div>
    );
};

export default SettingsPage;