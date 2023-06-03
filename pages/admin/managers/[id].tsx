import Layout from '@/components/layout'
import React, { useContext, useEffect } from 'react'
import { useRouter } from 'next/router'
import ManagerFrom from '@/components/admin/manager'
import { managerRepository } from '@/lib/repositries/admin'
import FetchError from '@/components/shared/Error'
import Loading from '@/components/shared/Loading'
import AdminContext from '@/stores/admin'
import { INTERNAL_MANAGERS_ROUTE } from '@/lib/constants'
import withAuth from '@/components/shared/auth';

const Manager = () => {
  const router = useRouter()
  const { id } = router.query as { id: string }
  const { fetcher, fetchMeta, currentItem, updater, updateMeta, remover } = useContext(AdminContext);
  const { loading, error } = fetchMeta


  const fetch_data = async () => {
    await fetcher(managerRepository.fetch_manager(id), false)
  }


  const update_partial_item = async (data: any) => {
    await updater(managerRepository.update_partial_manager(id, data), false)

  }

  const delete_item = async () => {
    await remover(managerRepository.delete_manager(id), INTERNAL_MANAGERS_ROUTE)

  }


  useEffect(() => {
    if (id)
      fetch_data()
  }, [id])

  return (
    <Layout
      meta={{
        title: `${currentItem ? currentItem.name : 'Manager'} | Admin`,
        description: 'Manager',
      }}
    >

      {(loading && !error) && <Loading />}
      {(error && !loading) && <FetchError reload={fetch_data} error={error} />}

      {(!loading && currentItem) &&
        <ManagerFrom
          manager={currentItem}
          onUpdate={update_partial_item}
          loading={updateMeta.loading}
          onDelete={delete_item}
        />
      }

    </Layout>
  )
}

export default withAuth(Manager)