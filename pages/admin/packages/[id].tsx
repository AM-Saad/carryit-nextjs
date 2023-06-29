import Layout from '@/components/layout'
import React, { useContext, useEffect } from 'react'
import { useRouter } from 'next/router'
import { packageRepository } from '@/lib/repositries/admin'
import AdminContext from '@/stores/admin'
import { useSession } from 'next-auth/react'
import Loading from '@/components/shared/Loading'
import FetchError from '@/components/shared/Error'
import PackageFrom from '@/components/admin/package'
import { INTERNAL_SHIPMENTS_ROUTE } from '@/lib/constants'
import withAuth from '@/components/shared/auth';


const Package = () => {
  const router = useRouter()
  const { id } = router.query as { id: string }
  const { data: session } = useSession()

  const { fetcher, fetchMeta, currentItem, updateMeta, remover } = useContext(AdminContext);
  const { loading, error } = fetchMeta

  const fetch_data = async () => {
    await fetcher(packageRepository.fetch_package(id), false)
  }


  const remove_data = async () => {
    await remover(packageRepository.delete_package(id), INTERNAL_SHIPMENTS_ROUTE)
  }

  useEffect(() => {
    if (session && id) {
      fetch_data()
    }
  }, [session, id]);


  return (
    <Layout
      meta={{
        title: `${currentItem ? currentItem.packageNo : 'Package'} | Admin`,
        description: 'Package',
      }}
    >

      {loading && <Loading />}
      {error && !loading && <FetchError reload={fetch_data} error={error} />}
      {(!loading && currentItem) && <PackageFrom
        currentPackage={currentItem}
        onDelete={remove_data}
        loading={updateMeta.loading} />}
    </Layout>
  )
}

export default withAuth(Package)