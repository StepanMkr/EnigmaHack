import { useState } from "react";
import "./Users.css";
import type { User } from "../../model/user";
import { usersAPI } from "../../API/users";
import { Button, Stack } from "@chakra-ui/react"

export default function Users() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchUsers = async () => {
        setLoading(true);
        setError(null);

        usersAPI.getUsers()
            .then(({ data }) => setUsers(data))
            .catch(() => setError("Не удалось загрузить пользователей"))
            .finally(() => setLoading(false));
    };

    return (
        <section>
            <h2>Пользователи</h2>

            <Stack direction="row" gap="4" align="center">
                <Button loading={loading} loadingText="Загрузка..." onClick={fetchUsers}>
                    Click me
                </Button>
            </Stack>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <ul style={{ marginTop: 20 }}>
                {users.map((u) => (
                    <li key={u.id} className="card">
                        <b>{u.name}</b>
                        <div>{u.email}</div>
                    </li>
                ))}
            </ul>
        </section>
    );
}
