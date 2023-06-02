import Layout from '@/components/layout'
import React, { useContext, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import BranchFrom from '@/components/admin/branch'
import { branchRepository } from '@/lib/repositries/admin'
import FetchError from '@/components/shared/Error'
import Loading from '@/components/shared/Loading'
import AdminContext from '@/stores/admin'
import { INTERNAL_BRANCHES_ROUTE } from '@/lib/constants'
import withAuth from '@/components/shared/auth';

const Branch = () => {
  const router = useRouter()
  const { id } = router.query as { id: string }
  const { fetcher, fetchMeta, currentItem, updater, updateMeta, remover } = useContext(AdminContext);
  const { loading, error } = fetchMeta


  const fetch_data = async () => {
    await fetcher(branchRepository.fetch_branch(id), false)
  }


  const update_partial_item = async (data: any) => {
    await updater(branchRepository.update_partial_branch(id, data), false)

  }

  const delete_item = async () => {
    await remover(branchRepository.delete_branch(id), INTERNAL_BRANCHES_ROUTE)

  }


  useEffect(() => {
    if (id)
      fetch_data()
  }, [id])

  return (
    <Layout>

      {(loading && !error) && <Loading />}
      {(error && !loading) && <FetchError reload={fetch_data} error={error} />}

      {(!loading && currentItem) &&
        <BranchFrom
          branch={currentItem}
          onUpdate={update_partial_item}
          loading={updateMeta.loading}
          onDelete={delete_item}
        />
      }

    </Layout>
  )
}

export default withAuth(Branch)