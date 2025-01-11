import React from 'react'
import classes from './Statistics.module.css'
import { ThreeDots } from 'react-loader-spinner'

const Statistics = ({ selectedMonth, statisticsData, showLoader }) => {
    const { totalSale, totalSold, totalNotSold } = statisticsData
    return (
        <section className={classes.mainContainer}>
            <h1 className={classes.heading}>Statistics {selectedMonth ? `- ${selectedMonth}` : ''}</h1>
            <table className={classes.statisticsTable}>
                {showLoader === false ? (

                    <tbody>
                        <tr>
                            <td>Total sale</td>
                            <td>{totalSale}</td>
                        </tr>
                        <tr>
                            <td>Total sold item</td>
                            <td>{totalSold}</td>
                        </tr>
                        <tr>
                            <td>Total not sold item</td>
                            <td>{totalNotSold}</td>
                        </tr>
                    </tbody>
                ) : (
                    <tr>
                        <td colSpan={7}>
                            <ThreeDots
                                height="30"
                                width="30"
                                radius="9"
                                color="#000000"
                                ariaLabel="three-dots-loading"
                                wrapperStyle={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: 100,
                                }}
                            />
                        </td>
                    </tr>
                )}
            </table>
        </section>
    )
}

export default Statistics