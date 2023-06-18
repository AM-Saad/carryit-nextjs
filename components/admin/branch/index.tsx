import EditableInput from "@/components/shared/EditableInput";
import Button from "@/components/shared/Button";
import ConfirmDeleteItem from "@/components/shared/ConfirmDelete";
import Modal from "@/components/shared/modal";
import { useEffect, useState, useContext } from "react";
import MultiSelect from "@/components/shared/MultiSelect";
import { branchRepository } from "@/lib/repositries/admin";
import AdminContext from "@/stores/admin";
import Branch from "@/modals/Branch";

interface Props {
  branch: Branch;
  onUpdate: (data: any) => void;
  loading: boolean;
  onDelete: () => void;
}

const BranchFrom: React.FC<Props> = ({
  branch,
  onUpdate,
  loading,
  onDelete,
}) => {
  const [openConfirmDeleteModal, setOpenConfirmDeleteModal] =
    useState<boolean>(false);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [driversToAssign, setDriversToAssign] = useState<any[]>([]);
  const [selectedDrivers, setSelectedDrivers] = useState<any[]>([]);

  const [vehicles, setVehicles] = useState<any[]>([]);
  const [vehiclesToAssign, setVehiclesToAssign] = useState<any[]>([]);
  const [selectedVehicles, setSelectedVehicles] = useState<any[]>([]);

  const update_partial_branch = async (data: any) =>
    onUpdate({ values: [data] });
  const { updater, updateMeta } = useContext(AdminContext);

  const update_drivers = async (drivers: any[]) => {
    const driverIds = drivers.map((item: any) => item.value);
    console.log(driverIds);
    update_partial_branch({ drivers: driverIds });
  };

  const update_vehicles = async (vehicles: any[]) => {
    const vehiclesIds = vehicles.map((item: any) => item.value);
    console.log(vehiclesIds);
    update_partial_branch({ vehicles: vehiclesIds });
  };

  const fetch_drivers = async () => {
    const token = localStorage.getItem("uidjwt");

    const res = await fetch("/api/admin/drivers", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();

    const options = data.items.map((item: any) => ({
      value: item.id,
      label: item.name,
    }));

    const currentDrivers = options.filter((item: any) =>
      branch.drivers?.includes(item.value),
    );

    if (currentDrivers) {
      setSelectedDrivers(currentDrivers);
    }
    setDriversToAssign(options);
    setDrivers(data.items);
  };

  const fetch_vehicles = async () => {
    const token = localStorage.getItem("uidjwt");

    const res = await fetch("/api/admin/vehicles", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();

    const options = data.items.map((item: any) => ({
      value: item.id,
      label: item.name,
    }));

    const currentVehicles = options.filter((item: any) =>
      branch.vehicles?.includes(item.value),
    );

    if (currentVehicles) {
      setSelectedVehicles(currentVehicles);
    }
    setVehiclesToAssign(options);
    setVehicles(data.items);
  };

  useEffect(() => {
    fetch_drivers();
    fetch_vehicles();
  }, []);

  return (
    <>
      <div className="items-header">
        <h1 className="title">{branch.name || "n.c."}</h1>
        <div className="flex items-center justify-between gap-5">
          <Button
            onClick={() => setOpenConfirmDeleteModal(true)}
            title="Delete"
            style="bg-red-500 text-white"
            loading={loading}
            disabled={loading}
          />
          <Modal
            showModal={openConfirmDeleteModal}
            setShowModal={() => setOpenConfirmDeleteModal(false)}
          >
            <ConfirmDeleteItem
              label="branch"
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
            update_partial_branch({ name: value });
          }}
          defaultVal={branch.name}
          loading={loading}
          required={true}
          validationMessage={"Name is required"}
        />
        <EditableInput
          label="Phone"
          inputType="number"
          onSave={(value: string | number) => {
            update_partial_branch({ phone: value });
          }}
          defaultVal={branch.phone || ""}
          loading={loading}
          required={true}
          validationMessage={"Phone is required"}
        />
        <EditableInput
          label="Address"
          inputType="number"
          onSave={(value: string | number) => {
            update_partial_branch({ address: value });
          }}
          defaultVal={branch.address || ""}
          loading={loading}
          required={true}
          validationMessage={"Address is required"}
        />
        <EditableInput
          label="State"
          inputType="text"
          onSave={(value: string | number) => {
            update_partial_branch({ state: value });
          }}
          defaultVal={branch.state || ""}
          loading={loading}
          required={true}
          validationMessage={"State is required"}
        />

        <EditableInput
          label="City"
          inputType="text"
          onSave={(value: string | number) => {
            update_partial_branch({ city: value });
          }}
          defaultVal={branch.city || ""}
          loading={loading}
          required={true}
          validationMessage={"City is required"}
        />

        <EditableInput
          label="Governorate"
          inputType="text"
          onSave={(value: string | number) => {
            update_partial_branch({ governorate: value });
          }}
          defaultVal={branch.governorate || ""}
          loading={loading}
          required={true}
          validationMessage={"Governorate is required"}
        />

        <div className="mb-2 mt-3 rounded-lg border px-2 pb-2">
          <label
            htmlFor="drivers"
            className="editable-input_label mt-2 block text-sm font-medium text-gray-600"
          >
            Drivers{" "}
          </label>

          {drivers.length > 0 && (
            <MultiSelect
              label="label"
              multiple={true}
              trackBy="value"
              closeOnSelect={false}
              input={(props: any) => {
                update_drivers(props);
              }}
              id="drivers"
              options={driversToAssign}
              placeholder={"Branch Drivers"}
              disabled={loading}
              preSelected={selectedDrivers}
            />
          )}
        </div>
        <div className="mb-2 mt-3 rounded-lg border px-2 pb-2">
          <label
            htmlFor="vehicles"
            className="editable-input_label mt-2 block text-sm font-medium text-gray-600"
          >
            Vehicles{" "}
          </label>

          {vehicles.length > 0 && (
            <MultiSelect
              label="label"
              multiple={true}
              trackBy="value"
              closeOnSelect={false}
              input={(props: any) => {
                update_vehicles(props);
              }}
              id="vehicles"
              options={vehiclesToAssign}
              placeholder={"Branch Vehicles"}
              disabled={loading}
              preSelected={selectedVehicles}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default BranchFrom;
