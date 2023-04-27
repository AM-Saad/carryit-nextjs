import useLocalStorage from "../../hooks/use-local-storage";
import { fetcher } from "@/lib/utils";
import Response, { Status } from "@/shared/modals/Response";
import { useState } from 'react';



export default class SharedRepository {
    constructor() {

    }
    getToken = () => {
        return window.localStorage.getItem('didjwt')

    }

    login: (phone: string, password: string) => Promise<Response> = async (phone, password) => {
        try {
            const response = await fetcher(`/api/driver/login`, {
                method: "POST",
                body: JSON.stringify({ values: { phone, password } }),
            })
            return response
        } catch (error: any) {
            return {
                message: error.message, state: Status.UNEXPECTED_ERROR, items: []
            }

        }
    }
    fetch_driver: () => Promise<Response> = async () => {
        try {
            const response = await fetcher(`/api/driver/`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${this.getToken()}`,
                    "Content-Type": "application/json"
                }
            }
            );
            return response
        } catch (error: any) {
            return {
                message: error.message, state: Status.UNEXPECTED_ERROR, items: []
            }

        }
    }
   
 



}