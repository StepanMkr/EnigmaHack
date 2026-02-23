import DownloadCsvButton from "../filecsv";
import DownloadXlsxButton from "../filexlsx";

export default function ExportFiles() {

  return (
    <section>
      <DownloadCsvButton />
      <DownloadXlsxButton />
    </section>
  );
}
