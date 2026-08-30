import { Component, type ReactNode } from "react";

type Props = { children: ReactNode };
type State = { error: Error | null };

// A crash anywhere in the tree with no boundary leaves a blank white page
// and zero information about why. This shows the actual error on screen
// instead, so a real report ("blanco en mobile") comes with something
// diagnosable.
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error("Uncaught render error:", error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
            padding: "2rem",
            textAlign: "center",
            background: "#f7f0e2",
            color: "#2a1e13",
            fontFamily: "sans-serif",
          }}
        >
          <p style={{ fontWeight: 700, fontSize: "1.1rem" }}>
            Algo falló al cargar la página.
          </p>
          <pre
            style={{
              maxWidth: "100%",
              overflowX: "auto",
              fontSize: "0.75rem",
              background: "#ece0c7",
              padding: "1rem",
              borderRadius: "0.5rem",
              textAlign: "left",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {this.state.error.name}: {this.state.error.message}
            {"\n"}
            {this.state.error.stack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}
