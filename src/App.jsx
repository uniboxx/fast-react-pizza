import { createBrowserRouter } from 'react-router-dom';

import Home from './ui/Home';
import Menu, { loader as menuLoader } from './features/menu/Menu';
import Cart from './features/cart/Cart';
import CreateOrder from './features/order/CreateOrder';
import Order from './features/order/Order';

import { RouterProvider } from 'react-router-dom';
import AppLayout from './ui/AppLayout';
import Error from './ui/Error';

const router = createBrowserRouter(
  [
    {
      element: <AppLayout />,
      errorElement: <Error />,
      children: [
        {
          path: '/',
          element: <Home />,
        },
        {
          path: '/menu',
          element: <Menu />,
          loader: menuLoader,
          errorElement: <Error />,
        },
        {
          path: '/cart',
          element: <Cart />,
        },
        {
          path: '/order/new',
          element: <CreateOrder />,
        },
        {
          path: '/order/:orderId',
          element: <Order />,
        },
        {
          path: '/order/new',
          element: <CreateOrder />,
        },
      ],
    },
  ],
  { basename: '/fast-react-pizza' }
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
