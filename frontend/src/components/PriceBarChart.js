import React from 'react'
import classes from './PriceBarChart.module.css'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { ThreeDots } from 'react-loader-spinner';


const PriceBarChart = ({ priceRangeData, selectedMonth, showLoader }) => {
    const data = [
        { range: '0-100', items: priceRangeData[0] },
        { range: '101-200', items: priceRangeData[1] },
        { range: '201-300', items: priceRangeData[2] },
        { range: '301-400', items: priceRangeData[3] },
        { range: '401-500', items: priceRangeData[4] },
        { range: '501-600', items: priceRangeData[5] },
        { range: '601-700', items: priceRangeData[6] },
        { range: '701-800', items: priceRangeData[7] },
        { range: '801-900', items: priceRangeData[8] },
        { range: '901 above', items: priceRangeData[9] }
    ]
    return (
        <section className={classes.mainContainer}>
            <h1 className={classes.heading}>Bar Chart Stats {selectedMonth ? `- ${selectedMonth}` : ''}</h1>
            <p className={classes.description}>Number of Items by Price Range</p>
            {showLoader === false ? (
                <div className={classes.chartWrapper}>
                    <ResponsiveContainer width={600} height={400} style={{ padding: '1rem' }} >
                        <BarChart data={data} barCategoryGap={0} >
                            <XAxis
                                dataKey="range"
                                angle={320}
                                tickLine={false}
                                tickMargin={20}
                                height={70}
                                axisLine={{ stroke: '#757c7c', strokeWidth: 0.2 }}
                                padding='no-gap'
                            />
                            <YAxis tickLine={false} axisLine={false} interval={0} />
                            <CartesianGrid vertical={false} stroke="#757c7c" strokeDasharray={'0'} strokeWidth={0.1} strokeOpacity={0.8} />
                            <Bar
                                dataKey="items"
                                radius={[5, 5, 0, 0]}
                                barSize={50}
                                fill={'#6be4e3'}
                            />
                            <Tooltip />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
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

        </section >
    )
}

export default PriceBarChart