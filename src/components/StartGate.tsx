"use client";

export default function StartGate({ onComplete }: { onComplete: (data: any) => void }) {
  return (
    <div className="absolute inset-0 bg-[#FCDDB0] bg-opacity-95 z-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white kid-border kid-shadow rounded-[40px] p-8 md:p-12 text-center animate-in zoom-in duration-300">
        
        <div className="mb-10">
          <h1 className="text-5xl font-black text-paintify-primary tracking-tight mb-4 flex items-center justify-center gap-4">
             🎨 Paintify Start
          </h1>
          <p className="text-3xl font-bold opacity-70">
            Who is coloring today?
          </p>
        </div>

        <div className="flex flex-col gap-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { id: "3-5", label: "Little Artist", icon: "🎨", color: "bg-paintify-yellow" },
              { id: "6-8", label: "Creative Explorer", icon: "🚀", color: "bg-paintify-lightBlue" },
              { id: "9-12", label: "Master Colorer", icon: "🌟", color: "bg-paintify-green" }
            ].map(age => (
              <button
                key={age.id}
                onClick={() => onComplete({ ageRange: age.id })}
                className={`p-10 kid-border transition-transform hover:scale-105 active:scale-95 flex flex-col items-center justify-center gap-4 bg-white hover:${age.color} hover:shadow-[6px_6px_0_0_#111]`}
              >
                <span className="text-6xl">{age.icon}</span>
                <div className="flex flex-col mt-2">
                  <span className="text-4xl font-black">{age.id}</span>
                  <span className="text-lg font-bold opacity-80">{age.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
