import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useData } from '@/context/DataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Upload, Save, Target } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Helmet } from 'react-helmet';

const ProfilePage = () => {
    const { user } = useAuth();
    const { profile, loading: dataLoading, updateProfileContext } = useData();
    const { toast } = useToast();

    const [username, setUsername] = useState('');
    const [calorieGoal, setCalorieGoal] = useState(2500);
    const [avatarUrl, setAvatarUrl] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (profile) {
            setUsername(profile.username || '');
            setCalorieGoal(profile.calorie_goal || 2500);
            setAvatarUrl(profile.avatar_url || null);
        }
    }, [profile]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const updates = {
                id: user.id,
                username,
                calorie_goal: calorieGoal,
                updated_at: new Date(),
            };

            const { error } = await supabase.from('profiles').upsert(updates);
            if (error) throw error;
            
            updateProfileContext({ username, calorie_goal: calorieGoal });

            toast({
                title: 'Sucesso!',
                description: 'Seu perfil foi atualizado.',
            });
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Erro!',
                description: 'Não foi possível atualizar o perfil.',
            });
        } finally {
            setSaving(false);
        }
    };

    const uploadAvatar = async (event) => {
        try {
            setUploading(true);
            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('Você precisa selecionar uma imagem para fazer upload.');
            }

            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}-${Date.now()}.${fileExt}`;
            const filePath = `${fileName}`;

            let { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file, { upsert: false });

            if (uploadError) {
                throw uploadError;
            }

            const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
            const publicUrl = data.publicUrl;

            setAvatarUrl(publicUrl);
            
            const { error: dbError } = await supabase.from('profiles').upsert({
                id: user.id,
                avatar_url: publicUrl,
                updated_at: new Date()
            });

            if (dbError) throw dbError;
            
            updateProfileContext({ avatar_url: publicUrl });
            
            toast({
                title: 'Avatar atualizado!',
                description: 'Sua nova foto de perfil foi salva.',
            });

        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Erro no Upload!',
                description: error.message,
            });
        } finally {
            setUploading(false);
        }
    };

    if (dataLoading) {
        return <div className="flex justify-center items-center h-full">Carregando perfil...</div>;
    }

    return (
        <div className="p-4 space-y-6">
            <Helmet>
                <title>Meu Perfil - CalorieTrack</title>
                <meta name="description" content="Gerencie seu perfil, nome de usuário e meta de calorias." />
            </Helmet>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center"
            >
                <h1 className="text-2xl font-bold">Meu Perfil</h1>
                <p className="text-muted-foreground">Atualize suas informações</p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-col items-center space-y-4"
            >
                <div className="relative w-32 h-32">
                    <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                        {avatarUrl ? (
                            <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                            <User className="w-16 h-16 text-muted-foreground" />
                        )}
                    </div>
                    <Button asChild size="icon" className="absolute bottom-0 right-0 rounded-full">
                        <label htmlFor="avatar-upload" className="cursor-pointer">
                            <Upload className="w-5 h-5" />
                            <input
                                id="avatar-upload"
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={uploadAvatar}
                                disabled={uploading}
                            />
                        </label>
                    </Button>
                </div>
                {uploading && <p className="text-sm text-muted-foreground">Enviando...</p>}
            </motion.div>

            <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                onSubmit={handleUpdateProfile}
            >
                <Card>
                    <CardHeader>
                        <CardTitle>Informações da Conta</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" value={user?.email || ''} disabled />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="username">Nome de usuário</Label>
                            <Input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="calorieGoal">Meta de Calorias Diárias</Label>
                            <div className="relative">
                                <Target className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <Input
                                    id="calorieGoal"
                                    type="number"
                                    className="pl-10"
                                    value={calorieGoal}
                                    onChange={(e) => setCalorieGoal(parseInt(e.target.value, 10) || 0)}
                                />
                            </div>
                        </div>
                        <Button type="submit" className="w-full" disabled={saving || uploading}>
                            <Save className="w-4 h-4 mr-2" />
                            {saving ? 'Salvando...' : 'Salvar Alterações'}
                        </Button>
                    </CardContent>
                </Card>
            </motion.form>
        </div>
    );
};

export default ProfilePage;