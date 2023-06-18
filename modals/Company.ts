
  
interface Company {
    id: string;
    brand_name: string;
    main_email?: string;
    logo: string;
    hotline?: string;
    address?: string;
    mobile?: string;
    roles: any[];
    subscription: any;
    managers: any[];
    managersIds: string[];
    Driver: any[];
    Package: any[];
    Vehicle: any[];
    Product: any[];
    Zone: any[];
    User: any[];
    Branch: any[];
}

export default Company;