export default function HomePage() {
  return (
    <main style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <header style={{ marginBottom: "2rem" }}>
        <h1
          style={{
            fontSize: "2.5rem",
            fontWeight: "bold",
            color: "var(--primary)",
          }}
        >
          Gezgin
        </h1>
        <p
          style={{
            color: "var(--text-muted)",
            marginTop: "0.5rem",
            fontSize: "1.1rem",
          }}
        >
          Travel discovery and realistic trip planning for first-time visitors.
        </p>
      </header>

      <section
        style={{
          background: "var(--card-bg)",
          padding: "2rem",
          borderRadius: "12px",
          border: "1px solid var(--border)",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}
      >
        <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
          Explore Destinations
        </h2>
        <p style={{ color: "var(--text-muted)" }}>
          Istanbul discovery and trip planner initialized in monorepo workspace.
        </p>
      </section>
    </main>
  );
}
