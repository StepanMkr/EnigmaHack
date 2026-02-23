export default function Contacts() {
  return (
    <section>
      <h2>Контакты</h2>
      <p><b>Адрес:</b> г. Чайковский, Пермский край</p>
      <p><b>Телефон:</b> +7 (777) 777-77-77</p>
      <p><b>Email:</b> eris@mail.ru</p>
      <iframe
        title="map"
        src="https://maps.google.com/maps?q=perm&t=&z=13&ie=UTF8&iwloc=&output=embed"
        width="100%"
        height="300"
        style={{ border: 0, borderRadius: "12px", marginTop: "20px" }}
        loading="lazy"
      />
    </section>
  );
}