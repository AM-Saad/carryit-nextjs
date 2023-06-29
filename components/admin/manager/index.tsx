import EditableInput from "@/components/shared/EditableInput";
import Button from "@/components/shared/Button";
import ConfirmDeleteItem from "@/components/shared/ConfirmDelete";
import Modal from "@/components/shared/modal";
import { useEffect, useState, useContext } from "react";
import MultiSelect from "@/components/shared/MultiSelect";
import AdminContext from "@/stores/admin";

interface Props {
  manager: any;
  onUpdate: (data: any) => void;
  loading: boolean;
  onDelete: () => void;
}

const ManagerFrom: React.FC<Props> = ({
  manager,
  onUpdate,
  loading,
  onDelete,
}) => {
  const [openConfirmDeleteModal, setOpenConfirmDeleteModal] =
    useState<boolean>(false);
  const [branches, setBranches] = useState<any[]>([]);
  const [brancheToAssign, setBranchToAssign] = useState<any[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<any[]>([]);
  const [assignError, setAssignError] = useState<string | null>(null);

  const update_partial_branch = async (data: any) =>
    onUpdate({ values: [data] });

  const { updater, updateMeta } = useContext(AdminContext);

  const assign_branch = async (id: string | null) => {
    update_partial_branch({ branchId: id });
  };

  const fetch_branches = async () => {
    const token = localStorage.getItem("uidjwt");

    const res = await fetch("/api/admin/branches", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();

    const branches = data.items.map((item: any) => ({
      value: item.id,
      label: item.name,
    }));

    const currentBranch = branches.find(
      (item: any) => item.value === manager.branchId,
    );

    if (currentBranch) {
      setSelectedBranch([
        { label: currentBranch.label, value: currentBranch.value },
      ]);
    }
    setBranchToAssign(branches);
    setBranches(data.items);
  };

  useEffect(() => {
    fetch_branches();
  }, []);

  return (
    <>
      <div className="items-header">
        <h1 className="title">{manager.name || "n.c."}</h1>
        <div className="flex items-center justify-between gap-5">
          <Button
            onClick={() => setOpenConfirmDeleteModal(true)}
            title="Delete"
            style="bg-red-500 text-white"
            loading={loading}
            disabled={manager.isSuper}
          />

          <Modal
            showModal={openConfirmDeleteModal}
            setShowModal={() => setOpenConfirmDeleteModal(false)}
          >
            <ConfirmDeleteItem
              label="Manager"
              cancel={() => setOpenConfirmDeleteModal(false)}
              onConfirmDelete={onDelete}
            />
          </Modal>
        </div>
      </div>

      <div className="form-body">
        <EditableInput
          label="Name"
          inputType="text"
          onSave={(value: string | number) => {
            return update_partial_branch({ name: value });
          }}
          defaultVal={manager.name}
          loading={loading}
          required={true}
          validationMessage={"Name is required"}
        />
        <EditableInput
          label="Phone"
          inputType="number"
          onSave={(value: string | number) => {
            return update_partial_branch({ mobile: value });
          }}
          defaultVal={manager.mobile || ""}
          loading={loading}
          required={true}
          validationMessage={"Phone is required"}
        />

        <div className="mb-2 mt-3 rounded-lg border px-2 pb-2">
          <label
            htmlFor="assigned_branch"
            className="editable-input_label mt-2 block text-sm font-medium text-gray-600"
          >
            Assigned Branch{" "}
          </label>
          {assignError && <p className="text-red-500">{assignError}</p>}
          {branches.length > 0 && (
            <MultiSelect
              label="label"
              multiple={false}
              trackBy="value"
              closeOnSelect={true}
              input={(props: any) => {
                props[0] && assign_branch(props[0].value);
              }}
              id="assigned_branch"
              options={brancheToAssign}
              placeholder={"Assigned Branch"}
              disabled={loading}
              preSelected={selectedBranch}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default ManagerFrom;
