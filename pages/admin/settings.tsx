import Layout from "@/components/layout";
import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import GeneralInfo from "@/components/admin/settings";
import Company from "@/components/admin/settings/company";
import { sharedRepository } from "@/lib/repositries/admin";
import DriverCtx from "@/stores/admin";
import withAuth from "@/components/shared/auth";
import { toast } from "react-toastify";
const Settings = () => {
  const { fetchMeta, currentItem, updater, updateMeta, fetcher } =
    useContext(DriverCtx);

  const update_partial = async (data: any) => {
    await updater(sharedRepository.update_partial_admin(data), false);
  };

  useEffect(() => {
    fetcher(sharedRepository.fetch_admin(), false);
  }, []);
  return (
    <Layout
      meta={{
        title: "Settings | Admin",
        description: "Admin settings page",
        keywords:
          "Karry, Admin, Settings, Karry Admin, Karry Admin Settings, transport, logistics, trucking, cargo, shipping, delivery, package tracking, freightm broker, freight forwarder, supply chain, warehouse, freight",
      }}
    >
      {!fetchMeta.loading && currentItem && (
        <>
          <div className="items-header">
            <h1 className="title">Settings</h1>

            <div className="flex items-center justify-between gap-5"></div>
          </div>
          <GeneralInfo
            item={currentItem}
            onUpdate={(data: any) => update_partial(data)}
            loading={updateMeta.loading}
          />

          <Company />
        </>
      )}
    </Layout>
  );
};

export default withAuth(Settings);
