import type { Page } from "../../model/page";
import "./Header.css";

type Props = {
  setPage: (page: Page) => void;
};

export default function Header({ setPage }: Props) {
  return (
    <header>
      <h1 style={{ margin: 0, paddingLeft: "16px" }}>ЭРИС</h1>
      <nav style={{ marginTop: "10px" }}>
        <button onClick={() => setPage("home")} className="nav-button">Главная</button>
        <button onClick={() => setPage("export")} className="nav-button">Выгрузка</button>
        <button onClick={() => setPage("contacts")} className="nav-button">Контакты</button>
        <button onClick={() => setPage("users")} className="nav-button">Пользователи</button>
        <button onClick={() => setPage("emails")} className="nav-button">Письма</button>
        <button onClick={() => setPage("table")} className="nav-button">Test</button>
      </nav>
    </header>
  );
}
