export default function Footer() {
  return (
    <footer style={{ textAlign: "center", padding: "20px", background: "#0061a5", color: "white" }}>
      © {new Date().getFullYear()} ЭРИС.
    </footer>
  );
}