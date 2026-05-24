"use client"

export function WispBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* Deep mesh gradient base */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 20% 20%, rgba(60,40,100,0.35) 0%, transparent 60%)," +
            "radial-gradient(ellipse 60% 80% at 80% 80%, rgba(20,60,100,0.3) 0%, transparent 60%)," +
            "radial-gradient(ellipse 100% 100% at 50% 50%, rgba(8,11,30,1) 0%, #070b18 100%)",
        }}
      />

      {/* Floating wisp orbs */}
      <div
        className="pointer-events-none absolute animate-[drift-a_22s_ease-in-out_infinite] rounded-full mix-blend-screen blur-[80px]"
        style={{
          width: "500px",
          height: "500px",
          top: "5%",
          left: "10%",
          background:
            "radial-gradient(circle, rgba(100,180,255,0.18) 0%, rgba(100,180,255,0.05) 50%, transparent 70%)",
          filter: "blur(70px)",
        }}
      />
      <div
        className="pointer-events-none absolute animate-[drift-b_28s_ease-in-out_infinite] rounded-full mix-blend-screen blur-[80px]"
        style={{
          width: "400px",
          height: "400px",
          top: "60%",
          right: "5%",
          background:
            "radial-gradient(circle, rgba(160,120,255,0.15) 0%, rgba(160,120,255,0.04) 50%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />
      <div
        className="pointer-events-none absolute animate-[drift-c_19s_ease-in-out_infinite_4s] rounded-full mix-blend-screen blur-[80px]"
        style={{
          width: "350px",
          height: "350px",
          top: "40%",
          left: "45%",
          background:
            "radial-gradient(circle, rgba(240,200,100,0.08) 0%, rgba(240,200,100,0.02) 50%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <div
        className="pointer-events-none absolute animate-[drift-a_32s_ease-in-out_infinite_reverse_2s] rounded-full mix-blend-screen blur-[80px]"
        style={{
          width: "300px",
          height: "300px",
          bottom: "10%",
          left: "20%",
          background:
            "radial-gradient(circle, rgba(80,200,200,0.1) 0%, rgba(80,200,200,0.03) 50%, transparent 70%)",
          filter: "blur(70px)",
        }}
      />
      <div
        className="pointer-events-none absolute animate-[drift-b_24s_ease-in-out_infinite_7s] rounded-full mix-blend-screen blur-[80px]"
        style={{
          width: "250px",
          height: "250px",
          top: "20%",
          right: "25%",
          background:
            "radial-gradient(circle, rgba(180,160,255,0.12) 0%, rgba(180,160,255,0.03) 50%, transparent 70%)",
          filter: "blur(50px)",
        }}
      />

      {/* Subtle vignette on top */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 120% 120% at 50% 50%, transparent 40%, rgba(4,6,16,0.7) 100%)",
        }}
      />
    </div>
  )
}
