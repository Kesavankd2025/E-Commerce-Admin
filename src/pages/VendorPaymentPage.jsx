import React from 'react'
import MasterLayout from '../masterLayout/MasterLayout'
// import Breadcrumb from '../components/Breadcrumb'
import VendorPaymentListLayer from '../components/VendorPaymentListLayer'

const VendorPaymentPage = () => {
    return (
        <MasterLayout>
            {/* <Breadcrumb title="Vendor Payment" /> */}
            <VendorPaymentListLayer />
        </MasterLayout>
    )
}

export default VendorPaymentPage
