import { useState } from "react";
import "./Entry.css";
import type { Page } from "../../model/page";
import Header from "../Header/Header";
import Home from "../Home/Home";
import Contacts from "../Contacts/Contacts";
import Users from "../Users/Users";
import Footer from "../Footer/Footer";
import EmailList from "../Emails/Emails";
import ExportFiles from "../ExportFiles/ExportFiles";
import TicketTable from "../test";

export default function Entry() {
  const [page, setPage] = useState<Page>("table");

  return (
    <div className="wrapper">
      <Header setPage={setPage} />

      <main>
        {page === "home" && <Home />}
        {page === "export" && <ExportFiles />}
        {page === "contacts" && <Contacts />}
        {page === "users" && <Users />}
        {page === "emails" && <EmailList />}
        {page === 'table' && <TicketTable />}
      </main>

      <Footer />
    </div>
  );
}