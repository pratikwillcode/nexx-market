import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    status: false,
    userData: null,
    products: null,
    cart: [],
    orderDetails: null,
    loader : false
}

const authSlice = createSlice({
    name : 'auth',
    initialState, 
    reducers: {
        login: (state, action) => {
            state.status = true
            state.userData = action.payload
        },
        logout: (state, action) => {
            state.status = false
            state.userData = null
        },
        setProducts: (state, action) => {
            state.products = action.payload
        },
        setCart: (state, action) => {
            state.cart = action.payload
        },
        setOrderDetails: (state, action) => {
            state.orderDetails = action.payload
        },
        setLoader: (state, action) => {
            state.loader = action.payload
        }
    }
})

export const { login, logout, setProducts, setCart, setOrderDetails, setLoader } = authSlice.actions
export default authSlice.reducer