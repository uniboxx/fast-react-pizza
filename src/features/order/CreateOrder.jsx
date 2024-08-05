/* eslint-disable react/prop-types */
import { Form, redirect } from 'react-router-dom';
import { createOrder } from '../../services/apiRestaurant';
import { useNavigation } from 'react-router-dom';
import { useActionData } from 'react-router-dom';
import Button from '../../ui/Button';
import { useSelector } from 'react-redux';
import { clearCart, getCart, getTotalCartPrice } from '../cart/cartSlice';
import EmptyCart from '../cart/EmptyCart';
import store from '../../store.js';
import { formatCurrency } from '../../utilities/helpers.js';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchAddress } from '../user/userSlice.js';

// https://uibakery.io/regex-library/phone-number
const isValidPhone = str =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str,
  );

// const fakeCart = [
//   {
//     pizzaId: 12,
//     name: 'Mediterranean',
//     quantity: 2,
//     unitPrice: 16,
//     totalPrice: 32,
//   },
//   {
//     pizzaId: 6,
//     name: 'Vegetale',
//     quantity: 1,
//     unitPrice: 13,
//     totalPrice: 13,
//   },
//   {
//     pizzaId: 11,
//     name: 'Spinach and Mushroom',
//     quantity: 1,
//     unitPrice: 15,
//     totalPrice: 15,
//   },
// ];

function CreateOrder() {
  const [withPriority, setWithPriority] = useState(false);
  const {
    username,
    status: addressStatus,
    position,
    address,
    error: errorAddress,
  } = useSelector(state => state.user);

  const isLoadingAddress = addressStatus === 'loading';

  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  const totalCartPrice = useSelector(getTotalCartPrice);
  const priorityPrice = withPriority ? totalCartPrice * 0.2 : 0;
  const totalPrice = totalCartPrice + priorityPrice;

  const formErrors = useActionData();
  const dispatch = useDispatch();

  // const cart = fakeCart;
  const cart = useSelector(getCart);

  if (!cart.length) return <EmptyCart />;

  //- JSX
  return (
    <div className="px-4 py-6">
      <h2 className="mb-8 text-xl font-semibold">
        Ready to order? Let&apos;s go!
      </h2>

      {/* <Form method='POST' action='/order/new'> */}
      <Form method="POST">
        <FormInput
          name="customer"
          labelText="First Name"
          defaultValue={
            username &&
            username[0].toUpperCase() + username.slice(1).toLowerCase()
          }
        />

        <div>
          <FormInput
            name="phone"
            labelText="Phone number"
            defaultValue="12341234"
          >
            {formErrors?.phone && (
              <p className="mt-2 rounded-md bg-red-100 p-2 text-xs text-red-700">
                {formErrors.phone}
              </p>
            )}
          </FormInput>
        </div>

        <FormInput
          name="address"
          labelText="Address"
          defaultValue={address}
          disabled={isLoadingAddress}
        >
          {addressStatus === 'error' && (
            <p className="mt-2 rounded-md bg-red-100 p-2 text-xs text-red-700">
              {errorAddress}
            </p>
          )}

          {!position.latitude && !position.longitude && (
            <span className="absolute right-[3px] top-[3px] z-50 sm:right-[5px] sm:top-[5px]">
              <Button
                disabled={isLoadingAddress}
                type="small"
                onClick={e => {
                  e.preventDefault();
                  dispatch(fetchAddress());
                }}
              >
                Get position
              </Button>
            </span>
          )}
        </FormInput>

        <div className="mb-12 flex items-center gap-5">
          <input
            className="h-6 w-6 accent-yellow-400 focus:outline-none focus:ring focus:ring-yellow-400 focus:ring-offset-2"
            type="checkbox"
            name="priority"
            id="priority"
            value={withPriority}
            onChange={e => setWithPriority(e.target.checked)}
          />
          <label htmlFor="priority">Want to yo give your order priority?</label>
        </div>

        <div>
          <input type="hidden" name="cart" value={JSON.stringify(cart)} />
          <input
            type="hidden"
            name="position"
            value={
              position.latitude && position.longitude
                ? `${position?.latitude}, ${position?.longitude}`
                : ''
            }
          />
          <Button type="primary" disabled={isSubmitting}>
            {isSubmitting || isLoadingAddress
              ? 'Placing order...'
              : `Order now from ${formatCurrency(totalPrice)}`}
          </Button>
        </div>
      </Form>
    </div>
  );
}

export async function action({ request }) {
  const formData = await request.formData();
  // console.log(formData);
  const data = Object.fromEntries(formData);
  // console.log(data);

  const order = {
    ...data,
    cart: JSON.parse(data.cart),
    priority: data.priority === 'true',
  };
  console.log(order);

  const errors = {};
  if (!isValidPhone(order.phone))
    errors.phone =
      'Please give us your correct phone number. We might need it to contact you.';

  if (Object.keys(errors).length > 0) return errors;

  //- if everything is ok, create the new order and redirect

  const newOrder = await createOrder(order);

  //- usare con moderazione - incide sulle prestazioni del componente
  store.dispatch(clearCart());

  return redirect(`/order/${newOrder.id}`);
}

function FormInput({ children, labelText, name, defaultValue, disabled }) {
  return (
    <div className="relative mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
      <label className="sm:basis-40">{labelText}</label>
      <div className="relative grow">
        <input
          className="input"
          type="text"
          name={name}
          required
          defaultValue={defaultValue}
          disabled={disabled}
        />
        {children}
      </div>
    </div>
  );
}

export default CreateOrder;
