import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import precautions from '@/lib/data/precautions.json';
import Image from "next/image";
import { X, Check } from 'lucide-react';
import { PlaceHolderImages } from "@/lib/placeholder-images";


type PrecautionItem = {
    id: string;
    title?: string;
    image_id: string;
    imageUrl: string;
    is_good: boolean;
}

const PrecautionCard = ({ item }: { item: PrecautionItem }) => {
        const image = PlaceHolderImages.find(p => p.id === item.image_id);
        let src: string | undefined = undefined;
        if (item.imageUrl && !item.imageUrl.startsWith('http')) {
            // local path in public/
            src = `/${item.imageUrl.replace(/^\//, '')}`;
        } else if (image?.imageUrl) {
            src = image.imageUrl;
        } else if (item.imageUrl) {
            src = item.imageUrl;
        }
    const alt = image?.description || item.title || 'Imagen';

    return (
        <Card className="overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105">
            <CardHeader className="relative p-0">
                {src && (
                    <Image 
                        src={src}
                        alt={alt}
                        data-ai-hint={image?.imageHint}
                        width={400}
                        height={300}
                        className=" w-full object-cover"
                    />
                )}
                 <div className={`absolute top-2 left-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-500/80`}>
                    <X className="h-5 w-5 text-white" />
                </div>
                 <div className={`absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-green-500/80`}>
                    <Check className="h-5 w-5 text-white" />
                </div>
            </CardHeader>
            <CardContent className="p-4">
                <p className="text-center font-semibold text-foreground">{item.title}</p>
            </CardContent>
        </Card>
    );
};

export default function PrecautionsPage() {
  return (
    <div className="bg-background p-4 md:p-6 lg:p-8">
      <h1 className="mb-2 text-center font-headline text-3xl font-bold text-foreground">Precauciones</h1>
      <p className="mb-8 text-center text-muted-foreground">Qué hacer y qué no hacer para cuidar tu espalda.</p>
      
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-4 text-xl font-bold text-red-600">Evitar</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 mb-8">
            {precautions.filter(p => !p.is_good).map((item) => <PrecautionCard key={item.id} item={item} />)}
        </div>
      </div>
    </div>
  );
}
