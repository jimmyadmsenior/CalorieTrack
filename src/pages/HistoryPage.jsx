import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Helmet } from 'react-helmet';

const weeklyData = [
  { day: 'Seg', calories: 2200 },
  { day: 'Ter', calories: 2100 },
  { day: 'Qua', calories: 2500 },
  { day: 'Qui', calories: 2300 },
  { day: 'Sex', calories: 2600 },
  { day: 'Sáb', calories: 2800 },
  { day: 'Dom', calories: 2400 },
];

const pastDays = [
    { date: "Ontem", calories: 2300, goal: 2500 },
    { date: "Sexta-feira", calories: 2600, goal: 2500 },
    { date: "Quinta-feira", calories: 2300, goal: 2500 },
    { date: "Quarta-feira", calories: 2500, goal: 2500 },
]

const HistoryPage = () => {
    return (
        <div className="p-4 space-y-6">
            <Helmet>
                <title>Histórico - CalorieTrack</title>
                <meta name="description" content="Veja seu histórico de consumo de calorias e comparações semanais." />
            </Helmet>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center"
            >
                <h1 className="text-2xl font-bold">Histórico</h1>
                <p className="text-muted-foreground">Seu progresso ao longo do tempo</p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <Button variant="ghost" size="icon"><ChevronLeft /></Button>
                            <CardTitle>Resumo Semanal</CardTitle>
                            <Button variant="ghost" size="icon"><ChevronRight /></Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={weeklyData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                <XAxis dataKey="day" stroke="hsl(var(--foreground))" fontSize={12} />
                                <YAxis stroke="hsl(var(--foreground))" fontSize={12} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "hsl(var(--background))",
                                        borderColor: "hsl(var(--border))",
                                        color: "hsl(var(--foreground))"
                                    }}
                                />
                                <Bar dataKey="calories" fill="hsl(var(--primary))" name="Calorias" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </motion.div>
            
            <div className="space-y-4">
                <h2 className="text-xl font-semibold">Dias Anteriores</h2>
                 {pastDays.map((day, index) => (
                     <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                     >
                        <Card className="hover:bg-muted/50 transition-colors">
                            <CardContent className="p-4 flex justify-between items-center">
                                <p className="font-semibold">{day.date}</p>
                                <p className={day.calories > day.goal ? "text-red-500" : "text-green-500"}>
                                    {day.calories} / {day.goal} kcal
                                </p>
                            </CardContent>
                        </Card>
                     </motion.div>
                 ))}
            </div>
        </div>
    );
};

export default HistoryPage;