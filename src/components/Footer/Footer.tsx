export default function Footer() {
  return (
    <footer style={{ textAlign: "center", padding: "20px", background: "#111", color: "white" }}>
      © {new Date().getFullYear()} ЭРИС. Все права защищены.
    </footer>
  );
}