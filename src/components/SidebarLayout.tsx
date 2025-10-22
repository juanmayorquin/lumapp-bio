"use client";

import Link from "next/link";
import { Flame } from 'lucide-react';
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Dumbbell,
  HeartPulse,
  User,
  ListChecks,
  ShieldAlert,
  Phone,
  X,
} from "lucide-react";

import React from "react";

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "./ui/tooltip";
import { useContext, useState } from "react";
import { AppContext } from "./AppStateProvider";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    href: "/",
    label: "Perfil",
    icon: User,
  },
  {
    href: "/exercises",
    label: "Ejercicios",
    icon: Dumbbell,
  },
  {
    href: "/education",
    label: "Educación",
    icon: BookOpen,
  },
  {
    href: "/precautions",
    label: "Precauciones",
    icon: ShieldAlert,
  },
  {
    href: "/recommendations",
    label: "Recomendaciones",
    icon: ListChecks,
  },
];

export function SidebarLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { emergencyContact, emergencyPhone, streak } = useContext(AppContext);
  const [showSosOptions, setShowSosOptions] = useState(false);

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-3 p-2">
            <div className="rounded-lg bg-accent/20 p-2">
              <HeartPulse className="h-6 w-6 text-accent" />
            </div>
            <h1 className="font-headline text-2xl font-bold text-foreground group-data-[collapsible=icon]:hidden">
              LumApp
            </h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
                    tooltip={item.label}
                  >
                    <Link
                      href={item.href}
                      className="flex h-full w-full items-center gap-2"
                    >
                      <Icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter />
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-20 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:h-auto md:border-none md:bg-transparent md:px-6 md:py-2">
          <SidebarTrigger className="md:hidden" />
          <h1 className="font-headline text-xl font-semibold text-foreground md:hidden">
            LumApp
          </h1>
          {/* Racha en el borde derecho de la navbar */}
          {streak !== undefined && (
            <div className="ml-auto flex items-center">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="inline-flex items-center gap-2 rounded-full bg-card px-3 py-1 text-card-foreground shadow-sm">
                    <Flame className="text-amber-500" />
                    <div className="text-sm leading-none">
                      <div className="font-semibold">{streak}</div>
                      <div className="text-xs text-muted-foreground">día{streak === 1 ? '' : 's'}</div>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>Racha actual: {streak} día{streak === 1 ? '' : 's'}. Entra cada día para mantenerla.</p>
                </TooltipContent>
              </Tooltip>
            </div>
          )}
        </header>
        <main className="flex-1">{children}</main>
        <div className="fixed bottom-6 right-6 z-50">
          <div className="relative flex items-center justify-center">
            <div
              className={cn(
                "absolute bottom-0 right-0 flex flex-col items-end gap-4 transition-all duration-300 ease-in-out",
                showSosOptions
                  ? "bottom-20 opacity-100"
                  : "bottom-0 opacity-0 pointer-events-none"
              )}
            >
              <div className="flex items-center gap-3">
                <div className="rounded-md bg-card px-3 py-1 text-card-foreground shadow-md">
                  <p className="text-sm font-semibold">
                    Llamar a {emergencyContact}
                  </p>
                </div>
                <Button
                  asChild
                  variant="outline"
                  className="h-14 w-14 rounded-full shadow-lg hover:bg-muted hover:text-foreground"
                  aria-label={`Llamar a ${emergencyContact}`}
                >
                  <a href={`tel:${emergencyPhone}`}>
                    <User className="h-8 w-8" />
                  </a>
                </Button>
              </div>

              <div className="flex items-center gap-3">
                <div className="rounded-md bg-card px-3 py-1 text-card-foreground shadow-md">
                  <p className="text-sm font-semibold">Llamar a Emergencias</p>
                </div>
                <Button
                  asChild
                  variant="outline"
                  className="h-14 w-14 rounded-full shadow-lg hover:bg-muted hover:text-foreground"
                  aria-label="Llamar a Emergencias"
                >
                  <a href="tel:911">
                    <Phone className="h-8 w-8" />
                  </a>
                </Button>
              </div>
            </div>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="destructive"
                    className="relative h-16 w-16 rounded-full shadow-2xl transition-all"
                    onClick={() => setShowSosOptions(!showSosOptions)}
                  >
                    <span
                      className={cn(
                        "absolute transition-all duration-300",
                        showSosOptions
                          ? "rotate-90 opacity-0"
                          : "rotate-0 opacity-100 text-xl font-bold"
                      )}
                    >
                      SOS
                    </span>
                    <span
                      className={cn(
                        "absolute transition-all duration-300",
                        showSosOptions
                          ? "rotate-0 opacity-100"
                          : "-rotate-90 opacity-0"
                      )}
                    >
                      <X className="h-8 w-8" />
                    </span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>{showSosOptions ? "Cancelar" : "Llamada de Emergencia"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
