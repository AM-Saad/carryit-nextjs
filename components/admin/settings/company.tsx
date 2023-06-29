import React, { useEffect, useState } from "react";
import Response, { Status } from "@/shared/modals/Response";
import { toast } from "react-toastify";
import { sharedRepository } from "@/lib/repositries/admin";
import EditableInput from "@/components/shared/EditableInput";
import Company from "@/modals/Company";

const CompanyForm = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [updating, setUpdating] = useState<boolean>(false);
  const [company, setCompany] = useState<Company | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetch_company = async () => {
    try {
      setLoading(true);
      const response: Response<Company> =
        await sharedRepository.fetch_company();
      setLoading(false);
      console.log(response);
      if (response.status === Status.SUCCESS) {
        return setCompany(response.items as Company);
      }
      setError(response.message);
    } catch (e: any) {
      setLoading(false);
      setError(e.message);
    }
  };
  const update_partial = async (data: any) => {
    try {
      setUpdating(true);
      await sharedRepository.update_partial_company({ values: [data] });
      setUpdating(false);
      toast.success("Company updated successfully");
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  useEffect(() => {
    fetch_company();
  }, []);

  return (
    <div className="form-body">
      <h2 className="text-sm font-bold"> Company Info </h2>
      {error && <div className="text-sm font-bold text-red-500"> {error} </div>}

      {loading && <div className="text-sm "> Loading... </div>}

      {!loading && company && (
        <div>
          <EditableInput
            label="Brand Name"
            inputType="text"
            onSave={(value: string | number) =>
              update_partial({ brand_name: value })
            }
            defaultVal={company.brand_name}
            loading={updating}
            required={true}
            validationMessage={"Brand name is required"}
          />
          <EditableInput
            label="Brand Address"
            inputType="text"
            onSave={(value: string | number) => {
              return update_partial({ address: value });
            }}
            defaultVal={company.address || ""}
            loading={updating}
            required={false}
          />
          <EditableInput
            label="Brand Hotline"
            inputType="number"
            onSave={(value: string | number) => {
              return update_partial({ hotline: value });
            }}
            defaultVal={company.hotline || ""}
            loading={updating}
            required={false}
          />
        </div>
      )}
    </div>
  );
};

export default CompanyForm;
