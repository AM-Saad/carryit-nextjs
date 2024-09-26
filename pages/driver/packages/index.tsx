import React, { useEffect, useState, useContext } from "react";
import Link from "next/link";
import Image from "next/image";
import { TriangleRightIcon } from "@radix-ui/react-icons";

import Layout from "@/components/layout/driver";
import { packageRepository } from "@/lib/repositries/driver";
import FetchError from "@/components/shared/Error";
import Loading from "@/components/shared/Loading";
import AdminContext from "@/stores/driver";
import { INTERNAL_DRIVER_SHIPMENTS_ROUTE } from "@/lib/constants";
import withAuth from "@/components/shared/auth";
const Packages = () => {
  const { fetcher, fetchMeta, currentItems } = useContext(AdminContext);
  const { loading, error } = fetchMeta;

  const fetch_data = async () => {
    await fetcher(packageRepository.fetch_packages(), true);
  };
  useEffect(() => {
    fetch_data();
  }, []);

  return (
    <>
      <Layout>
        {loading && <Loading />}
        {error && !loading && <FetchError reload={fetch_data} error={error} />}

        {currentItems && currentItems.length > 0 && (
          <>
            <div className="items-header">
              <h1 className="title flex items-center gap-2">
                Your Packages
              </h1>

              <div className="flex items-center justify-between gap-5"></div>
            </div>

            <div className=" ">
              {currentItems.map((item: any) => (
                <Link
                  href={`${INTERNAL_DRIVER_SHIPMENTS_ROUTE}/${item.id}`}
                  key={item.id}
                  className="group relative flex items-center gap-3 border-b p-2 text-black"
                >
                  <TriangleRightIcon className="relative block h-5 w-5 transform transition-all duration-300 group-hover:translate-x-2" />
                  <p>{item.packageNo}</p>
                </Link>
              ))}
            </div>
          </>
        )}

        {currentItems.length === 0 && !loading && !error && (
          <div className="flex flex-col items-center justify-center p-2">
            <Image
              src="/package.png"
              alt="No Drivers"
              width="80"
              height="80"
              style={{ filter: "drop-shadow(2px 2px 2px #555)" }}
            />
            <p className="mt-3 text-xs font-medium text-gray-700 sm:text-sm">
              No Packages Associated To You
            </p>
          </div>
        )}
      </Layout>
    </>
  );
};

export default withAuth(Packages);
