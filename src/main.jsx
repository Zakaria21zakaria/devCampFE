import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router/dom";
import { createBrowserRouter } from "react-router";
import ProductCatalogue, {
  loader as ProductCatalogueLoader,
} from "./components/Product/ProductCatalogue.jsx";
import RootLayout from "./routes/rootLayout.jsx";
import ProductDetails, {
  loader as ProductDetailsLoader,
} from "./components/Product/ProductDetails.jsx";
import Login from "./components/UserManagement/Login.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import RequireAuth from "./context/RequireAuth.jsx";
import Account from "./components/UserManagement/Account.jsx";
import Cart from "./components/Cart.jsx";
import KycStart from "./components/KYC/KycStart.jsx";
import ProofOfResidence from "./components/KYC/ProofOfResidence.jsx";
import SelfieUpload from "./components/KYC/SelfieUpload.jsx";
import Register from "./components/UserManagement/Register.jsx";
import { KycProvider } from "./context/KycContext.jsx";
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <ProductCatalogue />,
        loader: ProductCatalogueLoader,
      },
      {
        path: "/product/:id",
        element: <ProductDetails />,
        loader: ProductDetailsLoader,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/account",
        element: (
          <RequireAuth>
            <Account />
          </RequireAuth>
        ),
      },
      {
        path: "/cart",
        element: (
          <RequireAuth>
            <Cart />
          </RequireAuth>
        ),
      },
      {
        path: "/kyc",

        children: [
          {
            index: true,
            element: <KycStart />,
          },
          {
            path: "residence",
            element: <ProofOfResidence />,
          },
          {
            path: "selfie",
            element: <SelfieUpload />,
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <KycProvider>
        <RouterProvider router={router} />
      </KycProvider>
    </AuthProvider>
  </StrictMode>,
);
