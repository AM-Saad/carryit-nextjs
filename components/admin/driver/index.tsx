import EditableInput from "@/components/shared/ui/EditableInput";
import ToggleBtn from "@/components/shared/ui/ToggleBtn";
import DocumentsContainer from "@/components/admin/driver/DocumentsContainer";
import Button from "@/components/shared/ui/Button";
import MultiSelect from "@/components/shared/ui/MultiSelect";
import ConfirmDeleteItem from "@/components/shared/ConfirmDelete";
import Modal from "@/components/shared/modal";
import { useEffect, useState, useContext } from "react";
import { driverRepository } from "@/lib/repositries/admin";
import AdminContext from "@/stores/admin";
import { BRANCHES_ROUTE, VEHICLES_ROUTE } from "@/lib/constants";
import Response from "@/shared/modals/Response";
import Branch from "@/modals/Branch";
import { getHeaders } from "@/lib/utils";
import Home from "@/components/shared/icons/home";
interface Props {
  driver: any;
  loading: boolean;
  onDelete: () => void;
}

const DriverFrom: React.FC<Props> = ({
  driver,
  loading,
  onDelete,
}) => {
  const [openConfirmDeleteModal, setOpenConfirmDeleteModal] =
    useState<boolean>(false);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [vehiclesToAssign, setVehicleToAssign] = useState<any[]>([]);
  const [selectedVehicles, setSelectedVehicles] = useState<any[]>([]);
  const [assignVehicleError, setAssignVehicleError] = useState<string | null>(
    null,
  );
  const [branchName, setBranchName] = useState<string | null>(null);
  const { updater, updateMeta } = useContext(AdminContext);


  const update_partial_driver = async (data: any) => {
    await updater(driverRepository.update_partial_driver(driver.id, { values: [data] }), false)

  }

  const assign_vehicle = async (vehicleId: string | null) => {
    await updater(driverRepository.assign_vehicle(driver.id, vehicleId), false);
  };

  const fetch_vehicles = async () => {
    const token = localStorage.getItem("uidjwt");

    const res = await fetch(`${VEHICLES_ROUTE}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();

    const vehicles = data.items
      .filter((item: any) => item.branchId && item.branchId === driver.branchId)
      .map((item: any) => ({ label: item.name, value: item.id }));
    const currentVehicle = vehicles.find(
      (item: any) => item.value === driver.vehicleId,
    );

    if (currentVehicle) {
      setSelectedVehicles([
        { label: currentVehicle.label, value: currentVehicle.value },
      ]);
    }
    setVehicleToAssign(vehicles);
    setVehicles(data.items);
  };

  const fetch_driver_branch = async () => {
    if (!driver.branchId) return setBranchName("Not assosiated to branch");
    const token = localStorage.getItem("uidjwt")!;

    const res: any = await fetch(`${BRANCHES_ROUTE}/${driver.branchId}`, {
      headers: getHeaders(token),
    });
    const data: Response<Branch> = await res
      .json()
      .then((data: Response<Branch>) => data);

    const branch = data.items as Branch;
    setBranchName(branch ? branch.name : "Not assosiated to branch");
  };

  useEffect(() => {
    fetch_vehicles();
    fetch_driver_branch();
  }, []);



  return (
    <>
      <div className="items-header">
        <div>
          <h1 className="title">{driver.name || "n.c."}</h1>
          <span className="mt-1 flex items-center gap-x-2 text-xs">
            <Home className="h-3 w-3" />
            {branchName || "...."}
          </span>
        </div>
        <div className="flex items-center justify-between gap-5">
          <Button
            onClick={() => setOpenConfirmDeleteModal(true)}
            title="Delete"
            style="bg-red-500 text-white"
            loading={loading || updateMeta.loading}
            disabled={loading || updateMeta.loading}
          />

          <Modal
            showModal={openConfirmDeleteModal}
            setShowModal={() => setOpenConfirmDeleteModal(false)}
          >
            <ConfirmDeleteItem
              label="driver"
              cancel={() => setOpenConfirmDeleteModal(false)}
              onConfirmDelete={onDelete}
              loading={updateMeta.loading}
            />
          </Modal>
          <Button
            onClick={() => {
              update_partial_driver({ password: "123456" })
            }}
            title="Reset Password"
            style="bg-blue-500 text-white"
            loading={loading || updateMeta.loading}
            disabled={loading || updateMeta.loading}
          />
        </div>
      </div>

      <div className="form-body">
        {/* <ToggleBtn value={driver.active} onChange={(value: any) => update_partial_driver({ active: value })} /> */}

        <EditableInput
          label="Name"
          inputType="text"
          onSave={(value: string | number) => {
            return update_partial_driver({ name: value });
          }}
          defaultVal={driver.name}
          loading={loading}
          required={true}
          validationMessage={"Name is required"}
          error={updateMeta.error ? true : false}
        />
        <EditableInput
          label="Mobile"
          inputType="number"
          onSave={(value: string | number) => {
            return update_partial_driver({ mobile: value });
          }}
          defaultVal={driver.mobile}
          loading={loading}
          required={true}
          validationMessage={"Mobile is required"}
          error={updateMeta.error ? true : false}
        />

        <EditableInput
          label="Base Salary"
          inputType="number"
          onSave={(value: string | number) => {
            return update_partial_driver({
              salary: {
                ...driver.salary,
                base_salary: Number(value),
              },
            });
          }}
          defaultVal={driver.salary.base_salary || 0}
          loading={loading}
          required={false}
          min={0}
          error={updateMeta.error ? true : false}

        />
        <EditableInput
          label="Commission"
          inputType="number"
          onSave={(value: string | number) => {
           return update_partial_driver({
              salary: {
                ...driver.salary,
                commission: Number(value),
              },
            });
          }}
          defaultVal={driver.salary.commission}
          loading={loading}
          required={false}
          min={0}
          error={updateMeta.error ? true : false}

        />

        <div className="mb-2 mt-3 rounded-lg border px-2 pb-2">
          <label
            htmlFor="assigned_vehicle"
            className="editable-input_label mt-2 block text-sm font-medium text-gray-600"
          >
            Assigned Vehicle{" "}
          </label>
          {assignVehicleError && (
            <p className="text-red-500">{assignVehicleError}</p>
          )}
          {vehicles.length > 0 && (
            <MultiSelect
              label="label"
              multiple={false}
              trackBy="value"
              closeOnSelect={true}
              input={(props: any) => {
                assign_vehicle(props[0] ? props[0].value : null);
              }}
              id="assigned_vehicle"
              options={vehiclesToAssign}
              placeholder={"Assigned Vehicle"}
              disabled={loading}
              preSelected={selectedVehicles}
            />
          )}
        </div>

        <DocumentsContainer item={driver} context="drivers" />
      </div>
    </>
  );
};

export default DriverFrom;
