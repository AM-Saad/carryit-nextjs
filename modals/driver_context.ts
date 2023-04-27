import Meta from "@/shared/modals/meta";

interface DriverContext {

    driver: any;
    fetch_driver: () => Promise<void>;
    driverMeta: Meta,

    fetchMeta: Meta
    updateMeta: Meta

    authenticate: (email: string, name: string) => Promise<void>;
}

export default DriverContext;