import EditableInput from "@/components/shared/EditableInput";
interface Props {
  driver: any;
  onUpdate: (data: any) => void;
  loading: boolean;
}

const DriverFrom: React.FC<Props> = ({ driver, onUpdate, loading }) => {
  const update_partial_driver = async (data: any) =>
    onUpdate({ values: [data] });

  return (
    <>
      <div className="form-body">
        <h2 className="text-sm font-bold">General Info</h2>

        <EditableInput
          label="Name"
          inputType="text"
          onSave={(value: string | number) => update_partial_driver({ name: value })}
          defaultVal={driver.name}
          loading={loading}
          required={true}
          validationMessage={"Name is required"}
        />
        <EditableInput
          label="Mobile"
          inputType="number"
          onSave={(value: string | number) => update_partial_driver({ mobile: value })}
          defaultVal={driver.mobile}
          loading={loading}
          required={true}
          validationMessage={"Mobile is required"}
        />
      </div>
    </>
  );
};

export default DriverFrom;
