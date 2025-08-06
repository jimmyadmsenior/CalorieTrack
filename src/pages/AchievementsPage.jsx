import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Award, Flame, Star } from 'lucide-react';
import { Helmet } from 'react-helmet';

const achievements = [
  { 
    title: 'Maratona de 7 Dias', 
    description: 'Registre suas calorias por 7 dias seguidos.', 
    progress: 4, 
    goal: 7, 
    icon: Flame,
    color: 'text-orange-500',
    progressColor: 'bg-orange-500'
  },
  { 
    title: 'Primeira Meta Atingida', 
    description: 'Alcance sua meta diária de calorias pela primeira vez.', 
    progress: 1, 
    goal: 1, 
    icon: Star,
    color: 'text-yellow-500',
    progressColor: 'bg-yellow-500'
  },
  { 
    title: 'Guerreiro do Fim de Semana', 
    description: 'Registre suas refeições durante um fim de semana.', 
    progress: 1, 
    goal: 2, 
    icon: Award,
    color: 'text-blue-500',
    progressColor: 'bg-blue-500'
  },
    { 
    title: 'Mestre Culinário', 
    description: 'Adicione 50 alimentos diferentes.', 
    progress: 15, 
    goal: 50, 
    icon: Award,
    color: 'text-green-500',
    progressColor: 'bg-green-500'
  },
];

const AchievementsPage = () => {
  return (
    <div className="p-4 space-y-6">
        <Helmet>
            <title>Conquistas - CalorieTrack</title>
            <meta name="description" content="Acompanhe suas conquistas e recompensas no CalorieTrack." />
        </Helmet>
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
        >
            <h1 className="text-2xl font-bold">Conquistas</h1>
            <p className="text-muted-foreground">Continue assim para desbloquear todas!</p>
        </motion.div>
      
        <div className="space-y-4">
            {achievements.map((ach, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                >
                    <Card className={`overflow-hidden ${ach.progress === ach.goal ? 'bg-green-500/10 border-green-500' : ''}`}>
                        <CardContent className="p-4 flex items-center space-x-4">
                            <ach.icon className={`w-10 h-10 flex-shrink-0 ${ach.color}`} />
                            <div className="flex-grow">
                                <h3 className="font-semibold">{ach.title}</h3>
                                <p className="text-sm text-muted-foreground">{ach.description}</p>
                                <div className="flex items-center space-x-2 mt-2">
                                    <Progress value={(ach.progress / ach.goal) * 100} className="w-full h-2" indicatorClassName={ach.progressColor} />
                                    <span className="text-xs font-mono text-muted-foreground">{ach.progress}/{ach.goal}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </div>
    </div>
  );
};

export default AchievementsPage;