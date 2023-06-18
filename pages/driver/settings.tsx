import Layout from "@/components/layout/driver";
import React, { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import GeneralInfo from "@/components/driver/settings";
import Password from "@/components/driver/settings/password";
import { sharedRepository } from "@/lib/repositries/driver";
import DriverCtx from "@/stores/driver";
import withAuth from "@/components/shared/auth";

const Settings = () => {
  const router = useRouter();
  const { fetchMeta, currentItem, updater, updateMeta, fetcher } =
    useContext(DriverCtx);

  const { loading, error } = fetchMeta;

  const update_partial_driver = async (data: any) => {
    await updater(sharedRepository.update_partial_driver(data), false);
  };

  useEffect(() => {
    fetcher(sharedRepository.fetch_driver(), false);
  }, []);
  return (
    <Layout
      meta={{
        title: "Driver",
        description: "Driver page",
      }}
    >
      {!loading && currentItem && (
        <>
          <div className="items-header">
            <h1 className="title">Settings</h1>

            <div className="flex items-center justify-between gap-5"></div>
          </div>
          <GeneralInfo
            driver={currentItem}
            onUpdate={update_partial_driver}
            loading={updateMeta.loading}
          />
          <Password
            driver={currentItem}
            onUpdate={update_partial_driver}
            loading={updateMeta.loading}
            onDelete={() => {}}
          />
        </>
      )}
    </Layout>
  );
};

export default withAuth(Settings);
