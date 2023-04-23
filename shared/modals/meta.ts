import { Error } from "./Response";

interface Meta{
    loading: boolean;
    error: Error | null;
}
export default Meta;