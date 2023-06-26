import EditableInput from "@/components/shared/EditableInput";
import ToggleBtn from "@/components/shared/ToggleBtn";
import Button from "@/components/shared/Button";
import { Package } from "@/modals/Package";
import Modal from "@/components/shared/modal";
import ConfirmDeleteItem from "@/components/shared/ConfirmDelete";
import { useEffect, useState, useContext } from "react";
import { packageRepository } from "@/lib/repositries/admin";
import MultiSelect from "@/components/shared/MultiSelect";
import AdminContext from "@/stores/admin";
import ChangeStatus from "./ChangeStatus";
import Fragile from "@/components/shared/icons/fragile";
import Liquid from "@/components/shared/icons/liquid";
import Branch from "@/modals/Branch";
import Response from "@/shared/modals/Response";
import { BRANCHES_ROUTE } from "@/lib/constants";
import { getHeaders } from "@/lib/utils";
import Home from "@/components/shared/icons/home";
import Driver from "@/modals/Driver";

interface Props {
  currentPackage: Package;
  onUpdate: (data: any) => void;
  loading: boolean;
  onDelete: () => void;
}

const PackageFrom: React.FC<Props> = ({ currentPackage, onUpdate, loading, onDelete }) => {
  const update_partial_package = async (data: any) =>
    onUpdate({ values: [data] });
  const [openConfirmDeleteModal, setOpenConfirmDeleteModal] =
    useState<boolean>(false);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [driverToAssign, setDriverToAssign] = useState<any[]>([]);
  const [selectedDrivers, setSelectedDrivers] = useState<any[]>([]);
  const [assignDriverError, setAssignDriverError] = useState<string | null>(null);
  const [branchName, setBranchName] = useState<string>("");

  const { updater, updateMeta } = useContext(AdminContext);

  const assign_package = async (driverId: string) => {
    await updater(packageRepository.assign_package(currentPackage.id, driverId), false);
  };

  const fetch_drivers = async () => {
    const token = localStorage.getItem("uidjwt")!;

    const res = await fetch("/api/admin/drivers", { headers: getHeaders(token) });
    const data = await res.json();

    const drivers = data.items.filter((i: Driver) => i.branchId && i.branchId === currentPackage.branchId).map((item: any) => ({
      value: item.id,
      label: item.name,
    }));

    const currentDriver = drivers.find((item: any) => item.value === currentPackage.driverId);

    if (currentDriver) {
      setSelectedDrivers([
        { label: currentDriver.label, value: currentDriver.value },
      ]);
    }
    setDriverToAssign(drivers);
    setDrivers(data.items);
  };

  const fetch_package_branch = async () => {
    if (!currentPackage.branchId) return setBranchName("Not assosiated to branch")

    const token = localStorage.getItem("uidjwt")!;

    const res: any = await fetch(`${BRANCHES_ROUTE}/${currentPackage.branchId}`, { headers: getHeaders(token) });
    const data: Response<Branch> = await res.json().then((data: Response<Branch>) => data);
    const branch = data.items as Branch;

    setBranchName(branch ? branch.name : "Not assosiated to branch");
  };

  useEffect(() => {
    fetch_drivers();
    fetch_package_branch();
  }, []);

  return (
    <>
      <div className="items-header">

        <div>
          <div className="flex items-center gap-3">
            <h1 className="title">{currentPackage.packageNo || "n.c."}</h1>
            <ChangeStatus />
          </div>
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
            loading={loading}
            disabled={loading}
          />
          <Modal
            showModal={openConfirmDeleteModal}
            setShowModal={() => setOpenConfirmDeleteModal(false)}
          >
            <ConfirmDeleteItem
              label="package"
              cancel={() => setOpenConfirmDeleteModal(false)}
              onConfirmDelete={onDelete}
            />
          </Modal>
        </div>

      </div>
      <div className="form-body">
        <div className="my-3 flex items-center justify-between gap-2">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-1">
              <h1 className="flex items-center text-xs font-medium text-gray-600">
                Fragile
              </h1>
              <ToggleBtn
                value={currentPackage.is_fragile}
                onChange={(value: any) =>
                  update_partial_package({ is_fragile: value })
                }
              />
            </div>
            <div className="flex items-center gap-1">
              <h1 className="flex items-center text-xs font-medium text-gray-600">
                Liquid
              </h1>
              <ToggleBtn
                value={currentPackage.is_liquid}
                onChange={(value: any) =>
                  update_partial_package({ is_liquid: value })
                }
              />
            </div>
          </div>
        </div>
        <div className="grid sm:grid-cols-2  sm:gap-x-5">
          <EditableInput
            label="Name"
            inputType="text"
            onSave={(value: string | number) => {
              update_partial_package({ "receiver.name": value });
            }}
            defaultVal={currentPackage.receiver.name}
            loading={loading}
            required={true}
            validationMessage={"name is required"}
          />
          <EditableInput
            label="Mobile"
            inputType="number"
            onSave={(value: string | number) => {
              update_partial_package({ "receiver.phone": value });
            }}
            defaultVal={currentPackage.receiver.phone}
            loading={loading}
            required={true}
            validationMessage={"Mobile is required"}
          />

          <EditableInput
            label="Address"
            inputType="text"
            onSave={(value: string | number) => {
              update_partial_package({ "receiver.address": value });
            }}
            defaultVal={currentPackage.receiver.address}
            loading={loading}
            required={true}
            validationMessage={"Address is required"}
          />
          <EditableInput
            label="Apartment"
            inputType="number"
            onSave={(value: string | number) => {
              update_partial_package({ "receiver.apartment": value });
            }}
            defaultVal={currentPackage.receiver.apartment}
            loading={loading}
            required={true}
            validationMessage={"Apartment is required"}
          />
          <EditableInput
            label="Building"
            inputType="number"
            onSave={(value: string | number) => {
              update_partial_package({ "receiver.building": value });
            }}
            defaultVal={currentPackage.receiver.building}
            loading={loading}
            required={true}
            validationMessage={"Building is required"}
          />
          <EditableInput
            label="City"
            inputType="text"
            onSave={(value: string | number) => {
              update_partial_package({ "receiver.city": value });
            }}
            defaultVal={currentPackage.receiver.city || ""}
            loading={loading}
            required={false}
            validationMessage={"City is required"}
          />
          <EditableInput
            label="State"
            inputType="text"
            onSave={(value: string | number) => {
              update_partial_package({ "receiver.state": value });
            }}
            defaultVal={currentPackage.receiver.state || ""}
            loading={loading}
            required={false}
            validationMessage={"State is required"}
          />
          <EditableInput
            label="Zip"
            inputType="text"
            onSave={(value: string | number) => {
              update_partial_package({ "receiver.zip": value });
            }}
            defaultVal={currentPackage.receiver.zip || ""}
            loading={loading}
            required={false}
            validationMessage={"Zip is required"}
          />

          <div className="mb-2 mt-3 rounded-lg border px-2 pb-2">
            <label
              htmlFor="assigned_vehicle"
              className="editable-input_label mt-2 block text-sm font-medium text-gray-600"
            >
              {currentPackage.driverId ? "Assigned" : "Assign"} Driver{" "}
            </label>
            {assignDriverError && (
              <p className="text-red-500">{assignDriverError}</p>
            )}
            {drivers.length > 0 && (
              <MultiSelect
                label="label"
                multiple={false}
                trackBy="value"
                closeOnSelect={true}
                input={(props: any) => {
                  props[0] && assign_package(props[0].value);
                }}
                id="assigned_vehicle"
                options={driverToAssign}
                placeholder={"Assigned Vehicle"}
                disabled={loading}
                preSelected={selectedDrivers}
              />
            )}
          </div>

          {/* <ToggleBtn value={currentPackage.receiver.is_villa} onChange={(value: any) => update_partial_package({ 'receiver.is_villa': value })} /> */}
        </div>
      </div>
    </>
  );
};

export default PackageFrom;
