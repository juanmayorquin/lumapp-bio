import { UserData } from '@/components/UserData';

export default function Home() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:gap-8 md:p-6 lg:p-8">
      <UserData />
    </div>
  );
}
