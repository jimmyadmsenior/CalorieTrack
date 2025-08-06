import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Flame } from 'lucide-react';
import { Helmet } from 'react-helmet';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (isLogin) {
      await signIn(email, password);
    } else {
      await signUp(email, password, { data: { username } });
    }
    setLoading(false);
  };

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
    exit: { opacity: 0, y: -20 }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-4 bg-background">
      <Helmet>
        <title>{isLogin ? 'Login' : 'Cadastro'} - CalorieTrack</title>
      </Helmet>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 15, stiffness: 100 }}
        className="text-center mb-8"
      >
        <Flame className="w-16 h-16 text-primary mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-foreground">Bem-vindo ao CalorieTrack</h1>
        <p className="text-muted-foreground">
          {isLogin ? 'Faça login para continuar' : 'Crie uma conta para começar'}
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.form
          key={isLogin ? 'login' : 'signup'}
          variants={formVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onSubmit={handleSubmit}
          className="w-full max-w-sm space-y-4"
        >
          {!isLogin && (
            <motion.div variants={itemVariants} className="space-y-2">
              <Label htmlFor="username">Nome de usuário</Label>
              <Input
                id="username"
                type="text"
                placeholder="Seu nome de usuário"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </motion.div>
          )}
          <motion.div variants={itemVariants} className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </motion.div>
          <motion.div variants={itemVariants} className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Carregando...' : isLogin ? 'Entrar' : 'Criar Conta'}
            </Button>
          </motion.div>
        </motion.form>
      </AnimatePresence>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}
        <Button variant="link" onClick={() => setIsLogin(!isLogin)} className="text-primary">
          {isLogin ? 'Cadastre-se' : 'Faça login'}
        </Button>
      </p>
    </div>
  );
};

export default AuthPage;