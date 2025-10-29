
"use client";

import { useState, useContext, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, AlertTriangle, Save, HeartPulse } from 'lucide-react';
import { AppContext } from './AppStateProvider';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const setupSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  age: z.string().min(1, "La edad es obligatoria"),
  sex: z.string(),
  weight: z.string().min(1, "El peso es obligatorio"),
  height: z.string().min(1, "La altura es obligatoria"),
  painLevel: z.array(z.number()),
  emergencyContact: z.string().min(1, "El nombre del contacto es obligatorio"),
  emergencyPhone: z.string().length(10, "El número de teléfono debe tener 10 dígitos"),
});

type SetupFormValues = z.infer<typeof setupSchema>;

export function SetupScreen() {
  const {
    name, setName,
    age, setAge,
    sex, setSex,
    weight, setWeight,
    height, setHeight,
    painLevel, setPainLevel,
    emergencyContact, setEmergencyContact,
    emergencyPhone, setEmergencyPhone,
    completeSetup
  } = useContext(AppContext);

  const form = useForm<SetupFormValues>({
    resolver: zodResolver(setupSchema),
    defaultValues: {
      name,
      age,
      sex,
      weight,
      height,
      painLevel,
      emergencyContact,
      emergencyPhone,
    },
    mode: 'onChange',
  });

  const handleSave = (data: SetupFormValues) => {
    setName(data.name);
    setAge(data.age);
    setSex(data.sex);
    setWeight(data.weight);
    setHeight(data.height);
    setPainLevel(data.painLevel);
    setEmergencyContact(data.emergencyContact);
    setEmergencyPhone(data.emergencyPhone);
    completeSetup();
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(handleSave)} className="w-full max-w-4xl space-y-6">
                <div className="mb-8 text-center">
                    <div className="inline-flex items-center gap-3 rounded-lg bg-card p-4">
                        <HeartPulse className="h-8 w-8 text-accent" />
                        <h1 className="font-headline text-4xl font-bold text-foreground">
                            Bienvenido a LumbApp
                        </h1>
                    </div>
                    <p className="mt-2 text-muted-foreground">Configuremos tu perfil para comenzar.</p>
                </div>
                
                <div className="grid gap-6 md:grid-cols-2">
                    <Card className="shadow-sm">
                        <CardHeader className="flex flex-row items-center gap-3">
                            <User className="h-6 w-6 text-accent" />
                            <CardTitle className="font-headline text-xl">Datos Personales</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem className="col-span-2">
                                        <FormLabel>Nombre</FormLabel>
                                        <FormControl><Input {...field} placeholder="Tu Nombre" /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="age"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Edad</FormLabel>
                                        <FormControl><Input type="number" {...field} placeholder="ej. 35" /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="sex"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Sexo</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl><SelectTrigger><SelectValue placeholder="Seleccionar sexo" /></SelectTrigger></FormControl>
                                            <SelectContent>
                                                <SelectItem value="masculino">Masculino</SelectItem>
                                                <SelectItem value="femenino">Femenino</SelectItem>
                                                <SelectItem value="otro">Otro</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="weight"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Peso (kg)</FormLabel>
                                        <FormControl><Input type="number" {...field} placeholder="ej. 80" /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="height"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Altura (cm)</FormLabel>
                                        <FormControl><Input type="number" {...field} placeholder="ej. 180" /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="painLevel"
                                render={({ field }) => (
                                    <FormItem className="col-span-2">
                                        <FormLabel>Nivel de Dolor Actual: {field.value[0]}</FormLabel>
                                        <FormControl><Slider min={0} max={10} step={1} value={field.value} onValueChange={field.onChange} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    <Card className="flex flex-col shadow-sm">
                        <CardHeader className="flex flex-row items-center gap-3">
                            <AlertTriangle className="h-6 w-6 text-destructive" />
                            <CardTitle className="font-headline text-xl">Contacto de Emergencia</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-grow flex-col space-y-4">
                            <FormField
                                control={form.control}
                                name="emergencyContact"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nombre</FormLabel>
                                        <FormControl><Input {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="emergencyPhone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Número de Teléfono</FormLabel>
                                        <FormControl><Input type="tel" {...field} placeholder="Número de 10 dígitos"/></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>
                </div>
                <div className="flex justify-end">
                    <Button type="submit" size="lg" disabled={!form.formState.isValid}>
                        <Save className="mr-2 h-5 w-5" />
                        Guardar y Continuar
                    </Button>
                </div>
            </form>
        </FormProvider>
    </div>
  );
}
