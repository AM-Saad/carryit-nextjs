import Meta from "@/shared/modals/meta";
import { Package } from "./Package";

interface DriverContext {

    driver: any;
    fetch_driver: () => Promise<void>;
    driverMeta: Meta,
    fetcher: (callback: any, isList: boolean) => Promise<void | boolean>;
    currentItem: Package | null;
    currentItems: Package[]
    fetchMeta: Meta
    updateMeta: Meta
    updater: (callback: any, data: any) => Promise<void | boolean>;

    authenticate: (email: string, name: string) => Promise<void>;
}

export default DriverContext;