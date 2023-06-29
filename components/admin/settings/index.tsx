import EditableInput from "@/components/shared/EditableInput";
interface Props {
  item: any;
  onUpdate: (data: any) => void;
  loading: boolean;
}

const AdminInfoForm: React.FC<Props> = ({ item, onUpdate, loading }) => {
  const update_partial = async (data: any) => onUpdate({ values: [data] });

  return (
    <>
      <div className="form-body">
        <h2 className="text-sm font-bold">Admin Info</h2>

        <EditableInput
          label="Name"
          inputType="text"
          onSave={(value: string | number) => update_partial({ name: value })}
          defaultVal={item.name}
          loading={loading}
          required={true}
          validationMessage={"Name is required"}
        />
        <EditableInput
          label="Mobile"
          inputType="number"
          onSave={(value: string | number) => update_partial({ mobile: value })}
          defaultVal={item.mobile}
          loading={loading}
          required={true}
          validationMessage={"Mobile is required"}
        />
      </div>
    </>
  );
};

export default AdminInfoForm;
