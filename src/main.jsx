import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux'
import store from './store/store.js'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { Home, About, Profile, Products, Login, Register, Cart, Orders, AuthLayout, ChoosePaymentGateway, Featured, Loader, PaymentGateway, ViewOrder, ViewProduct } from './components/index'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/about", element: <About /> },
      { path: "/products", element: <Products /> },
      {
        path: "/login",
        element: (
          <AuthLayout authentication={false}>
            <Login />
          </AuthLayout>
        ),
      },
      {
        path: "/signup",
        element: (
          <AuthLayout authentication={false}>
            <Register />
          </AuthLayout>
        ),
      },
      { path: "/cart", element: <Cart /> },
      { path: "/product/:id", element: <ViewProduct /> },
      { path: "/featured", element: <Featured /> },
      { path: "/payment", element: <PaymentGateway /> },
      { path: "/orders", element: <Orders /> },
      { path: "/order/:id", element: <ViewOrder /> },
      { path: "/chooseGateway", element: <ChoosePaymentGateway /> },
      { path: "/loader", element: <Loader /> },
      { path: "/profile", element: <Profile /> }

    ]
  }
])



ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
)
