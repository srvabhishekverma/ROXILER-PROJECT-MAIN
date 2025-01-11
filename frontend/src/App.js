import { useEffect, useState } from 'react';
import classes from './App.module.css';
import { IoIosSearch } from "react-icons/io";
import TransactionsTable from './components/TransactionsTable';
import Statistics from './components/Statistics';
import { getStatistics, getStatisticsPriceRange, getStatisticsUniqueCategory, getTransactions } from './webservices/ApiController';
import PriceBarChart from './components/PriceBarChart';
import { monthsList } from './utilities/Constants';
import StatisticsPieChart from './components/StatisticsPieChart';




function App() {

  const [searchText, setSearchText] = useState('')
  const [selectedMonth, setSelectedMonth] = useState(3) //Default March
  const [pageNum, setPageNum] = useState(1)
  const [hasNextPage, setHasNextPage] = useState(false)
  const [transactions, setTransactions] = useState([])
  const [statisticsData, setStatisticsData] = useState({})
  const [priceRangeData, setPriceRangeData] = useState([])
  const [uniqueCategoryData, setUniqueCategoryData] = useState([])
  const [showLoader1, setShowLoader1] = useState(true)
  const [showLoader2, setShowLoader2] = useState(true)
  const [showLoader3, setShowLoader3] = useState(true)
  const [showLoader4, setShowLoader4] = useState(true)

  useEffect(() => {
    fetchTransactions()
  }, [selectedMonth, pageNum])

  useEffect(() => {
    fetchStatistics()
    fetchPriceRangeStatistics()
    fetchUniqueCategoryStatistics()
  }, [selectedMonth])



  const fetchTransactions = async (searchStringEmpty) => {
    setShowLoader1(true)
    const searchString = searchStringEmpty === true ? '' : searchText
    try {
      const { data, hasNextPage } = await getTransactions(searchString, selectedMonth, pageNum)
      setTransactions(data)
      setHasNextPage(hasNextPage)
    } catch (error) {
      console.log(error.message)
    } finally {
      setShowLoader1(false)
    }
  }

  const fetchStatistics = async () => {
    setShowLoader2(true)
    try {
      const data = await getStatistics(selectedMonth)
      setStatisticsData(data)
    } catch (error) {
      console.log(error.message)
    } finally {
      setShowLoader2(false)
    }
  }

  const fetchPriceRangeStatistics = async () => {
    setShowLoader3(true)
    try {
      const data = await getStatisticsPriceRange(selectedMonth)
      setPriceRangeData(data)
    } catch (error) {
      console.log(error.message)
    } finally {
      setShowLoader3(false)
    }
  }

  const fetchUniqueCategoryStatistics = async () => {
    setShowLoader4(true)
    try {
      const data = await getStatisticsUniqueCategory(selectedMonth)
      setUniqueCategoryData(data)
    } catch (error) {
      console.log(error.message)
    } finally {
      setShowLoader4(false)
    }
  }



  const onSubmitSearch = (e) => {
    e.preventDefault()
    fetchTransactions()
  }

  const onChangeSearchText = (e) => {
    setSearchText(e.target.value)
    if (e.target.value === '') {
      fetchTransactions(true) //searchStringEmpty
    }
  }

  const onChangeMonth = (e) => {
    setSelectedMonth(e.target.value)
    setPageNum(1)
  }

  return (
    <div className={classes.mainContainer}>

      <div className={classes.appHeadingcontainer}>
        <p>Transaction Dashboard</p>
      </div>
      {/* search and Month Selection */}
      <div className={classes.subContainer1} >
        <form className={classes.searchInput} onSubmit={onSubmitSearch}>
          <input
            type='text'
            value={searchText}
            placeholder='Search transaction'
            onChange={onChangeSearchText}
          />
          <button
            type='button'
            onClick={() => fetchTransactions()}
          >
            <IoIosSearch size={'1rem'} className={classes.searchIcon} />
          </button>
        </form>
        <select
          className={classes.monthDropdown}
          id='month'
          name='month'
          value={selectedMonth}
          onChange={onChangeMonth}
        >
          <option key={0} value='' >All</option>
          {
            monthsList.map((each, index) =>
              <option key={each} value={index + 1} >{each}</option>
            )
          }
        </select>
      </div>
      {/* Transactions Table */}
      <TransactionsTable
        transactions={transactions}
        showLoader={showLoader1}
      />

      {/* Pagination */}
      <div className={classes.pageInfoContainer}>
        <p>Page No: {pageNum}</p>
        <div>
          {
            hasNextPage === true &&
            <button
              type='button'
              onClick={() => setPageNum(prev => prev + 1)}
            >
              Next
            </button>
          }
          {hasNextPage && pageNum > 1 && <p>-</p>}
          {
            pageNum > 1 &&
            <button
              type='button'
              onClick={() => setPageNum(prev => prev - 1)}
            >
              Previous
            </button>
          }
        </div>
        <p>Per Page: 10</p>
      </div>

      <Statistics
        selectedMonth={monthsList[selectedMonth - 1]}
        statisticsData={statisticsData}
        showLoader={showLoader2}
      />

      <section className={classes.statisticsContainer}>
        <PriceBarChart
          priceRangeData={priceRangeData}
          selectedMonth={monthsList[selectedMonth - 1]}
          showLoader={showLoader3}
        />
        <StatisticsPieChart
          uniqueCategoryData={uniqueCategoryData}
          selectedMonth={monthsList[selectedMonth - 1]}
          showLoader={showLoader4}
        />
      </section>
    </div>
  );
}

export default App;
