import Meta from "@/shared/modals/meta";

interface AdminContext {

    admin: any;
    fetch_admin: (email: string, name: string) => Promise<void>;
    adminMeta: Meta,
    fetcher: (callback: any, isList: boolean) => Promise<void | boolean>;
    currentItem: any
    currentItems: any
    updater: (callback: any, data: any) => Promise<void | boolean>;
    remover: (callback: any, redirectUrl: string) => Promise<void>;

    fetchMeta: Meta
    updateMeta: Meta


}

export default AdminContext;