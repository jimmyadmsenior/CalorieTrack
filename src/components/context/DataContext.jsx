import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
    const { user } = useAuth();
    const [meals, setMeals] = useState([]);
    const [foodEntries, setFoodEntries] = useState([]);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const today = new Date().toISOString().split('T')[0];

    const fetchProfile = useCallback(async (userId) => {
        if (!userId) return;
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();
            if (error && error.code !== 'PGRST116') throw error;
            setProfile(data);
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    }, []);

    const fetchMeals = useCallback(async (userId) => {
        if (!userId) return;
        try {
            const { data, error } = await supabase
                .from('meals')
                .select('*')
                .eq('user_id', userId);
            if (error) throw error;
            setMeals(data);
        } catch (error) {
            console.error('Error fetching meals:', error);
        }
    }, []);

    const fetchFoodEntries = useCallback(async (userId) => {
        if (!userId) return;
        try {
            const { data, error } = await supabase
                .from('food_entries')
                .select('*')
                .eq('user_id', userId)
                .eq('entry_date', today);
            if (error) throw error;
            setFoodEntries(data);
        } catch (error) {
            console.error('Error fetching food entries:', error);
        }
    }, [today]);

    const fetchData = useCallback(async (userId) => {
        if (userId) {
            setLoading(true);
            await Promise.all([fetchProfile(userId), fetchMeals(userId), fetchFoodEntries(userId)]);
            setLoading(false);
        }
    }, [fetchProfile, fetchMeals, fetchFoodEntries]);

    useEffect(() => {
        if (user) {
            fetchData(user.id);
        } else {
            setMeals([]);
            setFoodEntries([]);
            setProfile(null);
            setLoading(false);
        }
    }, [user, fetchData]);

    const addFoodToMeal = async (mealId, food) => {
        if (!user) return;
        try {
            const { data, error } = await supabase
                .from('food_entries')
                .insert([{
                    meal_id: mealId,
                    user_id: user.id,
                    name: food.name,
                    calories: food.calories,
                    entry_date: today
                }])
                .select();
            if (error) throw error;
            setFoodEntries(prev => [...prev, ...data]);
        } catch (error) {
            console.error('Error adding food entry:', error);
        }
    };
    
    const updateProfileContext = (newProfileData) => {
        setProfile(prevProfile => ({ ...prevProfile, ...newProfileData }));
    }

    const value = {
        meals,
        foodEntries,
        profile,
        loading,
        addFoodToMeal,
        fetchData,
        updateProfileContext,
    };

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
};