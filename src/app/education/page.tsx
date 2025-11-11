import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import education from "@/lib/data/education.json";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

type EducationItem = {
  id: string;
  title?: string;
  content?: string;
  videoUrl?: string;
};

const toEmbedUrl = (url?: string) => {
  if (!url) return null;
  try {
    const u = new URL(url);
    // youtube watch URL
    if (u.hostname.includes("youtube.com")) {
      const v = u.searchParams.get("v");
      if (v) return `https://www.youtube.com/embed/${v}`;
    }
    // youtu.be short link
    if (u.hostname === "youtu.be") {
      const id = u.pathname.replace(/^\//, "");
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
    // fallback: return original
    return url;
  } catch (e) {
    return url;
  }
};

const EducationCard = ({ item }: { item: EducationItem }) => {
  const embed = toEmbedUrl(item.videoUrl);
  return (
    <Card className="bg-card border shadow-lg backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-primary font-semibold">
          {item.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-foreground/80 mb-4">{item.content}</p>
        <div className="bg-primary p-3 rounded-t-md">
          <h3 className="font-medium text-white text-center">
            Aprende más con el siguiente video
          </h3>
        </div>
        {embed && (
          <div>
            <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
              <iframe
                src={embed}
                title={item.title}
                className="absolute inset-0 h-full w-full"
                frameBorder={0}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default function EducationPage() {
  const spineBg = PlaceHolderImages.find((p) => p.id === "spine-background");

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
        <h1 className="mb-4 text-center font-headline text-4xl font-bold text-foreground">
          Educación
        </h1>
        <div className="mx-auto mb-8 max-w-md rounded-2xl bg-foreground p-4 text-center text-background shadow-2xl">
          <h2 className="font-headline text-2xl font-semibold">
            Aprende sobre tu columna lumbar
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:max-w-4xl mx-auto">
          {education.map((item) => (
            <EducationCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
