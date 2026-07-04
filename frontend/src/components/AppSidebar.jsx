import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  X,
  Car,
  LayoutDashboard,
  ShoppingBag,
  Plus,
  List,
  Settings,
  LogOut,
  Shield,
  Users,
  Package,
} from "lucide-react";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "framer-motion";

const AppSidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
  };

  const NavItem = ({ to, icon: Icon, label, exact = false }) => {
    const isActive = exact
      ? location.pathname === to
      : location.pathname.startsWith(to);

    return (
      <Link to={to} onClick={onClose} className="w-full">
        <div
          className={cn(
            "flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] font-medium transition-all duration-200",
            isActive
              ? "bg-primary/10 text-primary hover:bg-primary/15"
              : "text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-foreground",
          )}
        >
          <Icon
            size={16}
            className={isActive ? "text-primary" : "text-muted-foreground"}
          />
          {label}
        </div>
      </Link>
    );
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-card border-r w-56">
      {/* Header */}
      <div className="p-5 flex items-center gap-2.5 border-b h-14">
        <div className="size-7 bg-primary rounded-md flex items-center justify-center text-primary-foreground shadow-sm shadow-primary/25">
          <Car size={16} />
        </div>
        <span className="font-bold text-base tracking-tight">AutoPremium</span>
        <button className="md:hidden ml-auto" onClick={onClose}>
          <X size={20} className="text-muted-foreground" />
        </button>
      </div>

      {/* Nav Links */}
      <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
        {/* Buyer / Public Links */}
        <div className="px-3 pb-2 text-xs font-semibold text-muted-foreground/50 uppercase tracking-wider">
          Marketplace
        </div>
        <NavItem to="/" label="Browse Cars" icon={ShoppingBag} exact={true} />

        {user?.role === "Buyer" && (
          <NavItem to="/my-purchases" label="My Purchases" icon={Package} />
        )}

        {/* Seller Links */}
        {user?.role === "Seller" && (
          <>
            <div className="mt-6 px-3 pb-2 text-xs font-semibold text-muted-foreground/50 uppercase tracking-wider">
              Seller Zone
            </div>
            {/* Note: In original app, Home renders SellerDashboard for sellers. 
                If we want a distinct dashboard link, we can point to / or a specific route if it existed.
                For now, preserving original flow where / is dashboard for seller. 
            */}
            {/* <NavItem to="/" label="Dashboard" icon={LayoutDashboard} exact={true} /> */}
            <NavItem to="/my-listings" label="My Listings" icon={List} />
            <NavItem to="/sell" label="Add New Car" icon={Plus} />
          </>
        )}

        {/* Admin Links */}
        {user?.role === "Admin" && (
          <>
            <div className="mt-6 px-3 pb-2 text-xs font-semibold text-muted-foreground/50 uppercase tracking-wider">
              Administration
            </div>
            <NavItem
              to="/admin"
              label="Dashboard"
              icon={LayoutDashboard}
              exact={true}
            />
            <NavItem to="/admin/users" label="Manage Users" icon={Users} />
            <NavItem to="/admin/cars" label="Manage Cars" icon={Car} />
            <NavItem to="/admin/settings" label="System Settings" icon={Settings} />
          </>
        )}
      </div>

      {/* User Footer */}
      <div className="p-4 border-t bg-muted/30">
        {user ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                {user.userName?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-semibold truncate">
                  {user.userName}
                </p>
                <p className="text-xs text-muted-foreground capitalize">
                  {user.role}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start gap-2"
              onClick={handleLogout}
            >
              <LogOut size={14} />
              Log out
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <Link to="/login">
              <Button className="w-full" size="sm">
                Log In
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="ghost" className="w-full" size="sm">
                Create Account
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex h-screen sticky top-0 bg-background z-30">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 w-56 bg-background z-50 md:hidden shadow-2xl"
            >
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default AppSidebar;
