import axios from "axios";

const cfg = axios.create({
    baseURL: "http://localhost:5555",
    withCredentials:true
})

export default cfg;
