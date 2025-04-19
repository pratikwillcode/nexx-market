import React, { useEffect } from 'react'
// import Container from '../container/Container'
import { useSelector, useDispatch } from 'react-redux'
// import Product from '../Product'
import { BsFillGridFill, BsList } from 'react-icons/bs'
import { NavLink } from 'react-router-dom'
import {Container, Product} from '../index'
import { setProducts as authSetProducts } from '../../store/authSlice'



function Products() {
    const dispatch = useDispatch()
    useEffect(() => {
        try {
          const localProducts = localStorage.getItem('products');
          if (localProducts) {
            dispatch(authSetProducts(JSON.parse(localProducts)));
          } else {
            fetch('https://fake-products.azurewebsites.net/api/Products')
              .then(res => res.json())
              .then(products => {
                if (products) {
                  dispatch(authSetProducts(products));
                  localStorage.setItem('products', JSON.stringify(products));
                }
              });
          }
        } catch (e) {
          console.log(e);
          console.log("Failed to fetch products");
        }
      }, []);
    const productsData = useSelector(state => state.products)
    const [products, setProducts] = React.useState(productsData)
    const [category, setCategory] = React.useState('All')
    const [company, setCompany] = React.useState('All')
    const [color, setColor] = React.useState('All')
    const [price, setPrice] = React.useState(10000000)
    const [search, setSearch] = React.useState('')
    const [sortBy, setSortBy] = React.useState('Name(a-z)')
    const [view, setView] = React.useState('grid')
    const [fiterVisible, setFilterVisible] = React.useState(false)
    


    const categoryList = ['All', 'mobile', 'laptop', 'computer', 'accessories', 'watch']
    const companyList = ['All', 'apple', 'samsung', 'dell', 'nokia', 'asus', 'lenova', 'rolex']
    const colorList = ['#22D3EF', '#000', "#ff0000", "#000000", "#CDD0D0"]
    const sortByList = ['Name(a-z)', 'Name(z-a)', 'Price(L-H)', 'Price(H-L)']

    const clearAllFilters = () => {
        setCategory('All')
        setCompany('All')
        setColor('All')
        setPrice(10000000)
        setSearch('')
    }

    const convertToDecimal = (str) => {
        return "₹" + str.substring(0, str.length - 2) + "." + str.substring(str.length - 2);
    }


    useEffect(() => {
        if (productsData) {
            let tempProducts = productsData
            if (category !== 'All') {
                tempProducts = tempProducts.filter(product => product.category === category)
            }
            if (company !== 'All') {
                tempProducts = tempProducts.filter(product => product.company === company)
            }
            if (color !== 'All') {
                tempProducts = tempProducts.filter(product => product.colors.includes(color))
            }
            tempProducts = tempProducts.filter(product => product.price <= price)
            tempProducts = tempProducts.filter(product => product.name.toLowerCase().includes(search.toLowerCase()))
            tempProducts = tempProducts.sort((a, b) => {
                if (sortBy === 'Price(L-H)') {
                    return a.price - b.price
                }
                if (sortBy === 'Price(H-L)') {
                    return b.price - a.price
                }
                if (sortBy === 'Name(a-z)') {
                    return a.name.localeCompare(b.name)
                }
                if (sortBy === 'Name(z-a)') {
                    return b.name.localeCompare(a.name)
                }
            })
            setProducts(tempProducts)
        }
    }, [category, company, color, price, productsData, search, sortBy])



    return (
        <div>
            <Container>
                <div className='flex justify-between invisible max-sm:visible'><button className='  border-2 border-black p-1 px-2 mb-2' onClick={(e) => setFilterVisible(!fiterVisible)}>Filters</button>
                {fiterVisible && <button className='border-2 border-black p-1 px-2 mb-2' onClick={(e)=>setFilterVisible(false)}>Close Filter</button>}</div>
                {/* <button className=' invisible max-sm:visible border-2 border-black p-1 px-2 mb-2' onClick={(e) => setFilterVisible(!fiterVisible)}>Filters</button> */}
                {products &&
                    <div className='flex flex-col sm:flex-row '>
                        <div className={`${fiterVisible ? 'flex' : 'hidden'} sm:flex flex-col gap-8 px-8  md:w-1/4 md:mr-14`}>
                            <div>
                                <input className='w-full border-2 border-gray-400' type='text' placeholder='SEARCH' onInput={(e) => setSearch(e.target.value)} value={search} />
                            </div>
                            <div>
                                <h2 className='pb-2'>Category</h2>
                                <ul className='cursor-pointer'>
                                    {categoryList.map((item, index) => (
                                        <li key={index} onClick={() => setCategory(item)} className='py-1'>
                                            <h3 className={`${category === item ? ' underline' : ''} capitalize font-extralight`}>{item}</h3>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h2>Company</h2>
                                <select onChange={(e) => setCompany(e.target.value)} className='w-full'>
                                    {companyList.map((item, index) => (
                                        <option key={index} className='capitalize'>{item}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <h2>Colors</h2>
                                <div className='flex gap-2 items-center'>
                                    <h2 onClick={(e) => setColor('All')} className=' cursor-pointer' >All</h2>
                                    <div className='flex gap-1 cursor-pointer'>
                                        {colorList.map((item, index) => (
                                            <div key={index} onClick={() => setColor(item)} style={{ backgroundColor: item }}
                                                className={`p-2 w-2 h-2 rounded-full flex justify-center items-center text-white text-xs`} >{color === item ? '✔'
                                                    : ''}</div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h2>Price</h2>
                                <h3>Value: {convertToDecimal(price.toString())}</h3>
                                <input className='cursor-pointer w-full' type='range' id='price' name='price' min={100000} max={10000000} value={price} onChange={(e) => { setPrice(e.target.value) }} />
                            </div>
                            <div className='mb-4'>
                                <button className=' bg-orange-500 text-white p-1 px-2' onClick={clearAllFilters}>CLEAR FILTERS</button>
                            </div>
                        </div>
                        <div className='w-full'>
                            <div className='flex justify-between mb-4'>
                                <div className='flex gap-2 cursor-pointer'>
                                    <div onClick={(e) => {
                                        setView('grid')
                                    }} className={`p-2 ${view === 'grid' ? 'bg-black text-white' : 'text-black bg-gray-200'}`}>
                                        <BsFillGridFill />
                                    </div>

                                    <div onClick={(e) => {
                                        setView('list')
                                    }} className={`p-2 ${view === 'list' ? 'bg-black text-white' : 'text-black bg-gray-200'}`}>
                                        <BsList className=''
                                        />
                                    </div>
                                </div>
                                <div>
                                    <h3>{products.length} Total Products</h3>
                                </div>
                                <div>
                                    <select onChange={(e) => setSortBy(e.target.value)}>
                                        {sortByList.map((item, index) => (
                                            <option key={index}>{item}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            {view === 'grid' ? <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-8 sm:p-0'>
                                {products.map((product, index) => (
                                    <Product key={index} {...product} />
                                ))}
                            </div> :
                                <div className='flex flex-col gap-3'>
                                    {products.map((product, index) => (
                                        <NavLink to={`/product/${product.id}`} className='grid grid-cols-1 sm:grid-cols-2 border' key={product.name}>
                                            <div className='p-12'>
                                                <img src={product.image} className=' ' />
                                            </div>
                                            <div className='p-4 flex flex-col items-start justify-center'>
                                                <h3 className='pb-2'>{product.name}</h3>
                                                <p className='text-sm'>{convertToDecimal(product.price.toString())}</p>
                                                <p className='text-sm font-extralight line-clamp-4'>{product.description}</p>
                                                <button>READ MORE</button>
                                            </div>
                                        </NavLink>
                                    ))}
                                </div>
                            }
                        </div>
                    </div>}
            </Container>
        </div>
    )
}

export default Products