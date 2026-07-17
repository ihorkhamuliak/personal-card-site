import { ShaderAnimation } from "@/components/ui/shader-animation";
import { BusinessCard } from "@/components/ui/business-card";

export default function Home() {
  return (
    <main className="fixed inset-0 bg-black">
      <ShaderAnimation />

      {/* Business card, centered on top of the WebGL shader. */}
      <div className="absolute inset-0 grid place-items-center p-4">
        <BusinessCard />
      </div>
    </main>
  );
}
