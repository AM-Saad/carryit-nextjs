import Meta from "@/shared/modals/meta";

interface AdminContext {

    admin: any;
    fetch_admin: () => Promise<void>;
    adminMeta: Meta,
    fetcher: (callback: any, isList: boolean) => Promise<void | boolean>;
    currentItem: any
    currentItems: any
    updater: (callback: any, data: any) => Promise<void | boolean>;
    remover: (callback: any, redirectUrl: string) => Promise<void>;

    fetchMeta: Meta
    updateMeta: Meta

    authenticate: (email: string, name: string) => Promise<void>;
}

export default AdminContext;