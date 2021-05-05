import axios from 'axios'

export const api = axios.create({
    baseURL: 'htt://localhost:3333/'
})