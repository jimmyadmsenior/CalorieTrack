import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Flame, Plus, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { Helmet } from 'react-helmet';
import { useData } from '@/context/DataContext';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const ForkKnife = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-utensils-crossed"><path d="m16 2-2.3 2.3a3 3 0 0 0 0 4.2l1.8 1.8a3 3 0 0 0 4.2 0L22 8Z"/><path d="M15 15 3.3 3.3a4.2 4.2 0 0 0 0 6l7.3 7.3c.7.7 2 .7 2.8 0L15 15Zm0 0 7 7"/><path d="m2.1 21.8 6.4-6.3a4.2 4.2 0 0 0 6 0l2.3-2.3"/></svg>
)

const HomePage = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const { meals, foodEntries, profile, loading } = useData();
    const { user } = useAuth();

    const getMealCalories = (mealId) => {
        return foodEntries
            .filter(entry => entry.meal_id === mealId)
            .reduce((acc, food) => acc + food.calories, 0);
    };

    const totalCaloriesConsumed = foodEntries.reduce((acc, food) => acc + food.calories, 0);
    const calorieGoal = profile?.calorie_goal || 2500;
    const progressValue = calorieGoal > 0 ? (totalCaloriesConsumed / calorieGoal) * 100 : 0;

    const handleAddMeal = () => {
        toast({
            title: "🚧 Funcionalidade em construção!",
            description: "Não se preocupe! Você pode solicitar isso no seu próximo prompt! 🚀",
        });
    };

    if (loading) {
        return <div className="flex justify-center items-center h-full">Carregando...</div>;
    }

    return (
        <div className="p-4 space-y-6">
            <Helmet>
                <title>Início - CalorieTrack</title>
                <meta name="description" content="Resumo do seu progresso diário de contagem de calorias." />
            </Helmet>
            <motion.div 
                className="flex justify-between items-center"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Hoje</h1>
                    <p className="text-muted-foreground">Olá, {profile?.username || user?.email}</p>
                </div>
                 <button onClick={() => navigate('/profile')} className="w-12 h-12 rounded-full bg-muted flex items-center justify-center overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background">
                    {profile?.avatar_url ? (
                        <img  className="w-full h-full object-cover" alt="User profile picture" src={profile.avatar_url} />
                    ) : (
                        <User className="w-6 h-6 text-muted-foreground" />
                    )}
                </button>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Calorias Consumidas</CardTitle>
                        <Flame className="w-4 h-4 text-primary-foreground/70" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold">{totalCaloriesConsumed} <span className="text-xl font-normal">/ {calorieGoal} kcal</span></div>
                        <Progress value={progressValue} className="w-full mt-4 h-2 [&>div]:bg-primary-foreground" />
                    </CardContent>
                </Card>
            </motion.div>

            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Refeições</h2>
                    <Button variant="ghost" size="sm" onClick={handleAddMeal}>
                        <Plus className="w-4 h-4 mr-2"/>
                        Nova Refeição
                    </Button>
                </div>
                {meals.map((meal, index) => (
                    <motion.div
                        key={meal.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                    >
                        <Card className="hover:bg-muted/50 transition-colors">
                            <CardContent className="p-4 flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="text-2xl">{meal.icon}</div>
                                    <div>
                                        <p className="font-semibold">{meal.name}</p>
                                        <p className="text-sm text-muted-foreground">{getMealCalories(meal.id)} kcal</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => navigate('/add-food', { state: { mealId: meal.id } })}>
                                    <ForkKnife />
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default HomePage;