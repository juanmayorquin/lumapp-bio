
"use client";

import { useState, useContext, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Edit, Save, AlertTriangle } from 'lucide-react';
import { AppContext } from './AppStateProvider';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const personalDataSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  age: z.string().min(1, "La edad es obligatoria"),
  sex: z.string(),
  weight: z.string().min(1, "El peso es obligatorio"),
  height: z.string().min(1, "La altura es obligatoria"),
  painLevel: z.array(z.number()),
});

const emergencyContactSchema = z.object({
  emergencyContact: z.string().min(1, "El nombre del contacto es obligatorio"),
  emergencyPhone: z.string().length(10, "El número de teléfono debe tener 10 dígitos"),
});

type PersonalDataValues = z.infer<typeof personalDataSchema>;
type EmergencyContactValues = z.infer<typeof emergencyContactSchema>;

export function UserData() {
  const {
    name, setName,
    age, setAge,
    sex, setSex,
    weight, setWeight,
    height, setHeight,
    painLevel, setPainLevel,
    emergencyContact, setEmergencyContact,
    emergencyPhone, setEmergencyPhone
  } = useContext(AppContext);
  // obtener racha si existe
  // @ts-ignore
  const streak = (useContext(AppContext) as any).streak as number | undefined;
  // clearUser puede no existir en versiones anteriores del contexto
  // @ts-ignore
  const clearUser = (useContext(AppContext) as any).clearUser as (() => void) | undefined;

  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [isEditingEmergency, setIsEditingEmergency] = useState(false);

  const personalForm = useForm<PersonalDataValues>({
    resolver: zodResolver(personalDataSchema),
    defaultValues: { name, age, sex, weight, height, painLevel },
    mode: 'onChange',
  });

  const emergencyForm = useForm<EmergencyContactValues>({
    resolver: zodResolver(emergencyContactSchema),
    defaultValues: { emergencyContact, emergencyPhone },
    mode: 'onChange',
  });

  useEffect(() => {
    personalForm.reset({ name, age, sex, weight, height, painLevel });
  }, [name, age, sex, weight, height, painLevel, personalForm]);

  useEffect(() => {
    emergencyForm.reset({ emergencyContact, emergencyPhone });
  }, [emergencyContact, emergencyPhone, emergencyForm]);

  const handlePersonalSave = (data: PersonalDataValues) => {
    setName(data.name);
    setAge(data.age);
    setSex(data.sex);
    setWeight(data.weight);
    setHeight(data.height);
    setPainLevel(data.painLevel);
    setIsEditingPersonal(false);
  };

  const handleEmergencySave = (data: EmergencyContactValues) => {
    setEmergencyContact(data.emergencyContact);
    setEmergencyPhone(data.emergencyPhone);
    setIsEditingEmergency(false);
  };

  const viewModePersonal = (
    <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm md:grid-cols-3">
      <div><p className="text-muted-foreground">Nombre</p><p className="font-semibold">{name}</p></div>
      <div><p className="text-muted-foreground">Edad</p><p className="font-semibold">{age}</p></div>
      <div><p className="text-muted-foreground">Sexo</p><p className="font-semibold capitalize">{sex === 'masculino' ? 'Masculino' : sex === 'femenino' ? 'Femenino' : 'Otro'}</p></div>
      <div><p className="text-muted-foreground">Peso</p><p className="font-semibold">{weight} kg</p></div>
      <div><p className="text-muted-foreground">Altura</p><p className="font-semibold">{height} cm</p></div>
      <div><p className="text-muted-foreground">Nivel de Dolor</p><p className="font-semibold">{painLevel[0]} / 10</p></div>
    </div>
  );
  
  const editModePersonal = (
    <Form {...personalForm}>
      <form onSubmit={personalForm.handleSubmit(handlePersonalSave)} className="grid grid-cols-2 gap-4 md:grid-cols-3">
        <FormField
          control={personalForm.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Tu Nombre" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={personalForm.control}
          name="age"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Edad</FormLabel>
              <FormControl>
                <Input type="number" {...field} placeholder="ej. 35" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={personalForm.control}
          name="sex"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sexo</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger><SelectValue placeholder="Seleccionar sexo" /></SelectTrigger>
                </FormControl>
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
          control={personalForm.control}
          name="weight"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Peso (kg)</FormLabel>
              <FormControl>
                <Input type="number" {...field} placeholder="ej. 80" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={personalForm.control}
          name="height"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Altura (cm)</FormLabel>
              <FormControl>
                <Input type="number" {...field} placeholder="ej. 180" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={personalForm.control}
          name="painLevel"
          render={({ field }) => (
            <FormItem className="col-span-2 md:col-span-1">
              <FormLabel>Nivel de Dolor: {field.value[0]}</FormLabel>
              <FormControl>
                <Slider min={0} max={10} step={1} value={field.value} onValueChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );

  const viewModeEmergency = (
    <div className="grid gap-4">
        <div>
            <p className="text-sm text-muted-foreground">Contacto</p>
            <p className="font-semibold">{emergencyContact}</p>
        </div>
        <div>
            <p className="text-sm text-muted-foreground">Teléfono</p>
            <p className="font-semibold">{emergencyPhone}</p>
        </div>
    </div>
  );

  const editModeEmergency = (
    <Form {...emergencyForm}>
      <form onSubmit={emergencyForm.handleSubmit(handleEmergencySave)} className="space-y-4">
        <FormField
          control={emergencyForm.control}
          name="emergencyContact"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={emergencyForm.control}
          name="emergencyPhone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número de Teléfono</FormLabel>
              <FormControl>
                <Input type="tel" {...field} placeholder="Número de 10 dígitos"/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="shadow-sm transition-shadow hover:shadow-md lg:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <User className="h-6 w-6 text-accent" />
            <div>
              <CardTitle className="font-headline text-xl">Datos Personales</CardTitle>
              {typeof streak !== 'undefined' && (
                <p className="text-sm text-muted-foreground">Racha: <span className="font-semibold">{streak} día{streak === 1 ? '' : 's'}</span></p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={isEditingPersonal ? personalForm.handleSubmit(handlePersonalSave) : () => setIsEditingPersonal(true)}
              disabled={isEditingPersonal && !personalForm.formState.isValid}
            >
              {isEditingPersonal ? <Save className="h-5 w-5 text-accent" /> : <Edit className="h-5 w-5" />}
              <span className="sr-only">{isEditingPersonal ? "Guardar" : "Editar"}</span>
            </Button>
            {clearUser && (
              <Button variant="ghost" size="sm" onClick={() => { if (confirm('¿Borrar todos los datos de usuario?')) clearUser(); }}>
                Borrar datos
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isEditingPersonal ? editModePersonal : viewModePersonal}
        </CardContent>
      </Card>
      
      <Card className="flex flex-col shadow-sm transition-shadow hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 text-destructive" />
            <CardTitle className="font-headline text-xl">Contacto de Emergencia</CardTitle>
          </div>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={isEditingEmergency ? emergencyForm.handleSubmit(handleEmergencySave) : () => setIsEditingEmergency(true)}
            disabled={isEditingEmergency && !emergencyForm.formState.isValid}
          >
            {isEditingEmergency ? <Save className="h-5 w-5 text-accent" /> : <Edit className="h-5 w-5" />}
            <span className="sr-only">{isEditingEmergency ? "Guardar" : "Editar"}</span>
          </Button>
        </CardHeader>
        <CardContent className="flex flex-grow flex-col gap-4">
          {isEditingEmergency ? editModeEmergency : viewModeEmergency}
        </CardContent>
      </Card>
    </div>
  );
}
