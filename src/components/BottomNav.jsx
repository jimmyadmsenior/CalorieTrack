import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, PlusCircle, BarChart3, Trophy, Settings } from 'lucide-react';

const navItems = [
  { to: '/', icon: Home, label: 'Início' },
  { to: '/history', icon: BarChart3, label: 'Histórico' },
  { to: '/add-food', icon: PlusCircle, label: 'Adicionar', isCentral: true },
  { to: '/achievements', icon: Trophy, label: 'Conquistas' },
  { to: '/settings', icon: Settings, label: 'Ajustes' },
];

const NavItem = ({ to, icon: Icon, label, isCentral }) => {
  if (isCentral) {
    return (
      <NavLink to={to} className="flex-shrink-0">
        <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center -mt-8 border-4 border-card shadow-lg hover:bg-primary/90 transition-transform transform hover:scale-105">
          <Icon className="w-8 h-8" />
        </div>
      </NavLink>
    );
  }

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex flex-col items-center justify-center space-y-1 transition-colors duration-200 ${
          isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
        }`
      }
    >
      <Icon className="w-6 h-6" />
      <span className="text-xs font-medium">{label}</span>
    </NavLink>
  );
};

const BottomNav = () => {
  return (
    <nav className="absolute bottom-0 left-0 right-0 h-20 bg-card/80 backdrop-blur-lg border-t border-border">
      <div className="flex justify-around items-center h-full max-w-md mx-auto">
        {navItems.map((item) => (
          <NavItem key={item.to} {...item} />
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;