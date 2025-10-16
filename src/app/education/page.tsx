import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import education from '@/lib/data/education.json';
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

type EducationItem = {
    id: string;
    title?: string;
    content?: string;
}

const EducationCard = ({ item }: { item: EducationItem }) => (
  <Card className="bg-card border shadow-lg backdrop-blur-sm">
    <CardHeader>
      <CardTitle className="text-primary font-semibold">{item.title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-foreground/80">{item.content}</p>
    </CardContent>
  </Card>
);

export default function EducationPage() {
  const spineBg = PlaceHolderImages.find(p => p.id === "spine-background");

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {spineBg && (
        <Image
          src={spineBg.imageUrl}
          alt={spineBg.description}
          data-ai-hint={spineBg.imageHint}
          fill
          className="absolute inset-0 object-cover object-center opacity-10"
        />
      )}
      <div className="relative z-10 p-4 md:p-6 lg:p-8">
        <h1 className="mb-4 text-center font-headline text-4xl font-bold text-foreground">Educación</h1>
        <div className="mx-auto mb-8 max-w-md rounded-2xl bg-foreground p-4 text-center text-background shadow-2xl">
          <h2 className="font-headline text-2xl font-semibold">Aprende sobre tu columna lumbar</h2>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:max-w-4xl mx-auto">
          {education.map((item) => <EducationCard key={item.id} item={item} />)}
        </div>
      </div>
    </div>
  );
}
