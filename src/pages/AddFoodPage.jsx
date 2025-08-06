import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search, PlusCircle, X } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { Helmet } from 'react-helmet';
import { useData } from '@/context/DataContext';
import { useLocation, useNavigate } from 'react-router-dom';

const commonFoods = [
  { name: 'Maçã', calories: 95 },
  { name: 'Banana', calories: 105 },
  { name: 'Peito de Frango (100g)', calories: 165 },
  { name: 'Arroz Branco (xícara)', calories: 205 },
  { name: 'Ovo cozido', calories: 78 },
  { name: 'Salada Verde', calories: 15 },
  { name: 'Pão Integral (fatia)', calories: 80 },
];

const AddFoodPage = () => {
    const [search, setSearch] = useState('');
    const [addedFoods, setAddedFoods] = useState([]);
    const { toast } = useToast();
    const { addFoodToMeal, meals } = useData();
    const location = useLocation();
    const navigate = useNavigate();

    const mealId = location.state?.mealId || meals[0]?.id;
    const mealName = meals.find(m => m.id === mealId)?.name || "Refeição";

    const filteredFoods = search ? commonFoods.filter(food => food.name.toLowerCase().includes(search.toLowerCase())) : [];

    const addFood = (food) => {
        setAddedFoods([...addedFoods, food]);
        setSearch('');
    };
    
    const removeFood = (index) => {
        setAddedFoods(addedFoods.filter((_, i) => i !== index));
    };
    
    const totalCalories = addedFoods.reduce((sum, food) => sum + food.calories, 0);

    const handleSaveMeal = async () => {
        if (!mealId) {
            toast({
                variant: "destructive",
                title: "Erro!",
                description: "Nenhuma refeição selecionada.",
            });
            return;
        }

        await Promise.all(addedFoods.map(food => addFoodToMeal(mealId, food)));
        
        toast({
            title: "Refeição Salva!",
            description: `Você adicionou ${totalCalories} calorias a ${mealName}.`,
        });
        setAddedFoods([]);
        navigate('/');
    };

    return (
        <div className="p-4 space-y-6">
             <Helmet>
                <title>Adicionar Alimento - CalorieTrack</title>
                <meta name="description" content="Adicione alimentos à sua refeição de forma rápida e fácil." />
            </Helmet>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-2xl font-bold text-center">Adicionar a {mealName}</h1>
                <p className="text-muted-foreground text-center">Busque um alimento para adicionar</p>
            </motion.div>
            
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input 
                    placeholder="Ex: Maçã, Frango grelhado..." 
                    className="pl-10"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="space-y-2 h-40 overflow-y-auto">
                {filteredFoods.map(food => (
                    <motion.div
                        key={food.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Card className="hover:bg-muted/50 transition-colors">
                            <CardContent className="p-3 flex justify-between items-center">
                                <div>
                                    <p className="font-semibold">{food.name}</p>
                                    <p className="text-sm text-muted-foreground">{food.calories} kcal</p>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => addFood(food)}>
                                    <PlusCircle className="w-5 h-5 text-green-500" />
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
                 {search && filteredFoods.length === 0 && (
                    <p className="text-center text-muted-foreground pt-4">Nenhum alimento encontrado.</p>
                )}
            </div>

            {addedFoods.length > 0 && (
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold">Sua Seleção</h2>
                    <Card>
                        <CardContent className="p-4 space-y-3">
                            {addedFoods.map((food, index) => (
                                <div key={index} className="flex justify-between items-center">
                                    <span>{food.name}</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-muted-foreground">{food.calories} kcal</span>
                                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => removeFood(index)}>
                                            <X className="w-4 h-4 text-destructive"/>
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            <div className="border-t pt-3 mt-3 flex justify-between font-bold">
                                <span>Total</span>
                                <span>{totalCalories} kcal</span>
                            </div>
                        </CardContent>
                    </Card>
                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white" onClick={handleSaveMeal}>
                        Adicionar {addedFoods.length} Itens
                    </Button>
                </div>
            )}
        </div>
    );
};

export default AddFoodPage;