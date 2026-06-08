import { PlanningPokerBoard } from "@/features/planning-poker/presentation/planning-poker-board";

type HomeProps = {
  searchParams: Promise<{
    room?: string | string[];
  }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const initialRoomCode = Array.isArray(params.room) ? params.room[0] : params.room;

  return <PlanningPokerBoard initialRoomCode={initialRoomCode ?? ""} />;
}
