import axios from "axios";
import type { User } from "../model/user";

export const usersAPI = {
    getUsers: () => axios.get<User[]>("https://jsonplaceholder.typicode.com/users")
}