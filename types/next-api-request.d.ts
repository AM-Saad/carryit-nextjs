import { NextApiRequest } from 'next';

declare global {
    namespace Next {
        interface NextApiRequest {
            id?: string;
        }
    }
}