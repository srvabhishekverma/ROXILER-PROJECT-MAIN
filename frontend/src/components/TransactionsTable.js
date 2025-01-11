import React from 'react'
import { ThreeDots } from 'react-loader-spinner'
import classes from './TransactionsTable.module.css'

const TransactionsTable = ({ transactions, showLoader }) => {
    return (
        <section className={classes.tableContainer}>
            <table className={[classes.transactionsTable, transactions.length === 0 && classes.noRadius].join(' ')}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Category</th>
                        <th>Sold</th>
                        <th>Image</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        showLoader === false ? (
                            transactions.length > 0 ?
                                transactions.map(row => (
                                    <tr key={row.id}>
                                        <td>{row.id}</td>
                                        <td>{row.title}</td>
                                        <td>{row.description}</td>
                                        <td>{row.price}</td>
                                        <td>{row.category}</td>
                                        <td>{row.sold ? 'Yes' : 'No'}</td>
                                        <td>
                                            <img className={classes.productImage} src={row.image_url} width={'100%'} height={60} />
                                        </td>
                                    </tr>
                                ))
                                :
                                <tr>
                                    <td colSpan={7} className={classes.noDataMessage}>No Data Available</td>
                                </tr>
                        ) : (
                            <tr>
                                <td colSpan={7}>
                                    <ThreeDots
                                        height="40"
                                        width="40"
                                        radius="9"
                                        color="#000000"
                                        ariaLabel="three-dots-loading"
                                        wrapperStyle={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                        }}
                                    />
                                </td>
                            </tr>
                        )
                    }
                </tbody>
            </table>
        </section >
    )
}

export default TransactionsTable