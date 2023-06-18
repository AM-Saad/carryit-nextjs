import React from 'react'

import Layout from '@/components/layout'
const dashboard = () => {
  return (
    <>
      <Layout meta={
        {
          title: "Dashboard",
          description: "Dashboard",
        }
      }>
        <div>
          <h1>Active Packages</h1>
        </div>

      </Layout>
    </>
  )
}

export default dashboard