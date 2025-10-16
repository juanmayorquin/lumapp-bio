import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import exercises from '@/lib/data/exercises.json';

type Exercise = {
    id: string;
    title?: string;
    description?: string;
    videoUrl?: string;
}

const ExerciseCard = ({ item }: { item: Exercise }) => (
  <Card className="flex flex-col overflow-hidden shadow-sm transition-shadow duration-300 hover:shadow-lg">
    <CardHeader>
      <CardTitle className="font-headline text-lg">{item.title}</CardTitle>
      <CardDescription>{item.description}</CardDescription>
    </CardHeader>
    <CardContent className="flex flex-grow flex-col">
      {item.videoUrl && (
        <div className="mt-auto aspect-video overflow-hidden rounded-lg border">
          <iframe
            className="h-full w-full"
            src={item.videoUrl}
            title={item.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      )}
    </CardContent>
  </Card>
);

export default function ExercisesPage() {
    return (
        <div className="p-4 md:p-6 lg:p-8">
            <h1 className="mb-6 font-headline text-3xl font-bold text-foreground">Ejercicios</h1>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {exercises.map((item) => <ExerciseCard key={item.id} item={item} />)}
            </div>
        </div>
    )
}
