import React from 'react'
import { Pie, PieChart, Tooltip, Cell, ResponsiveContainer, Legend } from 'recharts'
import classes from './StatisticsPieChart.module.css'
import { ThreeDots } from 'react-loader-spinner'

const StatisticsPieChart = ({ uniqueCategoryData, selectedMonth, showLoader }) => {

    const COLORS = ['#6be4e3', '#f8df8c', '#8884d8']
    return (
        <section className={classes.mainContainer}>
            <h1 className={classes.heading}>Pie Chart Stats {selectedMonth ? `- ${selectedMonth}` : ''}</h1>
            <p className={classes.description}>Number of Items in Each Unique Category</p>
            {showLoader === false ? (
                <ResponsiveContainer width='100%' height={400}>
                    <PieChart >
                        <Pie
                            data={uniqueCategoryData}
                            dataKey="itemCount"
                            nameKey="category"
                            cx="50%"
                            scy="50%"
                            outerRadius={80}
                        >
                            {
                                uniqueCategoryData.map((item, index) => (
                                    <Cell key={index} fill={COLORS[index % 3]} />
                                ))
                            }

                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            ) : (
                <ThreeDots
                    height="40"
                    width="40"
                    radius="9"
                    color="#000000"
                    ariaLabel="three-dots-loading"
                    wrapperStyle={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: 400,
                    }}
                />
            )}

        </section>
    )
}

export default StatisticsPieChart