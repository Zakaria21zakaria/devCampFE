import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router/dom";
import { createBrowserRouter } from "react-router";
import ProductCatalogue, {
  loader as ProductCatalogueLoader,
} from "./components/Product/ProductCatalogue.tsx";
import RootLayout from "./routes/RootLayout.tsx";
import ProductDetails, {
  loader as ProductDetailsLoader,
} from "./components/Product/ProductDetails.tsx";
import Login from "./components/UserManagement/Login.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import RequireAuth from "./context/RequireAuth.tsx";
import Account from "./components/UserManagement/Account.tsx";
import Cart from "./components/Cart.tsx";
import KycStart from "./components/KYC/KycStart.tsx";
import ProofOfResidence from "./components/KYC/ProofOfResidence.tsx";
import SelfieUpload from "./components/KYC/SelfieUpload.tsx";
import Register from "./components/UserManagement/Register.tsx";
import { KycProvider } from "./context/KycContext.js";
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

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <KycProvider>
        <RouterProvider router={router} />
      </KycProvider>
    </AuthProvider>
  </StrictMode>,
);
