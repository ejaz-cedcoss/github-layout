import { BodyLayout, Card, FlexLayout, PageHeader, TextStyles } from '@cedcommerce/ounce-ui'
import React, { FC } from 'react'

const Dashboard:FC = () => {
  return (
    <>
        <BodyLayout>
            <PageHeader title="DASHBOARD SECTION"/>
            <Card>
               <TextStyles>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Cum ut odio voluptas harum cupiditate quaerat aliquam reprehenderit laborum eveniet adipisci minus at totam hic provident, architecto itaque sed aut et.
               </TextStyles>
            </Card>
        </BodyLayout>
    </>
  )
}

export default Dashboard
