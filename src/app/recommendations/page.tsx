import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ListChecks } from "lucide-react";
import recommendations from '@/lib/data/recommendations.json';

type RecommendationItem = {
    id: string;
    text?: string;
}

const RecommendationItem = ({ item }: { item: RecommendationItem }) => (
    <li className="flex items-start gap-3 rounded-lg border bg-card p-4 transition-colors hover:bg-accent/10">
      <ListChecks className="h-5 w-5 flex-shrink-0 text-accent" />
      <p className="flex-1 text-muted-foreground">{item.text}</p>
    </li>
  );

export default function RecommendationsPage() {
    return (
        <div className="p-4 md:p-6 lg:p-8">
            <h1 className="mb-6 font-headline text-3xl font-bold text-foreground">Recomendaciones</h1>
            <Card className="shadow-sm">
                <CardHeader><CardTitle className="font-headline text-xl">Nuestras Recomendaciones</CardTitle></CardHeader>
                <CardContent>
                    <ul className="space-y-3">
                        {recommendations.map((item) => <RecommendationItem key={item.id} item={item} />)}
                    </ul>
                </CardContent>
            </Card>
        </div>
    )
}
