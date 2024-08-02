import { createBrowserRouter } from 'react-router-dom';

import Home from './ui/Home';
import Menu, { loader as menuLoader } from './features/menu/Menu';
import Cart from './features/cart/Cart';
import CreateOrder from './features/order/CreateOrder';
import Order from './features/order/Order';

import { RouterProvider } from 'react-router-dom';
import AppLayout from './ui/AppLayout';
import Error from './ui/Error';

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <Error />,
    children: [
      {
        path: '/fast-react-pizza',
        element: <Home />,
      },
      {
        path: '/fast-react-pizza/menu',
        element: <Menu />,
        loader: menuLoader,
        errorElement: <Error />,
      },
      {
        path: '/fast-react-pizza/cart',
        element: <Cart />,
      },
      {
        path: '/fast-react-pizza/order/new',
        element: <CreateOrder />,
      },
      {
        path: '/fast-react-pizza/order/:orderId',
        element: <Order />,
      },
      {
        path: '/fast-react-pizza/order/new',
        element: <CreateOrder />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
